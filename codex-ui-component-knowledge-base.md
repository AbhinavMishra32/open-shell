# Codex UI Component System Knowledge Base

This document is the long-term reference for recreating the Codex Electron UI in another Electron app with the same visual system and the same component boundaries.

Use this alongside:
- [codex-ui-inventory.md](/Users/abhinavmishra/solin/general/desktop-agent-app/codex-ui-inventory.md)
- [codex-same-ui-electron](/Users/abhinavmishra/solin/general/desktop-agent-app/codex-same-ui-electron)

## 1. Goal

Build a second Electron app whose UI matches the Codex desktop app as closely as possible, using the same component system, same shell structure, same spacing and motion rules, and ideally the same source code shape where that is practical and permitted.

## 2. What This UI Really Is

The Codex desktop UI is not a single screen.

It is a layered system:
- Electron window bootstrap
- Vite-rendered HTML entry
- global startup splash
- shell layout primitives
- route/page modules
- shared UI kit
- settings and feature sub-systems
- browser sidebar and browser-use runtime surfaces
- composer and markdown/editor surfaces
- artifact/document preview surfaces

The shell is the most important piece. Almost everything else plugs into it.

## 2.1 Side-By-Side Rebuild App

The first rebuild app lives inside this same folder:

`codex-same-ui-electron`

It has two jobs:
- run the original Codex Electron main process for exact behavioral/log comparison
- run our reconstructed Electron UI from a readable component library preview
- optionally run the original renderer from `app.app/Contents/Resources/app.asar` for exact visual comparison
- hold formatted, unminified source mirrors under `src/unminified/upstream`

This means future component work can start from the literal upstream bundle code, formatted into readable files, then gradually move into proper reconstructed source modules.

Real upstream launcher:
- `npm run start`

Literal component-library extraction path:
- `codex-same-ui-electron/src/component-library`

Component-library preview renderer path:
- `codex-same-ui-electron/src/renderer`

Reference-only exact mode:
- `npm run start:exact`

Reconstructed component-library preview:
- `npm run start:library`

Important distinction:
- `src/unminified/upstream` is the formatted upstream bundle mirror.
- `src/component-library/original/assets` is the literal copied component-library closure, preserving upstream relative imports.
- `src/component-library/styles/index.js` loads copied upstream global renderer CSS and feature CSS.
- `src/component-library/*/index.js` contains system wrappers for styles, shell, primitives, sidebar, thread, composer, markdown, settings, and browser sidebar.
- `src/component-library/component-system.json` is the data catalog for copied systems, entry files, dependency closures, and detected export aliases.
- `src/lib/codex-ui` is only the experimental readable/manual preview layer and should not be treated as the source of truth.
- New apps that want the same Codex UI should start from `src/component-library`, not the handmade preview.

## 3. Core Architecture Model

### 3.1 Window Layer

Owns:
- Electron `BrowserWindow`
- native window controls and titlebar behavior
- zoom/size/state hooks
- macOS/Windows-specific chrome behavior
- startup HTML and initial load

Key evidence:
- `webview/index.html`
- `app-window-wJqe84fR.js`
- `app-shell-D7yvB1FT.js`

### 3.2 Shell Layer

Owns:
- left panel
- main content frame
- right panel
- bottom panel
- tab strip
- header chrome
- focus handling
- resize handling
- docking behavior

Shell is the top-level composition system.

Reconstructed source now started at:
- `codex-same-ui-electron/src/lib/codex-ui/app-shell/AppShell.tsx`
- `codex-same-ui-electron/src/lib/codex-ui/app-shell/app-shell.css`

Literal upstream shell extraction now lives at:
- `codex-same-ui-electron/src/component-library/shell/index.js`
- `codex-same-ui-electron/src/component-library/original/assets/app-shell-D7yvB1FT.js`
- `codex-same-ui-electron/src/component-library/original/assets/app-shell-DJDX7Pvr.css`

Important exported primitives from `app-shell-D7yvB1FT.js`:
- `Root`
- `LeftPanel`
- `Content`
- `Header`
- `HeaderAction`
- `HeaderContextMenuItem`
- `MainContentLayout`
- `BottomPanel`
- `BottomPanelTabs`
- `BottomPanelOutlet`
- `RightPanel`
- `RightPanelTabs`
- `RightPanelOutlet`

### 3.3 Route/Page Layer

Owns:
- home surface
- thread surface
- settings surfaces
- plugins surfaces
- browser sidebar surface
- artifact preview surfaces
- onboarding and hotkey-window variants

This is where most user-visible screens live.

### 3.4 Shared Component Layer

