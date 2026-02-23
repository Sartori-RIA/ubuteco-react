"use client"

import {BeerStyle} from "@/app/_types";
import {useState} from "react";
import {DestroyButton, EditButton, InlineInput} from "@/app/_components";

type Props = {
  style: BeerStyle
  onRename: (id: number, name: string) => Promise<void>
  onDelete: (id: number) => void
}

export function BeerStyleRow({ style, onRename, onDelete }: Props) {
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(style.name)

  const save = async () => {
    const name = value.trim()
    if (!name) return
    if (style.name === name) {
      setIsEditing(false)
      return
    }

    await onRename(Number(style.id), name)
    setIsEditing(false)
  }

  return (
    <li
      className={`
    group
    flex
    items-center
    justify-between
    px-4
    py-3
    w-full
    relative
    transition-all
    duration-200
    ease-out

    ${
        isEditing
          ? "z-10 bg-muted/60 ring-3 ring-primary/30 shadow-lg rounded-lg will-change-transform transition-all duration-200 ease-out"
          : "hover:bg-muted/40"
      }
  `}
    >
      <div className="flex items-center gap-3 w-full">
        <div className="size-2 rounded-full bg-muted-foreground/40 shrink-0" />

        {isEditing ? (
          <InlineInput
            autoFocus
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter") save()
              if (e.key === "Escape") {
                setValue(style.name)
                setIsEditing(false)
              }
            }}
            onBlur={save}
          />
        ) : (
          <span className="text-sm font-medium">{style.name}</span>
        )}
      </div>

      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
        <EditButton onClick={() => setIsEditing(true)} />
        <DestroyButton onClick={() => onDelete(Number(style.id))} />
      </div>
    </li>
  )
}
