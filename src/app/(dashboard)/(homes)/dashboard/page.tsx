import HotelDashboard from "@/app/(dashboard)/(homes)/dashboard/components/hotel-dashboard";
import DashboardBreadcrumb from "@/components/layout/dashboard-breadcrumb";
export default function DashboardPage() {
  return (
    <>
      <DashboardBreadcrumb title="Dashboard" text="Dashboard" />
      <HotelDashboard />
    </>
  );
}
