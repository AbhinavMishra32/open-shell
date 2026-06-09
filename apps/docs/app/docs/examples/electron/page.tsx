import { CodeBlock } from "@/components/CodeBlock";

export const metadata = {
  title: "Electron Shell Example",
  description: "Run the Electron example app.",
};

export default function ElectronExamplePage() {
  return (
    <article className="docs-page-shell">
      <p className="docs-kicker">Example app</p>
      <h1>Electron Shell</h1>
      <p className="docs-lede">
        The example app lives beside the package and imports `@opaline/ui` exactly like an external app would. It is
        the fastest place to test shell-level changes before publishing or copying components into another product.
      </p>

      <section className="docs-section">
        <h2>Run it</h2>
        <CodeBlock
          code={`npm run start:example

# or during shell iteration
npm run dev -- --filter=@opaline/electron-example`}
        />
      </section>

      <section className="docs-section">
        <h2>Renderer entry</h2>
        <CodeBlock
          title="examples/electron-shell/src/renderer/App.tsx"
          code={`import { AppShell, Composer, Sidebar, ThreadSurface } from "@opaline/ui";

export function App() {
  return (
    <AppShell
      sidebar={<Sidebar items={items} projects={projects} />}
      main={<ThreadSurface title="Inspect Electron UI" messages={messages} />}
      composer={<Composer placeholder="Ask the agent..." />}
      rightPanel={<FileTree items={files} />}
      bottomPanel={<BottomPanel tabs={tabs} />}
    />
  );
}`}
        />
      </section>

      <section className="docs-section">
        <h2>What to copy</h2>
        <p>
          Copy the host-window configuration, the renderer entry, and the component imports. Keep the business logic,
          data loaders, auth, and IPC specific to your app.
        </p>
      </section>
    </article>
  );
}
