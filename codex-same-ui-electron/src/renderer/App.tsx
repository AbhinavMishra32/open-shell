import { AppShell, Composer, Sidebar, ThreadSurface } from "../lib/codex-ui";
import "../component-library/styles/index.js";
import "../lib/codex-ui/tokens/codex-theme.css";
import "./app.css";

const threads = [
  { id: "thread-inspect-electron-ui", title: "Inspect Electron UI", meta: "reverse engineering", active: true },
  { id: "thread-component-knowledge-base", title: "Component knowledge base", meta: "notes and inventory" },
  { id: "thread-browser-sidebar", title: "Browser sidebar", meta: "component target" }
];

const projects = [
  {
    id: "project-desktop-agent-app",
    label: "desktop-agent-app",
    active: true,
    threads: [{ id: "thread-copy-ui", title: "Copy Codex UI system", meta: "active", active: true }]
  },
  {
    id: "project-application-agent",
    label: "application-agent",
    threads: [{ id: "thread-fix-dev-db", title: "Fix dev and DB errors", meta: "recent" }]
  }
];

const messages = [
  {
    role: "user" as const,
    body: "Strip out the component system and create a library component system from their code."
  },
  {
    role: "assistant" as const,
    body:
      "Created the first readable Codex UI library slice: tokens, primitives, sidebar, thread surface, composer, and app shell."
  }
];

export function App() {
  return (
    <AppShell
      sidebar={<Sidebar items={threads} projects={projects} />}
      main={<ThreadSurface title="Inspect Electron UI" messages={messages} />}
      composer={<Composer placeholder="Ask Codex to build, inspect, or recreate a component..." />}
    />
  );
}
