# Opaline UI Inventory

Living research file for rebuilding the Opaline Electron UI in another app.

Source basis:
- Packaged app extracted from `app.asar`
- Renderer entry: `webview/index.html`
- Main UI bundle: `webview/assets/app-main-C3VNTc8v.js`
- Shell bundle: `webview/assets/app-shell-D7yvB1FT.js`
- Side-by-side app: `opaline-same-ui-electron`

Notes:
- This file is meant to be edited repeatedly as we discover more component boundaries.
- I am keeping names close to the compiled bundle names for now so we can trace them back quickly.
- Confidence labels:
  - `high`: direct bundle or file evidence
  - `medium`: strong inference from chunk naming and imports
  - `low`: placeholder until we inspect the chunk

## 1. App Shell And Layout

| Area | UI piece | Bundle / file | Confidence | Notes |
| --- | --- | --- | --- | --- |
| Startup | Splash / loading screen | `webview/index.html` | high | Inline startup loader with Opaline logo shimmer. |
| Shell | Root shell layout | `webview/assets/app-shell-D7yvB1FT.js` | high | Exports `Root`, `LeftPanel`, `Content`, `Header`, `RightPanel`, `BottomPanel` primitives. |
| Shell | Shell CSS | `webview/assets/app-shell-DJDX7Pvr.css` | high | Global layout tokens, tab styles, panel sizing, theme variables. |
| Shell | Main content frame | `webview/assets/app-shell-D7yvB1FT.js` | high | Handles left panel, main area, right panel, bottom panel, and tab strip. |
| Shell | Tab controller | `webview/assets/app-shell-tab-controller-B0DXekEJ.js` | high | Tab strip behavior and drag/drop ordering. |
| Shell | Bottom panel scroll sync | `webview/assets/app-shell-bottom-panel-scroll-sync-DpO90Rtb.js` | medium | Used by shell to keep lower panel in sync. |
| Shell | App window wrapper | `webview/assets/app-window-wJqe84fR.js` | medium | Likely window chrome or route-level window bootstrap. |

## 2. Main Renderer Entry

