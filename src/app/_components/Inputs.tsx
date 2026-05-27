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
  id?: string,
  value?: string | number,
  step?: string | number,
  placeholder?: string,
  className?: string,
  accept?: string,
  type?: string;
  name?: string;
  required?: boolean;
  autoFocus?: boolean;
  min?: number;
  max?: number;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

export function Input(props: InputProps) {
  return (<input
    {...props}
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
     ${props.className || ""}
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

export function Textarea(props: TextAreaProps) {
  return (<textarea
    {...props}
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
     ${props.className}
    `}/>)
}


export function InlineInput(props: InputProps) {
  return (
    <input
      {...props}
      spellCheck={false}
      className={`
        w-full
        text-sm
        font-medium

        bg-transparent
        outline-none
        border-none
        rounded-md

        px-1
        py-0.5

        transition-all
        duration-150

        placeholder:text-muted-foreground/60

        hover:bg-muted/30

        disabled:opacity-50
        disabled:cursor-not-allowed

        ${props.className}
      `}
    />
  )
}

