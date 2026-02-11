import DashboardBreadcrumb from "@/components/layout/dashboard-breadcrumb";
import ReservationWizard from "@/app/(dashboard)/reservations/components/reservation-wizard";

export default function NewReservationPage() {
  return (
    <>
      <DashboardBreadcrumb title="Nueva Reserva" text="Reservas" />
      <ReservationWizard />
    </>
  );
}