| Area | UI piece | Bundle / file | Confidence | Notes |
| --- | --- | --- | --- | --- |
| Rebuild app | Exact renderer wrapper | `opaline-same-ui-electron/src/main/exact-upstream-main.cjs` | high | Loads original `app.asar` renderer in a separate Electron app. |
| Rebuild app | Reconstructed renderer wrapper | `opaline-same-ui-electron/src/main/library-main.cjs` | high | Loads the readable component-system renderer from `dist/renderer`. |
| Rebuild app | Main-mode selector | `opaline-same-ui-electron/src/main/main.cjs` | high | Normal mode runs reconstructed UI; `OPALINE_SAME_UI_EXACT=1` runs exact upstream reference. |
| Rebuild app | Readable shared UI root | `opaline-same-ui-electron/src/lib/opaline-ui` | high | Stripped shared UI library used by the non-agent Opaline copy app. |
| Rebuild app | Literal component-library root | `opaline-same-ui-electron/src/component-library` | high | Generated library closure containing literal upstream modules plus system wrappers. |
| Rebuild app | Component-library extractor | `opaline-same-ui-electron/scripts/extract-component-library.cjs` | high | Copies dependency closures from the upstream mirror into `src/component-library`. |
| Rebuild app | Component-library catalog | `opaline-same-ui-electron/src/component-library/component-system.json` | high | Generated data catalog with copied systems, wrappers, entry files, closure sizes, and detected export aliases. |
| Rebuild app | Component-library styles surface | `opaline-same-ui-electron/src/component-library/styles/index.js` | high | Imports copied upstream global renderer CSS and feature CSS for new app reuse. |
| Rebuild app | Non-agent copy renderer | `opaline-same-ui-electron/src/renderer` | high | Thin app consuming `src/lib/opaline-ui` and copied upstream global styles. |
| Rebuild app | Unminified upstream mirror | `opaline-same-ui-electron/src/unminified/upstream` | high | Dependency-aware formatted copies of original renderer/component chunks. |
| Rebuild app | Extraction script | `opaline-same-ui-electron/scripts/extract-upstream-renderer.cjs` | high | Rebuilds formatted upstream mirror from original `app.asar`, including JS imports and CSS url dependencies. |
| Rebuild app | Sidebar app-action attributes | `opaline-same-ui-electron/src/lib/opaline-ui/sidebar/appActionAttributes.ts` | high | Readable mirror of upstream `data-app-action-sidebar-*` names from `window-app-action-helpers-u9SI1RSH.js`. |
| Rebuild app | Readable dialog primitive | `opaline-same-ui-electron/src/lib/opaline-ui/primitives/Dialog.tsx` | high | Radix-backed readable port of `dialog-layout-CCvvb1Vc.js`, including overlay, sizes, close button, and measured-height transition. |
| Rebuild app | Readable bottom panel | `opaline-same-ui-electron/src/lib/opaline-ui/bottom-panel/BottomPanel.tsx` | high | Radix Tabs-backed port of the app-shell bottom panel slot with upstream height clamp constants and terminal surface. |
| Rebuild app | Readable file tree | `opaline-same-ui-electron/src/lib/opaline-ui/file-tree/FileTree.tsx` | high | Readable DOM/CSS port of the upstream `file-tree-search-input-DWq_lg9v.js` data-attribute contract and core icon sprite. |
| Opaline package | App shell and topbar | `packages/ui/src/app-shell/AppShell.tsx` | high | Readable package port of app-shell tab controller/header slots from `app-shell-D7yvB1FT.js`; active tab now owns the thread `Chat actions` menu from `local-conversation-thread-CRSaT3IN.js`. |
| Opaline package | File browser right panel | `packages/ui/src/file-browser/FileBrowserPanel.tsx` | high | Right-panel file browser shell using the shared `FileTree`, based on `RightPanelOutlet`/`RightPanelTabs` in `thread-app-shell-chrome-BjerXYKb.js` and file search from `file-tree-search-input-DWq_lg9v.js`. |
| Opaline package | File tree | `packages/ui/src/file-tree/FileTree.tsx` | high | Current package version keeps Opaline tree data attributes, selected rows, git/action lanes, `Filter files…` search wrapper, and core icon sprite. |
| Opaline package | Chat thread surface | `packages/ui/src/thread/ThreadSurface.tsx` | high | Conversation surface moved closer to local-thread layout: assistant activity rows, right-aligned user bubble, and edited-files review card. |
| Renderer | Main app entry | `webview/assets/app-main-C3VNTc8v.js` | high | Imports most feature chunks and route modules. |
| Renderer | Preloader | `webview/assets/app-preloader-DxFriehz.js` | medium | Likely startup state and bundle prefetch setup. |
| Renderer | App session state | `webview/assets/app-session-D2rQeKGg.js` | medium | Session-level renderer state. |
| Renderer | App state core | `webview/assets/app-shell-state-B5MFb4Nm.js` | high | Shared signals/state used by shell and routes. |
| Renderer | App prefetch impl | `webview/assets/app-prefetch-impl-CvoY4gd-.js` | medium | Route/module prefetching. |

## 3. Top-Level Feature Areas

