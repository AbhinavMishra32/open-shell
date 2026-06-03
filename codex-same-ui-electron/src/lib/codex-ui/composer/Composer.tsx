import { Button } from "../primitives/Button";
import "./composer.css";

export function Composer({ placeholder }: { placeholder: string }) {
  return (
    <form className="codex-composer">
      <textarea aria-label="Prompt" placeholder={placeholder} rows={3} />
      <div className="codex-composer-footer">
        <div className="codex-composer-tools">
          <Button type="button">Attach</Button>
          <Button type="button">Agent</Button>
        </div>
        <Button type="submit" variant="solid">
          Send
        </Button>
      </div>
    </form>
  );
}
