import DashboardBreadcrumb from "@/components/layout/dashboard-breadcrumb";
import GuestProfilePage from "@/app/(dashboard)/guests/components/guest-profile-page";

interface GuestProfileRouteProps {
  params: Promise<{ guestId: string }>;
}

export default async function GuestProfileRoute({ params }: GuestProfileRouteProps) {
  const { guestId } = await params;
  
  return (
    <>
      <DashboardBreadcrumb title="Perfil de huesped" text="Huespedes" />
      <GuestProfilePage guestId={guestId} />
    </>
  );
}
