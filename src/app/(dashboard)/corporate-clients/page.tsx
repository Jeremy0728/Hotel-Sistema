import DashboardBreadcrumb from "@/components/layout/dashboard-breadcrumb";
import CorporateClientsPage from "@/app/(dashboard)/corporate-clients/components/corporate-clients-page";

export default function CorporateClientsRoute() {
  return (
    <>
      <DashboardBreadcrumb title="Clientes corporativos" text="Clientes" />
      <CorporateClientsPage />
    </>
  );
}
