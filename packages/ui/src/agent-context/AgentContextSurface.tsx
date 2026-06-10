import { AnimatePresence, motion, useDragControls } from "framer-motion";
import { ArrowUpRight, Expand, Sparkles, X } from "lucide-react";
import type { HTMLAttributes, PointerEvent as ReactPointerEvent, ReactNode } from "react";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./agent-context.css";

export type AgentContextAnchor = { x: number; y: number };
export type AgentContextMode = "anchored" | "floating";
export type AgentContextStage = "prompt" | "working" | "result" | "error";

export type AgentContextSurfaceProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "title" | "onAnimationStart" | "onDrag" | "onDragEnd" | "onDragStart"
> & {
  open: boolean;
  anchor?: AgentContextAnchor | null;
  mode?: AgentContextMode;
  stage?: AgentContextStage;
  title?: ReactNode;
  eyebrow?: ReactNode;
  children?: ReactNode;
  onDismiss?: () => void;
  onModeChange?: (mode: AgentContextMode) => void;
  floatingLabel?: string;
  collisionPadding?: number;
};

const spring = { type: "spring" as const, stiffness: 430, damping: 38, mass: 0.82 };

export function AgentContextSurface({
  open,
  anchor,
  mode = "anchored",
  stage = "prompt",
  title,
  eyebrow,
  children,
  onDismiss,
  onModeChange,
  floatingLabel = "Open as floating card",
  collisionPadding = 12,
  className = "",
  ...props
}: AgentContextSurfaceProps) {
  const surfaceRef = useRef<HTMLDivElement | null>(null);
  const dragControls = useDragControls();
  const [measuredSize, setMeasuredSize] = useState({ width: 320, height: 52 });

  useLayoutEffect(() => {
    if (!open || !surfaceRef.current) return;
    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return;
      setMeasuredSize({ width: entry.borderBoxSize?.[0]?.inlineSize ?? entry.contentRect.width, height: entry.borderBoxSize?.[0]?.blockSize ?? entry.contentRect.height });
    });
    observer.observe(surfaceRef.current);
    return () => observer.disconnect();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onDismiss?.();
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!surfaceRef.current?.contains(event.target as Node)) onDismiss?.();
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pointerdown", onPointerDown, true);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointerdown", onPointerDown, true);
    };
  }, [open, onDismiss]);

  const position = useMemo(() => {
    if (mode === "floating") {
      return {
        left: Math.max(collisionPadding, window.innerWidth - Math.min(520, window.innerWidth - collisionPadding * 2) - 24),
        top: Math.max(collisionPadding, Math.min(92, window.innerHeight - measuredSize.height - collisionPadding))
      };
    }
    const desiredLeft = anchor?.x ?? collisionPadding;
    const desiredTop = (anchor?.y ?? collisionPadding) + 8;
    const left = Math.min(Math.max(collisionPadding, desiredLeft), Math.max(collisionPadding, window.innerWidth - measuredSize.width - collisionPadding));
    const below = window.innerHeight - desiredTop;
    const top = below >= measuredSize.height + collisionPadding
      ? desiredTop
      : Math.max(collisionPadding, (anchor?.y ?? desiredTop) - measuredSize.height - 8);
    return { left, top };
  }, [anchor?.x, anchor?.y, collisionPadding, measuredSize.height, measuredSize.width, mode]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          ref={surfaceRef}
          layout
          layoutId="opaline-agent-context-surface"
          className={`opaline-agent-context-surface ${className}`.trim()}
          data-mode={mode}
          data-stage={stage}
          style={{ left: position.left, top: position.top }}
          initial={{ opacity: 0, scale: 0.965, y: -5 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.975, y: -3 }}
          transition={spring}
          drag={mode === "floating"}
          dragControls={dragControls}
          dragListener={false}
          dragMomentum={false}
          dragElastic={0.04}
          {...props}
        >
          {(mode === "floating" || title || eyebrow) ? (
            <header
              className="opaline-agent-context-header"
              onPointerDown={(event: ReactPointerEvent<HTMLElement>) => {
                if (mode === "floating" && !(event.target as HTMLElement).closest("button, a")) dragControls.start(event);
              }}
            >
              <span className="opaline-agent-context-mark"><Sparkles size={14} /></span>
              <div className="opaline-agent-context-heading">
                {eyebrow ? <small>{eyebrow}</small> : null}
                {title ? <strong>{title}</strong> : null}
              </div>
              <div className="opaline-agent-context-actions">
                {mode === "anchored" && stage !== "prompt" && onModeChange ? (
                  <button type="button" onClick={() => onModeChange("floating")} aria-label={floatingLabel} title={floatingLabel}>
                    <Expand size={14} />
                  </button>
                ) : null}
                <button type="button" onClick={onDismiss} aria-label="Close"><X size={14} /></button>
              </div>
            </header>
          ) : null}
          <motion.div className="opaline-agent-context-body" layout transition={spring}>
            {children}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}

export type AgentContextActionProps = HTMLAttributes<HTMLButtonElement> & {
  icon?: ReactNode;
  label: ReactNode;
  description?: ReactNode;
};

export function AgentContextAction({ icon, label, description, className = "", ...props }: AgentContextActionProps) {
  return (
    <button className={`opaline-agent-context-action ${className}`.trim()} type="button" {...props}>
      <span className="opaline-agent-context-action-icon">{icon ?? <Sparkles size={14} />}</span>
      <span><strong>{label}</strong>{description ? <small>{description}</small> : null}</span>
    </button>
  );
}

export type AgentContextSource = { id: string; title: string; url: string; domain?: string };

export function AgentContextSources({ sources, label = "Sources" }: { sources: AgentContextSource[]; label?: ReactNode }) {
  if (sources.length === 0) return null;
  return (
    <section className="opaline-agent-context-sources">
      <small>{label}</small>
      <div>
        {sources.map((source, index) => (
          <a href={source.url} key={source.id} target="_blank" rel="noreferrer">
            <span>{index + 1}</span>
            <b>{source.domain ?? source.title}</b>
            <ArrowUpRight size={11} />
          </a>
        ))}
      </div>
    </section>
  );
}
