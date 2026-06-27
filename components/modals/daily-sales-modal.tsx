"use client";

import { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  DailySalesFormValues,
  dailySalesSchema,
} from "@/lib/validations/daily-sales";

import { DailySale } from "@/types/daily-sales";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/loading-button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface DailySalesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sale?: DailySale;
  onSubmit: (values: DailySalesFormValues) => Promise<void>;
}

function getTodayDate(): string {
  return new Date().toISOString().split("T")[0];
}

export function DailySalesModal({
  open,
  onOpenChange,
  sale,
  onSubmit,
}: DailySalesModalProps) {
  const form = useForm<DailySalesFormValues>({
    resolver: zodResolver(dailySalesSchema),
    defaultValues: {
      sale_date: getTodayDate(),
      cash_amount: 0,
      online_amount: 0,
      other_amount: 0,
      notes: "",
    },
  });

  useEffect(() => {
    if (sale) {
      form.reset({
        sale_date: sale.sale_date,
        cash_amount: sale.cash_amount,
        online_amount: sale.online_amount,
        other_amount: sale.other_amount,
        notes: sale.notes ?? "",
      });
    } else {
      form.reset({
        sale_date: getTodayDate(),
        cash_amount: 0,
        online_amount: 0,
        other_amount: 0,
        notes: "",
      });
    }
  }, [sale, form]);

  const totalAmount =
    Number(form.watch("cash_amount") ?? 0) +
    Number(form.watch("online_amount") ?? 0) +
    Number(form.watch("other_amount") ?? 0);

  const handleSave: SubmitHandler<DailySalesFormValues> = async (values) => {
    await onSubmit(values);

    form.reset({
      sale_date: getTodayDate(),
      cash_amount: 0,
      online_amount: 0,
      other_amount: 0,
      notes: "",
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {sale ? "Edit Daily Sale" : "Add Daily Sale"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSave)} className="space-y-4">
            {" "}
            <FormField
              control={form.control}
              name="sale_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sale Date</FormLabel>

                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="cash_amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cash Amount</FormLabel>

                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        step="0.01"
                        value={field.value}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="online_amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Online Amount</FormLabel>

                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        step="0.01"
                        value={field.value}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Notes</FormLabel>

                    <FormControl>
                      <Input
                        placeholder="Optional notes"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="rounded-md border bg-muted/50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Total Amount
                </span>

                <span className="text-2xl font-bold">
                  ₹{totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>{" "}
              <LoadingButton
                type="submit"
                loading={form.formState.isSubmitting}
                loadingText={
                  sale ? "Updating Daily Sale..." : "Saving Daily Sale..."
                }
              >
                {sale ? "Update Daily Sale" : "Save Daily Sale"}
              </LoadingButton>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
