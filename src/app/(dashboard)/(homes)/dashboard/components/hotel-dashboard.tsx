"use client";

import { useState, useEffect } from "react";
import { useDashboardData } from "../hooks/useDashboardData";
import { useDashboardMetrics } from "../hooks/useDashboardMetrics";
import { useDashboardActions } from "../hooks/useDashboardActions";
import { displayName, paxLabel, paymentMeta, reservationStatusLabel, trendText } from "../utils/dashboard-helpers";
import { checkinApi } from "@/apis/checkin.api";
import { checkoutApi } from "@/apis/checkout.api";
import toast from "react-hot-toast";
import type { RoomStatus } from "@/types/hotel";
import OccupancyChartCard from "./occupancy-chart-card";
import UpcomingReservations from "./upcoming-reservations";
import DashboardAlertsCard from "./dashboard-alerts-card";
import DashboardMetricsGrid from "./dashboard-metrics-grid";
import RoomsFloorViewCard from "./rooms-floor-view-card";
import ArrivalsDeparturesCard from "./arrivals-departures-card";
import QuickActionsCard from "./quick-actions-card";
import HousekeepingQueueCard from "./housekeeping-queue-card";
import CashierSummaryCard from "./cashier-summary-card";

type StatusFilter = RoomStatus | "all";

