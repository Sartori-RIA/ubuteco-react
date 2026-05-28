"use client"

import {Table} from "@/app/_types";
import {useEffect, useState} from "react";
import Link from "next/link";
import {DestroyButton, EditButton, InlineInput} from "@/app/_components";

type Props = {
  table: Table
  onUpdate: (id: number, name: string, chairs: number) => Promise<void>
  onDelete: (id: number) => void
  readOnly?: boolean
}

export function TableRow({table, onUpdate, onDelete, readOnly = false}: Props) {
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(table.name)
  const [chairs, setChairs] = useState(String(table.chairs ?? 0))

  useEffect(() => {
    setName(table.name)
    setChairs(String(table.chairs ?? 0))
  }, [table.name, table.chairs])

  const save = async () => {
    const trimmedName = name.trim()
    const chairsCount = Number(chairs)
    if (!trimmedName || Number.isNaN(chairsCount) || chairsCount < 0) {
      setName(table.name)
      setChairs(String(table.chairs ?? 0))
      setIsEditing(false)
      return
    }

    if (table.name === trimmedName && table.chairs === chairsCount) {
      setIsEditing(false)
      return
    }

    await onUpdate(Number(table.id), trimmedName, chairsCount)
    setIsEditing(false)
  }

  const cancel = () => {
    setName(table.name)
    setChairs(String(table.chairs ?? 0))
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
        <div className="size-2 shrink-0 rounded-full bg-muted-foreground/40"/>

        {isEditing ? (
          <div className="grid min-w-0 flex-1 grid-cols-1 gap-2 sm:grid-cols-[1fr_88px]">
            <InlineInput
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") save()
                if (e.key === "Escape") cancel()
              }}
              onBlur={save}
            />
            <InlineInput
              type="number"
              min={0}
              value={chairs}
              onChange={(e) => setChairs(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") save()
                if (e.key === "Escape") cancel()
              }}
              onBlur={save}
            />
          </div>
        ) : (
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <span className="min-w-0 flex-1 truncate text-sm font-medium">{table.name}</span>
            <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
              {table.chairs} {table.chairs === 1 ? "chair" : "chairs"}
            </span>
          </div>
        )}
      </div>

      {!isEditing && (
        <div className="flex shrink-0 items-center gap-2">
          <Link
            href={`/orders/new?table_id=${table.id}`}
            className="text-xs font-medium text-blue-600 hover:text-blue-700 whitespace-nowrap"
          >
            New order
          </Link>
          {!readOnly && (
            <div className="flex gap-1 opacity-0 transition group-hover:opacity-100">
              <EditButton onClick={() => setIsEditing(true)}/>
              <DestroyButton onClick={() => onDelete(Number(table.id))}/>
            </div>
          )}
        </div>
      )}
    </li>
  )
}
