# Contributing

Opaline is a research-heavy UI project, so fidelity matters as much as polish.

## Development

```sh
npm install
npm run typecheck
npm run build
npm run start:example
```

## Component Porting Rules

- Preserve source boundaries before redesigning internals.
- Keep readable TypeScript and React code in `packages/ui`.
- Keep extraction scripts and upstream mirrors in `research/codex-internals`.
- Prefer Radix primitives when the upstream behavior maps to an accessible headless primitive.
- Document evidence in `codex-ui-component-knowledge-base.md` when a component gains fidelity.

## Pull Requests

- Include the component system affected by the change.
- Include before/after screenshots for visual work.
- Run `npm run typecheck` and `npm run build`.
- Avoid importing bundled upstream runtime code into the public package.
