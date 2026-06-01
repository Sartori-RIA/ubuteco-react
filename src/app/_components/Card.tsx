"use client"

import {ReactNode} from "react";

type CardProps = {
  title: string;
  className?: string;
  children: ReactNode;
}

export function Card({title, children, className}: CardProps) {
  return (
    <div
      className={`rounded-2xl bg-surface p-6 shadow-sm transition-transform duration-200 hover:-translate-y-1 ${className}`}
    >
      <h3 className="mb-2 text-lg font-semibold text-foreground">{title}</h3>
      {children}
    </div>
  )
}