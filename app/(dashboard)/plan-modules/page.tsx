import DashboardBreadcrumb from "@/components/layout/dashboard-breadcrumb";
import PlanModulesPage from "@/app/(dashboard)/plan-modules/components/plan-modules-page";

export default function PlanModules() {
  return (
    <>
      <DashboardBreadcrumb title="Plan y modulos" text="Plan" />
      <PlanModulesPage />
    </>
  );
}
