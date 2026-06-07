import {
  ChevronDown,
  Ellipsis,
  File as FileIcon,
  ListTree,
  PanelBottom,
  PanelRight,
  Search,
  SquarePen,
  Terminal as TerminalIcon,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AppShell,
  AppShellHeaderPillButton,
  AppShellHeaderToolButton,
  BottomPanel,
  Button,
  CodexMark,
  Composer,
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogSection,
  DialogTrigger,
  FileBrowserPanel,
  FileTree,
  Sidebar,
  TerminalSurface,
  ThreadSurface,
  useShellHistory,
} from "@open-shell/ui";
import type { ShellHistoryEntry, SidebarItem, SidebarNavItem, SidebarProject, SlotTab, TreeNode } from "@open-shell/ui";
import "@open-shell/ui/styles.css";
import "./app.css";

const baseThreads: SidebarItem[] = [];

const baseProjects: SidebarProject[] = [
  {
    id: "project-desktop-agent-app",
    label: "desktop-agent-app",
    active: true,
    threads: [{ id: "thread-inspect-electron-ui", title: "Inspect Electron UI", meta: "⌘1", active: true }],
  },
  {
    id: "project-application-agent",
    label: "application-agent",
    threads: [{ id: "thread-fix-dev-db", title: "Fix dev and DB errors", meta: "⌘2" }],
  },
  {
    id: "project-fill-agent",
    label: "fill-agent",
    muted: true,
    threads: [
      { id: "thread-fill-agent-browser-use", title: "okay scrap this. lets use co...", meta: "⌘3" },
      { id: "thread-build-browser-extension", title: "Build agent browser extens...", meta: "⌘4" },
    ],
  },
  {
    id: "project-daytracker",
    label: "daytracker",
    muted: true,
    threads: [{ id: "thread-screenpipe-daytracker", title: "Research Screenpipe day t...", meta: "⌘5" }],
  },
  {
    id: "project-construct",
    label: "construct",
    threads: [
      { id: "thread-construct-architecture", title: "Inspect Electron app archit...", meta: "⌘6" },
      { id: "thread-dev-startup", title: "Fix dev startup failures", meta: "⌘7" },
      { id: "thread-fullstack-intern", title: "Find remote full-stack inter...", meta: "⌘8" },
      { id: "thread-dashboard-history", title: "Remove dashboard goal hi...", meta: "⌘9" },
      { id: "thread-top-bar", title: "Tighten top bar controls", meta: "2mo" },
      { id: "thread-show-more", title: "Show more" },
    ],
  },
];

const messages = [
  {
    role: "user" as const,
    body: "Strip out the component system and create a library component system from their code.",
  },
  {
    role: "assistant" as const,
    body:
      "The readable component library now carries Codex shell/sidebar/composer/thread primitives plus recovered dialog, bottom panel, terminal, and file-tree systems.",
  },
];

const fileTreeItems = [
  {
    name: "open-shell",
    path: "open-shell",
    type: "directory" as const,
    children: [
      {
        name: "src",
        path: "open-shell/packages/ui/src",
        type: "directory" as const,
        children: [
          {
            name: "lib",
            path: "open-shell/packages/ui/src",
            type: "directory" as const,
            children: [
              { name: "Dialog.tsx", path: "packages/ui/src/primitives/Dialog.tsx", gitStatus: "added" as const },
              {
                name: "BottomPanel.tsx",
                path: "packages/ui/src/bottom-panel/BottomPanel.tsx",
                gitStatus: "added" as const,
              },
              { name: "FileTree.tsx", path: "packages/ui/src/file-tree/FileTree.tsx", gitStatus: "added" as const },
            ],
          },
          { name: "electron-shell", path: "examples/electron-shell/src/renderer", type: "directory" as const },
        ],
      },
      { name: "package.json", path: "package.json", gitStatus: "modified" as const, selected: true },
    ],
  },
];

const previewCode = `{
  "name": "@open-shell/ui",
  "version": "0.2.0",
  "description": "Native-looking shell primitives for modern desktop apps.",
  "exports": {
    ".": "./dist/index.js",
    "./styles.css": "./dist/styles.css"
  }
}`;

