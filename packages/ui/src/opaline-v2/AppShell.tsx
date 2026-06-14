import * as React from "react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  HouseIcon,
} from "@phosphor-icons/react";

import { Button } from "../components/button";
import { ScrollArea } from "../components/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../components/tooltip";
import { ShellHistoryProvider } from "../history/ShellHistory";
import type { ShellHistoryController } from "../history/ShellHistory";
import { cn } from "../lib/utils";
import "./opaline-v2.css";

export type OpalineV2SidebarItem = {
  id: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  meta?: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  onSelect?: () => void;
};

export type OpalineV2SidebarSection = {
  id: string;
  label?: React.ReactNode;
  items: OpalineV2SidebarItem[];
};

export type OpalineV2SidebarProps = {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  sections?: OpalineV2SidebarSection[];
  header?: React.ReactNode;
  footer?: React.ReactNode;
  renderItem?: (item: OpalineV2SidebarItem) => React.ReactNode;
  reserveWindowControls?: boolean;
  className?: string;
};

export type OpalineV2ShellTabItem = {
  active?: boolean;
  dirty?: boolean;
  id: string;
  title: React.ReactNode;
};

export type OpalineV2ShellProps = {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  sidebar?: React.ReactNode;
  sidebarOpen?: boolean;
  defaultSidebarOpen?: boolean;
  onSidebarOpenChange?: (open: boolean) => void;
  defaultSidebarWidth?: number;
  sidebarMinWidth?: number;
  sidebarMaxWidth?: number;
  sidebarChrome?: React.ReactNode | ((state: OpalineV2ShellState) => React.ReactNode);
  showSidebarChrome?: boolean;
  collapsedSidebarTrigger?: React.ReactNode | ((state: OpalineV2ShellState) => React.ReactNode);
  inspector?: React.ReactNode;
  rightPanel?: React.ReactNode;
  inspectorOpen?: boolean;
  defaultInspectorOpen?: boolean;
  defaultRightPanelOpen?: boolean;
  onInspectorOpenChange?: (open: boolean) => void;
  defaultInspectorWidth?: number;
  defaultRightPanelWidth?: number;
  inspectorMinWidth?: number;
  rightPanelMinWidth?: number;
  inspectorMaxWidth?: number;
  rightPanelMaxWidth?: number;
  actions?: React.ReactNode | ((state: OpalineV2ShellState) => React.ReactNode);
  headerActions?: React.ReactNode | ((state: OpalineV2ShellState) => React.ReactNode);
  header?: React.ReactNode | ((state: OpalineV2ShellState) => React.ReactNode);
  headerTabs?: OpalineV2ShellTabItem[];
  renderHeaderTab?: (tab: OpalineV2ShellTabItem, state: OpalineV2ShellState) => React.ReactNode;
  renderHeaderTabActions?: (tab: OpalineV2ShellTabItem, state: OpalineV2ShellState) => React.ReactNode;
  main: React.ReactNode;
  composer?: React.ReactNode;
  bottomPanel?: React.ReactNode | ((state: OpalineV2ShellState) => React.ReactNode);
  defaultBottomPanelOpen?: boolean;
  history?: ShellHistoryController<any>;
  canNavigateBack?: boolean;
  canNavigateForward?: boolean;
  onNavigateBack?: () => void;
  onNavigateForward?: () => void;
  onNavigateHome?: () => void;
  className?: string;
};

export type OpalineV2ShellState = {
  canNavigateBack: boolean;
  canNavigateForward: boolean;
  canNavigateHome: boolean;
  history?: ShellHistoryController<any>;
  inspectorOpen: boolean;
  sidebarOpen: boolean;
  bottomPanelOpen: boolean;
  isBottomPanelOpen: boolean;
  isRightPanelOpen: boolean;
  isSidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  setInspectorOpen: (open: boolean) => void;
  setRightPanelOpen: (open: boolean) => void;
  setBottomPanelOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  toggleInspector: () => void;
  toggleRightPanel: () => void;
  toggleBottomPanel: () => void;
  navigateBack: () => void;
  navigateForward: () => void;
  navigateHome: () => void;
};

