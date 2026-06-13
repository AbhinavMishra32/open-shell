import type { ButtonHTMLAttributes, CSSProperties, HTMLAttributes, PointerEvent as ReactPointerEvent, ReactNode } from "react";
import { Fragment, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { appActionAttributes } from "./appActionAttributes";
import "./sidebar.css";

export type SidebarItem = {
  active?: boolean;
  hostId?: string | null;
  id: string;
  label?: string;
  kind?: "local" | "remote";
  meta?: ReactNode;
  pinned?: boolean;
  time?: ReactNode;
  title: ReactNode;
};

export type SidebarProject = {
  active?: boolean;
  collapsed?: boolean;
  icon?: ReactNode;
  id: string;
  label: ReactNode;
  labelForAttributes?: string;
  muted?: boolean;
  threads?: SidebarItem[];
};

export type SidebarNavItem = {
  active?: boolean;
  icon?: ReactNode;
  id: string;
  label: ReactNode;
  onClick?: () => void;
};

export type SidebarProps = {
  children?: ReactNode;
  footer?: ReactNode;
  items?: SidebarItem[];
  onProjectSelect?: (projectId: string) => void;
  primaryItems?: SidebarNavItem[];
  projects?: SidebarProject[];
  renderItem?: (item: SidebarItem, options: { inset: boolean }) => ReactNode;
  renderNavItem?: (item: SidebarNavItem) => ReactNode;
  renderProject?: (project: SidebarProject) => ReactNode;
  sectionLabels?: {
    items?: string;
    projects?: string;
  };
};

export function Sidebar({
  children,
  footer,
  items = [],
  onProjectSelect,
  primaryItems = [],
  projects = [],
  renderItem,
  renderNavItem,
  renderProject,
  sectionLabels = { items: "Items", projects: "Projects" },
}: SidebarProps) {
  return (
    <aside className="opaline-sidebar">
      {primaryItems.length > 0 ? (
        <SidebarPrimary>
          {primaryItems.map((item) => renderNavItem?.(item) ?? <SidebarNavItemRow item={item} key={item.id} />)}
        </SidebarPrimary>
      ) : null}

      <SidebarScroll>
        {projects.length > 0 ? (
          <SidebarSection heading={sectionLabels.projects ?? "Projects"}>
            {projects.map((project) => (
              renderProject?.(project) ?? (
                <SidebarProjectRow
                  key={project.id}
                  project={project}
                  renderItem={renderItem}
                  onSelect={onProjectSelect}
                />
              )
            ))}
          </SidebarSection>
        ) : null}

        {items.length > 0 ? (
          <SidebarSection heading={sectionLabels.items ?? "Items"}>
            <nav className="opaline-sidebar-list" aria-label={sectionLabels.items ?? "Items"}>
              {items.map((item) => {
                const renderedItem = renderItem?.(item, { inset: false });
                return renderedItem != null ? (
                  <Fragment key={item.id}>{renderedItem}</Fragment>
                ) : (
                  <SidebarThreadRow key={item.id} item={item} />
                );
              })}
            </nav>
          </SidebarSection>
        ) : null}
        {children}
      </SidebarScroll>

      {footer != null ? <SidebarFooter>{footer}</SidebarFooter> : null}
    </aside>
  );
}

export function SidebarPrimary({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={joinClassNames("opaline-sidebar-primary", className)} role="navigation" aria-label="Primary" {...props}>
      {children}
    </div>
  );
}

export function SidebarScroll({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={joinClassNames("opaline-sidebar-scroll", className)} {...appActionAttributes.sidebarScroll} {...props}>
      {children}
    </div>
  );
}

export function SidebarFooter({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={joinClassNames("opaline-sidebar-footer", className)} {...props}>
      {children}
    </div>
  );
}

export type SidebarBottomSlotProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  defaultHeight?: number;
  header: ReactNode;
  maxHeight?: number;
  minHeight?: number;
  onCollapsedChange?: (collapsed: boolean) => void;
};

