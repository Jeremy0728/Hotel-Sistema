"use client";

import { useMemo, useState } from "react";
import EmptyState from "@/components/hotel/empty-state";
import { useReservation } from "@/hooks/useReservations";
import { useGuests } from "@/hooks/useGuests";
import { useRooms } from "@/hooks/useRooms";
import { useReservationDetailOperations } from "../hooks/useReservationOperations";
import { reservasHuespedesApi } from "@/apis/reservas-huespedes.api";
import toast from "react-hot-toast";
import type { Reservation, ReservationStatus } from "@/types/hotel";
import ReservationInfo from "./ReservationInfo";
import GuestManagement from "./GuestManagement";
import FinancialInfo from "./FinancialInfo";
import AdditionalServices from "./AdditionalServices";
import ReservationTimeline from "./ReservationTimeline";
import AddGuestDialog from "./AddGuestDialog";

interface ReservationDetailProps {
  reservationId: string;
}

export default function ReservationDetail({ reservationId }: ReservationDetailProps) {
  // Obtener datos desde hooks individuales
  const reservationIdNum = parseInt(reservationId, 10);
  const { reservation: apiReservation, isLoading: reservationLoading, isError, mutate } = useReservation(
    isNaN(reservationIdNum) ? null : reservationIdNum
  );
  const { guests, isLoading: guestsLoading, refreshGuests } = useGuests({ limit: 100 });
  const { rooms, isLoading: roomsLoading } = useRooms({ limit: 100 });
  
  const {
    confirmReservation,
    cancelReservation,
    checkInReservation,
    createGuest,
    isUpdating,
  } = useReservationDetailOperations(reservationIdNum, () => {
    mutate();
    refreshGuests();
  });

  // Convertir la reserva de la API al formato esperado por el componente
  const reservation = useMemo(() => {
    if (!apiReservation) return null;
    
    const guest = apiReservation.guest || apiReservation.huesped;
    const room = apiReservation.room || apiReservation.habitacion;
    
    return {
      ...apiReservation,
      id: String(apiReservation.id),
      code: apiReservation.confirmation_code || `RES-${apiReservation.id}`,
      confirmation_code: apiReservation.confirmation_code || `RES-${apiReservation.id}`,
      guestId: String(apiReservation.guest_id),
      guestName: guest 
        ? `${guest.nombres} ${guest.apellido_paterno}` 
        : 'Sin nombre',
      roomId: String(apiReservation.room_id),
      roomNumber: room?.number || String(apiReservation.room_id),
      checkIn: apiReservation.check_in_date,
      checkOut: apiReservation.check_out_date,
      nights: apiReservation.total_nights || 1,
      status: apiReservation.status === 'checked_in' ? 'checkin' : apiReservation.status === 'checked_out' ? 'checkout' : apiReservation.status as ReservationStatus,
      total: parseFloat(apiReservation.total_amount || '0'),
      adults: apiReservation.adults || 1,
      children: apiReservation.children || 0,
      createdAt: apiReservation.created_at || '',
      actualCheckIn: apiReservation.checkIn?.actual_check_in,
      actualCheckOut: apiReservation.checkIn?.checkOut?.actual_check_out,
      additionalGuests: apiReservation.reservationGuests || [],
    } as Reservation;
  }, [apiReservation]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [mode, setMode] = useState<"existing" | "new">("existing");
  const [selectedGuestId, setSelectedGuestId] = useState("");
  const [newGuest, setNewGuest] = useState({
    nombres: "",
    apellido_paterno: "",
    documentType: "DNI",
    documentNumber: "",
    email: "",
    phone: "",
  });
  const [note, setNote] = useState("");

  if (reservationLoading || guestsLoading || roomsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <div className="h-8 w-8 animate-spin mx-auto border-4 border-primary border-t-transparent rounded-full" />
          <p className="text-sm text-neutral-500">Cargando detalles de la reserva...</p>
        </div>
      </div>
    );
  }

  if (isError || !reservation) {
    return (
      <EmptyState
        title="Reserva no encontrada"
        description="No existe la reserva solicitada o hubo un error al cargarla."
      />
    );
  }

  const additionalGuestIds = reservation.additionalGuestIds ?? [];
  const primaryGuest = guests.find((guest) => String(guest.id) === reservation.guestId);

  const handleConfirm = async () => {
    await confirmReservation();
  };

  const handleCancel = async () => {
    await cancelReservation();
  };

  const handleCheckIn = async () => {
    await checkInReservation();
  };

  const handleAddGuest = async () => {
    if (mode === "existing") {
      if (!selectedGuestId) return;
      if (selectedGuestId === reservation.guestId) return;
      if (additionalGuestIds.includes(selectedGuestId)) return;
      
      try {
        await reservasHuespedesApi.crear({
          reservation_id: reservationIdNum,
          guest_id: parseInt(selectedGuestId, 10),
          is_primary: false
        });
        
        toast.success('Huésped agregado a la reserva exitosamente');
        
        // Refrescar datos de la reserva
        await mutate();
        
        setSelectedGuestId("");
        setDialogOpen(false);
      } catch (error) {
        console.error('Error al agregar huésped:', error);
        toast.error('Error al agregar huésped a la reserva');
      }
      return;
    }

    if (!newGuest.nombres || !newGuest.apellido_paterno) return;
    
    const guestData = {
      nombres: newGuest.nombres,
      apellido_paterno: newGuest.apellido_paterno,
      document_type: newGuest.documentType.toLowerCase(),
      document_number: newGuest.documentNumber || "00000000",
      email: newGuest.email,
      phone: newGuest.phone || "000000000",
    };
    
    await createGuest(guestData);
    
    setNewGuest({
      nombres: "",
      apellido_paterno: "",
      documentType: "DNI",
      documentNumber: "",
      email: "",
      phone: "",
    });
    setDialogOpen(false);
  };

  const handleSetPrimary = (guestId: string) => {
    if (guestId === reservation.guestId) return;
    // TODO: Implementar API para cambiar huésped principal de reserva
    console.log('Set primary guest:', guestId);
  };

  const handleRemoveGuest = async (relationId: number) => {
    try {
      await reservasHuespedesApi.eliminar(relationId);
      
      toast.success('Huésped removido de la reserva exitosamente');
      
      // Refrescar datos de la reserva
      await mutate();
    } catch (error) {
      console.error('Error al remover huésped:', error);
      toast.error('Error al remover huésped de la reserva');
    }
  };

  const timeline = [
    { label: "Reserva creada", date: reservation.createdAt },
    reservation.status === "confirmed"
      ? { label: "Reserva confirmada", date: reservation.checkIn }
      : null,
    reservation.status === "checkin"
      ? { label: "Check-in completado", date: reservation.actualCheckIn ?? reservation.checkIn }
      : null,
    reservation.status === "checkout"
      ? { label: "Check-out completado", date: reservation.actualCheckOut ?? reservation.checkOut }
      : null,
  ].filter(Boolean) as { label: string; date: string }[];

  const availableGuests = guests.filter(
    (guest) =>
      String(guest.id) !== reservation.guestId &&
      !additionalGuestIds.includes(String(guest.id))
  );

  return (
    <div className="space-y-6">
      <ReservationInfo
        reservation={reservation}
        isUpdating={isUpdating}
        onConfirm={handleConfirm}
        onCheckIn={handleCheckIn}
        onCancel={handleCancel}
      />

      <GuestManagement
        reservation={reservation}
        primaryGuest={primaryGuest}
        onAddGuest={() => setDialogOpen(true)}
        onSetPrimary={handleSetPrimary}
        onRemoveGuest={handleRemoveGuest}
      />

      <FinancialInfo
        reservation={reservation}
        note={note}
        onNoteChange={setNote}
      />

      <AdditionalServices />

      <ReservationTimeline timeline={timeline} />

      <AddGuestDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        mode={mode}
        onModeChange={setMode}
        selectedGuestId={selectedGuestId}
        onSelectedGuestIdChange={setSelectedGuestId}
        newGuest={newGuest}
        onNewGuestChange={setNewGuest}
        availableGuests={availableGuests}
        onAddGuest={handleAddGuest}
      />
    </div>
  );
}
