"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { stockAdjustSchema, type StockAdjustValues } from "@/lib/hotel-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface StockAdjustFormProps {
  defaultValues: StockAdjustValues;
  onSubmit: (values: StockAdjustValues) => void;
  onCancel: () => void;
  submitLabel: string;
}

export default function InventoryStockAdjustForm({
  defaultValues,
  onSubmit,
  onCancel,
  submitLabel,
}: StockAdjustFormProps) {
  const form = useForm<StockAdjustValues>({
    resolver: zodResolver(stockAdjustSchema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="stock"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} type="number" min={0} placeholder="Stock actual" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="minStock"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} type="number" min={0} placeholder="Stock minimo" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">{submitLabel}</Button>
        </div>
      </form>
    </Form>
  );
}
