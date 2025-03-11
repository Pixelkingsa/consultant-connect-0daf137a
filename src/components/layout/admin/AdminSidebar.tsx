
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { type NavItem } from "./AdminNavItems";

interface AdminSidebarProps {
  navItems: NavItem[];
  sidebarOpen: boolean;
}

const AdminSidebar = ({ navItems, sidebarOpen }: AdminSidebarProps) => {
  const navigate = useNavigate();
  
  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 h-screen overflow-y-auto transform bg-slate-900 text-white transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto", 
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
            onClick={() => navigate("/user-dashboard")}
          >
            <LogOut className="h-5 w-5" />
            <span className="ml-2">Exit Admin</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
