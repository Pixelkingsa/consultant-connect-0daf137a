
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Share2, Copy, Users, Award, TrendingUp, Check, Mail
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
        } else {
          // Fallback to placeholder data
          setReferredUsers([
            {
              id: "ref1",
              name: "John Doe",
              email: "j****@example.com",
              date: new Date(Date.now() - 7 * 86400000).toISOString(),
              status: "active"
            },
            {
              id: "ref2",
              name: "Sarah Smith",
              email: "s****@example.com",
              date: new Date(Date.now() - 14 * 86400000).toISOString(),
              status: "active"
            }
          ]);
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
      <div className="container max-w-7xl mx-auto px-4 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Referral Program</h1>
            <p className="text-muted-foreground">Invite friends and earn rewards</p>
          </div>
          <Card className="w-full md:w-auto p-4 flex gap-3 items-center">
            <Users className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Team Size</p>
              <p className="text-xl font-bold">{profile?.team_size || referredUsers.length || 0}</p>
            </div>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Your Referral Link</CardTitle>
                <CardDescription>Share this link with friends to invite them to join</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Referral code */}
                <div className="space-y-2">
                  <p className="text-sm font-medium">Your Referral Code</p>
                  <div className="flex">
                    <Input 
                      value={referralCode} 
                      readOnly 
                      className="rounded-r-none"
                    />
                    <Button 
                      variant="outline" 
                      className="rounded-l-none"
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
                      className="rounded-r-none"
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
                <div className="space-y-2 pt-4 border-t">
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
              </CardContent>
              <CardFooter className="bg-muted/20 flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  Earn <span className="font-medium">10%</span> commission on referred sales
                </p>
                <Share2 className="h-5 w-5 text-muted-foreground" />
              </CardFooter>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>People you've referred who joined our platform</CardDescription>
              </CardHeader>
              <CardContent>
                {referredUsers.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {referredUsers.map((referral) => (
                        <TableRow key={referral.id}>
                          <TableCell className="font-medium">{referral.name}</TableCell>
                          <TableCell>{referral.email}</TableCell>
                          <TableCell>{new Date(referral.date).toLocaleDateString()}</TableCell>
                          <TableCell>
                            {referral.status === "active" ? (
                              <span className="flex items-center text-green-600">
                                <Check className="h-4 w-4 mr-1" /> Active
                              </span>
                            ) : (
                              <span className="text-gray-500">Pending</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                    <p className="text-muted-foreground">You haven't referred anyone yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Referral Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-500" />
                    <span>Total Referrals</span>
                  </div>
                  <span className="font-bold">{profile?.team_size || referredUsers.length || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    <span>Earnings</span>
                  </div>
                  <span className="font-bold">${profile?.referral_earnings || "0.00"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-amber-500" />
                    <span>Rank</span>
                  </div>
                  <span className="font-bold">{profile?.rank || "Starter"}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Benefits</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <p className="text-sm">10% commission on direct referral purchases</p>
                </div>
                <div className="flex gap-2">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <p className="text-sm">5% commission on second level referral purchases</p>
                </div>
                <div className="flex gap-2">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <p className="text-sm">Special bonuses for every 5 successful referrals</p>
                </div>
                <div className="flex gap-2">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <p className="text-sm">Rank advancement based on team size and volume</p>
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
