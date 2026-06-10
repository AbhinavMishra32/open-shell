import type { ReactNode } from "react";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { source } from "@/lib/source";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={source.getPageTree()}
      nav={{
        title: (
          <span className="docs-brand-lockup">
            <span className="docs-brand-mark" />
            Opaline UI
          </span>
        ),
      }}
      sidebar={{
        defaultOpenLevel: 1,
        prefetch: false,
      }}
      githubUrl="https://github.com/AbhinavMishra32/opaline"
    >
      {children}
    </DocsLayout>
  );
}
