import DashboardBreadcrumb from "@/components/layout/dashboard-breadcrumb";
import SaleDetail from "@/app/(dashboard)/sales/components/sale-detail";

interface SaleDetailRouteProps {
  params: { saleId: string };
}

export default function SaleDetailRoute({ params }: SaleDetailRouteProps) {
  return (
    <>
      <DashboardBreadcrumb title="Detalle de venta" text="Ventas" />
      <SaleDetail saleId={params.saleId} />
    </>
  );
}
