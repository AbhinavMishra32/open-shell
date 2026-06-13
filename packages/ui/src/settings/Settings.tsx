"use client";

import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";
import { ArrowLeft, Check, ChevronDown, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../primitives/DropdownMenu";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "../shadcn";
import "./settings.css";

export type SettingsNavItem = {
  badge?: ReactNode;
  icon?: ReactNode;
  id: string;
  label: ReactNode;
  muted?: boolean;
};

export type SettingsNavSection = {
  id: string;
  items: SettingsNavItem[];
  label?: ReactNode;
};

export type SettingsSidebarProps = HTMLAttributes<HTMLElement> & {
  activeItemId?: string;
  backLabel?: ReactNode;
  footer?: ReactNode;
  onBack?: () => void;
  onItemSelect?: (item: SettingsNavItem) => void;
  onSearchChange?: (query: string) => void;
  query?: string;
  renderItem?: (item: SettingsNavItem, state: { active: boolean }) => ReactNode;
  searchPlaceholder?: string;
  sections: SettingsNavSection[];
};

export type SettingsPanelProps = HTMLAttributes<HTMLElement> & {
  subtitle?: ReactNode;
  title: ReactNode;
};

export type SettingsSectionProps = HTMLAttributes<HTMLElement> & {
  title?: ReactNode;
};

export type SettingsCardProps = HTMLAttributes<HTMLDivElement>;

export type SettingsRowProps = HTMLAttributes<HTMLDivElement> & {
  control?: ReactNode;
  description?: ReactNode;
  title: ReactNode;
};

export type SettingsToggleProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> & {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};

export type SettingsOptionCardProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  description?: ReactNode;
  icon?: ReactNode;
  selected?: boolean;
  title: ReactNode;
};

export type SettingsSelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export type SettingsChoiceOption = {
  description?: ReactNode;
  disabled?: boolean;
  label: ReactNode;
  value: string;
};

export type SettingsChoiceProps = {
  className?: string;
  disabled?: boolean;
  onValueChange?: (value: string) => void;
  options: SettingsChoiceOption[];
  placeholder?: ReactNode;
  value?: string;
};

