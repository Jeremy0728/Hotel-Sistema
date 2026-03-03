import DashboardBreadcrumb from "@/components/layout/dashboard-breadcrumb";
import ReservationDetail from "@/app/(dashboard)/reservations/components/reservation-detail";

interface ReservationDetailPageProps {
  params: Promise<{
    reservationId: string;
  }>;
}

export default async function ReservationDetailPage({ params }: ReservationDetailPageProps) {
  const { reservationId } = await params;
  
  return (
    <>
      <DashboardBreadcrumb title="Detalle de reserva" text="Reservas" />
      <ReservationDetail reservationId={reservationId} />
    </>
  );
}
