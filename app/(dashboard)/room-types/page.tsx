import DashboardBreadcrumb from "@/components/layout/dashboard-breadcrumb";
import RoomTypesPage from "@/app/(dashboard)/room-types/components/room-types-page";

export default function RoomTypesRoute() {
  return (
    <>
      <DashboardBreadcrumb title="Tipos de habitacion" text="Habitaciones" />
      <RoomTypesPage />
    </>
  );
}
