import { OpalineMark } from "../icons/OpalineMark";
import { Pill, StatusDot } from "../primitives/Button";
import "./thread-surface.css";

export type ThreadMessage = {
  body: string;
  role: "assistant" | "user";
};

export function ThreadSurface({ messages, title }: { messages: ThreadMessage[]; title: string }) {
  return (
    <div className="opaline-thread">
      <header className="opaline-thread-header">
        <div>
          <h1>{title}</h1>
          <span>Component-system reconstruction</span>
        </div>
        <div className="opaline-thread-header-pills">
          <Pill>non-agent</Pill>
          <Pill>library</Pill>
        </div>
      </header>

      <section className="opaline-thread-brief">
        <div className="opaline-thread-brief-icon">
          <OpalineMark className="opaline-thread-brief-logo" />
        </div>
        <div>
          <strong>Opaline UI copy app</strong>
          <p>
            Static Electron shell using stripped shared UI primitives. Literal upstream assets stay in
            `src/component-library`; readable components live in `src/lib/opaline-ui`.
          </p>
        </div>
      </section>

      <div className="opaline-thread-messages">
        {messages.map((message, index) => (
          <article className="opaline-message" data-role={message.role} key={`${message.role}-${index}`}>
            <div className="opaline-message-avatar">
              {message.role === "assistant" ? <OpalineMark className="opaline-message-logo" /> : "A"}
            </div>
            <div className="opaline-message-bubble">{message.body}</div>
          </article>
        ))}
      </div>

      <section className="opaline-run-card">
        <div className="opaline-run-card-header">
          <div>
            <StatusDot tone="green" />
            <strong>Component library extraction</strong>
          </div>
          <Pill>579 assets</Pill>
        </div>
        <div className="opaline-run-rows">
          <span>styles/index.js</span>
          <span>shell/index.js</span>
          <span>primitives/index.js</span>
          <span>component-system.json</span>
        </div>
      </section>
    </div>
  );
}
