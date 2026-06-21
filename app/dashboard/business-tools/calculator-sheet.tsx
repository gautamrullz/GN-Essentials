"use client";

import { useMemo, useState } from "react";

import { Calculator, RotateCcw, X } from "lucide-react";

import { evaluate } from "mathjs";

import { Button } from "@/components/ui/button";

import { Card, CardContent } from "@/components/ui/card";

export function CalculatorSheet() {
  const [isOpen, setIsOpen] = useState(false);

  const [expression, setExpression] = useState("");

  const result = useMemo(() => {
    if (!expression.trim()) {
      return "";
    }

    try {
      const value = Number(evaluate(expression));

      if (Number.isNaN(value)) {
        return "";
      }

      return Number(value.toFixed(4)).toString();
    } catch {
      return "";
    }
  }, [expression]);

  function handleInput(value: string) {
    setExpression((prev) => prev + value);
  }

  function handleClear() {
    setExpression("");
  }

  function handleBackspace() {
    setExpression((prev) => prev.slice(0, -1));
  }

  function handleEquals() {
    if (!result) {
      return;
    }

    setExpression(result);
  }

  const buttons = [
    "7",
    "8",
    "9",
    "/",
    "4",
    "5",
    "6",
    "*",
    "1",
    "2",
    "3",
    "-",
    "0",
    ".",
    "=",
    "+",
  ];

  const operatorButtons = ["/", "*", "-", "+"];

  return (
    <>
      <Button
        size="icon"
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full shadow-lg"
      >
        <Calculator className="h-5 w-5" />
      </Button>

      {isOpen && (
        <Card className="fixed right-6 bottom-20 z-50 w-70 border-2 shadow-2xl">
          <CardContent className="p-3">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-semibold">Calculator</span>

              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={handleClear}>
                  <RotateCcw className="h-4 w-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="mb-3 rounded-md bg-muted p-3">
              <p className="min-h-5 break-all text-right text-xs text-muted-foreground">
                {expression || "0"}
              </p>

              <p className="mt-1 min-h-8 break-all text-right text-2xl font-bold">
                {result || "0"}
              </p>
            </div>

            <div className="grid grid-cols-4 gap-1.5">
              {buttons.map((button) => {
                if (button === "=") {
                  return (
                    <Button
                      key={button}
                      size="sm"
                      onClick={handleEquals}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {button}
                    </Button>
                  );
                }

                if (operatorButtons.includes(button)) {
                  return (
                    <Button
                      key={button}
                      size="sm"
                      onClick={() => handleInput(button)}
                    >
                      {button}
                    </Button>
                  );
                }

                return (
                  <Button
                    key={button}
                    variant="outline"
                    size="sm"
                    onClick={() => handleInput(button)}
                  >
                    {button}
                  </Button>
                );
              })}

              <Button
                variant="secondary"
                size="sm"
                className="col-span-2"
                onClick={handleClear}
              >
                Clear
              </Button>

              <Button
                variant="secondary"
                size="sm"
                className="col-span-2"
                onClick={handleBackspace}
              >
                ⌫
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
