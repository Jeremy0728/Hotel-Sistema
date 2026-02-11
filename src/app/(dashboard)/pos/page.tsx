import DashboardBreadcrumb from "@/components/layout/dashboard-breadcrumb";
import PosPage from "@/app/(dashboard)/pos/components/pos-page";

export default function PosRoute() {
  return (
    <>
      <DashboardBreadcrumb title="Punto de venta" text="Ventas" />
      <PosPage />
    </>
  );
}
