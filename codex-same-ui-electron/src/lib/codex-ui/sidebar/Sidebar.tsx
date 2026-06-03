import { Button, IconButton, StatusDot } from "../primitives/Button";
import { CodexMark } from "../icons/CodexMark";
import "./sidebar.css";

export type SidebarItem = {
  active?: boolean;
  meta?: string;
  title: string;
};

export function Sidebar({ items }: { items: SidebarItem[] }) {
  return (
    <aside className="codex-sidebar app-shell-left-panel">
      <div className="codex-sidebar-drag" />
      <div className="codex-sidebar-header">
        <div className="codex-sidebar-brand">
          <CodexMark className="codex-sidebar-logo" />
          <span>Codex</span>
        </div>
        <IconButton aria-label="New chat" variant="secondary">
          +
        </IconButton>
      </div>

      <div className="codex-sidebar-search">Search threads and projects</div>

      <div className="codex-sidebar-primary">
        <button className="codex-sidebar-nav-item" data-active="true">
          <span>⌘</span>
          Home
        </button>
        <button className="codex-sidebar-nav-item">
          <span>▣</span>
          Workspaces
        </button>
        <button className="codex-sidebar-nav-item">
          <span>◌</span>
          Automations
        </button>
      </div>

      <span className="codex-sidebar-section-label">Today</span>
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
        <div className="codex-sidebar-runtime">
          <StatusDot tone="green" />
          <span>Library preview online</span>
        </div>
        <Button variant="ghost" size="small">
          Settings
        </Button>
      </div>
    </aside>
  );
}
