import DashboardBreadcrumb from "@/components/layout/dashboard-breadcrumb";
import HotelSettingsForm from "@/app/(dashboard)/hotel-settings/components/hotel-settings-form";

export default function HotelSettingsPage() {
  return (
    <>
      <DashboardBreadcrumb title="Configuracion del hotel" text="Configuracion" />
      <HotelSettingsForm />
    </>
  );
}
