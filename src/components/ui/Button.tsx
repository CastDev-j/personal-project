import { cn } from "@/lib/cn";
import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "default" | "danger" | "ghost" | "outline";
type ButtonSize = "default" | "sm" | "lg" | "icon";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const Button = ({
  className,
  variant = "default",
  size = "default",
  type = "button",
  children,
  ...props
}: ButtonProps) => {
  const baseStyles =
    "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors outline-none select-none disabled:pointer-events-none disabled:opacity-50";

  const sizeStyles = {
    default: "py-2 px-2.5 gap-1.5",
    sm: "h-7 px-2.5 text-xs gap-1",
    lg: "h-9 px-4 gap-1.5",
    icon: "size-8 p-0",
  }[size];

  const variantStyles = {
    default:
      "bg-neutral-900 text-neutral-50 hover:bg-neutral-800 active:bg-neutral-950",
    danger: "bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800",

    ghost: "hover:bg-neutral-100 hover:text-neutral-900 active:bg-neutral-200",
    outline:
      "border border-neutral-300 text-neutral-900 hover:bg-neutral-100 active:bg-neutral-200",
  }[variant];

  return (
    <button
      type={type}
      className={cn(baseStyles, sizeStyles, variantStyles, className)}
      {...props}
    >
      {children}
    </button>
  );
};

export { Button };
