"use client"

import * as React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faEye, faPlus, faTrash} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

function cn(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(" ");
}

type ButtonVariant = "default" | "outline" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg" | "icon";
type onClickType = (event: React.MouseEvent<HTMLButtonElement>) => void;

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading?: boolean;
  onClick?: onClickType
}

const baseStyles =
  "inline-flex items-center justify-center font-medium transition rounded-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

const variantStyles: Record<ButtonVariant, string> = {
  default: "bg-black text-white hover:bg-black/80 focus:ring-black dark:bg-white dark:text-black dark:hover:bg-white/90",
  outline: "border border-border bg-surface hover:bg-surface-muted focus:ring-gray-400",
  secondary: "bg-surface-muted text-foreground hover:bg-border focus:ring-gray-400",
  ghost: "bg-transparent hover:bg-surface-muted focus:ring-gray-400",
  danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-600",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
  icon: "h-10 w-10",
};

export function Buttons({
                         className,
                         variant = "default",
                         size = "md",
                         leftIcon,
                         rightIcon,
                         loading = false,
                         disabled,
                         children,
                         type,
                         onClick,
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
      onClick={onClick}
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

export function EditButton({onClick}: { onClick: onClickType }) {
  return (
    <Buttons variant="ghost" onClick={onClick}>
      <FontAwesomeIcon color="#2b7fff" icon={faEdit}/>
    </Buttons>
  )
}

export function EditLinkButton({url}: { url: string }) {
  return (
    <Buttons variant="ghost">
      <Link href={url}>
        <FontAwesomeIcon color="#2b7fff" icon={faEdit}/>
      </Link>
    </Buttons>
  )
}

export function DestroyButton({onClick}: { onClick: onClickType }) {
  return (
    <Buttons onClick={onClick} variant="ghost">
      <FontAwesomeIcon color="red" icon={faTrash}/>
    </Buttons>
  )
}

export function AddButton({url}: { url: string }) {
  return (
    <Buttons variant="outline">
      <Link href={url}>
        <FontAwesomeIcon icon={faPlus}/>
      </Link>
    </Buttons>
  )
}

export function OpenButton({url}: { url: string }) {
  return (
    <Buttons variant="ghost">
      <Link href={url}>
        <FontAwesomeIcon icon={faEye}/>
      </Link>
    </Buttons>
  )
}

export function LinkButton({url, children}: { url: string, children: React.ReactNode }) {
  return (
    <Buttons variant="ghost">
      <Link href={url}>
        {children}
      </Link>
    </Buttons>
  )
}
