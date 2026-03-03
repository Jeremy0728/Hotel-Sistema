import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ReservationStatus } from "@/types/hotel";

const statusOptions: { value: ReservationStatus | "all"; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "pending", label: "Pendiente" },
  { value: "confirmed", label: "Confirmada" },
  { value: "checkin", label: "Check-in" },
  { value: "checkout", label: "Check-out" },
  { value: "cancelled", label: "Cancelada" },
];

const channelOptions = [
  { value: "all", label: "Todos" },
  { value: "direct", label: "Directo" },
  { value: "ota", label: "OTA" },
  { value: "corporate", label: "Corporativo" },
];

const paymentOptions = [
  { value: "all", label: "Todos" },
  { value: "paid", label: "Pagado" },
  { value: "pending", label: "Pendiente" },
  { value: "none", label: "Sin factura" },
];

interface ReservationFiltersCardProps {
  search: string;
  setSearch: (value: string) => void;
  statusFilter: ReservationStatus | "all";
  setStatusFilter: (value: ReservationStatus | "all") => void;
  channelFilter: string;
  setChannelFilter: (value: string) => void;
  paymentFilter: string;
  setPaymentFilter: (value: string) => void;
  roomFilter: string;
  setRoomFilter: (value: string) => void;
  guestFilter: string;
  setGuestFilter: (value: string) => void;
  dateFrom: string;
  setDateFrom: (value: string) => void;
  dateTo: string;
  setDateTo: (value: string) => void;
  roomOptions: { value: string; label: string }[];
  guestOptions: { value: string; label: string }[];
  applyView: (view: "today" | "pending" | "week") => void;
}

export default function ReservationFiltersCard({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  channelFilter,
  setChannelFilter,
  paymentFilter,
  setPaymentFilter,
  roomFilter,
  setRoomFilter,
  guestFilter,
  setGuestFilter,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  roomOptions,
  guestOptions,
  applyView,
}: ReservationFiltersCardProps) {
  return (
    <Card className="p-4 flex flex-col gap-4 md:sticky md:top-4 z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur">
      <div className="flex flex-col lg:flex-row lg:items-center gap-3 justify-between">
        <div>
          <h2 className="text-lg font-semibold">Reservas</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-300">
            Administración de reservas y estados
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => applyView("today")}>
            Hoy
          </Button>
          <Button variant="outline" size="sm" onClick={() => applyView("pending")}>
            Pendientes pago
          </Button>
          <Button variant="outline" size="sm" onClick={() => applyView("week")}>
            Llegadas semana
          </Button>
          <Button asChild>
            <Link href="/reservations/new">Nueva reserva</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
        <Input
          placeholder="Buscar por código o huésped"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as ReservationStatus | "all")}
        >
          <SelectTrigger>
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={channelFilter} onValueChange={setChannelFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Canal" />
          </SelectTrigger>
          <SelectContent>
            {channelOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={paymentFilter} onValueChange={setPaymentFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Pago" />
          </SelectTrigger>
          <SelectContent>
            {paymentOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={roomFilter} onValueChange={setRoomFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Habitación" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {roomOptions.map((room) => (
              <SelectItem key={room.value} value={room.value}>
                {room.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={guestFilter} onValueChange={setGuestFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Huésped" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {guestOptions.map((guest) => (
              <SelectItem key={guest.value} value={guest.value}>
                {guest.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
        <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
      </div>
    </Card>
  );
}
