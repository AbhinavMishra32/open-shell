# Changelog

## 0.3.0

- Added the shared `useShellHistory` controller and `ShellHistoryProvider` so app routes, threads, files, settings, and slot tabs can participate in one back/forward system.
- Added reusable settings surfaces: `SettingsSidebar`, `SettingsPanel`, `SettingsSection`, `SettingsCard`, `SettingsRow`, `SettingsToggle`, `SettingsSelect`, and `SettingsOptionCard`.
- Updated `AppShell` to accept a `history` controller and drive Codex-style sidebar chrome back/forward controls from it.
- Updated `SlotPanel` and `BottomPanel` with controlled active-tab APIs, tab lifecycle callbacks, and `keepMounted` behavior so terminals and long-running tools stay alive while switching tabs.
- Updated the Electron example with working thread, file, settings, and bottom-tab history.
- Changed `@open-shell/ui` to build a publishable npm package from `dist` with JS, declarations, and copied CSS assets.

## 0.2.0

- Added the generic `SlotPanel` tab system for any shell slot.
- Added xterm.js-backed `TerminalSurface` support.
- Improved Codex-style tab and bottom-panel shapes.

## 0.1.0

- Initial Open Shell UI package with `AppShell`, `Sidebar`, `Composer`, `BottomPanel`, `FileTree`, `FileBrowserPanel`, thread surfaces, and overlay primitives.
