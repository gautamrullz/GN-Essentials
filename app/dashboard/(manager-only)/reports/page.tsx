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

import {
  getInventoryValuation,
  getStockReport,
  getExpiryReport,
  getRecentTransactions,
} from "@/lib/services/reports";

import {
  InventoryValuationRow,
  StockReportRow,
  ExpiryReportRow,
} from "@/types/report";

import { InventoryTransactionWithRelations } from "@/types/transaction";
import { SharedSkeleton } from "@/components/shared/table-skeleton";

export default function ReportsPage() {
  const [valuation, setValuation] = useState<InventoryValuationRow[]>([]);

  const [stockReport, setStockReport] = useState<StockReportRow[]>([]);

  const [expiryReport, setExpiryReport] = useState<ExpiryReportRow[]>([]);

  const [transactions, setTransactions] = useState<
    InventoryTransactionWithRelations[]
  >([]);

  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setPageLoading(true);
      const [valuationData, stockData, expiryData, transactionData] =
        await Promise.all([
          getInventoryValuation(),
          getStockReport(),
          getExpiryReport(),
          getRecentTransactions(),
        ]);

      setValuation(valuationData);
      setStockReport(stockData);
      setExpiryReport(expiryData);
      setTransactions(transactionData);
      setPageLoading(false);
    }

    void loadData();
  }, []);

  const totalInventoryValue = valuation.reduce(
    (sum, row) => sum + row.inventory_value,
    0,
  );

  if (pageLoading) {
    return <SharedSkeleton />;
  }

  return (
    <>
      <PageHeader
        title="Reports"
        description="Inventory reports and analytics"
      />

      <div className="space-y-6">
        <div className="rounded-md border p-3 md:p-4">
          <h2 className="mb-2 text-xl font-semibold">Inventory Valuation</h2>

          <p className="mb-4 text-lg font-bold">
            Total Value: ₹{totalInventoryValue.toFixed(2)}
          </p>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="hidden md:table-cell">Batch</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Purchase Price
                  </TableHead>
                  <TableHead>Value</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {valuation.map((row) => (
                  <TableRow key={`${row.product_name}-${row.batch_number}`}>
                    <TableCell>{row.product_name}</TableCell>

                    <TableCell className="hidden md:table-cell">
                      {row.batch_number}
                    </TableCell>

                    <TableCell>{row.quantity}</TableCell>

                    <TableCell className="hidden md:table-cell">
                      ₹{row.purchase_price}
                    </TableCell>

                    <TableCell>₹{row.inventory_value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="rounded-md border p-4">
          <h2 className="mb-4 text-xl font-semibold">Current Stock Report</h2>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Current Stock</TableHead>
                  <TableHead>Low Stock Limit</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {stockReport.map((row) => (
                  <TableRow key={row.product_name}>
                    <TableCell>{row.product_name}</TableCell>

                    <TableCell>{row.current_stock}</TableCell>

                    <TableCell>{row.low_stock_limit}</TableCell>

                    <TableCell>{row.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        <div className="rounded-md border p-4">
          <h2 className="mb-4 text-xl font-semibold">Expiry Report</h2>
          <div className="overflow-x-auto">
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
                {expiryReport.map((row) => (
                  <TableRow key={`${row.product_name}-${row.batch_number}`}>
                    <TableCell>{row.product_name}</TableCell>

                    <TableCell>{row.batch_number}</TableCell>

                    <TableCell>{row.expiry_date}</TableCell>

                    <TableCell>{row.days_left}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        <div className="rounded-md border p-4">
          <h2 className="mb-4 text-xl font-semibold">Recent Transactions</h2>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Batch</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">
                      {transaction.products?.name}
                    </TableCell>

                    <TableCell>{transaction.batches?.batch_number}</TableCell>

                    <TableCell>{transaction.transaction_type}</TableCell>

                    <TableCell>{transaction.quantity}</TableCell>

                    <TableCell>
                      {new Date(transaction.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
}
