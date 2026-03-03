import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Invoice, Reservation, Room, RoomStatus, RoomSnapshot } from "@/types/hotel";

type StatusFilter = RoomStatus | "all";

const validRoomStatuses = new Set<RoomStatus>([
  "available",
  "occupied",
  "cleaning",
  "maintenance",
  "out_of_service",
]);

interface UseRoomOperationsProps {
  rooms: Room[];
  reservations: Reservation[];
  invoices: Invoice[];
  completeCheckIn: (reservationId: string) => void;
  completeCheckOut: (reservationId: string) => void;
  updateRoom: (roomId: string, updates: Partial<Room>) => void;
}

export function useRoomOperations({
  rooms,
  reservations,
  invoices,
  completeCheckIn,
  completeCheckOut,
  updateRoom,
}: UseRoomOperationsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const today = useMemo(() => new Date().toISOString().split("T")[0], []);
  
  const floors = useMemo(
    () => Array.from(new Set(rooms.map((room) => room.floor))).sort((a, b) => a - b),
    [rooms]
  );

  // Parse URL params
  const statusParam = searchParams.get("status");
  const floorParam = searchParams.get("floor");
  const initialStatusFilter: StatusFilter =
    statusParam && validRoomStatuses.has(statusParam as RoomStatus)
      ? (statusParam as RoomStatus)
      : "all";
  const parsedFloor = floorParam ? Number(floorParam) : NaN;
  const initialSelectedFloor =
    !Number.isNaN(parsedFloor) && floors.includes(parsedFloor)
      ? parsedFloor
      : (floors[0] ?? 1);

  // Local state
  const [selectedFloor, setSelectedFloor] = useState<number>(initialSelectedFloor);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(initialStatusFilter);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [drawerNotes, setDrawerNotes] = useState("");

  // Compute snapshots
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
      const reservationGuests = new Set(
        roomReservations.map((reservation) => reservation.guestName.toLowerCase())
      );

      const pendingInvoice = invoices.find((invoice) => {
        const matchCode = invoice.reservationCode
          ? reservationCodes.has(invoice.reservationCode)
          : false;
        const matchGuest = reservationGuests.has(invoice.guest?.nombres.toLowerCase() || "");
        return (
          (matchCode || matchGuest) &&
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

  // Floor summaries
  const floorSummaries = useMemo(() => {
    return floors.map((floor) => {
      const floorRooms = snapshots.filter((snapshot) => snapshot.room.floor === floor);
      return {
        floor,
        total: floorRooms.length,
        available: floorRooms.filter((snapshot) => snapshot.room.status === "available").length,
        occupied: floorRooms.filter((snapshot) => snapshot.room.status === "occupied").length,
        cleaning: floorRooms.filter((snapshot) => snapshot.room.status === "cleaning").length,
      };
    });
  }, [floors, snapshots]);

  // Filtered rooms by floor and guest name
  const roomsByFloor = useMemo(() => {
    const query = search.trim().toLowerCase();
    return snapshots
      .filter((snapshot) => snapshot.room.floor === selectedFloor)
      .filter((snapshot) => {
        if (statusFilter !== "all" && snapshot.room.status !== statusFilter) return false;

        if (!query) return true;

        const matchesRoom =
          snapshot.room.number.toLowerCase().includes(query) ||
          snapshot.room.type.toLowerCase().includes(query);
        const matchesGuest = [
          snapshot.activeReservation?.guestName,
          snapshot.arrivalReservation?.guestName,
          snapshot.departureReservation?.guestName,
        ].some((name) => name?.toLowerCase().includes(query));

        return matchesRoom || matchesGuest;
      })
      .sort((a, b) =>
        a.room.number.localeCompare(b.room.number, undefined, { numeric: true })
      );
  }, [snapshots, selectedFloor, search, statusFilter]);

  // Selected snapshot
  const selectedSnapshot = useMemo(
    () =>
      roomsByFloor.find((snapshot) => snapshot.room.id === selectedRoomId) ??
      snapshots.find((snapshot) => snapshot.room.id === selectedRoomId) ??
      null,
    [roomsByFloor, snapshots, selectedRoomId]
  );

  // Current floor summary
  const currentFloorSummary = floorSummaries.find(
    (summary) => summary.floor === selectedFloor
  );

  const currentFloorSnapshots = useMemo(
    () => snapshots.filter((snapshot) => snapshot.room.floor === selectedFloor),
    [snapshots, selectedFloor]
  );

  // Status counts
  const counts = {
    all: currentFloorSummary?.total ?? 0,
    available: currentFloorSummary?.available ?? 0,
    occupied: currentFloorSummary?.occupied ?? 0,
    cleaning: currentFloorSummary?.cleaning ?? 0,
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
    selectedFloor,
    setSelectedFloor,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
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
