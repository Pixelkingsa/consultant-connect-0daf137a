
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Share, Copy, Award, TrendingUp, UserPlus } from "lucide-react";
import { motion } from "framer-motion";

interface Downline {
  id: string;
  name: string;
  avatar: string;
  email: string;
  rank: string;
  signupDate: string;
  team: number;
  sales: number;
}

const Referrals = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  
  // Mock referral link
  const referralLink = "https://vamna.com/join?ref=user123";
  
  // Mock downlines data
  const downlines: Downline[] = [
    {
      id: "1",
      name: "Sarah Johnson",
      avatar: "https://i.pravatar.cc/150?img=5",
      email: "sarah.j@example.com",
      rank: "Silver",
      signupDate: "2023-01-15",
      team: 3,
      sales: 2450
    },
    {
      id: "2",
      name: "Michael Chen",
      avatar: "https://i.pravatar.cc/150?img=13",
      email: "michael.c@example.com",
      rank: "Bronze",
      signupDate: "2023-02-22",
      team: 1,
      sales: 1200
    },
    {
      id: "3",
      name: "Jessica Williams",
      avatar: "https://i.pravatar.cc/150?img=9",
      email: "jessica.w@example.com",
      rank: "Bronze",
      signupDate: "2023-03-10",
      team: 0,
      sales: 800
    },
    {
      id: "4",
      name: "David Miller",
      avatar: "https://i.pravatar.cc/150?img=12",
      email: "david.m@example.com",
      rank: "Starter",
      signupDate: "2023-04-05",
      team: 0,
      sales: 350
    },
    {
      id: "5",
      name: "Lisa Rodriguez",
      avatar: "https://i.pravatar.cc/150?img=10",
      email: "lisa.r@example.com",
      rank: "Starter",
      signupDate: "2023-05-18",
      team: 0,
      sales: 120
    }
  ];

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error || !user) {
          navigate("/auth");
          return;
        }
        
        setUser(user);
        
        // Get user profile
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        
        if (profileError) {
          console.error("Error fetching profile:", profileError);
        } else {
          setProfile(profile);
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

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast({
      title: "Copied!",
      description: "Referral link copied to clipboard."
    });
    
    setTimeout(() => setCopied(false), 2000);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <p className="text-lg text-muted-foreground">Loading referrals...</p>
        </div>
      </div>
    );
  }
  
  return (
    <AppLayout>
      <div className="container max-w-7xl mx-auto px-4 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Team</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" />
                Team Size
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{downlines.length}</div>
              <p className="text-muted-foreground text-sm">Active team members</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Team Sales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                ${downlines.reduce((sum, d) => sum + d.sales, 0).toLocaleString()}
              </div>
              <p className="text-muted-foreground text-sm">Total sales volume</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-purple-500" />
                Commissions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">$1,845</div>
              <p className="text-muted-foreground text-sm">Earned this month</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share className="h-5 w-5" />
              Share Your Referral Link
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input value={referralLink} readOnly className="bg-gray-50" />
              <Button onClick={copyReferralLink} className="flex items-center gap-2">
                <Copy className="h-4 w-4" />
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <svg className="h-4 w-4 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.396 3.98h2.396v8.01Z" />
                </svg>
                Share on Facebook
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <svg className="h-4 w-4 text-[#1DA1F2]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41Z" />
                </svg>
                Share on Twitter
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <svg className="h-4 w-4 text-[#0A66C2]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.94 5a2 2 0 1 1-4-.002 2 2 0 0 1 4 .002zM7 8.48H3V21h4V8.48zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.72-2.91l.04-1.68z" />
                </svg>
                Share on LinkedIn
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <svg className="h-4 w-4 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                Share on WhatsApp
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="team" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="team">My Team</TabsTrigger>
            <TabsTrigger value="pending">Pending Invites</TabsTrigger>
          </TabsContent>
          
          <TabsContent value="team" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {downlines.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full">
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center text-center">
                        <div className="relative mb-4">
                          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white shadow-lg">
                            <img 
                              src={member.avatar} 
                              alt={member.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full px-2 py-1 text-xs">
                            {member.rank}
                          </div>
                        </div>
                        
                        <h3 className="font-medium text-lg mb-1">{member.name}</h3>
                        <p className="text-muted-foreground text-sm mb-4">{member.email}</p>
                        
                        <div className="grid grid-cols-2 gap-4 w-full mb-4">
                          <div className="text-center p-2 bg-gray-50 rounded-lg">
                            <p className="text-xs text-muted-foreground">Team Size</p>
                            <p className="font-medium">{member.team}</p>
                          </div>
                          <div className="text-center p-2 bg-gray-50 rounded-lg">
                            <p className="text-xs text-muted-foreground">Sales</p>
                            <p className="font-medium">${member.sales}</p>
                          </div>
                        </div>
                        
                        <p className="text-xs text-muted-foreground">
                          Joined {new Date(member.signupDate).toLocaleDateString()}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="pending" className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <UserPlus className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No pending invites</h3>
                  <p className="text-muted-foreground mb-4">
                    You don't have any pending invites at the moment.
                  </p>
                  <Button>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Invite New Team Members
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Referrals;
