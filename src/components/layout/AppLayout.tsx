
import { useLayoutData } from "./hooks/useLayoutData";
import UserSidebar from "./sidebar/UserSidebar";
import MobileSidebar from "./sidebar/MobileSidebar";
import MobileHeader from "./header/MobileHeader";
import DesktopHeader from "./header/DesktopHeader";
import { useLocation } from "react-router-dom";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const { 
    user, 
    profile, 
    isMobileMenuOpen, 
    setIsMobileMenuOpen, 
    cartCount, 
    loading, 
    handleSignOut, 
    toggleMobileMenu,
    sidebarLinks
  } = useLayoutData();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <p className="text-lg text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <UserSidebar 
          sidebarLinks={sidebarLinks} 
          onSignOut={handleSignOut} 
        />
        
        {/* Mobile Sidebar */}
        <MobileSidebar 
          isOpen={isMobileMenuOpen} 
          onOpenChange={setIsMobileMenuOpen} 
          sidebarLinks={sidebarLinks} 
          onSignOut={handleSignOut} 
        />
        
        {/* Main content */}
        <main className="flex-1 overflow-auto bg-gray-50">
          {/* Mobile Header */}
          <MobileHeader 
            profile={profile} 
            user={user} 
            cartCount={cartCount} 
            toggleSidebar={toggleMobileMenu} 
            onSignOut={handleSignOut} 
          />
          
          {/* Desktop Header */}
          <DesktopHeader 
            profile={profile} 
            user={user} 
            cartCount={cartCount} 
            onSignOut={handleSignOut} 
          />
          
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
