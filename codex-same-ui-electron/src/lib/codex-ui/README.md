# Codex UI Readable Library

This folder is the readable shared UI library used by `npm run start:library`.

It is rebuilt from the component research and literal upstream extraction in `src/component-library`, but it does not import bundled upstream React components directly. The upstream bundled components carry their own compiled React runtime, so mixing them with this app's React runtime causes a blank renderer.

Use this layer for the copy app:

- `AppShell` for the native Electron-style Codex frame
- `Sidebar` for navigation, project/thread rows, and footer status
- `ThreadSurface` for static conversation/workspace content
- `Composer` for the Codex prompt dock
- `Button`, `IconButton`, `Pill`, and `StatusDot` for shared controls
- `codex-theme.css` for Codex-like tokens and upstream-compatible CSS aliases

Sidebar transparency requirement:

- `src/main/library-main.cjs` enables a transparent Electron window.
- `src/renderer/main.tsx` sets `data-codex-window-type="electron"` and `data-codex-os`.
- `app-shell.css` keeps the main app pane opaque.
- `Sidebar.tsx` marks the sidebar with `app-shell-left-panel`.
- `sidebar.css` mirrors the upstream 55% transparent `color-token-editor-background` rule and edge `:after` extension.

Use `src/component-library` as the literal source/reference catalog:

- `original/assets` contains copied upstream renderer files
- `component-system.json` maps systems, entry files, and export aliases
- `styles/index.js` imports copied upstream global/feature CSS
