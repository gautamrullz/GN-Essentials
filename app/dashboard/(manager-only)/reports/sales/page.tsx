"use client";

import { useEffect, useState } from "react";

import { toast } from "sonner";

import { PageHeader } from "@/components/layout/page-header";
import { SharedSkeleton } from "@/components/shared/table-skeleton";
import { EmptyState } from "@/components/crud/empty-state";
import { DailySalesModal } from "@/components/modals/daily-sales-modal";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { SegmentedControl } from "@/components/shared/segmented-control";

import {
  SalesViewMode,
  getDateRange,
  previousPeriod,
  nextPeriod,
} from "@/lib/utils/date-range";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  getDailySales,
  createDailySale,
  updateDailySale,
  getLifetimeSalesSummary,
} from "@/lib/services/daily-sales";

import { formatInventoryDate } from "@/lib/utils/date";

import { DailySale } from "@/types/daily-sales";

import { DailySalesFormValues } from "@/lib/validations/daily-sales";
import { ChevronLeft, ChevronRight, Eye, EyeOff } from "lucide-react";

export default function SalesRecordsPage() {
  const [sales, setSales] = useState<DailySale[]>([]);

  const summary = sales.reduce(
    (acc, sale) => {
      acc.total_sales += Number(sale.total_amount);
      acc.total_cash += Number(sale.cash_amount);
      acc.total_online += Number(sale.online_amount);
      acc.total_other += Number(sale.other_amount);
      acc.days_recorded++;

      return acc;
    },
    {
      total_sales: 0,
      total_cash: 0,
      total_online: 0,
      total_other: 0,
      days_recorded: 0,
    },
  );

  const [lifetimeSummary, setLifetimeSummary] = useState({
    total_sales: 0,
    total_cash: 0,
    total_online: 0,
    total_other: 0,
    days_recorded: 0,
    first_sale_date: null as string | null,
  });

  const [selectedSale, setSelectedSale] = useState<DailySale>();

  const [pageLoading, setPageLoading] = useState(true);
  const [monthLoading, setMonthLoading] = useState(false);

  const [open, setOpen] = useState(false);

  const [search, setSearch] = useState("");

  const [selectedDate, setSelectedDate] = useState(new Date());

  const [viewMode, setViewMode] = useState<SalesViewMode>("MONTH");

  const [showOverallSales, setShowOverallSales] = useState(false);

  const dateRange = getDateRange(viewMode, selectedDate);

  async function loadData() {
    const salesData = await getDailySales(
      dateRange.startDate,
      dateRange.endDate,
    );

    setSales(salesData);
  }

  useEffect(() => {
    async function fetchInitialData() {
      setPageLoading(true);
      try {
        await Promise.all([
          loadData(),
          getLifetimeSalesSummary().then(setLifetimeSummary),
        ]);
        const lifetimeData = await getLifetimeSalesSummary();

        setLifetimeSummary(lifetimeData);
      } finally {
        setPageLoading(false);
      }
    }

    void fetchInitialData();
  }, []);

  useEffect(() => {
    if (pageLoading) return;

    async function fetchMonthData() {
      setMonthLoading(true);

      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [_, lifetimeData] = await Promise.all([
          loadData(),
          getLifetimeSalesSummary(),
        ]);

        setLifetimeSummary(lifetimeData);
      } finally {
        setMonthLoading(false);
      }
    }

    void fetchMonthData();
  }, [selectedDate, viewMode]);

  async function handleSubmit(values: DailySalesFormValues) {
    try {
      if (selectedSale) {
        await updateDailySale(selectedSale.id, values);

        toast.success("Daily sale updated successfully");
      } else {
        await createDailySale(values);

        toast.success("Daily sale added successfully");
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_, lifetimeData] = await Promise.all([
        loadData(),
        getLifetimeSalesSummary(),
      ]);

      setLifetimeSummary(lifetimeData);

      setSelectedSale(undefined);

      setOpen(false);
    } catch (error) {
      console.error(error);

      toast.error("Failed to save daily sale");
    }
  }

  const filteredSales = sales.filter((sale) => {
    const value = search.toLowerCase();

    return (
      sale.sale_date.toLowerCase().includes(value) ||
      (sale.notes ?? "").toLowerCase().includes(value)
    );
  });

  function previousMonth() {
    setSelectedDate((current) => previousPeriod(viewMode, current));
  }

  function nextMonth() {
    setSelectedDate((current) => nextPeriod(viewMode, current));
  }

  function isCurrentMonth() {
    if (viewMode === "SETTLEMENT") {
      return false;
    }

    const now = new Date();

    return (
      selectedDate.getMonth() === now.getMonth() &&
      selectedDate.getFullYear() === now.getFullYear()
    );
  }

  if (pageLoading) {
    return <SharedSkeleton />;
  }

  return (
    <>
      <PageHeader
        title="Sales Records"
        description="Track daily sales collections"
        action={
          <Button
            onClick={() => {
              setSelectedSale(undefined);
              setOpen(true);
            }}
          >
            Add Sale
          </Button>
        }
      />{" "}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5 mb-2">
        <div className="rounded-md border p-4">
          <p className="text-sm text-muted-foreground">Total Sales</p>

          <p className="mt-2 text-1xl font-bold">
            ₹{summary.total_sales.toFixed(2)}
          </p>
        </div>

        <div className="rounded-md border p-4">
          <p className="text-sm text-muted-foreground">Cash</p>

          <p className="mt-2 text-1xl font-bold">
            ₹{summary.total_cash.toFixed(2)}
          </p>
        </div>

        <div className="rounded-md border p-4">
          <p className="text-sm text-muted-foreground">Online</p>

          <p className="mt-2 text-1xl font-bold">
            ₹{summary.total_online.toFixed(2)}
          </p>
        </div>

        <div className="rounded-md border p-4 ">
          <p className="text-sm text-muted-foreground">Days Recorded</p>

          <p className="mt-2 text-1xl font-bold">{summary.days_recorded}</p>
        </div>

        <div className="rounded-md border p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Overall Sales</p>

            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setShowOverallSales((value) => !value)}
            >
              {showOverallSales ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>

          <p className="mt-2 text-xl font-bold">
            {showOverallSales
              ? `₹${lifetimeSummary.total_sales.toFixed(2)}`
              : "₹ XXXXXXXX"}
          </p>
        </div>
      </div>
      <div className="w-full sm:flex sm:justify-end p-5">
        <SegmentedControl
          value={viewMode}
          onValueChange={(value) => {
            setViewMode(value as SalesViewMode);
            setSelectedDate(new Date());
          }}
          options={[
            {
              label: "Monthly",
              value: "MONTH",
            },
            {
              label: "Cycle",
              value: "SETTLEMENT",
            },
          ]}
        />
      </div>
      <div className="mb-4 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <Input
          placeholder="Search notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full lg:max-w-md"
        />

        <div className="flex items-center justify-center gap-4 rounded-md border px-4 py-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={previousMonth}
            disabled={monthLoading}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <div className="min-w-52 text-center">
            <p className="text-sm font-semibold">{dateRange.title}</p>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={nextMonth}
            disabled={
              monthLoading || (viewMode === "MONTH" && isCurrentMonth())
            }
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>

              <TableHead className="hidden md:table-cell">Cash</TableHead>

              <TableHead className="hidden md:table-cell">Online</TableHead>

              <TableHead className="hidden lg:table-cell">Other</TableHead>

              <TableHead className="hidden md:table-cell">Total</TableHead>

              <TableHead className="hidden lg:table-cell">Notes</TableHead>

              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {" "}
            {filteredSales.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7}>
                  <EmptyState title="No sales records found" />
                </TableCell>
              </TableRow>
            ) : (
              filteredSales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {formatInventoryDate(sale.sale_date)}
                      </div>

                      <div className="mt-2 space-y-1 text-xs text-muted-foreground md:hidden">
                        <div>Cash: ₹{sale.cash_amount.toFixed(2)}</div>

                        <div>Online: ₹{sale.online_amount.toFixed(2)}</div>

                        {sale.other_amount > 0 && (
                          <div>Other: ₹{sale.other_amount.toFixed(2)}</div>
                        )}

                        <div className="font-medium text-foreground">
                          Total: ₹{sale.total_amount.toFixed(2)}
                        </div>

                        {sale.notes && (
                          <div className="line-clamp-2">
                            Notes: {sale.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="hidden md:table-cell">
                    ₹{sale.cash_amount.toFixed(2)}
                  </TableCell>

                  <TableCell className="hidden md:table-cell">
                    ₹{sale.online_amount.toFixed(2)}
                  </TableCell>

                  <TableCell className="hidden lg:table-cell">
                    ₹{sale.other_amount.toFixed(2)}
                  </TableCell>

                  <TableCell className="hidden md:table-cell font-semibold">
                    ₹{sale.total_amount.toFixed(2)}
                  </TableCell>

                  <TableCell className="hidden lg:table-cell">
                    {sale.notes || "-"}
                  </TableCell>

                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedSale(sale);
                        setOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>{" "}
      <DailySalesModal
        open={open}
        onOpenChange={(value) => {
          setOpen(value);

          if (!value) {
            setSelectedSale(undefined);
          }
        }}
        sale={selectedSale}
        onSubmit={handleSubmit}
      />
    </>
  );
}
