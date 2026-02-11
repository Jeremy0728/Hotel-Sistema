import RoomsBoard from "@/app/(dashboard)/rooms/components/rooms-board";
import DashboardBreadcrumb from "@/components/layout/dashboard-breadcrumb";

export default function RoomsConfigurationPage() {
  return (
    <>
      <DashboardBreadcrumb title="Configuracion de habitaciones" text="Operaciones" />
      <RoomsBoard mode="admin" />
    </>
  );
}
