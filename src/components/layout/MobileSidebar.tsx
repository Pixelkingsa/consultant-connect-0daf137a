
import { Button } from "@/components/ui/button";
import { LogOut, HelpCircle } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { SidebarLinks } from "./SidebarLinks";

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
          <div className="flex items-center">
            <h1 className="text-2xl font-bold uppercase tracking-wider text-white">VAMNA</h1>
            <span className="text-xs ml-1 mt-1 text-gray-400">YOUR LASTING BEAUTY</span>
          </div>
        </div>
        
        <SidebarLinks 
          isAdmin={isAdmin} 
          onMobileItemClick={() => setIsMobileMenuOpen(false)} 
        />
        
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
      </SheetContent>
    </Sheet>
  );
};
