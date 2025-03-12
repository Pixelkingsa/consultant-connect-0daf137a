
import { useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { User, UserPlus, X } from "lucide-react";
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
          <h3 className="text-lg font-medium text-gray-700 mb-6">My Referral Network</h3>
          <div ref={networkRef} className="flex flex-col items-center justify-center min-h-[500px] relative py-8">
            {/* Background - light blue similar to the image */}
            <div className="absolute inset-0 bg-blue-50 rounded-lg"></div>
            
            {/* Root node (You) */}
            <div className="relative z-10">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-purple-500">
                  <User className="h-8 w-8 text-purple-600" />
                </div>
                <p className="mt-3 font-medium text-sm">You</p>
                <p className="text-xs text-muted-foreground mt-1">{profile?.full_name || 'Team Leader'}</p>
              </div>
            </div>
            
            {/* First level referrals */}
            <div className="mt-16 relative">
              {/* Vertical connector line to first level */}
              <div className="absolute top-[-3rem] left-1/2 w-0.5 h-12 bg-purple-300 transform -translate-x-1/2"></div>
              
              {/* First level referrals */}
              <div className="flex justify-center space-x-20 relative">
                {displayFirstLevel.map((user, index) => (
                  <div key={user.id} className="flex flex-col items-center relative">
                    {/* Connecting lines */}
                    <div className="absolute top-4 w-20 h-0.5 bg-purple-300">
                      {index === 0 && <div className="absolute right-0 w-20 h-0.5 bg-purple-300"></div>}
                      {index === displayFirstLevel.length - 1 && <div className="absolute left-[-20px] w-20 h-0.5 bg-purple-300"></div>}
                    </div>
                    
                    {/* The middle node needs special horizontal connector */}
                    {index === 1 && displayFirstLevel.length === 3 && (
                      <div className="absolute left-1/2 top-4 w-40 h-0.5 bg-purple-300 transform -translate-x-1/2"></div>
                    )}
                    
                    {/* User node */}
                    <div 
                      className={`w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-md border-2 
                              ${referredUsers.length === 0 ? 'border-dashed border-purple-300' : 'border-purple-500 cursor-pointer hover:border-purple-700 transition-all'}`}
                      onClick={() => handleUserClick(user)}
                    >
                      <Avatar className="h-12 w-12 bg-purple-100">
                        <AvatarFallback className="text-purple-600 font-medium">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <p className="mt-2 font-medium text-xs max-w-[120px] text-center">{user.name}</p>
                    {!referredUsers.length && (
                      <p className="text-[10px] text-muted-foreground mt-1 text-center">Example Referral</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Second level referrals */}
            {displaySecondLevel.length > 0 && (
              <div className="mt-16 relative">
                {/* Connecting lines from first to second level */}
                {displayFirstLevel.map((_, index) => (
                  <div 
                    key={`connector-${index}`} 
                    className="absolute top-[-3rem] w-0.5 h-12 bg-purple-300"
                    style={{ 
                      left: `${index === 0 ? 'calc(50% - 10rem)' : index === 1 ? '50%' : 'calc(50% + 10rem)'}`,
                      transform: 'translateX(-50%)'
                    }}
                  />
                ))}
                
                {/* Second level referrals */}
                <div className="grid grid-cols-3 gap-x-20">
                  {displaySecondLevel.map((user, index) => (
                    <div key={user.id} className="flex flex-col items-center">
                      {/* User node */}
                      <div 
                        className={`w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-md border-2 
                                ${referredUsers.length === 0 ? 'border-dashed border-purple-300' : 'border-purple-500 cursor-pointer hover:border-purple-700 transition-all'}`}
                        onClick={() => handleUserClick(user)}
                      >
                        <Avatar className="h-12 w-12 bg-purple-100">
                          <AvatarFallback className="text-purple-600 font-medium">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <p className="mt-2 font-medium text-xs max-w-[120px] text-center">{user.name}</p>
                      {!referredUsers.length && (
                        <p className="text-[10px] text-muted-foreground mt-1 text-center">Example Referral</p>
                      )}
                    </div>
                  ))}
                </div>
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
            <div className="space-y-5 py-4">
              <div className="flex items-center space-x-5">
                <Avatar className="h-16 w-16 bg-purple-100 text-purple-600">
                  <AvatarFallback className="text-xl font-semibold">
                    {selectedUser.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  <h3 className="text-lg font-medium">{selectedUser.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{selectedUser.email}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6 pt-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <div className={`text-sm mt-2 font-medium px-2 py-1 rounded-full inline-block ${
                    selectedUser.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {selectedUser.status === 'active' ? 'Active' : 'Inactive'}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Joined</p>
                  <p className="text-sm mt-2">{new Date(selectedUser.date).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="pt-2">
                <p className="text-sm font-medium text-muted-foreground mb-3">Recent Activity</p>
                <div className="bg-muted rounded-md p-4 text-sm">
                  <p className="text-center text-muted-foreground">Activity data coming soon</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-end pt-4">
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
