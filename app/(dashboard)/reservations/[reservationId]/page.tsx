import DashboardBreadcrumb from "@/components/layout/dashboard-breadcrumb";
import ReservationDetail from "@/app/(dashboard)/reservations/components/reservation-detail";

interface ReservationDetailPageProps {
  params: {
    reservationId: string;
  };
}

export default function ReservationDetailPage({ params }: ReservationDetailPageProps) {
  return (
    <>
      <DashboardBreadcrumb title="Detalle de reserva" text="Reservas" />
      <ReservationDetail reservationId={params.reservationId} />
    </>
  );
}
