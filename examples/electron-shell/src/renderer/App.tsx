import {
  AppShell,
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
  FileTree,
  Sidebar,
  TerminalSurface,
  ThreadSurface,
} from "@open-shell/ui";
import "@open-shell/ui/styles.css";
import "./app.css";

const threads = [
  { id: "thread-inspect-electron-ui", title: "Inspect Electron UI", meta: "reverse engineering", active: true },
  { id: "thread-component-knowledge-base", title: "Component knowledge base", meta: "notes and inventory" },
  { id: "thread-browser-sidebar", title: "Browser sidebar", meta: "component target" },
];

const projects = [
  {
    id: "project-desktop-agent-app",
    label: "desktop-agent-app",
    active: true,
    threads: [{ id: "thread-copy-ui", title: "Copy Codex UI system", meta: "active", active: true }],
  },
  {
    id: "project-application-agent",
    label: "application-agent",
    threads: [{ id: "thread-fix-dev-db", title: "Fix dev and DB errors", meta: "recent" }],
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
      { name: "package.json", path: "package.json", gitStatus: "modified" as const },
    ],
  },
];

export function App() {
  return (
    <AppShell
      sidebar={<Sidebar items={threads} projects={projects} />}
      main={
        <div className="codex-renderer-stack">
          <ThreadSurface title="Inspect Electron UI" messages={messages} />
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
      bottomPanel={
        <BottomPanel
          tabs={[
            {
              active: true,
              closable: true,
              id: "terminal",
              title: "open-shell",
              content: (
                <TerminalSurface>
                  {`[AppServerConnection] incoming_line_processed dispatchDurationMs=0 lineBytes=358
[electron-message-handler] Request completed conversationId=none durationMs=72
~/open-shell main
› npm run start:example`}
                </TerminalSurface>
              ),
            },
            {
              id: "files",
              title: "Files",
              content: <FileTree items={fileTreeItems} />,
            },
          ]}
        />
      }
    />
  );
}
