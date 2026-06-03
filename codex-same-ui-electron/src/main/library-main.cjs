const { app, BrowserWindow, nativeTheme, shell } = require("electron");
const path = require("node:path");
const fs = require("node:fs");

const projectRoot = path.resolve(__dirname, "..", "..");
const rendererIndex = path.join(projectRoot, "dist", "renderer", "index.html");
const preload = path.join(projectRoot, "src", "preload", "library-preload.cjs");

function createWindow() {
  const win = new BrowserWindow({
    width: 1180,
    height: 780,
    minWidth: 860,
    minHeight: 560,
    title: "Codex Same UI",
    backgroundColor: nativeTheme.shouldUseDarkColors ? "#181818" : "#ffffff",
    trafficLightPosition: { x: 14, y: 14 },
    titleBarStyle: "hiddenInset",
    webPreferences: {
      preload,
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    },
    show: false
  });

  win.once("ready-to-show", () => win.show());

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  if (!fs.existsSync(rendererIndex)) {
    throw new Error("Renderer build missing. Run npm run build first.");
  }

  win.loadFile(rendererIndex);
}

app.whenReady().then(createWindow).catch((error) => {
  console.error(error);
  app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
