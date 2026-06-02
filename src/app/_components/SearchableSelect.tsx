"use client";

import {useEffect, useId, useMemo, useRef, useState} from "react";

export type SearchableSelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
  searchText?: string;
};

type SearchableSelectProps = {
  name?: string;
  value: string;
  onChange: (value: string) => void;
  options: SearchableSelectOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  loading?: boolean;
  loadingMessage?: string;
  disabled?: boolean;
  className?: string;
  /** Label shown when value is set but the option is not in the current list. */
  selectedLabel?: string;
  /** When set, query changes are delegated to the parent (server-side search). */
  onQueryChange?: (query: string) => void;
  /** Client-side filter; ignored when `onQueryChange` is provided. */
  filterLocally?: boolean;
};

const fieldClassName = `
  w-full
  rounded-xl
  border
  border-gray-200
  bg-surface
  py-2.5
  px-4
  text-sm
  text-foreground
  outline-none
  focus:border-blue-500
  focus:ring-2
  focus:ring-blue-100
  dark:border-border
  dark:focus:ring-blue-900
`;

export function SearchableSelect({
  name,
  value,
  onChange,
  options,
  placeholder,
  searchPlaceholder,
  emptyMessage = "No results",
  loading = false,
  loadingMessage = "Loading…",
  disabled = false,
  className = "",
  selectedLabel,
  onQueryChange,
  filterLocally = true,
}: SearchableSelectProps) {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const serverSearch = Boolean(onQueryChange);

  const selected = options.find((option) => option.value === value);

  const filtered = useMemo(() => {
    if (serverSearch || !filterLocally) return options;
    const normalized = query.trim().toLowerCase();
    if (!normalized) return options;
    return options.filter((option) => {
      const haystack = `${option.label} ${option.searchText ?? ""}`.toLowerCase();
      return haystack.includes(normalized);
    });
  }, [options, query, serverSearch, filterLocally]);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setQuery("");
        onQueryChange?.("");
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [open, onQueryChange]);

  const selectOption = (option: SearchableSelectOption) => {
    onChange(option.value);
    setOpen(false);
    setQuery("");
    inputRef.current?.blur();
  };

  const displayValue = open ? query : (selected?.label ?? selectedLabel ?? "");

  const listContent = loading ? (
    <li className="px-4 py-2 text-sm text-muted">{loadingMessage}</li>
  ) : filtered.length === 0 ? (
    <li className="px-4 py-2 text-sm text-muted">{emptyMessage}</li>
  ) : (
    filtered.map((option) => (
      <li key={option.value} role="option" aria-selected={option.value === value}>
        <button
          type="button"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => selectOption(option)}
          className={`w-full px-4 py-2 text-left text-sm transition ${
            option.disabled
              ? "text-muted hover:bg-surface-muted"
              : option.value === value
                ? "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300"
                : "text-foreground hover:bg-surface-muted"
          }`}
        >
          {option.label}
        </button>
      </li>
    ))
  );

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      {name && value ? <input type="hidden" name={name} value={value}/> : null}

      <input
        ref={inputRef}
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        disabled={disabled}
        placeholder={open ? searchPlaceholder ?? placeholder : placeholder}
        value={displayValue}
        className={fieldClassName}
        onFocus={() => {
          if (disabled) return;
          setOpen(true);
          setQuery("");
          onQueryChange?.("");
        }}
        onChange={(event) => {
          const next = event.target.value;
          setQuery(next);
          if (!open) setOpen(true);
          if (value) onChange("");
          onQueryChange?.(next);
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            setOpen(false);
            setQuery("");
            onQueryChange?.("");
            inputRef.current?.blur();
          }
          if (event.key === "Enter" && open && !loading) {
            event.preventDefault();
            const first = filtered.find((option) => !option.disabled);
            if (first) selectOption(first);
          }
        }}
      />

      {open && !disabled && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-20 mt-1 max-h-56 w-full overflow-y-auto rounded-xl border border-border bg-surface py-1 shadow-lg"
        >
          {listContent}
        </ul>
      )}
    </div>
  );
}
