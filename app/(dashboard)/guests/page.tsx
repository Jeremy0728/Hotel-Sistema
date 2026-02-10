import DashboardBreadcrumb from "@/components/layout/dashboard-breadcrumb";
import GuestsModule from "@/app/(dashboard)/guests/components/guests-page";

export default function GuestsPage() {
  return (
    <>
      <DashboardBreadcrumb title="Huéspedes" text="Huéspedes" />
      <GuestsModule />
    </>
  );
}
