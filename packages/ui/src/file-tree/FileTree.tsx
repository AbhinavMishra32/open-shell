"use client";

import React, { useCallback, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { ChevronRight, File, Folder, FolderOpen } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import "./file-tree.css";

export type TreeNode = {
  id: string;
  label: string;
  icon?: React.ReactNode;
  children?: TreeNode[];
  data?: any;
};

export type TreeViewProps = {
  data: TreeNode[];
  className?: string;
  onNodeClick?: (node: TreeNode) => void;
  onNodeExpand?: (nodeId: string, expanded: boolean) => void;
  defaultExpandedIds?: string[];
  showLines?: boolean;
  showIcons?: boolean;
  selectable?: boolean;
  multiSelect?: boolean;
  selectedIds?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
  indent?: number;
  animateExpand?: boolean;
};

export type FileTreeItem = {
  children?: FileTreeItem[];
  decoration?: ReactNode;
  gitStatus?: "added" | "modified" | "deleted" | "renamed";
  id?: string;
  icon?: ReactNode;
  locked?: boolean;
  name: string;
  path: string;
  selected?: boolean;
  type?: "file" | "directory";
};

type FileTreeNodeMeta = {
  decoration?: ReactNode;
  locked?: boolean;
};

export type FileTreeProps = Omit<TreeViewProps, "data"> & {
  data?: TreeNode[];
  items?: FileTreeItem[];
  search?: boolean;
  searchAriaLabel?: string;
  searchLabel?: string;
  searchPlaceholder?: string;
  surface?: "plain" | "contained";
  variant?: "default" | "sidebar";
};

export function TreeView({
  data,
  className,
  onNodeClick,
  onNodeExpand,
  defaultExpandedIds = [],
  showLines = true,
  showIcons = true,
  selectable = true,
  multiSelect = false,
  selectedIds = [],
  onSelectionChange,
  indent = 20,
  animateExpand = true,
}: TreeViewProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(defaultExpandedIds));
  const [internalSelectedIds, setInternalSelectedIds] = useState<string[]>(selectedIds);

  const isControlled = selectedIds !== undefined && onSelectionChange !== undefined;
  const currentSelectedIds = isControlled ? selectedIds : internalSelectedIds;

  const toggleExpanded = useCallback(
    (nodeId: string) => {
      setExpandedIds((prev) => {
        const newSet = new Set(prev);
        const isExpanded = newSet.has(nodeId);
        isExpanded ? newSet.delete(nodeId) : newSet.add(nodeId);
        onNodeExpand?.(nodeId, !isExpanded);
        return newSet;
      });
    },
    [onNodeExpand],
  );

  const handleSelection = useCallback(
    (nodeId: string, ctrlKey = false) => {
      if (!selectable) return;

      let newSelection: string[];

      if (multiSelect && ctrlKey) {
        newSelection = currentSelectedIds.includes(nodeId)
          ? currentSelectedIds.filter((id) => id !== nodeId)
          : [...currentSelectedIds, nodeId];
      } else {
        newSelection = currentSelectedIds.includes(nodeId) ? [] : [nodeId];
      }

      isControlled ? onSelectionChange?.(newSelection) : setInternalSelectedIds(newSelection);
    },
    [selectable, multiSelect, currentSelectedIds, isControlled, onSelectionChange],
  );

  const renderNode = (
    node: TreeNode,
    level = 0,
    isLast = false,
    parentPath: boolean[] = [],
  ) => {
    const hasChildren = (node.children?.length ?? 0) > 0;
    const isExpanded = expandedIds.has(node.id);
    const isSelected = currentSelectedIds.includes(node.id);
    const currentPath = [...parentPath, isLast];
    const meta = readNodeMeta(node.data);

    const getDefaultIcon = () =>
      hasChildren ? (
        isExpanded ? (
          <FolderOpen className="codex-treeview-node-glyph" />
        ) : (
          <Folder className="codex-treeview-node-glyph" />
        )
      ) : (
        <File className="codex-treeview-node-glyph" />
      );

    return (
      <div key={node.id} className="codex-treeview-branch select-none">
        <motion.div
          className={cn(
            "codex-treeview-node",
            "transition-all duration-200 relative group rounded-md mx-1",
            "hover:bg-accent/50",
            isSelected && "bg-accent/80 codex-treeview-node-selected",
            selectable && "hover:border-accent-foreground/10",
            className,
          )}
          style={{ paddingLeft: level * indent + 8 }}
          onClick={(e) => {
            e.stopPropagation();
            if (hasChildren) toggleExpanded(node.id);
            handleSelection(node.id, e.ctrlKey || e.metaKey);
            onNodeClick?.(node);
          }}
          whileTap={{ scale: 0.98, transition: { duration: 0.1 } }}
        >
          {showLines && level > 0 && (
            <div className="codex-treeview-lines" aria-hidden="true">
              {currentPath.map((isLastInPath, pathIndex) => (
                <div
                  key={pathIndex}
                  className="codex-treeview-line-vertical"
                  style={{
                    left: pathIndex * indent + 12,
                    display:
                      pathIndex === currentPath.length - 1 && isLastInPath
                        ? "none"
                        : "block",
                  }}
                />
              ))}
              <div
                className="codex-treeview-line-horizontal"
                style={{
                  left: (level - 1) * indent + 12,
                  width: indent - 4,
                  transform: "translateY(-1px)",
                }}
              />
              {isLast && (
                <div
                  className="codex-treeview-line-vertical codex-treeview-line-last"
                  style={{
                    left: (level - 1) * indent + 12,
                    height: "50%",
                  }}
                />
              )}
            </div>
          )}

          <motion.div
            className="codex-treeview-expand-icon"
            animate={{ rotate: hasChildren && isExpanded ? 90 : 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            {hasChildren && <ChevronRight className="codex-treeview-chevron" />}
          </motion.div>

          {showIcons && (
            <motion.div
              className="codex-treeview-node-icon"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.15 }}
            >
              {node.icon || getDefaultIcon()}
            </motion.div>
          )}

          <span className="codex-treeview-label">{node.label}</span>
          {meta.decoration ? <span className="codex-treeview-decoration">{meta.decoration}</span> : null}
        </motion.div>

        <AnimatePresence>
          {hasChildren && isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{
                duration: animateExpand ? 0.3 : 0,
                ease: "easeInOut",
              }}
              className="codex-treeview-children"
            >
              <motion.div
                initial={{ y: -10 }}
                animate={{ y: 0 }}
                exit={{ y: -10 }}
                transition={{
                  duration: animateExpand ? 0.2 : 0,
                  delay: animateExpand ? 0.1 : 0,
                }}
              >
                {node.children!.map((child, index) =>
                  renderNode(child, level + 1, index === node.children!.length - 1, currentPath),
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <motion.div
      className={cn("codex-treeview-surface", className)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="codex-treeview-surface-inner">
        {data.map((node, index) => renderNode(node, 0, index === data.length - 1))}
      </div>
    </motion.div>
  );
}

export function FileTree({
  data,
  items,
  search = true,
  searchAriaLabel = "Filter files",
  searchLabel = "Filter files",
  searchPlaceholder = "Filter files...",
  surface = "plain",
  variant = "default",
  className,
  ...treeProps
}: FileTreeProps) {
  const normalizedData = useMemo(() => {
    if (data != null) {
      return data;
    }
    return (items ?? []).map(mapFileTreeItemToNode);
  }, [data, items]);

  return (
    <div
      className={cn(
        "codex-file-tree",
        "codex-treeview-shell",
        variant === "sidebar" && "codex-treeview-shell-sidebar",
        surface === "contained" && "codex-treeview-shell-contained",
        className,
      )}
      data-file-tree-variant={variant}
    >
      <div className="codex-file-tree-root" role="tree" tabIndex={-1}>
        {search ? (
          <div data-file-tree-search-container="true">
            <label className="codex-file-tree-search-label" htmlFor="codex-file-tree-search">
              {searchLabel}
            </label>
            <div className="codex-file-tree-search-field">
              <SearchIcon />
              <input
                id="codex-file-tree-search"
                data-file-tree-search-input="true"
                placeholder={searchPlaceholder}
                aria-label={searchAriaLabel}
              />
            </div>
          </div>
        ) : null}
        <div data-file-tree-virtualized-scroll="true">
          <TreeView data={normalizedData} {...treeProps} />
        </div>
      </div>
    </div>
  );
}

function mapFileTreeItemToNode(item: FileTreeItem): TreeNode {
  return {
    id: item.id ?? item.path,
    label: item.name,
    icon: item.icon,
    children: item.children?.map(mapFileTreeItemToNode),
    data: {
      decoration: item.decoration,
      locked: item.locked,
    } satisfies FileTreeNodeMeta,
  };
}

function readNodeMeta(data: any): FileTreeNodeMeta {
  if (data == null || typeof data !== "object") {
    return {};
  }
  return data as FileTreeNodeMeta;
}

function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function SearchIcon() {
  return (
    <svg className="codex-file-tree-search-icon" viewBox="0 0 20 20" aria-hidden="true">
      <path
        d="M8.75 3.75a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm4.1 7.1 3.15 3.15"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}
