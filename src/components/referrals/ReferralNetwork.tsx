
import { useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { UserPlus, Users, Network } from "lucide-react";
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
          <h3 className="text-lg font-medium text-gray-700 mb-4 flex items-center">
            <Network className="h-5 w-5 text-purple-500 mr-2" />
            My Referral Network
          </h3>
          
          <Tabs defaultValue="network" className="w-full">
            <TabsList className="mb-6 bg-muted/60">
              <TabsTrigger value="network">Network View</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="timeline">Activity Timeline</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>
            
            <TabsContent value="network">
              <div ref={networkRef} className="flex flex-col items-center justify-start min-h-[600px] relative py-8 px-4">
                {/* Background - decorative gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-purple-50 to-white rounded-lg"></div>
                
                {/* Decorative elements */}
                <div className="absolute top-20 left-10 w-[300px] h-[300px] bg-green-50 rounded-full opacity-30 blur-3xl"></div>
                <div className="absolute bottom-20 right-10 w-[250px] h-[250px] bg-blue-50 rounded-full opacity-30 blur-3xl"></div>
                
                {/* Root node (You) */}
                <div className="mb-16 relative">
                  <RootNode name={profile?.full_name || 'Team Leader'} />
                
                  {/* Connection lines from root to first level users */}
                  {displayFirstLevel.map((user, index) => {
                    // Calculate position for connection lines
                    const totalUsers = displayFirstLevel.length;
                    const angleStep = 40; // degrees between connections
                    const startAngle = -angleStep * (totalUsers - 1) / 2;
                    const angle = startAngle + angleStep * index;
                    const radians = angle * (Math.PI / 180);
                    
                    // Line length and positioning
                    const lineLength = 90; // px
                    const endX = Math.sin(radians) * lineLength;
                    const endY = Math.cos(radians) * lineLength;
                    
                    return (
                      <div 
                        key={`root-connection-${index}`}
                        className="absolute top-1/2 left-1/2 w-[2px] bg-gradient-to-b from-purple-400 to-purple-600 origin-top"
                        style={{
                          height: `${lineLength}px`,
                          transform: `rotate(${angle + 180}deg)`,
                          opacity: referredUsers.length === 0 ? 0.5 : 0.8,
                          zIndex: 1
                        }}
                      >
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-purple-300 to-purple-500 animate-pulse"></div>
                      </div>
                    );
                  })}
                </div>
                
                {/* First level referrals */}
                <div className="mb-20 relative w-full">
                  <NetworkLevel 
                    users={displayFirstLevel} 
                    isPlaceholders={referredUsers.length === 0}
                    onUserClick={handleUserClick}
                    levelIndex={0}
                  />
                
                  {/* Connection lines between first and second level */}
                  {displayFirstLevel.length > 0 && displaySecondLevel.length > 0 && 
                    displaySecondLevel.map((user, index) => {
                      // Connect to closest first level user
                      const sourceIndex = Math.min(
                        Math.floor(index / (displaySecondLevel.length / displayFirstLevel.length)), 
                        displayFirstLevel.length - 1
                      );
                      
                      // Calculate position for these connections
                      const angle = -20 + (index % 3) * 20; // Spread connections
                      
                      return (
                        <div 
                          key={`level1-connection-${index}`}
                          className="absolute bottom-0 w-[2px] h-16 bg-gradient-to-b from-purple-300 to-purple-500"
                          style={{
                            left: `${(100 / (displayFirstLevel.length + 1)) * (sourceIndex + 1)}%`,
                            transform: `translateX(-50%) rotate(${angle}deg)`,
                            transformOrigin: 'top',
                            opacity: referredUsers.length === 0 ? 0.5 : 0.8,
                            zIndex: 1
                          }}
                        >
                          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-purple-200 to-purple-400 animate-pulse"></div>
                        </div>
                      );
                    })
                  }
                </div>
                
                {/* Second level referrals */}
                {displaySecondLevel.length > 0 && (
                  <div className="w-full">
                    <NetworkLevel 
                      users={displaySecondLevel} 
                      isPlaceholders={referredUsers.length === 0}
                      onUserClick={handleUserClick}
                      levelIndex={1}
                    />
                  </div>
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
                
                {/* Network statistics summary */}
                {referredUsers.length > 0 && (
                  <div className="mt-12 grid grid-cols-3 gap-6 w-full">
                    <div className="bg-white border border-purple-100 rounded-lg p-4 shadow-sm">
                      <div className="flex items-center">
                        <div className="bg-purple-100 p-2 rounded-full mr-3">
                          <Users className="h-4 w-4 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Total Team</p>
                          <p className="text-xl font-bold">{referredUsers.length}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white border border-green-100 rounded-lg p-4 shadow-sm">
                      <div className="flex items-center">
                        <div className="bg-green-100 p-2 rounded-full mr-3">
                          <Users className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Active Members</p>
                          <p className="text-xl font-bold">
                            {referredUsers.filter(u => u.status === "active").length}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white border border-blue-100 rounded-lg p-4 shadow-sm">
                      <div className="flex items-center">
                        <div className="bg-blue-100 p-2 rounded-full mr-3">
                          <Network className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Network Depth</p>
                          <p className="text-xl font-bold">2 Levels</p>
                        </div>
                      </div>
                    </div>
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
