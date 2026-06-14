"use client";

import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";
import { ArrowLeft, Check, ChevronDown, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/dropdown-menu";
import { cn } from "../lib/utils";

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
    <aside className={cn("flex h-full w-64 shrink-0 flex-col border-r bg-muted/20", className)} {...props}>
      <button className="flex h-12 items-center gap-2 px-4 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground" type="button" onClick={onBack}>
        <ArrowLeft size={18} strokeWidth={1.7} />
        <span>{backLabel}</span>
      </button>

      <label className="mx-3 flex h-8 items-center gap-2 rounded-md border bg-background px-2 text-muted-foreground focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/30">
        <Search size={17} strokeWidth={1.7} aria-hidden="true" />
        <input className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          aria-label="Search settings"
          placeholder={searchPlaceholder}
          value={query}
          onChange={(event) => onSearchChange?.(event.currentTarget.value)}
        />
      </label>

      <div className="mt-3 min-h-0 flex-1 overflow-y-auto px-2 pb-3">
        {visibleSections.map((section) => (
          <section className="mb-4" key={section.id}>
            {section.label != null ? <div className="px-2 pb-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{section.label}</div> : null}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const active = item.id === activeItemId;
                return renderItem != null ? (
                  renderItem(item, { active })
                ) : (
                  <button
                    className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground data-[active=true]:bg-muted data-[active=true]:font-medium data-[active=true]:text-foreground data-[muted=true]:opacity-60"
                    data-active={active ? "true" : undefined}
                    data-muted={item.muted ? "true" : undefined}
                    key={item.id}
                    type="button"
                    onClick={() => onItemSelect?.(item)}
                  >
                    {item.icon != null ? <span className="flex size-4 shrink-0 items-center justify-center [&_svg]:size-4">{item.icon}</span> : null}
                    <span className="min-w-0 flex-1 truncate">{item.label}</span>
                    {item.badge != null ? <span className="shrink-0 text-xs text-muted-foreground">{item.badge}</span> : null}
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {footer != null ? <div className="border-t p-3">{footer}</div> : null}
    </aside>
  );
}

export function SettingsPanel({ children, className, subtitle, title, ...props }: SettingsPanelProps) {
  return (
    <main className={cn("min-w-0 flex-1 overflow-y-auto bg-background", className)} {...props}>
      <div className="mx-auto w-full max-w-3xl px-8 py-10">
        <header className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {subtitle != null ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
        </header>
        {children}
      </div>
    </main>
  );
}

export function SettingsSection({ children, className, title, ...props }: SettingsSectionProps) {
  return (
    <section className={cn("mb-8 space-y-3", className)} {...props}>
      {title != null ? <h2 className="text-sm font-semibold">{title}</h2> : null}
      {children}
    </section>
  );
}

export function SettingsCard({ children, className, ...props }: SettingsCardProps) {
  return (
    <div className={cn("divide-y rounded-lg border bg-card text-card-foreground shadow-sm", className)} {...props}>
      {children}
    </div>
  );
}

export function SettingsRow({ children, className, control, description, title, ...props }: SettingsRowProps) {
  return (
    <div className={cn("flex min-h-16 items-center justify-between gap-6 px-4 py-3", className)} {...props}>
      <div className="min-w-0 flex-1">
        <span className="text-sm font-medium">{title}</span>
        {description != null ? <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{description}</p> : null}
        {children}
      </div>
      {control != null ? <div className="shrink-0">{control}</div> : null}
    </div>
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
      className={cn("relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full bg-input transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-50 data-[checked=true]:bg-primary", className)}
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
      <span className="pointer-events-none block size-4 translate-x-0.5 rounded-full bg-background shadow-sm transition-transform data-[checked=true]:translate-x-[18px]" data-checked={checked ? "true" : "false"} />
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
      className={cn("flex w-full items-center gap-3 rounded-lg border bg-card p-4 text-left transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 data-[selected=true]:border-primary data-[selected=true]:bg-primary/5", className)}
      data-selected={selected ? "true" : "false"}
      type={type}
      {...props}
    >
      {icon != null ? <span className="flex size-9 shrink-0 items-center justify-center rounded-md border bg-muted [&_svg]:size-4">{icon}</span> : null}
      <span className="min-w-0 flex-1">
        <strong className="block text-sm font-medium">{title}</strong>
        {description != null ? <span className="mt-0.5 block text-xs text-muted-foreground">{description}</span> : null}
        {children}
      </span>
      <span className="flex size-5 shrink-0 items-center justify-center rounded-full border text-transparent data-[selected=true]:border-primary data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground" data-selected={selected ? "true" : "false"} aria-hidden="true">
        <Check size={16} strokeWidth={2} />
      </span>
    </button>
  );
}

export function SettingsSelect({ className, ...props }: SettingsSelectProps) {
  return <select className={cn("h-8 rounded-md border bg-background px-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/40 disabled:opacity-50", className)} {...props} />;
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
      <DropdownMenuTrigger
        disabled={disabled}
        render={<button
          className={cn("flex h-8 min-w-40 items-center justify-between gap-3 rounded-md border bg-background px-2 text-sm outline-none hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring/40 disabled:opacity-50 data-[placeholder=true]:text-muted-foreground", className)}
          data-placeholder={selected == null ? "true" : undefined}
          disabled={disabled}
          type="button"
        />}
      >
          <span className="truncate">{selected?.label ?? placeholder}</span>
          <ChevronDown size={15} strokeWidth={1.8} aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-56">
        {options.map((option) => (
          <DropdownMenuItem
            disabled={option.disabled}
            key={option.value}
            onSelect={() => onValueChange?.(option.value)}
          >
            <span className="min-w-0 flex-1">
              <span className="block">{option.label}</span>
              {option.description != null ? <small className="block text-xs text-muted-foreground">{option.description}</small> : null}
            </span>
            {option.value === value ? <Check size={14} strokeWidth={2} /> : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
