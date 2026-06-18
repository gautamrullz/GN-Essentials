"use client";

import { useEffect, useState } from "react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/crud/empty-state";
import { StatusBadge } from "@/components/crud/status-badge";

import { BatchModal } from "@/components/batches/batch-modal";

import { getBatches, createBatch, updateBatch } from "@/lib/services/batches";

import { getProducts } from "@/lib/services/products";
import { getSuppliers } from "@/lib/services/suppliers";

import { Batch, BatchWithRelations } from "@/types/batch";

import { Product } from "@/types/product";
import { Supplier } from "@/types/supplier";

import { BatchFormValues } from "@/lib/validations/batch";
import { ExpiryBadge } from "@/components/crud/expiry-badge";
import { Switch } from "@/components/ui/switch";
import { SharedSkeleton } from "@/components/shared/table-skeleton";

export default function BatchesPage() {
  const [batches, setBatches] = useState<BatchWithRelations[]>([]);

  const [products, setProducts] = useState<Product[]>([]);

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  const [search, setSearch] = useState("");

  const [open, setOpen] = useState(false);

  const [selectedBatch, setSelectedBatch] = useState<Batch>();

  const [showActiveOnly, setShowActiveOnly] = useState(true);

  const [pageLoading, setPageLoading] = useState(true);

  async function loadData() {
    setPageLoading(true);
    const [batchData, productData, supplierData] = await Promise.all([
      getBatches(),
      getProducts(),
      getSuppliers(),
    ]);

    setBatches(batchData ?? []);

    setProducts(productData ?? []);

    setSuppliers(supplierData ?? []);
    setPageLoading(false);
  }

  useEffect(() => {
    const fetchData = async () => {
      await loadData();
    };

    void fetchData();
  }, []);

  async function handleSubmit(values: BatchFormValues) {
    console.log("Submitting batch:", values);
    try {
      if (selectedBatch) {
        await updateBatch({
          id: selectedBatch.id,
          ...values,
        });

        toast.success("Batch updated successfully");
      } else {
        await createBatch(values);

        toast.success("Batch created successfully");
      }

      await loadData();

      setSelectedBatch(undefined);
    } catch (error) {
      console.error(error);

      toast.error("Failed to save batch");
    }
  }

  const filteredBatches = batches.filter((batch) => {
    const value = search.toLowerCase();

    const matchesSearch =
      batch.batch_number.toLowerCase().includes(value) ||
      batch.products?.name?.toLowerCase().includes(value) ||
      batch.suppliers?.name?.toLowerCase().includes(value);

    const matchesStatus = !showActiveOnly || batch.status === "ACTIVE";

    return matchesSearch && matchesStatus;
  });

  if (pageLoading) {
    return <SharedSkeleton />;
  }

  return (
    <>
      <PageHeader
        title="Batches"
        description="Manage inventory batches"
        action={
          <div className="flex items-center gap-2">
            <div className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              {batches.filter((batch) => batch.status === "ACTIVE").length}
              {" Active / "}
              {batches.length}
              {" Total"}
            </div>
            <Button
              onClick={() => {
                setSelectedBatch(undefined);

                setOpen(true);
              }}
            >
              Add Batch
            </Button>
          </div>
        }
      />

      <div className="mb-4 flex items-center justify-between gap-4">
        <Input
          placeholder="Search batches..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="flex items-center gap-2">
          <span className="text-sm">Active Only</span>

          <Switch
            checked={showActiveOnly}
            onCheckedChange={setShowActiveOnly}
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Batch</TableHead>

              <TableHead className="hidden md:table-cell">Product</TableHead>

              <TableHead className="hidden lg:table-cell">Quantity</TableHead>

              <TableHead className="hidden lg:table-cell">Supplier</TableHead>

              <TableHead className="hidden lg:table-cell">Expiry</TableHead>

              <TableHead>Status</TableHead>

              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredBatches.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7}>
                  <EmptyState title="No batches found" />
                </TableCell>
              </TableRow>
            ) : (
              filteredBatches.map((batch) => (
                <TableRow key={batch.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{batch.batch_number}</div>

                      <div className="text-xs text-muted-foreground md:hidden">
                        {batch.products?.name}
                      </div>

                      <div className="mt-1 space-y-1 text-xs md:hidden">
                        <div>Quantity: {batch.quantity}</div>

                        <div>
                          Expiry:{" "}
                          {batch.expiry_date
                            ? new Date(batch.expiry_date).toLocaleDateString()
                            : "-"}
                        </div>
                        <ExpiryBadge expiryDate={batch.expiry_date} />
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="hidden md:table-cell">
                    {batch.products?.name}
                  </TableCell>

                  <TableCell className="hidden md:table-cell">
                    <span>{batch.quantity}</span>
                  </TableCell>

                  <TableCell className="hidden lg:table-cell">
                    {batch.suppliers?.name}
                  </TableCell>

                  <TableCell className="hidden lg:table-cell">
                    {batch.expiry_date}
                  </TableCell>

                  <TableCell>
                    <StatusBadge status={batch.status} />
                  </TableCell>

                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedBatch(batch);

                          setOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <BatchModal
        open={open}
        onOpenChange={setOpen}
        batch={selectedBatch}
        products={products}
        suppliers={suppliers}
        onSubmit={handleSubmit}
      />
    </>
  );
}
