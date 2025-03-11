
import { useState } from "react";
import { DesktopSidebar } from "./DesktopSidebar";
import { MobileSidebar } from "./MobileSidebar";
import { MobileHeader } from "./MobileHeader";
import { DesktopHeader } from "./DesktopHeader";
import { useAppUser } from "@/hooks/useAppUser";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, profile, isAdmin, cartCount, handleSignOut } = useAppUser();
  
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <DesktopSidebar 
          isAdmin={isAdmin} 
          handleSignOut={handleSignOut} 
        />
        
        {/* Mobile Sidebar */}
        <MobileSidebar 
          isAdmin={isAdmin}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          handleSignOut={handleSignOut}
        />
        
        {/* Main content */}
        <main className="flex-1 overflow-auto bg-gray-50 md:ml-64">
          {/* Mobile header */}
          <MobileHeader 
            profile={profile}
            user={user}
            cartCount={cartCount}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
            handleSignOut={handleSignOut}
          />
          
          {/* Desktop header */}
          <DesktopHeader 
            profile={profile}
            user={user}
            cartCount={cartCount}
            handleSignOut={handleSignOut}
          />
          
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
