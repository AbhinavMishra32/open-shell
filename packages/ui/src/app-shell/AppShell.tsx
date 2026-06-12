import { useCallback, useState } from "react";
import type { ButtonHTMLAttributes, CSSProperties, HTMLAttributes, PointerEvent as ReactPointerEvent, ReactNode } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
} from "../primitives/ContextMenu";
import { ShellHistoryProvider } from "../history/ShellHistory";
import type { ShellHistoryController } from "../history/ShellHistory";
import "./app-shell.css";

export type AppShellTabItem = {
  active?: boolean;
  dirty?: boolean;
  id: string;
  title: ReactNode;
};

export type AppShellState = {
  canNavigateBack: boolean;
  canNavigateForward: boolean;
  canNavigateHome: boolean;
  history?: ShellHistoryController<any>;
  isBottomPanelOpen: boolean;
  isRightPanelOpen: boolean;
  isSidebarOpen: boolean;
  navigateBack: () => void;
  navigateForward: () => void;
  navigateHome: () => void;
  setBottomPanelOpen: (open: boolean) => void;
  setRightPanelOpen: (open: boolean) => void;
  setSidebarOpen: (open: boolean) => void;
  toggleBottomPanel: () => void;
  toggleRightPanel: () => void;
  toggleSidebar: () => void;
};

export type AppShellProps = {
  bottomPanel?: ReactNode | ((state: AppShellState) => ReactNode);
  canNavigateBack?: boolean;
  canNavigateForward?: boolean;
  chromeControls?: ReactNode | ((state: AppShellState) => ReactNode);
  composer?: ReactNode;
  collapsedSidebarTrigger?: ReactNode | ((state: AppShellState) => ReactNode);
  defaultBottomPanelOpen?: boolean;
  defaultRightPanelOpen?: boolean;
  defaultSidebarOpen?: boolean;
  defaultSidebarWidth?: number;
  headerActions?: ReactNode | ((state: AppShellState) => ReactNode);
  headerTabs?: AppShellTabItem[];
  history?: ShellHistoryController<any>;
  main: ReactNode;
  renderHeaderTab?: (tab: AppShellTabItem, state: AppShellState) => ReactNode;
  renderHeaderTabActions?: (tab: AppShellTabItem, state: AppShellState) => ReactNode;
  renderHeaderTabMenu?: (tab: AppShellTabItem, state: AppShellState) => ReactNode;
  rightPanel?: ReactNode;
  sidebar: ReactNode;
  sidebarChrome?: ReactNode | ((state: AppShellState) => ReactNode);
  sidebarMaxWidth?: number;
  sidebarMinWidth?: number;
  showSidebarChrome?: boolean;
  defaultRightPanelWidth?: number;
  rightPanelMinWidth?: number;
  rightPanelMaxWidth?: number;
  onNavigateBack?: () => void;
  onNavigateForward?: () => void;
  onNavigateHome?: () => void;
};

