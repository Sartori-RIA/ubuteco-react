"use client"

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSearch} from "@fortawesome/free-solid-svg-icons";

type Props = {
  searchValue: string
  className?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function SearchInput({className, onChange, searchValue}: Props) {
  return <div className={`relative w-full ${className}`}>
    <FontAwesomeIcon
      icon={faSearch}
      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
    />

    <input
      type="text"
      placeholder="Search..."
      onChange={onChange}
      value={searchValue}
      className={`
      w-full
      rounded-xl
      border
      border-gray-200
      bg-white
      py-2.5
      pl-10
      pr-4
      text-sm
      outline-none
      focus:border-blue-500
      focus:ring-2
      focus:ring-blue-100
     
    `}
    />
  </div>
}

export function Input({
                        label,
                        children,
                      }: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {children}
    </div>
  );
}