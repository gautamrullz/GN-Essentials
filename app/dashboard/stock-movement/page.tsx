"use client";

import { useEffect, useState } from "react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { PageHeader } from "@/components/layout/page-header";

import { getBatches, getBatchById } from "@/lib/services/batches";

import { createStockMovement } from "@/lib/services/stock-movement";

import { BatchDetails, BatchWithRelations } from "@/types/batch";

import { TRANSACTION_TYPES, TransactionType } from "@/types/stock-movement";

export default function StockMovementPage() {
  const [batches, setBatches] = useState<BatchWithRelations[]>([]);

  const [selectedBatchId, setSelectedBatchId] = useState("");

  const [selectedBatch, setSelectedBatch] = useState<BatchDetails | null>(null);

  const [transactionType, setTransactionType] =
    useState<TransactionType>("SALE");

  const [quantity, setQuantity] = useState<number>(0);

  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);

  async function loadBatches() {
    const data = await getBatches();

    setBatches(data ?? []);
  }

  useEffect(() => {
    const fetchData = async () => {
      await loadBatches();
    };

    void fetchData();
  }, []);

  async function handleBatchChange(batchId: string) {
    setSelectedBatchId(batchId);

    const batch = await getBatchById(batchId);

    setSelectedBatch(batch);
  }

  async function handleSubmit() {
    try {
      if (!selectedBatchId) {
        toast.error("Please select a batch");

        return;
      }

      if (quantity <= 0) {
        toast.error("Quantity must be greater than zero");

        return;
      }

      setLoading(true);

      await createStockMovement({
        batch_id: selectedBatchId,
        transaction_type: transactionType,
        quantity,
        notes,
      });

      toast.success("Stock movement recorded");

      const updatedBatch = await getBatchById(selectedBatchId);

      setSelectedBatch(updatedBatch);

      setQuantity(0);

      setNotes("");
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to save stock movement");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Stock Movement"
        description="Manage inventory movements"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Batch Information</CardTitle>
          </CardHeader>

          <CardContent>
            {!selectedBatch ? (
              <p className="text-muted-foreground">Select a batch</p>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Product</span>
                  <span>{selectedBatch.products?.name}</span>
                </div>

                <div>
                  <strong>Batch:</strong> {selectedBatch.batch_number}
                </div>

                <div className="rounded-md border p-3">
                  <p className="text-sm text-muted-foreground">Current Stock</p>

                  <p className="text-2xl font-bold">{selectedBatch.quantity}</p>
                </div>

                <div>
                  <strong>Expiry:</strong> {selectedBatch.expiry_date}
                </div>

                <div>
                  <strong>Purchase Price:</strong> ₹
                  {selectedBatch.purchase_price}
                </div>

                <div>
                  <strong>Selling Price:</strong> ₹{selectedBatch.selling_price}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Movement Details</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">Batch</label>

              <Select value={selectedBatchId} onValueChange={handleBatchChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Batch" />
                </SelectTrigger>

                <SelectContent>
                  {batches.map((batch) => (
                    <SelectItem key={batch.id} value={batch.id}>
                      {batch.batch_number}
                      {" - "}
                      {batch.products?.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Transaction Type
              </label>

              <Select
                value={transactionType}
                onValueChange={(value) =>
                  setTransactionType(value as TransactionType)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  {TRANSACTION_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Quantity</label>

              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Notes</label>

              <Input value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>

            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full"
            >
              Save Movement
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
