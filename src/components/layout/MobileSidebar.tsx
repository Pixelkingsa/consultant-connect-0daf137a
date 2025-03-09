
import { Sheet, SheetContent } from "@/components/ui/sheet";
import Sidebar from "./Sidebar";

interface MobileSidebarProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  sidebarLinks: {
    name: string;
    path: string;
    icon: React.ReactNode;
  }[];
  handleSignOut: () => void;
}

const MobileSidebar = ({ 
  isMobileMenuOpen, 
  setIsMobileMenuOpen, 
  sidebarLinks, 
  handleSignOut 
}: MobileSidebarProps) => {
  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  
  return (
    <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
      <SheetContent side="left" className="w-64 p-0 bg-black text-white">
        <Sidebar 
          sidebarLinks={sidebarLinks} 
          handleSignOut={handleSignOut} 
          isMobile={true}
          closeMobileMenu={closeMobileMenu}
        />
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
