
import React from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardStatsGrid from "@/components/dashboard/DashboardStatsGrid";
import PerformanceChart from "@/components/dashboard/PerformanceChart";
import UpcomingEvents from "@/components/dashboard/UpcomingEvents";

interface DashboardContentProps {
  user: any;
  profile: any;
  rankInfo: any;
  rankProgress: number;
  performanceData: any[];
  monthlySalesTotal: number;
}

const DashboardContent = ({
  user,
  profile,
  rankInfo,
  rankProgress,
  performanceData,
  monthlySalesTotal
}: DashboardContentProps) => {
  return (
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
        rankProgress={rankProgress}
        nextRankName={rankInfo?.name || "Loading..."}
      />
      
      {/* Charts and Events */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <PerformanceChart data={performanceData} />
        <UpcomingEvents />
      </div>
    </div>
  );
};

export default DashboardContent;
