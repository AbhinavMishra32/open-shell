import { CodeBlock } from "@/components/CodeBlock";

export const metadata = {
  title: "Pages & History",
  description: "How Open Shell apps wire pages and navigation history into AppShell.",
};

export default function PagesPage() {
  return (
    <article className="docs-page-shell">
      <p className="docs-kicker">App navigation</p>
      <h1>Pages & History</h1>
      <p className="docs-lede">
        AppShell owns the native desktop placement for sidebar controls. Apps can pass a shared `useShellHistory`
        controller into the shell so every route, page, editor tab, settings section, or tool surface can participate
        in one back/forward system.
      </p>

      <section className="docs-section">
        <h2>Shell wiring</h2>
        <CodeBlock
          code={`const history = useShellHistory([
  { id: "thread:home", type: "thread", title: "Home" },
]);

<AppShell
  history={history}
  sidebar={<Sidebar projects={projects} items={threads} />}
  main={<CurrentPage />}
/>`}
        />
      </section>

      <section className="docs-section">
        <h2>Page contract</h2>
        <div className="docs-table">
          <div className="docs-table-row docs-table-head">
            <span>Surface</span>
            <span>Role</span>
          </div>
          <HistoryRow name="Route" copy="Owns URL, deep links, loader state, and document title." />
          <HistoryRow name="Tab" copy="Owns local workspace selection such as thread, file, preview, or settings." />
          <HistoryRow name="Panel" copy="Pushes meaningful tool changes such as terminal/file tab activation." />
          <HistoryRow name="Settings" copy="Uses the same history controller when the sidebar changes into settings mode." />
          <HistoryRow name="Sidebar chrome" copy="Renders toggle, back, and forward in the native sidebar titlebar area." />
        </div>
      </section>
    </article>
  );
}

function HistoryRow({ copy, name }: { copy: string; name: string }) {
  return (
    <div className="docs-table-row">
      <code>{name}</code>
      <span>{copy}</span>
    </div>
  );
}
