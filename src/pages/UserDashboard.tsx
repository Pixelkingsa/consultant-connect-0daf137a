
import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardStatsGrid from "@/components/dashboard/DashboardStatsGrid";
import PerformanceChart from "@/components/dashboard/PerformanceChart";
import UpcomingEvents from "@/components/dashboard/UpcomingEvents";
import { useDashboardData } from "@/hooks/useDashboardData";
import { getPerformanceData, getMonthlySalesTotal } from "@/utils/dashboardUtils";
import DashboardLoader from "@/components/dashboard/DashboardLoader";
import DashboardContent from "@/components/dashboard/DashboardContent";

const UserDashboard = () => {
  const { 
    user, 
    profile, 
    rankInfo, 
    salesData, 
    loading 
  } = useDashboardData();
  
  // Loading state
  if (loading) {
    return <DashboardLoader />;
  }
  
  // Calculate data for the dashboard
  const performanceData = getPerformanceData(salesData);
  const monthlySalesTotal = getMonthlySalesTotal(salesData);
  
  // Calculate rank progress
  const rankProgress = rankInfo ? 
    ((profile?.personal_volume || 0) / (rankInfo?.threshold_pv || 100) * 100).toFixed(0) : 
    "0";
  
  return (
    <AppLayout>
      <DashboardContent
        user={user}
        profile={profile}
        rankInfo={rankInfo}
        rankProgress={Number(rankProgress)}
        performanceData={performanceData}
        monthlySalesTotal={monthlySalesTotal}
      />
    </AppLayout>
  );
};

export default UserDashboard;