Owns:
- buttons
- dialogs
- dropdowns
- tooltips
- spinners
- checkboxes
- layout helpers
- icons
- motion helpers
- editor primitives
- markdown and mention components

This layer is what makes the UI feel coherent.

Reconstructed source now started at:
- `codex-same-ui-electron/src/lib/codex-ui/tokens/codex-theme.css`
- `codex-same-ui-electron/src/lib/codex-ui/primitives/Button.tsx`
- `codex-same-ui-electron/src/lib/codex-ui/icons/CodexMark.tsx`
- `codex-same-ui-electron/src/lib/codex-ui/sidebar/Sidebar.tsx`
- `codex-same-ui-electron/src/lib/codex-ui/thread/ThreadSurface.tsx`
- `codex-same-ui-electron/src/lib/codex-ui/composer/Composer.tsx`

Literal upstream shared component extraction now lives at:
- `codex-same-ui-electron/src/component-library/styles/index.js`
- `codex-same-ui-electron/src/component-library/primitives/index.js`
- `codex-same-ui-electron/src/component-library/primitives/button.js`
- `codex-same-ui-electron/src/component-library/composer/index.js`
- `codex-same-ui-electron/src/component-library/thread/index.js`
- `codex-same-ui-electron/src/component-library/sidebar/index.js`

Current literal extraction stats:
- `src/unminified/upstream` contains 753 renderer files after dependency-aware refresh.
- `src/component-library` contains a 579-asset copied component closure.
- `src/component-library/component-system.json` currently detects exports in 507 copied JS modules.
- `src/renderer/App.tsx` imports copied upstream styles and the upstream Button primitive as the first dogfood path.

## 4. Shell Behavior Rules

These are the main rules to preserve if we want the same UI.

1. The shell is route-aware but not route-specific.
2. The shell owns panel widths and layout state.
3. Tabs are first-class UI entities with drag/drop support.
4. The right panel can expand or collapse independently.
5. The bottom panel is a separate slot, not just a modal.
6. The top header and the tab strip are part of the shell contract.
7. The shell reacts to reduced-motion, window zoom, and platform-specific chrome rules.
8. The left panel can float or dock depending on state and viewport width.

## 5. Component System Map

### 5.1 App Shell Components

File:
- `webview/assets/app-shell-D7yvB1FT.js`

System:
- `Root` orchestrates the whole layout.
- `LeftPanel` is the sidebar surface.
- `Content` is the main content container with suspense fallback.
- `Header` renders the top chrome.
- `HeaderAction` renders action slots in the header.
- `HeaderContextMenuItem` registers context menu items.
- `MainContentLayout` controls layout mode state.
- `BottomPanel` is a reserved slot for bottom content.
- `RightPanel` is the side inspector / auxiliary surface.

Design meaning:
- Everything in the app should fit into this shell instead of bypassing it.

### 5.2 Tab System

Files:
- `webview/assets/app-shell-tab-controller-B0DXekEJ.js`
- `webview/assets/sidebar-thread-list-signals-B88Sg0Wa.js`
- `webview/assets/thread-page-header-C6IOSyDb.js`

Behavior:
- tabs are reorderable
- tabs can be activated, closed, pinned
- tabs can be previewed via drag hover
- separators and overflow matter visually
- tab titles must support truncation and tooltip behavior

### 5.3 Home Components

Likely subcomponents:
- `home-conversation-starters-CWOHtkmb.js`
- `home-project-recent-chats-BTeTSlhG.js`
- `home-announcements-*`
- `home-ambient-suggestions-content-BogN_tzB.js`
- `home-prefill-artifact-preview-CumKOM4s.js`

Behavior:
- home is a composition of cards and blocks
- it uses the same design tokens as the rest of the app
- it often serves as a launcher and discovery surface

### 5.4 Thread Components

Likely subcomponents:
- `thread-layout-Dkr9s56u.js`
- `thread-scroll-layout-CaagbXVM.js`
- `thread-virtualizer-9COdWn5E.js`
- `thread-page-header-C6IOSyDb.js`
- `thread-side-panel-tabs-*`
- `thread-app-shell-chrome-*`
- `thread-page-bottom-panel-state-TF1g3u_g.js`

Behavior:
- chat content is virtualized and sticky in places
- header and composer are part of one interaction model
- side panels and bottom panels are controlled, not ad hoc

### 5.5 Composer Components

Likely subcomponents:
- `composer-view-state-MMPs5p5E.js`
- `prompt-editor-DSJXB4gM.js`
- `composer-footer-*`
- `composer-top-menu-chrome-*`
- `focus-composer-Ddi8tz3g.js`
- `above-composer-panel-row-Cy10KbSa.js`
- `at-mention-list-*`

