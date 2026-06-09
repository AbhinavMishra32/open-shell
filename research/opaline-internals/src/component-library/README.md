# Opaline Component Library

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
- generatedAt: 2026-06-03T07:26:14.252Z
- copiedAssetCount: 579
- exportCatalogAssetCount: 507
- systems: styles, shell, primitives, sidebar, thread, composer, markdown, settings, browserSidebar

Important: this is a literal formatted-bundle extraction, not hand-written clone code. The next layer is alias recovery: use `component-system.json` to map stable wrapper names onto upstream minified export names while preserving the copied implementation.
