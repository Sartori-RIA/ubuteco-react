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
      className={`bg-white p-6 rounded-2xl shadow-sm transition-transform duration-200 hover:-translate-y-1 ${className}`}
    >
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      {children}
    </div>
  )
}