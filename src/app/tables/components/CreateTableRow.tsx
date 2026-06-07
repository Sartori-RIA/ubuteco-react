"use client"

import {useState} from "react";
import {Input, Label} from "@/app/_components";
import {useTranslations} from "@/app/_hooks/useTranslations";

type Props = {
  onCreate: (name: string, chairs: number) => Promise<void>
}

export function CreateTableRow({onCreate}: Props) {
  const t = useTranslations();
  const [name, setName] = useState("")
  const [chairs, setChairs] = useState("")

  const handleSubmit = async () => {
    const trimmedName = name.trim()
    const chairsCount = Number(chairs)
    if (!trimmedName || Number.isNaN(chairsCount) || chairsCount < 0) return

    await onCreate(trimmedName, chairsCount)
    setName("")
    setChairs("")
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_120px]">
      <Label label={t("tablesPage.addNew")}>
        <Input
          value={name}
          placeholder={t("tablesPage.namePlaceholder")}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit()
            if (e.key === "Escape") setName("")
          }}
        />
      </Label>
      <Label label={t("tablesPage.chairsLabel")}>
        <Input
          type="number"
          min={0}
          value={chairs}
          placeholder="0"
          onChange={(e) => setChairs(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit()
            if (e.key === "Escape") setChairs("")
          }}
        />
      </Label>
    </div>
  )
}
