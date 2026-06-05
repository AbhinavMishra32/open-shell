import { useCallback, useState } from "react";
import type { CSSProperties, PointerEvent as ReactPointerEvent, ReactNode } from "react";
import { CodexMark } from "../icons/CodexMark";
import { Pill } from "../primitives/Button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "../primitives/ContextMenu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../primitives/DropdownMenu";
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
  const [sidebarWidth, setSidebarWidth] = useState(300);
  const [isSidebarResizing, setIsSidebarResizing] = useState(false);
  const [isInspectorOpen, setIsInspectorOpen] = useState(true);
  const [isBottomPanelOpen, setIsBottomPanelOpen] = useState(bottomPanel != null);
  const resolvedRightPanel = rightPanel ?? (
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
  );
  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((value) => !value);
  }, []);
  const startSidebarResize = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      event.currentTarget.setPointerCapture(event.pointerId);
      setIsSidebarResizing(true);
      const startX = event.clientX;
      const startWidth = sidebarWidth;

      function move(pointerEvent: PointerEvent) {
        const nextWidth = Math.max(0, Math.min(520, startWidth + pointerEvent.clientX - startX));
        if (nextWidth < 240) {
          setIsSidebarOpen(false);
          return;
        }
        setIsSidebarOpen(true);
        setSidebarWidth(nextWidth);
      }

      function stop() {
        setIsSidebarResizing(false);
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", stop);
      }

      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", stop, { once: true });
    },
    [sidebarWidth],
  );

  return (
    <div
      className="codex-app-shell"
      data-sidebar-open={isSidebarOpen ? "true" : "false"}
      style={{ "--codex-left-panel-width": `${sidebarWidth}px` } as CSSProperties}
    >
      <ShellChromeControls isSidebarOpen={isSidebarOpen} onToggleSidebar={toggleSidebar} />
      {!isSidebarOpen ? (
        <button className="codex-sidebar-reopen-button" type="button" aria-label="Show sidebar" onClick={toggleSidebar}>
          <SidebarToggleIcon />
        </button>
      ) : null}
      <aside
        className="codex-left-panel app-shell-left-panel"
        data-open={isSidebarOpen ? "true" : "false"}
        data-resizing={isSidebarResizing ? "true" : "false"}
      >
        <div className="codex-left-panel-inner">{sidebar}</div>
        <div
          className="codex-sidebar-resize-handle"
          role="separator"
          aria-orientation="vertical"
          aria-disabled={!isSidebarOpen}
          onPointerDown={isSidebarOpen ? startSidebarResize : undefined}
        >
          <div className="codex-sidebar-resize-handle-line" />
        </div>
      </aside>
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
          <HeaderChromeActions
            isBottomPanelOpen={isBottomPanelOpen}
            isInspectorOpen={isInspectorOpen}
            onToggleBottomPanel={() => setIsBottomPanelOpen((value) => !value)}
            onToggleInspector={() => setIsInspectorOpen((value) => !value)}
          />
        </header>

        <section className="codex-workspace" data-right-panel-open={isInspectorOpen ? "true" : "false"}>
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
          <aside
            className="codex-right-panel-slot"
            data-open={isInspectorOpen ? "true" : "false"}
            data-app-shell-focus-area="right-panel"
          >
            <div className="codex-right-panel">
              {resolvedRightPanel}
            </div>
          </aside>
        </section>

        {bottomPanel != null ? (
          <section
            className="codex-bottom-panel-slot"
            data-open={isBottomPanelOpen ? "true" : "false"}
            data-app-shell-focus-area="bottom-panel"
          >
            <div className="codex-bottom-panel-slot-inner">
              {bottomPanel}
            </div>
          </section>
        ) : null}
      </main>
    </div>
  );
}

