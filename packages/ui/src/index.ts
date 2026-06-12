export {
  AppShell,
  AppShellBottomPanel,
  AppShellChromeButton,
  AppShellChromeControls,
  AppShellCollapsedSidebarTrigger,
  AppShellComposer,
  AppShellContent,
  AppShellHeader,
  AppShellHeaderActions,
  AppShellHeaderContextSurface,
  AppShellHeaderPillButton,
  AppShellHeaderToolButton,
  AppShellNavigationControls,
  AppShellRightPanel,
  AppShellSidebarChrome,
  AppShellTab,
  AppShellTabActionButton,
  AppShellTabActions,
  AppShellTabController,
  AppShellTabStrip,
} from "./app-shell/AppShell";
export type { AppShellProps, AppShellState, AppShellTabItem } from "./app-shell/AppShell";
export { AgentActivity, AgentActivityList, AgentSuggestion, AgentThinking } from "./agent-activity/AgentActivity";
export type {
  AgentActivityEntry,
  AgentActivityProps,
  AgentActivityStatus,
  AgentActivityListProps,
  AgentSuggestionProps,
  AgentThinkingProps,
} from "./agent-activity/AgentActivity";
export { AgentContextAction, AgentContextSources, AgentContextSurface } from "./agent-context/AgentContextSurface";
export type {
  AgentContextActionProps,
  AgentContextAnchor,
  AgentContextMode,
  AgentContextSource,
  AgentContextStage,
  AgentContextSurfaceProps,
} from "./agent-context/AgentContextSurface";
export {
  AdaptiveSidecarLayout,
  AdaptiveSidecarSurface,
  getAdaptiveSidecarMode,
} from "./adaptive-sidecar/AdaptiveSidecar";
export type {
  AdaptiveSidecarLayoutProps,
  AdaptiveSidecarMode,
  AdaptiveSidecarSurfaceProps,
} from "./adaptive-sidecar/AdaptiveSidecar";
export { SlotPanel } from "./slot-panel/SlotPanel";
export type { SlotTab, SlotPanelHandle, SlotPanelProps, SlotLauncherItem } from "./slot-panel/SlotPanel";
export {
  ShellHistoryProvider,
  useShellHistory,
  useShellHistoryContext,
} from "./history/ShellHistory";
export type {
  ShellHistoryController,
  ShellHistoryEntry,
  ShellHistoryProviderProps,
  ShellHistoryState,
  UseShellHistoryOptions,
} from "./history/ShellHistory";
export { BottomPanel, TerminalSurface, clampBottomPanelHeight } from "./bottom-panel/BottomPanel";
export type { BottomPanelHandle, BottomPanelProps, BottomPanelTab, TerminalSurfaceProps } from "./bottom-panel/BottomPanel";
export { Composer } from "./composer/Composer";
export { FileTree } from "./file-tree/FileTree";
export type { FileTreeItem, FileTreeProps, TreeNode } from "./file-tree/FileTree";
export { FileBrowserBreadcrumbs, FileBrowserPanel, FileBrowserTab } from "./file-browser/FileBrowserPanel";
export type { FileBrowserPanelProps } from "./file-browser/FileBrowserPanel";
export { OpalineMark } from "./icons/OpalineMark";
export {
  SettingsCard,
  SettingsChoice,
  SettingsOptionCard,
  SettingsPanel,
  SettingsRow,
  SettingsSection,
  SettingsSelect,
  SettingsSidebar,
  SettingsToggle,
} from "./settings/Settings";
export type {
  SettingsCardProps,
  SettingsChoiceOption,
  SettingsChoiceProps,
  SettingsNavItem,
  SettingsNavSection,
  SettingsOptionCardProps,
  SettingsPanelProps,
  SettingsRowProps,
  SettingsSectionProps,
  SettingsSelectProps,
  SettingsSidebarProps,
  SettingsToggleProps,
} from "./settings/Settings";
export { Button, IconButton, Pill, StatusDot } from "./primitives/Button";
export {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuPortal,
  ContextMenuRadioGroup,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "./primitives/ContextMenu";
export {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogSection,
  DialogTitle,
  DialogTrigger,
} from "./primitives/Dialog";
export type { OpalineDialogContentProps, DialogSize } from "./primitives/Dialog";
export { HoverPreview } from "./primitives/HoverPreview";
export type { HoverPreviewProps } from "./primitives/HoverPreview";
export { Timeline } from "./timeline/Timeline";
export type { TimelineItem, TimelineProps, TimelineStatus } from "./timeline/Timeline";
export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuItemIndicator,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./primitives/DropdownMenu";
export {
  Sidebar,
  SidebarBottomSlot,
  SidebarFooter,
  SidebarNavItemRow,
  SidebarPrimary,
  SidebarProjectRow,
  SidebarScroll,
  SidebarSection,
  SidebarThreadRow,
} from "./sidebar/Sidebar";
export type { SidebarItem, SidebarNavItem, SidebarProject, SidebarProps } from "./sidebar/Sidebar";
export type { SidebarBottomSlotProps } from "./sidebar/Sidebar";
export { appActionAttributeNames, appActionAttributes } from "./sidebar/appActionAttributes";
export { ThreadMessageRow, ThreadSurface } from "./thread/ThreadSurface";
export type { ThreadMessage, ThreadSurfaceProps } from "./thread/ThreadSurface";
