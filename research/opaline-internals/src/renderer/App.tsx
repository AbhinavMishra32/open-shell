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
} from "../lib/opaline-ui";
import "../component-library/styles/index.js";
import "../lib/opaline-ui/tokens/opaline-theme.css";
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
    threads: [{ id: "thread-copy-ui", title: "Copy Opaline UI system", meta: "active", active: true }],
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
      "The readable component library now carries Opaline shell/sidebar/composer/thread primitives plus recovered dialog, bottom panel, terminal, and file-tree systems.",
  },
];

const fileTreeItems = [
  {
    name: "opaline-same-ui-electron",
    path: "opaline-same-ui-electron",
    type: "directory" as const,
    children: [
      {
        name: "src",
        path: "opaline-same-ui-electron/src",
        type: "directory" as const,
        children: [
          {
            name: "lib",
            path: "opaline-same-ui-electron/src/lib",
            type: "directory" as const,
            children: [
              { name: "Dialog.tsx", path: "src/lib/opaline-ui/primitives/Dialog.tsx", gitStatus: "added" as const },
              {
                name: "BottomPanel.tsx",
                path: "src/lib/opaline-ui/bottom-panel/BottomPanel.tsx",
                gitStatus: "added" as const,
              },
              { name: "FileTree.tsx", path: "src/lib/opaline-ui/file-tree/FileTree.tsx", gitStatus: "added" as const },
            ],
          },
          { name: "renderer", path: "opaline-same-ui-electron/src/renderer", type: "directory" as const },
        ],
      },
      { name: "package.json", path: "opaline-same-ui-electron/package.json", gitStatus: "modified" as const },
    ],
  },
];

export function App() {
  return (
    <AppShell
      sidebar={<Sidebar items={threads} projects={projects} />}
      main={
        <div className="opaline-renderer-stack">
          <ThreadSurface title="Inspect Electron UI" messages={messages} />
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary">Open Opaline popup primitive</Button>
            </DialogTrigger>
            <DialogContent size="wide">
              <DialogHeader
                title="Opaline dialog primitive"
                subtitle="Radix dialog behavior with the recovered Opaline overlay, surface, close button, sizes, and measured-height transition."
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
      composer={<Composer placeholder="Ask Opaline to build, inspect, or recreate a component..." />}
      bottomPanel={
        <BottomPanel
          tabs={[
            {
              active: true,
              closable: true,
              id: "terminal",
              title: "desktop-agent-app",
              content: (
                <TerminalSurface>
                  {`[AppServerConnection] incoming_line_processed dispatchDurationMs=0 lineBytes=358
[electron-message-handler] Request completed conversationId=none durationMs=72
~/solin/general/desktop-agent-app/opaline-same-ui-electron main
› npm run start:library`}
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
