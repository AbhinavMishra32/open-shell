import { Slot } from "@radix-ui/react-slot";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import "./button.css";

type ButtonSize = "default" | "icon" | "small";
type ButtonVariant = "danger" | "ghost" | "primary" | "secondary" | "soft";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  icon?: ReactNode;
  size?: ButtonSize;
  variant?: ButtonVariant;
};

export function Button({
  asChild = false,
  children,
  className = "",
  icon,
  size = "default",
  variant = "ghost",
  ...props
}: ButtonProps) {
  const Component = asChild ? Slot : "button";

  return (
    <Component
      className={`opaline-button opaline-button-${variant} opaline-button-${size} ${className}`}
      {...props}
    >
      {icon != null ? <span className="opaline-button-icon-glyph">{icon}</span> : null}
      {children}
    </Component>
  );
}

export function IconButton({ children, "aria-label": ariaLabel, ...props }: ButtonProps) {
  return (
    <Button aria-label={ariaLabel} size="icon" {...props}>
      {children}
    </Button>
  );
}

export function StatusDot({ tone = "neutral" }: { tone?: "green" | "neutral" | "orange" }) {
  return <span className="opaline-status-dot" data-tone={tone} aria-hidden="true" />;
}

export function Pill({ children }: { children: ReactNode }) {
  return <span className="opaline-pill">{children}</span>;
}
