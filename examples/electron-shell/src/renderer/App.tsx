import { ArrowLeft, ArrowRight, File as FileIcon, PanelLeftClose, Search, SquarePen, Terminal as TerminalIcon } from "lucide-react";
import { useMemo, useState } from "react";
import {
  AppShell,
  AppShellChromeButton,
  BottomPanel,
  Button,
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
} from "@open-shell/ui";
import type { SidebarItem, SidebarNavItem, SidebarProject } from "@open-shell/ui";
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
  "version": "0.1.0",
  "description": "Native-looking shell primitives for modern desktop apps.",
  "exports": {
    ".": "./dist/index.js",
    "./styles.css": "./dist/styles.css"
  }
}`;

export function App() {
  const threadOrder = useMemo(
    () =>
      baseProjects.flatMap((project) => project.threads?.map((thread) => thread.id) ?? []),
    [],
  );
  const [history, setHistory] = useState({
    entries: ["thread-inspect-electron-ui"],
    index: 0,
  });

  const currentThreadId = history.entries[history.index] ?? threadOrder[0];

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

  function openThread(threadId: string) {
    setHistory((current) => {
      if (current.entries[current.index] === threadId) {
        return current;
      }
      const nextEntries = current.entries.slice(0, current.index + 1);
      nextEntries.push(threadId);
      return {
        entries: nextEntries,
        index: nextEntries.length - 1,
      };
    });
  }

  return (
    <AppShell
      canNavigateBack={history.index > 0}
      canNavigateForward={history.index < history.entries.length - 1}
      headerTabs={[
        { active: true, dirty: true, id: currentThreadId, title: activeThreadTitle },
        { id: "component-system", title: "Component system" },
      ]}
      headerActions={(shell) => (
        <>
          <button className="codex-header-tool-button" type="button" onClick={shell.toggleBottomPanel} aria-label="Toggle bottom panel">
            _
          </button>
          <button className="codex-header-tool-button" type="button" onClick={shell.toggleRightPanel} aria-label="Toggle right panel">
            []
          </button>
          <button className="codex-header-tool-button codex-header-tool-button-plain" type="button" aria-label="More actions">
            ...
          </button>
        </>
      )}
      onNavigateBack={() =>
        setHistory((current) => ({
          ...current,
          index: Math.max(0, current.index - 1),
        }))
      }
      onNavigateForward={() =>
        setHistory((current) => ({
          ...current,
          index: Math.min(current.entries.length - 1, current.index + 1),
        }))
      }
      sidebarChrome={(shell) => (
        <>
          <AppShellChromeButton
            aria-label={shell.isSidebarOpen ? "Hide sidebar" : "Show sidebar"}
            onClick={shell.toggleSidebar}
          >
            <PanelLeftClose size={18} strokeWidth={1.8} />
          </AppShellChromeButton>
          <AppShellChromeButton
            aria-label="Back"
            disabled={!shell.canNavigateBack}
            onClick={shell.navigateBack}
          >
            <ArrowLeft size={18} strokeWidth={1.8} />
          </AppShellChromeButton>
          <AppShellChromeButton
            aria-label="Forward"
            disabled={!shell.canNavigateForward}
            onClick={shell.navigateForward}
          >
            <ArrowRight size={18} strokeWidth={1.8} />
          </AppShellChromeButton>
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
          breadcrumbs={["open-shell", "packages", "ui", "package.json"]}
          code={previewCode}
          fileName="package.json"
          fileTree={fileTreeItems}
          language="json"
        />
      }
      bottomPanel={(shell) => (
        <BottomPanel
          onClose={shell.toggleBottomPanel}
          tabs={[
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
              content: <FileTree items={fileTreeItems} />,
            },
          ]}
        />
      )}
    />
  );
}
