import { Button } from "../primitives/Button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../primitives/DropdownMenu";
import "./composer.css";

export function Composer({ placeholder }: { placeholder: string }) {
  return (
    <form className="codex-composer">
      <textarea aria-label="Prompt" placeholder={placeholder} rows={2} />
      <div className="codex-composer-footer">
        <div className="codex-composer-tools">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="codex-composer-round-button" type="button" aria-label="Open attachments menu">
                +
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="codex-composer-plus-menu" side="top">
              <DropdownMenuItem>
                <span className="codex-menu-icon">⌕</span>
                <span>Add photos & files</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span className="codex-menu-icon">◉</span>
                <span>Attach Electron</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked={false}>Plan mode</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={false}>Pursue goal</DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Plugins</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem>Browser</DropdownMenuItem>
                  <DropdownMenuItem>Vercel</DropdownMenuItem>
                  <DropdownMenuItem>Notion</DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuContent>
          </DropdownMenu>
          <button className="codex-composer-access-button" type="button">
            <span className="codex-composer-shield">!</span>
            Full access
            <span className="codex-composer-chevron">⌄</span>
          </button>
        </div>
        <div className="codex-composer-model-controls">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="codex-composer-model-button" type="button">
                5.5 <span>Medium</span> <span className="codex-composer-chevron">⌄</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="codex-composer-model-menu" side="top">
              <div className="codex-composer-menu-label">Reasoning</div>
              <DropdownMenuItem>Low</DropdownMenuItem>
              <DropdownMenuItem>
                Medium <span className="codex-menu-check">✓</span>
              </DropdownMenuItem>
              <DropdownMenuItem>High</DropdownMenuItem>
              <DropdownMenuItem>Extra High</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>GPT-5.5</DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="codex-composer-model-submenu">
                  <div className="codex-composer-menu-label">Model</div>
                  <DropdownMenuItem>
                    GPT-5.5 <span className="codex-menu-check">✓</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>GPT-5.4</DropdownMenuItem>
                  <DropdownMenuItem>GPT-5.4-Mini</DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Speed</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem>Balanced</DropdownMenuItem>
                  <DropdownMenuItem>Fast</DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuContent>
          </DropdownMenu>
          <button className="codex-composer-mic" type="button" aria-label="Dictate">
            ♫
          </button>
          <Button type="submit" variant="primary">
            ↑
          </Button>
        </div>
      </div>
    </form>
  );
}
