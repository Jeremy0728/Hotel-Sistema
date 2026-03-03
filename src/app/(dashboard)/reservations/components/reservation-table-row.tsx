import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import StatusBadge from "@/components/hotel/status-badge";
import { MoreHorizontal } from "lucide-react";
import type { ReservationStatus } from "@/types/hotel";

interface Reservation {
  id: string;
  code: string;
  guestName: string;
  roomNumber: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  status: ReservationStatus;
  total: number;
}

interface ReservationTableRowProps {
  reservation: Reservation;
  onConfirm: (id: string) => void;
  onCheckIn: (id: string) => void;
  onCheckOut: (id: string) => void;
  onCancel: (id: string) => void;
}

export default function ReservationTableRow({
  reservation,
  onConfirm,
  onCheckIn,
  onCheckOut,
  onCancel,
}: ReservationTableRowProps) {
  const router = useRouter();

  return (
    <TableRow
      className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50"
      onClick={() => router.push(`/reservations/${reservation.id}`)}
    >
      <TableCell className="font-medium">{reservation.code}</TableCell>
      <TableCell>{reservation.guestName}</TableCell>
      <TableCell>#{reservation.roomNumber}</TableCell>
      <TableCell>{reservation.checkIn}</TableCell>
      <TableCell>{reservation.checkOut}</TableCell>
      <TableCell>{reservation.nights}</TableCell>
      <TableCell>
        <StatusBadge type="reservation" status={reservation.status} />
      </TableCell>
      <TableCell>S/ {reservation.total}</TableCell>
      <TableCell onClick={(e) => e.stopPropagation()}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost" aria-label="Acciones">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push(`/reservations/${reservation.id}`)}>
              Ver detalle
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onConfirm(reservation.id)}
              disabled={reservation.status !== "pending"}
            >
              Confirmar
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onCheckIn(reservation.id)}
              disabled={reservation.status !== "confirmed"}
            >
              Check-in
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onCheckOut(reservation.id)}
              disabled={reservation.status !== "checkin"}
            >
              Check-out
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/invoices")}>
              Cobrar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onCancel(reservation.id)}
              disabled={reservation.status === "cancelled"}
            >
              Cancelar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
