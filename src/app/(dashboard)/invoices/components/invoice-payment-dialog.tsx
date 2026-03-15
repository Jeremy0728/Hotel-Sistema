"use client";

import { useMemo, useState, useEffect } from "react";
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
import type { Invoice, PaymentMethod } from "@/types/invoice";
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
  const [error, setError] = useState<string | null>(null);
  
  // Calcular balance de la factura
  const invoiceBalance = useMemo(() => {
    if (!invoice) return 0;
    const total = typeof invoice.total_amount === 'string' ? parseFloat(invoice.total_amount) : invoice.total_amount;
    // Calcular el monto pagado a partir de all_related_payments con status 'completed'
    const paid = invoice.all_related_payments?.reduce((sum, payment) => {
      const amount = typeof payment.amount === 'string' ? parseFloat(payment.amount) : payment.amount;
      return sum + (payment.status === 'completed' ? amount : 0);
    }, 0) || 0;
    return total - paid;
  }, [invoice]);

  // Valores iniciales calculados en el cliente para evitar mismatch SSR
  const initialFormValues = useMemo(() => {
    // Solo ejecutar en el cliente
    if (typeof window === 'undefined') {
      return {
        amount: 0,
        methodId: "",
        reference: "",
        date: "",
        notes: "",
      };
    }
    
    const todayStr = new Date().toISOString().split("T")[0];
    return {
      amount: invoiceBalance,
      methodId: paymentMethods[0]?.id.toString() ?? "",
      reference: "",
      date: todayStr,
      notes: "",
    };
  }, [invoiceBalance, paymentMethods]);

  const [form, setForm] = useState<InvoicePaymentValues>(initialFormValues);

  // Actualizar formulario cuando cambien los valores iniciales
  useEffect(() => {
    setForm(initialFormValues);
  }, [initialFormValues]);

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
    if (form.amount > invoiceBalance) {
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
              Factura {invoice.invoice_number} · Balance pendiente: S/ {invoiceBalance.toFixed(2)}
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
                  .filter((method) => method.is_active)
                  .map((method) => (
                    <SelectItem key={method.id} value={method.id.toString()}>
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
