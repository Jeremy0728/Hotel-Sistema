import DashboardBreadcrumb from "@/components/layout/dashboard-breadcrumb";
import ServiceSchedule from "@/app/(dashboard)/services/components/service-schedule";

export default function ServiceScheduleRoute() {
  return (
    <>
      <DashboardBreadcrumb title="Agenda de servicios" text="Servicios" />
      <ServiceSchedule />
    </>
  );
}
