const { app, BrowserWindow, ipcMain, nativeTheme, protocol, shell } = require("electron");
const path = require("node:path");
const fs = require("node:fs");

const projectRoot = path.resolve(__dirname, "..", "..");
const originalResourcesPath = path.resolve(projectRoot, "..", "app.app", "Contents", "Resources");
const originalAsarPath = path.join(originalResourcesPath, "app.asar");
const originalWebviewIndex = path.join(originalAsarPath, "webview", "index.html");
const originalPreload = path.join(originalAsarPath, ".vite", "build", "preload.js");

function assertOriginalApp() {
  if (!fs.existsSync(originalAsarPath)) {
    throw new Error(`Original app.asar not found at ${originalAsarPath}`);
  }
}

function registerAppProtocol() {
  protocol.handle("app", async (request) => {
    const url = new URL(request.url);
    const relativePath = decodeURIComponent(url.pathname.replace(/^\/+/, ""));
    const filePath = path.normalize(path.join(originalResourcesPath, relativePath));

    if (!filePath.startsWith(originalResourcesPath)) {
      return new Response("Forbidden", { status: 403 });
    }

    return fetch(`file://${filePath}`);
  });
}

function registerRendererCompatibilityIpc() {
  const appSessionId = `same-ui-${Date.now().toString(36)}`;
  const sharedObjectSnapshot = {
    host_config: {
      id: "local",
      displayName: "Local",
      kind: "local"
    }
  };

  ipcMain.on("codex_desktop:get-sentry-init-options", (event) => {
    event.returnValue = {
      codexAppSessionId: appSessionId,
      buildInfo: {
        version: "26.601.21317",
        buildNumber: "3511"
      },
      environment: "same-ui-electron",
      enabled: false
    };
  });

  ipcMain.on("codex_desktop:get-build-flavor", (event) => {
    event.returnValue = "prod";
  });

  ipcMain.on("codex_desktop:get-uses-owl-app-shell", (event) => {
    event.returnValue = false;
  });

  ipcMain.on("codex_desktop:get-shared-object-snapshot", (event) => {
    event.returnValue = sharedObjectSnapshot;
  });

  ipcMain.on("codex_desktop:get-system-theme-variant", (event) => {
    event.returnValue = nativeTheme.shouldUseDarkColors ? "dark" : "light";
  });

  ipcMain.handle("codex_desktop:get-fast-mode-rollout-metrics", async () => ({}));
  ipcMain.handle("codex_desktop:message-from-view", async (event, message) => {
    if (message?.type === "shared-object-set") {
      if (message.value === undefined) {
        delete sharedObjectSnapshot[message.key];
      } else {
        sharedObjectSnapshot[message.key] = message.value;
      }
      event.sender.send("codex_desktop:message-for-view", {
        type: "shared-object-updated",
        key: message.key,
        value: message.value
      });
    }

    if (process.env.CODEX_SAME_UI_DEBUG === "1") {
      console.log("[renderer->main]", JSON.stringify(message));
    }

    return {};
  });
  ipcMain.handle("codex_desktop:show-context-menu", async () => ({}));
  ipcMain.handle("codex_desktop:show-application-menu", async () => ({}));
  ipcMain.handle("codex_desktop:trigger-sentry-test", async () => ({}));
}

async function createWindow() {
  assertOriginalApp();
  await app.whenReady();

  registerAppProtocol();
  registerRendererCompatibilityIpc();

  const win = new BrowserWindow({
    width: 1180,
    height: 780,
    minWidth: 860,
    minHeight: 560,
    title: "Codex Same UI",
    backgroundColor: "#00000000",
    trafficLightPosition: { x: 16, y: 16 },
    titleBarStyle: "hiddenInset",
    webPreferences: {
      preload: fs.existsSync(originalPreload) ? originalPreload : undefined,
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      webviewTag: true
    },
    show: false
  });

  win.once("ready-to-show", () => win.show());

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  win.webContents.on("console-message", (_event, level, message, line, sourceId) => {
    console.log(`[renderer:${level}] ${message} (${sourceId}:${line})`);
  });

  win.webContents.on("did-fail-load", (_event, errorCode, errorDescription, validatedURL) => {
    console.error(`[renderer:did-fail-load] ${errorCode} ${errorDescription} ${validatedURL}`);
  });

  win.webContents.session.webRequest.onErrorOccurred((details) => {
    if (details.resourceType === "xhr" || details.resourceType === "fetch" || details.resourceType === "script") {
      console.error(`[renderer:request-error] ${details.error} ${details.method} ${details.url}`);
    }
  });

  await win.loadFile(originalWebviewIndex);
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.whenReady().then(createWindow).catch((error) => {
  console.error(error);
  app.quit();
});
