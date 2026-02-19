import {AddButton, InputIcon} from ".";
import React from "react";
import {faSearch} from "@fortawesome/free-solid-svg-icons";

type Props = {
  title: string,
  newUrl: string
  searchValue: string
  onSearch?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function Toolbar({title, onSearch, newUrl, searchValue}: Props) {
  return (
    <div className="grid xs:grid-cols-1 grid-cols-5 gap-2">
      <h1 className="text-3xl">{title}</h1>
      <InputIcon className={"col-span-3"}
                 onChange={onSearch}
                 icon={faSearch}
                 placeholder="Search..."
                 value={searchValue}
      />
      <AddButton url={newUrl}/>
    </div>
  )
}