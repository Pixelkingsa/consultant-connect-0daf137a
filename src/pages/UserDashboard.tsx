
import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardStatsGrid from "@/components/dashboard/DashboardStatsGrid";
import PerformanceChart from "@/components/dashboard/PerformanceChart";
import UpcomingEvents from "@/components/dashboard/UpcomingEvents";
import { useDashboardData } from "@/hooks/useDashboardData";
import { getPerformanceData, getMonthlySalesTotal } from "@/utils/dashboardUtils";

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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <p className="text-lg text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
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
      <div className="container max-w-7xl mx-auto px-4 lg:px-8 py-8">
        {/* Dashboard Header */}
        <DashboardHeader 
          profileName={profile?.full_name}
          userEmail={user?.email}
          rankName={rankInfo?.name}
          teamSize={profile?.team_size || 0}
          personalVolume={profile?.personal_volume || 0}
        />
        
        {/* Stats Cards */}
        <DashboardStatsGrid 
          monthlySalesTotal={monthlySalesTotal}
          teamSize={profile?.team_size || 0}
          personalVolume={profile?.personal_volume || 0}
          groupVolume={profile?.group_volume || 0}
          rankProgress={Number(rankProgress)}
          nextRankName={rankInfo?.name || "Loading..."}
        />
        
        {/* Charts and Events */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <PerformanceChart data={performanceData} />
          <UpcomingEvents />
        </div>
      </div>
    </AppLayout>
  );
};

export default UserDashboard;