| Area | UI piece | Bundle / file | Confidence | Notes |
| --- | --- | --- | --- | --- |
| Home | Home page | `home-*` chunks | high | Dashboard / landing surface inside the shell. |
| Home | Conversation starters | `home-conversation-starters-CWOHtkmb.js` | high | Starter cards and quick entry points. |
| Home | Recent project chats | `home-project-recent-chats-BTeTSlhG.js` | high | Recent conversation list on home. |
| Home | Announcements | `home-announcements-*` chunks | high | Home page announcement cards. |
| Home | Ambient suggestions | `home-ambient-suggestions-content-BogN_tzB.js` | high | Suggestion content rendered on home. |
| Home | Prefill artifact preview | `home-prefill-artifact-preview-CumKOM4s.js` | high | Preview area for prefilled artifacts. |
| Thread | Thread page | `thread-*` chunks | high | Main chat / conversation view. |
| Thread | Thread header | `thread-page-header-C6IOSyDb.js` | high | Header chrome above a conversation. |
| Thread | Thread layout | `thread-layout-Dkr9s56u.js` | high | Structural layout for thread screens. |
| Thread | Thread scroll layout | `thread-scroll-layout-CaagbXVM.js` | high | Scroll and viewport orchestration. |
| Thread | Thread virtualizer | `thread-virtualizer-9COdWn5E.js` | medium | List virtualization for long conversations. |
| Thread | Thread app shell chrome | `thread-app-shell-chrome-*` chunks | high | Thread-specific shell chrome. |
| Thread | Thread side panel tabs | `thread-side-panel-tabs-*` chunks | high | Tabs in the thread side panel. |
| Thread | Thread bottom panel state | `thread-page-bottom-panel-state-TF1g3u_g.js` | medium | State for bottom panel in thread context. |
| Settings | Settings pages | `settings-*` chunks | high | All settings routes and grouped settings modules. |
| Settings | General settings | `general-settings-*` chunks | high | Primary app preferences. |
| Settings | Agent settings | `agent-settings-*` chunks | high | Agent/runtime preferences. |
| Settings | Browser use settings | `browser-use-settings-*` chunks | high | Browser-use configuration UI. |
| Settings | Computer use settings | `computer-use-settings-*` chunks | high | Computer-use configuration UI. |
| Settings | Git settings | `git-settings-*` chunks | high | Git integration and defaults. |
| Settings | Profile page | `profile-*` chunks | high | User profile and account settings. |
| Settings | Appshots settings | `appshots-settings-BYGXNgQ6.js` | medium | Recording / appshot related settings. |
| Plugins | Plugins page | `plugins-page-*` chunks | high | Plugin marketplace and installed plugins page. |
| Plugins | Plugin detail | `plugin-detail-page-BS2Xbdl4.js` | high | Detail view for a single plugin. |
| Plugins | Plugin install flow | `use-plugin-install-flow-C0YRtVkW.js` | high | Install interactions and state flow. |
| Plugins | Connected apps | `connected-apps-Dck9Rcbz.js` | high | External app connections page. |
| Browser sidebar | Sidebar manager | `browser-sidebar-manager-CDP80WMh.js` | high | Controls sidebar lifecycle and placement. |
| Browser sidebar | Webview host | `browser-sidebar-webview-D1L6cqaW.js` | high | Embedded browser/sidebar webview surface. |
| Browser sidebar | Hidden webview host | `browser-sidebar-hidden-background-webview-host-DJggvvO5.js` | high | Background host for hidden sidebar mode. |
| Browser sidebar | Browser-use hidden host | `browser-sidebar-hidden-browser-use-webview-host-cDslpITj.js` | high | Hidden browser-use host variant. |
| Browser sidebar | Retained webview | `browser-sidebar-retained-webview-DS1n6LTx.js` | high | Keeps webview state alive when hidden. |
| Browser sidebar | Comment dismiss | `browser-sidebar-comment-light-dismiss-*` chunks | high | Light-dismiss behavior for comments. |
| Browser sidebar | Open source / source panel | `browser-sidebar-open-source-C-CpsoHA.js` | high | Source display or open-source mode panel. |
| Browser use | Browser-use core | `browser-use-B6ZJM-x3.js` | high | Main browser-use feature entry. |
| Browser use | Browser-use origin state | `browser-use-origin-state-queries-BnMJOXVT.js` | high | State queries tied to browser origins. |
| Browser use | Browser-use settings | `browser-use-settings-*` chunks | high | Configuration and safety settings. |
| Composer | Composer view state | `composer-view-state-MMPs5p5E.js` | high | Editor state for composing prompts/messages. |
| Composer | Prompt editor | `prompt-editor-DSJXB4gM.js` | high | Main prompt editor component. |
| Composer | Composer footer | `composer-footer-*` chunks | high | Footer controls below the composer. |
| Composer | Composer top menu (Chrome) | `composer-top-menu-chrome-*` chunks | high | Menu/toolbar for chrome-style window. |
| Composer | Focus composer | `focus-composer-Ddi8tz3g.js` | high | Focus management for composer interactions. |
| Composer | Above-composer row | `above-composer-panel-row-Cy10KbSa.js` | medium | UI that sits above the composer. |
| Composer | Mention list | `at-mention-list-*` chunks | high | Mention autocomplete UI. |
| Artifacts | Preview header | `artifact-preview-header-Bg8DeK2Z.js` | medium | Header for artifact preview panels. |
| Artifacts | Artifact tab content | `artifact-tab-content.electron-Vn4-HdYU.js` | medium | Electron-specific artifact tab content. |
| Artifacts | Document / workbook / presentation | `PopcornElectron*Panel` chunks | medium | Document, workbook, and presentation rendering surfaces. |

