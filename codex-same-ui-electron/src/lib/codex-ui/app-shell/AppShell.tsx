import type { ReactNode } from "react";
import { Button, IconButton, Pill, StatusDot } from "../primitives/Button";
import "./app-shell.css";

type AppShellProps = {
  composer: ReactNode;
  main: ReactNode;
  rightPanel?: ReactNode;
  sidebar: ReactNode;
};

export function AppShell({ composer, main, rightPanel, sidebar }: AppShellProps) {
  return (
    <div className="codex-app-shell">
      {sidebar}
      <main className="codex-app-main">
        <div className="codex-titlebar">
          <div className="codex-window-drag" />
          <div className="codex-titlebar-tabs">
            <button className="codex-titlebar-tab" data-active="true">
              <span className="codex-tab-dot" />
              Inspect Electron UI
            </button>
            <button className="codex-titlebar-tab">Component knowledge-base</button>
          </div>
          <div className="codex-titlebar-actions">
            <IconButton aria-label="Toggle sidebar">⌘</IconButton>
            <IconButton aria-label="More">•••</IconButton>
          </div>
        </div>

        <div className="codex-toolbar">
          <div className="codex-toolbar-title">
            <StatusDot tone="green" />
            <span>desktop-agent-app</span>
            <Pill>local</Pill>
          </div>
          <div className="codex-toolbar-actions">
            <Button size="small" variant="secondary">
              Refresh
            </Button>
            <Button size="small" variant="ghost">
              Share
            </Button>
          </div>
        </div>

        <section className="codex-workspace">
          <section className="codex-content-frame">{main}</section>
          <aside className="codex-right-panel">
            {rightPanel ?? (
              <>
                <div className="codex-panel-header">
                  <span>Inspector</span>
                  <Pill>copied UI</Pill>
                </div>
                <div className="codex-panel-card">
                  <span className="codex-panel-label">Component source</span>
                  <strong>src/component-library</strong>
                  <p>Literal upstream assets are cataloged and wrapped for the readable app shell.</p>
                </div>
                <div className="codex-panel-card">
                  <span className="codex-panel-label">Mode</span>
                  <strong>Non-agent preview</strong>
                  <p>Static app behavior, same visual system target.</p>
                </div>
              </>
            )}
          </aside>
        </section>

        <section className="codex-composer-frame">{composer}</section>
      </main>
    </div>
  );
}
