import { ChevronRight, LoaderCircle, Sparkles } from "lucide-react";
import type { HTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";
import { useMemo, useState } from "react";
import { Button } from "../components/button";
import { cn } from "../lib/utils";

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
    <section className={cn("flex min-h-0 flex-1 flex-col bg-background text-foreground", className)} {...props}>
      {(eyebrow != null || title != null || lead != null) ? (
        <header className="shrink-0 border-b px-4 py-3">
          {eyebrow != null ? <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{eyebrow}</p> : null}
          {title != null ? <h3 className="mt-0.5 text-sm font-semibold">{title}</h3> : null}
          {lead != null ? <div className="mt-1 text-xs text-muted-foreground">{lead}</div> : null}
        </header>
      ) : null}

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3 [&_[data-component=assistant-message]]:space-y-3 [&_[data-component=session-turn-message-container]]:space-y-4 [&_[data-component=text-part]]:text-sm [&_[data-component=user-message]]:ml-auto [&_[data-component=user-message]]:max-w-[85%] [&_[data-slot=user-message-body]]:rounded-lg [&_[data-slot=user-message-body]]:bg-muted [&_[data-slot=user-message-body]]:px-3 [&_[data-slot=user-message-body]]:py-2 [&_[data-slot$=-meta]]:text-[10px] [&_[data-slot$=-meta]]:text-muted-foreground">
        {messages.length === 0 ? (
          <div className="flex min-h-32 items-center justify-center text-sm text-muted-foreground">{emptyState ?? "No messages yet."}</div>
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

      {composer ? <div className="shrink-0 border-t p-3">{composer}</div> : null}
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
    <div className={cn("rounded-lg border bg-background p-2 focus-within:ring-2 focus-within:ring-ring/30", className)}>
      <textarea
        {...props}
        className="min-h-20 w-full resize-none bg-transparent px-1 text-sm outline-none placeholder:text-muted-foreground"
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        placeholder={placeholder}
        spellCheck
      />
      <div className="mt-2 flex justify-end">
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
    return <div className="flex flex-wrap items-center gap-2">{part.content}</div>;
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
        className="flex w-full items-start justify-between gap-3 rounded-md py-1 text-left text-xs text-muted-foreground hover:text-foreground"
        type="button"
        aria-expanded={expandable ? open : undefined}
        onClick={() => expandable && setOpen((value) => !value)}
      >
        <span className="min-w-0" data-slot="context-tool-group-title">
          <span className={cn("flex items-center gap-1.5 font-medium", active && "animate-pulse")} data-slot="context-tool-group-label">
            {active ? <LoaderCircle className="animate-spin" size={14} /> : <Sparkles size={14} />}
            {label}
          </span>
          {summary ? <span className="mt-0.5 block text-[11px]" data-slot="context-tool-group-summary">{summary}</span> : null}
        </span>
        {expandable ? <ChevronRight className={cn("shrink-0 transition-transform", open && "rotate-90")} size={14} /> : null}
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
                <span data-slot="basic-tool-tool-title" className={cn("text-xs font-medium", isActive(entry.status) && "animate-pulse")}>
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
      <div className="overflow-hidden rounded-lg border bg-card">
        <button
          className="flex w-full items-center justify-between gap-3 p-3 text-left hover:bg-muted/50"
          type="button"
          aria-expanded={expandable ? open : undefined}
          onClick={() => expandable && setOpen((value) => !value)}
        >
          <div data-component="tool-trigger">
            <div data-slot="basic-tool-tool-trigger-content">
              <div data-slot="basic-tool-tool-info">
                <div data-slot="basic-tool-tool-info-structured">
                  <div data-slot="basic-tool-tool-info-main">
                    <span data-slot="basic-tool-tool-title" className={cn("text-xs font-medium", isActive(tool.status) && "animate-pulse")}>
                      {tool.title}
                    </span>
                    {tool.subtitle ? <span data-slot="basic-tool-tool-subtitle">{tool.subtitle}</span> : null}
                    {tool.args?.map((arg, index) => <span data-slot="basic-tool-tool-arg" key={index}>{arg}</span>)}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <span className="flex shrink-0 items-center gap-1 text-muted-foreground">
            <small className="text-[10px]">{statusLabel}</small>
            {expandable ? <ChevronRight className={cn("transition-transform", open && "rotate-90")} size={14} /> : null}
          </span>
        </button>
        {expandable && open ? <div className="border-t p-3 text-xs">{tool.content}</div> : null}
      </div>
    </div>
  );
}

function isActive(status?: AgentSessionToolStatus) {
  return status === "pending" || status === "running";
}