## 3.1 Navigation And Chrome

| Area | UI piece | Bundle / file | Confidence | Notes |
| --- | --- | --- | --- | --- |
| Navigation | Header chrome | `header-CLF2qRWi.js`, `header-BXcEnZFZ.js` | high | Top-level header controls and state. |
| Navigation | Dock | `dock-XFXqsb8h.js` | high | Dock/launcher style navigation surface. |
| Navigation | History | `history-TBKhiAS8.js` | high | History view or recent navigation state. |
| Navigation | Sidebar project groups | `sidebar-project-groups-DkFEKpNF.js` | high | Project grouping inside left sidebar. |
| Navigation | Sidebar thread list | `sidebar-thread-list-signals-B88Sg0Wa.js` | high | Thread list state and rendering signals. |
| Navigation | Sidebar task/pr chips | `sidebar-task-pr-chips` chunks | medium | Small chips for task and PR status in the sidebar. |
| Navigation | Projectless thread | `projectless-thread-SfYhUYuZ.js` | high | Conversation surface without an attached project. |
| Navigation | Initial route atom | `initial-route-atom-MPuPxmAE.js` | high | Route bootstrap and landing state. |
| Navigation | Navigate to local conversation | `use-navigate-to-local-conversation-CcgGoA8u.js` | high | Route helper for opening a local thread. |
| Navigation | Onboarding shell | `onboarding-shell-B5Vl8B3_.js` | medium | Onboarding wrapper around the main UI. |
| Navigation | Hotkey window pages | `hotkey-window-*` chunks | high | Special-purpose route layouts for hotkey windows. |
| Navigation | Workspace onboarding | `workspace-onboarding-experiment-07wt5Jg7.js` | medium | Experiment gating for onboarding flow. |

## 4. Shared UI And Utility Chunks

