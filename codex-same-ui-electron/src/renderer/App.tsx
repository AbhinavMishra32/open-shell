import { AppShell } from "../lib/codex-ui/app-shell/AppShell";
import { Composer } from "../lib/codex-ui/composer/Composer";
import { Sidebar } from "../lib/codex-ui/sidebar/Sidebar";
import { ThreadSurface } from "../lib/codex-ui/thread/ThreadSurface";
import "../lib/codex-ui/tokens/codex-theme.css";
import "./app.css";

const threads = [
  { title: "Inspect Electron UI", meta: "reverse engineering", active: true },
  { title: "Component knowledge base", meta: "notes and inventory" },
  { title: "Desktop agent app", meta: "workspace" },
  { title: "Browser sidebar", meta: "component target" }
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
      sidebar={<Sidebar items={threads} />}
      main={<ThreadSurface title="Inspect Electron UI" messages={messages} />}
      composer={<Composer placeholder="Ask Codex to build, inspect, or recreate a component..." />}
    />
  );
}
