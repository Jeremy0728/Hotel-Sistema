import DashboardBreadcrumb from "@/components/layout/dashboard-breadcrumb";
import RolesPage from "@/app/(dashboard)/roles/components/roles-page";

export default function RolesView() {
  return (
    <>
      <DashboardBreadcrumb title="Roles y permisos" text="Admin" />
      <RolesPage />
    </>
  );
}
