import { CodexMark } from "../icons/CodexMark";
import { Pill, StatusDot } from "../primitives/Button";
import "./thread-surface.css";

export type ThreadMessage = {
  body: string;
  role: "assistant" | "user";
};

export function ThreadSurface({ messages, title }: { messages: ThreadMessage[]; title: string }) {
  return (
    <div className="codex-thread">
      <header className="codex-thread-header">
        <div>
          <h1>{title}</h1>
          <span>Component-system reconstruction</span>
        </div>
        <div className="codex-thread-header-pills">
          <Pill>non-agent</Pill>
          <Pill>library</Pill>
        </div>
      </header>

      <section className="codex-thread-brief">
        <div className="codex-thread-brief-icon">
          <CodexMark className="codex-thread-brief-logo" />
        </div>
        <div>
          <strong>Codex UI copy app</strong>
          <p>
            Static Electron shell using stripped shared UI primitives. Literal upstream assets stay in
            `src/component-library`; readable components live in `src/lib/codex-ui`.
          </p>
        </div>
      </section>

      <div className="codex-thread-messages">
        {messages.map((message, index) => (
          <article className="codex-message" data-role={message.role} key={`${message.role}-${index}`}>
            <div className="codex-message-avatar">
              {message.role === "assistant" ? <CodexMark className="codex-message-logo" /> : "A"}
            </div>
            <div className="codex-message-bubble">{message.body}</div>
          </article>
        ))}
      </div>

      <section className="codex-run-card">
        <div className="codex-run-card-header">
          <div>
            <StatusDot tone="green" />
            <strong>Component library extraction</strong>
          </div>
          <Pill>579 assets</Pill>
        </div>
        <div className="codex-run-rows">
          <span>styles/index.js</span>
          <span>shell/index.js</span>
          <span>primitives/index.js</span>
          <span>component-system.json</span>
        </div>
      </section>
    </div>
  );
}
