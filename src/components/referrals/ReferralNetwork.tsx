
import { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { User, GitBranch } from "lucide-react";

interface ReferredUser {
  id: string;
  name: string;
  email: string;
  date: string;
  status: string;
}

interface ReferralNetworkProps {
  referredUsers: ReferredUser[];
  profile: any;
}

const ReferralNetwork = ({ referredUsers, profile }: ReferralNetworkProps) => {
  const networkRef = useRef<HTMLDivElement>(null);
  
  // Group users by generation level (assuming all are direct referrals for now)
  const directReferrals = referredUsers.slice(0, Math.min(5, referredUsers.length));
  
  return (
    <div className="mb-8">
      <Card className="border rounded-lg overflow-hidden shadow-sm">
        <CardContent className="p-6">
          <h3 className="text-lg font-medium text-gray-700 mb-4">My Referral Network</h3>
          <div ref={networkRef} className="flex flex-col items-center justify-center h-[400px] relative">
            {/* Root node (You) */}
            <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-10">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                  <User className="h-8 w-8 text-white" />
                </div>
                <p className="mt-2 font-medium text-sm">You</p>
                <p className="text-xs text-muted-foreground">{profile?.full_name || 'Team Leader'}</p>
              </div>
              
              {/* Connecting lines - only show if there are referrals */}
              {referredUsers.length > 0 && (
                <div className="absolute top-16 left-1/2 w-0.5 h-24 bg-purple-200 transform -translate-x-1/2"></div>
              )}
            </div>
            
            {/* First level - Direct referrals with clear connection lines */}
            {referredUsers.length > 0 ? (
              <div className="absolute top-[160px] left-1/2 transform -translate-x-1/2">
                <div className="flex justify-center gap-24">
                  {directReferrals.map((user, index) => (
                    <div key={user.id} className="flex flex-col items-center relative">
                      {/* Horizontal connection line to separate users */}
                      {index > 0 && (
                        <div className="absolute top-6 left-[-120px] w-[120px] h-0.5 bg-purple-200"></div>
                      )}
                      
                      {/* User node */}
                      <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center shadow-md border-2 border-white">
                        <User className="h-6 w-6 text-white" />
                      </div>
                      <div className="mt-2 text-center">
                        <p className="font-medium text-xs whitespace-nowrap">{user.name}</p>
                        <p className="text-[10px] text-muted-foreground">Joined {new Date(user.date).toLocaleDateString()}</p>
                        <div className={`text-[10px] mt-1 font-medium px-2 py-0.5 rounded-full inline-block ${
                          user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {user.status === 'active' ? 'Active' : 'Inactive'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="p-4 rounded-full bg-purple-100">
                  <GitBranch className="h-8 w-8 text-purple-500" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-700">No referrals yet</h3>
                <p className="mt-1 text-sm text-gray-500">Share your referral code to start building your network</p>
              </div>
            )}
            
            {/* Legend - to help understand the diagram */}
            <div className="absolute bottom-4 right-4 text-xs flex items-center gap-2">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-purple-600 rounded-full mr-1"></div>
                <span>You</span>
              </div>
              <div className="flex items-center ml-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full mr-1"></div>
                <span>Direct Referrals</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReferralNetwork;
