
import { LogOut, HelpCircle } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { NavItem } from "../types";

interface UserSidebarProps {
  sidebarLinks: NavItem[];
  onSignOut: () => Promise<void>;
}

const UserSidebar = ({ sidebarLinks, onSignOut }: UserSidebarProps) => {
  const location = useLocation();
  
  return (
    <aside className="hidden md:flex flex-col w-64 bg-black text-white">
      <div className="p-6">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold uppercase tracking-wider text-white">VAMNA</h1>
          <span className="text-xs ml-1 mt-1 text-gray-400">YOUR LASTING BEAUTY</span>
        </div>
      </div>
      
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
              >
                {link.icon}
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 mt-auto">
        <Button variant="ghost" className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-white/5" onClick={onSignOut}>
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
      
      <div className="p-4 text-gray-400 text-xs">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-4 w-4" />
          <span>Help & Support</span>
        </div>
      </div>
    </aside>
  );
};

export default UserSidebar;
