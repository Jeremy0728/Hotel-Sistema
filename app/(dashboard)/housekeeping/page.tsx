import DashboardBreadcrumb from "@/components/layout/dashboard-breadcrumb";
import HousekeepingPage from "@/app/(dashboard)/housekeeping/components/housekeeping-page";

export default function HousekeepingView() {
  return (
    <>
      <DashboardBreadcrumb title="Housekeeping" text="Operaciones" />
      <HousekeepingPage />
    </>
  );
}
