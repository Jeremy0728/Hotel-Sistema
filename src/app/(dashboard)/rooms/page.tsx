import DashboardBreadcrumb from "@/components/layout/dashboard-breadcrumb";
import RoomsModule from "@/app/(dashboard)/rooms/components/rooms-page";

export default function RoomsPage() {
  return (
    <>
      <DashboardBreadcrumb title="Habitaciones" text="Habitaciones" />
      <RoomsModule />
    </>
  );
}
