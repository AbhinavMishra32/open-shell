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
        <h2>Install the package</h2>
        <CodeBlock code="npm install @open-shell/ui" />
      </section>

      <section className="docs-section">
        <h2>Import styles once</h2>
        <p>
          Import the token sheet in your root layout, app entry, or renderer entry. Component-level CSS is bundled by
          the package exports.
        </p>
        <CodeBlock
          title="React entry"
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
