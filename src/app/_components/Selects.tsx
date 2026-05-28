type SelectProps = {
  name: string
  value: number | string | undefined
  onChange: (value: string) => void
  className?: string
  disabled?: boolean
  children: React.ReactNode
}

export function Select({name, className, value, onChange, disabled, children}: SelectProps) {
  return <select name={name}
                 disabled={disabled}
                 value={value ?? ""}
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
     ${className}
    `}
                 onChange={(e) => onChange(e.target.value)}
  >
    {children}
  </select>;
}