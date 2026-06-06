export type ComponentDoc = {
  category: "Shell" | "Input" | "Navigation" | "Overlay" | "Data" | "Primitive";
  description: string;
  importName: string;
  props: Array<{
    defaultValue?: string;
    description: string;
    name: string;
    type: string;
  }>;
  related?: string[];
  slug: string;
  slots: Array<{
    description: string;
    name: string;
  }>;
  sourcePath: string;
  title: string;
  usage: string;
};

export const componentDocs: ComponentDoc[] = [
  {
    category: "Shell",
    description:
      "A desktop-grade application frame with translucent sidebar, top chrome, main workspace, optional right rail, bottom panel slot, and composer anchoring.",
    importName: "AppShell",
    props: [
      { name: "sidebar", type: "ReactNode", description: "Left rail content. Usually a Sidebar instance." },
      { name: "main", type: "ReactNode", description: "Primary conversation, editor, or task surface." },
      { name: "composer", type: "ReactNode", description: "Bottom input surface anchored inside the main viewport." },
      { name: "rightPanel", type: "ReactNode", description: "Optional inspector, file tree, review, or side-chat slot." },
      { name: "bottomPanel", type: "ReactNode", description: "Optional terminal/files slot that animates from the bottom edge." },
      {
        name: "headerTabs",
        type: "Array<{ active?: boolean; dirty?: boolean; id: string; title: string }>",
        description: "Topbar thread/editor tabs.",
      },
    ],
    related: ["sidebar", "composer", "bottom-panel", "file-browser-panel"],
    slug: "app-shell",
    slots: [
      { name: "sidebar", description: "Owns navigation and project/thread discovery." },
      { name: "main", description: "Scrolling core content area." },
      { name: "composer", description: "Input surface that stays visually attached to the active task." },
      { name: "rightPanel", description: "Inspector or file panel that can collapse independently." },
      { name: "bottomPanel", description: "Resizable lower panel for terminal, files, and auxiliary tools." },
    ],
    sourcePath: "packages/ui/src/app-shell/AppShell.tsx",
    title: "AppShell",
    usage: `import { AppShell, Sidebar, Composer, ThreadSurface } from "@open-shell/ui";

<AppShell
  sidebar={<Sidebar items={threads} projects={projects} />}
  main={<ThreadSurface title="Launch review" messages={messages} />}
  composer={<Composer placeholder="Ask the agent to inspect the product..." />}
  rightPanel={<Inspector />}
  bottomPanel={<Terminal />}
/>`,
  },
  {
    category: "Navigation",
    description:
      "A dense translucent project/thread sidebar with primary actions, project grouping, active thread affordances, shortcuts, and footer controls.",
    importName: "Sidebar",
    props: [
      { name: "projects", type: "SidebarProject[]", description: "Project groups and nested active/recent thread rows.", defaultValue: "[]" },
      { name: "items", type: "SidebarItem[]", description: "Standalone chat rows outside a project group." },
    ],
    related: ["app-shell", "button"],
    slug: "sidebar",
    slots: [
      { name: "primary actions", description: "New chat, Search, Plugins, Automations." },
      { name: "projects", description: "Folder rows and nested threads." },
      { name: "footer", description: "Settings and device affordances." },
    ],
    sourcePath: "packages/ui/src/sidebar/Sidebar.tsx",
    title: "Sidebar",
    usage: `import { Sidebar } from "@open-shell/ui";

<Sidebar
  projects={[
    {
      id: "desktop-agent-app",
      label: "desktop-agent-app",
      threads: [{ id: "inspect", title: "Inspect Electron UI", active: true, meta: "⌘1" }],
    },
  ]}
  items={[{ id: "notes", title: "Component knowledge base", meta: "notes" }]}
/>`,
  },
  {
    category: "Input",
    description:
      "A high-context agent composer with attachment menu, permissions surface, model/reasoning picker, dictation button, and submit affordance.",
    importName: "Composer",
    props: [{ name: "placeholder", type: "string", description: "Textarea placeholder copy." }],
    related: ["dropdown-menu", "button"],
    slug: "composer",
    slots: [
      { name: "textarea", description: "Prompt entry area." },
      { name: "left toolbar", description: "Attachment and permission controls." },
      { name: "model controls", description: "Model/reasoning menu, microphone, submit." },
    ],
    sourcePath: "packages/ui/src/composer/Composer.tsx",
    title: "Composer",
    usage: `import { Composer } from "@open-shell/ui";

<Composer placeholder="Ask the agent to build, inspect, or recreate a component..." />`,
  },
  {
    category: "Shell",
    description:
      "Resizable bottom panel primitive for terminal output, file picker, side chat, or any auxiliary task surface.",
    importName: "BottomPanel",
    props: [
      { name: "tabs", type: "BottomPanelTab[]", description: "Radix Tabs-backed panel tabs with content." },
      { name: "height", type: "number", description: "Initial panel height in pixels.", defaultValue: "280" },
      { name: "mainContentHeight", type: "number", description: "Viewport height used for clamping." },
      { name: "onHeightChange", type: "(height: number) => void", description: "Notifies parent when resize commits." },
    ],
    related: ["app-shell", "file-tree"],
    slug: "bottom-panel",
    slots: [
      { name: "tabbar", description: "Active tab and launcher controls." },
      { name: "resize handle", description: "Top-edge separator for drag resizing." },
      { name: "outlet", description: "Selected tab content." },
    ],
    sourcePath: "packages/ui/src/bottom-panel/BottomPanel.tsx",
    title: "BottomPanel",
    usage: `import { BottomPanel, TerminalSurface } from "@open-shell/ui";

<BottomPanel
  tabs={[
    {
      id: "terminal",
      title: "open-shell",
      active: true,
      content: <TerminalSurface>npm run docs:dev</TerminalSurface>,
    },
  ]}
/>`,
  },
  {
    category: "Data",
    description:
      "Code editor and file explorer composition for review, inspect, and file-context workflows.",
    importName: "FileBrowserPanel",
    props: [
      { name: "fileTree", type: "FileTreeItem[]", description: "Tree model rendered in the right file navigator." },
      { name: "fileName", type: "string", description: "Active file tab title.", defaultValue: "package.json" },
      { name: "breadcrumbs", type: "string[]", description: "Breadcrumb labels for the open file path." },
      { name: "code", type: "string", description: "Displayed code content." },
      { name: "language", type: "string", description: "Language token for styling.", defaultValue: "json" },
    ],
    related: ["file-tree", "app-shell"],
    slug: "file-browser-panel",
    slots: [
      { name: "topbar", description: "Open file tab and window panel controls." },
      { name: "toolbar", description: "Breadcrumbs and open-app actions." },
      { name: "code", description: "Scrollable code viewport." },
      { name: "tree", description: "Right-side file navigator." },
    ],
    sourcePath: "packages/ui/src/file-browser/FileBrowserPanel.tsx",
    title: "FileBrowserPanel",
    usage: `import { FileBrowserPanel } from "@open-shell/ui";

<FileBrowserPanel
  fileName="package.json"
  fileTree={workspaceFiles}
  breadcrumbs={["open-shell", "package.json"]}
/>`,
  },
  {
    category: "Data",
    description:
      "A virtualized-file-tree style primitive with sticky directory rows, search field, git/action lanes, and extension-aware icons.",
    importName: "FileTree",
    props: [
      { name: "items", type: "FileTreeItem[]", description: "Nested directory/file model." },
      { name: "search", type: "boolean", description: "Show the filter input.", defaultValue: "true" },
      { name: "coloredIcons", type: "boolean", description: "Enable extension color tokens.", defaultValue: "true" },
    ],
    related: ["file-browser-panel"],
    slug: "file-tree",
    slots: [
      { name: "search", description: "Filter input region." },
      { name: "row icon", description: "Directory, file, lock, and language token icons." },
      { name: "git lane", description: "Per-row modification status." },
      { name: "action lane", description: "Ellipsis/action affordance." },
    ],
    sourcePath: "packages/ui/src/file-tree/FileTree.tsx",
    title: "FileTree",
    usage: `import { FileTree } from "@open-shell/ui";

<FileTree
  items={[
    { name: "packages", path: "packages", type: "directory", children: [
      { name: "ui", path: "packages/ui", type: "directory" },
    ] },
  ]}
/>`,
  },
  {
    category: "Overlay",
    description:
      "Radix Dropdown Menu wrapper with agent-app density, nested menu styling, shortcuts, and checked-item support.",
    importName: "DropdownMenu",
    props: [
      { name: "DropdownMenuContent", type: "Radix Content props", description: "Portal-backed menu surface with default offset and styling." },
      { name: "DropdownMenuItem", type: "Radix Item props", description: "Focusable command row." },
      { name: "DropdownMenuSub", type: "Radix Sub props", description: "Nested menu composition." },
    ],
    related: ["composer", "context-menu"],
    slug: "dropdown-menu",
    slots: [
      { name: "trigger", description: "Button or custom element using asChild." },
      { name: "content", description: "Glass menu shell." },
      { name: "items", description: "Command rows, separators, checkbox/radio items, and submenus." },
    ],
    sourcePath: "packages/ui/src/primitives/DropdownMenu.tsx",
    title: "DropdownMenu",
    usage: `import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@open-shell/ui";

<DropdownMenu>
  <DropdownMenuTrigger>Open</DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Pin thread</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`,
  },
  {
    category: "Overlay",
    description:
      "Radix Context Menu wrapper for tab, file, and thread surfaces with nested commands and compact interaction rhythm.",
    importName: "ContextMenu",
    props: [
      { name: "ContextMenuContent", type: "Radix Content props", description: "Portal-backed contextual surface." },
      { name: "ContextMenuItem", type: "Radix Item props", description: "Focusable command row." },
      { name: "ContextMenuSub", type: "Radix Sub props", description: "Nested contextual command group." },
    ],
    related: ["dropdown-menu", "app-shell"],
    slug: "context-menu",
    slots: [
      { name: "trigger", description: "Right-click target." },
      { name: "content", description: "Contextual command panel." },
      { name: "submenus", description: "Copy/fork-style nested actions." },
    ],
    sourcePath: "packages/ui/src/primitives/ContextMenu.tsx",
    title: "ContextMenu",
    usage: `import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@open-shell/ui";

<ContextMenu>
  <ContextMenuTrigger>Right click me</ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuItem>Copy file path</ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>`,
  },
  {
    category: "Overlay",
    description:
      "Measured Radix Dialog wrapper with size tokens, close affordance, section/body/footer helpers, and outside-click controls.",
    importName: "Dialog",
    props: [
      { name: "size", type: '"narrow" | "compact" | "default" | "wide" | "xwide" | "xxwide" | "editor"', description: "Dialog size token.", defaultValue: "default" },
      { name: "showDialogClose", type: "boolean", description: "Render the default close button.", defaultValue: "true" },
      { name: "shouldIgnoreClickOutside", type: "boolean", description: "Prevent outside pointer close.", defaultValue: "false" },
      { name: "unstyledContent", type: "boolean", description: "Disable the default surface class.", defaultValue: "false" },
    ],
    related: ["button"],
    slug: "dialog",
    slots: [
      { name: "overlay", description: "Backdrop layer." },
      { name: "content", description: "Measured dialog surface." },
      { name: "header/body/footer", description: "Structured copy and action regions." },
    ],
    sourcePath: "packages/ui/src/primitives/Dialog.tsx",
    title: "Dialog",
    usage: `import { Dialog, DialogBody, DialogContent, DialogHeader, DialogTrigger } from "@open-shell/ui";

<Dialog>
  <DialogTrigger>Open dialog</DialogTrigger>
  <DialogContent>
    <DialogHeader title="Create run" subtitle="Configure an agent task." />
    <DialogBody>Dialog content</DialogBody>
  </DialogContent>
</Dialog>`,
  },
  {
    category: "Primitive",
    description:
      "Button, icon button, pill, and status dot primitives for compact command surfaces and chrome actions.",
    importName: "Button",
    props: [
      { name: "variant", type: '"ghost" | "soft" | "secondary" | "primary" | "danger"', description: "Visual treatment.", defaultValue: "ghost" },
      { name: "size", type: '"default" | "small" | "icon"', description: "Sizing token.", defaultValue: "default" },
      { name: "asChild", type: "boolean", description: "Use Radix Slot to render another element.", defaultValue: "false" },
      { name: "icon", type: "ReactNode", description: "Optional leading glyph." },
    ],
    related: ["dropdown-menu", "dialog"],
    slug: "button",
    slots: [
      { name: "icon", description: "Leading glyph slot." },
      { name: "children", description: "Button label or slotted element." },
    ],
    sourcePath: "packages/ui/src/primitives/Button.tsx",
    title: "Button",
    usage: `import { Button, IconButton, Pill, StatusDot } from "@open-shell/ui";

<Button variant="primary">Run agent</Button>
<IconButton aria-label="Open inspector">⌘</IconButton>
<Pill>local</Pill>
<StatusDot tone="green" />`,
  },
  {
    category: "Shell",
    description:
      "Conversation surface for assistant/user messages, activity labels, run cards, and review affordances.",
    importName: "ThreadSurface",
    props: [
      { name: "title", type: "string", description: "Thread title." },
      { name: "messages", type: "ThreadMessage[]", description: "Assistant/user message stream." },
    ],
    related: ["composer", "app-shell"],
    slug: "thread-surface",
    slots: [
      { name: "header", description: "Thread title and mode pills." },
      { name: "brief", description: "Intro card or system context." },
      { name: "messages", description: "Role-based message rendering." },
      { name: "run card", description: "Edited-files/review summary card." },
    ],
    sourcePath: "packages/ui/src/thread/ThreadSurface.tsx",
    title: "ThreadSurface",
    usage: `import { ThreadSurface } from "@open-shell/ui";

<ThreadSurface
  title="Inspect Electron UI"
  messages={[
    { role: "assistant", body: "Read the component map and opened the shell." },
    { role: "user", body: "Make the sidebar exact." },
  ]}
/>`,
  },
  {
    category: "Data",
    description:
      "Terminal output surface with cwd header and monospace buffer, designed for bottom-panel or split-pane usage.",
    importName: "TerminalSurface",
    props: [
      { name: "cwd", type: "string", description: "Displayed working directory." },
      { name: "children", type: "ReactNode", description: "Terminal output buffer." },
    ],
    related: ["bottom-panel"],
    slug: "terminal-surface",
    slots: [
      { name: "header", description: "CWD/status row." },
      { name: "buffer", description: "Preformatted output region." },
    ],
    sourcePath: "packages/ui/src/bottom-panel/BottomPanel.tsx",
    title: "TerminalSurface",
    usage: `import { TerminalSurface } from "@open-shell/ui";

<TerminalSurface cwd="~/open-shell">
  npm run docs:dev
</TerminalSurface>`,
  },
];

export const componentCategories = ["Shell", "Input", "Navigation", "Data", "Overlay", "Primitive"] as const;

export function getComponentDoc(slug: string) {
  return componentDocs.find((component) => component.slug === slug);
}
