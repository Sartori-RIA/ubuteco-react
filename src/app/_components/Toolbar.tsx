import {AddButton, SearchInput} from ".";
import React from "react";

type Props = {
  title: string,
  newUrl: string
  onSearch?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function Toolbar({title, onSearch, newUrl}: Props) {
  return (
    <div className="grid xs:grid-cols-1 grid-cols-5 gap-2">
      <h1 className="text-3xl">{title}</h1>
      <SearchInput className={"col-span-3"} onChange={onSearch}/>
      <AddButton url={newUrl}/>
    </div>
  )
}