import { cloneElement, isValidElement, useCallback, useState } from "react";
import type { PointerEvent as ReactPointerEvent, ReactElement, ReactNode } from "react";
import { IconButton, Pill } from "../primitives/Button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "../primitives/ContextMenu";
import "./app-shell.css";

type AppShellProps = {
  bottomPanel?: ReactNode;
  composer: ReactNode;
  headerTabs?: Array<{ active?: boolean; dirty?: boolean; id: string; title: string }>;
  main: ReactNode;
  rightPanel?: ReactNode;
  sidebar: ReactNode;
};

export function AppShell({
  bottomPanel,
  composer,
  headerTabs = [
    { active: true, dirty: true, id: "inspect-electron-ui", title: "Inspect Electron UI" },
    { id: "component-knowledge-base", title: "Component knowledge-base" },
  ],
  main,
  rightPanel,
  sidebar,
}: AppShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState(252);
  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((value) => !value);
  }, []);
  const sidebarElement =
    isValidElement(sidebar) && typeof sidebar.type !== "string"
      ? cloneElement(sidebar as ReactElement<{ onToggleSidebar?: () => void }>, { onToggleSidebar: toggleSidebar })
      : sidebar;
  const startSidebarResize = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      event.currentTarget.setPointerCapture(event.pointerId);
      const startX = event.clientX;
      const startWidth = sidebarWidth;

      function move(pointerEvent: PointerEvent) {
        const nextWidth = Math.max(0, Math.min(360, startWidth + pointerEvent.clientX - startX));
        if (nextWidth < 240) {
          setIsSidebarOpen(false);
          return;
        }
        setIsSidebarOpen(true);
        setSidebarWidth(nextWidth);
      }

      function stop() {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", stop);
      }

      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", stop, { once: true });
    },
    [sidebarWidth],
  );

  return (
    <div className="codex-app-shell">
      {isSidebarOpen ? (
        <aside className="codex-left-panel" style={{ width: sidebarWidth }}>
          {sidebarElement}
          <div
            className="codex-sidebar-resize-handle"
            role="separator"
            aria-orientation="vertical"
            onPointerDown={startSidebarResize}
          >
            <div className="codex-sidebar-resize-handle-line" />
          </div>
        </aside>
      ) : null}
      <main className="codex-app-main">
        <header className="codex-app-header" data-app-shell-header-edge-scroll="false">
          <div className="codex-app-header-context-surface" data-testid="app-shell-header-context-menu-surface">
            <div className="codex-app-tab-strip" data-app-shell-tab-strip-controller="main">
              {headerTabs.map((tab, index) => (
                <ContextMenu key={tab.id}>
                  <ContextMenuTrigger asChild>
                    <button
                      className="codex-app-tab"
                      data-active={tab.active === true ? "true" : undefined}
                      data-app-shell-tab-controller="main"
                      data-tab-id={tab.id}
                      type="button"
                    >
                      {tab.dirty === true ? <span className="codex-tab-dot" /> : null}
                      <span className="codex-app-tab-title">{tab.title}</span>
                    </button>
                  </ContextMenuTrigger>
                  <ContextMenuContent alignOffset={index === 0 ? 0 : -10}>
                    <ContextMenuItem>Close tab</ContextMenuItem>
                    <ContextMenuItem>Close other tabs</ContextMenuItem>
                    <ContextMenuItem>Copy link</ContextMenuItem>
                    <ContextMenuSeparator />
                    <ContextMenuItem>Move tab to new window</ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              ))}
            </div>
          </div>
          <div className="codex-app-header-actions">
            {!isSidebarOpen ? <IconButton aria-label="Show sidebar" onClick={toggleSidebar}>▣</IconButton> : null}
            <IconButton aria-label="Keyboard shortcuts">⌘</IconButton>
            <IconButton aria-label="More">•••</IconButton>
          </div>
        </header>

        <section className="codex-workspace">
          <section className="codex-main-content-viewport" data-app-shell-main-content-layout="main">
            <div className="codex-main-content-frame">
              <div
                aria-hidden="true"
                className="codex-app-shell-main-content-top-fade"
                data-app-shell-main-content-top-fade="false"
              />
              <section className="codex-content-frame">{main}</section>
              <section className="codex-composer-frame">{composer}</section>
            </div>
          </section>
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

        {bottomPanel}
      </main>
    </div>
  );
}
