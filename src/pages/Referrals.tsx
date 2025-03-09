
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
  Share2, Copy, Users, Award, Mail
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
              <div ref={networkRef} className="flex flex-col items-center justify-center h-[400px] relative">
                {/* You */}
                <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 bg-gray-200 rounded-full mb-2"></div>
                    <p className="text-sm font-medium">You</p>
                  </div>
                </div>
                
                {/* First level referrals */}
                <div className="absolute bottom-1/3 left-0 right-0 flex justify-around">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={`level1-${i}`} className="flex flex-col items-center">
                      <div className="w-14 h-14 bg-gray-200 rounded-full mb-1"></div>
                    </div>
                  ))}
                </div>
                
                {/* Second level referrals (smaller) */}
                <div className="absolute bottom-1/4 left-1/4 right-1/4 flex justify-around">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div key={`level2-${i}`} className="flex flex-col items-center">
                      <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                    </div>
                  ))}
                </div>
                
                {/* Third level referrals (smallest) */}
                <div className="absolute bottom-10 left-1/3 right-1/3 flex justify-around">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={`level3-${i}`} className="flex flex-col items-center">
                      <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                    </div>
                  ))}
                </div>
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