export type AppShellSlotProps = HTMLAttributes<HTMLDivElement>;
export type AppShellButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function AppShell({
  bottomPanel,
  canNavigateBack,
  canNavigateForward,
  chromeControls,
  composer,
  collapsedSidebarTrigger,
  defaultBottomPanelOpen,
  defaultRightPanelOpen,
  defaultSidebarOpen = true,
  defaultSidebarWidth = 260,
  headerActions,
  headerTabs = [],
  history,
  main,
  renderHeaderTab,
  renderHeaderTabActions,
  renderHeaderTabMenu,
  rightPanel,
  sidebar,
  sidebarChrome,
  sidebarMaxWidth = 520,
  sidebarMinWidth = 240,
  showSidebarChrome = true,
  defaultRightPanelWidth = 292,
  rightPanelMinWidth = 240,
  rightPanelMaxWidth = 600,
  onNavigateBack,
  onNavigateForward,
  onNavigateHome,
}: AppShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(defaultSidebarOpen);
  const [sidebarWidth, setSidebarWidth] = useState(defaultSidebarWidth);
  const [isSidebarResizing, setIsSidebarResizing] = useState(false);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(defaultRightPanelOpen ?? rightPanel != null);
  const [rightPanelWidth, setRightPanelWidth] = useState(defaultRightPanelWidth);
  const [isRightPanelResizing, setIsRightPanelResizing] = useState(false);
  const [isBottomPanelOpen, setIsBottomPanelOpen] = useState(defaultBottomPanelOpen ?? bottomPanel != null);
  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((value) => !value);
  }, []);
  const toggleRightPanel = useCallback(() => {
    setIsRightPanelOpen((value) => !value);
  }, []);
  const toggleBottomPanel = useCallback(() => {
    setIsBottomPanelOpen((value) => !value);
  }, []);
  const resolvedCanNavigateBack = canNavigateBack ?? history?.canGoBack ?? false;
  const resolvedCanNavigateForward = canNavigateForward ?? history?.canGoForward ?? false;
  const navigateBack = useCallback(() => {
    if (onNavigateBack != null) {
      onNavigateBack();
      return;
    }

    history?.goBack();
  }, [history, onNavigateBack]);
  const navigateForward = useCallback(() => {
    if (onNavigateForward != null) {
      onNavigateForward();
      return;
    }

    history?.goForward();
  }, [history, onNavigateForward]);
  const navigateHome = useCallback(() => {
    onNavigateHome?.();
  }, [onNavigateHome]);

  // Panels are toggled explicitly by the user — we no longer auto-open
  // them whenever their content slot changes.

  const shellState: AppShellState = {
    canNavigateBack: resolvedCanNavigateBack,
    canNavigateForward: resolvedCanNavigateForward,
    canNavigateHome: onNavigateHome != null,
    history,
    isBottomPanelOpen,
    isRightPanelOpen,
    isSidebarOpen,
    navigateBack,
    navigateForward,
    navigateHome,
    setBottomPanelOpen: setIsBottomPanelOpen,
    setRightPanelOpen: setIsRightPanelOpen,
    setSidebarOpen: setIsSidebarOpen,
    toggleBottomPanel,
    toggleRightPanel,
    toggleSidebar,
  };
  const startSidebarResize = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      event.currentTarget.setPointerCapture(event.pointerId);
      setIsSidebarResizing(true);
      const startX = event.clientX;
      const startWidth = sidebarWidth;

      function move(pointerEvent: PointerEvent) {
        const nextWidth = Math.max(0, Math.min(sidebarMaxWidth, startWidth + pointerEvent.clientX - startX));
        if (nextWidth < sidebarMinWidth) {
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
    [sidebarMaxWidth, sidebarMinWidth, sidebarWidth],
  );
  const startRightPanelResize = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      event.currentTarget.setPointerCapture(event.pointerId);
      setIsRightPanelResizing(true);
      const startX = event.clientX;
      const startWidth = rightPanelWidth;

      function move(pointerEvent: PointerEvent) {
        const nextWidth = Math.max(0, Math.min(rightPanelMaxWidth, startWidth - (pointerEvent.clientX - startX)));
        if (nextWidth < rightPanelMinWidth) {
          setIsRightPanelOpen(false);
          return;
        }
        setIsRightPanelOpen(true);
        setRightPanelWidth(nextWidth);
      }

      function stop() {
        setIsRightPanelResizing(false);
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", stop);
      }

      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", stop, { once: true });
    },
    [rightPanelMaxWidth, rightPanelMinWidth, rightPanelWidth],
  );

  const shell = (
    <div
      className="opaline-app-shell"
      data-sidebar-open={isSidebarOpen ? "true" : "false"}
      style={
        {
          "--opaline-left-panel-max-width": `${sidebarMaxWidth}px`,
          "--opaline-left-panel-min-content": `${sidebarMinWidth + 80}px`,
          "--opaline-left-panel-width": `${sidebarWidth}px`,
          "--opaline-right-panel-width": `${rightPanelWidth}px`,
        } as CSSProperties
      }
    >
      {chromeControls != null ? <AppShellChromeControls>{resolveSlot(chromeControls, shellState)}</AppShellChromeControls> : null}
      <aside
        className="opaline-left-panel app-shell-left-panel"
        data-open={isSidebarOpen ? "true" : "false"}
        data-resizing={isSidebarResizing ? "true" : "false"}
      >
        {showSidebarChrome ? (
          <AppShellSidebarChrome>
            {sidebarChrome != null ? resolveSlot(sidebarChrome, shellState) : <DefaultSidebarChrome state={shellState} />}
          </AppShellSidebarChrome>
        ) : null}
        <div className="opaline-left-panel-inner">{sidebar}</div>
        <div
          className="opaline-sidebar-resize-handle"
          role="separator"
          aria-orientation="vertical"
          aria-disabled={!isSidebarOpen}
          onPointerDown={isSidebarOpen ? startSidebarResize : undefined}
        >
          <div className="opaline-sidebar-resize-handle-line" />
        </div>
      </aside>
      <main className="opaline-app-main">
        <AppShellHeader>
          {collapsedSidebarTrigger != null ? (
            <div className="opaline-sidebar-reopen-button">{resolveSlot(collapsedSidebarTrigger, shellState)}</div>
          ) : null}
          <AppShellHeaderContextSurface>
            <AppShellTabStrip>
              {headerTabs.map((tab, index) => (
                <AppShellTabController data-tab-id={tab.id} key={tab.id}>
                  <ContextMenu>
                    <ContextMenuTrigger asChild>
                      {renderHeaderTab?.(tab, shellState) ?? <AppShellTab tab={tab} />}
                    </ContextMenuTrigger>
                    {renderHeaderTabMenu != null ? (
                      <ContextMenuContent alignOffset={index === 0 ? 0 : -10}>
                        {renderHeaderTabMenu(tab, shellState)}
                      </ContextMenuContent>
                    ) : null}
                  </ContextMenu>
                  {renderHeaderTabActions != null ? renderHeaderTabActions(tab, shellState) : null}
                </AppShellTabController>
              ))}
            </AppShellTabStrip>
          </AppShellHeaderContextSurface>
          {headerActions != null ? (
            <AppShellHeaderActions>{resolveSlot(headerActions, shellState)}</AppShellHeaderActions>
          ) : null}
        </AppShellHeader>

        <section className="opaline-workspace" data-right-panel-open={isRightPanelOpen && rightPanel != null ? "true" : "false"}>
          <section className="opaline-main-content-viewport" data-app-shell-main-content-layout="main">
            <div className="opaline-main-content-frame">
              <div
                aria-hidden="true"
                className="opaline-app-shell-main-content-top-fade"
                data-app-shell-main-content-top-fade="false"
              />
              <AppShellContent>{main}</AppShellContent>
              {composer != null ? <AppShellComposer>{composer}</AppShellComposer> : null}
            </div>
            {bottomPanel != null ? (
              <section
                className="opaline-bottom-panel-slot"
                data-open={isBottomPanelOpen ? "true" : "false"}
                data-app-shell-focus-area="bottom-panel"
              >
                <AppShellBottomPanel>{resolveSlot(bottomPanel, shellState)}</AppShellBottomPanel>
              </section>
            ) : null}
          </section>
          {rightPanel != null ? (
            <aside
              className="opaline-right-panel-slot"
              data-open={isRightPanelOpen ? "true" : "false"}
              data-resizing={isRightPanelResizing ? "true" : "false"}
              data-app-shell-focus-area="right-panel"
            >
              <div
                className="opaline-right-panel-resize-handle"
                role="separator"
                aria-orientation="vertical"
                aria-disabled={!isRightPanelOpen}
                onPointerDown={isRightPanelOpen ? startRightPanelResize : undefined}
              >
                <div className="opaline-right-panel-resize-handle-line" />
              </div>
              <AppShellRightPanel>{rightPanel}</AppShellRightPanel>
            </aside>
          ) : null}
        </section>
      </main>
    </div>
  );

  return history != null ? <ShellHistoryProvider history={history}>{shell}</ShellHistoryProvider> : shell;
}

