
import { Button } from "@/components/ui/button";
import { LogOut, HelpCircle, Settings } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { SidebarLinks } from "./SidebarLinks";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import SidebarLogo from "./SidebarLogo";

interface MobileSidebarProps {
  isAdmin: boolean;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  handleSignOut: () => void;
}

export const MobileSidebar = ({ 
  isAdmin, 
  isMobileMenuOpen, 
  setIsMobileMenuOpen, 
  handleSignOut 
}: MobileSidebarProps) => {
  return (
    <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
      <SheetContent side="left" className="w-64 p-0 bg-black text-white">
        <div className="p-6">
          <SidebarLogo />
        </div>
        
        <SidebarLinks 
          isAdmin={isAdmin} 
          onMobileItemClick={() => setIsMobileMenuOpen(false)} 
        />
        
        <div className="mt-auto px-4">
          <Link
            to="/settings"
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors text-gray-300 hover:bg-white/5 hover:text-white"
            )}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
          
          <Link
            to="/help-support"
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors text-gray-300 hover:bg-white/5 hover:text-white mt-[4px]"
            )}
            onClick={() => setIsMobileMenuOpen(false)}
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
      </SheetContent>
    </Sheet>
  );
};
