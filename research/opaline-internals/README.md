# Opaline Same UI Electron

This is the side-by-side rebuild app for `../app.app`.

The project has two tracks:

- `start` runs the upstream Opaline Electron main process from `../app.app/Contents/Resources/app.asar` with a local repaired runtime copy. This is the real architecture/reference path.
- `start:exact` runs an Electron shell that loads only the original renderer from `../app.app/Contents/Resources/app.asar`. This is useful for renderer experiments, but it does not provide the full host services.
- `start:library` runs the non-agent Opaline copy app built from the stripped readable shared UI library.
- `start:copy` is an alias for `start:library`.
- `extract:ui` creates a readable dependency-aware source mirror under `src/unminified/upstream` by extracting and formatting the original renderer/component chunks.
- `extract:components` creates a literal upstream component-library closure under `src/component-library`, plus a catalog and system docs.

The goal is to keep the runnable UI tied to the original app while the component library is extracted literally first, then gradually wrapped/reconstructed at the same source boundaries.

## Commands

```sh
npm install
npm run refresh:components
npm run start:copy
```

Current extraction scale:

- `src/unminified/upstream`: 753 upstream renderer files
- `src/component-library`: 579 copied upstream assets
- `src/component-library/component-system.json`: generated catalog with 507 detected exported modules

## Structure

- `src/main`: Electron bootstrap for the side-by-side app.
- `src/component-library`: literal upstream component-library extraction with system wrappers.
- `src/component-library/component-system.json`: generated component-system data file.
- `src/component-library/COMPONENT_SYSTEM.md`: generated component-system knowledge base.
- `src/unminified/upstream`: formatted original renderer files.
- `src/unminified/component-system`: readable architecture notes.
- `src/lib/opaline-ui`: readable stripped shared UI library used by the non-agent copy app.
- `.upstream-cache`: extracted `app.asar` cache, ignored by git.
- `.runtime`: local repaired upstream runtime copy, ignored by git.

## Rule

When reconstructing components, preserve the original boundaries first:

- shell before routes
- app shell state before panels
- shared UI kit before feature pages
- composer/thread/browser-sidebar as separate systems