export function AppShellChromeControls({ children, className, ...props }: AppShellSlotProps) {
  return (
    <div className={joinClassNames("opaline-shell-chrome-controls", className)} {...props}>
      {children}
    </div>
  );
}

export function AppShellSidebarChrome({ children, className, ...props }: AppShellSlotProps) {
  return (
    <div className={joinClassNames("opaline-sidebar-chrome", className)} {...props}>
      {children}
    </div>
  );
}

function DefaultSidebarChrome({ state }: { state: AppShellState }) {
  return <AppShellNavigationControls state={state} />;
}

export function AppShellNavigationControls({
  onHome,
  state,
  variant = "sidebar",
}: {
  onHome?: () => void;
  state: AppShellState;
  variant?: "collapsed" | "sidebar";
}) {
  const Control = variant === "collapsed" ? AppShellCollapsedSidebarTrigger : AppShellChromeButton;

  return (
    <>
      <Control
        aria-label={state.isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        onClick={state.toggleSidebar}
      >
        <SidebarToggleIcon />
      </Control>
      <Control
        aria-label="Home"
        disabled={onHome == null && !state.canNavigateHome}
        onClick={onHome ?? state.navigateHome}
      >
        <HomeIcon />
      </Control>
      <Control aria-label="Back" disabled={!state.canNavigateBack} onClick={state.navigateBack}>
        <BackIcon />
      </Control>
      <Control aria-label="Forward" disabled={!state.canNavigateForward} onClick={state.navigateForward}>
        <ForwardIcon />
      </Control>
    </>
  );
}

export function AppShellChromeButton({ className, type = "button", ...props }: AppShellButtonProps) {
  return <button className={joinClassNames("opaline-shell-chrome-button", className)} type={type} {...props} />;
}

export function AppShellCollapsedSidebarTrigger({ className, type = "button", ...props }: AppShellButtonProps) {
  return <button className={joinClassNames("opaline-sidebar-reopen-trigger", className)} type={type} {...props} />;
}

export function AppShellHeader({ children, className, ...props }: AppShellSlotProps) {
  return (
    <header className={joinClassNames("opaline-app-header", className)} data-app-shell-header-edge-scroll="false" {...props}>
      {children}
    </header>
  );
}

export function AppShellHeaderContextSurface({ children, className, ...props }: AppShellSlotProps) {
  return (
    <div
      className={joinClassNames("opaline-app-header-context-surface", className)}
      data-testid="app-shell-header-context-menu-surface"
      {...props}
    >
      {children}
    </div>
  );
}

export function AppShellTabStrip({ children, className, ...props }: AppShellSlotProps) {
  return (
    <div className={joinClassNames("opaline-app-tab-strip", className)} data-app-shell-tab-strip-controller="main" {...props}>
      {children}
    </div>
  );
}

export function AppShellTabController({ children, className, ...props }: AppShellSlotProps) {
  return (
    <div className={joinClassNames("opaline-app-tab-controller", className)} data-app-shell-tab-controller="main" {...props}>
      {children}
    </div>
  );
}

export function AppShellTab({
  children,
  className,
  tab,
  type = "button",
  ...props
}: AppShellButtonProps & { tab?: AppShellTabItem }) {
  const active = tab?.active === true;
  const content = children ?? (
    <>
      {tab?.dirty === true ? <span className="opaline-tab-dot" /> : null}
      <span className="opaline-app-tab-title">{tab?.title}</span>
    </>
  );

  return (
    <button
      className={joinClassNames("opaline-app-tab", className)}
      data-active={active ? "true" : undefined}
      type={type}
      {...props}
    >
      {content}
    </button>
  );
}

export function AppShellTabActions({ children, className, ...props }: AppShellSlotProps) {
  return (
    <div className={joinClassNames("opaline-app-tab-actions", className)} {...props}>
      {children}
    </div>
  );
}

export function AppShellTabActionButton({ className, type = "button", ...props }: AppShellButtonProps) {
  return <button className={joinClassNames("opaline-app-tab-actions-button", className)} type={type} {...props} />;
}

export function AppShellHeaderActions({ children, className, ...props }: AppShellSlotProps) {
  return (
    <div className={joinClassNames("opaline-app-header-actions", className)} {...props}>
      {children}
    </div>
  );
}

export function AppShellHeaderToolButton({ className, type = "button", ...props }: AppShellButtonProps) {
  return <button className={joinClassNames("opaline-header-tool-button", className)} type={type} {...props} />;
}

export function AppShellHeaderPillButton({ className, type = "button", ...props }: AppShellButtonProps) {
  return <button className={joinClassNames("opaline-header-agent-button", className)} type={type} {...props} />;
}

export function AppShellContent({ children, className, ...props }: AppShellSlotProps) {
  return (
    <section className={joinClassNames("opaline-content-frame", className)} {...props}>
      {children}
    </section>
  );
}

export function AppShellComposer({ children, className, ...props }: AppShellSlotProps) {
  return (
    <section className={joinClassNames("opaline-composer-frame", className)} {...props}>
      {children}
    </section>
  );
}

export function AppShellRightPanel({ children, className, ...props }: AppShellSlotProps) {
  return (
    <div className={joinClassNames("opaline-right-panel", className)} {...props}>
      {children}
    </div>
  );
}

export function AppShellBottomPanel({ children, className, ...props }: AppShellSlotProps) {
  return (
    <div className={joinClassNames("opaline-bottom-panel-slot-inner", className)} {...props}>
      {children}
    </div>
  );
}

function resolveSlot(slot: ReactNode | ((state: AppShellState) => ReactNode), state: AppShellState) {
  return typeof slot === "function" ? slot(state) : slot;
}

function SidebarToggleIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M6.83 4c-.45 0-.82.01-1.14.04-.39.03-.66.08-.88.16a2.9 2.9 0 0 0-1.56 1.47c-.13.25-.21.56-.25 1.08-.04.52-.04 1.19-.04 2.13v2.24c0 .94 0 1.61.04 2.13.04.52.12.83.25 1.08.3.59.78 1.06 1.37 1.34.22.08.49.13.88.16.32.03.69.04 1.14.04V4Zm1.33 11.99h3.97c.94 0 1.61 0 2.13-.04.52-.04.83-.12 1.08-.25.42-.22.76-.56.98-.98.13-.25.21-.56.25-1.08.04-.52.04-1.19.04-2.13V8.49c0-.94 0-1.61-.04-2.13-.04-.52-.12-.83-.25-1.08a2.6 2.6 0 0 0-.98-.98c-.25-.13-.56-.21-1.08-.25-.52-.04-1.19-.04-2.13-.04H8.16v11.98Z" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M3.5 9.25 10 4l6.5 5.25" />
      <path d="M5.25 8.9v6.35c0 .2.16.36.36.36h2.82V11.6c0-.2.16-.36.36-.36h2.42c.2 0 .36.16.36.36v4.01h2.82c.2 0 .36-.16.36-.36V8.9" />
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

function joinClassNames(...classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(" ");
}
