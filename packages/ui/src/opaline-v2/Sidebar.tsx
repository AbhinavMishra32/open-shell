import type {
  ButtonHTMLAttributes,
  CSSProperties,
  HTMLAttributes,
  PointerEvent as ReactPointerEvent,
  ReactNode,
} from "react";
import { useRef, useState } from "react";
import { Button } from "#components/button";
import { ScrollArea } from "#components/scroll-area";
import { Separator } from "#components/separator";
import { cn } from "#lib/utils";
import { appActionAttributes } from "../sidebar/appActionAttributes";

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
  sectionLabels?: { items?: string; projects?: string };
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
    <aside className="opaline-v2-app-sidebar">
      {primaryItems.length > 0 ? (
        <>
          <SidebarPrimary>
            {primaryItems.map((item) => renderNavItem?.(item) ?? <SidebarNavItemRow item={item} key={item.id} />)}
          </SidebarPrimary>
          <Separator className="opaline-v2-app-sidebar-separator" />
        </>
      ) : null}
      <SidebarScroll>
        {projects.length > 0 ? (
          <SidebarSection heading={sectionLabels.projects ?? "Projects"}>
            {projects.map((project) =>
              renderProject?.(project) ?? (
                <SidebarProjectRow key={project.id} project={project} renderItem={renderItem} onSelect={onProjectSelect} />
              ),
            )}
          </SidebarSection>
        ) : null}
        {items.length > 0 ? (
          <SidebarSection heading={sectionLabels.items ?? "Items"}>
            <nav className="opaline-v2-app-sidebar-list" aria-label={sectionLabels.items ?? "Items"}>
              {items.map((item) => renderItem?.(item, { inset: false }) ?? <SidebarThreadRow key={item.id} item={item} />)}
            </nav>
          </SidebarSection>
        ) : null}
        {children}
      </SidebarScroll>
      {footer != null ? (
        <>
          <Separator className="opaline-v2-app-sidebar-separator" />
          <SidebarFooter>{footer}</SidebarFooter>
        </>
      ) : null}
    </aside>
  );
}

export function SidebarPrimary({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <nav className={cn("opaline-v2-app-sidebar-primary", className)} aria-label="Primary" {...props}>{children}</nav>;
}

export function SidebarScroll({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <ScrollArea className={cn("opaline-v2-app-sidebar-scroll", className)} {...appActionAttributes.sidebarScroll} {...props}>
      <div className="opaline-v2-app-sidebar-scroll-content">{children}</div>
    </ScrollArea>
  );
}

export function SidebarFooter({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("opaline-v2-app-sidebar-footer", className)} {...props}>{children}</div>;
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
  defaultHeight = 220,
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
  const isCollapsed = collapsed ?? internalCollapsed;

  function setCollapsed(next: boolean) {
    if (collapsed === undefined) setInternalCollapsed(next);
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
    <section
      className={cn("opaline-v2-sidebar-bottom-slot", className)}
      data-collapsed={isCollapsed ? "true" : "false"}
      style={{ ...style, "--opaline-v2-sidebar-slot-height": `${height}px` } as CSSProperties}
      {...props}
    >
      <div className="opaline-v2-sidebar-bottom-slot-resize" onPointerDown={beginResize} onPointerMove={resize} onPointerCancel={endResize} onPointerUp={endResize} />
      <Button className="opaline-v2-sidebar-bottom-slot-header" variant="ghost" onClick={() => setCollapsed(!isCollapsed)}>
        {header}
      </Button>
      <div className="opaline-v2-sidebar-bottom-slot-content">{children}</div>
    </section>
  );
}

export function SidebarNavItemRow({ className, item, type = "button", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { item: SidebarNavItem }) {
  return (
    <Button
      className={cn("opaline-v2-app-sidebar-nav-item", className)}
      data-active={item.active === true ? "true" : undefined}
      onClick={item.onClick}
      type={type}
      variant="ghost"
      {...props}
    >
      {item.icon != null ? <span className="opaline-v2-app-sidebar-nav-icon" aria-hidden="true">{item.icon}</span> : null}
      <span>{item.label}</span>
    </Button>
  );
}

export function SidebarSection({ children, heading }: { children: ReactNode; heading: string }) {
  return (
    <section className="opaline-v2-app-sidebar-section" {...appActionAttributes.sidebarSection({ collapsed: false, heading })}>
      <div className="opaline-v2-app-sidebar-section-label">{heading}</div>
      {children}
    </section>
  );
}

export function SidebarProjectRow({ onSelect, project, renderItem }: { onSelect?: (projectId: string) => void; project: SidebarProject; renderItem?: (item: SidebarItem, options: { inset: boolean }) => ReactNode }) {
  const label = typeof project.label === "string" ? project.label : project.labelForAttributes ?? project.id;
  const expanded = project.collapsed !== true && project.threads != null;
  return (
    <div className="opaline-v2-app-sidebar-project" data-active={project.active === true ? "true" : "false"} data-muted={project.muted === true ? "true" : "false"} {...appActionAttributes.sidebarProjectRow({ collapsed: project.collapsed === true, label, projectId: project.id })}>
      <Button className="opaline-v2-app-sidebar-project-select" onClick={() => onSelect?.(project.id)} variant="ghost" {...appActionAttributes.sidebarProjectSelect}>
        {project.icon != null ? <span aria-hidden="true">{project.icon}</span> : null}
        <span>{project.label}</span>
      </Button>
      {expanded ? <div className="opaline-v2-app-sidebar-list" {...appActionAttributes.sidebarProjectList({ projectId: project.id, showAll: false })}>{project.threads?.map((item) => renderItem?.(item, { inset: true }) ?? <SidebarThreadRow key={item.id} item={item} inset />)}</div> : null}
    </div>
  );
}

export function SidebarThreadRow({ inset = false, item }: { inset?: boolean; item: SidebarItem }) {
  const trailing = item.time ?? item.meta;
  const title = typeof item.title === "string" ? item.title : item.label ?? item.id;
  return (
    <Button className="opaline-v2-app-sidebar-item" data-active={item.active === true ? "true" : "false"} data-inset={inset ? "true" : "false"} variant="ghost" {...appActionAttributes.sidebarThreadRow({ active: item.active === true, hostId: item.hostId, id: item.id, kind: item.kind ?? "local", pinned: item.pinned === true, title })}>
      <span className="opaline-v2-app-sidebar-item-title">{item.title}</span>
      {trailing != null ? <span className="opaline-v2-app-sidebar-item-meta">{trailing}</span> : null}
    </Button>
  );
}
