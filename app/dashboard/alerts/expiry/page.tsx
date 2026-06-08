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

export default function ExpiryPage() {
  const [batches, setBatches] = useState<ExpiringBatch[]>([]);

  async function loadData() {
    const data = await getExpiringBatches();

    setBatches(data);
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

  return (
    <>
      <PageHeader
        title="Expiry Alerts"
        description="Batches expiring within 30 days"
      />

      <div className="rounded-md border">
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

                  <TableCell>{batch.expiry_date}</TableCell>

                  <TableCell>{getDaysLeft(batch.expiry_date)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
