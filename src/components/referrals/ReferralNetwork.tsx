
import { useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { User, GitBranch, UserPlus, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

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
  const [selectedUser, setSelectedUser] = useState<ReferredUser | null>(null);
  
  // Group users by generation level (assuming all are direct referrals for now)
  const directReferrals = referredUsers.slice(0, Math.min(5, referredUsers.length));
  
  // Generate placeholder referrals when no real data is available
  const placeholderReferrals = referredUsers.length === 0 ? [
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
  
  // Use real referrals if available, otherwise use placeholders but with visual indicator
  const displayReferrals = referredUsers.length > 0 ? directReferrals : placeholderReferrals;
  
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
              
              {/* Connecting lines - show if there are referrals or placeholders */}
              <div className="absolute top-16 left-1/2 w-0.5 h-24 bg-purple-200 transform -translate-x-1/2"></div>
            </div>
            
            {/* Referral Display - showing real or placeholder referrals */}
            <div className="absolute top-[160px] left-1/2 transform -translate-x-1/2">
              <div className="flex justify-center" style={{ gap: displayReferrals.length > 1 ? '7rem' : '0' }}>
                {displayReferrals.map((user, index) => (
                  <div key={user.id} className="flex flex-col items-center relative">
                    {/* Horizontal connection line to separate users */}
                    {index > 0 && (
                      <div className="absolute top-6 right-[calc(100%+0.5rem)] w-[7rem] h-0.5 bg-purple-200"></div>
                    )}
                    
                    {/* User node with proper styling and click handler */}
                    <div 
                      className={`w-12 h-12 ${referredUsers.length === 0 ? 'bg-purple-400' : 'bg-purple-500'} 
                                rounded-full flex items-center justify-center shadow-md border-2 border-white
                                ${referredUsers.length === 0 ? 'border-dashed' : 'cursor-pointer hover:ring-2 hover:ring-purple-300 transition-all'}`}
                      onClick={() => handleUserClick(user)}
                    >
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div className="mt-2 text-center">
                      <p className="font-medium text-xs whitespace-nowrap">{user.name}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {referredUsers.length === 0 ? 'Example Referral' : `Joined ${new Date(user.date).toLocaleDateString()}`}
                      </p>
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
            
            {/* Empty state - only show when no referrals and not showing placeholders */}
            {referredUsers.length === 0 && (
              <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-center opacity-80">
                <div className="flex items-center justify-center mb-3">
                  <UserPlus className="h-5 w-5 text-purple-500 mr-1" />
                  <span className="text-sm font-medium text-purple-700">These are placeholder examples</span>
                </div>
                <p className="text-xs text-gray-500 max-w-xs">
                  Share your referral code to start building your real network. 
                  Your referrals will appear connected to you in this visualization.
                </p>
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
      
      {/* User Detail Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={(isOpen) => !isOpen && setSelectedUser(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Referral Details</DialogTitle>
            <DialogDescription>
              Information about your referral
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-4 py-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16 bg-purple-100 text-purple-600">
                  <AvatarFallback className="text-xl font-semibold">
                    {selectedUser.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  <h3 className="text-lg font-medium">{selectedUser.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <div className={`text-sm mt-1 font-medium px-2 py-1 rounded-full inline-block ${
                    selectedUser.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {selectedUser.status === 'active' ? 'Active' : 'Inactive'}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Joined</p>
                  <p className="text-sm">{new Date(selectedUser.date).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="pt-2">
                <p className="text-sm font-medium text-muted-foreground mb-2">Recent Activity</p>
                <div className="bg-muted rounded-md p-3 text-sm">
                  <p className="text-center text-muted-foreground">Activity data coming soon</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-end">
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReferralNetwork;
