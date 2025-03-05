
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ConsultantCard from "@/components/ConsultantCard";
import PerformanceMetrics from "@/components/PerformanceMetrics";
import RankProgress from "@/components/RankProgress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BadgeDollarSign, 
  ShoppingBag, 
  Users, 
  TrendingUp,
  UserPlus
} from "lucide-react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for dashboard
const consultantData = {
  name: "Jane Smith",
  rank: "Bronze" as const,
  personalVP: 35,
  groupVP: 85,
  teamSize: 5,
  nextRank: "Silver" as const,
  nextRankVP: 100,
  earnings: {
    totalEarnings: 12500,
    thisMonth: 2800,
    commissions: 1500,
    retailProfit: 1300
  },
  teamMembers: [
    { id: 1, name: "Alex Johnson", rank: "Starter", personalVP: 15, joinedDate: "2023-10-15" },
    { id: 2, name: "Maria Garcia", rank: "Advanced", personalVP: 28, joinedDate: "2023-08-22" },
    { id: 3, name: "David Lee", rank: "Starter", personalVP: 8, joinedDate: "2023-12-03" },
    { id: 4, name: "Sarah Williams", rank: "Advanced", personalVP: 22, joinedDate: "2023-09-10" },
    { id: 5, name: "James Brown", rank: "Starter", personalVP: 12, joinedDate: "2024-01-05" }
  ]
};

const Dashboard = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const [activeTab, setActiveTab] = useState("overview");
  
  // Stats cards data
  const statsCards = [
    {
      title: "Total Earnings",
      value: `R${consultantData.earnings.totalEarnings.toLocaleString()}`,
      change: "+12% from last month",
      icon: <BadgeDollarSign className="h-5 w-5 text-accent" />,
    },
    {
      title: "Personal VP",
      value: consultantData.personalVP.toString(),
      change: "+5 VP from last month",
      icon: <TrendingUp className="h-5 w-5 text-accent" />,
    },
    {
      title: "Team Size",
      value: consultantData.teamSize.toString(),
      change: "+1 new consultant",
      icon: <Users className="h-5 w-5 text-accent" />,
    },
    {
      title: "Products Sold",
      value: "42",
      change: "+8 from last month",
      icon: <ShoppingBag className="h-5 w-5 text-accent" />,
    },
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-20 bg-accent/5">
        <div className="container max-w-7xl mx-auto px-4 lg:px-8">
          <div className="pb-8 pt-10">
            <h1 className="text-3xl font-medium tracking-tight">Consultant Dashboard</h1>
            <p className="text-foreground/70 mt-2">
              Track your progress, manage your team, and grow your business
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-1">
              <ConsultantCard 
                name={consultantData.name}
                rank={consultantData.rank}
                personalVP={consultantData.personalVP}
                groupVP={consultantData.groupVP}
                teamSize={consultantData.teamSize}
              />
            </div>
            
            <div className="lg:col-span-2">
              <RankProgress 
                currentRank={consultantData.rank}
                currentVP={consultantData.groupVP}
                nextRankVP={consultantData.nextRankVP}
                nextRank={consultantData.nextRank}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {statsCards.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-sm font-medium">
                        {stat.title}
                      </CardTitle>
                      <div className="p-2 rounded-full bg-accent/10">
                        {stat.icon}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold mb-1">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">
                      {stat.change}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          
          <Tabs
            defaultValue="overview"
            value={activeTab}
            onValueChange={setActiveTab}
            className="mb-6"
          >
            <TabsList className="grid grid-cols-3 max-w-md">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
              <TabsTrigger value="earnings">Earnings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6 mt-6">
              <PerformanceMetrics />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-lg font-medium">
                      Monthly Earnings Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-3 border-b">
                        <div className="font-medium">Total Earnings This Month</div>
                        <div className="text-xl font-bold">
                          R{consultantData.earnings.thisMonth.toLocaleString()}
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <div className="text-foreground/80">Retail Profit</div>
                          <div className="font-medium">
                            R{consultantData.earnings.retailProfit.toLocaleString()}
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="text-foreground/80">Team Commissions</div>
                          <div className="font-medium">
                            R{consultantData.earnings.commissions.toLocaleString()}
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="text-foreground/80">Volume Rebates</div>
                          <div className="font-medium">R0</div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="text-foreground/80">Fast Progress Bonus</div>
                          <div className="font-medium">R0</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-medium">
                      Next Steps
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 rounded-lg border bg-muted/50">
                        <div className="font-medium mb-2">Silver Rank Goal</div>
                        <p className="text-sm text-foreground/70 mb-3">
                          You need {consultantData.nextRankVP - consultantData.groupVP} more Group VP to reach Silver Rank
                        </p>
                        <Button size="sm" className="w-full">
                          View Requirements
                        </Button>
                      </div>
                      
                      <div className="p-4 rounded-lg border bg-muted/50">
                        <div className="font-medium mb-2">Grow Your Team</div>
                        <p className="text-sm text-foreground/70 mb-3">
                          Recruit new consultants to increase your Group VP
                        </p>
                        <Button size="sm" variant="outline" className="w-full">
                          <UserPlus className="mr-2 h-4 w-4" />
                          Invite Consultant
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="team" className="mt-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg font-medium">
                      Your Team ({consultantData.teamSize})
                    </CardTitle>
                    <Button size="sm">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Invite
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {consultantData.teamMembers.map(member => (
                      <div key={member.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                            <Users className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <div className="font-medium">{member.name}</div>
                            <div className="text-xs text-muted-foreground">
                              Joined {new Date(member.joinedDate).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{member.rank}</div>
                          <div className="text-xs text-muted-foreground">
                            {member.personalVP} Personal VP
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="earnings" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-medium">
                    Earnings History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {["January", "February", "March", "April", "May"].map((month, i) => (
                      <div key={i} className="flex justify-between items-center p-3 rounded-lg border">
                        <div>
                          <div className="font-medium">{month} 2024</div>
                          <div className="text-xs text-muted-foreground">
                            Paid on {i + 1}/15/2024
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
                            R{(Math.random() * 3000 + 1500).toFixed(2)}
                          </div>
                          <div className="text-xs text-accent">
                            +{(Math.random() * 15 + 5).toFixed(1)}% from previous month
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