| Area | UI piece | Bundle / file | Confidence | Notes |
| --- | --- | --- | --- | --- |
| UI kit | Buttons | `button-Xd4Hy1MO.js` | high | Shared button primitives. |
| UI kit | Dialog layout | `dialog-layout-CCvvb1Vc.js` | high | Shared dialog framing. |
| UI kit | Popover | `dist-DBoRrpWS.js` | high | Radix-style popover primitive used for floating panels. |
| UI kit | Dropdown | `dropdown-CHaZfyxI.js` | high | Shared Radix-style dropdown primitives; exports `DropdownMenu*`, `Root`, `Trigger`, `Content`, `Item`, `CheckboxItem`, `RadioItem`, `Sub`, etc. |
| UI kit | Tooltip | `tooltip-BhXPONlb.js` | high | Shared tooltip component. |
| UI kit | Checkbox | `checkbox-Bz6PC7ig.js` | high | Shared checkbox component. |
| UI kit | Spinner | `spinner-Dvc_A3Ae.js` | high | Shared spinner/loading indicator. |
| UI kit | Animations | `animations-Du6t0V8Z.js` | high | Shared motion helpers and animation presets. |
| UI kit | Reusable icon set | many `*.js` icon chunks | high | Individual icon modules extracted as separate chunks. |
| Markdown | Inline mentions | `inline-mentions-*` chunks | high | Mention rendering and editor helpers. |
| Markdown | Markdown surface | `markdown-surface-DsmgfpJy.js` | medium | Rich text / markdown presentation layer. |
| Markdown | ProseMirror styles | `prosemirror-ptHiDCW_.css` | high | Editor stylesheet for the composer/editor. |
| Markdown | Diff UI | `diff-unified-*` chunks | high | Review/diff rendering surface. |
| Code blocks | Syntax highlighting | `katex-*`, `code-snippet-*` chunks | medium | Rich content and math/code display. |
| Search | Search input / overlay | `search-mcwajolX.js`, `anchored-autocomplete-overlay-CLwp_dja.js` | high | Search and autocomplete surfaces. |

## 5. Primary CSS Files

| File | Purpose | Confidence |
| --- | --- | --- |
| `webview/assets/app-main-CYccuswF.css` | Global renderer styling, tokens, transitions, and feature styles | high |
| `webview/assets/app-shell-DJDX7Pvr.css` | App shell layout and tab strip styling | high |
| `webview/assets/composer-CmqBNpOg.css` | Composer layout styles | high |
| `webview/assets/composer-footer-BmInDjPq.css` | Composer footer styling | high |
| `webview/assets/composer-top-menu-chrome-EBEHrbNH.css` | Top menu chrome styling | high |
| `webview/assets/plugins-page-DoKhPslE.css` | Plugins page layout | high |
| `webview/assets/prompt-editor-BuS6Xjko.css` | Prompt editor styles | high |
| `webview/assets/local-conversation-thread-B44VLaLQ.css` | Conversation thread styles | high |
| `webview/assets/profile-DOxOBCjz.css` | Profile page styles | high |
| `webview/assets/at-mention-list-acW2mHgN.css` | Mention dropdown styles | high |
| `webview/assets/browser-sidebar-comment-light-dismiss-CYswclfQ.css` | Browser sidebar dismiss behavior | high |
| `webview/assets/thinking-shimmer-83dxNCp_.css` | Thinking/processing shimmer animation | high |

## 6. Rebuild Plan Notes

| Step | What to clone | Why |
| --- | --- | --- |
| 1 | App shell and panel geometry | This establishes the frame, docking, and route placement. |
| 2 | Design tokens and global CSS | The UI feel depends heavily on spacing, radii, borders, and surface colors. |
| 3 | Home page | This is usually the first real landing experience. |
| 4 | Thread page | Core interaction surface and easiest place to notice layout drift. |
| 5 | Composer | Critical for prompt entry, mention suggestions, and footer actions. |
| 6 | Settings and plugins | These reveal shared form components and modal patterns. |
| 7 | Browser sidebar | More specialized, but important if we want feature parity. |

## 7. Open Questions

| Question | Status | Next research target |
| --- | --- | --- |
| What are the exact route paths for home, threads, settings, and plugin pages? | open | Search route registry / router definitions in the extracted bundles. |
| Which chunks map to the main sidebar navigation components? | open | Inspect `sidebar-*`, `header-*`, and `app-shell-state-*` chunks. |
| Which components are shared between home, threads, and settings? | open | Look for `shared`, `ui`, `hooks`, and `dialog` chunk boundaries. |
| Are there any local assets that are essential for a close visual match? | open | Review `webview/public` and asset folders for icons, fonts, and images. |

