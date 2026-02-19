"use client"

import {motion} from "motion/react"


type Props = {
  children: React.ReactNode
  onClose: () => void
}

export default function ModalWrapper({
                                       children,
                                       onClose
                                     }: Props) {

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <motion.div
        className="absolute inset-0 bg-black/50"
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        exit={{opacity: 0}}
        onClick={onClose}
      />

      <motion.div
        className="relative bg-white p-6 rounded-xl w-[500px] shadow-xl"
        initial={{scale: 0.95, opacity: 0}}
        animate={{scale: 1, opacity: 1}}
        exit={{scale: 0.95, opacity: 0}}
        transition={{duration: 0.2}}
      >
        {children}
      </motion.div>
    </div>
  )
}
