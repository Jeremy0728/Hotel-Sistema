import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import StatusBadge from "@/components/hotel/status-badge";
import type { ReservationStatus } from "@/types/hotel";

interface Reservation {
  id: string;
  code: string;
  guestName: string;
  roomNumber: string;
  checkIn: string;
  status: ReservationStatus;
}

interface CheckOutTableRowProps {
  reservation: Reservation;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export default function CheckOutTableRow({
  reservation,
  isSelected,
  onSelect,
}: CheckOutTableRowProps) {
  return (
    <TableRow>
      <TableCell className="font-medium">{reservation.code}</TableCell>
      <TableCell>{reservation.guestName}</TableCell>
      <TableCell>#{reservation.roomNumber}</TableCell>
      <TableCell>{reservation.checkIn}</TableCell>
      <TableCell>
        <StatusBadge type="reservation" status={reservation.status} />
      </TableCell>
      <TableCell>
        <Button
          size="sm"
          variant={isSelected ? "default" : "ghost"}
          onClick={() => onSelect(reservation.id)}
        >
          {isSelected ? "Seleccionada" : "Seleccionar"}
        </Button>
      </TableCell>
    </TableRow>
  );
}
