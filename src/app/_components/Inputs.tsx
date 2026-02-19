import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {IconProp} from "@fortawesome/fontawesome-svg-core";

type InputIconProps = InputProps & {
  icon: IconProp
}

export function InputIcon({className, onChange, value, icon, placeholder}: InputIconProps) {
  return <div className={`relative w-full ${className}`}>
    <FontAwesomeIcon
      icon={icon}
      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
    />

    <Input placeholder={placeholder} value={value} onChange={onChange}/>
  </div>
}

type InputProps = {
  value?: string | number,
  step?: string | number,
  placeholder?: string,
  className?: string,
  accept?: string,
  type?: string;
  name?: string;
  required?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

export function Input({step, required, name, accept, className, onChange, value, placeholder, type, onKeyDown}: InputProps) {
  return (<input
    type={type || 'text'}
    placeholder={placeholder}
    onChange={onChange}
    onKeyDown={onKeyDown}
    value={value}
    step={step}
    name={name}
    accept={accept}
    required={required}
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
  />)
}

type TextAreaProps = {
  className?: string,
  name?: string,
  rows?: number,
  value?: string | number,
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
}

export function Textarea({rows, name, value, className, onChange}: TextAreaProps) {
  return (<textarea
    name={name}
    rows={rows}
    value={value}
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
     ${className}
    `}  />)
}