# @open-shell/ui

React components for building dense agent-native desktop and web workspaces.

## Install

```sh
npm install @open-shell/ui react react-dom
```

```tsx
import { AppShell, Sidebar, ThreadSurface, Composer } from "@open-shell/ui";
import "@open-shell/ui/styles.css";
```

## Exports

- `AppShell`
- `Sidebar`
- `ThreadSurface`
- `Composer`
- `BottomPanel`
- `TerminalSurface`
- `FileTree`
- `Button`, `IconButton`, `Pill`, `StatusDot`
- `Dialog` and Radix-backed dialog parts
- `DropdownMenu` and Radix-backed menu parts
- `ContextMenu` and Radix-backed context-menu parts
- `FileBrowserPanel`
- `CodexMark`

## Documentation

Run the interactive docs site from the repository root:

```sh
npm run docs:dev
```

The docs app renders live examples from this package, including prop tables, slot notes, and source paths.

## Electron Material Contract

For the translucent sidebar material to work, the Electron host must use a transparent window and the renderer must mark the document:

```ts
document.documentElement.dataset.codexWindowType = "electron";
document.documentElement.dataset.windowType = "electron";
document.documentElement.dataset.codexOs = navigator.platform.toLowerCase().includes("win")
  ? "win32"
  : "darwin";
```

The sidebar then uses:

```css
background: color-mix(in srgb, var(--color-token-editor-background) 55%, transparent);
backdrop-filter: blur(var(--blur-md));
```

## Research Notes

The current ports preserve important upstream contracts:

- `Sidebar` keeps `app-shell-left-panel` and `data-app-action-sidebar-*`.
- `Dialog` is rebuilt on `@radix-ui/react-dialog`.
- `DropdownMenu` is rebuilt on `@radix-ui/react-dropdown-menu`.
- `BottomPanel` is rebuilt on `@radix-ui/react-tabs`.
- `FileTree` keeps `data-file-tree-*` attributes.
