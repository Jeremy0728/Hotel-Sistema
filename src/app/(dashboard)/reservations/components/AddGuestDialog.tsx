"use client";

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
import type { Guest } from "@/types/hotel";

interface AddGuestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "existing" | "new";
  onModeChange: (mode: "existing" | "new") => void;
  selectedGuestId: string;
  onSelectedGuestIdChange: (id: string) => void;
  newGuest: {
    nombres: string;
    apellido_paterno: string;
    documentType: string;
    documentNumber: string;
    email: string;
    phone: string;
  };
  onNewGuestChange: (guest: {
    nombres: string;
    apellido_paterno: string;
    documentType: string;
    documentNumber: string;
    email: string;
    phone: string;
  }) => void;
  availableGuests: Guest[];
  onAddGuest: () => void;
}

const documentOptions = ["DNI", "Pasaporte", "CE"] as const;

export default function AddGuestDialog({
  open,
  onOpenChange,
  mode,
  onModeChange,
  selectedGuestId,
  onSelectedGuestIdChange,
  newGuest,
  onNewGuestChange,
  availableGuests,
  onAddGuest,
}: AddGuestDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Agregar huesped</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Select value={mode} onValueChange={(value) => onModeChange(value as "existing" | "new")}>
            <SelectTrigger>
              <SelectValue placeholder="Modo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="existing">Seleccionar existente</SelectItem>
              <SelectItem value="new">Crear nuevo</SelectItem>
            </SelectContent>
          </Select>

          {mode === "existing" ? (
            <Select value={selectedGuestId} onValueChange={onSelectedGuestIdChange}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona huesped" />
              </SelectTrigger>
              <SelectContent>
                {availableGuests.map((guest) => (
                  <SelectItem key={guest.id} value={String(guest.id)}>
                    {guest.nombres} {guest.apellido_paterno} {guest.apellido_materno}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                placeholder="Nombres"
                value={newGuest.nombres}
                onChange={(event) =>
                  onNewGuestChange({ ...newGuest, nombres: event.target.value })
                }
              />
              <Input
                placeholder="Apellidos"
                value={newGuest.apellido_paterno}
                onChange={(event) =>
                  onNewGuestChange({ ...newGuest, apellido_paterno: event.target.value })
                }
              />
              <Select
                value={newGuest.documentType}
                onValueChange={(value) =>
                  onNewGuestChange({ ...newGuest, documentType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Documento" />
                </SelectTrigger>
                <SelectContent>
                  {documentOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="Numero de documento"
                value={newGuest.documentNumber}
                onChange={(event) =>
                  onNewGuestChange({ ...newGuest, documentNumber: event.target.value })
                }
              />
              <Input
                placeholder="Email"
                value={newGuest.email}
                onChange={(event) =>
                  onNewGuestChange({ ...newGuest, email: event.target.value })
                }
              />
              <Input
                placeholder="Telefono"
                value={newGuest.phone}
                onChange={(event) =>
                  onNewGuestChange({ ...newGuest, phone: event.target.value })
                }
              />
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={onAddGuest}>Agregar</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
