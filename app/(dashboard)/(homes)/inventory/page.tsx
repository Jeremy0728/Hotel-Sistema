import DashboardBreadcrumb from "@/components/layout/dashboard-breadcrumb";
import InventoryModule from "@/app/(dashboard)/(homes)/inventory/components/inventory-page";

export default function InventoryPage() {
  return (
    <>
      <DashboardBreadcrumb title="Inventario" text="Inventario" />
      <InventoryModule />
    </>
  );
}
