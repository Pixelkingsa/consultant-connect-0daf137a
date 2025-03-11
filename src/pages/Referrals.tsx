
import { useReferrals } from "@/hooks/useReferrals";
import AppLayout from "@/components/layout/AppLayout";
import ReferralStats from "@/components/referrals/ReferralStats";
import ReferralNetwork from "@/components/referrals/ReferralNetwork";
import ReferralSharing from "@/components/referrals/ReferralSharing";

const Referrals = () => {
  const { 
    profile,
    referralCode,
    referralLink,
    referredUsers,
    stats,
    loading 
  } = useReferrals();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <p className="text-lg text-muted-foreground">Loading your referrals...</p>
        </div>
      </div>
    );
  }
  
  return (
    <AppLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">My Referrals</h1>
        
        {/* Stats Cards */}
        <ReferralStats 
          totalDownlines={stats.totalDownlines}
          activeConsultants={stats.activeConsultants}
          teamSales={stats.teamSales}
          teamPerformance={stats.teamPerformance}
          commission={stats.commission}
          commissionPercentage={stats.commissionPercentage}
        />
        
        {/* Referral Network Visualization */}
        <ReferralNetwork 
          referredUsers={referredUsers} 
          profile={profile} 
        />
        
        {/* Sharing Tools */}
        <ReferralSharing 
          referralCode={referralCode} 
          referralLink={referralLink} 
        />
      </div>
    </AppLayout>
  );
};

export default Referrals;
