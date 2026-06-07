"use client";

import Link from "next/link";
import { AppShell, BottomPanel, Composer, FileTree, Sidebar, TerminalSurface, ThreadSurface } from "@open-shell/ui";
import { componentDocs } from "@/lib/component-docs";

const previewProjects = [
  {
    id: "launch",
    label: "launch-lab",
    threads: [{ active: true, id: "main", meta: "⌘1", title: "Design agent workspace" }],
  },
  {
    id: "ops",
    label: "ops-console",
    threads: [{ id: "review", meta: "⌘2", title: "Review file changes" }],
  },
];

const fileTree = [
  {
    children: [
      { gitStatus: "modified" as const, name: "AppShell.tsx", path: "packages/ui/src/app-shell/AppShell.tsx" },
      { gitStatus: "modified" as const, name: "Composer.tsx", path: "packages/ui/src/composer/Composer.tsx" },
      { name: "Sidebar.tsx", path: "packages/ui/src/sidebar/Sidebar.tsx" },
    ],
    name: "components",
    path: "packages/ui/src",
    type: "directory" as const,
  },
  { gitStatus: "modified" as const, name: "README.md", path: "README.md", selected: true },
];

export default function HomePage() {
  return (
    <main className="landing-page">
      <section className="landing-hero">
        <div className="landing-hero-copy">
          <p className="landing-eyebrow">Agent-native interface system</p>
          <h1>Build desktop-grade AI products without rebuilding the shell every time.</h1>
          <p className="landing-lede">
            Open Shell UI is a React component system for founders and engineers building high-context agent
            workspaces: translucent shells, live terminals, file trees, review panes, command menus, and dense
            composer interactions.
          </p>
          <div className="landing-actions">
            <Link className="landing-primary-action" href="/docs">
              Read the docs
            </Link>
            <Link className="landing-secondary-action" href="/docs/components/app-shell">
              Explore components
            </Link>
          </div>
          <div className="landing-install">
            <span>Install</span>
            <code>npm install @open-shell/ui</code>
          </div>
        </div>

        <div className="landing-shell-card" aria-label="Open Shell UI preview">
          <AppShell
            sidebar={<Sidebar items={[]} projects={previewProjects} />}
            main={
              <ThreadSurface
                title="Design agent workspace"
                messages={[
                  {
                    body: "Mapped the shell slots and generated the live component docs. The example app now runs from the same primitives.",
                    role: "assistant",
                    status: "Component system ready",
                  },
                  {
                    body: "Make it feel like a serious product engineering cockpit.",
                    role: "user",
                  },
                ]}
              />
            }
            composer={<Composer placeholder="Ask the agent to ship a component..." />}
            rightPanel={<FileTree items={fileTree} />}
            bottomPanel={
              <BottomPanel
                tabs={[
                  {
                    active: true,
                    content: <TerminalSurface />,
                    id: "terminal",
                    title: "open-shell",
                  },
                ]}
              />
            }
          />
        </div>
      </section>

      <section className="landing-section">
        <div className="landing-section-header">
          <p className="landing-eyebrow">Composable by design</p>
          <h2>The shell is the product surface.</h2>
          <p>
            Instead of isolated buttons and cards, the library documents the full layout grammar: where panels dock,
            how sidebars collapse, how context menus feel, and how an agent composer should coexist with files,
            terminals, and review state.
          </p>
        </div>
        <div className="landing-feature-grid">
          <Feature title="Shell slots" copy="Left, main, composer, right rail, and bottom panel are explicit slots." />
          <Feature title="Radix spine" copy="Menus, dialogs, tabs, and slots are built over Radix primitives." />
          <Feature title="Live docs" copy="Every component page renders a real interactive preview from the package." />
          <Feature title="Electron ready" copy="The example app consumes the package exactly like downstream apps will." />
        </div>
      </section>

      <section className="landing-section">
        <div className="landing-section-header">
          <p className="landing-eyebrow">Component inventory</p>
          <h2>Everything starts as a documented primitive.</h2>
        </div>
        <div className="landing-component-grid">
          {componentDocs.map((component) => (
            <Link href={`/docs/components/${component.slug}`} key={component.slug} className="landing-component-card">
              <span>{component.category}</span>
              <strong>{component.title}</strong>
              <p>{component.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

function Feature({ copy, title }: { copy: string; title: string }) {
  return (
    <article className="landing-feature-card">
      <span className="landing-feature-dot" />
      <h3>{title}</h3>
      <p>{copy}</p>
    </article>
  );
}
