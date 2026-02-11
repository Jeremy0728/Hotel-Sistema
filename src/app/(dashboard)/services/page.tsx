import DashboardBreadcrumb from "@/components/layout/dashboard-breadcrumb";
import ServicesPage from "@/app/(dashboard)/services/components/services-page";

export default function ServicesRoute() {
  return (
    <>
      <DashboardBreadcrumb title="Servicios" text="Servicios" />
      <ServicesPage />
    </>
  );
}
