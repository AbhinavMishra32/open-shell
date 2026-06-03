import type { ButtonHTMLAttributes, ReactNode } from "react";
import "./button.css";

type ButtonVariant = "ghost" | "solid" | "soft";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: ReactNode;
  variant?: ButtonVariant;
};

export function Button({ children, className = "", icon, variant = "ghost", ...props }: ButtonProps) {
  return (
    <button className={`codex-button codex-button-${variant} ${className}`} {...props}>
      {icon != null ? <span className="codex-button-icon">{icon}</span> : null}
      {children}
    </button>
  );
}
