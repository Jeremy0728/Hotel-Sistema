import DashboardBreadcrumb from "@/components/layout/dashboard-breadcrumb";
import GuestProfilePage from "@/app/(dashboard)/guests/components/guest-profile-page";

interface GuestProfileRouteProps {
  params: { guestId: string };
}

export default function GuestProfileRoute({ params }: GuestProfileRouteProps) {
  return (
    <>
      <DashboardBreadcrumb title="Perfil de huesped" text="Huespedes" />
      <GuestProfilePage guestId={params.guestId} />
    </>
  );
}
