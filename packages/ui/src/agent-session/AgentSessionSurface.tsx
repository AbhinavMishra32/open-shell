import { ChevronRight, LoaderCircle, Sparkles } from "lucide-react";
import type { HTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";
import { useMemo, useState } from "react";
import { Button } from "../primitives/Button";
import "./agent-session.css";

export type AgentSessionToolStatus = "pending" | "running" | "completed" | "error";

export type AgentSessionToolEntry = {
  id: string;
  title: ReactNode;
  subtitle?: ReactNode;
  args?: ReactNode[];
  status?: AgentSessionToolStatus;
  content?: ReactNode;
  defaultOpen?: boolean;
};

export type AgentSessionMessagePart =
  | {
      type: "text";
      id: string;
      content: ReactNode;
      meta?: ReactNode;
    }
  | {
      type: "reasoning";
      id: string;
      label: ReactNode;
      content?: ReactNode;
      active?: boolean;
      defaultOpen?: boolean;
    }
  | {
      type: "context";
      id: string;
      activeLabel?: ReactNode;
      doneLabel?: ReactNode;
      summary?: ReactNode;
      entries: AgentSessionToolEntry[];
      active?: boolean;
      defaultOpen?: boolean;
    }
  | {
      type: "tool";
      id: string;
      tool: AgentSessionToolEntry;
    }
  | {
      type: "actions";
      id: string;
      content: ReactNode;
    };

export type AgentSessionMessage = {
  id: string;
  role: "user" | "assistant";
  content?: ReactNode;
  meta?: ReactNode;
  parts?: AgentSessionMessagePart[];
};

export type AgentSessionSurfaceProps = Omit<HTMLAttributes<HTMLDivElement>, "title"> & {
  eyebrow?: ReactNode;
  title?: ReactNode;
  lead?: ReactNode;
  messages: AgentSessionMessage[];
  composer?: ReactNode;
  emptyState?: ReactNode;
};

export type AgentSessionComposerProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "onSubmit"> & {
  value: string;
  onValueChange: (value: string) => void;
  onSubmit: () => void;
  submitLabel?: ReactNode;
  pending?: boolean;
  disabled?: boolean;
};

export function AgentSessionSurface({
  eyebrow,
  title,
  lead,
  messages,
  composer,
  emptyState,
  className = "",
  ...props
}: AgentSessionSurfaceProps) {
  return (
    <section className={`opaline-agent-session ${className}`.trim()} {...props}>
      {(eyebrow != null || title != null || lead != null) ? (
        <header className="opaline-agent-session-header">
          {eyebrow != null ? <p className="opaline-agent-session-eyebrow">{eyebrow}</p> : null}
          {title != null ? <h3 className="opaline-agent-session-title">{title}</h3> : null}
          {lead != null ? <div className="opaline-agent-session-lead">{lead}</div> : null}
        </header>
      ) : null}

      <div className="opaline-agent-session-body">
        {messages.length === 0 ? (
          <div className="opaline-agent-session-empty">{emptyState ?? "No messages yet."}</div>
        ) : (
          <div data-component="session-turn">
            <div data-slot="session-turn-content">
              <div data-slot="session-turn-message-container">
                {messages.map((message) => (
                  <AgentSessionMessageView key={message.id} message={message} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {composer ? <div className="opaline-agent-session-composer">{composer}</div> : null}
    </section>
  );
}

export function AgentSessionComposer({
  value,
  onValueChange,
  onSubmit,
  submitLabel = "Send",
  placeholder = "Answer in your own words...",
  pending = false,
  disabled = false,
  className = "",
  ...props
}: AgentSessionComposerProps) {
  const isDisabled = disabled || pending || !value.trim();

  return (
    <div className={`opaline-agent-session-compose ${className}`.trim()}>
      <textarea
        {...props}
        className="opaline-agent-session-compose-input"
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        placeholder={placeholder}
        spellCheck
      />
      <div className="opaline-agent-session-compose-actions">
        <Button type="button" disabled={isDisabled} onClick={onSubmit}>
          {pending ? "Thinking" : submitLabel}
        </Button>
      </div>
    </div>
  );
}

function AgentSessionMessageView({ message }: { message: AgentSessionMessage }) {
  if (message.role === "user") {
    return (
      <div data-component="user-message">
        {message.content ? (
          <div data-slot="user-message-body">
            <div data-slot="user-message-text">{message.content}</div>
          </div>
        ) : null}
        {message.meta ? (
          <div data-slot="user-message-copy-wrapper" style={{ opacity: 1, pointerEvents: "auto" }}>
            <span data-slot="user-message-meta-wrap">
              <span data-slot="user-message-meta">{message.meta}</span>
            </span>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div data-component="assistant-message">
      {message.parts?.map((part) => (
        <AgentSessionPartView key={part.id} part={part} />
      ))}
      {!message.parts?.length && message.content ? (
        <div data-component="text-part">
          <div data-slot="text-part-body">{message.content}</div>
          {message.meta ? <div data-slot="text-part-copy-wrapper" style={{ opacity: 1, pointerEvents: "auto" }}><span data-slot="text-part-meta">{message.meta}</span></div> : null}
        </div>
      ) : null}
    </div>
  );
}

function AgentSessionPartView({ part }: { part: AgentSessionMessagePart }) {
  if (part.type === "text") {
    return (
      <div data-component="text-part">
        <div data-slot="text-part-body">{part.content}</div>
        {part.meta ? (
          <div data-slot="text-part-copy-wrapper" style={{ opacity: 1, pointerEvents: "auto" }}>
            <span data-slot="text-part-meta">{part.meta}</span>
          </div>
        ) : null}
      </div>
    );
  }

  if (part.type === "actions") {
    return <div className="opaline-agent-session-actions">{part.content}</div>;
  }

  if (part.type === "reasoning") {
    return (
      <AgentSessionDisclosure
        active={part.active}
        defaultOpen={part.defaultOpen}
        label={part.label}
        component="reasoning-part"
      >
        {part.content}
      </AgentSessionDisclosure>
    );
  }

  if (part.type === "context") {
    const label = part.active
      ? (part.activeLabel ?? "Gathering context")
      : (part.doneLabel ?? "Gathered context");

    return (
      <AgentSessionDisclosure
        active={part.active}
        defaultOpen={part.defaultOpen}
        label={label}
        component="context-tool-group"
        summary={part.summary}
      >
        <div data-component="context-tool-group-list">
          {part.entries.map((entry) => (
            <ContextEntryRow entry={entry} key={entry.id} />
          ))}
        </div>
      </AgentSessionDisclosure>
    );
  }

  return <ToolEntryCard tool={part.tool} />;
}

function AgentSessionDisclosure({
  active,
  component,
  label,
  summary,
  defaultOpen = false,
  children,
}: {
  active?: boolean;
  component: "reasoning-part" | "context-tool-group";
  label: ReactNode;
  summary?: ReactNode;
  defaultOpen?: boolean;
  children?: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const expandable = children != null;

  return (
    <div data-component={component}>
      <button
        className="opaline-agent-session-disclosure"
        type="button"
        aria-expanded={expandable ? open : undefined}
        onClick={() => expandable && setOpen((value) => !value)}
      >
        <span data-slot="context-tool-group-title">
          <span data-slot="context-tool-group-label" className={active ? "opaline-agent-session-shimmer" : ""}>
            {active ? <LoaderCircle className="opaline-agent-session-spin" size={14} /> : <Sparkles size={14} />}
            {label}
          </span>
          {summary ? <span data-slot="context-tool-group-summary">{summary}</span> : null}
        </span>
        {expandable ? <ChevronRight className={open ? "is-open" : ""} size={14} /> : null}
      </button>
      {expandable && open ? children : null}
    </div>
  );
}

function ContextEntryRow({ entry }: { entry: AgentSessionToolEntry }) {
  return (
    <div data-slot="context-tool-group-item">
      <div data-component="tool-trigger">
        <div data-slot="basic-tool-tool-trigger-content">
          <div data-slot="basic-tool-tool-info">
            <div data-slot="basic-tool-tool-info-structured">
              <div data-slot="basic-tool-tool-info-main">
                <span data-slot="basic-tool-tool-title" className={isActive(entry.status) ? "opaline-agent-session-shimmer" : ""}>
                  {entry.title}
                </span>
                {entry.subtitle ? <span data-slot="basic-tool-tool-subtitle">{entry.subtitle}</span> : null}
                {entry.args?.map((arg, index) => <span data-slot="basic-tool-tool-arg" key={index}>{arg}</span>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ToolEntryCard({ tool }: { tool: AgentSessionToolEntry }) {
  const [open, setOpen] = useState(tool.defaultOpen ?? false);
  const expandable = tool.content != null;
  const statusLabel = useMemo(() => {
    if (tool.status === "pending" || tool.status === "running") return "Running";
    if (tool.status === "error") return "Failed";
    return "Done";
  }, [tool.status]);

  return (
    <div data-component="tool-part-wrapper">
      <div className="opaline-agent-session-tool-card">
        <button
          className="opaline-agent-session-tool-trigger"
          type="button"
          aria-expanded={expandable ? open : undefined}
          onClick={() => expandable && setOpen((value) => !value)}
        >
          <div data-component="tool-trigger">
            <div data-slot="basic-tool-tool-trigger-content">
              <div data-slot="basic-tool-tool-info">
                <div data-slot="basic-tool-tool-info-structured">
                  <div data-slot="basic-tool-tool-info-main">
                    <span data-slot="basic-tool-tool-title" className={isActive(tool.status) ? "opaline-agent-session-shimmer" : ""}>
                      {tool.title}
                    </span>
                    {tool.subtitle ? <span data-slot="basic-tool-tool-subtitle">{tool.subtitle}</span> : null}
                    {tool.args?.map((arg, index) => <span data-slot="basic-tool-tool-arg" key={index}>{arg}</span>)}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <span className="opaline-agent-session-tool-meta">
            <small>{statusLabel}</small>
            {expandable ? <ChevronRight className={open ? "is-open" : ""} size={14} /> : null}
          </span>
        </button>
        {expandable && open ? <div className="opaline-agent-session-tool-body">{tool.content}</div> : null}
      </div>
    </div>
  );
}

function isActive(status?: AgentSessionToolStatus) {
  return status === "pending" || status === "running";
}
