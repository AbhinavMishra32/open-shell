import * as Tabs from "@radix-ui/react-tabs";
import type { ReactNode } from "react";
import React, { useEffect, useRef, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../primitives/DropdownMenu";
import { Plus } from "lucide-react";
import "./slot-panel.css";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * A single tab configuration for the SlotPanel.
 */
export type SlotTab = {
  /** Optional flag indicating whether the tab should start focused/active. */
  active?: boolean;
  /** Whether the tab is closable. If true, hovering swaps the icon with a close badge. */
  closable?: boolean;
  /** The content rendered when this tab is active. Any ReactNode. */
  content: ReactNode;
  /** Icon rendered on the left side of the tab title. */
  icon?: ReactNode;
  /** Unique identifier for the tab. */
  id: string;
  /** Optional keyboard shortcut label shown in the launcher menu. */
  shortcut?: string;
  /** The text title of the tab. */
  title: string;
};

/**
 * A launcher item shown in the empty state grid and the `+` dropdown.
 */
export type SlotLauncherItem = {
  /** Unique type key (e.g. "terminal", "files", "editor"). */
  type: string;
  /** Display title. */
  title: string;
  /** Description shown in the launcher card. */
  description?: string;
  /** Icon for the launcher card and dropdown row. */
  icon: ReactNode;
  /** Optional keyboard shortcut label. */
  shortcut?: string;
  /** Factory that returns the tab to open. Called when the user clicks the item. */
  createTab: () => SlotTab;
};

/**
 * Imperative handle for controlling the SlotPanel from outside.
 *
 * @example
 * ```tsx
 * const ref = useRef<SlotPanelHandle>(null);
 *
 * ref.current?.addTab({
 *   id: "file-app-tsx",
 *   title: "App.tsx",
 *   icon: <FileIcon size={14} />,
 *   closable: true,
 *   content: <CodeEditor file="src/App.tsx" />,
 * });
 * ```
 */
export type SlotPanelHandle = {
  /** Open a new tab with arbitrary content. If a tab with the same id exists, it is focused. */
  addTab: (tab: SlotTab) => void;
  /** Close a tab by id. */
  closeTab: (id: string) => void;
  /** Focus a tab by id. */
  setActiveTab: (id: string) => void;
  /** Get the current list of open tabs (snapshot). */
  getTabs: () => SlotTab[];
};

export interface SlotPanelProps {
  /** Controlled active tab id. */
  activeTabId?: string | null;
  /** Initial tabs to populate the panel with. */
  tabs?: SlotTab[];
  /** Initial active tab id for uncontrolled panels. */
  defaultActiveTabId?: string | null;
  /** Items shown in the `+` dropdown and the empty-state launcher grid. */
  launcherItems?: SlotLauncherItem[];
  /** Optional CSS class name for the root element. */
  className?: string;
  /** Keep inactive tab content mounted so terminals and long-running tools keep state. */
  keepMounted?: boolean;
  /** Optional close button handler. If provided, a close `×` button is shown in the tab bar. */
  onClose?: () => void;
  /** Fired whenever the active tab changes. */
  onActiveTabChange?: (id: string | null, tab: SlotTab | null) => void;
  /** Fired when a tab is closed. */
  onTabClose?: (id: string, nextTabs: SlotTab[]) => void;
  /** Fired when a tab is opened or focused from launcher/ref. */
  onTabOpen?: (tab: SlotTab) => void;
  /** Fired when the internal tab list changes. */
  onTabsChange?: (tabs: SlotTab[]) => void;
  /** Accessible label for the tab list. */
  ariaLabel?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Generic slot-based tab panel. Drop this into any slot — bottom panel,
 * right panel, main area — to get a full tab system with:
 *
 * - Codex-style tab bar with close badges on hover
 * - `+` button dropdown for quick-adding launcher items
 * - Empty-state launcher grid when no tabs are open
 * - Imperative ref handle for programmatic control
 *
 * @example
 * ```tsx
 * <SlotPanel
 *   ref={panelRef}
 *   launcherItems={[
 *     { type: "terminal", title: "Terminal", icon: <TerminalIcon />, createTab: () => ({ ... }) },
 *   ]}
 * />
 * ```
 */
export const SlotPanel = React.forwardRef<SlotPanelHandle, SlotPanelProps>(
  function SlotPanel(
    {
      activeTabId: controlledActiveTabId,
      tabs: initialTabs,
      defaultActiveTabId,
      launcherItems = [],
      className,
      keepMounted = true,
      onClose,
      onActiveTabChange,
      onTabClose,
      onTabOpen,
      onTabsChange,
      ariaLabel = "Panel tabs",
    },
    ref,
  ) {
    const [openTabs, setOpenTabs] = useState<SlotTab[]>(() => initialTabs ?? []);
    const activeDefault = openTabs.find((t) => t.active) ?? openTabs.find((t) => t.id === defaultActiveTabId) ?? openTabs[0];
    const [uncontrolledActiveTabId, setUncontrolledActiveTabId] = useState<string | null>(
      controlledActiveTabId ?? defaultActiveTabId ?? activeDefault?.id ?? null,
    );
    const activeTabId = controlledActiveTabId !== undefined ? controlledActiveTabId : uncontrolledActiveTabId;
    const initialTabsSignature = initialTabs?.map((tab) => tab.id).join("\u0000") ?? "";

    // Treat `tabs` as initial/uncontrolled input. This preserves mounted tool state
    // when callers create inline arrays during ordinary shell re-renders.
    useEffect(() => {
      if (initialTabs == null) {
        return;
      }
      setOpenTabs((currentTabs) => {
        const currentSignature = currentTabs.map((tab) => tab.id).join("\u0000");
        if (currentSignature === initialTabsSignature) {
          return currentTabs;
        }
        return initialTabs;
      });
      const active = initialTabs.find((t) => t.active) ?? initialTabs.find((t) => t.id === defaultActiveTabId) ?? initialTabs[0];
      setUncontrolledActiveTabId((currentId) =>
        currentId != null && initialTabs.some((tab) => tab.id === currentId) ? currentId : active?.id ?? null,
      );
    }, [defaultActiveTabId, initialTabs, initialTabsSignature]);

    const commitActiveTabId = (id: string | null) => {
      if (controlledActiveTabId === undefined) {
        setUncontrolledActiveTabId(id);
      }
      onActiveTabChange?.(id, openTabs.find((tab) => tab.id === id) ?? null);
    };

    const handleCloseTab = (id: string) => {
      const nextTabs = openTabs.filter((t) => t.id !== id);
      setOpenTabs(nextTabs);
      onTabsChange?.(nextTabs);
      onTabClose?.(id, nextTabs);

      if (activeTabId === id) {
        if (nextTabs.length > 0) {
          const deletedIndex = openTabs.findIndex((t) => t.id === id);
          const nextActiveIndex = Math.min(deletedIndex, nextTabs.length - 1);
          commitActiveTabId(nextTabs[nextActiveIndex].id);
        } else {
          commitActiveTabId(null);
        }
      }
    };

    const handleAddTab = (tab: SlotTab) => {
      const existing = openTabs.find((t) => t.id === tab.id);
      if (existing) {
        commitActiveTabId(tab.id);
        onTabOpen?.(existing);
        return;
      }
      const nextTabs = [...openTabs, tab];
      setOpenTabs(nextTabs);
      onTabsChange?.(nextTabs);
      commitActiveTabId(tab.id);
      onTabOpen?.(tab);
    };

    const handleLauncherSelect = (item: SlotLauncherItem) => {
      handleAddTab(item.createTab());
    };

    // Imperative handle
    React.useImperativeHandle(ref, () => ({
      addTab: handleAddTab,
      closeTab: handleCloseTab,
      setActiveTab: (id: string) => commitActiveTabId(id),
      getTabs: () => [...openTabs],
    }));

    return (
      <Tabs.Root
        className={`codex-slot-panel${className ? ` ${className}` : ""}`}
        value={activeTabId || ""}
        onValueChange={(val) => commitActiveTabId(val || null)}
      >
        <div className="codex-slot-panel-tabbar">
          <div className="codex-slot-panel-tabs-container">
            <Tabs.List className="codex-slot-panel-tabs" aria-label={ariaLabel}>
              {openTabs.map((tab) => (
                <Tabs.Trigger
                  key={tab.id}
                  value={tab.id}
                  className="codex-slot-panel-tab"
                  data-tab-id={tab.id}
                  data-closable={tab.closable === true ? "true" : undefined}
                >
                  <span className="codex-slot-panel-tab-icon-wrapper">
                    {tab.closable === true ? (
                      <span
                        className="codex-slot-panel-tab-close"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCloseTab(tab.id);
                        }}
                        title="Close tab"
                        aria-label="Close tab"
                      >
                        <svg viewBox="0 0 10 10" width="8" height="8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                          <line x1="2.5" y1="2.5" x2="7.5" y2="7.5" />
                          <line x1="7.5" y1="2.5" x2="2.5" y2="7.5" />
                        </svg>
                      </span>
                    ) : null}
                    {tab.icon != null ? (
                      <span className="codex-slot-panel-tab-icon">{tab.icon}</span>
                    ) : null}
                  </span>
                  <span className="codex-slot-panel-tab-title">{tab.title}</span>
                </Tabs.Trigger>
              ))}
            </Tabs.List>
            {launcherItems.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="codex-slot-panel-add-action" type="button" aria-label="Add tab">
                    <Plus size={15} strokeWidth={1.8} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="codex-slot-panel-launcher-menu" side="bottom">
                  {launcherItems.map((item) => (
                    <DropdownMenuItem key={item.type} onSelect={() => handleLauncherSelect(item)}>
                      {item.icon}
                      <span>{item.title}</span>
                      {item.shortcut && <span className="codex-slot-panel-launcher-shortcut">{item.shortcut}</span>}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          {onClose && (
            <div className="codex-slot-panel-actions">
              <button
                className="codex-slot-panel-action codex-slot-panel-close-action"
                type="button"
                aria-label="Close panel"
                onClick={onClose}
              >
                ×
              </button>
            </div>
          )}
        </div>

        {openTabs.length === 0 && launcherItems.length > 0 ? (
          <div className="codex-slot-panel-outlet codex-slot-panel-launcher-container">
            <div className="codex-slot-panel-launcher-grid">
              <div className="codex-slot-launcher-header">
                <h3>Select a tool to open</h3>
                <p>Click any option below to initialize the surface.</p>
              </div>
              <div className="codex-slot-launcher-cards">
                {launcherItems.map((item) => (
                  <button
                    key={item.type}
                    type="button"
                    className="codex-slot-launcher-card"
                    onClick={() => handleLauncherSelect(item)}
                  >
                    <div className="codex-slot-launcher-card-icon">{item.icon}</div>
                    <div className="codex-slot-launcher-card-info">
                      <h4>{item.title}</h4>
                      {item.description && <p>{item.description}</p>}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : openTabs.length === 0 ? (
          <div className="codex-slot-panel-outlet codex-slot-panel-launcher-container">
            <div className="codex-slot-panel-launcher-grid">
              <div className="codex-slot-launcher-header">
                <h3>No tabs open</h3>
                <p>Use the ref handle to open a tab with any content.</p>
              </div>
            </div>
          </div>
        ) : (
          openTabs.map((tab) => (
            <Tabs.Content
              key={tab.id}
              value={tab.id}
              className="codex-slot-panel-outlet"
              forceMount={keepMounted ? true : undefined}
              hidden={keepMounted && activeTabId !== tab.id ? true : undefined}
            >
              {tab.content}
            </Tabs.Content>
          ))
        )}
      </Tabs.Root>
    );
  },
);
