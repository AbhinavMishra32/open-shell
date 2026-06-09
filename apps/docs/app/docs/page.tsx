import Link from "next/link";
import { componentCategories, componentDocs } from "@/lib/component-docs";
import { CodeBlock } from "@/components/CodeBlock";

export default function DocsIndexPage() {
  return (
    <article className="docs-page-shell">
      <p className="docs-kicker">Documentation</p>
      <h1>Opaline UI</h1>
      <p className="docs-lede">
        A component system for building agent-native workspaces with the density, responsiveness, and panel grammar
        expected from modern desktop software.
      </p>

      <div className="docs-callout-grid">
        <div>
          <strong>Package</strong>
          <span>@opaline/ui</span>
        </div>
        <div>
          <strong>Docs app</strong>
          <span>apps/docs</span>
        </div>
        <div>
          <strong>Example app</strong>
          <span>examples/electron-shell</span>
        </div>
      </div>

      <section className="docs-section">
        <h2>Quick start</h2>
        <CodeBlock
          title="Install"
          code={`npm install @opaline/ui

import "@opaline/ui/styles.css";
import { AppShell, Composer, Sidebar, ThreadSurface } from "@opaline/ui";`}
        />
      </section>

      <section className="docs-section">
        <h2>Component map</h2>
        {componentCategories.map((category) => {
          const components = componentDocs.filter((component) => component.category === category);
          if (components.length === 0) return null;

          return (
            <div className="docs-category-group" key={category}>
              <h3>{category}</h3>
              <div className="docs-component-list">
                {components.map((component) => (
                  <Link href={`/docs/components/${component.slug}`} key={component.slug}>
                    <strong>{component.title}</strong>
                    <span>{component.description}</span>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </section>
    </article>
  );
}
