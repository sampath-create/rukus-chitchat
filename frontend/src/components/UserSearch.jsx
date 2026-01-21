import { useEffect, useState } from "react";
import { SearchIcon, XIcon } from "lucide-react";

/**
 * Simple debounced search input.
 * Props:
 * - value: string
 * - onChange: (value: string) => void
 * - onDebouncedChange: (value: string) => void
 */
export default function UserSearch({ value, onChange, onDebouncedChange }) {
  const [localValue, setLocalValue] = useState(value || "");

  useEffect(() => {
    setLocalValue(value || "");
  }, [value]);

  useEffect(() => {
    const t = setTimeout(() => {
      onDebouncedChange?.(localValue);
    }, 350);

    return () => clearTimeout(t);
  }, [localValue, onDebouncedChange]);

  return (
    <div className="px-4 pt-3">
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4a2c1c]/60" />
        <input
          value={localValue}
          onChange={(e) => {
            const v = e.target.value;
            setLocalValue(v);
            onChange?.(v);
          }}
          placeholder="Search by name or email..."
          className="w-full input bg-white pl-9 pr-9"
          type="text"
          autoComplete="off"
        />
        {localValue?.length > 0 && (
          <button
            type="button"
            onClick={() => {
              setLocalValue("");
              onChange?.("");
              onDebouncedChange?.("");
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4a2c1c]/60 hover:text-[#4a2c1c]"
            aria-label="Clear search"
          >
            <XIcon className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
