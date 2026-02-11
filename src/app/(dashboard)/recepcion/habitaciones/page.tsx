import RoomsBoard from "@/app/(dashboard)/rooms/components/rooms-board";
import DashboardBreadcrumb from "@/components/layout/dashboard-breadcrumb";

export default function ReceptionRoomsPage() {
  return (
    <>
      <DashboardBreadcrumb title="Habitaciones" text="Recepcion" />
      <RoomsBoard mode="ops" />
    </>
  );
}
