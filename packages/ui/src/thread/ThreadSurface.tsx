import type { ReactNode } from "react";
import "./thread-surface.css";

export type ThreadMessage = {
  body: string;
  role: "assistant" | "user";
  status?: string;
};

export type ThreadSurfaceProps = {
  afterMessages?: ReactNode;
  beforeMessages?: ReactNode;
  headerActions?: ReactNode;
  messages: ThreadMessage[];
  renderAssistantActivity?: (message: ThreadMessage, index: number) => ReactNode;
  renderMessage?: (message: ThreadMessage, index: number) => ReactNode;
  subtitle?: ReactNode;
  title: ReactNode;
};

export function ThreadSurface({
  afterMessages,
  beforeMessages,
  headerActions,
  messages,
  renderAssistantActivity,
  renderMessage,
  subtitle,
  title,
}: ThreadSurfaceProps) {
  return (
    <div className="opaline-thread">
      <header className="opaline-thread-header">
        <div>
          <h1>{title}</h1>
          {subtitle != null ? <span>{subtitle}</span> : null}
        </div>
        {headerActions != null ? <div className="opaline-thread-header-pills">{headerActions}</div> : null}
      </header>

      {beforeMessages}

      <div className="opaline-thread-messages">
        {messages.map((message, index) => (
          renderMessage?.(message, index) ?? (
            <ThreadMessageRow
              key={`${message.role}-${index}`}
              message={message}
              renderAssistantActivity={renderAssistantActivity}
              index={index}
            />
          )
        ))}
      </div>

      {afterMessages}
    </div>
  );
}

export function ThreadMessageRow({
  index,
  message,
  renderAssistantActivity,
}: {
  index: number;
  message: ThreadMessage;
  renderAssistantActivity?: (message: ThreadMessage, index: number) => ReactNode;
}) {
  return (
    <article className="opaline-message" data-role={message.role} key={`${message.role}-${index}`}>
      {message.role === "assistant" ? (
        <>
          {renderAssistantActivity != null ? (
            renderAssistantActivity(message, index)
          ) : message.status != null ? (
            <div className="opaline-message-activity">
              <span>{message.status}</span>
            </div>
          ) : null}
          <div className="opaline-message-copy">{renderBody(message.body)}</div>
        </>
      ) : (
        <div className="opaline-message-user-bubble">{renderBody(message.body)}</div>
      )}
    </article>
  );
}

function renderBody(body: string) {
  return body.split("\n").map((line, index) => (
    <p key={`${line}-${index}`}>
      {line}
    </p>
  ));
}
