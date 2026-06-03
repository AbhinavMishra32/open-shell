import { CodexMark } from "../icons/CodexMark";
import "./thread-surface.css";

export type ThreadMessage = {
  body: string;
  role: "assistant" | "user";
};

export function ThreadSurface({ messages, title }: { messages: ThreadMessage[]; title: string }) {
  return (
    <div className="codex-thread">
      <header className="codex-thread-header">
        <h1>{title}</h1>
        <span>Component-system reconstruction</span>
      </header>

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
    </div>
  );
}
