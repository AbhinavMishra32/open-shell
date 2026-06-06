import type { ReactNode } from "react";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { docsTree } from "@/lib/docs-tree";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={docsTree}
      nav={{
        title: (
          <span className="docs-brand-lockup">
            <span className="docs-brand-mark" />
            Open Shell UI
          </span>
        ),
      }}
      sidebar={{
        defaultOpenLevel: 1,
        prefetch: false,
      }}
      githubUrl="https://github.com/AbhinavMishra32/open-shell"
    >
      {children}
    </DocsLayout>
  );
}
