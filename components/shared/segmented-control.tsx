"use client";

import { cn } from "@/lib/utils";

interface SegmentedControlOption<T extends string> {
  label: string;
  value: T;
}

interface SegmentedControlProps<T extends string> {
  value: T;
  onValueChange: (value: T) => void;
  options: SegmentedControlOption<T>[];
  className?: string;
  fullWidth?: boolean;
}

export function SegmentedControl<T extends string>({
  value,
  onValueChange,
  options,
  className,
  fullWidth = false,
}: SegmentedControlProps<T>) {
  return (
    <div
      className={cn(
        fullWidth ? "flex w-full" : "inline-flex",
        "gap-1 rounded-lg border bg-muted/30 p-1",
        className,
      )}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onValueChange(option.value)}
          className={cn(
            fullWidth && "flex-1",
            "rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-violet-300",
            value === option.value
              ? "bg-violet-200 text-violet-900 shadow-sm"
              : "text-slate-600 hover:bg-violet-50 hover:text-violet-800",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}