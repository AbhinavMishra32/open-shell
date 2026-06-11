import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown, ChevronUp, Pin, PinOff, X } from "lucide-react";
import type { HTMLAttributes, ReactNode } from "react";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import "./adaptive-sidecar.css";

export type AdaptiveSidecarMode = "overlay" | "shift" | "gutter";

export type AdaptiveSidecarLayoutProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  sidecar: ReactNode;
  open: boolean;
  pinned?: boolean;
  sidecarWidth?: number;
  gap?: number;
  overlayThreshold?: number;
  gutterThreshold?: number;
};

export type AdaptiveSidecarSurfaceProps = Omit<
  HTMLAttributes<HTMLElement>,
  "title" | "onAnimationStart" | "onDrag" | "onDragEnd" | "onDragStart"
> & {
  title: ReactNode;
  eyebrow?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  collapsed?: boolean;
  pinned?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  onPinnedChange?: (pinned: boolean) => void;
  onClose?: () => void;
  closeLabel?: string;
  collapseLabel?: string;
  expandLabel?: string;
  pinLabel?: string;
  unpinLabel?: string;
};

const SIDE_WIDTH = 300;
const SIDE_GAP = 16;
const OVERLAY_THRESHOLD = 1096;
const GUTTER_THRESHOLD = 1536;
const panelSpring = { type: "spring" as const, duration: 0.3, bounce: 0.01 };

export function getAdaptiveSidecarMode(
  width: number,
  overlayThreshold = OVERLAY_THRESHOLD,
  gutterThreshold = GUTTER_THRESHOLD,
): AdaptiveSidecarMode {
  if (width < overlayThreshold) return "overlay";
  if (width < gutterThreshold) return "shift";
  return "gutter";
}

export function AdaptiveSidecarLayout({
  children,
  sidecar,
  open,
  pinned = false,
  sidecarWidth = SIDE_WIDTH,
  gap = SIDE_GAP,
  overlayThreshold = OVERLAY_THRESHOLD,
  gutterThreshold = GUTTER_THRESHOLD,
  className = "",
  style,
  ...props
}: AdaptiveSidecarLayoutProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(0);
  const reduceMotion = useReducedMotion();

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const update = () => setWidth(root.getBoundingClientRect().width);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  const mode = useMemo(
    () => getAdaptiveSidecarMode(width, overlayThreshold, gutterThreshold),
    [gutterThreshold, overlayThreshold, width],
  );
  const inline = open && pinned && mode !== "overlay";
  const shift = inline && mode === "shift" ? -(sidecarWidth + gap) / 2 : 0;
  const transition = reduceMotion ? { duration: 0 } : panelSpring;

  return (
    <div
      ref={rootRef}
      className={`opaline-adaptive-sidecar-layout ${className}`.trim()}
      data-mode={mode}
      data-open={open ? "true" : "false"}
      data-pinned={pinned ? "true" : "false"}
      style={{
        ...style,
        "--opaline-sidecar-width": `${sidecarWidth}px`,
        "--opaline-sidecar-gap": `${gap}px`,
      } as React.CSSProperties}
      {...props}
    >
      <motion.div
        className="opaline-adaptive-sidecar-main"
        animate={{ x: shift }}
        transition={transition}
      >
        {children}
      </motion.div>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.aside
            key={`${mode}:${inline ? "inline" : "overlay"}`}
            className="opaline-adaptive-sidecar-rail"
            data-inline={inline ? "true" : "false"}
            initial={{ opacity: 0, x: 12, scale: 0.985 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 8, scale: 0.99 }}
            transition={transition}
          >
            {sidecar}
          </motion.aside>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export function AdaptiveSidecarSurface({
  title,
  eyebrow,
  children,
  footer,
  collapsed = false,
  pinned = false,
  onCollapsedChange,
  onPinnedChange,
  onClose,
  closeLabel = "Close",
  collapseLabel = "Collapse",
  expandLabel = "Expand",
  pinLabel = "Pin",
  unpinLabel = "Unpin",
  className = "",
  ...props
}: AdaptiveSidecarSurfaceProps) {
  const reduceMotion = useReducedMotion();
  const transition = reduceMotion ? { duration: 0 } : panelSpring;

  return (
    <motion.article
      layout
      className={`opaline-adaptive-sidecar-surface ${className}`.trim()}
      data-collapsed={collapsed ? "true" : "false"}
      data-pinned={pinned ? "true" : "false"}
      transition={transition}
      {...props}
    >
      <header className="opaline-adaptive-sidecar-header">
        <div className="opaline-adaptive-sidecar-heading">
          {eyebrow ? <span>{eyebrow}</span> : null}
          <strong>{title}</strong>
        </div>
        <div className="opaline-adaptive-sidecar-actions">
          {onCollapsedChange ? (
            <button
              type="button"
              onClick={() => onCollapsedChange(!collapsed)}
              aria-label={collapsed ? expandLabel : collapseLabel}
              title={collapsed ? expandLabel : collapseLabel}
            >
              {collapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
            </button>
          ) : null}
          {onPinnedChange ? (
            <button
              type="button"
              onClick={() => onPinnedChange(!pinned)}
              aria-label={pinned ? unpinLabel : pinLabel}
              title={pinned ? unpinLabel : pinLabel}
            >
              {pinned ? <PinOff size={14} /> : <Pin size={14} />}
            </button>
          ) : null}
          {onClose ? (
            <button type="button" onClick={onClose} aria-label={closeLabel} title={closeLabel}>
              <X size={14} />
            </button>
          ) : null}
        </div>
      </header>
      <AnimatePresence initial={false}>
        {!collapsed ? (
          <motion.div
            key="content"
            className="opaline-adaptive-sidecar-content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={transition}
          >
            <div className="opaline-adaptive-sidecar-scroll">{children}</div>
            {footer ? <footer className="opaline-adaptive-sidecar-footer">{footer}</footer> : null}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.article>
  );
}
