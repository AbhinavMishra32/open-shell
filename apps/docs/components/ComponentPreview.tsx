"use client";

import {
  AppShell,
  BottomPanel,
  Button,
  Composer,
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  FileBrowserPanel,
  FileTree,
  IconButton,
  Pill,
  Sidebar,
  SidebarSection,
  StatusDot,
  TerminalSurface,
  ThreadSurface,
} from "@opaline/ui";
import type { FileTreeItem, SidebarProject, ThreadMessage } from "@opaline/ui";

const projects: SidebarProject[] = [
  {
    id: "desktop-agent-app",
    label: "desktop-agent-app",
    threads: [{ active: true, id: "inspect", meta: "⌘1", title: "Inspect Electron UI" }],
  },
  {
    id: "application-agent",
    label: "application-agent",
    threads: [{ id: "db", meta: "⌘2", title: "Fix dev and DB errors" }],
  },
  {
    id: "fill-agent",
    label: "fill-agent",
    muted: true,
    threads: [
      { id: "scrap", meta: "⌘3", title: "okay scrap this. lets use co..." },
      { id: "browser", meta: "⌘4", title: "Build agent browser extens..." },
    ],
  },
];

const messages: ThreadMessage[] = [
  {
    body: "Read the component registry and opened the shell preview. The slot boundaries are now documented as public API.",
    role: "assistant",
    status: "Looked at component docs",
  },
  {
    body: "Create a docs site where I can interact with the components.",
    role: "user",
  },
];

const fileTree: FileTreeItem[] = [
  {
    children: [
      {
        children: [
          { gitStatus: "modified", name: "AppShell.tsx", path: "packages/ui/src/app-shell/AppShell.tsx" },
          { gitStatus: "modified", name: "app-shell.css", path: "packages/ui/src/app-shell/app-shell.css" },
        ],
        name: "app-shell",
        path: "packages/ui/src/app-shell",
        type: "directory",
      },
      {
        children: [
          { gitStatus: "modified", name: "Sidebar.tsx", path: "packages/ui/src/sidebar/Sidebar.tsx" },
          { name: "sidebar.css", path: "packages/ui/src/sidebar/sidebar.css" },
        ],
        name: "sidebar",
        path: "packages/ui/src/sidebar",
        type: "directory",
      },
    ],
    name: "packages",
    path: "packages",
    type: "directory",
  },
  { gitStatus: "modified", name: "README.md", path: "README.md", selected: true },
  { name: "package.json", path: "package.json" },
];

const previewCode = `{
  "name": "@opaline/ui",
  "description": "Desktop shell primitives with caller-owned content.",
  "components": ["AppShell", "Sidebar", "FileTree", "Composer"]
}`;

export function ComponentPreview({ slug }: { slug: string }) {
  return <div className="docs-live-preview">{renderPreview(slug)}</div>;
}

function renderPreview(slug: string) {
  switch (slug) {
    case "app-shell":
      return (
        <div className="docs-shell-demo">
          <AppShell
            headerTabs={[
              { active: true, dirty: true, id: "inspect-electron-ui", title: "Inspect Electron UI" },
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
              </>
            )}
            sidebar={
              <Sidebar items={[]} projects={projects}>
                <SidebarSection heading="Files">
                  <FileTree items={fileTree} variant="sidebar" />
                </SidebarSection>
              </Sidebar>
            }
            main={<ThreadSurface messages={messages} subtitle="Component-system reconstruction" title="Inspect Electron UI" />}
            composer={<Composer placeholder="Ask the agent to inspect, build, or ship..." />}
            rightPanel={
              <FileBrowserPanel
                breadcrumbs={["opaline", "package.json"]}
                code={previewCode}
                fileName="package.json"
                fileTree={fileTree}
                language="json"
              />
            }
            bottomPanel={
              <BottomPanel
                tabs={[
                  {
                    active: true,
                    content: <TerminalSurface />,
                    id: "terminal",
                    title: "opaline",
                  },
                  {
                    content: <FileTree items={fileTree} />,
                    id: "files",
                    title: "Files",
                  },
                ]}
              />
            }
          />
        </div>
      );
    case "sidebar":
      return (
        <div className="docs-sidebar-demo">
          <Sidebar
            items={[{ id: "knowledge", meta: "notes", title: "Component knowledge base" }]}
            projects={projects}
          >
            <SidebarSection heading="Files">
              <FileTree items={fileTree} variant="sidebar" />
            </SidebarSection>
          </Sidebar>
        </div>
      );
    case "composer":
      return (
        <div className="docs-composer-demo">
          <Composer placeholder="Ask the agent to build, inspect, or recreate a component..." />
        </div>
      );
    case "bottom-panel":
      return (
        <BottomPanel
          mainContentHeight={740}
          tabs={[
            {
              active: true,
              content: <TerminalSurface />,
              id: "terminal",
              title: "opaline",
            },
            {
              content: <FileTree items={fileTree} />,
              id: "files",
              title: "Files",
            },
          ]}
        />
      );
    case "file-browser-panel":
      return (
        <FileBrowserPanel
          breadcrumbs={["opaline", "package.json"]}
          code={previewCode}
          fileName="package.json"
          fileTree={fileTree}
          language="json"
        />
      );
    case "file-tree":
      return <FileTree items={fileTree} />;
    case "dropdown-menu":
      return (
        <div className="docs-overlay-demo">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary">Open menu</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Pin chat <span className="codex-menu-shortcut">⌥⌘P</span></DropdownMenuItem>
              <DropdownMenuItem>Rename chat <span className="codex-menu-shortcut">⌥⌘R</span></DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked={false}>Plan mode</DropdownMenuCheckboxItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Copy</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem>Copy markdown</DropdownMenuItem>
                  <DropdownMenuItem>Copy session ID</DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    case "context-menu":
      return (
        <div className="docs-context-demo">
          <ContextMenu>
            <ContextMenuTrigger asChild>
              <button type="button">Right-click this thread tab</button>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem>Close tab</ContextMenuItem>
              <ContextMenuItem>Copy link</ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuSub>
                <ContextMenuSubTrigger>Move to</ContextMenuSubTrigger>
                <ContextMenuSubContent>
                  <ContextMenuItem>New window</ContextMenuItem>
                  <ContextMenuItem>Side chat</ContextMenuItem>
                </ContextMenuSubContent>
              </ContextMenuSub>
            </ContextMenuContent>
          </ContextMenu>
        </div>
      );
    case "dialog":
      return (
        <div className="docs-overlay-demo">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="primary">Open dialog</Button>
            </DialogTrigger>
            <DialogContent size="compact">
              <DialogHeader title="Create agent run" subtitle="Structured modal primitives for desktop flows." />
              <DialogBody>
                <p>Use sections for settings, confirmations, review cards, or file actions.</p>
              </DialogBody>
              <DialogFooter>
                <Button variant="secondary">Cancel</Button>
                <Button variant="primary">Start</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      );
    case "button":
      return (
        <div className="docs-button-demo">
          <Button variant="primary">Run agent</Button>
          <Button variant="secondary">Review</Button>
          <Button variant="soft">Attach context</Button>
          <IconButton aria-label="Open inspector">⌘</IconButton>
          <Pill>local</Pill>
          <StatusDot tone="green" />
        </div>
      );
    case "thread-surface":
      return <ThreadSurface messages={messages} subtitle="Component-system reconstruction" title="Inspect Electron UI" />;
    case "terminal-surface":
      return <TerminalSurface />;
    default:
      return <p>No preview registered yet.</p>;
  }
}
