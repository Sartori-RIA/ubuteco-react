import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSearch} from "@fortawesome/free-solid-svg-icons";

export function SearchInput({className, onChange}: {
  className?: string,
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
  return <div className={`relative w-full ${className}`}>
    <FontAwesomeIcon
      icon={faSearch}
      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
    />

    <input
      type="text"
      placeholder="Search..."
      onChange={onChange}
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