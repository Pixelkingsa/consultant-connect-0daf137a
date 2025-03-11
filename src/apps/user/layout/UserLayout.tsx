
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useUserLayoutData } from "./hooks/useUserLayoutData";
import UserSidebar from "./components/UserSidebar";
import MobileNavBar from "./components/MobileNavBar";
import TopNav from "./components/TopNav";

interface UserLayoutProps {
  children: React.ReactNode;
}

const UserLayout = ({ children }: UserLayoutProps) => {
  const location = useLocation();
  const { 
    user, 
    profile, 
    isMobileMenuOpen, 
    setIsMobileMenuOpen, 
    cartCount, 
    loading, 
    handleSignOut, 
    toggleMobileMenu,
    getNavItems,
    getUserMenuItems
  } = useUserLayoutData();

  // Close mobile menu when location changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname, setIsMobileMenuOpen]);

  const navItems = getNavItems(location.pathname);
  const userMenuItems = getUserMenuItems(location.pathname);
  
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
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Mobile Navigation */}
      <MobileNavBar 
        navItems={navItems}
        userMenuItems={userMenuItems}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        toggleMobileMenu={toggleMobileMenu}
        onSignOut={handleSignOut}
        profile={profile}
        cartCount={cartCount}
      />
      
      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <UserSidebar 
          navItems={navItems}
          userMenuItems={userMenuItems}
          onSignOut={handleSignOut}
          profile={profile}
        />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Desktop Top Navigation */}
          <TopNav 
            userMenuItems={userMenuItems}
            onSignOut={handleSignOut}
            profile={profile}
            cartCount={cartCount}
          />
          
          {/* Main Content Area */}
          <main className="flex-1 p-4 lg:p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default UserLayout;
