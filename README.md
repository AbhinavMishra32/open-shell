# Open Shell

[![status](https://img.shields.io/badge/status-research_preview-101010?style=for-the-badge)](#status)
[![turbo](https://img.shields.io/badge/Turbo-monorepo-EF4444?style=for-the-badge&logo=turborepo&logoColor=white)](https://turbo.build/repo)
[![react](https://img.shields.io/badge/React-19-149ECA?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![electron](https://img.shields.io/badge/Electron-42-47848F?style=for-the-badge&logo=electron&logoColor=white)](https://www.electronjs.org)
[![radix](https://img.shields.io/badge/Radix_UI-primitives-161618?style=for-the-badge&logo=radixui&logoColor=white)](https://www.radix-ui.com)
[![typescript](https://img.shields.io/badge/TypeScript-strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![license](https://img.shields.io/badge/license-MIT-0F172A?style=for-the-badge)](./LICENSE)
[![prs](https://img.shields.io/badge/PRs-welcome-22C55E?style=for-the-badge)](./CONTRIBUTING.md)

Open Shell is a research-driven Electron component system for building the kind of desktop UI that feels native, dense, and alive: translucent macOS sidebars, command-heavy agent workspaces, chat/composer surfaces, terminal drawers, file trees, and Radix-backed primitives.

It is designed for founders and engineers who want a serious shell for agentic desktop apps without starting from another generic dashboard template.

![Open Shell hero](./docs/assets/open-shell-hero.svg)

## Why This Exists

Most Electron starter kits give you a web app in a window. Open Shell is about the layer above that:

- Native-feeling translucent sidebar material with the correct transparent Electron surface underneath.
- App shell layout for agent/chat/productivity tools: sidebar, thread body, composer dock, side panels, and bottom terminals.
- Readable component ports backed by a local component-system research knowledge base.
- Radix UI primitives where the original UI intent maps cleanly to accessible headless primitives.
- A Turbo workspace that separates the reusable UI package, runnable Electron example, and reverse-engineering research materials.

## Screenshot

![Open Shell component map](./docs/assets/open-shell-system-map.svg)

## Packages

| Package | Path | Purpose |
| --- | --- | --- |
| `@open-shell/ui` | `packages/ui` | Reusable React component library and design tokens. |
| `@open-shell/electron-example` | `examples/electron-shell` | Runnable Electron app that consumes the library. |
| Research internals | `research/codex-internals` | Extraction scripts, upstream mirrors, generated inventories, and provenance notes. |

## Install

```sh
npm install @open-shell/ui @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-slot @radix-ui/react-tabs react react-dom
```

```tsx
import {
  AppShell,
  BottomPanel,
  Composer,
  FileTree,
  Sidebar,
  TerminalSurface,
  ThreadSurface,
} from "@open-shell/ui";
import "@open-shell/ui/styles.css";

export function AgentDesktop() {
  return (
    <AppShell
      sidebar={<Sidebar activeThreadId="launch" projects={[]} footerLabel="Settings" />}
      bottomPanel={
        <BottomPanel
          tabs={[
            {
              id: "terminal",
              label: "agent-shell",
              content: <TerminalSurface lines={["npm run start:example", "ready"]} />,
            },
          ]}
        />
      }
    >
      <ThreadSurface
        title="Inspect Electron UI"
        eyebrow="Component system"
        messages={[
          {
            id: "1",
            role: "assistant",
            body: "Build your agent desktop with the Open Shell system.",
          },
        ]}
      />
      <Composer placeholder="Ask the agent..." />
    </AppShell>
  );
}
```

## Run The Example

```sh
npm install
npm run start:example
```

The example app uses a transparent Electron window with macOS hidden inset chrome:

```js
new BrowserWindow({
  titleBarStyle: "hiddenInset",
  trafficLightPosition: { x: 16, y: 16 },
  transparent: true,
  backgroundColor: "#00000000",
  vibrancy: "menu",
});
```

The sidebar material is not a fake baked gradient. It depends on the transparent renderer surface, transparent document body, and the component token rule:

```css
[data-codex-window-type="electron"]:not([data-codex-os="win32"]) .app-shell-left-panel {
  background: color-mix(in srgb, var(--color-token-editor-background) 55%, transparent);
  backdrop-filter: blur(var(--blur-md));
}
```

## Turbo Commands

```sh
npm run typecheck
npm run build
npm run dev
npm run start:example
npm run research:refresh
```

## Component Systems

| System | Status | Backing primitive | Notes |
| --- | --- | --- | --- |
| App Shell | Ported | React layout | Opaque main surface, translucent sidebar slot, bottom panel slot. |
| Sidebar | Ported | React | Preserves upstream `app-shell-left-panel` and `data-app-action-sidebar-*` contracts. |
| Dialog | Ported | Radix Dialog | Size tokens, measured height readiness, overlay/content split. |
| Dropdown Menu | Ported | Radix Dropdown Menu | Shared floating menu skin and item composition. |
| Bottom Panel | Ported | Radix Tabs | Terminal drawer constants: default `280`, min `160`, max half of main area. |
| File Tree | Ported | React | Preserves `data-file-tree-*` DOM hooks and core icon sprite. |
| Composer | Draft port | React | Prompt dock, mode chips, submit affordance. |
| Thread Surface | Draft port | React | Agent conversation canvas and workspace prose. |

## Repository Layout

```txt
open-shell/
  packages/ui/                 reusable component library
  examples/electron-shell/      runnable Electron app
  research/codex-internals/     extraction sandbox and upstream reference cache
  docs/assets/                  OSS screenshot-style visuals
  codex-ui-component-knowledge-base.md
  codex-ui-inventory.md
```

## Research Provenance

Open Shell is a clean-room readable component-system reconstruction informed by locally extracted desktop app internals and behavior research. The library does not import the bundled upstream React runtime. Instead, each component is rebuilt into readable TypeScript/React, with notes kept in:

- `codex-ui-component-knowledge-base.md`
- `codex-ui-inventory.md`
- `research/codex-internals/src/component-library/COMPONENT_SYSTEM.md`
- `research/codex-internals/src/component-library/component-system.json`

This project is independent and is not affiliated with, endorsed by, or sponsored by OpenAI.

## Roadmap

- Command palette and open-anything overlay.
- Sidebar thread virtualization and keyboard selection model.
- Full terminal resize/sync controller.
- Rich agent message rendering with tool calls, diffs, and attachments.
- More Radix-backed primitives: tooltip, popover, context menu, tabs, select, checkbox.
- Visual regression tests for transparent Electron shells.
- Package publishing pipeline and Storybook-style docs.

## Status

This is an early research preview. The public API is intentionally small, the internals are moving fast, and component fidelity improves as more extracted systems are converted into readable ports.

## License

MIT. See [LICENSE](./LICENSE).
