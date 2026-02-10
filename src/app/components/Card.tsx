"use client"

import {motion} from "framer-motion";
import {ReactNode} from "react";


type CardProps = {
  title: string;
  className?: string;
  children: ReactNode;
}

export function Card({title, children, className}: CardProps) {
  return (<motion.div
    whileHover={{y: -4}}
    className={`bg-white p-6 rounded-2xl shadow-sm ${className}`}>
    <h3 className="font-semibold text-lg mb-2">{title}</h3>
    {children}
  </motion.div>)
}