export function SidebarBottomSlot({
  children,
  className,
  collapsed,
  defaultCollapsed = false,
  defaultHeight = 240,
  header,
  maxHeight = 520,
  minHeight = 120,
  onCollapsedChange,
  style,
  ...props
}: SidebarBottomSlotProps) {
  const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);
  const [height, setHeight] = useState(defaultHeight);
  const dragRef = useRef<{ pointerId: number; startHeight: number; startY: number } | null>(null);
  const isControlled = collapsed !== undefined;
  const isCollapsed = isControlled ? collapsed : internalCollapsed;

  function setCollapsed(next: boolean) {
    if (!isControlled) setInternalCollapsed(next);
    onCollapsedChange?.(next);
  }

  function beginResize(event: ReactPointerEvent<HTMLDivElement>) {
    if (isCollapsed) return;
    dragRef.current = { pointerId: event.pointerId, startHeight: height, startY: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function resize(event: ReactPointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    setHeight(Math.max(minHeight, Math.min(maxHeight, drag.startHeight + drag.startY - event.clientY)));
  }

  function endResize(event: ReactPointerEvent<HTMLDivElement>) {
    if (dragRef.current?.pointerId !== event.pointerId) return;
    dragRef.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);
  }

  return (
    <div
      className={joinClassNames("opaline-sidebar-bottom-slot", className)}
      data-collapsed={isCollapsed ? "true" : "false"}
      style={{ ...style, "--opaline-sidebar-slot-height": `${height}px` } as CSSProperties}
      {...props}
    >
      <div
        className="opaline-sidebar-bottom-slot-resize"
        onPointerDown={beginResize}
        onPointerMove={resize}
        onPointerCancel={endResize}
        onPointerUp={endResize}
      />
      <button className="opaline-sidebar-bottom-slot-header" type="button" aria-expanded={!isCollapsed} onClick={() => setCollapsed(!isCollapsed)}>
        {header}
      </button>
      <div className="opaline-sidebar-bottom-slot-content">{children}</div>
    </div>
  );
}

export function SidebarNavItemRow({
  className,
  item,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { item: SidebarNavItem }) {
  return (
    <button
      className={joinClassNames("opaline-sidebar-nav-item", className)}
      data-active={item.active === true ? "true" : undefined}
      onClick={item.onClick}
      type={type}
      {...props}
    >
      {item.icon != null ? (
        <span className="opaline-sidebar-nav-icon" aria-hidden="true">
          {item.icon}
        </span>
      ) : null}
      {item.label}
    </button>
  );
}

export function SidebarSection({ children, heading }: { children: ReactNode; heading: string }) {
  return (
    <section className="opaline-sidebar-section" {...appActionAttributes.sidebarSection({ collapsed: false, heading })}>
      <button className="opaline-sidebar-section-header" {...appActionAttributes.sidebarSectionToggle}>
        <span className="opaline-sidebar-section-label">{heading}</span>
      </button>
      {children}
    </section>
  );
}

export function SidebarProjectRow({
  onSelect,
  project,
  renderItem,
}: {
  onSelect?: (projectId: string) => void;
  project: SidebarProject;
  renderItem?: (item: SidebarItem, options: { inset: boolean }) => ReactNode;
}) {
  const reduceMotion = useReducedMotion();
  const label = typeof project.label === "string" ? project.label : project.labelForAttributes ?? project.id;
  const expanded = project.collapsed !== true && project.threads != null;
  const transition = reduceMotion ? { duration: 0 } : { type: "spring" as const, duration: 0.28, bounce: 0.02 };

  return (
    <div
      className="opaline-sidebar-project"
      data-active={project.active === true ? "true" : "false"}
      data-muted={project.muted === true ? "true" : "false"}
      {...appActionAttributes.sidebarProjectRow({
        collapsed: project.collapsed === true,
        label,
        projectId: project.id,
      })}
    >
      <button
        className="opaline-sidebar-project-select"
        onClick={() => onSelect?.(project.id)}
        {...appActionAttributes.sidebarProjectSelect}
      >
        {project.icon != null ? (
          <span className="opaline-sidebar-project-icon" aria-hidden="true">
            {project.icon}
          </span>
        ) : null}
        <span className="opaline-sidebar-project-title">{project.label}</span>
      </button>
      <AnimatePresence initial={false}>
        {expanded ? (
          <motion.div
            key={`${project.id}:items`}
            className="opaline-sidebar-project-list-shell"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={transition}
          >
            <div
              className="opaline-sidebar-project-list"
              {...appActionAttributes.sidebarProjectList({ projectId: project.id, showAll: false })}
            >
              {project.threads?.map((item) => {
                const renderedItem = renderItem?.(item, { inset: true });
                return renderedItem != null ? (
                  <Fragment key={item.id}>{renderedItem}</Fragment>
                ) : (
                  <SidebarThreadRow key={item.id} item={item} inset />
                );
              })}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export function SidebarThreadRow({ inset = false, item }: { inset?: boolean; item: SidebarItem }) {
  const trailing = item.time ?? item.meta;
  const trailingKind = typeof trailing === "string" && trailing.startsWith("⌘") ? "shortcut" : "time";
  const title = typeof item.title === "string" ? item.title : item.label ?? item.id;

  return (
    <button
      className="opaline-sidebar-item"
      data-active={item.active === true ? "true" : "false"}
      data-inset={inset === true ? "true" : "false"}
      {...appActionAttributes.sidebarThreadRow({
        active: item.active === true,
        hostId: item.hostId,
        id: item.id,
        kind: item.kind ?? "local",
        pinned: item.pinned === true,
        title,
      })}
    >
      <span className="opaline-sidebar-item-title">{item.title}</span>
      {trailing != null ? (
        <span className="opaline-sidebar-item-meta" data-kind={trailingKind}>
          {trailing}
        </span>
      ) : null}
    </button>
  );
}

function joinClassNames(...classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(" ");
}
