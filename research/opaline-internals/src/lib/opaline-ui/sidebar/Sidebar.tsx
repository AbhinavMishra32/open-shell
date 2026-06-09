import { Button, IconButton, StatusDot } from "../primitives/Button";
import type { ReactNode } from "react";
import { OpalineMark } from "../icons/OpalineMark";
import { appActionAttributes } from "./appActionAttributes";
import "./sidebar.css";

export type SidebarItem = {
  active?: boolean;
  hostId?: string | null;
  id: string;
  kind?: "local" | "remote";
  meta?: string;
  pinned?: boolean;
  title: string;
};

export type SidebarProject = {
  active?: boolean;
  collapsed?: boolean;
  id: string;
  label: string;
  threads?: SidebarItem[];
};

export function Sidebar({ items, projects = [] }: { items: SidebarItem[]; projects?: SidebarProject[] }) {
  return (
    <aside className="opaline-sidebar app-shell-left-panel">
      <div className="opaline-sidebar-drag" />
      <div className="opaline-sidebar-header">
        <div className="opaline-sidebar-brand">
          <OpalineMark className="opaline-sidebar-logo" />
          <span>Opaline</span>
        </div>
        <IconButton aria-label="New chat" variant="secondary">
          +
        </IconButton>
      </div>

      <div className="opaline-sidebar-search">Search threads and projects</div>

      <div className="opaline-sidebar-primary" role="navigation" aria-label="Primary">
        <button className="opaline-sidebar-nav-item">
          <span className="opaline-sidebar-nav-icon" aria-hidden="true">
            <NewChatIcon />
          </span>
          New chat
        </button>
        <button className="opaline-sidebar-nav-item">
          <span className="opaline-sidebar-nav-icon" aria-hidden="true">
            <SearchIcon />
          </span>
          Search
        </button>
        <button className="opaline-sidebar-nav-item">
          <span className="opaline-sidebar-nav-icon" aria-hidden="true">
            <PluginsIcon />
          </span>
          Plugins
        </button>
        <button className="opaline-sidebar-nav-item">
          <span className="opaline-sidebar-nav-icon" aria-hidden="true">
            <AutomationsIcon />
          </span>
          Automations
        </button>
      </div>

      <div className="opaline-sidebar-scroll" {...appActionAttributes.sidebarScroll}>
        {projects.length > 0 ? (
          <SidebarSection heading="Projects">
            {projects.map((project) => (
              <SidebarProjectRow key={project.id} project={project} />
            ))}
          </SidebarSection>
        ) : null}

        <SidebarSection heading="Chats">
          <nav className="opaline-sidebar-list" aria-label="Chats">
            {items.map((item) => (
              <SidebarThreadRow key={item.id} item={item} />
            ))}
          </nav>
        </SidebarSection>
      </div>

      <div className="opaline-sidebar-footer">
        <div className="opaline-sidebar-runtime">
          <StatusDot tone="green" />
          <span>Library preview online</span>
        </div>
        <Button variant="ghost" size="small">
          Settings
        </Button>
      </div>
    </aside>
  );
}

function SidebarSection({ children, heading }: { children: ReactNode; heading: string }) {
  return (
    <section className="opaline-sidebar-section" {...appActionAttributes.sidebarSection({ collapsed: false, heading })}>
      <button className="opaline-sidebar-section-header" {...appActionAttributes.sidebarSectionToggle}>
        <span className="opaline-sidebar-section-label">{heading}</span>
      </button>
      {children}
    </section>
  );
}

function SidebarProjectRow({ project }: { project: SidebarProject }) {
  return (
    <div
      className="opaline-sidebar-project"
      data-active={project.active === true ? "true" : "false"}
      {...appActionAttributes.sidebarProjectRow({
        collapsed: project.collapsed === true,
        label: project.label,
        projectId: project.id,
      })}
    >
      <button className="opaline-sidebar-project-select" {...appActionAttributes.sidebarProjectSelect}>
        <span className="opaline-sidebar-project-icon" aria-hidden="true">
          <FolderIcon />
        </span>
        <span className="opaline-sidebar-project-title">{project.label}</span>
      </button>
      {project.collapsed === true || project.threads == null ? null : (
        <div
          className="opaline-sidebar-project-list"
          {...appActionAttributes.sidebarProjectList({ projectId: project.id, showAll: false })}
        >
          {project.threads.map((item) => (
            <SidebarThreadRow key={item.id} item={item} inset />
          ))}
        </div>
      )}
    </div>
  );
}

function SidebarThreadRow({ inset = false, item }: { inset?: boolean; item: SidebarItem }) {
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
        title: item.title,
      })}
    >
      <span className="opaline-sidebar-item-title">{item.title}</span>
      {item.meta != null ? <span className="opaline-sidebar-item-meta">{item.meta}</span> : null}
    </button>
  );
}

function NewChatIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M4.5 15.5h8.75a2.25 2.25 0 0 0 2.25-2.25V9.5" />
      <path d="M4.5 15.5V6.75A2.25 2.25 0 0 1 6.75 4.5h3.75" />
      <path d="M12.25 3.75h4" />
      <path d="M14.25 1.75v4" />
      <path d="m7 13 5.75-5.75" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <circle cx="8.75" cy="8.75" r="5.25" />
      <path d="m12.5 12.5 3.75 3.75" />
    </svg>
  );
}

function PluginsIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <circle cx="6" cy="6" r="2.25" />
      <circle cx="14" cy="6" r="2.25" />
      <circle cx="6" cy="14" r="2.25" />
      <circle cx="14" cy="14" r="2.25" />
    </svg>
  );
}

function AutomationsIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <circle cx="10" cy="10" r="7" />
      <path d="M10 5.75V10l3 2" />
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M2.75 6.75A1.75 1.75 0 0 1 4.5 5h3l1.5 1.75h6.5a1.75 1.75 0 0 1 1.75 1.75v5A1.75 1.75 0 0 1 15.5 15.25h-11a1.75 1.75 0 0 1-1.75-1.75z" />
    </svg>
  );
}
