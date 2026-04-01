import DashboardBreadcrumb from "@/components/layout/dashboard-breadcrumb";
import SaleDetail from "@/app/(dashboard)/sales/components/sale-detail";

interface SaleDetailRouteProps {
  params: { saleId: string };
}

export default async function SaleDetailRoute({ params }: SaleDetailRouteProps) {
  const { saleId } = await params;
  return (
    <>
      <DashboardBreadcrumb title="Detalle de venta" text="Ventas" />
      <SaleDetail saleId={saleId} />
    </>
  );
}
