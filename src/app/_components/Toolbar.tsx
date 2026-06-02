"use client";

import {AddButton, InputIcon} from ".";
import React from "react";
import {faSearch} from "@fortawesome/free-solid-svg-icons";
import {useTranslations} from "@/app/_hooks/useTranslations";

type Props = {
  title: string,
  newUrl?: string
  searchValue: string
  showAdd?: boolean
  onSearch?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function Toolbar({title, onSearch, newUrl, searchValue, showAdd = true}: Props) {
  const t = useTranslations();

  return (
    <div className="grid xs:grid-cols-1 grid-cols-5 gap-2">
      <h1 className="text-3xl text-foreground">{title}</h1>
      <InputIcon className={"col-span-3"}
                 onChange={onSearch}
                 icon={faSearch}
                 placeholder={t("common.search")}
                 value={searchValue}
      />
      {showAdd && newUrl ? <AddButton url={newUrl}/> : null}
    </div>
  )
}
