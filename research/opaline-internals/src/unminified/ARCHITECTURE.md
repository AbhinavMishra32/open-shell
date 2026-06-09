# Unminified Architecture

This folder is the readable source mirror for the original Opaline renderer.

## Tracks

`upstream`

Formatted copies of the original renderer chunks. These files are still compiled bundle code, but they are unminified and kept byte-semantically close to upstream. Use these as the source of truth when recovering exact behavior.

`component-system`

Readable reconstruction modules. These should preserve the same architecture and component boundaries as upstream, while gradually replacing formatted bundle chunks with maintainable source.

## Same UI Rule

To keep the UI literally the same:

1. Start from formatted upstream files.
2. Preserve import boundaries and module names where possible.
3. Reconstruct shell primitives before pages.
4. Reconstruct shared UI primitives before feature screens.
5. Only rename internals when the mapping is recorded.
6. Compare against the exact renderer after each replacement.

## Current Source Of Truth

The exact runnable renderer still comes from:

`../../app.app/Contents/Resources/app.asar/webview/index.html`

The readable mirror comes from:

`src/unminified/upstream/webview`

