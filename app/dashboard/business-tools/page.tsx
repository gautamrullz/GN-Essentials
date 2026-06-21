"use client";

import { useMemo, useState } from "react";

import { PageHeader } from "@/components/layout/page-header";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { CalculatorSheet } from "./calculator-sheet";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

export default function BusinessToolsPage() {
  // Margin Calculator
  const [purchasePrice, setPurchasePrice] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");

  // Percentage Calculator
  const [amount, setAmount] = useState("");
  const [percentage, setPercentage] = useState("");

  // Price + Percentage Calculator
  const [basePrice, setBasePrice] = useState("");
  const [markupPercentage, setMarkupPercentage] = useState("");

  // Discount Calculator
  const [mrp, setMrp] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("");

  const marginResult = useMemo(() => {
    const purchase = Number(purchasePrice);
    const selling = Number(sellingPrice);

    if (!purchase || !selling) {
      return null;
    }

    const profit = selling - purchase;

    const margin = (profit / purchase) * 100;

    return {
      profit,
      margin,
    };
  }, [purchasePrice, sellingPrice]);

  const percentageResult = useMemo(() => {
    const amountValue = Number(amount);
    const percentageValue = Number(percentage);

    if (!amountValue || !percentageValue) {
      return null;
    }

    return (amountValue * percentageValue) / 100;
  }, [amount, percentage]);

  const priceWithPercentageResult = useMemo(() => {
    const price = Number(basePrice);
    const percent = Number(markupPercentage);

    if (!price || !percent) {
      return null;
    }

    const increase = (price * percent) / 100;

    return price + increase;
  }, [basePrice, markupPercentage]);

  const discountResult = useMemo(() => {
    const mrpValue = Number(mrp);
    const discount = Number(discountPercentage);

    if (!mrpValue || !discount) {
      return null;
    }

    const savings = (mrpValue * discount) / 100;

    const finalPrice = mrpValue - savings;

    return {
      savings,
      finalPrice,
    };
  }, [mrp, discountPercentage]);

  function resetMarginCalculator() {
    setPurchasePrice("");
    setSellingPrice("");
  }

  function resetPercentageCalculator() {
    setAmount("");
    setPercentage("");
  }

  function resetPricePercentageCalculator() {
    setBasePrice("");
    setMarkupPercentage("");
  }

  function resetDiscountCalculator() {
    setMrp("");
    setDiscountPercentage("");
  }

  return (
    <>
      <PageHeader
        title="Business Tools"
        description="Common calculations for inventory and pricing"
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Margin Calculator</CardTitle>

            <Button variant="ghost" size="icon" onClick={resetMarginCalculator}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Purchase Price
              </label>

              <Input
                type="number"
                min="0"
                step="0.01"
                placeholder="Enter purchase price"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Selling Price
              </label>

              <Input
                type="number"
                min="0"
                step="0.01"
                placeholder="Enter selling price"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(e.target.value)}
              />
            </div>

            {marginResult && (
              <div className="rounded-md border p-4">
                <p className="text-sm text-muted-foreground">Profit</p>

                <p className="text-2xl font-bold">
                  ₹{marginResult.profit.toFixed(2)}
                </p>

                <p className="mt-3 text-sm text-muted-foreground">
                  Margin Percentage
                </p>

                <p className="text-xl font-semibold">
                  {marginResult.margin.toFixed(2)}%
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Percentage Calculator</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={resetPercentageCalculator}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">Amount</label>

              <Input
                type="number"
                min="0"
                step="0.01"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Percentage
              </label>

              <Input
                type="number"
                min="0"
                step="0.01"
                placeholder="Enter percentage"
                value={percentage}
                onChange={(e) => setPercentage(e.target.value)}
              />
            </div>

            {percentageResult !== null && (
              <div className="rounded-md border p-4">
                <p className="text-sm text-muted-foreground">Result</p>

                <p className="text-2xl font-bold">
                  ₹{percentageResult.toFixed(2)}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Price + Percentage</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={resetPricePercentageCalculator}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Base Price
              </label>

              <Input
                type="number"
                min="0"
                step="0.01"
                placeholder="Enter base price"
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Percentage
              </label>

              <Input
                type="number"
                min="0"
                step="0.01"
                placeholder="Enter percentage"
                value={markupPercentage}
                onChange={(e) => setMarkupPercentage(e.target.value)}
              />
            </div>

            {priceWithPercentageResult !== null && (
              <div className="rounded-md border p-4">
                <p className="text-sm text-muted-foreground">Final Price</p>

                <p className="text-2xl font-bold">
                  ₹{priceWithPercentageResult.toFixed(2)}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Discount Calculator</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={resetDiscountCalculator}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">MRP</label>

              <Input
                type="number"
                min="0"
                step="0.01"
                placeholder="Enter MRP"
                value={mrp}
                onChange={(e) => setMrp(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Discount %
              </label>

              <Input
                type="number"
                min="0"
                step="0.01"
                placeholder="Enter discount percentage"
                value={discountPercentage}
                onChange={(e) => setDiscountPercentage(e.target.value)}
              />
            </div>

            {discountResult && (
              <div className="rounded-md border p-4">
                <p className="text-sm text-muted-foreground">Final Price</p>

                <p className="text-2xl font-bold">
                  ₹{discountResult.finalPrice.toFixed(2)}
                </p>

                <p className="mt-3 text-sm text-muted-foreground">Savings</p>

                <p className="text-xl font-semibold">
                  ₹{discountResult.savings.toFixed(2)}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <CalculatorSheet />
    </>
  );
}