export function SettingsSidebar({
  activeItemId,
  backLabel = "Back to app",
  className,
  footer,
  onBack,
  onItemSelect,
  onSearchChange,
  query = "",
  renderItem,
  searchPlaceholder = "Search settings...",
  sections,
  ...props
}: SettingsSidebarProps) {
  const normalizedQuery = query.trim().toLowerCase();
  const visibleSections = normalizedQuery
    ? sections
        .map((section) => ({
          ...section,
          items: section.items.filter((item) => String(item.label).toLowerCase().includes(normalizedQuery)),
        }))
        .filter((section) => section.items.length > 0)
    : sections;

  return (
    <aside className={joinClassNames("opaline-settings-sidebar", className)} {...props}>
      <button className="opaline-settings-back" type="button" onClick={onBack}>
        <ArrowLeft size={18} strokeWidth={1.7} />
        <span>{backLabel}</span>
      </button>

      <label className="opaline-settings-search">
        <Search size={17} strokeWidth={1.7} aria-hidden="true" />
        <input
          aria-label="Search settings"
          placeholder={searchPlaceholder}
          value={query}
          onChange={(event) => onSearchChange?.(event.currentTarget.value)}
        />
      </label>

      <div className="opaline-settings-nav-scroll">
        {visibleSections.map((section) => (
          <section className="opaline-settings-nav-section" key={section.id}>
            {section.label != null ? <div className="opaline-settings-nav-label">{section.label}</div> : null}
            <div className="opaline-settings-nav-list">
              {section.items.map((item) => {
                const active = item.id === activeItemId;
                return renderItem != null ? (
                  renderItem(item, { active })
                ) : (
                  <button
                    className="opaline-settings-nav-item"
                    data-active={active ? "true" : undefined}
                    data-muted={item.muted ? "true" : undefined}
                    key={item.id}
                    type="button"
                    onClick={() => onItemSelect?.(item)}
                  >
                    {item.icon != null ? <span className="opaline-settings-nav-icon">{item.icon}</span> : null}
                    <span className="opaline-settings-nav-title">{item.label}</span>
                    {item.badge != null ? <span className="opaline-settings-nav-badge">{item.badge}</span> : null}
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {footer != null ? <div className="opaline-settings-sidebar-footer">{footer}</div> : null}
    </aside>
  );
}

export function SettingsPanel({ children, className, subtitle, title, ...props }: SettingsPanelProps) {
  return (
    <main className={joinClassNames("opaline-settings-panel", className)} {...props}>
      <div className="opaline-settings-panel-inner">
        <header className="opaline-settings-panel-header">
          <h1>{title}</h1>
          {subtitle != null ? <p>{subtitle}</p> : null}
        </header>
        {children}
      </div>
    </main>
  );
}

export function SettingsSection({ children, className, title, ...props }: SettingsSectionProps) {
  return (
    <section className={joinClassNames("opaline-settings-section", className)} {...props}>
      {title != null ? <h2>{title}</h2> : null}
      {children}
    </section>
  );
}

export function SettingsCard({ children, className, ...props }: SettingsCardProps) {
  return (
    <div className={joinClassNames("opaline-settings-card", className)} {...props}>
      {children}
    </div>
  );
}

export function SettingsRow({ children, className, control, description, title, ...props }: SettingsRowProps) {
  return (
    <Item className={joinClassNames("opaline-settings-row", className)} {...props}>
      <ItemContent className="opaline-settings-row-copy">
        <ItemTitle className="opaline-settings-row-title">{title}</ItemTitle>
        {description != null ? <ItemDescription>{description}</ItemDescription> : null}
        {children}
      </ItemContent>
      {control != null ? <ItemActions className="opaline-settings-row-control">{control}</ItemActions> : null}
    </Item>
  );
}

export function SettingsToggle({
  checked = false,
  className,
  onCheckedChange,
  onClick,
  type = "button",
  ...props
}: SettingsToggleProps) {
  return (
    <button
      aria-checked={checked}
      className={joinClassNames("opaline-settings-toggle", className)}
      data-checked={checked ? "true" : "false"}
      role="switch"
      type={type}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) {
          onCheckedChange?.(!checked);
        }
      }}
      {...props}
    >
      <span />
    </button>
  );
}

export function SettingsOptionCard({
  children,
  className,
  description,
  icon,
  selected = false,
  title,
  type = "button",
  ...props
}: SettingsOptionCardProps) {
  return (
    <button
      className={joinClassNames("opaline-settings-option-card", className)}
      data-selected={selected ? "true" : "false"}
      type={type}
      {...props}
    >
      {icon != null ? <span className="opaline-settings-option-icon">{icon}</span> : null}
      <span className="opaline-settings-option-copy">
        <strong>{title}</strong>
        {description != null ? <span>{description}</span> : null}
        {children}
      </span>
      <span className="opaline-settings-option-check" aria-hidden="true">
        <Check size={16} strokeWidth={2} />
      </span>
    </button>
  );
}

export function SettingsSelect({ className, ...props }: SettingsSelectProps) {
  return <select className={joinClassNames("opaline-settings-select", className)} {...props} />;
}

export function SettingsChoice({
  className,
  disabled = false,
  onValueChange,
  options,
  placeholder = "Select",
  value
}: SettingsChoiceProps) {
  const selected = options.find((option) => option.value === value);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={disabled}>
        <button
          className={joinClassNames("opaline-settings-choice", className)}
          data-placeholder={selected == null ? "true" : undefined}
          disabled={disabled}
          type="button"
        >
          <span className="opaline-settings-choice-label">{selected?.label ?? placeholder}</span>
          <ChevronDown size={15} strokeWidth={1.8} aria-hidden="true" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="opaline-settings-choice-menu">
        {options.map((option) => (
          <DropdownMenuItem
            disabled={option.disabled}
            key={option.value}
            onSelect={() => onValueChange?.(option.value)}
          >
            <span className="opaline-settings-choice-item">
              <span>{option.label}</span>
              {option.description != null ? <small>{option.description}</small> : null}
            </span>
            {option.value === value ? <Check size={14} strokeWidth={2} /> : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function joinClassNames(...classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(" ");
}
