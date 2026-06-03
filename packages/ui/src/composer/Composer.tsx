import { Button, Pill } from "../primitives/Button";
import "./composer.css";

export function Composer({ placeholder }: { placeholder: string }) {
  return (
    <form className="codex-composer">
      <div className="codex-composer-topline">
        <Pill>desktop-agent-app</Pill>
        <Pill>same UI copy</Pill>
      </div>
      <textarea aria-label="Prompt" placeholder={placeholder} rows={2} />
      <div className="codex-composer-footer">
        <div className="codex-composer-tools">
          <Button type="button" variant="secondary">
            +
          </Button>
          <Button type="button">Tools</Button>
          <Button type="button">Mode</Button>
        </div>
        <Button type="submit" variant="primary">
          ↑
        </Button>
      </div>
    </form>
  );
}
