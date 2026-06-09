# @opaline/ui

React components for building dense agent-native desktop and web workspaces.

## Install

```sh
npm install @opaline/ui react react-dom
```

```tsx
import { AppShell, Sidebar, ThreadSurface, Composer, useShellHistory } from "@opaline/ui";
import "@opaline/ui/styles.css";
```

## Exports

- `AppShell`
- `useShellHistory`, `ShellHistoryProvider`
- `Sidebar`
- `SettingsSidebar`, `SettingsPanel`, `SettingsSection`, `SettingsCard`, `SettingsRow`, `SettingsToggle`, `SettingsSelect`, `SettingsOptionCard`
- `ThreadSurface`
- `Composer`
- `SlotPanel`
- `BottomPanel`
- `TerminalSurface`
- `FileTree`
- `Button`, `IconButton`, `Pill`, `StatusDot`
- `Dialog` and Radix-backed dialog parts
- `DropdownMenu` and Radix-backed menu parts
- `ContextMenu` and Radix-backed context-menu parts
- `FileBrowserPanel`
- `OpalineMark`

## History API

`AppShell` can consume a shared history controller. Use it when threads, files, settings pages, and slot tabs should share one back/forward stack:

```tsx
const history = useShellHistory([
  { id: "thread:home", type: "thread", title: "Home", payload: { threadId: "home" } },
]);

<AppShell
  history={history}
  sidebar={<Sidebar projects={projects} />}
  main={<CurrentSurface entry={history.current} />}
/>;
```

Any app surface can push entries:

```tsx
history.push({
  id: "file:package.json",
  type: "file",
  title: "package.json",
  payload: { path: "package.json" },
});
```

## Settings API

Use the settings primitives to build a Opaline-style settings route without custom layout work:

```tsx
<SettingsSidebar
  activeItemId="general"
  sections={sections}
  onItemSelect={(item) => history.push({ id: `settings:${item.id}`, type: "settings" })}
/>

<SettingsPanel title="General">
  <SettingsSection title="Permissions">
    <SettingsCard>
      <SettingsRow title="Auto-review" control={<SettingsToggle checked={enabled} />} />
    </SettingsCard>
  </SettingsSection>
</SettingsPanel>
```

## Documentation

Run the interactive docs site from the repository root:

```sh
npm run docs:dev
```

The docs app renders live examples from this package, including prop tables, slot notes, and source paths.

## Electron Material Contract

For the translucent sidebar material to work, the Electron host must use a transparent window and the renderer must mark the document:

```ts
document.documentElement.dataset.opalineWindowType = "electron";
document.documentElement.dataset.windowType = "electron";
document.documentElement.dataset.opalineOs = navigator.platform.toLowerCase().includes("win")
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
- `BottomPanel` is rebuilt on `@radix-ui/react-tabs` and keeps inactive tab content mounted by default.
- `FileTree` keeps `data-file-tree-*` attributes.
