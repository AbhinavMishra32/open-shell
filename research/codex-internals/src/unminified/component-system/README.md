# Component System Mirror

This folder is for readable source modules that preserve the original Codex UI architecture.

The raw upstream code lives in `../upstream` after running:

```sh
npm run extract:ui
```

Reconstruction order:

1. `shell`: layout, panels, tabs, titlebar, focus areas.
2. `ui-kit`: buttons, dialogs, dropdowns, tooltips, icons, spinners.
3. `composer`: prompt editor, mentions, footer controls.
4. `thread`: conversation list, virtualizer, side panels, bottom panels.
5. `routes`: home, settings, plugins, browser sidebar, artifacts.

The rule is to keep the original boundaries intact while replacing formatted bundle chunks with readable modules.
