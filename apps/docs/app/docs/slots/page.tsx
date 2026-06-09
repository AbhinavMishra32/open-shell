import { CodeBlock } from "@/components/CodeBlock";

export const metadata = {
  title: "Slots System",
  description: "How shell slots compose in Opaline UI.",
};

export default function SlotsPage() {
  return (
    <article className="docs-page-shell">
      <p className="docs-kicker">Composition model</p>
      <h1>Slots System</h1>
      <p className="docs-lede">
        The core abstraction is a shell with named slots. Slots are not vague children; each one has expected layout
        behavior, animation direction, density, and interaction responsibility.
      </p>

      <section className="docs-section">
        <h2>Shell contract</h2>
        <CodeBlock
          code={`type AppShellSlots = {
  sidebar: ReactNode;      // navigation, projects, threads
  main: ReactNode;         // conversation or editor
  composer?: ReactNode;    // optional active task input
  rightPanel?: ReactNode;  // inspector, file tree, review, side chat
  bottomPanel?: ReactNode; // terminal, files, logs, diagnostics
};`}
        />
      </section>

      <section className="docs-section">
        <h2>Slot responsibilities</h2>
        <div className="docs-table">
          <div className="docs-table-row docs-table-head">
            <span>Slot</span>
            <span>Responsibility</span>
          </div>
          <SlotRow name="sidebar" copy="Discovery: projects, active chats, global commands, and settings." />
          <SlotRow name="main" copy="Primary state: conversation, file diff, editor, browser, or task view." />
          <SlotRow name="composer" copy="Optional intent capture: model, permission, tools, attachments, and submit." />
          <SlotRow name="rightPanel" copy="Context: file tree, inspector, review pane, side chat, or debugger." />
          <SlotRow name="bottomPanel" copy="Execution: terminal, files, logs, shell output, and diagnostics." />
        </div>
      </section>

      <section className="docs-section">
        <h2>Why slots matter</h2>
        <p>
          Agent products frequently need to surface work context without losing the current conversation. The slot
          contract makes panels predictable: a terminal should animate from the bottom, a file tree should feel like a
          right rail, and any optional composer should stay connected to the active workspace.
        </p>
      </section>
    </article>
  );
}

function SlotRow({ copy, name }: { copy: string; name: string }) {
  return (
    <div className="docs-table-row">
      <code>{name}</code>
      <span>{copy}</span>
    </div>
  );
}
