import { AlertCircle, Check, ChevronRight, Circle, LoaderCircle } from "lucide-react";
import type { HTMLAttributes, ReactNode } from "react";
import { memo, useState } from "react";
import "./agent-activity.css";

export type AgentActivityStatus = "pending" | "active" | "complete" | "warning" | "error";

export type AgentActivityEntry = {
  id: string;
  title: ReactNode;
  detail?: ReactNode;
  status?: AgentActivityStatus;
  icon?: ReactNode;
  meta?: ReactNode;
};

export type AgentThinkingProps = HTMLAttributes<HTMLDivElement> & {
  state?: "thinking" | "thought";
  label?: ReactNode;
  content?: ReactNode;
  defaultOpen?: boolean;
  expanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
};

export const AgentThinking = memo(function AgentThinking({
  state = "thinking",
  label,
  content,
  defaultOpen = false,
  expanded,
  onExpandedChange,
  className = "",
  ...props
}: AgentThinkingProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isControlled = expanded !== undefined;
  const isOpen = isControlled ? expanded : internalOpen;
  const expandable = content != null;

  function toggle() {
    if (!expandable) return;
    const next = !isOpen;
    if (!isControlled) setInternalOpen(next);
    onExpandedChange?.(next);
  }

  return (
    <div className={`opaline-agent-thinking ${className}`} data-state={state} {...props}>
      <button type="button" onClick={toggle} disabled={!expandable} aria-expanded={expandable ? isOpen : undefined}>
        <span className={state === "thinking" ? "opaline-agent-shimmer" : ""}>{label ?? (state === "thinking" ? "Thinking" : "Thought")}</span>
        {expandable ? <ChevronRight size={13} className={isOpen ? "is-open" : ""} /> : null}
      </button>
      {expandable && isOpen ? <div className="opaline-agent-thinking-content">{content}</div> : null}
    </div>
  );
});

export type AgentActivityProps = HTMLAttributes<HTMLDivElement> & {
  label: ReactNode;
  detail?: ReactNode;
  status?: Exclude<AgentActivityStatus, "pending">;
  entries?: AgentActivityEntry[];
  defaultOpen?: boolean;
  expanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
};

export function AgentActivity({
  label,
  detail,
  status = "active",
  entries = [],
  defaultOpen = false,
  expanded,
  onExpandedChange,
  className = "",
  ...props
}: AgentActivityProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isControlled = expanded !== undefined;
  const isOpen = isControlled ? expanded : internalOpen;
  const expandable = entries.length > 0;

  function toggle() {
    if (!expandable) return;
    const next = !isOpen;
    if (!isControlled) setInternalOpen(next);
    onExpandedChange?.(next);
  }

  return (
    <div className={`opaline-agent-activity ${className}`} data-status={status} {...props}>
      <button className="opaline-agent-activity-summary" type="button" onClick={toggle} disabled={!expandable} aria-expanded={expandable ? isOpen : undefined}>
        <span className="opaline-agent-activity-status">{activityIcon(status)}</span>
        <span className="opaline-agent-activity-copy">
          <strong className={status === "active" ? "opaline-agent-shimmer" : ""}>{label}</strong>
          {detail ? <small>{detail}</small> : null}
        </span>
        {expandable ? <ChevronRight size={14} className={isOpen ? "is-open" : ""} /> : null}
      </button>
      {expandable && isOpen ? (
        <div className="opaline-agent-activity-list">
          {entries.map((entry) => {
            const entryStatus = entry.status ?? "pending";
            return (
              <div className="opaline-agent-activity-entry" data-status={entryStatus} key={entry.id}>
                <span className="opaline-agent-activity-entry-icon">{entry.icon ?? activityIcon(entryStatus)}</span>
                <div>
                  <div className="opaline-agent-activity-entry-heading">
                    <strong className={entryStatus === "active" ? "opaline-agent-shimmer" : ""}>{entry.title}</strong>
                    {entry.meta ? <span>{entry.meta}</span> : null}
                  </div>
                  {entry.detail ? <p>{entry.detail}</p> : null}
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export type AgentSuggestionProps = Omit<HTMLAttributes<HTMLDivElement>, "title"> & {
  title: ReactNode;
  description?: ReactNode;
  actionLabel?: ReactNode;
  onAction?: () => void;
  disabled?: boolean;
};

export function AgentSuggestion({ title, description, actionLabel = "Apply", onAction, disabled, className = "", ...props }: AgentSuggestionProps) {
  return (
    <div className={`opaline-agent-suggestion ${className}`} {...props}>
      <div><strong>{title}</strong>{description ? <p>{description}</p> : null}</div>
      {onAction ? <button type="button" disabled={disabled} onClick={onAction}>{actionLabel}</button> : null}
    </div>
  );
}

function activityIcon(status: AgentActivityStatus): ReactNode {
  if (status === "complete") return <Check size={12} />;
  if (status === "active") return <LoaderCircle className="opaline-agent-spin" size={12} />;
  if (status === "warning" || status === "error") return <AlertCircle size={12} />;
  return <Circle size={7} />;
}
