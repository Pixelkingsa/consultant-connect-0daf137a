
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  CreditCard,
  Users,
  User,
  Bell,
  Settings
} from "lucide-react";

interface SidebarLinksProps {
  isAdmin: boolean;
  onMobileItemClick?: () => void;
}

export const SidebarLinks = ({ isAdmin, onMobileItemClick }: SidebarLinksProps) => {
  const location = useLocation();
  
  const sidebarLinks = [
    { name: "User Dashboard", path: "/user-dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: "Shop", path: "/shop", icon: <Package className="h-5 w-5" /> },
    { name: "Orders", path: "/orders", icon: <CreditCard className="h-5 w-5" /> },
    { name: "Referrals", path: "/referrals", icon: <Users className="h-5 w-5" /> },
    { name: "Profile", path: "/profile", icon: <User className="h-5 w-5" /> },
    { name: "News", path: "/news", icon: <Bell className="h-5 w-5" /> },
    { name: "Settings", path: "/settings", icon: <Settings className="h-5 w-5" /> },
  ];
  
  if (isAdmin) {
    sidebarLinks.push(
      { name: "Admin Dashboard", path: "/admin-dashboard", icon: <LayoutDashboard className="h-5 w-5" /> }
    );
  }
  
  return (
    <nav className="flex-1 px-4 py-2">
      <ul className="space-y-1">
        {sidebarLinks.map((link) => (
          <li key={link.path}>
            <Link
              to={link.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                location.pathname === link.path
                  ? "bg-white/10 text-white font-medium"
                  : "text-gray-300 hover:bg-white/5 hover:text-white"
              )}
              onClick={onMobileItemClick}
            >
              {link.icon}
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
