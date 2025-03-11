
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UsersRound, Package, Award, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [usersCount, setUsersCount] = useState(0);
  const [productsCount, setProductsCount] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        // Fetch dashboard stats in parallel
        const [usersResult, productsResult, salesResult] = await Promise.all([
          supabase.from("profiles").select("id", { count: "exact" }),
          supabase.from("products").select("id", { count: "exact" }),
          supabase.from("sales").select("amount")
        ]);
        
        setUsersCount(usersResult.count || 0);
        setProductsCount(productsResult.count || 0);
        setTotalSales(salesResult.data?.reduce((sum, sale) => sum + Number(sale.amount), 0) || 0);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    };
    
    fetchDashboardStats();
  }, []);
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Overview of your business operations and metrics</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
        <AdminStatCard 
          title="Rankings" 
          value={`${productsCount > 0 ? "Active" : "Setup"}`} 
          icon={<Award size={24} />}
          color="bg-amber-500"
        />
      </div>
      
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="products">Product Management</TabsTrigger>
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
              <Button onClick={() => navigate("/admin/customers")}>
                View All Users
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Add, edit, and manage products in your catalog.
              </p>
              <Button onClick={() => navigate("/admin/products")}>
                Manage Products
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
              <Button onClick={() => navigate("/admin/orders")}>
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
              <Button onClick={() => navigate("/admin/compensation")}>
                Manage Ranks
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
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
