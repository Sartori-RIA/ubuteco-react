"use client"

import {useState} from "react";
import {Input, Label} from "@/app/_components";

type Props = {
  onCreate: (name: string) => Promise<void>
}

export function CreateWineStyleRow({onCreate}: Props) {
  const [value, setValue] = useState("")

  const handleSubmit = async () => {
    const name = value.trim()
    if (!name) return

    await onCreate(name)
    setValue("")
  }

  return (
    <Label label={"Add a new Style"}>
      <Input
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={e => {
          if (e.key === "Enter") handleSubmit()
          if (e.key === "Escape") setValue("")
        }}
      />
    </Label>
  )
}
