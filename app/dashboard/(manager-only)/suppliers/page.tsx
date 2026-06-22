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

import { SupplierModal } from "@/components/modals/supplier-modal";

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
import { Copy } from "lucide-react";

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

  async function handleCopyPhone(phone: string) {
    if (!phone) {
      return;
    }

    await navigator.clipboard.writeText(phone);

    toast.success("Phone number copied");
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
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
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

      <>
        {/* Mobile Cards */}
        <div className="space-y-3 md:hidden">
          {filteredSuppliers.length === 0 ? (
            <EmptyState title="No suppliers found" />
          ) : (
            filteredSuppliers.map((supplier) => (
              <div key={supplier.id} className="rounded-lg border bg-card p-4">
                <div className="space-y-1">
                  <div className="flex items-start justify-between gap-3">
                    <p className="min-w-0 flex-1 wrap-break-words font-medium">
                      {supplier.name}
                    </p>

                    <StatusBadge status={supplier.status} />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {supplier.phone || "N/A"}
                    </span>

                    {supplier.phone && (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7"
                        onClick={() =>
                          void handleCopyPhone(supplier.phone || "")
                        }
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>

                  <div className="wrap-break-words text-sm text-muted-foreground">
                    GST: {supplier.gst_number || "N/A"}
                  </div>
                </div>

                <div className="mt-2 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleEditSupplier(supplier)}
                  >
                    Edit
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    className="flex-1"
                    disabled={deletingId === supplier.id}
                    onClick={() => handleDelete(supplier)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop Table */}
        <div className="hidden rounded-md border md:block">
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
      </>

      <SupplierModal
        open={open}
        onOpenChange={setOpen}
        supplier={selectedSupplier}
        onSubmit={handleSubmit}
      />
    </>
  );
}
