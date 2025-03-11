
import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { useDashboardData } from "@/hooks/useDashboardData";
import { getPerformanceData, getMonthlySalesTotal } from "@/utils/dashboardUtils";
import DashboardLoader from "@/components/dashboard/DashboardLoader";
import DashboardContent from "@/components/dashboard/DashboardContent";
import { Loader } from "@/components/ui/loader";
import { useToast } from "@/hooks/use-toast";

const UserDashboard = () => {
  const { toast } = useToast();
  const { 
    user, 
    profile, 
    rankInfo, 
    salesData, 
    loading,
    error 
  } = useDashboardData();
  
  // Show error state
  if (error) {
    toast({
      title: "Error loading dashboard",
      description: "Please try refreshing the page",
      variant: "destructive",
    });
    
    return (
      <AppLayout>
        <div className="container max-w-7xl mx-auto px-4 lg:px-8 py-8 flex flex-col items-center justify-center min-h-[50vh]">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Unable to load dashboard data</h2>
            <p className="text-muted-foreground">Please refresh the page or try again later</p>
          </div>
        </div>
      </AppLayout>
    );
  }
  
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