export default function HotelDashboard() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedFloor, setSelectedFloor] = useState<number>(1);

  // Obtener todos los datos desde el hook personalizado
  const {
    rooms,
    reservations,
    invoices,
    sales,
    hotelSettings,
    snapshots,
    filteredRoomSnapshots,
    filteredRoomsLoading,
    updateRoomStatus,
    todayStr,
    yesterdayStr,
  } = useDashboardData(statusFilter, selectedFloor);

  // Funciones de Check-in y Check-out
  const completeCheckIn = async (reservationId: string) => {
    try {
      const reservation = reservations.find((r) => r.id === reservationId);
      if (!reservation) {
        toast.error("Reserva no encontrada");
        return;
      }

      const currentUserId = 1;

      const response = await checkinApi.realizar({
        reservation_id: Number(reservationId),
        check_in_date: new Date().toISOString().split("T")[0],
        check_in_time: new Date().toTimeString().split(" ")[0],
        actual_guests: (reservation.adults || 0) + (reservation.children || 0),
        checked_in_by: currentUserId,
        notes: "",
      });

      if (response.ok) {
        toast.success("Check-in realizado exitosamente");
        await updateRoomStatus(Number(reservation.roomId), "occupied");
        window.location.reload();
      } else {
        toast.error("Error al realizar el check-in");
      }
    } catch (error) {
      console.error("Error en check-in:", error);
      toast.error("Error al realizar el check-in");
    }
  };

  const completeCheckOut = async (reservationId: string) => {
    try {
      const reservation = reservations.find((r) => r.id === reservationId);
      if (!reservation) {
        toast.error("Reserva no encontrada");
        return;
      }

      const checkinResponse = await checkinApi.traerPorReserva(Number(reservationId));
      if (!checkinResponse.ok || !checkinResponse.checkin) {
        toast.error("No se encontró el check-in asociado");
        return;
      }

      const invoice = invoices.find((inv) => inv.reservationCode === reservation.code);
      const finalAmount = invoice?.total || reservation.total;

      const response = await checkoutApi.realizar({
        reservation_id: Number(reservationId),
        check_in_id: checkinResponse.checkin.id,
        actual_check_out: new Date().toISOString(),
        final_amount: finalAmount,
        payment_status: invoice?.balance === 0 ? "paid" : invoice?.balance ? "partial" : "pending",
        guest_id: Number(reservation.guestId),
        notes: "",
      });

      if (response.ok) {
        toast.success("Check-out realizado exitosamente");
        await updateRoomStatus(Number(reservation.roomId), "cleaning");
        window.location.reload();
      } else {
        toast.error(response.msg || "Error al realizar el check-out");
      }
    } catch (error) {
      console.error("Error en check-out:", error);
      toast.error("Error al realizar el check-out");
    }
  };

  const updateRoom = async (roomId: string, updates: Partial<{ status: string; notes?: string }>) => {
    if (updates.status) {
      await updateRoomStatus(Number(roomId), updates.status);
    }
  };

  const handleCancelReservation = async (reservationId: string) => {
    try {
      const { reservasApi } = await import("@/apis/reservas.api");
      const response = await reservasApi.cambiarEstado(Number(reservationId), 'cancelled');
      
      if (response.ok) {
        toast.success("Reserva cancelada exitosamente");
        window.location.reload();
      } else {
        toast.error("Error al cancelar la reserva");
      }
    } catch (error) {
      console.error("Error al cancelar reserva:", error);
      toast.error("Error al cancelar la reserva");
    }
  };

  // Obtener métricas y cálculos
  const {
    totalRooms,
    availableRooms,
    occupiedRooms,
    cleaningRooms,
    maintenanceRooms,
    outOfServiceRooms,
    arrivalsToday,
    departuresToday,
    unpaidReservations,
    todaySales,
    yesterdaySales,
    revenueTrend,
    floors,
    invoiceByReservation,
    floorSummaries,
    floorCounts,
    sapStatus,
    pendingToday,
  } = useDashboardMetrics({
    rooms,
    reservations,
    invoices,
    sales,
    snapshots,
    selectedFloor,
    todayStr,
    yesterdayStr,
  });

  // Obtener acciones y utilidades
  const { quickAction, contextLine, housekeepingQueue } = useDashboardActions({
    rooms,
    selectedFloor,
    hotelSettings,
    completeCheckIn,
    completeCheckOut,
    updateRoom,
  });

  const checkInsToday = arrivalsToday.length;
  const checkOutsToday = departuresToday.length;
  const revenueToday = todaySales;
  const overbookingRisk = Math.max(0, checkInsToday - availableRooms);

  const checkInsYesterday = reservations.filter(
    (reservation) =>
      reservation.checkIn === yesterdayStr &&
      (reservation.status === "pending" || reservation.status === "confirmed")
  ).length;
  const checkOutsYesterday = reservations.filter(
    (reservation) =>
      reservation.checkOut === yesterdayStr && reservation.status === "checkin"
  ).length;

  useEffect(() => {
    if (floors.length > 0 && !floors.includes(selectedFloor)) {
      setSelectedFloor(floors[0]);
    }
  }, [floors, selectedFloor]);

  const visibleRooms = filteredRoomSnapshots;

  return (
    <div className="space-y-5">
      <DashboardAlertsCard
        unpaidReservations={unpaidReservations}
        cleaningRooms={cleaningRooms}
        sapStatus={sapStatus}
        overbookingRisk={overbookingRisk}
      />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        <div className="xl:col-span-8 space-y-5">
          <DashboardMetricsGrid
            availableRooms={availableRooms}
            totalRooms={totalRooms}
            occupiedRooms={occupiedRooms}
            checkInsToday={checkInsToday}
            checkInsYesterday={checkInsYesterday}
            checkOutsToday={checkOutsToday}
            checkOutsYesterday={checkOutsYesterday}
            trendText={trendText}
          />

          <RoomsFloorViewCard
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            selectedFloor={selectedFloor}
            setSelectedFloor={setSelectedFloor}
            floorCounts={floorCounts}
            floorSummaries={floorSummaries}
            filteredRoomsLoading={filteredRoomsLoading}
            visibleRooms={visibleRooms}
            quickAction={quickAction}
            contextLine={contextLine}
            displayName={displayName}
            paxLabel={paxLabel}
          />

          <ArrivalsDeparturesCard
            arrivalsToday={arrivalsToday}
            departuresToday={departuresToday}
            invoiceByReservation={invoiceByReservation}
            hotelSettings={hotelSettings}
            paymentMeta={paymentMeta}
            reservationStatusLabel={reservationStatusLabel}
            completeCheckIn={completeCheckIn}
            completeCheckOut={completeCheckOut}
          />

          <UpcomingReservations 
            reservations={reservations}
            onCheckIn={completeCheckIn}
            onCancelReservation={handleCancelReservation}
          />

          <OccupancyChartCard compact />
        </div>

        <div className="xl:col-span-4">
          <div className="space-y-5 xl:sticky xl:top-24">
            <QuickActionsCard />

            <HousekeepingQueueCard
              housekeepingQueue={housekeepingQueue}
              updateRoom={updateRoom}
            />

            <CashierSummaryCard
              revenueToday={revenueToday}
              pendingToday={pendingToday}
              sapStatus={sapStatus}
              maintenanceRooms={maintenanceRooms}
              outOfServiceRooms={outOfServiceRooms}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
