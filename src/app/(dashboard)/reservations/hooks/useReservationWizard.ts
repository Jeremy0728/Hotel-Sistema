import { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { reservasApi } from '@/apis/reservas.api';
import { huespedesApi } from '@/apis/huespedes.api';
import toast from 'react-hot-toast';
import type { RoomType, RoomTypePrice } from '@/types/room';

const DRAFT_KEY = "hotel-reservation-draft";

type WizardStep = 1 | 2 | 3 | 4;

interface RoomForWizard {
  id: number;
  number: string;
  type: string;
  floor: number;
  status: string;
  roomType?: RoomType;
}

interface Guest {
  id: number;
  nombres: string;
  apellido_paterno: string;
  apellido_materno?: string;
  email?: string;
  phone?: string;
}

interface ReservationDraft {
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  roomType: string;
  roomId: string;
  roomNumber: string;
  guestId: string;
  isNewGuest: boolean;
  guestFirstName: string;
  guestLastName: string;
  guestEmail: string;
  guestPhone: string;
  notes: string;
  discount: number;
}

const defaultDraft: ReservationDraft = {
  checkIn: "",
  checkOut: "",
  adults: 1,
  children: 0,
  roomType: "",
  roomId: "",
  roomNumber: "",
  guestId: "",
  isNewGuest: false,
  guestFirstName: "",
  guestLastName: "",
  guestEmail: "",
  guestPhone: "",
  notes: "",
  discount: 0,
};

interface UseReservationWizardProps {
  rooms: RoomForWizard[];
  guests: Guest[]; // Usado para validación en el wizard
  refreshReservations?: () => void;
}

export function useReservationWizard({
  rooms,
  guests,
  refreshReservations,
}: UseReservationWizardProps) {
  const router = useRouter();
  const [step, setStep] = useState<WizardStep>(1);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [draft, setDraft] = useState<ReservationDraft>(() => {
    if (typeof window === "undefined") return defaultDraft;
    const saved = localStorage.getItem(DRAFT_KEY);
    if (!saved) return defaultDraft;
    try {
      return { ...defaultDraft, ...JSON.parse(saved) } as ReservationDraft;
    } catch {
      return defaultDraft;
    }
  });

  // Guardar draft en localStorage
  const saveDraft = useCallback((newDraft: ReservationDraft) => {
    setDraft(newDraft);
    if (typeof window !== "undefined") {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(newDraft));
    }
  }, []);

  // Calcular noches
  const nights = useMemo(() => {
    if (!draft.checkIn || !draft.checkOut) return 0;
    const start = new Date(`${draft.checkIn}T00:00:00`);
    const end = new Date(`${draft.checkOut}T00:00:00`);
    const diff = Math.max(0, Math.round((end.getTime() - start.getTime()) / 86400000));
    return diff;
  }, [draft.checkIn, draft.checkOut]);

  // Tipos de habitación únicos
  const roomTypes = useMemo(
    () => Array.from(new Set(rooms.map((room) => room.type))),
    [rooms]
  );

  // Habitaciones disponibles filtradas
  const availableRooms = useMemo(() => {
    return rooms.filter(
      (room) =>
        room.status === "available" &&
        (draft.roomType ? room.type === draft.roomType : true)
    );
  }, [rooms, draft.roomType]);

  // Cálculos de precio basados en room_type_prices
  const selectedRoom = useMemo(() => {
    return rooms.find(room => room.id.toString() === draft.roomId);
  }, [rooms, draft.roomId]);

  const dailyPrice = useMemo(() => {
    if (!selectedRoom?.roomType?.prices || selectedRoom.roomType.prices.length === 0) return 0;
    const dailyPriceObj = selectedRoom.roomType.prices.find(
      (p: RoomTypePrice) => p.price_type === 'daily' && p.is_active
    );
    return dailyPriceObj ? parseFloat(dailyPriceObj.price) : 0;
  }, [selectedRoom]);

  const baseRate = dailyPrice;
  const subtotal = nights * baseRate;
  const discountAmount = subtotal * (draft.discount / 100);
  const taxable = subtotal - discountAmount;
  const tax = taxable * 0.18;
  const total = Math.max(0, Math.round(taxable + tax));

  // Navegación entre pasos
  const handleNext = useCallback(() => {
    if (step === 1) {
      if (!draft.checkIn || !draft.checkOut || !draft.roomId) {
        setError("Completa fechas y selecciona una habitación.");
        return;
      }
      setError(null);
      setStep(2);
      return;
    }
    if (step === 2) {
      if (draft.isNewGuest) {
        if (!draft.guestFirstName || !draft.guestLastName) {
          setError("Completa el nombre del huésped.");
          return;
        }
      } else if (!draft.guestId) {
        setError("Selecciona un huésped.");
        return;
      }
      setError(null);
      setStep(3);
      return;
    }
    if (step === 3) {
      setError(null);
      setStep(4);
    }
  }, [step, draft]);

  const handleBack = useCallback(() => {
    setError(null);
    setStep((prev) => (prev > 1 ? ((prev - 1) as WizardStep) : prev));
  }, []);

  // Crear reserva
  const handleCreateReservation = useCallback(async () => {
    setIsSubmitting(true);
    try {
      let guestId = draft.guestId;

      // Si es un nuevo huésped, crearlo primero
      if (draft.isNewGuest) {
        const guestResponse = await huespedesApi.crear({
          nombres: draft.guestFirstName,
          apellido_paterno: draft.guestLastName,
          apellido_materno: '',
          email: draft.guestEmail || '',
          phone: draft.guestPhone || '',
        });

        if (!guestResponse.ok || !guestResponse.huesped) {
          toast.error('Error al crear el huésped');
          setIsSubmitting(false);
          return;
        }

        guestId = guestResponse.huesped.id.toString();
      }

      // Crear la reserva con todos los campos calculados
      const reservationData = {
        guest_id: parseInt(guestId, 10),
        room_id: parseInt(draft.roomId, 10),
        check_in_date: draft.checkIn,
        check_out_date: draft.checkOut,
        adults: draft.adults,
        children: draft.children,
        special_requests: draft.notes || undefined,
        notes: draft.notes || undefined,
        total_nights: nights,
        subtotal: subtotal.toString(),
        discount_percentage: draft.discount,
        discount_amount: discountAmount.toString(),
        tax_amount: tax.toString(),
        total_amount: total.toString(),
      };

      const response = await reservasApi.crear(reservationData as any);

      if (response.ok) {
        toast.success('Reserva creada exitosamente');
        
        // Limpiar draft del localStorage
        if (typeof window !== "undefined") {
          localStorage.removeItem(DRAFT_KEY);
        }

        // Refrescar lista de reservas si existe la función
        refreshReservations?.();

        // Redirigir a la lista de reservas
        router.push("/reservations");
      } else {
        toast.error('Error al crear la reserva');
      }
    } catch (error) {
      console.error('Error al crear reserva:', error);
      toast.error('Error al crear la reserva');
    } finally {
      setIsSubmitting(false);
    }
  }, [draft, router, refreshReservations, nights, subtotal, discountAmount, tax, total]);

  return {
    step,
    error,
    draft,
    isSubmitting,
    nights,
    roomTypes,
    availableRooms,
    baseRate,
    subtotal,
    discountAmount,
    tax,
    total,
    saveDraft,
    handleNext,
    handleBack,
    handleCreateReservation,
  };
}
