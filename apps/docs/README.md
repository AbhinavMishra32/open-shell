# Opaline documentation

The documentation app is built with Next.js, Fumadocs UI, Fumadocs MDX, and the live Opaline workspace source.

```bash
npm install
npm run docs:dev
```

Open `http://127.0.0.1:3011`.

## Content

- MDX pages live in `content/docs`.
- `source.config.ts` defines the Fumadocs collection.
- `app/docs/[[...slug]]/page.tsx` renders every generated page.
- `components/ComponentPreview.tsx` contains interactive package examples.

## Live component source

The docs resolve `@opaline/ui` to `../../packages/ui/src/index.ts` through the docs TypeScript configuration.
The root layout imports `packages/ui/src/styles.css` directly. Component and token changes therefore appear
through Next.js HMR without building or publishing the package.

## Focused checks

```bash
npm run typecheck -w @opaline/ui
npm run typecheck -w @opaline/docs
```
