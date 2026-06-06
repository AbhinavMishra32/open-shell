import { notFound } from "next/navigation";
import { CodeBlock } from "@/components/CodeBlock";
import { ComponentPreview } from "@/components/ComponentPreview";
import { componentDocs, getComponentDoc } from "@/lib/component-docs";

export function generateStaticParams() {
  return componentDocs.map((component) => ({ slug: component.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const component = getComponentDoc(slug);

  return {
    title: component?.title ?? "Component",
    description: component?.description,
  };
}

export default async function ComponentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const component = getComponentDoc(slug);

  if (component == null) {
    notFound();
  }

  return (
    <article className="docs-page-shell">
      <p className="docs-kicker">{component.category}</p>
      <h1>{component.title}</h1>
      <p className="docs-lede">{component.description}</p>

      <section className="docs-section">
        <div className="docs-section-heading-row">
          <h2>Live preview</h2>
          <code>{component.sourcePath}</code>
        </div>
        <ComponentPreview slug={component.slug} />
      </section>

      <section className="docs-section">
        <h2>Usage</h2>
        <CodeBlock code={component.usage} />
      </section>

      <section className="docs-section">
        <h2>Slots</h2>
        <div className="docs-table">
          <div className="docs-table-row docs-table-head">
            <span>Name</span>
            <span>Description</span>
          </div>
          {component.slots.map((slot) => (
            <div className="docs-table-row" key={slot.name}>
              <code>{slot.name}</code>
              <span>{slot.description}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="docs-section">
        <h2>API</h2>
        <div className="docs-table docs-api-table">
          <div className="docs-table-row docs-table-head">
            <span>Prop</span>
            <span>Type</span>
            <span>Default</span>
            <span>Description</span>
          </div>
          {component.props.map((prop) => (
            <div className="docs-table-row" key={prop.name}>
              <code>{prop.name}</code>
              <code>{prop.type}</code>
              <span>{prop.defaultValue ?? "-"}</span>
              <span>{prop.description}</span>
            </div>
          ))}
        </div>
      </section>

      {component.related != null ? (
        <section className="docs-section">
          <h2>Related</h2>
          <div className="docs-related-list">
            {component.related.map((related) => (
              <a href={`/docs/components/${related}`} key={related}>
                {related}
              </a>
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
