
import { Button } from "@/components/ui/button";
import { LogOut, HelpCircle, Settings } from "lucide-react";
import { SidebarLinks } from "./SidebarLinks";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface DesktopSidebarProps {
  isAdmin: boolean;
  handleSignOut: () => void;
}

export const DesktopSidebar = ({ isAdmin, handleSignOut }: DesktopSidebarProps) => {
  return (
    <aside className="hidden md:flex fixed left-0 top-0 bottom-0 flex-col w-64 bg-black text-white h-screen overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center">
          <img 
            src="/lovable-uploads/fee0da40-393a-4a41-94d1-bd5474c288c9.png" 
            alt="VAMNA Logo" 
            className="h-8 w-auto" 
          />
        </div>
      </div>
      
      <SidebarLinks isAdmin={isAdmin} />
      
      <div className="mt-auto px-4">
        <Link
          to="/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors text-gray-300 hover:bg-white/5 hover:text-white"
          )}
        >
          <Settings className="h-4 w-4" />
          Settings
        </Link>
        
        <Link
          to="/help-support"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors text-gray-300 hover:bg-white/5 hover:text-white mt-[4px]"
          )}
        >
          <HelpCircle className="h-4 w-4" />
          Help & Support
        </Link>
        
        <Button 
          variant="ghost" 
          className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-white/5 mt-[4px] px-3 py-2 mb-10" 
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4 mr-3" />
          Logout
        </Button>
      </div>
    </aside>
  );
};
