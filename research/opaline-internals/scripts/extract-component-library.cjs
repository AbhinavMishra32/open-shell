#!/usr/bin/env node
const fs = require("node:fs");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "..");
const upstreamRoot = path.join(projectRoot, "src", "unminified", "upstream", "webview", "assets");
const libraryRoot = path.join(projectRoot, "src", "component-library");
const originalAssetsRoot = path.join(libraryRoot, "original", "assets");

const systems = {
  styles: [
    "app-main-CYccuswF.css",
    "app-shell-DJDX7Pvr.css",
    "composer-CmqBNpOg.css",
    "composer-footer-BmInDjPq.css",
    "composer-top-menu-chrome-EBEHrbNH.css",
    "prompt-editor-BuS6Xjko.css",
    "local-conversation-thread-B44VLaLQ.css",
    "at-mention-list-acW2mHgN.css",
    "browser-sidebar-comment-light-dismiss-CYswclfQ.css",
    "diff-unified-D4NO3G6Q.css"
  ],
  shell: [
    "app-shell-D7yvB1FT.js",
    "app-shell-DJDX7Pvr.css",
    "app-shell-bottom-panel-scroll-sync-DpO90Rtb.js",
    "app-shell-state-B5MFb4Nm.js",
    "app-shell-tab-controller-B0DXekEJ.js",
    "app-window-wJqe84fR.js",
    "thread-app-shell-chrome-BjerXYKb.js",
    "thread-app-shell-chrome-COp6s10f.js"
  ],
  primitives: [
    "button-Xd4Hy1MO.js",
    "checkbox-Bz6PC7ig.js",
    "context-menu-DRia187f.js",
    "dialog-layout-CCvvb1Vc.js",
    "dialog-layout-sS9Dm_y9.css",
    "dropdown-CHaZfyxI.js",
    "dropdown-9F1MU8ql.css",
    "tabs-ji6s-l3m.js",
    "toast-signal-By11REe1.js",
    "tooltip-BhXPONlb.js",
    "tooltip-dismiss-1FVw8OQP.js"
  ],
  sidebar: [
    "sidebar-signals-B0JkGccK.js",
    "sidebar-project-groups-DkFEKpNF.js",
    "sidebar-project-group-signals-h0Ffvrar.js",
    "sidebar-thread-list-signals-B88Sg0Wa.js",
    "sidebar-task-pr-chip-signals-B_U8b94R.js",
    "dock-XFXqsb8h.js",
    "history-TBKhiAS8.js"
  ],
  thread: [
    "thread-layout-Dkr9s56u.js",
    "thread-scroll-layout-CaagbXVM.js",
    "thread-virtualizer-9COdWn5E.js",
    "thread-page-header-C6IOSyDb.js",
    "thread-page-bottom-panel-state-TF1g3u_g.js",
    "thread-panel-state-CYOPuORF.js",
    "thread-side-panel-tabs-BiJ44OOM.js",
    "thread-side-panel-tabs-CHBOpLXU.js",
    "local-conversation-thread-CRSaT3IN.js",
    "local-conversation-thread-B44VLaLQ.css"
  ],
  composer: [
    "composer-CUO1FiyC.js",
    "composer-CmqBNpOg.css",
    "composer-footer-CY-87K58.js",
    "composer-footer-BmInDjPq.css",
    "composer-external-footer-DUWRQbuZ.js",
    "composer-footer-branch-switcher-r30ZpEaG.js",
    "composer-top-menu-chrome-4snk27KP.js",
    "composer-top-menu-chrome-EBEHrbNH.css",
    "composer-view-state-MMPs5p5E.js",
    "prompt-editor-DSJXB4gM.js",
    "prompt-editor-BuS6Xjko.css",
    "focus-composer-Ddi8tz3g.js",
    "at-mention-list-BcS9-UNX.js",
    "at-mention-list-CDZ8CUgv.js",
    "at-mention-list-acW2mHgN.css",
    "use-composer-controller-EmBnHezU.js"
  ],
  markdown: [
    "markdown-CHFpyp1o.js",
    "markdown-CrzXVJOX.js",
    "markdown-fw3eJobG.js",
    "markdown-surface-DsmgfpJy.js",
    "inline-mentions-HEbHrk4s.js",
    "inline-mentions-DQmOb30B.css",
    "inline-mention-style-CHAdZkbq.js",
    "diff-unified-BT9wY89m.js",
    "diff-unified-D4NO3G6Q.css"
  ],
  settings: [
    "settings-page-qEZ4h3P3.js",
    "settings-content-layout-sdUwAG0A.js",
    "settings-group-BO3RZzLk.js",
    "settings-row-DOKTjAF6.js",
    "settings-sections-BUO2MNq2.js",
    "settings-shared-BibDzP9i.js",
    "general-settings-DobuGNrH.js",
    "general-settings-mIQGMvCv.js",
    "plugins-settings-IHczu4th.js"
  ],
  browserSidebar: [
    "browser-sidebar-manager-CDP80WMh.js",
    "browser-sidebar-webview-D1L6cqaW.js",
    "browser-sidebar-retained-webview-DS1n6LTx.js",
    "browser-sidebar-state-CjNKE43Q.js",
    "browser-sidebar-availability-BQYQqnR4.js",
    "browser-sidebar-comment-light-dismiss-DC1fddSh.js",
    "browser-sidebar-comment-light-dismiss-CYswclfQ.css",
    "browser-use-B6ZJM-x3.js",
    "browser-use-origin-state-queries-BnMJOXVT.js"
  ]
};

