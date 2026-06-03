export type AppShellFocusArea = "main" | "right-panel" | "bottom-panel";

export type AppShellLayoutMode = "default" | "full-bleed" | "thread-edge-scroll";

export type AppShellSlot =
  | "left-panel"
  | "header"
  | "main-content"
  | "right-panel"
  | "bottom-panel";

export interface AppShellTab {
  tabId: string;
  dndId: string;
  title: string;
  tooltip?: string;
  isClosable?: boolean;
  isHighlighted?: boolean;
  isLabel?: boolean;
  isPreview?: boolean;
}

export interface AppShellComponentSystem {
  Root: "owns shell geometry and slot extraction";
  LeftPanel: "registers sidebar content";
  Content: "renders route content with suspense fallback";
  Header: "registers top chrome";
  RightPanel: "registers inspector or auxiliary content";
  BottomPanel: "registers lower docked content";
  Tabs: "owns tab strip, activation, close, preview, and drag/drop";
}
