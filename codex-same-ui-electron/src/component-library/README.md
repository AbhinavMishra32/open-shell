# Codex Component Library

This folder is the literal-code component-library extraction layer.

The code under `original/assets` is copied from the formatted upstream renderer mirror. It preserves the upstream bundled module graph, including relative chunk imports, so the copied modules can be studied and wrapped without breaking dependency resolution.

System wrappers live beside it:
- `shell/index.js` for app shell exports
- `primitives/index.js` for buttons, dialogs, dropdowns, tooltip, checkbox
- `sidebar/index.js` for sidebar signals/components
- `thread/index.js` for thread layout surfaces
- `composer/index.js` for composer/editor modules and CSS
- `markdown/index.js` for markdown/rich text surfaces
- `settings/index.js` for settings-page modules
- `browser-sidebar/index.js` for browser sidebar modules

Regenerate with:

```sh
npm run extract:components
```

Current extraction summary:
- generatedAt: 2026-06-03T07:15:48.220Z
- copiedAssetCount: 231
- systems: shell, primitives, sidebar, thread, composer, markdown, settings, browserSidebar
