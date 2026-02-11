import DashboardBreadcrumb from "@/components/layout/dashboard-breadcrumb";
import HqDashboard from "@/app/(dashboard)/hq/components/hq-dashboard";

export default function HqPage() {
  return (
    <>
      <DashboardBreadcrumb title="HQ Super-admin" text="HQ" />
      <HqDashboard />
    </>
  );
}
