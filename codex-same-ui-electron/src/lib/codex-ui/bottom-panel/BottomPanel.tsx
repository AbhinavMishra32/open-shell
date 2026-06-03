import * as Tabs from "@radix-ui/react-tabs";
import type { CSSProperties, ReactNode } from "react";
import "./bottom-panel.css";

export type BottomPanelTab = {
  active?: boolean;
  closable?: boolean;
  content: ReactNode;
  icon?: ReactNode;
  id: string;
  title: string;
};

const DEFAULT_BOTTOM_PANEL_HEIGHT = 280;

export function clampBottomPanelHeight(height: number, mainContentHeight: number) {
  return Number.isFinite(height) ? Math.max(160, Math.min(height, mainContentHeight * 0.5)) : DEFAULT_BOTTOM_PANEL_HEIGHT;
}

export function BottomPanel({
  height = DEFAULT_BOTTOM_PANEL_HEIGHT,
  tabs,
}: {
  height?: number;
  tabs: BottomPanelTab[];
}) {
  const activeTab = tabs.find((tab) => tab.active) ?? tabs[0];

  if (activeTab == null) {
    return null;
  }

  return (
    <Tabs.Root
      className="codex-bottom-panel"
      data-app-shell-focus-area="bottom-panel"
      style={{ "--app-shell-bottom-panel-height": `${height}px` } as CSSProperties}
      value={activeTab.id}
    >
      <div className="codex-bottom-panel-resize-handle" aria-hidden="true" />
      <div className="codex-bottom-panel-inner">
        <div className="codex-bottom-panel-tabbar">
          <Tabs.List className="codex-bottom-panel-tabs" aria-label="Bottom panel tabs">
            {tabs.map((tab) => (
              <Tabs.Trigger key={tab.id} value={tab.id} className="codex-bottom-panel-tab" data-tab-id={tab.id}>
                {tab.icon != null ? <span className="codex-bottom-panel-tab-icon">{tab.icon}</span> : null}
                <span className="codex-bottom-panel-tab-title">{tab.title}</span>
                {tab.closable === true ? <span className="codex-bottom-panel-tab-close">×</span> : null}
              </Tabs.Trigger>
            ))}
          </Tabs.List>
          <div className="codex-bottom-panel-actions">
            <button className="codex-bottom-panel-action" type="button" aria-label="New terminal">
              +
            </button>
          </div>
        </div>
        {tabs.map((tab) => (
          <Tabs.Content key={tab.id} value={tab.id} className="codex-bottom-panel-outlet">
            {tab.content}
          </Tabs.Content>
        ))}
      </div>
    </Tabs.Root>
  );
}

export function TerminalSurface({ children, cwd }: { children: ReactNode; cwd?: string }) {
  return (
    <div className="codex-terminal-surface" data-codex-terminal="true">
      <div className="codex-terminal-header">
        <span className="codex-terminal-dot" />
        <span>{cwd ?? "~/solin/general/desktop-agent-app"}</span>
      </div>
      <pre className="codex-terminal-buffer">{children}</pre>
    </div>
  );
}
