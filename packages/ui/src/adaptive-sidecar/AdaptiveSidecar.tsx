import { AnimatePresence, motion, useDragControls, useReducedMotion } from "framer-motion";
import { ChevronDown, ChevronUp, Pin, PinOff, X } from "lucide-react";
import type { CSSProperties, HTMLAttributes, PointerEvent as ReactPointerEvent, ReactNode, RefObject } from "react";
import { createContext, useContext, useLayoutEffect, useMemo, useRef, useState } from "react";
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
  keepMounted?: boolean;
};

export type AdaptiveSidecarSurfaceProps = Omit<
  HTMLAttributes<HTMLElement>,
  "title" | "onAnimationStart" | "onDrag" | "onDragEnd" | "onDragStart"
> & {
  title: ReactNode;
  eyebrow?: ReactNode;
  children?: ReactNode;
  actions?: ReactNode;
  footer?: ReactNode;
  collapsed?: boolean;
  pinned?: boolean;
  draggable?: boolean;
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
const SidecarBoundsContext = createContext<RefObject<HTMLElement | null> | null>(null);

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
  keepMounted = true,
  className = "",
  style,
  ...props
}: AdaptiveSidecarLayoutProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const railRef = useRef<HTMLElement | null>(null);
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
      } as CSSProperties}
      {...props}
    >
      <motion.div
        className="opaline-adaptive-sidecar-main"
        animate={{ x: shift }}
        transition={transition}
      >
        {children}
      </motion.div>
      {keepMounted || open ? (
        <SidecarBoundsContext.Provider value={railRef}>
          <motion.aside
            ref={railRef}
            className="opaline-adaptive-sidecar-rail"
            data-inline={inline ? "true" : "false"}
            data-visible={open ? "true" : "false"}
            aria-hidden={!open}
            initial={false}
            animate={{
              opacity: open ? 1 : 0,
              translateX: open ? 0 : "100%",
              scale: open ? 1 : 0.8,
            }}
            transition={transition}
          >
            {sidecar}
          </motion.aside>
        </SidecarBoundsContext.Provider>
      ) : null}
    </div>
  );
}

export function AdaptiveSidecarSurface({
  title,
  eyebrow,
  children,
  actions,
  footer,
  collapsed = false,
  pinned = false,
  draggable = false,
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
  const dragControls = useDragControls();
  const dragBounds = useContext(SidecarBoundsContext);
  const transition = reduceMotion ? { duration: 0 } : panelSpring;

  return (
    <motion.article
      layout
      className={`opaline-adaptive-sidecar-surface ${className}`.trim()}
      data-collapsed={collapsed ? "true" : "false"}
      data-pinned={pinned ? "true" : "false"}
      data-draggable={draggable ? "true" : "false"}
      transition={transition}
      drag={draggable ? "y" : false}
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      dragElastic={0.035}
      dragConstraints={dragBounds ?? undefined}
      {...props}
    >
      <header
        className="opaline-adaptive-sidecar-header"
        onPointerDown={(event: ReactPointerEvent<HTMLElement>) => {
          if (draggable && !(event.target as HTMLElement).closest("button, a")) dragControls.start(event);
        }}
      >
        <div className="opaline-adaptive-sidecar-heading">
          {eyebrow ? <span>{eyebrow}</span> : null}
          <strong>{title}</strong>
        </div>
        <div className="opaline-adaptive-sidecar-actions">
          {actions}
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
