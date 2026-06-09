#!/usr/bin/env node
const asar = require("@electron/asar");
const fs = require("node:fs");
const path = require("node:path");
const prettier = require("prettier");

const projectRoot = path.resolve(__dirname, "..");
const desktopAgentRoot = path.resolve(projectRoot, "..");
const originalAsar = path.join(desktopAgentRoot, "app.app", "Contents", "Resources", "app.asar");
const cacheRoot = path.join(projectRoot, ".upstream-cache", "app-asar");
const outputRoot = path.join(projectRoot, "src", "unminified", "upstream");
const force = process.argv.includes("--force");

const importantPrefixes = [
  "app-",
  "appgen-",
  "appshot",
  "apps-",
  "artifact-",
  "at-mention",
  "automation",
  "avatar",
  "badge",
  "banner",
  "browser-sidebar",
  "browser-use",
  "button-",
  "chat-",
  "checkbox-",
  "composer",
  "connected-apps",
  "context-menu",
  "dialog-layout",
  "diff-",
  "dock-",
  "dropdown",
  "feedback",
  "file-",
  "focus-composer",
  "general-settings",
  "git-",
  "header-",
  "history-",
  "home-",
  "hooks-settings",
  "hotkey-window",
  "inline-mention",
  "local-conversation",
  "markdown",
  "mcp-",
  "modal-",
  "onboarding",
  "plugin",
  "plugins",
  "profile",
  "prompt-editor",
  "remote-",
  "sectioned-page",
  "settings",
  "sidebar",
  "tabs-",
  "thread",
  "toast",
  "tooltip",
  "use-",
  "window-"
];

const explicitFiles = new Set([
  "webview/index.html",
  "webview/assets/index-BvOebZ0M.js",
  "webview/assets/app-main-C3VNTc8v.js",
  "webview/assets/app-main-CYccuswF.css",
  "webview/assets/app-shell-D7yvB1FT.js",
  "webview/assets/app-shell-DJDX7Pvr.css",
  "webview/assets/chunk-Bj-mKKzh.js",
  "webview/assets/src-CYrn1fYL.js",
  "webview/assets/jsx-runtime-CiQ1k8xo.js",
  "webview/assets/react-dom-CvzHKZGB.js"
]);

const relativeImportPattern =
  /(?:import|export)\s*(?:[^'"]*?\s*from\s*)?["'](\.\/[^"']+)["']|import\(["'](\.\/[^"']+)["']\)/g;
const cssUrlPattern = /url\((?:"|')?(\.\/[^"')]+)(?:"|')?\)/g;

function listFiles(root) {
  const results = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(fullPath);
      else results.push(path.relative(root, fullPath));
    }
  };
  walk(root);
  return results;
}

function isSelected(relativePath) {
  if (explicitFiles.has(relativePath)) return true;
  if (!relativePath.startsWith("webview/assets/")) return false;
  const name = path.basename(relativePath);
  return importantPrefixes.some((prefix) => name.startsWith(prefix));
}

function normalizeRelativeDependency(relativePath, specifier) {
  const dependency = path.posix.normalize(
    path.posix.join(path.posix.dirname(relativePath), specifier.replace(/^\.\//, ""))
  );
  return dependency;
}

function discoverDependencyClosure(initialFiles) {
  const selected = new Set(initialFiles);
  const queue = [...initialFiles];

  while (queue.length > 0) {
    const relativePath = queue.shift();
    const sourcePath = path.join(cacheRoot, relativePath);
    if (!fs.existsSync(sourcePath)) continue;

    const ext = path.extname(relativePath);
    if (ext !== ".js" && ext !== ".css") continue;

    const source = fs.readFileSync(sourcePath, "utf8");
    const patterns = ext === ".css" ? [cssUrlPattern] : [relativeImportPattern, cssUrlPattern];
    for (const pattern of patterns) {
      pattern.lastIndex = 0;
      for (const match of source.matchAll(pattern)) {
        const specifier = match[1] || match[2];
        if (!specifier) continue;
        const dependency = normalizeRelativeDependency(relativePath, specifier);
        if (fs.existsSync(path.join(cacheRoot, dependency)) && !selected.has(dependency)) {
          selected.add(dependency);
          queue.push(dependency);
        }
      }
    }
  }

  return [...selected].sort();
}

async function formatText(source, parser) {
  try {
    return await prettier.format(source, { parser, printWidth: 100 });
  } catch (error) {
    return `/* prettier failed: ${error.message} */\n${source}`;
  }
}

async function copyFormatted(relativePath) {
  const sourcePath = path.join(cacheRoot, relativePath);
  const targetPath = path.join(outputRoot, relativePath);
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });

  const ext = path.extname(relativePath);
  const source = fs.readFileSync(sourcePath);

  if (ext === ".js") {
    fs.writeFileSync(targetPath, await formatText(source.toString("utf8"), "babel"));
    return "formatted-js";
  }
  if (ext === ".css") {
    fs.writeFileSync(targetPath, await formatText(source.toString("utf8"), "css"));
    return "formatted-css";
  }
  if (ext === ".html") {
    fs.writeFileSync(targetPath, await formatText(source.toString("utf8"), "html"));
    return "formatted-html";
  }

  fs.copyFileSync(sourcePath, targetPath);
  return "copied";
}

async function main() {
  if (!fs.existsSync(originalAsar)) {
    throw new Error(`Original app.asar not found: ${originalAsar}`);
  }

  if (force) fs.rmSync(cacheRoot, { recursive: true, force: true });
  if (!fs.existsSync(cacheRoot)) {
    fs.mkdirSync(cacheRoot, { recursive: true });
    await asar.extractAll(originalAsar, cacheRoot);
  }

  if (force) fs.rmSync(outputRoot, { recursive: true, force: true });
  fs.mkdirSync(outputRoot, { recursive: true });

  const selected = discoverDependencyClosure(listFiles(cacheRoot).filter(isSelected).sort());
  const manifest = [];

  for (const relativePath of selected) {
    const mode = await copyFormatted(relativePath);
    manifest.push({ path: relativePath, mode });
  }

  fs.writeFileSync(
    path.join(outputRoot, "manifest.json"),
    `${JSON.stringify({ generatedAt: new Date().toISOString(), originalAsar, files: manifest }, null, 2)}\n`
  );

  console.log(`Extracted ${manifest.length} renderer files into ${outputRoot}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
