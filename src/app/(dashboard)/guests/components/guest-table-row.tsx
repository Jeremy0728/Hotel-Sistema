import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

interface GuestTableRowProps {
  guest: Guest;
  onEdit: (guest: Guest) => void;
}

export default function GuestTableRow({ guest, onEdit }: GuestTableRowProps) {
  const router = useRouter();

  return (
    <TableRow
      className="cursor-pointer"
      role="button"
      tabIndex={0}
      onClick={() => router.push(`/guests/${guest.id}`)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          router.push(`/guests/${guest.id}`);
        }
      }}
    >
      <TableCell className="font-medium">
        {guest.first_name} {guest.last_name}
      </TableCell>
      <TableCell>
        {guest.document_type} {guest.document_number}
      </TableCell>
      <TableCell>{guest.email || "—"}</TableCell>
      <TableCell>{guest.phone}</TableCell>
      <TableCell>{guest.nationality || "—"}</TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="ghost" asChild>
            <Link
              href={`/guests/${guest.id}`}
              onClick={(event) => event.stopPropagation()}
            >
              Ver perfil
            </Link>
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={(event) => {
              event.stopPropagation();
              onEdit(guest);
            }}
          >
            Editar
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
