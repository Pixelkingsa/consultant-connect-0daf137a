
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Badge } from "@/components/ui/badge";
import { CircleDollarSign, Users, TrendingUp, Award, Share2 } from "lucide-react";

const UserDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [rankInfo, setRankInfo] = useState<any>(null);
  const [salesData, setSalesData] = useState<any[]>([]);
  const [bonusesData, setBonusesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Format sales data for chart
  const getPerformanceData = () => {
    // If we have real sales data, use it; otherwise use placeholder
    if (salesData.length > 0) {
      // Group by month and calculate totals
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const monthlyData = months.map(month => ({
        month,
        sales: 0,
        referrals: 0
      }));
      
      // Process sales data
      salesData.forEach(sale => {
        const date = new Date(sale.date);
        const monthIndex = date.getMonth();
        monthlyData[monthIndex].sales += Number(sale.amount);
      });
      
      return monthlyData;
    } else {
      // Return placeholder data if no real data
      return [
        { month: "Jan", sales: 250, referrals: 5 },
        { month: "Feb", sales: 420, referrals: 8 },
        { month: "Mar", sales: 380, referrals: 12 },
        { month: "Apr", sales: 530, referrals: 15 },
        { month: "May", sales: 450, referrals: 10 },
        { month: "Jun", sales: 620, referrals: 18 },
      ];
    }
  };
  
  // Calculate monthly sales total
  const getMonthlySalesTotal = () => {
    const currentMonth = new Date().getMonth();
    const currentMonthSales = salesData.filter(sale => {
      const saleMonth = new Date(sale.date).getMonth();
      return saleMonth === currentMonth;
    });
    
    return currentMonthSales.reduce((total, sale) => total + Number(sale.amount), 0);
  };

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error || !user) {
          navigate("/auth");
          return;
        }
        
        setUser(user);
        
        // Get user profile with rank information
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*, ranks(*)")
          .eq("id", user.id)
          .single();
        
        if (profileError) {
          console.error("Error fetching profile:", profileError);
          toast({
            title: "Error loading profile",
            description: "Could not load your profile data. Please try again later.",
            variant: "destructive",
          });
        } else {
          setProfile(profile);
          setRankInfo(profile.ranks);
          
          // Fetch sales data
          const { data: salesData, error: salesError } = await supabase
            .from("sales")
            .select("*")
            .eq("user_id", user.id)
            .order("date", { ascending: false });
            
          if (salesError) {
            console.error("Error fetching sales:", salesError);
          } else {
            setSalesData(salesData || []);
          }
          
          // Fetch bonuses data
          const { data: bonusesData, error: bonusesError } = await supabase
            .from("bonuses")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });
            
          if (bonusesError) {
            console.error("Error fetching bonuses:", bonusesError);
          } else {
            setBonusesData(bonusesData || []);
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
  }, [navigate, toast]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <p className="text-lg text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }
  
  // Calculate total bonuses
  const totalBonuses = bonusesData.reduce((total, bonus) => total + Number(bonus.amount), 0);
  
  return (
    <AppLayout>
      <div className="container max-w-7xl mx-auto px-4 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Welcome, {profile?.full_name || user?.email}</h1>
            <p className="text-muted-foreground">
              Your current rank: <Badge variant="outline" className="ml-1 bg-black text-white">{rankInfo?.name || "Starter"}</Badge>
            </p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-3 py-1">
              Team Size: {profile?.team_size || 0} members
            </Badge>
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 px-3 py-1">
              PV Points: {profile?.personal_volume || 0}
            </Badge>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Monthly Sales" 
            value={`$${getMonthlySalesTotal().toFixed(2)}`} 
            description={salesData.length > 0 ? "Based on this month's data" : "No sales data yet"} 
            icon={<CircleDollarSign className="h-8 w-8 text-green-500" />} 
          />
          <StatCard 
            title="Team Members" 
            value={profile?.team_size || "0"} 
            description="Build your team to earn more" 
            icon={<Users className="h-8 w-8 text-blue-500" />} 
          />
          <StatCard 
            title="Personal Volume" 
            value={profile?.personal_volume || "0"} 
            description={`Group Volume: ${profile?.group_volume || "0"}`} 
            icon={<Share2 className="h-8 w-8 text-purple-500" />} 
          />
          <StatCard 
            title="Rank Progress" 
            value={rankInfo ? `${((profile?.personal_volume || 0) / (rankInfo?.threshold_pv || 100) * 100).toFixed(0)}%` : "0%"} 
            description={`Next: ${rankInfo?.name || "Loading..."}`} 
            icon={<Award className="h-8 w-8 text-amber-500" />} 
          />
        </div>
        
        {/* Modern Line Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 overflow-hidden border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-bold">Performance Metrics</CardTitle>
              <CardDescription>Sales and referral performance over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={getPerformanceData()}
                    margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fill: '#6b7280' }}
                      axisLine={{ stroke: '#e5e7eb' }}
                    />
                    <YAxis 
                      yAxisId="left"
                      tick={{ fill: '#6b7280' }}
                      axisLine={{ stroke: '#e5e7eb' }}
                    />
                    <YAxis 
                      yAxisId="right" 
                      orientation="right" 
                      tick={{ fill: '#6b7280' }}
                      axisLine={{ stroke: '#e5e7eb' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                        borderRadius: '8px', 
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', 
                        border: 'none' 
                      }}
                    />
                    <Legend 
                      verticalAlign="top" 
                      height={36} 
                      iconType="circle"
                    />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="sales" 
                      stroke="#000000" 
                      strokeWidth={2} 
                      dot={{ r: 4, strokeWidth: 2 }}
                      activeDot={{ r: 6, stroke: "#000000", strokeWidth: 2 }}
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="referrals" 
                      stroke="#8884d8" 
                      strokeWidth={2} 
                      dot={{ r: 4, strokeWidth: 2 }}
                      activeDot={{ r: 6, stroke: "#8884d8", strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Stay updated with important dates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-black pl-4 py-2">
                  <p className="font-medium">New Collection Launch</p>
                  <p className="text-sm text-muted-foreground">March 15, 2023</p>
                </div>
                <div className="border-l-4 border-black pl-4 py-2">
                  <p className="font-medium">Team Training Webinar</p>
                  <p className="text-sm text-muted-foreground">March 22, 2023</p>
                </div>
                <div className="border-l-4 border-black pl-4 py-2">
                  <p className="font-medium">Spring Promotion Starts</p>
                  <p className="text-sm text-muted-foreground">April 1, 2023</p>
                </div>
                <div className="border-l-4 border-black pl-4 py-2">
                  <p className="font-medium">Annual Convention</p>
                  <p className="text-sm text-muted-foreground">May 15-17, 2023</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

// Stat Card Component
const StatCard = ({ title, value, description, icon }: { 
  title: string; 
  value: string | number; 
  description: string; 
  icon: React.ReactNode 
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <h3 className="text-2xl font-bold">{value}</h3>
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          </div>
          <div className="bg-gray-100 p-3 rounded-full">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserDashboard;
