
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Badge } from "@/components/ui/badge";
import { CircleDollarSign, Users, TrendingUp, Award } from "lucide-react";

const UserDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Sample data for charts
  const salesData = [
    { name: "Jan", sales: 250 },
    { name: "Feb", sales: 420 },
    { name: "Mar", sales: 380 },
    { name: "Apr", sales: 530 },
    { name: "May", sales: 450 },
    { name: "Jun", sales: 620 },
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
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <p className="text-lg text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }
  
  return (
    <AppLayout>
      <div className="container max-w-7xl mx-auto px-4 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Welcome, {profile?.full_name || user?.email}</h1>
            <p className="text-muted-foreground">
              Your current rank: <Badge variant="outline" className="ml-1 bg-black text-white">{profile?.rank || "Starter"}</Badge>
            </p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-3 py-1">
              Team Size: {profile?.team_size || 0} members
            </Badge>
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 px-3 py-1">
              Points: 2,450
            </Badge>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Monthly Sales" 
            value="$2,345" 
            description="↑ 14% from last month" 
            icon={<CircleDollarSign className="h-8 w-8 text-green-500" />} 
          />
          <StatCard 
            title="Team Members" 
            value={profile?.team_size || "0"} 
            description="↑ 2 new this month" 
            icon={<Users className="h-8 w-8 text-blue-500" />} 
          />
          <StatCard 
            title="Growth Rate" 
            value="24%" 
            description="↑ 7% from last month" 
            icon={<TrendingUp className="h-8 w-8 text-orange-500" />} 
          />
          <StatCard 
            title="Rank Progress" 
            value="64%" 
            description="To next level: Elite" 
            icon={<Award className="h-8 w-8 text-purple-500" />} 
          />
        </div>
        
        {/* Charts and more info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Sales Performance</CardTitle>
              <CardDescription>Your sales over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="sales" fill="#000000" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
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
