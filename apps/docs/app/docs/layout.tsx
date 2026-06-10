import type { ReactNode } from "react";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { Blocks, Code2, History, PackageOpen } from "lucide-react";
import { OpalineMark } from "@opaline/ui";
import { source } from "@/lib/source";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={source.getPageTree()}
      nav={{
        title: (
          <span className="docs-brand-lockup">
            <OpalineMark className="docs-brand-mark" />
            Opaline UI
          </span>
        ),
      }}
      links={[
        { icon: <Blocks />, text: "Components", url: "/docs/components" },
        { icon: <History />, text: "Shell systems", url: "/docs/systems/shell-history" },
        { icon: <PackageOpen />, text: "npm", url: "https://www.npmjs.com/package/@opaline/ui", external: true },
        { icon: <Code2 />, text: "GitHub", url: "https://github.com/AbhinavMishra32/opaline", external: true },
      ]}
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
