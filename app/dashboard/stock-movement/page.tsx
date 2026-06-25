"use client";

import { useEffect, useMemo, useState } from "react";

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
import { formatInventoryDate } from "@/lib/utils/date";
import { ExpiryBadge } from "@/components/crud/expiry-badge";

export default function StockMovementPage() {
  const [batches, setBatches] = useState<BatchWithRelations[]>([]);

  const [selectedBatchId, setSelectedBatchId] = useState("");

  const [selectedBatch, setSelectedBatch] = useState<BatchDetails | null>(null);

  const [transactionType, setTransactionType] =
    useState<TransactionType>("SALE");

  const [quantity, setQuantity] = useState(0);

  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);

  const [sellingBatchId, setSellingBatchId] = useState("");

  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const [searchTerm, setSearchTerm] = useState("");

  const [inventoryTypeFilter, setInventoryTypeFilter] = useState<
    "STANDARD" | "FAST_MOVING"
  >("STANDARD");

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

  const filteredBatches = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return batches.filter((batch) => {
      const matchesSearch =
        !term ||
        batch.products?.name.toLowerCase().includes(term) ||
        batch.batch_number.toLowerCase().includes(term);

      const matchesInventory =
        batch.products?.inventory_type === inventoryTypeFilter;

      const hasStock = batch.quantity > 0 && batch.status === "ACTIVE";

      return matchesSearch && matchesInventory && hasStock;
    });
  }, [batches, searchTerm, inventoryTypeFilter]);

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

      toast.success("Sale recorded");

      await loadBatches();

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

  function getQuantity(batchId: string) {
    return quantities[batchId] ?? 1;
  }

  function increaseQuantity(batch: BatchWithRelations) {
    console.log("Increase clicked", batch.id);

    const current = getQuantity(batch.id);

    if (current >= batch.quantity) {
      return;
    }

    setQuantities((prev) => ({
      ...prev,
      [batch.id]: current + 1,
    }));
  }

  function decreaseQuantity(batchId: string) {
    const current = getQuantity(batchId);

    if (current <= 1) {
      return;
    }

    setQuantities((prev) => ({
      ...prev,
      [batchId]: current - 1,
    }));
  }

  async function handleFastMovingSale(batch: BatchWithRelations) {
    try {
      setSellingBatchId(batch.id);

      await createStockMovement({
        batch_id: batch.id,
        transaction_type: "SALE",
        quantity: getQuantity(batch.id),
      });

      toast.success(`Sold ${getQuantity(batch.id)} × ${batch.products?.name}`);

      setQuantities((prev) => ({
        ...prev,
        [batch.id]: 1,
      }));

      await loadBatches();
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to record sale");
      }
    } finally {
      setSellingBatchId("");
    }
  }

  return (
    <>
      <PageHeader
        title="Stock Movement"
        description="Manage inventory movements"
      />

      <div className="mb-6 flex justify-center">
        <div className="flex rounded-lg border p-1">
          <Button
            type="button"
            size="default"
            className="min-w-36"
            variant={inventoryTypeFilter === "STANDARD" ? "default" : "ghost"}
            onClick={() => {
              setInventoryTypeFilter("STANDARD");
              setSelectedBatch(null);
              setSelectedBatchId("");
              setSearchTerm("");
            }}
          >
            Standard
          </Button>

          <Button
            type="button"
            size="default"
            className="min-w-36"
            variant={
              inventoryTypeFilter === "FAST_MOVING" ? "default" : "ghost"
            }
            onClick={() => {
              setInventoryTypeFilter("FAST_MOVING");
              setSelectedBatch(null);
              setSelectedBatchId("");
              setSearchTerm("");
            }}
          >
            Fast Moving
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {inventoryTypeFilter === "STANDARD" && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Batch Information</CardTitle>
              </CardHeader>

              <CardContent>
                {!selectedBatch ? (
                  <p className="text-muted-foreground">
                    Search and select a product batch
                  </p>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Product</span>

                      <span className="font-medium">
                        {selectedBatch.products?.name}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Batch</span>

                      <span>{selectedBatch.batch_number}</span>
                    </div>

                    <div className="rounded-md border p-4">
                      <p className="text-sm text-muted-foreground">
                        Current Stock
                      </p>

                      <p className="text-3xl font-bold">
                        {selectedBatch.quantity}
                      </p>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Expiry</span>

                      <span>
                        {formatInventoryDate(selectedBatch.expiry_date)}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Purchase Price
                      </span>

                      <span>
                        ₹{selectedBatch.products?.purchase_price ?? 0}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Selling Price
                      </span>

                      <span>₹{selectedBatch.products?.selling_price ?? 0}</span>
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
                  <label className="mb-2 block text-sm font-medium">
                    Search Product
                  </label>

                  <Input
                    placeholder="Search by product name or batch number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {searchTerm.trim() && (
                  <div className="mt-2 max-h-64 overflow-y-auto rounded-md border">
                    {filteredBatches.length === 0 ? (
                      <div className="p-3 text-sm text-muted-foreground">
                        No matching products found
                      </div>
                    ) : (
                      filteredBatches.slice(0, 15).map((batch) => (
                        <button
                          key={batch.id}
                          type="button"
                          onClick={() => {
                            void handleBatchChange(batch.id);

                            setSearchTerm("");
                          }}
                          className="w-full border-b p-3 text-left transition-colors hover:bg-muted last:border-b-0"
                        >
                          <div className="font-medium">
                            {batch.products?.name}
                          </div>

                          <div className="mt-1 text-xs text-muted-foreground">
                            Batch: {batch.batch_number}
                          </div>

                          <div className="text-xs text-muted-foreground">
                            Stock: {batch.quantity}
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                )}

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Batch
                  </label>

                  <Select
                    value={selectedBatchId}
                    onValueChange={handleBatchChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Batch" />
                    </SelectTrigger>

                    <SelectContent>
                      {filteredBatches.map((batch) => (
                        <SelectItem key={batch.id} value={batch.id}>
                          {batch.products?.name}
                          {" • "}
                          Stock: {batch.quantity}
                          {" • "}
                          {batch.batch_number}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <p className="mt-2 text-xs text-muted-foreground">
                    Showing {filteredBatches.length} batch(es)
                  </p>
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
                  <label className="mb-2 block text-sm font-medium">
                    Quantity
                  </label>

                  <Input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Notes
                  </label>

                  <Input
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? "Saving..." : "Save Movement"}
                </Button>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <div>
        {inventoryTypeFilter === "FAST_MOVING" && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Fast Moving Sales</CardTitle>
              </CardHeader>

              <CardContent className="space-y-2">
                <Input
                  placeholder="Search product..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />

                {filteredBatches.length === 0 ? (
                  <div className="rounded-md border border-dashed py-12 text-center text-muted-foreground">
                    No active fast moving batches found.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-2 lg:grid-cols-2 xl:grid-cols-3">
                    {filteredBatches.map((batch) => (
                      <Card
                        key={batch.id}
                        className="transition-all hover:shadow-md"
                      >
                        <CardContent className="space-y-1">
                          <div>
                            <h3 className="text-base font-semibold leading-none">
                              {batch.products?.name}
                            </h3>

                            <p className="text-xs text-muted-foreground">
                              {batch.batch_number}
                            </p>
                          </div>

                          <div className="flex items-center justify-between rounded-md border bg-muted/40 px-3 py-2">
                            <div>
                              <p className="text-[11px] text-muted-foreground">
                                Stock
                              </p>

                              <p className="text-xl font-bold">
                                {batch.quantity}
                              </p>
                            </div>

                            <div className="text-right">
                              <ExpiryBadge expiryDate={batch.expiry_date} />
                              <div>
                                {formatInventoryDate(batch.expiry_date)}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 pt-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => decreaseQuantity(batch.id)}
                            >
                              -
                            </Button>

                            <div className="flex h-8 w-10 items-center justify-center rounded-md border text-sm font-semibold">
                              {getQuantity(batch.id)}
                            </div>

                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => increaseQuantity(batch)}
                            >
                              +
                            </Button>

                            <Button
                              size="sm"
                              className="ml-auto h-8 px-4"
                              disabled={
                                sellingBatchId === batch.id ||
                                batch.quantity === 0
                              }
                              onClick={() => void handleFastMovingSale(batch)}
                            >
                              {sellingBatchId === batch.id
                                ? "Selling..."
                                : "Sell"}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </>
  );
}
