import { Button } from "../primitives/Button";
import { CodexMark } from "../icons/CodexMark";
import "./sidebar.css";

export type SidebarItem = {
  active?: boolean;
  meta?: string;
  title: string;
};

export function Sidebar({ items }: { items: SidebarItem[] }) {
  return (
    <aside className="codex-sidebar">
      <div className="codex-sidebar-drag" />
      <div className="codex-sidebar-header">
        <div className="codex-sidebar-brand">
          <CodexMark className="codex-sidebar-logo" />
          <span>Codex</span>
        </div>
        <Button aria-label="New chat" variant="soft">
          New
        </Button>
      </div>

      <nav className="codex-sidebar-list" aria-label="Threads">
        {items.map((item) => (
          <button
            key={item.title}
            className="codex-sidebar-item"
            data-active={item.active === true ? "true" : "false"}
          >
            <span className="codex-sidebar-item-title">{item.title}</span>
            {item.meta != null ? <span className="codex-sidebar-item-meta">{item.meta}</span> : null}
          </button>
        ))}
      </nav>

      <div className="codex-sidebar-footer">
        <span className="codex-sidebar-section-label">Reverse engineered system</span>
        <span className="codex-sidebar-footnote">Readable source from upstream UI chunks</span>
      </div>
    </aside>
  );
}
