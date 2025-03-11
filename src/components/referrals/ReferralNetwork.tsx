
import { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { User, Users, GitBranch } from "lucide-react";

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
  
  return (
    <div className="mb-8">
      <Card className="border rounded-lg overflow-hidden shadow-sm">
        <CardContent className="p-6">
          <h3 className="text-lg font-medium text-gray-700 mb-4">My Referral Network</h3>
          <div ref={networkRef} className="flex flex-col items-center justify-center h-[400px] relative">
            {/* Root node (You) */}
            <div className="absolute top-16 left-1/2 transform -translate-x-1/2">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                  <User className="h-8 w-8 text-white" />
                </div>
                <p className="mt-2 font-medium text-sm">You</p>
                <p className="text-xs text-muted-foreground">{profile?.full_name || 'Team Leader'}</p>
              </div>
              
              {/* Connecting lines */}
              <div className="absolute top-16 left-1/2 w-0.5 h-16 bg-purple-200"></div>
            </div>
            
            {/* First level (direct referrals) */}
            <div className="absolute top-[130px] left-1/2 transform -translate-x-1/2 flex gap-16">
              {referredUsers.slice(0, 3).map((user, index) => (
                <div key={`level1-${index}`} className="flex flex-col items-center relative">
                  {/* Connection lines */}
                  <div className="absolute top-[-20px] left-1/2 w-0.5 h-8 bg-purple-200 transform -translate-x-1/2"></div>
                  
                  {/* User node */}
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center shadow-md border-2 border-white">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <p className="mt-1 font-medium text-xs">{user.name}</p>
                  <p className="text-[10px] text-muted-foreground">Consultant</p>
                  
                  {/* Vertical connection to next level */}
                  <div className="absolute top-12 left-1/2 w-0.5 h-12 bg-purple-200 transform -translate-x-1/2"></div>
                </div>
              ))}
            </div>
            
            {/* Second level referrals */}
            <div className="absolute top-[210px] left-1/2 transform -translate-x-1/2 flex gap-32">
              {[1, 2, 3].map((_, index) => (
                <div key={`level2-${index}`} className="flex gap-2">
                  {[1, 2].map((subIndex) => (
                    <div key={`sublevel2-${index}-${subIndex}`} className="flex flex-col items-center relative">
                      {/* Connection lines */}
                      <div className="absolute top-[-20px] left-1/2 w-0.5 h-8 bg-purple-100 transform -translate-x-1/2"></div>
                      
                      {/* User node */}
                      <div className="w-10 h-10 bg-purple-400 rounded-full flex items-center justify-center shadow-sm border-2 border-white">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <p className="text-[10px] mt-1 text-gray-600">Member</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            
            {/* Network background decoration */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
              <GitBranch className="h-64 w-64 text-purple-900" />
            </div>
            
            {/* Empty state */}
            {referredUsers.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="p-4 rounded-full bg-purple-100">
                  <Users className="h-8 w-8 text-purple-500" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-700">No referrals yet</h3>
                <p className="mt-1 text-sm text-gray-500">Share your referral link to start building your network</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReferralNetwork;
