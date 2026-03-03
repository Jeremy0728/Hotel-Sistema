"use client";

import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import type { Reservation } from "@/types/hotel";

interface FinancialInfoProps {
  reservation: Reservation;
  note: string;
  onNoteChange: (note: string) => void;
}

export default function FinancialInfo({
  reservation,
  note,
  onNoteChange,
}: FinancialInfoProps) {
  return (
    <Card className="p-4 space-y-4">
      <h3 className="text-base font-semibold">Informacion financiera</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div>
          <p className="text-neutral-500">Subtotal</p>
          <p className="font-semibold">S/ {Number(reservation.subtotal).toFixed(2)}</p>
        </div>
        <div>
          <p className="text-neutral-500">Impuestos</p>
          <p className="font-semibold">S/ {Number(reservation.taxes).toFixed(2)}</p>
        </div>
        <div>
          <p className="text-neutral-500">Total</p>
          <p className="font-semibold">S/ {reservation.total.toFixed(2)}</p>
        </div>
      </div>
      <Textarea
        placeholder="Notas internas"
        value={note}
        onChange={(event) => onNoteChange(event.target.value)}
      />
    </Card>
  );
}
