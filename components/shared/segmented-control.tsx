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
}

export function SegmentedControl<T extends string>({
  value,
  onValueChange,
  options,
  className,
}: SegmentedControlProps<T>) {
  return (
    <div
      className={cn("inline-flex rounded-lg border bg-muted/30 p-1", className)}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onValueChange(option.value)}
          className={cn(
            "min-w-28 rounded-md px-4 mx-1 py-2 text-sm font-medium transition-all duration-200 ",
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
