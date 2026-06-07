import * as Tabs from "@radix-ui/react-tabs";
import type { CSSProperties, PointerEvent, ReactNode } from "react";
import React, { useEffect, useRef, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../primitives/DropdownMenu";
import { FileTree } from "../file-tree/FileTree";
import {
  Terminal as TerminalIcon,
  Folder as FolderIcon,
  MessageSquarePlus as MessagePlusIcon,
  FilePlus as FilePlusIcon,
  Activity as ActivityIcon,
  Play as PlayIcon,
  Pause as PauseIcon,
  Trash2 as TrashIcon,
  CornerDownLeft as EnterIcon,
  Plus,
} from "lucide-react";
import "./bottom-panel.css";
import "@xterm/xterm/css/xterm.css";



const DEFAULT_BOTTOM_PANEL_HEIGHT = 280;

/**
 * Clamps the bottom panel height between min/max limits based on current viewport height.
 */
export function clampBottomPanelHeight(height: number, mainContentHeight: number) {
  return Number.isFinite(height) ? Math.max(160, Math.min(height, mainContentHeight * 0.5)) : DEFAULT_BOTTOM_PANEL_HEIGHT;
}

const defaultFileTreeItems = [
  {
    name: "open-shell",
    path: "open-shell",
    type: "directory" as const,
    children: [
      {
        name: "apps",
        path: "open-shell/apps",
        type: "directory" as const,
        children: [
          { name: "docs", path: "open-shell/apps/docs", type: "directory" as const }
        ]
      },
      {
        name: "packages",
        path: "open-shell/packages",
        type: "directory" as const,
        children: [
          {
            name: "ui",
            path: "open-shell/packages/ui",
            type: "directory" as const,
            children: [
              {
                name: "src",
                path: "open-shell/packages/ui/src",
                type: "directory" as const,
                children: [
                  { name: "BottomPanel.tsx", path: "packages/ui/src/bottom-panel/BottomPanel.tsx" },
                  { name: "bottom-panel.css", path: "packages/ui/src/bottom-panel/bottom-panel.css" },
                  { name: "FileTree.tsx", path: "packages/ui/src/file-tree/FileTree.tsx" },
                  { name: "AppShell.tsx", path: "packages/ui/src/app-shell/AppShell.tsx" }
                ]
              }
            ]
          }
        ]
      },
      { name: "package.json", path: "package.json" },
      { name: "README.md", path: "README.md" }
    ]
  }
];
// Re-export SlotPanel types with Bottom-panel aliases for backwards compat
export type { SlotTab as BottomPanelTab, SlotPanelHandle as BottomPanelHandle, SlotLauncherItem } from "../slot-panel/SlotPanel";
import { SlotPanel } from "../slot-panel/SlotPanel";
import type { SlotTab, SlotPanelHandle, SlotLauncherItem } from "../slot-panel/SlotPanel";

export { SlotPanel };

/** Built-in launcher presets provided by BottomPanel when no custom launcherItems are passed. */
const defaultLauncherItems: SlotLauncherItem[] = [
  {
    type: "terminal",
    title: "Terminal",
    description: "Run interactive shell commands.",
    icon: <TerminalIcon size={14} />,
    shortcut: "⌃`",
    createTab: () => ({
      id: `terminal-${Date.now()}`,
      title: "Terminal",
      icon: <TerminalIcon size={14} />,
      closable: true,
      content: <TerminalSurface />,
    }),
  },
  {
    type: "files",
    title: "Files",
    description: "Browse project workspace files.",
    icon: <FolderIcon size={14} />,
    shortcut: "⌘P",
    createTab: () => ({
      id: `files-${Date.now()}`,
      title: "Files",
      icon: <FolderIcon size={14} />,
      closable: true,
      content: <FileTree items={defaultFileTreeItems} />,
    }),
  },
  {
    type: "sidechat",
    title: "Side Chat",
    description: "Chat with workspace assistant.",
    icon: <MessagePlusIcon size={14} />,
    createTab: () => ({
      id: `sidechat-${Date.now()}`,
      title: "Side Chat",
      icon: <MessagePlusIcon size={14} />,
      closable: true,
      content: <SideChatView />,
    }),
  },
  {
    type: "review",
    title: "Review",
    description: "Review files and pull request changes.",
    icon: <FilePlusIcon size={14} />,
    shortcut: "⌃⇧G",
    createTab: () => ({
      id: `review-${Date.now()}`,
      title: "Review",
      icon: <FilePlusIcon size={14} />,
      closable: true,
      content: <ReviewView />,
    }),
  },
  {
    type: "logs",
    title: "Logs",
    description: "View diagnostics and streaming logs.",
    icon: <ActivityIcon size={14} />,
    createTab: () => ({
      id: `logs-${Date.now()}`,
      title: "Logs",
      icon: <ActivityIcon size={14} />,
      closable: true,
      content: <DiagnosticsLogsView />,
    }),
  },
];

export interface BottomPanelProps {
  /** Controlled active tab id forwarded to SlotPanel. */
  activeTabId?: string | null;
  /** Initial active tab id for uncontrolled panels. */
  defaultActiveTabId?: string | null;
  /** Initial height of the bottom panel in pixels. Defaults to 280. */
  height?: number;
  /** Height of the main container viewport, used to clamp panel resizing to maximum 50% height. */
  mainContentHeight?: number;
  /** Keep inactive tab content mounted so terminals and long-running tools keep state. */
  keepMounted?: boolean;
  /** Callback fired when the active tab changes. */
  onActiveTabChange?: (id: string | null, tab: SlotTab | null) => void;
  /** Callback fired when a drag-resize action commits a new height. */
  onHeightChange?: (height: number) => void;
  /** Callback fired when a tab is closed. */
  onTabClose?: (id: string, nextTabs: SlotTab[]) => void;
  /** Callback fired when a tab is opened or focused. */
  onTabOpen?: (tab: SlotTab) => void;
  /** Callback fired when the internal tab list changes. */
  onTabsChange?: (tabs: SlotTab[]) => void;
  /** Initial tabs to populate the panel with. */
  tabs?: SlotTab[];
  /** Launcher items shown in the `+` dropdown and empty-state grid. */
  launcherItems?: SlotLauncherItem[];
  /** Callback fired when the far-right panel close cross button is clicked. */
  onClose?: () => void;
}

/**
 * Resizable bottom panel — a thin wrapper around `SlotPanel` that adds
 * drag-resize and height clamping. Drop `SlotPanel` directly into other
 * slots (right panel, main area) where resize isn't needed.
 */
export const BottomPanel = React.forwardRef<SlotPanelHandle, BottomPanelProps>(
  function BottomPanel(
    {
      activeTabId,
      defaultActiveTabId,
      height = DEFAULT_BOTTOM_PANEL_HEIGHT,
      mainContentHeight = typeof window === "undefined" ? 720 : window.innerHeight,
      keepMounted,
      onActiveTabChange,
      onHeightChange,
      onTabClose,
      onTabOpen,
      onTabsChange,
      tabs,
      launcherItems,
      onClose,
    },
    ref,
  ) {
    const [panelHeight, setPanelHeight] = useState(() => clampBottomPanelHeight(height, mainContentHeight));
    const dragStateRef = useRef<{ pointerId: number; startHeight: number; startY: number } | null>(null);

    useEffect(() => {
      setPanelHeight((h) => clampBottomPanelHeight(h, mainContentHeight));
    }, [mainContentHeight]);

    function commitHeight(next: number) {
      const clamped = clampBottomPanelHeight(next, mainContentHeight);
      setPanelHeight(clamped);
      onHeightChange?.(clamped);
    }

    function handlePointerDown(e: PointerEvent<HTMLDivElement>) {
      e.preventDefault();
      dragStateRef.current = { pointerId: e.pointerId, startHeight: panelHeight, startY: e.clientY };
      e.currentTarget.setPointerCapture(e.pointerId);
      document.documentElement.dataset.codexBottomPanelResizing = "true";
    }

    function handlePointerMove(e: PointerEvent<HTMLDivElement>) {
      const s = dragStateRef.current;
      if (!s || s.pointerId !== e.pointerId) return;
      commitHeight(s.startHeight + (s.startY - e.clientY));
    }

    function handlePointerUp(e: PointerEvent<HTMLDivElement>) {
      if (dragStateRef.current?.pointerId === e.pointerId) {
        dragStateRef.current = null;
        document.documentElement.dataset.codexBottomPanelResizing = "false";
      }
    }

    return (
      <div
        className="codex-bottom-panel"
        data-app-shell-focus-area="bottom-panel"
        style={{ "--app-shell-bottom-panel-height": `${panelHeight}px` } as CSSProperties}
      >
        <div
          className="codex-bottom-panel-resize-handle"
          aria-label="Resize bottom panel"
          role="separator"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        />
        <SlotPanel
          ref={ref}
          activeTabId={activeTabId}
          defaultActiveTabId={defaultActiveTabId}
          tabs={tabs}
          launcherItems={launcherItems ?? defaultLauncherItems}
          keepMounted={keepMounted}
          onClose={onClose}
          onActiveTabChange={onActiveTabChange}
          onTabClose={onTabClose}
          onTabOpen={onTabOpen}
          onTabsChange={onTabsChange}
          ariaLabel="Bottom panel tabs"
        />
      </div>
    );
  },
);

export interface TerminalSurfaceProps {
  /** Optional class name appended to the container. */
  className?: string;
  /** Callback fired when the user types data into the terminal. Wire this to a PTY. */
  onData?: (data: string) => void;
  /** Callback fired when the terminal title changes (via escape sequence). */
  onTitleChange?: (title: string) => void;
  /** Optional xterm.js ITerminalOptions overrides. */
  options?: Record<string, unknown>;
}

/**
 * Thin wrapper around xterm.js.
 *
 * This component renders a real terminal emulator — no hardcoded content.
 * The consumer is responsible for wiring `onData` to a PTY (e.g. via `node-pty`
 * in Electron's main process) and writing PTY output back via the returned ref.
 *
 * @example
 * ```tsx
 * const termRef = useRef<{ write: (data: string) => void }>(null);
 *
 * <TerminalSurface
 *   ref={termRef}
 *   onData={(data) => pty.write(data)}
 * />
 *
 * pty.onData((data) => termRef.current?.write(data));
 * ```
 */
export const TerminalSurface = React.forwardRef<
  { write: (data: string) => void; clear: () => void } | null,
  TerminalSurfaceProps
>(function TerminalSurface({ className, onData, onTitleChange, options }, ref) {
  const containerRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<import("@xterm/xterm").Terminal | null>(null);
  const fitAddonRef = useRef<import("@xterm/addon-fit").FitAddon | null>(null);

  // Expose write/clear to parent via ref
  React.useImperativeHandle(ref, () => ({
    write(data: string) {
      xtermRef.current?.write(data);
    },
    clear() {
      xtermRef.current?.clear();
    },
  }));

  useEffect(() => {
    let disposed = false;

    // Dynamic import so the component doesn't blow up in SSR/non-browser environments
    Promise.all([
      import("@xterm/xterm"),
      import("@xterm/addon-fit"),
    ]).then(([{ Terminal }, { FitAddon }]) => {
      if (disposed || !containerRef.current) return;

      const fitAddon = new FitAddon();

      const term = new Terminal({
        cursorBlink: true,
        fontSize: 13,
        fontFamily: "var(--codex-font-mono, 'SF Mono', 'Fira Code', 'Cascadia Code', Menlo, monospace)",
        lineHeight: 1.35,
        theme: {
          background: "transparent",
          foreground: "#d4d4d4",
          cursor: "#d4d4d4",
          selectionBackground: "rgba(255, 255, 255, 0.15)",
          black: "#1e1e1e",
          red: "#f44747",
          green: "#10a37f",
          yellow: "#e5c07b",
          blue: "#569cd6",
          magenta: "#c678dd",
          cyan: "#56b6c2",
          white: "#d4d4d4",
          brightBlack: "#808080",
          brightRed: "#f44747",
          brightGreen: "#10a37f",
          brightYellow: "#e5c07b",
          brightBlue: "#569cd6",
          brightMagenta: "#c678dd",
          brightCyan: "#56b6c2",
          brightWhite: "#ffffff",
        },
        allowTransparency: true,
        scrollback: 5000,
        ...(options as Record<string, unknown> | undefined),
      });

      term.loadAddon(fitAddon);
      term.open(containerRef.current!);
      fitAddon.fit();

      xtermRef.current = term;
      fitAddonRef.current = fitAddon;

      if (onData) {
        term.onData(onData);
      }

      if (onTitleChange) {
        term.onTitleChange(onTitleChange);
      }
    });

    return () => {
      disposed = true;
      xtermRef.current?.dispose();
      xtermRef.current = null;
      fitAddonRef.current = null;
    };
  }, []); // mount once

  // Re-fit on resize
  useEffect(() => {
    const observer = new ResizeObserver(() => {
      try {
        fitAddonRef.current?.fit();
      } catch {
        // ignore fit errors during transitions
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={`codex-terminal-surface${className ? ` ${className}` : ""}`}
      data-codex-terminal="true"
    />
  );
});


export function SideChatView() {
  const [messages, setMessages] = useState<Array<{ sender: "user" | "assistant"; text: string; time: string }>>([
    {
      sender: "assistant",
      text: "Hello! I am your workspace assistant. I can help you inspect the repository, write code, or run terminal tasks. Ask me anything!",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    const userTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const nextMessages = [
      ...messages,
      { sender: "user" as const, text: trimmed, time: userTime }
    ];
    setMessages(nextMessages);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      let replyText = "I've analyzed your project structure. The bottom panel looks correct and builds cleanly. Let me know if you want me to write some test scripts!";
      
      const lower = trimmed.toLowerCase();
      if (lower.includes("terminal") || lower.includes("run")) {
        replyText = "You can run terminal processes in the Terminal tab! Try typing 'npm run dev' to launch the simulated development server.";
      } else if (lower.includes("file") || lower.includes("tree")) {
        replyText = "The Files tab displays your workspace files in a tree. You can also view more code details in the right inspector panel.";
      } else if (lower.includes("open") || lower.includes("tab") || lower.includes("slot")) {
        replyText = "You can open or close tabs dynamically! Close all tabs to see the empty state Launcher, or click the '+' button to open new tools.";
      }

      setMessages(prev => [
        ...prev,
        {
          sender: "assistant" as const,
          text: replyText,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]);
    }, 800);
  };

  return (
    <div className="codex-sidechat-container">
      <div className="codex-sidechat-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`codex-sidechat-msg-wrapper codex-sidechat-msg-${msg.sender}`}>
            <div className="codex-sidechat-avatar">
              {msg.sender === "assistant" ? "🤖" : "👤"}
            </div>
            <div className="codex-sidechat-bubble">
              <div className="codex-sidechat-text">{msg.text}</div>
              <div className="codex-sidechat-time">{msg.time}</div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="codex-sidechat-msg-wrapper codex-sidechat-msg-assistant">
            <div className="codex-sidechat-avatar">🤖</div>
            <div className="codex-sidechat-bubble codex-sidechat-typing">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      <form className="codex-sidechat-input-form" onSubmit={handleSend}>
        <input
          type="text"
          placeholder="Ask a question or type a command..."
          value={input}
          onChange={e => setInput(e.target.value)}
          className="codex-sidechat-input"
        />
        <button type="submit" className="codex-sidechat-send-btn" aria-label="Send message">
          <EnterIcon size={16} />
        </button>
      </form>
    </div>
  );
}

export function ReviewView() {
  const [approved, setApproved] = useState<boolean | null>(null);
  
  const filesUnderReview = [
    { name: "packages/ui/src/bottom-panel/BottomPanel.tsx", added: 84, deleted: 12 },
    { name: "packages/ui/src/bottom-panel/bottom-panel.css", added: 142, deleted: 0 },
    { name: "examples/electron-shell/src/renderer/App.tsx", added: 5, deleted: 5 }
  ];

  return (
    <div className="codex-review-container">
      <div className="codex-review-header">
        <div className="codex-review-title-row">
          <span className="codex-review-badge">PR REVIEW</span>
          <h4>Review: stateful-bottom-slots</h4>
        </div>
        <p className="codex-review-subtitle">Review changes for stateful bottom panel, OpenAI-style tabs, and interactive terminal.</p>
      </div>

      <div className="codex-review-body">
        <div className="codex-review-files-list">
          {filesUnderReview.map((file, idx) => (
            <div key={idx} className="codex-review-file-item">
              <span className="codex-review-file-icon">📄</span>
              <span className="codex-review-file-name">{file.name}</span>
              <span className="codex-review-file-diff">
                <span className="diff-added">+{file.added}</span>
                <span className="diff-deleted">-{file.deleted}</span>
              </span>
            </div>
          ))}
        </div>

        <div className="codex-review-diff-preview">
          <div className="codex-diff-header">diff --git a/packages/ui/src/bottom-panel/BottomPanel.tsx b/packages/ui/src/bottom-panel/BottomPanel.tsx</div>
          <pre className="codex-diff-pre">
{`@@ -39,6 +39,42 @@ export function BottomPanel({
-  const activeTab = tabs.find((tab) => tab.active) ?? tabs[0];
-  const [activeTabId, setActiveTabId] = useState(activeTab?.id);
+  const [openTabs, setOpenTabs] = useState<BottomPanelTab[]>(() => tabs);
+  const activeTab = openTabs.find((tab) => tab.active) ?? openTabs[0];
+  const [activeTabId, setActiveTabId] = useState<string | null>(activeTab?.id ?? null);
+  const [panelHeight, setPanelHeight] = useState(() => clampBottomPanelHeight(height, mainContentHeight));`}
          </pre>
        </div>
      </div>

      <div className="codex-review-footer">
        {approved === null ? (
          <>
            <button type="button" className="codex-review-btn btn-request" onClick={() => setApproved(false)}>
              Request Changes
            </button>
            <button type="button" className="codex-review-btn btn-approve" onClick={() => setApproved(true)}>
              Approve Changes
            </button>
          </>
        ) : approved ? (
          <div className="codex-review-status status-approved">
            <span>✅ Changes Approved</span>
            <button type="button" className="codex-review-reset" onClick={() => setApproved(null)}>Reset</button>
          </div>
        ) : (
          <div className="codex-review-status status-requested">
            <span>❌ Changes Requested</span>
            <button type="button" className="codex-review-reset" onClick={() => setApproved(null)}>Reset</button>
          </div>
        )}
      </div>
    </div>
  );
}

export function DiagnosticsLogsView() {
  const [logs, setLogs] = useState<Array<{ time: string; level: "info" | "warn" | "error"; message: string }>>([
    { time: "12:00:01", level: "info", message: "Electron main process bootstrap successful." },
    { time: "12:00:03", level: "info", message: "IPC channel 'execute-command' registered." },
    { time: "12:00:05", level: "info", message: "File system watcher initialized for packages/ui." },
    { time: "12:01:12", level: "warn", message: "Renderer connection was delayed by 150ms." },
    { time: "12:01:13", level: "info", message: "Client connection established. Window: 1." }
  ]);
  const [isPaused, setIsPaused] = useState(false);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      const messages = [
        "IPC message sent: 'get-file-tree'.",
        "Active editor session synchronized.",
        "Component packages/ui/src/bottom-panel/BottomPanel.tsx hot-reloaded.",
        "Measured window layout updated in 4ms.",
        "Radix tabs content element mounted successfully."
      ];
      const levels: Array<"info" | "warn" | "error"> = ["info", "info", "info", "warn", "info"];
      const randomIdx = Math.floor(Math.random() * messages.length);
      const newLog = {
        time: new Date().toLocaleTimeString([], { hour12: false }),
        level: levels[randomIdx],
        message: messages[randomIdx]
      };
      setLogs(prev => [...prev, newLog]);
    }, 3000);
    return () => clearInterval(interval);
  }, [isPaused]);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <div className="codex-logs-container">
      <div className="codex-logs-toolbar">
        <span className="codex-logs-title">System Output Logs</span>
        <div className="codex-logs-actions">
          <button
            type="button"
            className="codex-logs-tool-btn"
            onClick={() => setIsPaused(!isPaused)}
            title={isPaused ? "Resume logging" : "Pause logging"}
            aria-label={isPaused ? "Resume logging" : "Pause logging"}
          >
            {isPaused ? <PlayIcon size={14} /> : <PauseIcon size={14} />}
          </button>
          <button
            type="button"
            className="codex-logs-tool-btn"
            onClick={() => setLogs([])}
            title="Clear logs"
            aria-label="Clear logs"
          >
            <TrashIcon size={14} />
          </button>
        </div>
      </div>
      <div className="codex-logs-buffer">
        {logs.map((log, idx) => (
          <div key={idx} className={`codex-logs-line codex-logs-level-${log.level}`}>
            <span className="codex-logs-time">[{log.time}]</span>{" "}
            <span className="codex-logs-tag">{log.level.toUpperCase()}</span>{" "}
            <span className="codex-logs-message">{log.message}</span>
          </div>
        ))}
        <div ref={logsEndRef} />
      </div>
    </div>
  );
}