Behavior:
- prompt editor needs autocomplete
- composer footer changes based on context
- editor styling is a first-class design surface, not just a text box

### 5.6 Settings Components

Likely subcomponents:
- `general-settings-*`
- `agent-settings-*`
- `browser-use-settings-*`
- `computer-use-settings-*`
- `git-settings-*`
- `profile-*`
- `appshots-settings-BYGXNgQ6.js`

Behavior:
- settings pages share list rows, sectioned layouts, toggles, dropdowns, and dialogs
- the settings system is a route group, not one page

### 5.7 Plugins Components

Likely subcomponents:
- `plugins-page-*`
- `plugin-detail-page-BS2Xbdl4.js`
- `use-plugin-install-flow-C0YRtVkW.js`
- `connected-apps-Dck9Rcbz.js`
- `plugin-uninstall-dialog-CorSIkNg.js`

Behavior:
- plugin pages use cards, banners, lists, and confirm dialogs
- installation flows are stateful and likely async

### 5.8 Browser Sidebar Components

Likely subcomponents:
- `browser-sidebar-manager-CDP80WMh.js`
- `browser-sidebar-webview-D1L6cqaW.js`
- `browser-sidebar-retained-webview-DS1n6LTx.js`
- `browser-sidebar-hidden-background-webview-host-DJggvvO5.js`
- `browser-sidebar-hidden-browser-use-webview-host-cDslpITj.js`
- `browser-sidebar-comment-light-dismiss-*`

Behavior:
- sidebar is not just UI; it owns a live embedded webview
- hidden and retained modes exist for performance and state retention
- comment dismissal and browser-use behavior are separate concerns

## 6. Style System Rules

To get the same UI, the style system has to be copied, not approximated.

Known global style sources:
- `webview/assets/app-main-CYccuswF.css`
- `webview/assets/app-shell-DJDX7Pvr.css`
- `webview/assets/composer-CmqBNpOg.css`
- `webview/assets/prompt-editor-BuS6Xjko.css`
- `webview/assets/prosemirror-ptHiDCW_.css`

Important style traits:
- dense, operational layout
- token-based colors
- restrained shadows
- rounded but not bubbly
- strong panel separation
- motion is subtle and intentional
- code, editor, and thread areas use their own typography rules

## 7. Reuse Strategy For Another Electron App

If the goal is identical UI, the safest technical approach is:

1. Copy the shell architecture first.
2. Copy the global CSS variables and base styles next.
3. Copy shared primitives before any feature page.
4. Recreate route structure to match the component tree.
5. Port state management and tab logic.
6. Port composer, thread, and browser sidebar flows.
7. Port settings and plugin pages last.

If the goal is literal source-code equivalence:
- reuse the same component file structure
- preserve file naming where possible
- preserve import boundaries where possible
- preserve route contracts and shell slots
- preserve design tokens and CSS module boundaries

## 8. What To Copy Exactly

Copy these categories in order:
- HTML entry and startup splash
- window bootstrapping
- route registry
- shell primitives
- shell state and tab controller
- theme tokens and global CSS
- shared UI kit
- editor, mention, and markdown systems
- home pages
- thread pages
- settings pages
- plugins pages
- browser sidebar runtime
- assets, fonts, icons, images, and animation art

## 9. What Not To Flatten

Do not collapse these into one generic component if you want the same UI:
- shell vs page
- header vs tab strip
- right panel vs bottom panel
- composer vs thread content
- browser sidebar vs normal route panels
- settings sections vs settings rows
- markdown surface vs code surface
- floating left panel vs docked left panel

Those boundaries are visible in the bundle structure and matter in the final UI.

## 10. Extraction / Mirror Workflow

Recommended repeatable workflow:

1. Extract `app.asar`.
2. Keep an always-updated inventory file.
3. Group chunks by route and component family.
4. Identify which CSS file belongs to each family.
5. Recreate the shell and tokens first.
6. Rebuild one route at a time in the same structure.
7. Compare screenshots or DOM shape after each step.
8. Add findings back into this knowledge base.

## 11. Open Research Tasks

- exact route table
- route-to-chunk mapping
- shared design token source
- left sidebar navigation component hierarchy
- settings section component hierarchy
- thread composer state machine
- browser sidebar lifecycle
- webview host/retention lifecycle
- asset inventory for identical visual match

## 12. Practical Copy Notes

- The biggest visual mismatch usually comes from CSS variables and spacing, not the JSX tree.
- The biggest behavioral mismatch usually comes from shell state and tab routing, not the page component.
- The biggest maintainability problem comes from flattening the shell into a generic layout too early.
- The cleanest rebuild path is to preserve the file/component boundaries as much as possible.