const importPattern = /(?:import|export)\s*(?:[^'"]*?\s*from\s*)?["'](\.\/[^"']+)["']|import\(["'](\.\/[^"']+)["']\)/g;
const exportBlockPattern = /export\s*\{([\s\S]*?)\};/g;
const cssUrlPattern = /url\((?:"|')?(\.\/[^"')]+)(?:"|')?\)/g;

function assertUpstream() {
  if (!fs.existsSync(upstreamRoot)) {
    throw new Error(`Upstream assets not found at ${upstreamRoot}. Run npm run refresh:ui first.`);
  }
}

function normalizeAssetName(specifier) {
  return specifier.replace(/^\.\//, "");
}

function discoverDependencies(entryFiles) {
  const visited = new Set();
  const queue = entryFiles.filter((file) => {
    const exists = fs.existsSync(path.join(upstreamRoot, file));
    if (!exists) console.warn(`[component-library] missing upstream entrypoint: ${file}`);
    return exists;
  });

  while (queue.length > 0) {
    const file = queue.shift();
    if (visited.has(file)) continue;
    visited.add(file);

    const sourcePath = path.join(upstreamRoot, file);
    if (!fs.existsSync(sourcePath)) continue;

    if (!/\.(js|mjs|css)$/.test(file)) continue;
    const source = fs.readFileSync(sourcePath, "utf8");

    const patterns = file.endsWith(".css") ? [cssUrlPattern] : [importPattern, cssUrlPattern];
    for (const pattern of patterns) {
      pattern.lastIndex = 0;
      for (const match of source.matchAll(pattern)) {
        const specifier = match[1] || match[2];
        if (!specifier) continue;
        const dependency = normalizeAssetName(specifier);
        if (fs.existsSync(path.join(upstreamRoot, dependency)) && !visited.has(dependency)) {
          queue.push(dependency);
        }
      }
    }
  }

  return visited;
}

function copyAsset(file) {
  const sourcePath = path.join(upstreamRoot, file);
  const targetPath = path.join(originalAssetsRoot, file);
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.copyFileSync(sourcePath, targetPath);
}

function parseExportAliases(file) {
  const sourcePath = path.join(upstreamRoot, file);
  if (!fs.existsSync(sourcePath) || !file.endsWith(".js")) return [];

  const source = fs.readFileSync(sourcePath, "utf8");
  const aliases = [];
  for (const block of source.matchAll(exportBlockPattern)) {
    for (const rawSegment of block[1].split(",")) {
      const segment = rawSegment.trim();
      if (!segment) continue;
      const aliasMatch = segment.match(/^([\w$]+)\s+as\s+([\w$]+)$/);
      if (aliasMatch) {
        aliases.push({ local: aliasMatch[1], exported: aliasMatch[2] });
        continue;
      }
      const bareMatch = segment.match(/^([\w$]+)$/);
      if (bareMatch) {
        aliases.push({ local: bareMatch[1], exported: bareMatch[1] });
      }
    }
  }

  return aliases;
}

function buildExportCatalog(allAssets) {
  const catalog = {};
  for (const asset of [...allAssets].sort()) {
    const aliases = parseExportAliases(asset);
    if (aliases.length > 0) catalog[asset] = aliases;
  }
  return catalog;
}

function writeFile(relativePath, content) {
  const targetPath = path.join(libraryRoot, relativePath);
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.writeFileSync(targetPath, content);
}

function writeSystemWrappers() {
  writeFile(
    "styles/index.js",
    [
      `import "../original/assets/app-main-CYccuswF.css";`,
      `import "../original/assets/app-shell-DJDX7Pvr.css";`,
      `import "../original/assets/composer-CmqBNpOg.css";`,
      `import "../original/assets/composer-footer-BmInDjPq.css";`,
      `import "../original/assets/composer-top-menu-chrome-EBEHrbNH.css";`,
      `import "../original/assets/prompt-editor-BuS6Xjko.css";`,
      `import "../original/assets/local-conversation-thread-B44VLaLQ.css";`,
      `import "../original/assets/at-mention-list-acW2mHgN.css";`,
      `import "../original/assets/browser-sidebar-comment-light-dismiss-CYswclfQ.css";`,
      `import "../original/assets/diff-unified-D4NO3G6Q.css";`,
      ""
    ].join("\n")
  );

  writeFile(
    "shell/index.js",
    [
      `import "../original/assets/app-shell-DJDX7Pvr.css";`,
      `export * from "../original/assets/app-shell-D7yvB1FT.js";`,
      `export { t as AppShell } from "../original/assets/app-shell-D7yvB1FT.js";`,
      `export * from "../original/assets/app-shell-state-B5MFb4Nm.js";`,
      ""
    ].join("\n")
  );

  writeFile(
    "primitives/button.js",
    [
      `export * from "../original/assets/button-Xd4Hy1MO.js";`,
      `export { t as Button, n as buttonClassNames } from "../original/assets/button-Xd4Hy1MO.js";`,
      ""
    ].join("\n")
  );

  writeFile(
    "primitives/index.js",
    [
      `export * from "./button.js";`,
      `export * from "../original/assets/checkbox-Bz6PC7ig.js";`,
      `export * from "../original/assets/dialog-layout-CCvvb1Vc.js";`,
      `export * from "../original/assets/dropdown-CHaZfyxI.js";`,
      `export * from "../original/assets/tabs-ji6s-l3m.js";`,
      `export * from "../original/assets/tooltip-BhXPONlb.js";`,
      ""
    ].join("\n")
  );

  writeFile("sidebar/index.js", `export * from "../original/assets/sidebar-signals-B0JkGccK.js";\n`);
  writeFile(
    "thread/index.js",
    [
      `import "../original/assets/local-conversation-thread-B44VLaLQ.css";`,
      `export * from "../original/assets/thread-layout-Dkr9s56u.js";`,
      `export * from "../original/assets/thread-scroll-layout-CaagbXVM.js";`,
      `export * from "../original/assets/thread-page-header-C6IOSyDb.js";`,
      `export * from "../original/assets/local-conversation-thread-CRSaT3IN.js";`,
      ""
    ].join("\n")
  );
  writeFile(
    "composer/index.js",
    [
      `import "../original/assets/composer-CmqBNpOg.css";`,
      `import "../original/assets/composer-footer-BmInDjPq.css";`,
      `import "../original/assets/composer-top-menu-chrome-EBEHrbNH.css";`,
      `import "../original/assets/prompt-editor-BuS6Xjko.css";`,
      `export * from "../original/assets/composer-CUO1FiyC.js";`,
      `export * from "../original/assets/composer-view-state-MMPs5p5E.js";`,
      ""
    ].join("\n")
  );
  writeFile("markdown/index.js", `export * from "../original/assets/markdown-surface-DsmgfpJy.js";\n`);
  writeFile("settings/index.js", `export * from "../original/assets/settings-page-qEZ4h3P3.js";\n`);
  writeFile("browser-sidebar/index.js", `export * from "../original/assets/browser-sidebar-manager-CDP80WMh.js";\n`);

  writeFile(
    "index.js",
    [
      `export * as Shell from "./shell/index.js";`,
      `export * as Styles from "./styles/index.js";`,
      `export * as Primitives from "./primitives/index.js";`,
      `export * as Sidebar from "./sidebar/index.js";`,
      `export * as Thread from "./thread/index.js";`,
      `export * as Composer from "./composer/index.js";`,
      `export * as Markdown from "./markdown/index.js";`,
      `export * as Settings from "./settings/index.js";`,
      `export * as BrowserSidebar from "./browser-sidebar/index.js";`,
      ""
    ].join("\n")
  );

  writeFile(
    "package.json",
    JSON.stringify(
      {
        name: "@opaline-ui/component-library",
        private: true,
        type: "module",
        sideEffects: ["**/*.css"],
        exports: {
          ".": "./index.js",
          "./styles": "./styles/index.js",
          "./shell": "./shell/index.js",
          "./primitives": "./primitives/index.js",
          "./primitives/button": "./primitives/button.js",
          "./sidebar": "./sidebar/index.js",
          "./thread": "./thread/index.js",
          "./composer": "./composer/index.js",
          "./markdown": "./markdown/index.js",
          "./settings": "./settings/index.js",
          "./browser-sidebar": "./browser-sidebar/index.js",
          "./manifest": "./manifest.json",
          "./catalog": "./component-system.json",
          "./original/*": "./original/*"
        }
      },
      null,
      2
    ) + "\n"
  );
}

function writeReadme(manifest) {
  writeFile(
    "README.md",
    [
      "# Opaline Component Library",
      "",
      "This folder is the literal-code component-library extraction layer.",
      "",
      "The code under `original/assets` is copied from the formatted upstream renderer mirror. It preserves the upstream bundled module graph, including relative chunk imports, so the copied modules can be studied and wrapped without breaking dependency resolution.",
      "",
      "System wrappers live beside it:",
      "- `shell/index.js` for app shell exports",
      "- `primitives/index.js` for buttons, dialogs, dropdowns, tooltip, checkbox",
      "- `sidebar/index.js` for sidebar signals/components",
      "- `thread/index.js` for thread layout surfaces",
      "- `composer/index.js` for composer/editor modules and CSS",
      "- `markdown/index.js` for markdown/rich text surfaces",
      "- `settings/index.js` for settings-page modules",
      "- `browser-sidebar/index.js` for browser sidebar modules",
      "",
      "Regenerate with:",
      "",
      "```sh",
      "npm run extract:components",
      "```",
      "",
      "Current extraction summary:",
      `- generatedAt: ${manifest.generatedAt}`,
      `- copiedAssetCount: ${manifest.copiedAssetCount}`,
      `- exportCatalogAssetCount: ${Object.keys(manifest.exportCatalog).length}`,
      `- systems: ${Object.keys(manifest.systems).join(", ")}`,
      "",
      "Important: this is a literal formatted-bundle extraction, not hand-written clone code. The next layer is alias recovery: use `component-system.json` to map stable wrapper names onto upstream minified export names while preserving the copied implementation.",
      ""
    ].join("\n")
  );
}

function writeComponentSystem(manifest) {
  const systemRecords = Object.fromEntries(
    Object.entries(manifest.systems).map(([name, system]) => [
      name,
      {
        wrapper: `./${name === "browserSidebar" ? "browser-sidebar" : name}/index.js`,
        entries: system.entries,
        copiedAssets: system.assetCount,
        jsAssetsWithExports: system.assets.filter((asset) => manifest.exportCatalog[asset])
      }
    ])
  );

  writeFile(
    "component-system.json",
    JSON.stringify(
      {
        generatedAt: manifest.generatedAt,
        source: {
          kind: "formatted-upstream-renderer-assets",
          root: manifest.upstreamRoot,
          copiedRoot: "./original/assets"
        },
        systems: systemRecords,
        exports: manifest.exportCatalog
      },
      null,
      2
    ) + "\n"
  );

  const lines = [
    "# Opaline UI Component System",
    "",
    "This is the working knowledge base for copying Opaline UI into another Electron app with the same component code.",
    "",
    "Source of truth:",
      "- `original/assets` contains literal copied upstream renderer modules",
      "- `styles/index.js` loads Opaline global renderer CSS and feature CSS",
      "- `component-system.json` records every copied system, source entrypoint, and detected export alias",
    "- system wrapper folders provide stable import points for a new Electron renderer",
    "",
    "Recommended import surface:",
    "- `@opaline-ui/component-library/shell` for app shell and window chrome",
    "- `@opaline-ui/component-library/styles` for global tokens and feature CSS",
    "- `@opaline-ui/component-library/primitives` for shared controls",
    "- `@opaline-ui/component-library/sidebar` for sidebar state/components",
    "- `@opaline-ui/component-library/thread` for thread layout and conversation surfaces",
    "- `@opaline-ui/component-library/composer` for prompt/editor/composer surfaces",
    "- `@opaline-ui/component-library/markdown` for markdown rendering surfaces",
    "- `@opaline-ui/component-library/settings` for settings pages",
    "- `@opaline-ui/component-library/browser-sidebar` for retained browser/sidebar surfaces",
    "",
    "Copy strategy:",
    "- Keep original modules unchanged under `original/assets`",
    "- Add readable wrappers only outside `original/assets`",
    "- Recover minified aliases progressively by reading exports from `component-system.json`",
    "- Build the new app renderer against the wrappers, not against handmade approximation components",
    "",
    "Systems:",
    ""
  ];

  for (const [name, record] of Object.entries(systemRecords)) {
    lines.push(`## ${name}`);
    lines.push(`- wrapper: ${record.wrapper}`);
    lines.push(`- copiedAssets: ${record.copiedAssets}`);
    lines.push(`- entries: ${record.entries.join(", ")}`);
    lines.push(`- exportedModules: ${record.jsAssetsWithExports.length}`);
    lines.push("");
  }

  writeFile("COMPONENT_SYSTEM.md", `${lines.join("\n")}\n`);
}

function main() {
  assertUpstream();

  fs.rmSync(libraryRoot, { recursive: true, force: true });
  fs.mkdirSync(originalAssetsRoot, { recursive: true });

  const systemClosures = {};
  const allAssets = new Set();

  for (const [systemName, entries] of Object.entries(systems)) {
    const closure = discoverDependencies(entries);
    systemClosures[systemName] = {
      entries,
      assetCount: closure.size,
      assets: [...closure].sort()
    };
    for (const asset of closure) allAssets.add(asset);
  }

  for (const asset of [...allAssets].sort()) copyAsset(asset);

  const exportCatalog = buildExportCatalog(allAssets);
  const manifest = {
    generatedAt: new Date().toISOString(),
    upstreamRoot,
    copiedAssetCount: allAssets.size,
    systems: systemClosures,
    exportCatalog
  };

  writeFile("manifest.json", `${JSON.stringify(manifest, null, 2)}\n`);
  writeSystemWrappers();
  writeComponentSystem(manifest);
  writeReadme(manifest);

  console.log(
    `Extracted ${allAssets.size} literal upstream assets into ${path.relative(projectRoot, libraryRoot)}`
  );
}

main();
