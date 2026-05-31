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

import { PageHeader } from "@/components/crud/page-header";
import { EmptyState } from "@/components/crud/empty-state";
import { StatusBadge } from "@/components/crud/status-badge";

import { BatchModal } from "@/components/batches/batch-modal";

import {
  getBatches,
  createBatch,
  updateBatch,
  deleteBatch,
} from "@/lib/services/batches";

import { getProducts } from "@/lib/services/products";
import { getSuppliers } from "@/lib/services/suppliers";

import { Batch, BatchWithRelations } from "@/types/batch";

import { Product } from "@/types/product";
import { Supplier } from "@/types/supplier";

import { BatchFormValues } from "@/lib/validations/batch";

export default function BatchesPage() {
  const [batches, setBatches] = useState<BatchWithRelations[]>([]);

  const [products, setProducts] = useState<Product[]>([]);

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  const [search, setSearch] = useState("");

  const [open, setOpen] = useState(false);

  const [selectedBatch, setSelectedBatch] = useState<Batch>();

  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function loadData() {
    const [batchData, productData, supplierData] = await Promise.all([
      getBatches(),
      getProducts(),
      getSuppliers(),
    ]);

    setBatches(batchData ?? []);

    setProducts(productData ?? []);

    setSuppliers(supplierData ?? []);
  }

  useEffect(() => {
    const fetchData = async () => {
      await loadData();
    };

    void fetchData();
  }, []);

  async function handleSubmit(values: BatchFormValues) {
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

  async function handleDelete(batch: Batch) {
    const confirmed = window.confirm(`Delete batch ${batch.batch_number}?`);

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(batch.id);

      await deleteBatch(batch.id);

      toast.success("Batch deleted successfully");

      await loadData();
    } catch (error) {
      console.error(error);

      toast.error("Failed to delete batch");
    } finally {
      setDeletingId(null);
    }
  }

  const filteredBatches = batches.filter((batch) => {
    const value = search.toLowerCase();

    return (
      batch.batch_number.toLowerCase().includes(value) ||
      batch.products?.name?.toLowerCase().includes(value) ||
      batch.suppliers?.name?.toLowerCase().includes(value)
    );
  });

  return (
    <>
      <PageHeader
        title="Batches"
        description="Manage inventory batches"
        action={
          <Button
            onClick={() => {
              setSelectedBatch(undefined);

              setOpen(true);
            }}
          >
            Add Batch
          </Button>
        }
      />

      <div className="mb-4">
        <Input
          placeholder="Search batches..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Batch</TableHead>

              <TableHead>Product</TableHead>

              <TableHead>Supplier</TableHead>

              <TableHead>Qty</TableHead>

              <TableHead>Purchase</TableHead>

              <TableHead>Selling</TableHead>

              <TableHead>Expiry</TableHead>

              <TableHead>Status</TableHead>

              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredBatches.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9}>
                  <EmptyState title="No batches found" />
                </TableCell>
              </TableRow>
            ) : (
              filteredBatches.map((batch) => (
                <TableRow key={batch.id}>
                  <TableCell>{batch.batch_number}</TableCell>

                  <TableCell>{batch.products?.name}</TableCell>

                  <TableCell>{batch.suppliers?.name}</TableCell>

                  <TableCell>{batch.quantity}</TableCell>

                  <TableCell>₹{batch.purchase_price}</TableCell>

                  <TableCell>₹{batch.selling_price}</TableCell>

                  <TableCell>{batch.expiry_date}</TableCell>

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

                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={deletingId === batch.id}
                        onClick={() => handleDelete(batch)}
                      >
                        Delete
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
