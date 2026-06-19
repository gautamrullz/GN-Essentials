"use client";

import { useEffect, useState } from "react";

import { PageHeader } from "@/components/layout/page-header";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { getExpiringBatches } from "@/lib/services/alerts";

import { ExpiringBatch } from "@/types/alert";
import { SharedSkeleton } from "@/components/shared/table-skeleton";
import { formatInventoryDate } from "@/lib/utils/date";

export default function ExpiryPage() {
  const [batches, setBatches] = useState<ExpiringBatch[]>([]);
  const [pageLoading, setPageLoading] = useState(true);

  async function loadData() {
    setPageLoading(true);

    const data = await getExpiringBatches();

    setBatches(data);
    setPageLoading(false);
  }
  useEffect(() => {
    const fetchData = async () => {
      await loadData();
    };

    void fetchData();
  }, []);

  function getDaysLeft(expiryDate: string) {
    const today = new Date();

    const expiry = new Date(expiryDate);

    const diff = expiry.getTime() - today.getTime();

    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  if (pageLoading) {
    return <SharedSkeleton />;
  }

  return (
    <>
      <PageHeader
        title="Expiry Alerts"
        description="Batches expiring within 30 days"
      />

      <>
        {/* Mobile Cards */}
        <div className="space-y-3 md:hidden">
          {batches.length === 0 ? (
            <div className="rounded-lg border bg-card p-4 text-center text-muted-foreground">
              No expiring batches
            </div>
          ) : (
            batches.map((batch) => {
              const daysLeft = getDaysLeft(batch.expiry_date);

              return (
                <div key={batch.id} className="rounded-lg border bg-card p-4">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <p className="min-w-0 flex-1 wrap-break-words font-medium">
                      {batch.products?.name}
                    </p>

                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        daysLeft <= 7
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {daysLeft} Days
                    </span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Batch</span>

                      <span>{batch.batch_number}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Expiry Date</span>

                      <span>{formatInventoryDate(batch.expiry_date)}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Desktop Table */}
        <div className="hidden rounded-md border md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>

                <TableHead>Batch</TableHead>

                <TableHead>Expiry Date</TableHead>

                <TableHead>Days Left</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {batches.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No expiring batches
                  </TableCell>
                </TableRow>
              ) : (
                batches.map((batch) => (
                  <TableRow key={batch.id}>
                    <TableCell>{batch.products?.name}</TableCell>

                    <TableCell>{batch.batch_number}</TableCell>

                    <TableCell>
                      {formatInventoryDate(batch.expiry_date)}
                    </TableCell>

                    <TableCell>{getDaysLeft(batch.expiry_date)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </>
    </>
  );
}
