import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

interface Guest {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  document_type: string;
  document_number: string;
  nationality?: string;
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
            {guest.first_name} {guest.last_name}
          </p>
          <p className="text-xs text-neutral-500 dark:text-neutral-300">
            {guest.document_type} {guest.document_number}
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
        {guest.email || "Sin email"} · {guest.phone}
      </div>
      <div className="text-xs text-neutral-500 dark:text-neutral-300 mt-1">
        {guest.nationality || "—"}
      </div>
    </Card>
  );
}
