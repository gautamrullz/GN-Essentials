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

import { PageHeader } from "@/components/layout/page-header";
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
        action={
          <div className="flex items-center gap-2">
            <div className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              {transactions.length} Transactions
            </div>
          </div>
        }
      />

      <div className="mb-4">
        <Input
          placeholder="Search product or transaction type..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>

              <TableHead className="hidden md:table-cell">Batch</TableHead>

              <TableHead className="hidden md:table-cell">Type</TableHead>

              <TableHead className="hidden md:table-cell">Quantity</TableHead>

              <TableHead className="hidden lg:table-cell">Notes</TableHead>

              <TableHead className="hidden md:table-cell">Date</TableHead>
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
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {transaction.products?.name}
                      </div>

                      <div className="text-xs text-muted-foreground md:hidden">
                        {transaction.transaction_type}
                      </div>

                      <div className="text-xs text-muted-foreground md:hidden">
                        Qty: {transaction.quantity}
                      </div>

                      <div className="text-xs text-muted-foreground md:hidden">
                        {new Date(transaction.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="hidden md:table-cell">
                    {transaction.batches?.batch_number}
                  </TableCell>

                  <TableCell className="hidden md:table-cell">
                    {transaction.transaction_type}
                  </TableCell>

                  <TableCell className="hidden md:table-cell">
                    {transaction.quantity}
                  </TableCell>

                  <TableCell className="hidden lg:table-cell">
                    {transaction.notes}
                  </TableCell>

                  <TableCell className="hidden md:table-cell">
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
