"use client";

import { useEffect, useState } from "react";

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

import { getTransactions } from "@/lib/services/transactions";

import { InventoryTransactionWithRelations } from "@/types/transaction";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<
    InventoryTransactionWithRelations[]
  >([]);

  const [search, setSearch] = useState("");

  async function loadData() {
    const data = await getTransactions();

    setTransactions(data ?? []);
  }

  useEffect(() => {
    const fetchData = async () => {
      await loadData();
    };

    void fetchData();
  }, []);

  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.transaction_type
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      transaction.products?.name?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <PageHeader
        title="Transactions"
        description="Inventory transaction history"
      />

      <div className="mb-4">
        <Input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>

              <TableHead>Batch</TableHead>

              <TableHead>Type</TableHead>

              <TableHead>Quantity</TableHead>

              <TableHead>Notes</TableHead>

              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <EmptyState title="No transactions found" />
                </TableCell>
              </TableRow>
            ) : (
              filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.products?.name}</TableCell>

                  <TableCell>{transaction.batches?.batch_number}</TableCell>

                  <TableCell>{transaction.transaction_type}</TableCell>

                  <TableCell>{transaction.quantity}</TableCell>

                  <TableCell>{transaction.notes}</TableCell>

                  <TableCell>
                    {new Date(transaction.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
