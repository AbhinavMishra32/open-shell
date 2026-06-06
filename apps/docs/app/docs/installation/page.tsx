import { CodeBlock } from "@/components/CodeBlock";

export const metadata = {
  title: "Installation",
  description: "Install and configure Open Shell UI.",
};

export default function InstallationPage() {
  return (
    <article className="docs-page-shell">
      <p className="docs-kicker">Start here</p>
      <h1>Installation</h1>
      <p className="docs-lede">
        The package is designed to be copied into serious product repos like a component registry, then extended as
        your agent workflow becomes more specific.
      </p>

      <section className="docs-section">
        <h2>Install into an app</h2>
        <p>
          The recommended no-publish path is source installation. The installer copies the component system into your
          app so you can edit the files directly, just like a registry-driven component workflow.
        </p>
        <CodeBlock
          title="From this repo"
          code="npm run install:ui -- --target ../my-agent-app"
        />
        <CodeBlock
          title="From GitHub raw"
          code="curl -fsSL https://raw.githubusercontent.com/AbhinavMishra32/open-shell/main/scripts/install-open-shell-ui.mjs | node - --target ."
        />
      </section>

      <section className="docs-section">
        <h2>Choose the destination</h2>
        <CodeBlock
          code={`node scripts/install-open-shell-ui.mjs \\
  --target ../my-agent-app \\
  --out-dir src/components/ui/open-shell \\
  --force`}
        />
        <p>
          By default, files are copied into <code>src/components/open-shell</code>. The installer also writes an
          <code>INSTALL.md</code> beside the copied files with import notes for that target app.
        </p>
      </section>

      <section className="docs-section">
        <h2>Import styles once</h2>
        <p>
          Import the token sheet in your root layout, app entry, or renderer entry. If you install into the default
          directory, the import path looks like this:
        </p>
        <CodeBlock
          title="React entry"
          code={`import "@/components/open-shell/tokens/codex-theme.css";

import { AppShell, Composer, Sidebar, ThreadSurface } from "@/components/open-shell";`}
        />
      </section>

      <section className="docs-section">
        <h2>Alternative package import</h2>
        <p>
          Inside this monorepo, the Electron example imports the workspace package directly. That path is useful for
          local development, but source installation is the least-infrastructure path for external apps while the
          package is not published.
        </p>
        <CodeBlock
          code={`import "@open-shell/ui/styles.css";
import { AppShell, Composer, Sidebar, ThreadSurface } from "@open-shell/ui";`}
        />
      </section>

      <section className="docs-section">
        <h2>Use the shell</h2>
        <CodeBlock
          code={`<AppShell
  sidebar={<Sidebar items={[]} projects={projects} />}
  main={<ThreadSurface title="Launch review" messages={messages} />}
  composer={<Composer placeholder="Ask the agent to inspect this codebase..." />}
  rightPanel={<FileTree items={files} />}
  bottomPanel={<BottomPanel tabs={terminalTabs} />}
/>`}
        />
      </section>

      <section className="docs-section">
        <h2>Electron window notes</h2>
        <p>
          For translucent shells, the Electron host should opt into a transparent or visual-effect capable surface on
          macOS and keep the renderer body transparent. The example app already does this so downstream apps can copy
          the host shape first, then swap in their own product logic.
        </p>
        <CodeBlock
          title="BrowserWindow shape"
          code={`new BrowserWindow({
  titleBarStyle: "hiddenInset",
  trafficLightPosition: { x: 14, y: 14 },
  transparent: true,
  backgroundColor: "#00000000",
  visualEffectState: "active",
});`}
        />
      </section>
    </article>
  );
}
