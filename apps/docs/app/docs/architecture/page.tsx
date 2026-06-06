import { CodeBlock } from "@/components/CodeBlock";

export const metadata = {
  title: "Architecture",
  description: "How Open Shell UI is organized.",
};

export default function ArchitecturePage() {
  return (
    <article className="docs-page-shell">
      <p className="docs-kicker">System design</p>
      <h1>Architecture</h1>
      <p className="docs-lede">
        Open Shell UI is a monorepo with a reusable package, a docs app, a runnable Electron example, and a research
        folder for implementation notes. The package is the public contract; the example app is proof that the
        contract can carry a full desktop workspace.
      </p>

      <section className="docs-section">
        <h2>Workspace layout</h2>
        <CodeBlock
          code={`open-shell
├─ apps/docs                 # Next + Fumadocs documentation and live previews
├─ packages/ui               # Public React component system
├─ examples/electron-shell   # Runnable Electron app consuming @open-shell/ui
└─ research/codex-internals  # Reverse-engineering notes and extracted references`}
        />
      </section>

      <section className="docs-section">
        <h2>Package layers</h2>
        <div className="docs-layer-stack">
          <Layer title="Tokens" copy="CSS variables for shell surfaces, text, shadows, motion, and panel treatment." />
          <Layer title="Primitives" copy="Radix-backed buttons, dialogs, dropdown menus, context menus, pills, and dots." />
          <Layer title="Composites" copy="Composer, Sidebar, FileTree, ThreadSurface, BottomPanel, FileBrowserPanel." />
          <Layer title="Shell" copy="AppShell coordinates sidebar, topbar, main slot, right rail, composer, and bottom panel." />
        </div>
      </section>

      <section className="docs-section">
        <h2>Design rule</h2>
        <p>
          Components are not ornamental wrappers. They carry behavior, density, keyboard affordances, panel rhythm,
          and visual continuity so product teams can ship agent workflows without rebuilding the operating surface.
        </p>
      </section>
    </article>
  );
}

function Layer({ copy, title }: { copy: string; title: string }) {
  return (
    <div className="docs-layer">
      <span>{title}</span>
      <p>{copy}</p>
    </div>
  );
}