export type OpalineV2ShellButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;
export type AppShellProps = OpalineV2ShellProps;
export type AppShellState = OpalineV2ShellState;
export type AppShellTabItem = OpalineV2ShellTabItem;

export function AppShell(props: OpalineV2ShellProps) {
  return <OpalineV2Shell {...props} />;
}

export function OpalineV2Shell({
  actions,
  headerActions,
  bottomPanel,
  canNavigateBack,
  canNavigateForward,
  className,
  collapsedSidebarTrigger,
  composer,
  defaultBottomPanelOpen,
  defaultInspectorOpen = true,
  defaultInspectorWidth = 320,
  defaultRightPanelOpen,
  defaultRightPanelWidth,
  defaultSidebarOpen = true,
  defaultSidebarWidth = 300,
  header,
  headerTabs = [],
  history,
  inspector,
  inspectorMaxWidth = 560,
  inspectorMinWidth = 260,
  rightPanel,
  rightPanelMaxWidth,
  rightPanelMinWidth,
  inspectorOpen: controlledInspectorOpen,
  main,
  onInspectorOpenChange,
  onNavigateBack,
  onNavigateForward,
  onNavigateHome,
  onSidebarOpenChange,
  renderHeaderTab,
  renderHeaderTabActions,
  showSidebarChrome = true,
  sidebar,
  sidebarChrome,
  sidebarMaxWidth = 520,
  sidebarMinWidth = 240,
  sidebarOpen: controlledSidebarOpen,
  subtitle,
  title,
}: OpalineV2ShellProps) {
  const resolvedInspector = inspector ?? rightPanel;
  const resolvedInspectorMaxWidth = rightPanelMaxWidth ?? inspectorMaxWidth;
  const resolvedInspectorMinWidth = rightPanelMinWidth ?? inspectorMinWidth;
  const resolvedDefaultInspectorOpen = defaultRightPanelOpen ?? defaultInspectorOpen;
  const resolvedDefaultInspectorWidth = defaultRightPanelWidth ?? defaultInspectorWidth;
  const [uncontrolledSidebarOpen, setUncontrolledSidebarOpen] = React.useState(defaultSidebarOpen);
  const [uncontrolledInspectorOpen, setUncontrolledInspectorOpen] = React.useState(resolvedDefaultInspectorOpen);
  const [bottomPanelOpen, setBottomPanelOpen] = React.useState(defaultBottomPanelOpen ?? bottomPanel != null);
  const [sidebarWidth, setSidebarWidth] = React.useState(defaultSidebarWidth);
  const [inspectorWidth, setInspectorWidth] = React.useState(resolvedDefaultInspectorWidth);
  const [sidebarResizing, setSidebarResizing] = React.useState(false);
  const [inspectorResizing, setInspectorResizing] = React.useState(false);

  const sidebarOpen = controlledSidebarOpen ?? uncontrolledSidebarOpen;
  const inspectorOpen = controlledInspectorOpen ?? uncontrolledInspectorOpen;
  const resolvedCanNavigateBack = canNavigateBack ?? history?.canGoBack ?? false;
  const resolvedCanNavigateForward = canNavigateForward ?? history?.canGoForward ?? false;

  const setSidebarOpen = React.useCallback(
    (open: boolean) => {
      setUncontrolledSidebarOpen(open);
      onSidebarOpenChange?.(open);
    },
    [onSidebarOpenChange],
  );

  const setInspectorOpen = React.useCallback(
    (open: boolean) => {
      setUncontrolledInspectorOpen(open);
      onInspectorOpenChange?.(open);
    },
    [onInspectorOpenChange],
  );

  const navigateBack = React.useCallback(() => {
    if (onNavigateBack != null) {
      onNavigateBack();
      return;
    }

    history?.goBack();
  }, [history, onNavigateBack]);

  const navigateForward = React.useCallback(() => {
    if (onNavigateForward != null) {
      onNavigateForward();
      return;
    }

    history?.goForward();
  }, [history, onNavigateForward]);

  const navigateHome = React.useCallback(() => {
    onNavigateHome?.();
  }, [onNavigateHome]);

  const state = React.useMemo<OpalineV2ShellState>(
    () => ({
      bottomPanelOpen,
      canNavigateBack: resolvedCanNavigateBack,
      canNavigateForward: resolvedCanNavigateForward,
      canNavigateHome: onNavigateHome != null,
      history,
      inspectorOpen,
      isBottomPanelOpen: bottomPanelOpen,
      isRightPanelOpen: inspectorOpen,
      isSidebarOpen: sidebarOpen,
      navigateBack,
      navigateForward,
      navigateHome,
      setBottomPanelOpen,
      setInspectorOpen,
      setRightPanelOpen: setInspectorOpen,
      setSidebarOpen,
      sidebarOpen,
      toggleBottomPanel: () => setBottomPanelOpen((open) => !open),
      toggleInspector: () => setInspectorOpen(!inspectorOpen),
      toggleRightPanel: () => setInspectorOpen(!inspectorOpen),
      toggleSidebar: () => setSidebarOpen(!sidebarOpen),
    }),
    [
      bottomPanelOpen,
      history,
      inspectorOpen,
      navigateBack,
      navigateForward,
      navigateHome,
      onNavigateHome,
      resolvedCanNavigateBack,
      resolvedCanNavigateForward,
      setInspectorOpen,
      setSidebarOpen,
      sidebarOpen,
    ],
  );

  const startSidebarResize = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      event.currentTarget.setPointerCapture(event.pointerId);
      setSidebarResizing(true);
      const startX = event.clientX;
      const startWidth = sidebarWidth;

      function move(pointerEvent: PointerEvent) {
        const nextWidth = Math.max(0, Math.min(sidebarMaxWidth, startWidth + pointerEvent.clientX - startX));
        if (nextWidth < sidebarMinWidth) {
          setSidebarOpen(false);
          return;
        }

        setSidebarOpen(true);
        setSidebarWidth(nextWidth);
      }

      function stop() {
        setSidebarResizing(false);
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", stop);
      }

      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", stop, { once: true });
    },
    [setSidebarOpen, sidebarMaxWidth, sidebarMinWidth, sidebarWidth],
  );

  const startInspectorResize = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      event.currentTarget.setPointerCapture(event.pointerId);
      setInspectorResizing(true);
      const startX = event.clientX;
      const startWidth = inspectorWidth;

      function move(pointerEvent: PointerEvent) {
        const nextWidth = Math.max(0, Math.min(resolvedInspectorMaxWidth, startWidth - (pointerEvent.clientX - startX)));
        if (nextWidth < resolvedInspectorMinWidth) {
          setInspectorOpen(false);
          return;
        }

        setInspectorOpen(true);
        setInspectorWidth(nextWidth);
      }

      function stop() {
        setInspectorResizing(false);
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", stop);
      }

      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", stop, { once: true });
    },
    [inspectorWidth, resolvedInspectorMaxWidth, resolvedInspectorMinWidth, setInspectorOpen],
  );

  const actionContent = resolveSlot(actions ?? headerActions, state);
  const headerContent = resolveSlot(header, state);
  const bottomPanelContent = resolveSlot(bottomPanel, state);
  const sidebarChromeContent =
    sidebarChrome != null ? resolveSlot(sidebarChrome, state) : <OpalineV2NavigationControls state={state} />;
  const collapsedTriggerContent =
    collapsedSidebarTrigger != null ? (
      resolveSlot(collapsedSidebarTrigger, state)
    ) : (
      <OpalineV2NavigationControls state={state} variant="collapsed" />
    );

  const shell = (
    <TooltipProvider>
      <div
        className={cn("opaline-v2-shell", className)}
        data-bottom-panel-open={bottomPanel != null && bottomPanelOpen ? "true" : "false"}
        data-inspector-open={resolvedInspector != null && inspectorOpen ? "true" : "false"}
        data-sidebar-open={sidebar != null && sidebarOpen ? "true" : "false"}
        style={
          {
            "--opaline-v2-inspector-width": `${inspectorWidth}px`,
            "--opaline-v2-sidebar-max-width": `${sidebarMaxWidth}px`,
            "--opaline-v2-sidebar-min-content": `${sidebarMinWidth + 96}px`,
            "--opaline-v2-sidebar-width": `${sidebarWidth}px`,
          } as React.CSSProperties
        }
      >
        {sidebar != null ? (
          <aside
            className="opaline-v2-sidebar-shell"
            data-open={sidebarOpen ? "true" : "false"}
            data-resizing={sidebarResizing ? "true" : "false"}
          >
            {showSidebarChrome ? <div className="opaline-v2-sidebar-chrome">{sidebarChromeContent}</div> : null}
            <div className="opaline-v2-sidebar">{sidebar}</div>
            <div
              aria-disabled={!sidebarOpen}
              aria-orientation="vertical"
              className="opaline-v2-sidebar-resize-handle"
              onPointerDown={sidebarOpen ? startSidebarResize : undefined}
              role="separator"
            >
              <div className="opaline-v2-resize-handle-line" />
            </div>
          </aside>
        ) : null}
        <section className="opaline-v2-main">
          <header className="opaline-v2-titlebar">
            {sidebar != null ? <div className="opaline-v2-collapsed-sidebar-trigger">{collapsedTriggerContent}</div> : null}
            <div className="opaline-v2-titlebar-context">
              {headerTabs.length > 0 ? (
                <div className="opaline-v2-tab-strip">
                  {headerTabs.map((tab) => (
                    <div className="opaline-v2-tab-controller" data-tab-id={tab.id} key={tab.id}>
                      {renderHeaderTab?.(tab, state) ?? <OpalineV2HeaderTab tab={tab} />}
                      {renderHeaderTabActions?.(tab, state)}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="opaline-v2-titlebar-copy">
                  {title != null ? <div className="opaline-v2-titlebar-title">{title}</div> : null}
                  {subtitle != null ? <div className="opaline-v2-titlebar-subtitle">{subtitle}</div> : null}
                </div>
              )}
              {headerContent}
            </div>
            <div className="opaline-v2-titlebar-actions">
              {actionContent}
            </div>
          </header>
          <div className="opaline-v2-workspace">
            <section className="opaline-v2-content-stack">
              <main className="opaline-v2-content">{main}</main>
              {composer != null ? <footer className="opaline-v2-composer">{composer}</footer> : null}
              {bottomPanelContent != null ? (
                <section className="opaline-v2-bottom" data-open={bottomPanelOpen ? "true" : "false"}>
                  {bottomPanelContent}
                </section>
              ) : null}
            </section>
            {resolvedInspector != null ? (
              <aside
                className="opaline-v2-inspector-shell"
                data-open={inspectorOpen ? "true" : "false"}
                data-resizing={inspectorResizing ? "true" : "false"}
              >
                <div
                  aria-disabled={!inspectorOpen}
                  aria-orientation="vertical"
                  className="opaline-v2-inspector-resize-handle"
                  onPointerDown={inspectorOpen ? startInspectorResize : undefined}
                  role="separator"
                >
                  <div className="opaline-v2-resize-handle-line" />
                </div>
                <div className="opaline-v2-inspector">{resolvedInspector}</div>
              </aside>
            ) : null}
          </div>
        </section>
      </div>
    </TooltipProvider>
  );

  return history != null ? <ShellHistoryProvider history={history}>{shell}</ShellHistoryProvider> : shell;
}

export function OpalineV2Sidebar({
  className,
  footer,
  header,
  renderItem,
  reserveWindowControls = false,
  sections = [],
  subtitle,
  title,
}: OpalineV2SidebarProps) {
  return (
    <div className={cn("flex min-h-0 flex-1 flex-col", className)}>
      <div className="opaline-v2-sidebar-header" data-reserve-window-controls={reserveWindowControls ? "true" : "false"}>
        {header ?? (
          <div className="min-w-0">
            {title != null ? <div className="opaline-v2-sidebar-title">{title}</div> : null}
            {subtitle != null ? <div className="opaline-v2-sidebar-subtitle">{subtitle}</div> : null}
          </div>
        )}
      </div>
      <ScrollArea className="opaline-v2-sidebar-scroll">
        {sections.map((section) => (
          <div className="opaline-v2-sidebar-section" key={section.id}>
            {section.label != null ? <div className="opaline-v2-sidebar-section-label">{section.label}</div> : null}
            {section.items.map((item) => (
              <React.Fragment key={item.id}>
                {renderItem != null ? renderItem(item) : <OpalineV2SidebarItemButton item={item} />}
              </React.Fragment>
            ))}
          </div>
        ))}
      </ScrollArea>
      {footer != null ? <div className="opaline-v2-sidebar-footer">{footer}</div> : null}
    </div>
  );
}

export function OpalineV2SidebarItemButton({ item }: { item: OpalineV2SidebarItem }) {
  return (
    <Button
      className="opaline-v2-sidebar-item"
      data-active={item.active ? "true" : undefined}
      disabled={item.disabled}
      onClick={item.onSelect}
      size="default"
      type="button"
      variant="ghost"
    >
      <span className="opaline-v2-sidebar-item-icon">{item.icon}</span>
      <span className="opaline-v2-sidebar-item-label">{item.label}</span>
      {item.meta != null ? <span className="opaline-v2-sidebar-item-meta">{item.meta}</span> : null}
    </Button>
  );
}

export function OpalineV2NavigationControls({
  state,
  variant = "sidebar",
}: {
  state: OpalineV2ShellState;
  variant?: "collapsed" | "sidebar";
}) {
  const Control = variant === "collapsed" ? OpalineV2CollapsedSidebarTrigger : OpalineV2ChromeButton;

  return (
    <>
      <Control aria-label={state.sidebarOpen ? "Close sidebar" : "Open sidebar"} onClick={state.toggleSidebar}>
        <SidebarToggleIcon active={variant === "collapsed"} />
      </Control>
      <Control aria-label="Home" disabled={!state.canNavigateHome} onClick={state.navigateHome}>
        <HouseIcon />
      </Control>
      <Control aria-label="Back" disabled={!state.canNavigateBack} onClick={state.navigateBack}>
        <ArrowLeftIcon />
      </Control>
      <Control aria-label="Forward" disabled={!state.canNavigateForward} onClick={state.navigateForward}>
        <ArrowRightIcon />
      </Control>
    </>
  );
}

export function OpalineV2ChromeButton({ className, type = "button", ...props }: OpalineV2ShellButtonProps) {
  return <button className={cn("opaline-v2-chrome-button", className)} type={type} {...props} />;
}

export function OpalineV2CollapsedSidebarTrigger({ className, type = "button", ...props }: OpalineV2ShellButtonProps) {
  return <button className={cn("opaline-v2-collapsed-trigger-button", className)} type={type} {...props} />;
}

export function OpalineV2HeaderToolButton({
  children,
  className,
  label,
  pressed,
  type = "button",
  ...props
}: OpalineV2ShellButtonProps & {
  label?: string;
  pressed?: boolean;
}) {
  const button = (
    <button
      aria-label={label}
      aria-pressed={pressed}
      className={cn("opaline-v2-header-tool-button", className)}
      type={type}
      {...props}
    >
      {children}
    </button>
  );

  if (label == null) {
    return button;
  }

  return (
    <Tooltip>
      <TooltipTrigger render={button} />
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

export function ShellIconButton(props: OpalineV2ShellButtonProps & { label: string; pressed?: boolean }) {
  return <OpalineV2HeaderToolButton {...props} />;
}

export const AppShellChromeButton = OpalineV2ChromeButton;
export const AppShellCollapsedSidebarTrigger = OpalineV2CollapsedSidebarTrigger;
export const AppShellHeaderToolButton = OpalineV2HeaderToolButton;

type AppShellSlotProps = React.HTMLAttributes<HTMLElement>;

function ShellSlot({ as: Component = "div", className, ...props }: AppShellSlotProps & { as?: "div" | "header" | "section" }) {
  return <Component className={className} {...props} />;
}

export function AppShellChromeControls(props: AppShellSlotProps) {
  return <ShellSlot {...props} className={cn("opaline-v2-chrome-controls", props.className)} />;
}

export function AppShellSidebarChrome(props: AppShellSlotProps) {
  return <ShellSlot {...props} className={cn("opaline-v2-sidebar-chrome", props.className)} />;
}

export function AppShellNavigationControls({ onHome, state, variant = "sidebar" }: {
  onHome?: () => void;
  state: OpalineV2ShellState;
  variant?: "collapsed" | "sidebar";
}) {
  return <OpalineV2NavigationControls state={{ ...state, navigateHome: onHome ?? state.navigateHome }} variant={variant} />;
}

export function AppShellHeader(props: AppShellSlotProps) {
  return <ShellSlot {...props} as="header" className={cn("opaline-v2-titlebar", props.className)} />;
}

export function AppShellHeaderContextSurface(props: AppShellSlotProps) {
  return <ShellSlot {...props} className={cn("opaline-v2-titlebar-context", props.className)} />;
}

export function AppShellTabStrip(props: AppShellSlotProps) {
  return <ShellSlot {...props} className={cn("opaline-v2-tab-strip", props.className)} />;
}

export function AppShellTabController(props: AppShellSlotProps) {
  return <ShellSlot {...props} className={cn("opaline-v2-tab-controller", props.className)} />;
}

export function AppShellTab({ tab, ...props }: OpalineV2ShellButtonProps & { tab?: OpalineV2ShellTabItem }) {
  return <OpalineV2HeaderTab tab={tab ?? { id: "tab", title: props.children }} {...props} />;
}

export function AppShellTabActions(props: AppShellSlotProps) {
  return <ShellSlot {...props} className={cn("opaline-v2-tab-actions", props.className)} />;
}

export function AppShellTabActionButton(props: OpalineV2ShellButtonProps) {
  return <OpalineV2HeaderToolButton {...props} />;
}

export function AppShellHeaderActions(props: AppShellSlotProps) {
  return <ShellSlot {...props} className={cn("opaline-v2-titlebar-actions", props.className)} />;
}

export function AppShellHeaderPillButton({ className, ...props }: OpalineV2ShellButtonProps) {
  return <button className={cn("opaline-v2-header-pill-button", className)} {...props} />;
}

export function AppShellContent(props: AppShellSlotProps) {
  return <ShellSlot {...props} as="section" className={cn("opaline-v2-content", props.className)} />;
}

export function AppShellComposer(props: AppShellSlotProps) {
  return <ShellSlot {...props} as="section" className={cn("opaline-v2-composer", props.className)} />;
}

export function AppShellRightPanel(props: AppShellSlotProps) {
  return <ShellSlot {...props} className={cn("opaline-v2-inspector", props.className)} />;
}

export function AppShellBottomPanel(props: AppShellSlotProps) {
  return <ShellSlot {...props} className={cn("opaline-v2-bottom-panel-content", props.className)} />;
}

export function OpalineV2InspectorIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 20 20">
      <rect height="12" rx="2.75" stroke="currentColor" strokeWidth="1.55" width="13.5" x="3.25" y="4" />
      <path d="M10 4v12" stroke="currentColor" strokeLinecap="round" strokeWidth="1.55" />
    </svg>
  );
}

export function OpalineV2HeaderTab({
  className,
  tab,
  type = "button",
  ...props
}: OpalineV2ShellButtonProps & { tab: OpalineV2ShellTabItem }) {
  return (
    <button className={cn("opaline-v2-header-tab", className)} data-active={tab.active ? "true" : undefined} type={type} {...props}>
      {tab.dirty ? <span className="opaline-v2-header-tab-dot" /> : null}
      <span className="opaline-v2-header-tab-title">{tab.title}</span>
    </button>
  );
}

function resolveSlot<TState>(
  slot: React.ReactNode | ((state: TState) => React.ReactNode) | undefined,
  state: TState,
) {
  return typeof slot === "function" ? slot(state) : slot;
}

function SidebarToggleIcon({ active }: { active: boolean }) {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 20 20">
      <rect height="11" rx="2" stroke="currentColor" strokeWidth="1.5" width="13" x="3.5" y="4.5" />
      <path d="M7.5 4.5v11" stroke="currentColor" strokeWidth="1.5" />
      {active ? (
        <circle
          className="opaline-v2-sidebar-state-dot"
          cx="16.5"
          cy="4.5"
          fill="#007aff"
          r="2.5"
          stroke="var(--background)"
          strokeWidth="1.5"
        />
      ) : null}
    </svg>
  );
}
