
import { useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { UserPlus } from "lucide-react";
import { ReferredUser } from "./types";
import RootNode from "./RootNode";
import NetworkLevel from "./NetworkLevel";
import UserDetailDialog from "./UserDetailDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReferralAnalytics from "./ReferralAnalytics";
import ReferralTimeline from "./ReferralTimeline";
import ReferralPerformance from "./ReferralPerformance";

interface ReferralNetworkProps {
  referredUsers: ReferredUser[];
  profile: any;
}

const ReferralNetwork = ({ referredUsers, profile }: ReferralNetworkProps) => {
  const networkRef = useRef<HTMLDivElement>(null);
  const [selectedUser, setSelectedUser] = useState<ReferredUser | null>(null);
  
  // Group users by generation level (assuming all are direct referrals for now)
  const firstLevelReferrals = referredUsers.slice(0, Math.min(3, referredUsers.length));
  const secondLevelReferrals = referredUsers.slice(3, Math.min(6, referredUsers.length));
  
  // Generate placeholder referrals when no real data is available
  const placeholderFirstLevel = referredUsers.length === 0 ? [
    {
      id: "placeholder1",
      name: "Jane Smith",
      email: "j****@example.com",
      date: new Date().toISOString(),
      status: "active"
    },
    {
      id: "placeholder2",
      name: "John Doe",
      email: "j****@example.com",
      date: new Date().toISOString(),
      status: "active"
    },
    {
      id: "placeholder3",
      name: "Alice Johnson",
      email: "a****@example.com",
      date: new Date().toISOString(), 
      status: "inactive"
    }
  ] : [];
  
  const placeholderSecondLevel = referredUsers.length === 0 ? [
    {
      id: "placeholder4",
      name: "Mike Wilson",
      email: "m****@example.com",
      date: new Date().toISOString(),
      status: "active"
    },
    {
      id: "placeholder5",
      name: "Sara Davis",
      email: "s****@example.com",
      date: new Date().toISOString(),
      status: "active"
    },
    {
      id: "placeholder6",
      name: "Tom Jackson",
      email: "t****@example.com",
      date: new Date().toISOString(),
      status: "active"
    },
  ] : [];
  
  // Use real referrals if available, otherwise use placeholders
  const displayFirstLevel = referredUsers.length > 0 ? firstLevelReferrals : placeholderFirstLevel;
  const displaySecondLevel = referredUsers.length > 0 ? secondLevelReferrals : placeholderSecondLevel;
  
  const handleUserClick = (user: ReferredUser) => {
    // Don't open dialog for placeholder examples
    if (referredUsers.length === 0) return;
    setSelectedUser(user);
  };
  
  return (
    <div className="mb-8">
      <Card className="border rounded-lg overflow-hidden shadow-sm">
        <CardContent className="p-6">
          <h3 className="text-lg font-medium text-gray-700 mb-4">My Referral Network</h3>
          
          <Tabs defaultValue="network" className="w-full">
            <TabsList className="mb-6 bg-muted/60">
              <TabsTrigger value="network">Network View</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="timeline">Activity Timeline</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>
            
            <TabsContent value="network">
              <div ref={networkRef} className="flex flex-col items-center justify-center min-h-[500px] relative py-8">
                {/* Background - light blue background with subtle pattern */}
                <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-blue-100/70 rounded-lg"></div>
                
                {/* Root node (You) */}
                <RootNode name={profile?.full_name || 'Team Leader'} />
                
                {/* First level referrals */}
                <div className="relative">
                  {/* Individual connecting lines from root to each first level referral */}
                  {displayFirstLevel.map((_, index) => {
                    const position = index - 1; // -1, 0, 1 for left, center, right
                    const horizontalOffset = position * 160; // Adjust based on your spacing
                    
                    return (
                      <div 
                        key={`root-connector-${index}`}
                        className="absolute top-[-36px] h-12 w-0.5 bg-gradient-to-b from-purple-300 to-purple-500"
                        style={{
                          left: `calc(50% + ${horizontalOffset}px)`,
                          transform: 'translateX(-50%)'
                        }}
                      >
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-purple-200 to-purple-400 animate-pulse"></div>
                      </div>
                    );
                  })}
                  
                  <NetworkLevel 
                    users={displayFirstLevel} 
                    isPlaceholders={referredUsers.length === 0}
                    onUserClick={handleUserClick}
                    levelIndex={0}
                  />
                </div>
                
                {/* Second level referrals */}
                {displaySecondLevel.length > 0 && (
                  <>
                    {/* Connecting lines from first to second level - now handled individually in NetworkLevel */}
                    <NetworkLevel 
                      users={displaySecondLevel} 
                      isPlaceholders={referredUsers.length === 0}
                      onUserClick={handleUserClick}
                      levelIndex={1}
                      parentPositions={[0, 1, 2]} // Provide parent positions for connections
                    />
                  </>
                )}
                
                {/* Empty state - only show when no referrals and not showing placeholders */}
                {referredUsers.length === 0 && (
                  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center w-full max-w-xs px-4">
                    <div className="flex items-center justify-center mb-3">
                      <UserPlus className="h-5 w-5 text-purple-500 mr-2" />
                      <span className="text-sm font-medium text-purple-700">These are placeholder examples</span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Share your referral code to start building your real network. 
                      Your referrals will appear connected to you in this visualization.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="analytics">
              <ReferralAnalytics referrals={referredUsers} isPlaceholder={referredUsers.length === 0} />
            </TabsContent>
            
            <TabsContent value="timeline">
              <ReferralTimeline referrals={referredUsers} isPlaceholder={referredUsers.length === 0} />
            </TabsContent>
            
            <TabsContent value="performance">
              <ReferralPerformance referrals={referredUsers} isPlaceholder={referredUsers.length === 0} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* User Detail Dialog */}
      <UserDetailDialog user={selectedUser} onClose={() => setSelectedUser(null)} />
    </div>
  );
};

export default ReferralNetwork;
