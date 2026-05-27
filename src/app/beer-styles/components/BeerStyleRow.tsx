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
          ? "z-10 bg-muted/60 ring-2 ring-primary/30 rounded-lg"
          : "hover:bg-muted/40"
      }
  `}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div className="size-2 shrink-0 rounded-full bg-muted-foreground/40" />

        {isEditing ? (
          <div className="min-w-0 flex-1">
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
          </div>
        ) : (
          <span className="min-w-0 flex-1 truncate text-sm font-medium">{style.name}</span>
        )}
      </div>

      {!isEditing && (
        <div className="flex shrink-0 gap-1 opacity-0 transition group-hover:opacity-100">
          <EditButton onClick={() => setIsEditing(true)} />
          <DestroyButton onClick={() => onDelete(Number(style.id))} />
        </div>
      )}
    </li>
  )
}