const previewFiles = {
  "package.json": {
    breadcrumbs: ["open-shell", "package.json"],
    code: previewCode,
    fileName: "package.json",
    language: "json",
  },
  "packages/ui/src/primitives/Dialog.tsx": {
    breadcrumbs: ["open-shell", "packages", "ui", "src", "primitives", "Dialog.tsx"],
    code: `export function DialogContent() {
  return <div className="codex-dialog-surface" />;
}`,
    fileName: "Dialog.tsx",
    language: "tsx",
  },
  "packages/ui/src/bottom-panel/BottomPanel.tsx": {
    breadcrumbs: ["open-shell", "packages", "ui", "src", "bottom-panel", "BottomPanel.tsx"],
    code: `export function BottomPanel() {
  return <SlotPanel keepMounted />;
}`,
    fileName: "BottomPanel.tsx",
    language: "tsx",
  },
  "packages/ui/src/file-tree/FileTree.tsx": {
    breadcrumbs: ["open-shell", "packages", "ui", "src", "file-tree", "FileTree.tsx"],
    code: `export function FileTree() {
  return <TreeView data={nodes} />;
}`,
    fileName: "FileTree.tsx",
    language: "tsx",
  },
} satisfies Record<string, { breadcrumbs: string[]; code: string; fileName: string; language: string }>;

type ExampleHistoryEntry = ShellHistoryEntry<
  "bottom-tab" | "file" | "thread",
  { filePath?: string; tabId?: string; threadId?: string }
>;

