import Link from "next/link";
import { componentCategories, componentDocs } from "@/lib/component-docs";

export default function ComponentsPage() {
  return (
    <article className="docs-page-shell">
      <p className="docs-kicker">Registry</p>
      <h1>Components</h1>
      <p className="docs-lede">
        Each component page includes usage, slot anatomy, prop API, source path, and a live preview using the real
        package export.
      </p>

      {componentCategories.map((category) => {
        const components = componentDocs.filter((component) => component.category === category);
        if (components.length === 0) return null;

        return (
          <section className="docs-section" key={category}>
            <h2>{category}</h2>
            <div className="docs-registry-grid">
              {components.map((component) => (
                <Link href={`/docs/components/${component.slug}`} key={component.slug} className="docs-registry-card">
                  <span>{component.category}</span>
                  <strong>{component.title}</strong>
                  <p>{component.description}</p>
                  <code>{component.sourcePath}</code>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </article>
  );
}
