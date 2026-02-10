import DashboardBreadcrumb from "@/components/layout/dashboard-breadcrumb";
import ReservationsModule from "@/app/(dashboard)/reservations/components/reservations-page";

export default function ReservationsPage() {
  return (
    <>
      <DashboardBreadcrumb title="Reservas" text="Reservas" />
      <ReservationsModule />
    </>
  );
}
