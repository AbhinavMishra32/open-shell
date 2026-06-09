import type { ReactNode } from "react";
import { FileTree } from "../file-tree/FileTree";
import type { FileTreeItem } from "../file-tree/FileTree";
import "./file-browser-panel.css";

export type FileBrowserPanelProps = {
  breadcrumbs?: string[];
  code?: string;
  editor?: ReactNode;
  fileName?: string;
  fileTree?: FileTreeItem[];
  headerActions?: ReactNode;
  language?: string;
  pathActions?: ReactNode;
  sidePanel?: ReactNode;
  sidePanelPosition?: "left" | "right";
  tabIcon?: ReactNode;
  tabs?: ReactNode;
  toolbar?: ReactNode;
};

export function FileBrowserPanel({
  breadcrumbs = [],
  code,
  editor,
  fileName,
  fileTree,
  headerActions,
  language,
  pathActions,
  sidePanel,
  sidePanelPosition = "right",
  tabIcon,
  tabs,
  toolbar,
}: FileBrowserPanelProps) {
  return (
    <section className="opaline-file-browser-panel" data-opaline-file-browser-panel="true">
      <header className="opaline-file-browser-topbar">
        {tabs ?? (fileName != null ? <FileBrowserTab icon={tabIcon} title={fileName} /> : null)}
        {headerActions}
      </header>

      {toolbar ?? (
        <div className="opaline-file-browser-toolbar">
          {breadcrumbs.length > 0 ? <FileBrowserBreadcrumbs breadcrumbs={breadcrumbs} /> : null}
          {pathActions}
        </div>
      )}

      <div className="opaline-file-browser-body" data-side-panel-position={sidePanelPosition}>
        {editor ?? (
          <pre className="opaline-file-browser-code" data-language={language}>
            <code>{code}</code>
          </pre>
        )}
        {sidePanel ?? (
          fileTree != null ? (
            <aside className="opaline-file-browser-tree-panel" data-app-shell-focus-area="file-tree">
              <FileTree items={fileTree} />
            </aside>
          ) : null
        )}
      </div>
    </section>
  );
}

export function FileBrowserTab({ icon, title }: { icon?: ReactNode; title: ReactNode }) {
  return (
    <div className="opaline-file-browser-tab" data-active="true">
      {icon != null ? <span className="opaline-file-browser-tab-icon">{icon}</span> : null}
      <span className="opaline-file-browser-tab-title">{title}</span>
    </div>
  );
}

export function FileBrowserBreadcrumbs({ breadcrumbs }: { breadcrumbs: string[] }) {
  return (
    <nav className="opaline-file-browser-breadcrumbs" aria-label="File path">
      {breadcrumbs.map((breadcrumb, index) => (
        <span key={`${breadcrumb}-${index}`}>
          {index > 0 ? <span aria-hidden="true">/</span> : null}
          <span>{breadcrumb}</span>
        </span>
      ))}
    </nav>
  );
}
