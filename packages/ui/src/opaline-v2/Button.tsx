import * as React from "react";

import { Button as ShadcnButton } from "../components/button";
import { cn } from "../lib/utils";

type LegacyButtonVariant = "danger" | "ghost" | "primary" | "secondary" | "soft";
type LegacyButtonSize = "default" | "icon" | "small";

export type OpalineV2ButtonProps = Omit<React.ComponentProps<typeof ShadcnButton>, "size" | "variant"> & {
  icon?: React.ReactNode;
  size?: LegacyButtonSize | React.ComponentProps<typeof ShadcnButton>["size"];
  variant?: LegacyButtonVariant | React.ComponentProps<typeof ShadcnButton>["variant"];
};

const variantMap = { danger: "destructive", primary: "default", soft: "secondary" } as const;
const sizeMap = { small: "sm" } as const;

export function Button({ children, className, icon, size = "default", variant = "default", ...props }: OpalineV2ButtonProps) {
  const normalizedVariant = variant ?? "default";
  const normalizedSize = size ?? "default";
  const resolvedVariant = normalizedVariant in variantMap ? variantMap[normalizedVariant as keyof typeof variantMap] : normalizedVariant;
  const resolvedSize = normalizedSize in sizeMap ? sizeMap[normalizedSize as keyof typeof sizeMap] : normalizedSize;

  return (
    <ShadcnButton
      className={className}
      size={resolvedSize as React.ComponentProps<typeof ShadcnButton>["size"]}
      variant={resolvedVariant as React.ComponentProps<typeof ShadcnButton>["variant"]}
      {...props}
    >
      {icon != null ? <span data-icon="inline-start">{icon}</span> : null}
      {children}
    </ShadcnButton>
  );
}

export function IconButton(props: OpalineV2ButtonProps) {
  return <Button size="icon" {...props} />;
}

export function Pill({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">{children}</span>;
}

export function StatusDot({ tone = "neutral" }: { tone?: "green" | "neutral" | "orange" }) {
  return <span aria-hidden="true" className={cn("size-2 rounded-full", tone === "green" ? "bg-primary" : tone === "orange" ? "bg-destructive" : "bg-muted-foreground")} data-tone={tone} />;
}
