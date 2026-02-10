import DashboardBreadcrumb from "@/components/layout/dashboard-breadcrumb";
import CheckInModule from "@/app/(dashboard)/checkin/components/checkin-page";

export default function CheckInPage() {
  return (
    <>
      <DashboardBreadcrumb title="Check-in" text="Check-in" />
      <CheckInModule />
    </>
  );
}
