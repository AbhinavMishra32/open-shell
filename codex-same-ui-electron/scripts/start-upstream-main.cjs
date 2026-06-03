#!/usr/bin/env node
const { spawn } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "..");
const workspaceRoot = path.resolve(projectRoot, "..");
const originalResourcesPath = path.join(workspaceRoot, "app.app", "Contents", "Resources");
const originalAsarPath = path.join(originalResourcesPath, "app.asar");
const runtimeResourcesPath = path.join(projectRoot, ".runtime", "resources");
const runtimeAsarPath = path.join(runtimeResourcesPath, "app.asar");
const runtimeUnpackedPath = path.join(runtimeResourcesPath, "app.asar.unpacked");

function platformResourceName() {
  if (process.platform === "darwin") return os.arch() === "arm64" ? "mac-arm64" : "mac-x64";
  if (process.platform === "win32") return "win";
  return `${process.platform}-${os.arch()}`;
}

const referenceRebuildRoot = path.resolve(workspaceRoot, "..", "CodexDesktop-Rebuild");
const repairedBetterSqlitePath = path.join(
  referenceRebuildRoot,
  "src",
  platformResourceName(),
  "app.asar.unpacked",
  "node_modules",
  "better-sqlite3",
  "build",
  "Release",
  "better_sqlite3.node"
);
const runtimeBetterSqlitePath = path.join(
  runtimeUnpackedPath,
  "node_modules",
  "better-sqlite3",
  "build",
  "Release",
  "better_sqlite3.node"
);

function requiredPath(label, filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`[codex-ui] Missing ${label}: ${filePath}`);
    process.exit(1);
  }
  return filePath;
}

function copyDirectory(source, target) {
  fs.rmSync(target, { recursive: true, force: true });
  fs.cpSync(source, target, { recursive: true });
}

function sourceIsNewer(source, target) {
  if (!fs.existsSync(target)) return true;
  return fs.statSync(source).mtimeMs > fs.statSync(target).mtimeMs;
}

function ensureRuntimeResources() {
  fs.mkdirSync(runtimeResourcesPath, { recursive: true });

  if (sourceIsNewer(originalAsarPath, runtimeAsarPath)) {
    fs.copyFileSync(originalAsarPath, runtimeAsarPath);
  }

  const originalUnpackedPath = path.join(originalResourcesPath, "app.asar.unpacked");
  if (!fs.existsSync(runtimeUnpackedPath) || sourceIsNewer(originalUnpackedPath, runtimeUnpackedPath)) {
    console.log("[codex-ui] Preparing local runtime app.asar.unpacked copy...");
    copyDirectory(originalUnpackedPath, runtimeUnpackedPath);
  }

  if (fs.existsSync(repairedBetterSqlitePath)) {
    fs.mkdirSync(path.dirname(runtimeBetterSqlitePath), { recursive: true });
    fs.copyFileSync(repairedBetterSqlitePath, runtimeBetterSqlitePath);
    try {
      fs.chmodSync(runtimeBetterSqlitePath, 0o755);
    } catch {}
  } else {
    console.warn(`[codex-ui] Repaired better-sqlite3 binary not found: ${repairedBetterSqlitePath}`);
  }
}

const electronBin = require("electron");
const cliPath = requiredPath("Codex CLI", path.join(originalResourcesPath, process.platform === "win32" ? "codex.exe" : "codex"));
ensureRuntimeResources();
const appEntry = requiredPath("runtime upstream app.asar", runtimeAsarPath);
const nodeReplPath = path.join(originalResourcesPath, "node_repl");
const browserUseNodePath = path.join(originalResourcesPath, "node");

console.log(`[codex-ui] Launching upstream Codex main process`);
console.log(`[codex-ui] App: ${appEntry}`);
console.log(`[codex-ui] CLI: ${cliPath}`);
console.log(`[codex-ui] Resources: ${originalResourcesPath}`);

const child = spawn(electronBin, [appEntry], {
  cwd: projectRoot,
  stdio: "inherit",
  env: {
    ...process.env,
    BUILD_FLAVOR: process.env.BUILD_FLAVOR || "dev",
    CODEX_CLI_PATH: cliPath,
    CODEX_ELECTRON_BUNDLED_PLUGINS_RESOURCES_PATH: originalResourcesPath,
    CODEX_ELECTRON_RESOURCES_PATH: originalResourcesPath,
    CODEX_ELECTRON_RESOURCE_PLATFORM: platformResourceName(),
    CODEX_NODE_REPL_PATH: fs.existsSync(nodeReplPath) ? nodeReplPath : "",
    CODEX_BROWSER_USE_NODE_PATH: fs.existsSync(browserUseNodePath) ? browserUseNodePath : "",
    ELECTRON_RENDERER_URL: process.env.ELECTRON_RENDERER_URL || "app://-/index.html"
  }
});

child.on("close", (code) => {
  process.exit(code ?? 0);
});
