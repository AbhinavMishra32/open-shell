# Codex Same UI Electron

This is the side-by-side rebuild app for `../app.app`.

The project has two tracks:

- `start:exact` runs an Electron shell that loads the original renderer from `../app.app/Contents/Resources/app.asar`. This is the pixel-reference path.
- `extract:ui` creates a readable source mirror under `src/unminified/upstream` by extracting and formatting the original renderer/component chunks.

The goal is to keep the runnable UI tied to the original app while we progressively replace formatted chunks with proper source modules.

## Commands

```sh
npm install
npm run extract:ui
npm run start:exact
```

## Structure

- `src/main`: Electron bootstrap for the side-by-side app.
- `src/unminified/upstream`: formatted original renderer files.
- `src/unminified/component-system`: readable architecture notes and future reconstructed components.
- `.upstream-cache`: extracted `app.asar` cache, ignored by git.

## Rule

When reconstructing components, preserve the original boundaries first:

- shell before routes
- app shell state before panels
- shared UI kit before feature pages
- composer/thread/browser-sidebar as separate systems

