"use client";

import { useEffect, useState } from "react";

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

import { SupplierModal } from "@/components/suppliers/supplier-modal";

import {
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from "@/lib/services/suppliers";

import { Supplier } from "@/types/supplier";

import { SupplierFormValues } from "@/lib/validations/supplier";
import { toast } from "sonner";
import { SharedSkeleton } from "@/components/shared/table-skeleton";

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  const [open, setOpen] = useState(false);

  const [search, setSearch] = useState("");

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [selectedSupplier, setSelectedSupplier] = useState<Supplier>();

  const [pageLoading, setPageLoading] = useState(true);

  async function loadSuppliers() {
    setPageLoading(true);
    const data = await getSuppliers();

    setSuppliers(data ?? []);
    setPageLoading(false);
  }

  useEffect(() => {
    const fetchData = async () => {
      await loadSuppliers();
    };

    void fetchData();
  }, []);

  async function handleSubmit(values: SupplierFormValues) {
    try {
      if (selectedSupplier) {
        await updateSupplier({
          id: selectedSupplier.id,
          ...values,
        });

        toast.success("Supplier updated successfully");
      } else {
        await createSupplier(values);

        toast.success("Supplier created successfully");
      }

      await loadSuppliers();

      setSelectedSupplier(undefined);
    } catch (error) {
      console.error(error);

      toast.error("Failed to save supplier");
    }
  }

  async function handleDelete(supplier: Supplier) {
    const confirmed = window.confirm(`Delete ${supplier.name}?`);

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(supplier.id);

      await deleteSupplier(supplier.id);

      toast.success("Supplier deleted successfully");

      await loadSuppliers();
    } catch (error) {
      console.error(error);

      toast.error("Failed to delete supplier");
    } finally {
      setDeletingId(null);
    }
  }

  function handleAddSupplier() {
    setSelectedSupplier(undefined);

    setOpen(true);
  }

  function handleEditSupplier(supplier: Supplier) {
    setSelectedSupplier(supplier);

    setOpen(true);
  }

  const filteredSuppliers = suppliers.filter((supplier) => {
    const searchValue = search.toLowerCase();

    return (
      supplier.name.toLowerCase().includes(searchValue) ||
      supplier.phone?.toLowerCase().includes(searchValue) ||
      supplier.gst_number?.toLowerCase().includes(searchValue)
    );
  });

  if (pageLoading) {
    return <SharedSkeleton />;
  }

  return (
    <>
      <PageHeader
        title="Suppliers"
        description="Manage supplier information"
        action={
          <div className="flex items-center gap-2">
            <div className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              {suppliers.length} Suppliers
            </div>
            <Button onClick={handleAddSupplier}>Add Supplier</Button>
          </div>
        }
      />

      <div className="mb-4">
        <Input
          placeholder="Search suppliers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>

              <TableHead>Phone</TableHead>

              <TableHead>GST</TableHead>

              <TableHead>Status</TableHead>

              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredSuppliers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <EmptyState title="No suppliers found" />
                </TableCell>
              </TableRow>
            ) : (
              filteredSuppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell>{supplier.name}</TableCell>

                  <TableCell>{supplier.phone}</TableCell>

                  <TableCell>{supplier.gst_number}</TableCell>

                  <TableCell>
                    <StatusBadge status={supplier.status} />
                  </TableCell>

                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditSupplier(supplier)}
                      >
                        Edit
                      </Button>

                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={deletingId === supplier.id}
                        onClick={() => handleDelete(supplier)}
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

      <SupplierModal
        open={open}
        onOpenChange={setOpen}
        supplier={selectedSupplier}
        onSubmit={handleSubmit}
      />
    </>
  );
}
