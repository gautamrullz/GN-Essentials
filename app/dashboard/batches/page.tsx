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
import { ExpiryBadge } from "@/components/crud/expiry-badge";
import { Pencil, Trash2 } from "lucide-react";

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
          <div className="flex items-center gap-2">
            <div className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              {batches.length} Batches
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

      <div className="mb-4">
        <Input
          placeholder="Search batches..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Batch</TableHead>

              <TableHead className="hidden md:table-cell">Product</TableHead>

              <TableHead className="hidden lg:table-cell">Quantity</TableHead>

              <TableHead className="hidden lg:table-cell">Supplier</TableHead>

              <TableHead className="hidden md:table-cell">Purchase</TableHead>

              <TableHead className="hidden md:table-cell">Selling</TableHead>

              <TableHead className="hidden lg:table-cell">Expiry</TableHead>

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
                  <TableCell>
                    <div>
                      <div className="font-medium">{batch.batch_number}</div>

                      <div className="text-xs text-muted-foreground md:hidden">
                        {batch.products?.name}
                      </div>

                      <div className="mt-1 space-y-1 text-xs md:hidden">
                        <div>Quantity: {batch.quantity}</div>
                        <div>Purchase: ₹{batch.purchase_price}</div>

                        <div>Selling: ₹{batch.selling_price}</div>

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

                  <TableCell className="hidden md:table-cell">
                    ₹{batch.purchase_price}
                  </TableCell>

                  <TableCell className="hidden md:table-cell">
                    ₹{batch.selling_price}
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
