
import { Button } from "@/components/ui/button";
import { LogOut, HelpCircle } from "lucide-react";
import { SidebarLinks } from "./SidebarLinks";

interface DesktopSidebarProps {
  isAdmin: boolean;
  handleSignOut: () => void;
}

export const DesktopSidebar = ({ isAdmin, handleSignOut }: DesktopSidebarProps) => {
  return (
    <aside className="hidden md:flex flex-col w-64 bg-black text-white">
      <div className="p-6">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold uppercase tracking-wider text-white">VAMNA</h1>
          <span className="text-xs ml-1 mt-1 text-gray-400">YOUR LASTING BEAUTY</span>
        </div>
      </div>
      
      <SidebarLinks isAdmin={isAdmin} />
      
      <div className="p-4 mt-auto">
        <Button variant="ghost" className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-white/5" onClick={handleSignOut}>
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
