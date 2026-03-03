import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import StatusBadge from "@/components/hotel/status-badge";

interface Room {
  id: number;
  number: string;
  floor: number;
  status: string;
  notes?: string;
  roomType?: {
    name: string;
  };
}

interface RoomDetailDialogProps {
  room: Room | null;
  open: boolean;
  onClose: () => void;
  onEdit: () => void;
}

export default function RoomDetailDialog({
  room,
  open,
  onClose,
  onEdit,
}: RoomDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Detalle de habitación</DialogTitle>
        </DialogHeader>
        {room ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-500 dark:text-neutral-300">
                  Habitación #{room.number}
                </p>
                <h3 className="text-lg font-semibold">{room.roomType?.name || "Sin tipo"}</h3>
              </div>
              <StatusBadge type="room" status={room.status as any} />
            </div>
            <div className="text-sm text-neutral-600 dark:text-neutral-300">
              Piso {room.floor}
            </div>
            {room.notes ? (
              <p className="text-sm text-neutral-500 dark:text-neutral-300">
                {room.notes}
              </p>
            ) : null}
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={onClose}>
                Cerrar
              </Button>
              <Button onClick={onEdit}>Editar</Button>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
