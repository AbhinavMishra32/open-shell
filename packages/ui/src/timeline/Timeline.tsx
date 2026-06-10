import type { HTMLAttributes, ReactNode } from "react";
import "./timeline.css";

export type TimelineStatus = "default" | "completed" | "active" | "pending" | "error" | "warning" | "pushed";

export type TimelineItem = {
  id: string;
  title: ReactNode;
  description?: ReactNode;
  meta?: ReactNode;
  status?: TimelineStatus;
  icon?: ReactNode;
  content?: ReactNode;
};

export type TimelineProps = HTMLAttributes<HTMLDivElement> & {
  items: TimelineItem[];
  density?: "compact" | "default" | "spacious";
  showConnectors?: boolean;
};

export function Timeline({
  items,
  className = "",
  density = "default",
  showConnectors = true,
  ...props
}: TimelineProps) {
  return (
    <div className={`opaline-timeline ${className}`} data-density={density} {...props}>
      {items.map((item, index) => (
        <div className="opaline-timeline-item" data-status={item.status ?? "default"} key={item.id}>
          <div className="opaline-timeline-rail" aria-hidden="true">
            <span className="opaline-timeline-marker">{item.icon}</span>
            {showConnectors && index < items.length - 1 ? <span className="opaline-timeline-connector" /> : null}
          </div>
          <div className="opaline-timeline-content">
            <div className="opaline-timeline-heading">
              <strong>{item.title}</strong>
              {item.meta ? <span>{item.meta}</span> : null}
            </div>
            {item.description ? <div className="opaline-timeline-description">{item.description}</div> : null}
            {item.content ? <div className="opaline-timeline-detail">{item.content}</div> : null}
          </div>
        </div>
      ))}
    </div>
  );
}
