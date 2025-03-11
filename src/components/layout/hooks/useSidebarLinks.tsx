
import { useState, useEffect } from "react";
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

export const useSidebarLinks = (isAdmin: boolean) => {
  const [sidebarLinks, setSidebarLinks] = useState<any[]>([]);
  
  useEffect(() => {
    const links = [
      { name: "User Dashboard", path: "/user-dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
      { name: "Home", path: "/dashboard", icon: <Home className="h-5 w-5" /> },
      { name: "Shop", path: "/shop", icon: <Package className="h-5 w-5" /> },
      { name: "Orders", path: "/orders", icon: <CreditCard className="h-5 w-5" /> },
      { name: "Referrals", path: "/referrals", icon: <Users className="h-5 w-5" /> },
      { name: "Profile", path: "/profile", icon: <User className="h-5 w-5" /> },
      { name: "News", path: "/news", icon: <Bell className="h-5 w-5" /> },
      { name: "Settings", path: "/settings", icon: <Settings className="h-5 w-5" /> },
    ];
    
    if (isAdmin) {
      links.push(
        { name: "Admin Dashboard", path: "/admin-dashboard", icon: <LayoutDashboard className="h-5 w-5" /> }
      );
    }
    
    setSidebarLinks(links);
  }, [isAdmin]);

  return sidebarLinks;
};