function HeaderChromeActions({
  isBottomPanelOpen,
  isInspectorOpen,
  onToggleBottomPanel,
  onToggleInspector,
}: {
  isBottomPanelOpen: boolean;
  isInspectorOpen: boolean;
  onToggleBottomPanel: () => void;
  onToggleInspector: () => void;
}) {
  return (
    <div className="codex-app-header-actions">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="codex-header-agent-button" type="button" aria-label="Select attached app">
            <span className="codex-header-agent-icon">
              <CodexMark className="codex-header-agent-mark" />
            </span>
            <ChevronDownIcon />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="codex-header-agent-menu">
          <DropdownMenuItem>Attach Electron</DropdownMenuItem>
          <DropdownMenuItem>Open app picker</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <button className="codex-header-tool-button" type="button" aria-label="Inspect thread activity">
        <ActivityIcon />
      </button>
      <button
        className="codex-header-tool-button"
        data-active={isBottomPanelOpen ? "true" : "false"}
        type="button"
        aria-label={isBottomPanelOpen ? "Hide bottom panel" : "Show bottom panel"}
        onClick={onToggleBottomPanel}
      >
        <BottomPanelIcon />
      </button>
      <button
        className="codex-header-tool-button"
        data-active={isInspectorOpen ? "true" : "false"}
        type="button"
        aria-label={isInspectorOpen ? "Hide inspector" : "Show inspector"}
        onClick={onToggleInspector}
      >
        <RightPanelIcon />
      </button>
      <button className="codex-header-tool-button codex-header-tool-button-plain" type="button" aria-label="More">
        <MoreIcon />
      </button>
    </div>
  );
}

function ShellChromeControls({
  isSidebarOpen,
  onToggleSidebar,
}: {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}) {
  return (
    <div className="codex-shell-chrome-controls">
      {isSidebarOpen ? (
        <button className="codex-shell-chrome-button" aria-label="Hide sidebar" onClick={onToggleSidebar}>
          <SidebarToggleIcon />
        </button>
      ) : (
        <span className="codex-shell-chrome-spacer" aria-hidden="true" />
      )}
      <button className="codex-shell-chrome-button" aria-label="Back">
        <BackIcon />
      </button>
      <button className="codex-shell-chrome-button" aria-label="Forward" data-muted="true">
        <ForwardIcon />
      </button>
      {!isSidebarOpen ? (
        <button className="codex-shell-chrome-button" aria-label="New chat">
          <NewChatIcon />
        </button>
      ) : null}
    </div>
  );
}

function SidebarToggleIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path
        d="M6.83496 3.99992C6.38353 4.00411 6.01421 4.0122 5.69824 4.03801C5.31232 4.06954 5.03904 4.12266 4.82227 4.20012L4.62207 4.28606C4.18264 4.50996 3.81498 4.85035 3.55859 5.26848L3.45605 5.45207C3.33013 5.69922 3.25006 6.01354 3.20801 6.52824C3.16533 7.05065 3.16504 7.71885 3.16504 8.66301V11.3271C3.16504 12.2712 3.16533 12.9394 3.20801 13.4618C3.25006 13.9766 3.33013 14.2909 3.45605 14.538L3.55859 14.7216C3.81498 15.1397 4.18266 15.4801 4.62207 15.704L4.82227 15.79C5.03904 15.8674 5.31234 15.9205 5.69824 15.9521C6.01398 15.9779 6.383 15.986 6.83398 15.9902L6.83496 3.99992ZM18.165 11.3271C18.165 12.2493 18.1653 12.9811 18.1172 13.5702C18.0745 14.0924 17.9916 14.5472 17.8125 14.9648L17.7295 15.1415C17.394 15.8 16.8834 16.3511 16.2568 16.7353L15.9814 16.8896C15.5157 17.1268 15.0069 17.2285 14.4102 17.2773C13.821 17.3254 13.0893 17.3251 12.167 17.3251H7.83301C6.91071 17.3251 6.17898 17.3254 5.58984 17.2773C5.06757 17.2346 4.61294 17.1508 4.19531 16.9716L4.01855 16.8896C3.36014 16.5541 2.80898 16.0434 2.4248 15.4169L2.27051 15.1415C2.03328 14.6758 1.93158 14.167 1.88281 13.5702C1.83468 12.9811 1.83496 12.2493 1.83496 11.3271V8.66301C1.83496 7.74072 1.83468 7.00898 1.88281 6.41985C1.93157 5.82309 2.03329 5.31432 2.27051 4.84856L2.4248 4.57317C2.80898 3.94666 3.36012 3.436 4.01855 3.10051L4.19531 3.0175C4.61285 2.83843 5.06771 2.75548 5.58984 2.71281C6.17898 2.66468 6.91071 2.66496 7.83301 2.66496H12.167C13.0893 2.66496 13.821 2.66468 14.4102 2.71281C15.0069 2.76157 15.5157 2.86329 15.9814 3.10051L16.2568 3.25481C16.8833 3.63898 17.394 4.19012 17.7295 4.84856L17.8125 5.02531C17.9916 5.44285 18.0745 5.89771 18.1172 6.41985C18.1653 7.00898 18.165 7.74072 18.165 8.66301V11.3271ZM8.16406 15.995H12.167C13.1112 15.995 13.7794 15.9947 14.3018 15.9521C14.8164 15.91 15.1308 15.8299 15.3779 15.704L15.5615 15.6015C15.9797 15.3451 16.32 14.9774 16.5439 14.538L16.6299 14.3378C16.7074 14.121 16.7605 13.8478 16.792 13.4618C16.8347 12.9394 16.835 12.2712 16.835 11.3271V8.66301C16.835 7.71885 16.8347 7.05065 16.792 6.52824C16.7605 6.14232 16.7073 5.86904 16.6299 5.65227L16.5439 5.45207C16.32 5.01264 15.9796 4.64498 15.5615 4.3886L15.3779 4.28606C15.1308 4.16013 14.8165 4.08006 14.3018 4.03801C13.7794 3.99533 13.1112 3.99504 12.167 3.99504H8.16406C8.16407 3.99667 8.16504 3.99829 8.16504 3.99992L8.16406 15.995Z"
        fill="currentColor"
      />
    </svg>
  );
}

function BackIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M12.75 4.5 7.25 10l5.5 5.5" />
      <path d="M7.75 10h8" />
    </svg>
  );
}

function ForwardIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="m7.25 4.5 5.5 5.5-5.5 5.5" />
      <path d="M12.25 10h-8" />
    </svg>
  );
}

function NewChatIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M4.5 15.5h8.75a2.25 2.25 0 0 0 2.25-2.25V9.5" />
      <path d="M4.5 15.5V6.75A2.25 2.25 0 0 1 6.75 4.5h3.75" />
      <path d="M12.25 3.75h4" />
      <path d="M14.25 1.75v4" />
      <path d="m7 13 5.75-5.75" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="m5.75 7.75 4.25 4.25 4.25-4.25" />
    </svg>
  );
}

function ActivityIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M5.25 4.5a1.75 1.75 0 1 1-3.5 0 1.75 1.75 0 0 1 3.5 0Z" />
      <path d="M5.25 15.5a1.75 1.75 0 1 1-3.5 0 1.75 1.75 0 0 1 3.5 0Z" />
      <path d="M18.25 4.5h-9.5" />
      <path d="M18.25 15.5h-9.5" />
      <path d="M12.25 10h6" />
      <path d="M1.75 10h6" />
      <path d="M10 7.75v4.5" />
    </svg>
  );
}

function BottomPanelIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <rect x="2.75" y="3.5" width="14.5" height="13" rx="2.4" />
      <path d="M3.5 12.25h13" />
    </svg>
  );
}

function RightPanelIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <rect x="2.75" y="3.5" width="14.5" height="13" rx="2.4" />
      <path d="M12.25 4v12" />
    </svg>
  );
}

function MoreIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <circle cx="4.5" cy="10" r="1.25" fill="currentColor" />
      <circle cx="10" cy="10" r="1.25" fill="currentColor" />
      <circle cx="15.5" cy="10" r="1.25" fill="currentColor" />
    </svg>
  );
}
