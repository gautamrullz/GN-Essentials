import { formatInventoryDate, formatInventoryMonthYear } from "./date";
export type SalesViewMode = "MONTH" | "SETTLEMENT";

export interface DateRangeResult {
  startDate: string;
  endDate: string;
  title: string;
}

const SETTLEMENT_DAY = 6;

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function getDateRange(
  mode: SalesViewMode,
  selectedDate: Date,
): DateRangeResult {
  if (mode === "MONTH") {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();

    const start = new Date(year, month, 1);

    const end = new Date(year, month + 1, 1);

    return {
      startDate: formatDate(start),
      endDate: formatDate(end),
      title: formatInventoryMonthYear(selectedDate),
    };
  }

  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();

  let start: Date;

  if (selectedDate.getDate() >= SETTLEMENT_DAY) {
    start = new Date(year, month, SETTLEMENT_DAY);
  } else {
    start = new Date(year, month - 1, SETTLEMENT_DAY);
  }

  const end = new Date(start);

  end.setMonth(end.getMonth() + 1);

  const endDisplay = new Date(end);

  endDisplay.setDate(endDisplay.getDate() - 1);

  return {
    startDate: formatDate(start),
    endDate: formatDate(end),
    title: `${formatInventoryDate(start)} → ${formatInventoryDate(endDisplay)}`,
  };
}

export function previousPeriod(mode: SalesViewMode, current: Date): Date {
  const next = new Date(current);

  next.setMonth(next.getMonth() - 1);

  return next;
}

export function nextPeriod(mode: SalesViewMode, current: Date): Date {
  const next = new Date(current);

  next.setMonth(next.getMonth() + 1);

  return next;
}
