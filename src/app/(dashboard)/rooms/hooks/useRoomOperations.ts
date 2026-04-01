import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Invoice, Reservation, Room, RoomSnapshot } from "@/types/hotel";

interface UseRoomOperationsProps {
  rooms: Room[];
  allRooms: Room[];
  reservations: Reservation[];
  invoices: Invoice[];
  completeCheckIn: (reservationId: string) => void;
  completeCheckOut: (reservationId: string) => void;
  updateRoom: (roomId: string, updates: Partial<Room>) => void;
  selectedFloor: number | "all";
  search: string;
}

export function useRoomOperations({
  rooms,
  allRooms,
  reservations,
  invoices,
  completeCheckIn,
  completeCheckOut,
  updateRoom,
  selectedFloor,
  search,
}: UseRoomOperationsProps) {
  const router = useRouter();

  const today = useMemo(() => new Date().toISOString().split("T")[0], []);
  
  // Usar allRooms para calcular pisos y contadores
  const floors = useMemo(
    () => Array.from(new Set(allRooms.map((room) => room.floor))).sort((a, b) => a - b),
    [allRooms]
  );

  // Local state solo para el drawer
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [drawerNotes, setDrawerNotes] = useState("");

  // Compute snapshots para todas las habitaciones (para contadores)
  const allSnapshots = useMemo<RoomSnapshot[]>(() => {
    return allRooms.map((room) => {
      const roomReservations = reservations
        .filter((reservation) => reservation.roomId == room.id)
        .sort((a, b) => b.checkIn.localeCompare(a.checkIn));

      const activeReservation = roomReservations.find(
        (reservation) => reservation.status === "checkin"
      );
      const arrivalReservation = roomReservations.find(
        (reservation) =>
          (reservation.status === "confirmed" || reservation.status === "pending") &&
          reservation.checkIn === today
      );
      const departureReservation = roomReservations.find(
        (reservation) => reservation.status === "checkin" && reservation.checkOut === today
      );

      const reservationCodes = new Set(roomReservations.map((reservation) => reservation.confirmation_code));

      const pendingInvoice = invoices.find((invoice) => {
        const matchCode = invoice.reservationCode
          ? reservationCodes.has(invoice.reservationCode)
          : false;
        return (
          matchCode &&
          invoice.balance > 0 &&
          invoice.status !== "paid" &&
          invoice.status !== "cancelled"
        );
      });

      const hasAlert =
        room.status === "maintenance" || room.status === "out_of_service";

      return {
        room,
        roomReservations,
        activeReservation,
        arrivalReservation,
        departureReservation,
        pendingInvoice,
        hasPendingPayment: Boolean(pendingInvoice),
        hasAlert,
      };
    });
  }, [allRooms, reservations, invoices, today]);

  // Compute snapshots para habitaciones filtradas (para mostrar)
  const snapshots = useMemo<RoomSnapshot[]>(() => {
    return rooms.map((room) => {
      const roomReservations = reservations
        .filter((reservation) => reservation.roomId == room.id)
        .sort((a, b) => b.checkIn.localeCompare(a.checkIn));

      const activeReservation = roomReservations.find(
        (reservation) => reservation.status === "checkin"
      );
      const arrivalReservation = roomReservations.find(
        (reservation) =>
          (reservation.status === "confirmed" || reservation.status === "pending") &&
          reservation.checkIn === today
      );
      const departureReservation = roomReservations.find(
        (reservation) => reservation.status === "checkin" && reservation.checkOut === today
      );

      const reservationCodes = new Set(roomReservations.map((reservation) => reservation.confirmation_code));

      const pendingInvoice = invoices.find((invoice) => {
        const matchCode = invoice.reservationCode
          ? reservationCodes.has(invoice.reservationCode)
          : false;
        return (
          matchCode &&
          invoice.balance > 0 &&
          invoice.status !== "paid" &&
          invoice.status !== "cancelled"
        );
      });

      const hasAlert =
        room.status === "maintenance" || room.status === "out_of_service";

      return {
        room,
        roomReservations,
        activeReservation,
        arrivalReservation,
        departureReservation,
        pendingInvoice,
        hasPendingPayment: Boolean(pendingInvoice),
        hasAlert,
      };
    });
  }, [rooms, reservations, invoices, today]);

  // Floor summaries usando TODAS las habitaciones
  const floorSummaries = useMemo(() => {
    return floors.map((floor) => {
      const floorRooms = allSnapshots.filter((snapshot) => snapshot.room.floor === floor);
      return {
        floor,
        total: floorRooms.length,
        available: floorRooms.filter((snapshot) => snapshot.room.status === "available").length,
        occupied: floorRooms.filter((snapshot) => snapshot.room.status === "occupied").length,
        cleaning: floorRooms.filter((snapshot) => snapshot.room.status === "cleaning").length,
      };
    });
  }, [floors, allSnapshots]);

  // Filtered rooms by floor and guest name (solo filtro local de búsqueda)
  const roomsByFloor = useMemo(() => {
    const query = search.trim().toLowerCase();
    let filtered = snapshots;

    // Filtrar por piso si no es "all"
    if (selectedFloor !== "all") {
      filtered = filtered.filter((snapshot) => snapshot.room.floor === selectedFloor);
    }

    // Filtro local de búsqueda por nombre de habitación o huésped
    if (query) {
      filtered = filtered.filter((snapshot) => {
        const matchesRoom =
          snapshot.room.number.toLowerCase().includes(query) ||
          snapshot.room.type.toLowerCase().includes(query);
        const matchesGuest = [
          snapshot.activeReservation?.guestName,
          snapshot.arrivalReservation?.guestName,
          snapshot.departureReservation?.guestName,
        ].some((name) => name?.toLowerCase().includes(query));

        return matchesRoom || matchesGuest;
      });
    }

    return filtered.sort((a, b) =>
      a.room.number.localeCompare(b.room.number, undefined, { numeric: true })
    );
  }, [snapshots, selectedFloor, search]);

  // Selected snapshot
  const selectedSnapshot = useMemo(
    () =>
      roomsByFloor.find((snapshot) => snapshot.room.id === selectedRoomId) ??
      snapshots.find((snapshot) => snapshot.room.id === selectedRoomId) ??
      null,
    [roomsByFloor, snapshots, selectedRoomId]
  );

  // Current floor summary
  const currentFloorSummary = selectedFloor !== "all" 
    ? floorSummaries.find((summary) => summary.floor === selectedFloor)
    : null;

  const currentFloorSnapshots = useMemo(
    () => selectedFloor !== "all" 
      ? allSnapshots.filter((snapshot) => snapshot.room.floor === selectedFloor)
      : allSnapshots,
    [allSnapshots, selectedFloor]
  );

  // Status counts usando TODAS las habitaciones
  const counts = {
    all: selectedFloor !== "all" ? (currentFloorSummary?.total ?? 0) : allSnapshots.length,
    available: selectedFloor !== "all" 
      ? (currentFloorSummary?.available ?? 0)
      : allSnapshots.filter((s) => s.room.status === "available").length,
    occupied: selectedFloor !== "all"
      ? (currentFloorSummary?.occupied ?? 0)
      : allSnapshots.filter((s) => s.room.status === "occupied").length,
    cleaning: selectedFloor !== "all"
      ? (currentFloorSummary?.cleaning ?? 0)
      : allSnapshots.filter((s) => s.room.status === "cleaning").length,
    maintenance: currentFloorSnapshots.filter(
      (snapshot) => snapshot.room.status === "maintenance"
    ).length,
    out_of_service: currentFloorSnapshots.filter(
      (snapshot) => snapshot.room.status === "out_of_service"
    ).length,
  };

  // Quick action logic
  const getQuickAction = (snapshot: RoomSnapshot) => {
    if (snapshot.arrivalReservation && snapshot.room.status === "available") {
      return {
        label: "Check-in",
        execute: () => completeCheckIn(snapshot.arrivalReservation!.id),
      };
    }

    if (snapshot.departureReservation) {
      return {
        label: "Check-out",
        execute: () => completeCheckOut(snapshot.departureReservation!.id),
      };
    }

    if (snapshot.room.status === "cleaning") {
      return {
        label: "Marcar lista",
        execute: () => updateRoom(snapshot.room.id, { status: "available" }),
      };
    }

    if (snapshot.room.status === "maintenance" || snapshot.room.status === "out_of_service") {
      return {
        label: "Reactivar",
        execute: () => updateRoom(snapshot.room.id, { status: "available" }),
      };
    }

    if (snapshot.room.status === "available") {
      return {
        label: "Reservar",
        execute: () => router.push("/reservations/new"),
      };
    }

    return {
      label: "Detalle",
      execute: () => {
        setSelectedRoomId(snapshot.room.id);
        setDrawerNotes(snapshot.room.notes ?? "");
      },
    };
  };

  // Handlers
  const openRoomDetails = (roomId: string, notes: string) => {
    setSelectedRoomId(roomId);
    setDrawerNotes(notes);
  };

  const closeRoomDetails = () => {
    setSelectedRoomId(null);
  };

  return {
    // State
    selectedRoomId,
    drawerNotes,
    setDrawerNotes,
    
    // Computed data
    floors,
    floorSummaries,
    roomsByFloor,
    selectedSnapshot,
    counts,
    
    // Functions
    getQuickAction,
    openRoomDetails,
    closeRoomDetails,
  };
}
