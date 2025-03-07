
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Copy, Users, Award, Link, Check, ChevronUp, ChevronDown, Mail } from "lucide-react";
import { motion } from "framer-motion";

interface Downline {
  id: string;
  name: string;
  avatar: string;
  email: string;
  level: number;
  joinDate: string;
  sales: number;
  isActive: boolean;
}

const Referrals = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [referralLink, setReferralLink] = useState("https://vamna.com/ref/jane-doe-12345");
  const [referralCode, setReferralCode] = useState("JANE-12345");
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState("");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const [downlines, setDownlines] = useState<Downline[]>([
    {
      id: "user1",
      name: "Sarah Johnson",
      avatar: "https://i.pravatar.cc/150?img=26",
      email: "sarah.j@example.com",
      level: 1,
      joinDate: "2023-08-15",
      sales: 1250,
      isActive: true
    },
    {
      id: "user2",
      name: "Michael Smith",
      avatar: "https://i.pravatar.cc/150?img=11",
      email: "michael.s@example.com",
      level: 1,
      joinDate: "2023-09-01",
      sales: 890,
      isActive: true
    },
    {
      id: "user3",
      name: "Jessica Williams",
      avatar: "https://i.pravatar.cc/150?img=23",
      email: "jessica.w@example.com",
      level: 1,
      joinDate: "2023-09-12",
      sales: 1420,
      isActive: true
    },
    {
      id: "user4",
      name: "Kevin Thompson",
      avatar: "https://i.pravatar.cc/150?img=13",
      email: "kevin.t@example.com",
      level: 2,
      joinDate: "2023-10-05",
      sales: 570,
      isActive: true
    },
    {
      id: "user5",
      name: "Emily Davis",
      avatar: "https://i.pravatar.cc/150?img=29",
      email: "emily.d@example.com",
      level: 2,
      joinDate: "2023-10-18",
      sales: 320,
      isActive: false
    },
    {
      id: "user6",
      name: "Daniel Wilson",
      avatar: "https://i.pravatar.cc/150?img=15",
      email: "daniel.w@example.com",
      level: 2,
      joinDate: "2023-11-02",
      sales: 780,
      isActive: true
    }
  ]);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error || !user) {
          navigate("/auth");
          return;
        }
        
        setUser(user);
      } catch (error) {
        console.error("Error:", error);
        navigate("/auth");
      } finally {
        setLoading(false);
      }
    };
    
    checkUser();
  }, [navigate]);

  const copyToClipboard = (text: string, type: 'link' | 'code') => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({
      title: `${type === 'link' ? 'Referral link' : 'Referral code'} copied!`,
      description: "You can now share it with potential consultants."
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const sendInvite = () => {
    if (!email) {
      toast({
        title: "Email is required",
        description: "Please enter an email address to send the invite.",
        variant: "destructive"
      });
      return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Invitation sent!",
      description: `An invitation has been sent to ${email}.`
    });
    setEmail("");
  };

  const toggleExpand = (id: string) => {
    setExpanded(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const level1Downlines = downlines.filter(d => d.level === 1);
  const level2Downlines = downlines.filter(d => d.level === 2);
  const activeDownlines = downlines.filter(d => d.isActive);
  const totalSales = downlines.reduce((sum, d) => sum + d.sales, 0);

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
      <div className="container max-w-6xl mx-auto px-4 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">My Referrals</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Downlines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Users className="h-8 w-8 text-purple-500 mr-3" />
                <span className="text-3xl font-bold">{downlines.length}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {activeDownlines.length} active consultants
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Team Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Award className="h-8 w-8 text-green-500 mr-3" />
                <span className="text-3xl font-bold">${totalSales.toLocaleString()}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                This month's team performance
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Commission</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Award className="h-8 w-8 text-amber-500 mr-3" />
                <span className="text-3xl font-bold">${Math.floor(totalSales * 0.1).toLocaleString()}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                10% of total team sales
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="all">
              <TabsList className="mb-6">
                <TabsTrigger value="all">All Downlines</TabsTrigger>
                <TabsTrigger value="level1">Level 1</TabsTrigger>
                <TabsTrigger value="level2">Level 2</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="space-y-4">
                {downlines.map((downline) => (
                  <motion.div
                    key={downline.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center">
                            <Avatar className="h-12 w-12 mr-4">
                              <AvatarImage src={downline.avatar} alt={downline.name} />
                              <AvatarFallback>{downline.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-medium">{downline.name}</h3>
                              <p className="text-sm text-muted-foreground">{downline.email}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className={`text-xs ${downline.level === 1 ? 'bg-blue-50 text-blue-500 border-blue-200' : 'bg-purple-50 text-purple-500 border-purple-200'}`}>
                                  Level {downline.level}
                                </Badge>
                                <Badge variant="outline" className={`text-xs ${downline.isActive ? 'bg-green-50 text-green-500 border-green-200' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                                  {downline.isActive ? 'Active' : 'Inactive'}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Sales</p>
                            <p className="font-medium">${downline.sales}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Joined {new Date(downline.joinDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full mt-2 justify-center"
                          onClick={() => toggleExpand(downline.id)}
                        >
                          {expanded[downline.id] ? (
                            <>
                              <ChevronUp className="h-4 w-4 mr-2" />
                              Hide Details
                            </>
                          ) : (
                            <>
                              <ChevronDown className="h-4 w-4 mr-2" />
                              Show Details
                            </>
                          )}
                        </Button>
                        
                        {expanded[downline.id] && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            transition={{ duration: 0.3 }}
                            className="mt-4 pt-4 border-t"
                          >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <h4 className="text-sm font-medium mb-2">Performance</h4>
                                <div className="space-y-2">
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Monthly Sales</span>
                                    <span>${downline.sales}</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Commission Generated</span>
                                    <span>${Math.floor(downline.sales * 0.05)}</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Activity Status</span>
                                    <span className={downline.isActive ? 'text-green-500' : 'text-gray-500'}>
                                      {downline.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium mb-2">Contact</h4>
                                <div className="space-y-2">
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Email</span>
                                    <span className="text-blue-500">{downline.email}</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Join Date</span>
                                    <span>{new Date(downline.joinDate).toLocaleDateString()}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="mt-4 flex gap-2 justify-end">
                              <Button variant="outline" size="sm">
                                <Mail className="h-4 w-4 mr-2" />
                                Contact
                              </Button>
                              <Button size="sm">View Details</Button>
                            </div>
                          </motion.div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </TabsContent>
              
              <TabsContent value="level1" className="space-y-4">
                {level1Downlines.length > 0 ? (
                  level1Downlines.map((downline) => (
                    <Card key={downline.id}>
                      {/* Similar to the cards in the "all" tab */}
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center">
                            <Avatar className="h-12 w-12 mr-4">
                              <AvatarImage src={downline.avatar} alt={downline.name} />
                              <AvatarFallback>{downline.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-medium">{downline.name}</h3>
                              <p className="text-sm text-muted-foreground">{downline.email}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Sales</p>
                            <p className="font-medium">${downline.sales}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Level 1 Downlines</h3>
                    <p className="text-muted-foreground mb-4">You don't have any direct referrals yet.</p>
                    <Button>Start Inviting</Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="level2" className="space-y-4">
                {level2Downlines.length > 0 ? (
                  level2Downlines.map((downline) => (
                    <Card key={downline.id}>
                      {/* Similar to the cards in the "all" tab */}
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center">
                            <Avatar className="h-12 w-12 mr-4">
                              <AvatarImage src={downline.avatar} alt={downline.name} />
                              <AvatarFallback>{downline.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-medium">{downline.name}</h3>
                              <p className="text-sm text-muted-foreground">{downline.email}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Sales</p>
                            <p className="font-medium">${downline.sales}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Level 2 Downlines</h3>
                    <p className="text-muted-foreground">You don't have any second-level referrals yet.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
          
          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Share Your Referral</CardTitle>
                <CardDescription>
                  Invite new consultants and earn commissions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Your Referral Link</label>
                  <div className="flex">
                    <Input
                      value={referralLink}
                      readOnly
                      className="rounded-r-none"
                    />
                    <Button 
                      className="rounded-l-none"
                      onClick={() => copyToClipboard(referralLink, 'link')}
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Your Referral Code</label>
                  <div className="flex">
                    <Input
                      value={referralCode}
                      readOnly
                      className="rounded-r-none"
                    />
                    <Button 
                      className="rounded-l-none"
                      onClick={() => copyToClipboard(referralCode, 'code')}
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Send Email Invitation</label>
                  <div className="flex flex-col gap-2">
                    <Input
                      type="email"
                      placeholder="Enter email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <Button onClick={sendInvite} className="w-full">
                      <Mail className="h-4 w-4 mr-2" />
                      Send Invite
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Referral Benefits</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Award className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">10% Commission</h4>
                    <p className="text-sm text-muted-foreground">
                      Earn 10% commission on all sales from your level 1 referrals
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Team Building</h4>
                    <p className="text-sm text-muted-foreground">
                      Earn 5% commission on all sales from your level 2 referrals
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Award className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Bonus Rewards</h4>
                    <p className="text-sm text-muted-foreground">
                      Earn special bonuses when you reach team sales milestones
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <Link className="h-4 w-4 mr-2" />
                  Learn More About Commissions
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Referrals;
