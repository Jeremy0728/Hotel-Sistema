import DashboardBreadcrumb from "@/components/layout/dashboard-breadcrumb";
import ReservationsCalendar from "@/app/(dashboard)/reservations/components/reservations-calendar";

export default function ReservationsCalendarPage() {
  return (
    <>
      <DashboardBreadcrumb title="Calendario de reservas" text="Reservas" />
      <ReservationsCalendar />
    </>
  );
}
