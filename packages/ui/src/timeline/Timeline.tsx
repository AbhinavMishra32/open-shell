import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/utils";

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
    <div className={cn("flex flex-col", density === "compact" ? "gap-2" : density === "spacious" ? "gap-5" : "gap-3", className)} data-density={density} {...props}>
      {items.map((item, index) => (
        <div className="grid grid-cols-[1.25rem_minmax(0,1fr)] gap-2" data-status={item.status ?? "default"} key={item.id}>
          <div className="relative flex justify-center" aria-hidden="true">
            <span className="relative z-10 inline-grid size-5 place-items-center rounded-full bg-background text-muted-foreground data-[status=active]:text-primary">{item.icon}</span>
            {showConnectors && index < items.length - 1 ? <span className="absolute bottom-[-1.25rem] top-5 w-px bg-border" /> : null}
          </div>
          <div className="min-w-0 pb-2">
            <div className="flex min-w-0 items-center justify-between gap-2">
              <strong>{item.title}</strong>
              {item.meta ? <span className="shrink-0">{item.meta}</span> : null}
            </div>
            {item.description ? <div className="text-sm text-muted-foreground">{item.description}</div> : null}
            {item.content ? <div className="mt-2">{item.content}</div> : null}
          </div>
        </div>
      ))}
    </div>
  );
}
