
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UsersRound, Package, Award, DollarSign } from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [usersCount, setUsersCount] = useState(0);
  const [productsCount, setProductsCount] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error || !user) {
          navigate("/auth");
          return;
        }
        
        setUser(user);
        
        // Check if user has admin role - in a real app, you would check against a roles table
        // For this example, we'll consider the first user as admin
        const { data: profiles, error: profilesError } = await supabase
          .from("profiles")
          .select("*")
          .order("created_at", { ascending: true })
          .limit(1);
          
        if (profilesError) {
          console.error("Error checking admin status:", profilesError);
          navigate("/user-dashboard");
          return;
        }
        
        // Check if current user is the first user (admin)
        if (profiles && profiles.length > 0 && profiles[0].id === user.id) {
          setIsAdmin(true);
          
          // Fetch dashboard stats
          const [usersResult, productsResult, salesResult] = await Promise.all([
            supabase.from("profiles").select("id", { count: "exact" }),
            supabase.from("products").select("id", { count: "exact" }),
            supabase.from("sales").select("amount")
          ]);
          
          setUsersCount(usersResult.count || 0);
          setProductsCount(productsResult.count || 0);
          setTotalSales(salesResult.data?.reduce((sum, sale) => sum + Number(sale.amount), 0) || 0);
        } else {
          // Not admin, redirect to user dashboard
          toast({
            title: "Access Denied",
            description: "You don't have permission to access the admin dashboard.",
            variant: "destructive",
          });
          navigate("/user-dashboard");
        }
      } catch (error) {
        console.error("Error:", error);
        navigate("/user-dashboard");
      } finally {
        setLoading(false);
      }
    };
    
    checkAdminAccess();
  }, [navigate, toast]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <p className="text-lg text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }
  
  if (!isAdmin) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <AppLayout>
      <div className="container max-w-7xl mx-auto px-4 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button onClick={() => navigate("/admin/products")}>
            Manage Products
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <AdminStatCard 
            title="Total Users" 
            value={usersCount.toString()} 
            icon={<UsersRound size={24} />}
            color="bg-blue-500"
          />
          <AdminStatCard 
            title="Products" 
            value={productsCount.toString()} 
            icon={<Package size={24} />}
            color="bg-green-500"
          />
          <AdminStatCard 
            title="Total Sales" 
            value={`$${totalSales.toFixed(2)}`} 
            icon={<DollarSign size={24} />}
            color="bg-purple-500"
          />
        </div>
        
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="sales">Sales Overview</TabsTrigger>
            <TabsTrigger value="ranks">Rank Management</TabsTrigger>
          </TabsList>
          
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Manage user accounts, adjust ranks, and view performance metrics.
                </p>
                <Button onClick={() => navigate("/admin/users")}>
                  View All Users
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="sales" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sales Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Review sales data, commissions, and financial performance.
                </p>
                <Button onClick={() => navigate("/admin/sales")}>
                  View Sales Reports
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="ranks" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Rank Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Configure rank thresholds, commission rates, and promotion criteria.
                </p>
                <Button onClick={() => navigate("/admin/ranks")}>
                  Manage Ranks
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

const AdminStatCard = ({ 
  title, 
  value, 
  icon, 
  color 
}: { 
  title: string; 
  value: string; 
  icon: React.ReactNode;
  color: string;
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <h3 className="text-2xl font-bold">{value}</h3>
          </div>
          <div className={`${color} text-white p-4 rounded-full`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminDashboard;