## 8. Research Log

| Date | Finding |
| --- | --- |
| 2026-06-03 | Confirmed packaged Electron app with `app.asar`, `webview/index.html`, and Vite-generated renderer chunks. |
| 2026-06-03 | Confirmed shell-level export module `app-shell-D7yvB1FT.js` and broad feature bundle `app-main-C3VNTc8v.js`. |
| 2026-06-03 | Found major feature families: home, thread, settings, plugins, browser sidebar, browser use, composer, and artifacts. |
| 2026-06-03 | Pivoted from exact renderer boot to reconstructed component-system app because exact upstream renderer waits on original host services. |
| 2026-06-03 | Added first readable library slice under `opaline-same-ui-electron/src/lib/opaline-ui` and wired Electron normal mode to consume it. |
| 2026-06-03 | Added literal component-library extraction system under `opaline-same-ui-electron/src/component-library`, with 231 copied upstream assets and wrappers for shell, primitives, sidebar, thread, composer, markdown, settings, and browser sidebar. |
| 2026-06-03 | Upgraded upstream extraction to dependency-aware mode: `refresh:ui` now extracts 753 renderer files by following JS imports and CSS `url(...)` assets. |
| 2026-06-03 | Upgraded literal component-library extraction to copy 579 upstream assets, including CSS/font dependencies, emit `component-system.json`, emit `COMPONENT_SYSTEM.md`, and expose a `styles` wrapper. |
| 2026-06-03 | The preview renderer imports copied upstream global styles; direct bundled React component rendering was tested and rejected because it mixes React runtimes. |
| 2026-06-03 | Fixed `npm run start:library` blank screen by removing direct bundled React component rendering; the readable copy app now renders through `src/lib/opaline-ui` while keeping literal upstream assets as source/reference. |
| 2026-06-03 | Added `npm run start:copy` alias and expanded the copy app shell with Opaline-like titlebar, sidebar, toolbar, inspector panel, thread surface, composer dock, and shared primitives. |
| 2026-06-03 | Recovered exact sidebar material chain: Electron/macOS body transparent, `.app-shell-left-panel` uses `color-mix(in srgb, var(--color-token-editor-background) 55%, transparent)`, token resolves through `--vscode-editor-background` to light `#ededed66` / `gray-100 40%`, and blur uses upstream `--blur-md: 12px`. |
| 2026-06-03 | Recovered primary BrowserWindow material options from minified main bundle: non-opaque macOS primary uses `backgroundColor: "#00000000"`, `vibrancy: "menu"`, `titleBarStyle: "hiddenInset"`, and traffic lights at `{ x: 16, y: 16 }`. |
| 2026-06-03 | Began changing readable primitives to Radix-backed components: `Button` now supports Radix `Slot` via `asChild`, and `DropdownMenu.tsx` wraps `@radix-ui/react-dropdown-menu` while preserving Opaline CSS contracts. |
| 2026-06-03 | Added readable sidebar action contracts and applied the upstream sidebar medium blur in the copy app: `backdrop-filter: blur(var(--blur-md))` with `--blur-md: 12px`, inherited into the rounded edge pseudo-element. |
| 2026-06-03 | Ported three more shared UI systems into `src/lib/opaline-ui`: Radix-backed Opaline dialog/popup primitive from `dialog-layout-CCvvb1Vc.js`, bottom terminal/tabs panel from `app-shell-D7yvB1FT.js`, and a first filesystem tree port from `file-tree-search-input-DWq_lg9v.js`. |
| 2026-06-05 | Opaline package port continued: `FileTree` now uses the upstream `Filter files…` search wrapper and flex section lanes, `FileBrowserPanel` provides the right-side file tree/editor slot, `AppShell` has the thread actions topbar menu, and `ThreadSurface` has a denser Opaline-like conversation/review-card rhythm. |
