export function CodeBlock({ code, title }: { code: string; title?: string }) {
  return (
    <figure className="docs-code-block">
      {title != null ? <figcaption>{title}</figcaption> : null}
      <pre>
        <code>{code}</code>
      </pre>
    </figure>
  );
}
