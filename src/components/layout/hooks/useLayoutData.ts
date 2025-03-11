import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  ShoppingBag, 
  CreditCard, 
  User, 
  Settings,
  LogOut,
  LayoutDashboard,
  Users,
  Bell,
  Package
} from "lucide-react";
import { NavItem } from "../types";

export const useLayoutData = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        navigate("/auth");
        return;
      }
      
      setUser(user);
      
      // Check if user is admin
      const { data: profiles, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
        
      if (!profileError && profiles) {
        setProfile(profiles);
        setIsAdmin(profiles.rank === "Admin");
      }
      
      // Get cart count from the cart_items table
      try {
        const { count, error: cartError } = await supabase
          .from("cart_items")
          .select("id", { count: 'exact', head: true })
          .eq("user_id", user.id);
          
        if (!cartError) {
          setCartCount(count || 0);
        } else {
          console.error("Error fetching cart count:", cartError);
          setCartCount(0);
        }
      } catch (cartError) {
        console.error("Error counting cart items:", cartError);
        setCartCount(0);
      }
      
      setLoading(false);
    };
    
    checkUser();
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/auth");
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Define sidebar links using the proper NavItem type
  const getSidebarLinks = (): NavItem[] => {
    const links: NavItem[] = [
      { name: "User Dashboard", path: "/user-dashboard", icon: LayoutDashboard },
      { name: "Shop", path: "/shop", icon: Package },
      { name: "Orders", path: "/orders", icon: CreditCard },
      { name: "Referrals", path: "/referrals", icon: Users },
      { name: "Profile", path: "/profile", icon: User },
      { name: "News", path: "/news", icon: Bell },
      { name: "Settings", path: "/settings", icon: Settings }
    ];
    
    if (isAdmin) {
      links.push(
        { name: "Admin Dashboard", path: "/admin-dashboard", icon: LayoutDashboard }
      );
    }
    
    return links;
  };

  return {
    user,
    profile,
    isAdmin,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    cartCount,
    loading,
    handleSignOut,
    toggleMobileMenu,
    sidebarLinks: getSidebarLinks()
  };
};
