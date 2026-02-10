import * as React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faTrash} from "@fortawesome/free-solid-svg-icons";

// util simples para concatenar classes (substitui clsx/twMerge se quiser)
function cn(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(" ");
}

export type ButtonVariant = "default" | "outline" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg" | "icon";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading?: boolean;
}

const baseStyles =
  "inline-flex items-center justify-center font-medium transition rounded-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

const variantStyles: Record<ButtonVariant, string> = {
  default: "bg-black text-white hover:bg-black/80 focus:ring-black",
  outline: "border border-gray-300 bg-white hover:bg-gray-50 focus:ring-gray-400",
  secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-400",
  ghost: "bg-transparent hover:bg-gray-100 focus:ring-gray-400",
  danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-600",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
  icon: "h-10 w-10",
};

export function Button({
                                 className,
                                 variant = "default",
                                 size = "md",
                                 leftIcon,
                                 rightIcon,
                                 loading = false,
                                 disabled,
                                 children,
                                 type,
                                 ...props
                               }: ButtonProps) {
  const isIconOnly = size === "icon";

  return (
    <button
      type={type ?? "button"}
      disabled={disabled || loading}
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && (
        <span
          aria-hidden
          className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      )}

      {!loading && leftIcon && !isIconOnly && (
        <span className="mr-2 inline-flex items-center">{leftIcon}</span>
      )}

      {!isIconOnly && children}

      {!loading && rightIcon && !isIconOnly && (
        <span className="ml-2 inline-flex items-center">{rightIcon}</span>
      )}

      {isIconOnly && !loading && (leftIcon ?? children)}
    </button>
  );
}

export function EditButton() {
  return (
    <Button variant="ghost">
      <FontAwesomeIcon color="#2b7fff" icon={faEdit}/>
    </Button>
  )
}

export function DestroyButton() {
  return (
    <Button variant="ghost">
      <FontAwesomeIcon color="red" icon={faTrash}/>
    </Button>
  )
}
