"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Invoice, PaymentMethod } from "@/types/hotel";
import type { InvoicePaymentValues } from "@/lib/hotel-schemas";

interface InvoicePaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: Invoice | null;
  paymentMethods: PaymentMethod[];
  onSubmit: (values: InvoicePaymentValues) => void;
}

export default function InvoicePaymentDialog({
  open,
  onOpenChange,
  invoice,
  paymentMethods,
  onSubmit,
}: InvoicePaymentDialogProps) {
  const todayStr = new Date().toISOString().split("T")[0];
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<InvoicePaymentValues>({
    amount: 0,
    methodId: "",
    reference: "",
    date: todayStr,
    notes: "",
  });

  useEffect(() => {
    if (!invoice) return;
    setForm({
      amount: invoice.balance,
      methodId: paymentMethods[0]?.id ?? "",
      reference: "",
      date: todayStr,
      notes: "",
    });
    setError(null);
  }, [invoice, paymentMethods, todayStr, open]);

  const handleSubmit = () => {
    if (!invoice) return;
    if (!form.methodId) {
      setError("Selecciona un metodo de pago.");
      return;
    }
    if (form.amount <= 0) {
      setError("El monto debe ser mayor a 0.");
      return;
    }
    if (form.amount > invoice.balance) {
      setError("El monto no puede superar el balance pendiente.");
      return;
    }

    onSubmit(form);
    setError(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Registrar pago</DialogTitle>
        </DialogHeader>
        {invoice ? (
          <div className="space-y-4">
            <div className="text-sm text-neutral-500 dark:text-neutral-300">
              Factura {invoice.number} · Balance pendiente: S/ {invoice.balance}
            </div>
            <Input
              type="number"
              min={0}
              step="0.01"
              value={form.amount}
              onChange={(event) =>
                setForm({ ...form, amount: Number(event.target.value) })
              }
              placeholder="Monto"
            />
            <Select
              value={form.methodId}
              onValueChange={(value) => setForm({ ...form, methodId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Metodo de pago" />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods
                  .filter((method) => method.status === "active")
                  .map((method) => (
                    <SelectItem key={method.id} value={method.id}>
                      {method.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Referencia"
              value={form.reference}
              onChange={(event) =>
                setForm({ ...form, reference: event.target.value })
              }
            />
            <Input
              type="date"
              value={form.date}
              onChange={(event) => setForm({ ...form, date: event.target.value })}
            />
            <Textarea
              placeholder="Notas"
              value={form.notes}
              onChange={(event) => setForm({ ...form, notes: event.target.value })}
            />
            {error ? <p className="text-sm text-red-500">{error}</p> : null}
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSubmit}>Registrar pago</Button>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
