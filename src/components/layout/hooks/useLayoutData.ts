
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  LayoutDashboard, 
  Home, 
  Package, 
  CreditCard, 
  Users, 
  User, 
  Bell, 
  Settings 
} from "lucide-react";
import { NavItem } from "../types";

export const useLayoutData = () => {
  const navigate = useNavigate();
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
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Define sidebar links
  const getSidebarLinks = (): NavItem[] => {
    const links: NavItem[] = [
      { name: "User Dashboard", path: "/user-dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
      { name: "Home", path: "/dashboard", icon: <Home className="h-5 w-5" /> },
      { name: "Shop", path: "/shop", icon: <Package className="h-5 w-5" /> },
      { name: "Orders", path: "/orders", icon: <CreditCard className="h-5 w-5" /> },
      { name: "Referrals", path: "/referrals", icon: <Users className="h-5 w-5" /> },
      { name: "Profile", path: "/profile", icon: <User className="h-5 w-5" /> },
      { name: "News", path: "/news", icon: <Bell className="h-5 w-5" /> },
      { name: "Settings", path: "/settings", icon: <Settings className="h-5 w-5" /> }
    ];
    
    if (isAdmin) {
      links.push(
        { name: "Admin Dashboard", path: "/admin-dashboard", icon: <LayoutDashboard className="h-5 w-5" /> }
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
