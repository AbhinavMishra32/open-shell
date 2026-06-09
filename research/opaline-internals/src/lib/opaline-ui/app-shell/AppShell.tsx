import type { ReactNode } from "react";
import { Button, IconButton, Pill, StatusDot } from "../primitives/Button";
import "./app-shell.css";

type AppShellProps = {
  bottomPanel?: ReactNode;
  composer: ReactNode;
  main: ReactNode;
  rightPanel?: ReactNode;
  sidebar: ReactNode;
};

export function AppShell({ bottomPanel, composer, main, rightPanel, sidebar }: AppShellProps) {
  return (
    <div className="opaline-app-shell">
      {sidebar}
      <main className="opaline-app-main">
        <div className="opaline-titlebar">
          <div className="opaline-window-drag" />
          <div className="opaline-titlebar-tabs">
            <button className="opaline-titlebar-tab" data-active="true">
              <span className="opaline-tab-dot" />
              Inspect Electron UI
            </button>
            <button className="opaline-titlebar-tab">Component knowledge-base</button>
          </div>
          <div className="opaline-titlebar-actions">
            <IconButton aria-label="Toggle sidebar">⌘</IconButton>
            <IconButton aria-label="More">•••</IconButton>
          </div>
        </div>

        <div className="opaline-toolbar">
          <div className="opaline-toolbar-title">
            <StatusDot tone="green" />
            <span>desktop-agent-app</span>
            <Pill>local</Pill>
          </div>
          <div className="opaline-toolbar-actions">
            <Button size="small" variant="secondary">
              Refresh
            </Button>
            <Button size="small" variant="ghost">
              Share
            </Button>
          </div>
        </div>

        <section className="opaline-workspace">
          <section className="opaline-content-frame">{main}</section>
          <aside className="opaline-right-panel">
            {rightPanel ?? (
              <>
                <div className="opaline-panel-header">
                  <span>Inspector</span>
                  <Pill>copied UI</Pill>
                </div>
                <div className="opaline-panel-card">
                  <span className="opaline-panel-label">Component source</span>
                  <strong>src/component-library</strong>
                  <p>Literal upstream assets are cataloged and wrapped for the readable app shell.</p>
                </div>
                <div className="opaline-panel-card">
                  <span className="opaline-panel-label">Mode</span>
                  <strong>Non-agent preview</strong>
                  <p>Static app behavior, same visual system target.</p>
                </div>
              </>
            )}
          </aside>
        </section>

        {bottomPanel}

        <section className="opaline-composer-frame">{composer}</section>
      </main>
    </div>
  );
}
