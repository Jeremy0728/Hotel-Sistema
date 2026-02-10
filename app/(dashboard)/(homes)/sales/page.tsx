import DashboardBreadcrumb from "@/components/layout/dashboard-breadcrumb";
import SalesPage from "@/app/(dashboard)/sales/components/sales-page";

export default function SalesRoute() {
  return (
    <>
      <DashboardBreadcrumb title="Ventas" text="Ventas" />
      <SalesPage />
    </>
  );
}
