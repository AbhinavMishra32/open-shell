import type { ReactNode } from "react";
import "./app-shell.css";

type AppShellProps = {
  composer: ReactNode;
  main: ReactNode;
  sidebar: ReactNode;
};

export function AppShell({ composer, main, sidebar }: AppShellProps) {
  return (
    <div className="codex-app-shell">
      {sidebar}
      <main className="codex-app-main">
        <div className="codex-titlebar" />
        <section className="codex-content-frame">{main}</section>
        <section className="codex-composer-frame">{composer}</section>
      </main>
    </div>
  );
}
