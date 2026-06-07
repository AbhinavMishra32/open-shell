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
      { name: "composer", type: "ReactNode", description: "Optional bottom input surface anchored inside the main viewport." },
      { name: "rightPanel", type: "ReactNode", description: "Optional inspector, file tree, review, or side-chat slot." },
      { name: "bottomPanel", type: "ReactNode", description: "Optional terminal/files slot that animates from the bottom edge." },
      {
        name: "headerTabs",
        type: "AppShellTabItem[]",
        description: "Optional topbar tab model. Use renderHeaderTab/renderHeaderTabActions/renderHeaderTabMenu for full control.",
      },
      {
        name: "headerActions",
        type: "ReactNode | (state: AppShellState) => ReactNode",
        description: "Right-side chrome controls owned by the consuming app.",
      },
      {
        name: "chromeControls",
        type: "ReactNode | (state: AppShellState) => ReactNode",
        description: "Mac/native titlebar-adjacent controls owned by the consuming app.",
      },
      { name: "canNavigateBack / canNavigateForward", type: "boolean", description: "Enable sidebar-level history buttons for app/page navigation.", defaultValue: "false" },
      { name: "onNavigateBack / onNavigateForward", type: "() => void", description: "Callbacks used by the shell navigation controls." },
      { name: "sidebarChrome", type: "ReactNode | (state: AppShellState) => ReactNode", description: "Override the sidebar titlebar controls while keeping shell placement." },
      { name: "defaultSidebarWidth", type: "number", description: "Initial sidebar width in pixels.", defaultValue: "300" },
      { name: "sidebarMinWidth", type: "number", description: "Width below which drag-resize collapses the sidebar.", defaultValue: "240" },
      { name: "sidebarMaxWidth", type: "number", description: "Maximum sidebar width in pixels.", defaultValue: "520" },
    ],
    related: ["sidebar", "composer", "bottom-panel", "file-browser-panel"],
    slug: "app-shell",
    slots: [
      { name: "sidebar", description: "Left rail slot. The app owns navigation content, icons, and labels." },
      { name: "main", description: "Scrolling core content area." },
      { name: "composer", description: "Optional prompt, command, status, or control surface owned by the app." },
      { name: "rightPanel", description: "Inspector or file panel that can collapse independently." },
      { name: "bottomPanel", description: "Resizable lower panel for terminal, files, and auxiliary tools." },
      { name: "headerActions", description: "Custom app controls such as layout toggles, app pickers, and overflow menus." },
      { name: "sidebarChrome", description: "Native sidebar controls for toggle, back, forward, or app-specific navigation." },
    ],
    sourcePath: "packages/ui/src/app-shell/AppShell.tsx",
    title: "AppShell",
    usage: `import { AppShell, Sidebar, Composer, ThreadSurface } from "@open-shell/ui";

<AppShell
  headerTabs={tabs}
  headerActions={(shell) => <Toolbar onToggleInspector={shell.toggleRightPanel} />}
  sidebar={<Sidebar primaryItems={navItems} items={threads} projects={projects} footer={<AccountMenu />} />}
  main={<ThreadSurface title="Launch review" messages={messages} />}
  composer={<Composer placeholder="Ask the agent to inspect the product..." />}
  rightPanel={<Inspector />}
  bottomPanel={<Terminal />}
/>`,
  },
  {
    category: "Navigation",
    description:
      "A dense translucent desktop sidebar scaffold with caller-owned primary actions, project grouping, row rendering, and footer controls.",
    importName: "Sidebar",
    props: [
      { name: "projects", type: "SidebarProject[]", description: "Project groups and nested active/recent thread rows.", defaultValue: "[]" },
      { name: "items", type: "SidebarItem[]", description: "Standalone chat rows outside a project group." },
      { name: "primaryItems", type: "SidebarNavItem[]", description: "Caller-provided top navigation actions with custom labels and icons.", defaultValue: "[]" },
      { name: "footer", type: "ReactNode", description: "Caller-provided footer controls." },
      { name: "renderItem", type: "(item, options) => ReactNode", description: "Custom row renderer for item/thread rows." },
    ],
    related: ["app-shell", "button"],
    slug: "sidebar",
    slots: [
      { name: "primary actions", description: "Caller-provided buttons, links, commands, or custom rows." },
      { name: "projects", description: "Folder rows and nested threads." },
      { name: "footer", description: "Caller-provided account, settings, status, or workspace controls." },
    ],
    sourcePath: "packages/ui/src/sidebar/Sidebar.tsx",
    title: "Sidebar",
    usage: `import { Sidebar } from "@open-shell/ui";

<Sidebar
  primaryItems={navItems}
  projects={[
    {
      id: "desktop-agent-app",
      label: "desktop-agent-app",
      threads: [{ id: "inspect", title: "Inspect Electron UI", active: true, meta: "⌘1" }],
    },
  ]}
  items={[{ id: "notes", title: "Component knowledge base", meta: "notes" }]}
  footer={<WorkspaceFooter />}
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
      "Resizable stateful bottom slot panel featuring Codex-style tabs, inline launcher triggers, interactive Terminal surface, Side Chat, diagnostics logging, and code checklist reviews.",
    importName: "BottomPanel",
    props: [
      { name: "tabs", type: "BottomPanelTab[]", description: "Array of tab configurations. A BottomPanelTab contains: id (string), title (string), content (ReactNode), icon (ReactNode), active (boolean), closable (boolean), and shortcut (string)." },
      { name: "height", type: "number", description: "Initial height of the resizable panel in pixels.", defaultValue: "280" },
      { name: "mainContentHeight", type: "number", description: "Height of the main container viewport, used to clamp drag resizing to maximum 50% height." },
      { name: "onHeightChange", type: "(height: number) => void", description: "Callback fired when the resize action commits a new height." },
      { name: "onClose", type: "() => void", description: "Callback fired when the panel's close button is clicked, mapping to shell state controls." }
    ],
    related: ["app-shell", "file-tree", "terminal-surface"],
    slug: "bottom-panel",
    slots: [
      { name: "tabbar", description: "Inline tab list triggers, dynamic macOS-style circular hover close button, and inline add trigger." },
      { name: "resize handle", description: "Top border interaction area for resizing panel." },
      { name: "outlet", description: "Radix Tabs Content area displaying active tool view, or empty launcher dashboard grid." },
    ],
    sourcePath: "packages/ui/src/bottom-panel/BottomPanel.tsx",
    title: "BottomPanel",
    usage: `import { BottomPanel, TerminalSurface } from "@open-shell/ui";
import { Terminal } from "lucide-react";

<BottomPanel
  onClose={togglePanel}
  tabs={[
    {
      id: "terminal",
      title: "desktop-agent-app",
      icon: <Terminal size={14} />,
      closable: true,
      active: true,
      content: <TerminalSurface cwd="~/general">npm run dev</TerminalSurface>,
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
      { name: "fileName", type: "string", description: "Active file tab title." },
      { name: "breadcrumbs", type: "string[]", description: "Breadcrumb labels for the open file path." },
      { name: "code", type: "string", description: "Displayed code content." },
      { name: "editor", type: "ReactNode", description: "Custom editor/viewer slot. Overrides the default pre/code surface." },
      { name: "toolbar", type: "ReactNode", description: "Custom toolbar slot. Overrides breadcrumbs/path actions." },
      { name: "sidePanel", type: "ReactNode", description: "Custom side panel slot. Overrides the default FileTree panel." },
    ],
    related: ["file-tree", "app-shell"],
    slug: "file-browser-panel",
    slots: [
      { name: "tabs", description: "Caller-owned file tabs." },
      { name: "toolbar", description: "Caller-owned breadcrumbs, path controls, and file actions." },
      { name: "editor", description: "Code editor, preview, diff, or any custom viewer." },
      { name: "sidePanel", description: "Right-side file navigator, outline, symbols, or custom rail." },
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
      { name: "variant", type: '"default" | "sidebar"', description: "Use sidebar for compact transparent left-rail rendering.", defaultValue: "default" },
      { name: "gitLane", type: "boolean", description: "Show the git status lane.", defaultValue: "true" },
      { name: "showActions", type: "boolean", description: "Show the trailing action lane.", defaultValue: "true" },
      { name: "data", type: "TreeNode[]", description: "Tree-view style data source for highly customizable app-owned node structures." },
      { name: "defaultExpandedPaths", type: "string[]", description: "Initial expanded directory paths. Defaults to all directories." },
      { name: "defaultExpandedIds", type: "string[]", description: "Tree-node ids that should start expanded when using the data API." },
      { name: "selectedIds", type: "string[]", description: "Controlled selection state for file or tree nodes." },
      { name: "onSelectionChange", type: "(ids: string[]) => void", description: "Selection change callback for single or multi-select trees." },
      { name: "onNodeClick", type: "(node: TreeNode) => void", description: "App-level node click callback." },
      { name: "onNodeExpand", type: "(nodeId: string, expanded: boolean) => void", description: "Expansion callback for folder state changes." },
      { name: "showLines", type: "boolean", description: "Render subtle hierarchy guide lines.", defaultValue: "false" },
      { name: "showIcons", type: "boolean", description: "Toggle file and folder glyphs independently of the chevron lane.", defaultValue: "true" },
      { name: "indent", type: "number", description: "Adjust hierarchy indentation without changing the component API.", defaultValue: "24" },
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
  variant="sidebar"
  gitLane={false}
  showActions={false}
  showLines
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
