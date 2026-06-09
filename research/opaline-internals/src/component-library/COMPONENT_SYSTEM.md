# Opaline UI Component System

This is the working knowledge base for copying Opaline UI into another Electron app with the same component code.

Source of truth:
- `original/assets` contains literal copied upstream renderer modules
- `styles/index.js` loads Opaline global renderer CSS and feature CSS
- `component-system.json` records every copied system, source entrypoint, and detected export alias
- system wrapper folders provide stable import points for a new Electron renderer

Recommended import surface:
- `@opaline-ui/component-library/shell` for app shell and window chrome
- `@opaline-ui/component-library/styles` for global tokens and feature CSS
- `@opaline-ui/component-library/primitives` for shared controls
- `@opaline-ui/component-library/sidebar` for sidebar state/components
- `@opaline-ui/component-library/thread` for thread layout and conversation surfaces
- `@opaline-ui/component-library/composer` for prompt/editor/composer surfaces
- `@opaline-ui/component-library/markdown` for markdown rendering surfaces
- `@opaline-ui/component-library/settings` for settings pages
- `@opaline-ui/component-library/browser-sidebar` for retained browser/sidebar surfaces

Copy strategy:
- Keep original modules unchanged under `original/assets`
- Add readable wrappers only outside `original/assets`
- Recover minified aliases progressively by reading exports from `component-system.json`
- Build the new app renderer against the wrappers, not against handmade approximation components

Systems:

## styles
- wrapper: ./styles/index.js
- copiedAssets: 69
- entries: app-main-CYccuswF.css, app-shell-DJDX7Pvr.css, composer-CmqBNpOg.css, composer-footer-BmInDjPq.css, composer-top-menu-chrome-EBEHrbNH.css, prompt-editor-BuS6Xjko.css, local-conversation-thread-B44VLaLQ.css, at-mention-list-acW2mHgN.css, browser-sidebar-comment-light-dismiss-CYswclfQ.css, diff-unified-D4NO3G6Q.css
- exportedModules: 0

## shell
- wrapper: ./shell/index.js
- copiedAssets: 448
- entries: app-shell-D7yvB1FT.js, app-shell-DJDX7Pvr.css, app-shell-bottom-panel-scroll-sync-DpO90Rtb.js, app-shell-state-B5MFb4Nm.js, app-shell-tab-controller-B0DXekEJ.js, app-window-wJqe84fR.js, thread-app-shell-chrome-BjerXYKb.js, thread-app-shell-chrome-COp6s10f.js
- exportedModules: 447

## primitives
- wrapper: ./primitives/index.js
- copiedAssets: 41
- entries: button-Xd4Hy1MO.js, checkbox-Bz6PC7ig.js, context-menu-DRia187f.js, dialog-layout-CCvvb1Vc.js, dialog-layout-sS9Dm_y9.css, dropdown-CHaZfyxI.js, dropdown-9F1MU8ql.css, tabs-ji6s-l3m.js, toast-signal-By11REe1.js, tooltip-BhXPONlb.js, tooltip-dismiss-1FVw8OQP.js
- exportedModules: 39

## sidebar
- wrapper: ./sidebar/index.js
- copiedAssets: 160
- entries: sidebar-signals-B0JkGccK.js, sidebar-project-groups-DkFEKpNF.js, sidebar-project-group-signals-h0Ffvrar.js, sidebar-thread-list-signals-B88Sg0Wa.js, sidebar-task-pr-chip-signals-B_U8b94R.js, dock-XFXqsb8h.js, history-TBKhiAS8.js
- exportedModules: 160

## thread
- wrapper: ./thread/index.js
- copiedAssets: 446
- entries: thread-layout-Dkr9s56u.js, thread-scroll-layout-CaagbXVM.js, thread-virtualizer-9COdWn5E.js, thread-page-header-C6IOSyDb.js, thread-page-bottom-panel-state-TF1g3u_g.js, thread-panel-state-CYOPuORF.js, thread-side-panel-tabs-BiJ44OOM.js, thread-side-panel-tabs-CHBOpLXU.js, local-conversation-thread-CRSaT3IN.js, local-conversation-thread-B44VLaLQ.css
- exportedModules: 445

## composer
- wrapper: ./composer/index.js
- copiedAssets: 397
- entries: composer-CUO1FiyC.js, composer-CmqBNpOg.css, composer-footer-CY-87K58.js, composer-footer-BmInDjPq.css, composer-external-footer-DUWRQbuZ.js, composer-footer-branch-switcher-r30ZpEaG.js, composer-top-menu-chrome-4snk27KP.js, composer-top-menu-chrome-EBEHrbNH.css, composer-view-state-MMPs5p5E.js, prompt-editor-DSJXB4gM.js, prompt-editor-BuS6Xjko.css, focus-composer-Ddi8tz3g.js, at-mention-list-BcS9-UNX.js, at-mention-list-CDZ8CUgv.js, at-mention-list-acW2mHgN.css, use-composer-controller-EmBnHezU.js
- exportedModules: 392

## markdown
- wrapper: ./markdown/index.js
- copiedAssets: 186
- entries: markdown-CHFpyp1o.js, markdown-CrzXVJOX.js, markdown-fw3eJobG.js, markdown-surface-DsmgfpJy.js, inline-mentions-HEbHrk4s.js, inline-mentions-DQmOb30B.css, inline-mention-style-CHAdZkbq.js, diff-unified-BT9wY89m.js, diff-unified-D4NO3G6Q.css
- exportedModules: 184

## settings
- wrapper: ./settings/index.js
- copiedAssets: 307
- entries: settings-page-qEZ4h3P3.js, settings-content-layout-sdUwAG0A.js, settings-group-BO3RZzLk.js, settings-row-DOKTjAF6.js, settings-sections-BUO2MNq2.js, settings-shared-BibDzP9i.js, general-settings-DobuGNrH.js, general-settings-mIQGMvCv.js, plugins-settings-IHczu4th.js
- exportedModules: 307

## browserSidebar
- wrapper: ./browser-sidebar/index.js
- copiedAssets: 189
- entries: browser-sidebar-manager-CDP80WMh.js, browser-sidebar-webview-D1L6cqaW.js, browser-sidebar-retained-webview-DS1n6LTx.js, browser-sidebar-state-CjNKE43Q.js, browser-sidebar-availability-BQYQqnR4.js, browser-sidebar-comment-light-dismiss-DC1fddSh.js, browser-sidebar-comment-light-dismiss-CYswclfQ.css, browser-use-B6ZJM-x3.js, browser-use-origin-state-queries-BnMJOXVT.js
- exportedModules: 188

