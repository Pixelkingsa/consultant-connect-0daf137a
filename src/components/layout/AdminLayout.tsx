
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Wallet,
  HandCoins,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error || !user) {
          navigate("/auth");
          return;
        }
        
        // Check if user is admin - first user in the system
        const { data: profiles, error: profilesError } = await supabase
          .from("profiles")
          .select("*")
          .order("created_at", { ascending: true })
          .limit(1);
          
        if (profilesError) {
          console.error("Error checking admin status:", profilesError);
          toast({
            title: "Error checking admin status",
            description: "Could not verify admin privileges. Redirecting to dashboard.",
            variant: "destructive",
          });
          navigate("/dashboard");
          return;
        }
        
        // Check if current user is the first user (admin)
        if (profiles && profiles.length > 0 && profiles[0].id === user.id) {
          setIsAdmin(true);
        } else {
          // Not admin, redirect to user dashboard
          toast({
            title: "Access Denied",
            description: "You don't have permission to access the admin dashboard.",
            variant: "destructive",
          });
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Error:", error);
        navigate("/dashboard");
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

  // Create navigation items
  const navItems = [
    { 
      name: "Dashboard", 
      icon: <LayoutDashboard className="h-5 w-5" />, 
      path: "/admin-dashboard" 
    },
    { 
      name: "Products", 
      icon: <Package className="h-5 w-5" />, 
      path: "/admin/products" 
    },
    { 
      name: "Orders", 
      icon: <ShoppingCart className="h-5 w-5" />, 
      path: "/admin/orders" 
    },
    { 
      name: "Customers", 
      icon: <Users className="h-5 w-5" />, 
      path: "/admin/customers" 
    },
    { 
      name: "Compensation", 
      icon: <HandCoins className="h-5 w-5" />, 
      path: "/admin/compensation" 
    },
    { 
      name: "Withdrawals", 
      icon: <Wallet className="h-5 w-5" />, 
      path: "/admin/withdrawals" 
    },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile sidebar toggle */}
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={toggleSidebar}
      >
        {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 transform bg-slate-900 text-white transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto", 
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-6">
            <h2 className="text-xl font-bold">Admin Panel</h2>
          </div>

          <Separator className="bg-slate-700" />

          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start text-white hover:bg-slate-800 hover:text-white",
                      window.location.pathname === item.path && "bg-slate-800"
                    )}
                    onClick={() => navigate(item.path)}
                  >
                    {item.icon}
                    <span className="ml-2">{item.name}</span>
                  </Button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-4 mt-auto">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-white hover:bg-slate-800"
              onClick={() => navigate("/dashboard")}
            >
              <LogOut className="h-5 w-5" />
              <span className="ml-2">Exit Admin</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