export function App() {
  const history = useShellHistory<ExampleHistoryEntry>(() => [
    createThreadHistoryEntry("thread-inspect-electron-ui", "Inspect Electron UI"),
  ]);
  const [currentThreadId, setCurrentThreadId] = useState("thread-inspect-electron-ui");
  const [activeBottomTabId, setActiveBottomTabId] = useState("terminal");
  const [selectedFilePath, setSelectedFilePath] = useState<keyof typeof previewFiles>("package.json");

  useEffect(() => {
    const current = history.current;
    if (current?.type === "thread" && current.payload?.threadId != null) {
      setCurrentThreadId(current.payload.threadId);
    }
    if (current?.type === "bottom-tab" && current.payload?.tabId != null) {
      setActiveBottomTabId(current.payload.tabId);
    }
    if (current?.type === "file" && current.payload?.filePath != null && current.payload.filePath in previewFiles) {
      setSelectedFilePath(current.payload.filePath as keyof typeof previewFiles);
    }
  }, [history.current]);

  const projects = useMemo<SidebarProject[]>(
    () =>
      baseProjects.map((project) => {
        const projectHasActiveThread = project.threads?.some((thread) => thread.id === currentThreadId) ?? false;
        return {
          ...project,
          active: projectHasActiveThread,
          threads: project.threads?.map((thread) => ({
            ...thread,
            active: thread.id === currentThreadId,
          })),
        };
      }),
    [currentThreadId],
  );

  const threads = useMemo<SidebarItem[]>(
    () =>
      baseThreads.map((thread) => ({
        ...thread,
        active: thread.id === currentThreadId,
      })),
    [currentThreadId],
  );

  const primaryItems = useMemo<SidebarNavItem[]>(
    () => [
      { id: "new-chat", label: "New chat", icon: <SquarePen size={18} strokeWidth={1.9} /> },
      { id: "search", label: "Search", icon: <Search size={18} strokeWidth={1.9} /> },
    ],
    [],
  );

  const activeThreadTitle =
    projects.flatMap((project) => project.threads ?? []).find((thread) => thread.id === currentThreadId)?.title ??
    "Inspect Electron UI";

  const openThread = useCallback(
    (threadId: string) => {
      const title =
        baseProjects.flatMap((project) => project.threads ?? []).find((thread) => thread.id === threadId)?.title ??
        threadId;
      setCurrentThreadId(threadId);
      history.push(createThreadHistoryEntry(threadId, String(title)));
    },
    [history.push],
  );

  const openFile = useCallback(
    (filePath: string) => {
      if (!(filePath in previewFiles)) {
        return;
      }
      const file = previewFiles[filePath as keyof typeof previewFiles];
      setSelectedFilePath(filePath as keyof typeof previewFiles);
      history.push({
        id: `file:${filePath}`,
        payload: { filePath },
        title: file.fileName,
        type: "file",
      });
    },
    [history.push],
  );

  const handleFileTreeNodeClick = useCallback(
    (node: TreeNode) => {
      if (node.data?.type === "directory") {
        return;
      }
      if (typeof node.data?.path === "string") {
        openFile(node.data.path);
      }
    },
    [openFile],
  );

  const handleBottomTabChange = useCallback(
    (tabId: string | null, tab: SlotTab | null) => {
      if (tabId == null) {
        return;
      }
      setActiveBottomTabId(tabId);
      history.push({
        id: `bottom-tab:${tabId}`,
        payload: { tabId },
        title: tab?.title ?? tabId,
        type: "bottom-tab",
      });
    },
    [history.push],
  );

  const bottomPanelTabs = useMemo<SlotTab[]>(
    () => [
      {
        active: true,
        closable: true,
        id: "terminal",
        title: "desktop-agent-app",
        icon: <TerminalIcon size={14} />,
        content: <TerminalSurface />,
      },
      {
        id: "files",
        title: "Open file",
        closable: true,
        icon: <FileIcon size={14} />,
        content: (
          <FileTree
            items={fileTreeItems}
            defaultExpandedIds={["open-shell", "open-shell/packages/ui/src", "open-shell/packages/ui/src/lib"]}
            onNodeClick={handleFileTreeNodeClick}
          />
        ),
      },
    ],
    [handleFileTreeNodeClick],
  );

  const selectedFile = previewFiles[selectedFilePath];

  return (
    <AppShell
      history={history}
      headerTabs={[
        { active: true, dirty: true, id: currentThreadId, title: activeThreadTitle },
        { id: "component-system", title: "Component system" },
      ]}
      headerActions={(shell) => (
        <>
          <AppShellHeaderPillButton type="button" aria-label="Current app">
            <span className="codex-header-agent-icon" aria-hidden="true">
              <CodexMark className="codex-header-agent-mark" />
            </span>
            <ChevronDown size={18} strokeWidth={1.7} />
          </AppShellHeaderPillButton>
          <AppShellHeaderToolButton type="button" aria-label="Thread outline">
            <ListTree size={20} strokeWidth={1.7} />
          </AppShellHeaderToolButton>
          <AppShellHeaderToolButton
            type="button"
            onClick={shell.toggleBottomPanel}
            aria-label="Toggle bottom panel"
            data-active={shell.isBottomPanelOpen ? "true" : undefined}
          >
            <PanelBottom size={20} strokeWidth={1.7} />
          </AppShellHeaderToolButton>
          <AppShellHeaderToolButton
            type="button"
            onClick={shell.toggleRightPanel}
            aria-label="Toggle right panel"
            data-active={shell.isRightPanelOpen ? "true" : undefined}
          >
            <PanelRight size={20} strokeWidth={1.7} />
          </AppShellHeaderToolButton>
          <AppShellHeaderToolButton className="codex-header-tool-button-plain" type="button" aria-label="More actions">
            <Ellipsis size={20} strokeWidth={1.7} />
          </AppShellHeaderToolButton>
        </>
      )}
      sidebar={
        <Sidebar
          items={threads}
          primaryItems={primaryItems}
          projects={projects}
          renderItem={(item, options) => (
            <button
              className="codex-sidebar-item"
              data-active={item.active === true ? "true" : undefined}
              data-inset={options.inset === true ? "true" : "false"}
              onClick={() => openThread(item.id)}
              type="button"
            >
              <span className="codex-sidebar-item-title">{item.title}</span>
              {item.meta != null ? (
                <span className="codex-sidebar-item-meta" data-kind="shortcut">
                  {item.meta}
                </span>
              ) : null}
            </button>
          )}
        />
      }
      main={
        <div className="codex-renderer-stack">
          <ThreadSurface title={String(activeThreadTitle)} subtitle="Component-system reconstruction" messages={messages} />
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary">Open Codex popup primitive</Button>
            </DialogTrigger>
            <DialogContent size="wide">
              <DialogHeader
                title="Codex dialog primitive"
                subtitle="Radix dialog behavior with the recovered Codex overlay, surface, close button, sizes, and measured-height transition."
              />
              <DialogBody>
                <DialogSection>
                  This is the shared popup layer used as the readable target for upstream `dialog-layout-CCvvb1Vc.js`.
                </DialogSection>
              </DialogBody>
              <DialogFooter>
                <Button variant="secondary">Cancel</Button>
                <Button variant="primary">Continue</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      }
      composer={<Composer placeholder="Ask Codex to build, inspect, or recreate a component..." />}
      rightPanel={
        <FileBrowserPanel
          breadcrumbs={selectedFile.breadcrumbs}
          code={selectedFile.code}
          fileName={selectedFile.fileName}
          language={selectedFile.language}
          sidePanel={
            <aside className="codex-file-browser-tree-panel" data-app-shell-focus-area="file-tree">
              <FileTree
                items={fileTreeItems}
                defaultExpandedIds={["open-shell", "open-shell/packages/ui/src", "open-shell/packages/ui/src/lib"]}
                selectedIds={[selectedFilePath]}
                onSelectionChange={() => undefined}
                onNodeClick={handleFileTreeNodeClick}
              />
            </aside>
          }
        />
      }
      bottomPanel={(shell) => (
        <BottomPanel
          activeTabId={activeBottomTabId}
          keepMounted
          onActiveTabChange={handleBottomTabChange}
          onClose={shell.toggleBottomPanel}
          tabs={bottomPanelTabs}
        />
      )}
    />
  );
}

function createThreadHistoryEntry(threadId: string, title: string): ExampleHistoryEntry {
  return {
    id: `thread:${threadId}`,
    payload: { threadId },
    title,
    type: "thread",
  };
}
