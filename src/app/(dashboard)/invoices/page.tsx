import DashboardBreadcrumb from "@/components/layout/dashboard-breadcrumb";
import InvoicesPage from "@/app/(dashboard)/invoices/components/invoices-page";

export default function InvoicesRoute() {
  return (
    <>
      <DashboardBreadcrumb title="Facturacion" text="Facturacion" />
      <InvoicesPage />
    </>
  );
}
