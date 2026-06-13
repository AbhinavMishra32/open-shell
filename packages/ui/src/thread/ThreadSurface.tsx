import type { ReactNode } from "react";
import {
  AgentThinking,
  AgentActivityList,
  type AgentActivityEntry,
  type AgentActivityStatus,
} from "../agent-activity/AgentActivity";
import "./thread-surface.css";

export type ThreadMessagePart =
  | {
      type: "text";
      content: ReactNode;
    }
  | {
      type: "thinking";
      label: ReactNode;
      content?: ReactNode;
      state?: "thinking" | "thought";
      defaultOpen?: boolean;
    }
  | {
      type: "activity";
      label: ReactNode;
      detail?: ReactNode;
      status?: Exclude<AgentActivityStatus, "pending">;
      entries?: AgentActivityEntry[];
      defaultOpen?: boolean;
    }
  | {
      type: "tool";
      title: ReactNode;
      subtitle?: ReactNode;
      input?: ReactNode;
      output?: ReactNode;
      status?: "running" | "complete" | "warning" | "error";
    }
  | {
      type: "code";
      title?: ReactNode;
      content: ReactNode;
    };

export type ThreadMessage = {
  body: string;
  role: "assistant" | "user";
  parts?: ThreadMessagePart[];
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
          {message.parts?.length ? (
            <div className="opaline-message-parts">
              {message.parts.map((part, partIndex) => (
                <ThreadMessagePartView key={`${part.type}-${partIndex}`} part={part} />
              ))}
            </div>
          ) : (
            <div className="opaline-message-copy">{renderBody(message.body)}</div>
          )}
        </>
      ) : (
        <div className="opaline-message-user-bubble">{renderBody(message.body)}</div>
      )}
    </article>
  );
}

function ThreadMessagePartView({ part }: { part: ThreadMessagePart }) {
  if (part.type === "text") {
    return <div className="opaline-message-copy">{renderReactNodeBody(part.content)}</div>;
  }

  if (part.type === "thinking") {
    return (
      <AgentThinking
        className="opaline-thread-thinking"
        defaultOpen={part.defaultOpen}
        label={part.label}
        state={part.state ?? "thought"}
        content={part.content}
      />
    );
  }

  if (part.type === "activity") {
    return (
      <div className="opaline-thread-activity-block">
        <AgentThinking
          className="opaline-thread-thinking"
          defaultOpen={part.defaultOpen}
          label={part.label}
          state={part.status === "active" ? "thinking" : "thought"}
          content={part.entries?.length ? <AgentActivityList entries={part.entries} /> : part.detail}
        />
      </div>
    );
  }

  if (part.type === "tool") {
    return (
      <section className="opaline-thread-tool-card" data-status={part.status ?? "complete"}>
        <div className="opaline-thread-tool-card__header">
          <div>
            <strong>{part.title}</strong>
            {part.subtitle ? <span>{part.subtitle}</span> : null}
          </div>
          <small>{toolStatusLabel(part.status)}</small>
        </div>
        {part.input ? (
          <div className="opaline-thread-tool-card__section">
            <label>Input</label>
            <div className="opaline-thread-tool-card__code">{renderReactNodeBody(part.input)}</div>
          </div>
        ) : null}
        {part.output ? (
          <div className="opaline-thread-tool-card__section">
            <label>Output</label>
            <div className="opaline-thread-tool-card__code">{renderReactNodeBody(part.output)}</div>
          </div>
        ) : null}
      </section>
    );
  }

  return (
    <section className="opaline-thread-code-block">
      {part.title ? <strong>{part.title}</strong> : null}
      <div>{renderReactNodeBody(part.content)}</div>
    </section>
  );
}

function renderBody(body: string) {
  return body.split("\n").map((line, index) => (
    <p key={`${line}-${index}`}>
      {line}
    </p>
  ));
}

function renderReactNodeBody(content: ReactNode) {
  if (typeof content === "string") {
    return renderBody(content);
  }

  return content;
}

function toolStatusLabel(status?: "running" | "complete" | "warning" | "error") {
  if (status === "running") return "Running";
  if (status === "warning") return "Warning";
  if (status === "error") return "Failed";
  return "Done";
}
