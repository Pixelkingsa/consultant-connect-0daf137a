import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Share2, Copy, Users, Award, Mail, User, GitBranch
} from "lucide-react";

interface ReferredUser {
  id: string;
  name: string;
  email: string;
  date: string;
  status: string;
}

const Referrals = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [referralCode, setReferralCode] = useState("");
  const [referralLink, setReferralLink] = useState("");
  const [referredUsers, setReferredUsers] = useState<ReferredUser[]>([]);
  const [loading, setLoading] = useState(true);
  const networkRef = useRef<HTMLDivElement>(null);
  
  // Mock data for the statistics
  const [stats, setStats] = useState({
    totalDownlines: 6,
    activeConsultants: 5,
    teamSales: 5230,
    teamPerformance: "This month's team performance",
    commission: 523,
    commissionPercentage: 10
  });

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error || !user) {
          navigate("/auth");
          return;
        }
        
        setUser(user);
        
        // Generate referral code and link
        setReferralCode(`RF${user.id.substring(0, 6).toUpperCase()}`);
        setReferralLink(`${window.location.origin}/auth?ref=${user.id.substring(0, 8)}`);
        
        // Get user profile
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
          
        if (!profileError && profileData) {
          setProfile(profileData);
        }
        
        // Get referred users (downline)
        const { data: referredData, error: referredError } = await supabase
          .from("profiles")
          .select("id, full_name, created_at")
          .eq("upline_id", user.id);
          
        if (!referredError && referredData) {
          // Map to our expected format
          const mappedReferrals = referredData.map(ref => ({
            id: ref.id,
            name: ref.full_name || "Anonymous User",
            email: "****@example.com", // Privacy - don't show full email
            date: ref.created_at,
            status: "active"
          }));
          setReferredUsers(mappedReferrals);
          
          // Update stats based on actual data
          if (mappedReferrals.length > 0) {
            setStats(prev => ({
              ...prev,
              totalDownlines: mappedReferrals.length,
              activeConsultants: mappedReferrals.filter(r => r.status === "active").length
            }));
          }
        }
      } catch (error) {
        console.error("Error:", error);
        navigate("/auth");
      } finally {
        setLoading(false);
      }
    };
    
    checkUser();
  }, [navigate]);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `Your referral ${type} has been copied to clipboard.`,
    });
  };

  const sendReferralEmail = () => {
    toast({
      title: "Invitation Sent",
      description: "Your referral invitation has been sent successfully.",
    });
  };
  
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Downlines Card */}
          <Card className="border rounded-lg overflow-hidden shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-medium text-gray-700 mb-4">Total Downlines</h3>
              <div className="flex items-start">
                <div className="bg-purple-100 p-2 rounded-full mr-4">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold">{stats.totalDownlines}</p>
                  <p className="text-sm text-gray-500 mt-1">{stats.activeConsultants} active consultants</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Team Sales Card */}
          <Card className="border rounded-lg overflow-hidden shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-medium text-gray-700 mb-4">Team Sales</h3>
              <div className="flex items-start">
                <div className="bg-green-100 p-2 rounded-full mr-4">
                  <Award className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold">${stats.teamSales.toLocaleString()}</p>
                  <p className="text-sm text-gray-500 mt-1">{stats.teamPerformance}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Commission Card */}
          <Card className="border rounded-lg overflow-hidden shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-medium text-gray-700 mb-4">Commission</h3>
              <div className="flex items-start">
                <div className="bg-yellow-100 p-2 rounded-full mr-4">
                  <Award className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold">${stats.commission}</p>
                  <p className="text-sm text-gray-500 mt-1">{stats.commissionPercentage}% of total team sales</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Referral Network Visualization */}
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
        
        {/* Sharing Tools */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-3">
            <Card className="border rounded-lg overflow-hidden shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">Share Your Referral Link</h3>
                
                <div className="space-y-4">
                  {/* Referral code */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Your Referral Code</p>
                    <div className="flex">
                      <Input 
                        value={referralCode} 
                        readOnly 
                        className="rounded-r-none border-r-0"
                      />
                      <Button 
                        variant="outline" 
                        className="rounded-l-none border-l-0"
                        onClick={() => copyToClipboard(referralCode, "code")}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                    </div>
                  </div>
                  
                  {/* Referral link */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Your Referral Link</p>
                    <div className="flex">
                      <Input 
                        value={referralLink} 
                        readOnly 
                        className="rounded-r-none border-r-0"
                      />
                      <Button 
                        className="rounded-l-none"
                        onClick={() => copyToClipboard(referralLink, "link")}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                    </div>
                  </div>
                  
                  {/* Email invitation */}
                  <div className="space-y-2 pt-4 border-t mt-4">
                    <p className="text-sm font-medium">Send Invitation via Email</p>
                    <div className="flex gap-2">
                      <Input 
                        placeholder="friend@example.com" 
                        type="email"
                      />
                      <Button onClick={sendReferralEmail}>
                        <Mail className="h-4 w-4 mr-2" />
                        Send
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Referrals;
