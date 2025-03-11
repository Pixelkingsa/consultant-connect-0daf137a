
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Home, 
  ShoppingBag, 
  CreditCard, 
  User, 
  Settings,
  LogOut,
  LayoutDashboard,
  Users,
  Bell,
  LifeBuoy
} from "lucide-react";
import { NavItem } from "../types";

export interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType;
  isActive?: boolean;
}

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

  const getNavItems = (currentPath: string): NavItem[] => {
    return [
      {
        name: "Home",
        href: "/dashboard",
        icon: Home,
        isActive: currentPath === "/dashboard"
      },
      {
        name: "Shop",
        href: "/shop",
        icon: ShoppingBag,
        isActive: currentPath === "/shop"
      },
      {
        name: "Orders",
        href: "/orders",
        icon: CreditCard,
        isActive: currentPath === "/orders"
      },
      {
        name: "Referrals",
        href: "/referrals",
        icon: Users,
        isActive: currentPath === "/referrals"
      },
      {
        name: "News",
        href: "/news",
        icon: Bell,
        isActive: currentPath === "/news"
      },
      {
        name: "Dashboard",
        href: "/user-dashboard",
        icon: LayoutDashboard,
        isActive: currentPath === "/user-dashboard"
      }
    ];
  };

  const getUserMenuItems = (currentPath: string): NavItem[] => {
    const items: NavItem[] = [
      {
        name: "Profile",
        href: "/profile",
        icon: User,
        isActive: currentPath === "/profile"
      },
      {
        name: "Settings",
        href: "/settings",
        icon: Settings,
        isActive: currentPath === "/settings"
      },
      {
        name: "Help",
        href: "/help",
        icon: LifeBuoy,
        isActive: currentPath === "/help"
      }
    ];

    if (isAdmin) {
      items.push({
        name: "Admin",
        href: "/admin-dashboard",
        icon: LayoutDashboard,
        isActive: currentPath.startsWith("/admin")
      });
    }

    items.push({
      name: "Logout",
      href: "#",
      icon: LogOut
    });

    return items;
  };

  // Generate sidebar links for the current location
  const getSidebarLinks = (): NavItem[] => {
    const currentPath = location.pathname;
    const links = getNavItems(currentPath);
    
    // Add logout at the end
    links.push({
      name: "Logout",
      href: "#",
      icon: LogOut
    });
    
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
    getNavItems,
    getUserMenuItems,
    sidebarLinks: getSidebarLinks()
  };
};
