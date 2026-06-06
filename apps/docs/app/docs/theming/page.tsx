import { CodeBlock } from "@/components/CodeBlock";

export const metadata = {
  title: "Theming",
  description: "Token and theme guidance for Open Shell UI.",
};

export default function ThemingPage() {
  return (
    <article className="docs-page-shell">
      <p className="docs-kicker">Visual system</p>
      <h1>Theming</h1>
      <p className="docs-lede">
        The package ships tokenized CSS so every composite shares the same density, radius, shadow, and translucent
        panel language. Override tokens once, then keep component internals stable.
      </p>

      <section className="docs-section">
        <h2>Token import</h2>
        <CodeBlock code={`import "@open-shell/ui/styles.css";`} />
      </section>

      <section className="docs-section">
        <h2>Override tokens</h2>
        <CodeBlock
          code={`:root {
  --color-token-editor-background: #101214;
  --color-token-text-primary: #f7f7f4;
  --color-token-text-secondary: color-mix(in srgb, white 62%, transparent);
  --radius-2xl: 24px;
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Electron transparency</h2>
        <p>
          The translucent sidebar depends on both CSS and host-window capabilities. Web builds can emulate the look
          with a layered background; Electron builds can let the operating system composition show through.
        </p>
        <CodeBlock
          code={`html[data-codex-window-type="electron"]:not([data-codex-os="win32"]) body {
  background: transparent;
}

.app-shell-left-panel {
  background: color-mix(in srgb, var(--color-token-editor-background) 55%, transparent);
}`}
        />
      </section>
    </article>
  );
}
