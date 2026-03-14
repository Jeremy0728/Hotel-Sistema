import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

interface Country {
  id: number;
  code: string;
  name: string;
  nationality: string;
  phone_code?: string;
}

interface Guest {
  id: number;
  nombres: string;
  apellido_paterno: string;
  apellido_materno?: string;
  email?: string;
  phone?: string;
  document_type?: string;
  document_number?: string;
  country?: Country;
}

interface GuestMobileCardProps {
  guest: Guest;
  onEdit: (guest: Guest) => void;
}

export default function GuestMobileCard({ guest, onEdit }: GuestMobileCardProps) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold">
            {guest.nombres} {guest.apellido_paterno} {guest.apellido_materno || ''}
          </p>
          <p className="text-xs text-neutral-500 dark:text-neutral-300">
            {guest.document_type || '—'} {guest.document_number || '—'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" asChild>
            <Link href={`/guests/${guest.id}`}>Ver</Link>
          </Button>
          <Button size="sm" variant="ghost" onClick={() => onEdit(guest)}>
            Editar
          </Button>
        </div>
      </div>
      <div className="text-xs text-neutral-500 dark:text-neutral-300 mt-2">
        {guest.email || "Sin email"} · {guest.phone || '—'}
      </div>
      <div className="text-xs text-neutral-500 dark:text-neutral-300 mt-1">
        {guest.country?.nationality || "—"}
      </div>
    </Card>
  );
}
