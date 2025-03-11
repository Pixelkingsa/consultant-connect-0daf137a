
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import DesktopSidebar from "./sidebar/DesktopSidebar";
import MobileSidebar from "./sidebar/MobileSidebar";
import MobileHeader from "./header/MobileHeader";
import DesktopHeader from "./header/DesktopHeader";
import { useSidebarLinks } from "./hooks/useSidebarLinks";
import { Loader } from "@/components/ui/loader";
import { useAuth } from "@/components/auth/AuthProvider";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const sidebarLinks = useSidebarLinks(isAdmin);
  
  useEffect(() => {
    // Redirect if not authenticated
    if (isAuthenticated === false) {
      navigate("/auth");
      return;
    }
    
    const fetchUserData = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error || !user) {
          console.error("Error fetching user:", error);
          navigate("/auth");
          return;
        }
        
        setUser(user);
        
        // Get user profile
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
          
        if (!profileError && profileData) {
          setProfile(profileData);
        }
        
        // Get cart count
        try {
          const { count, error: cartError } = await supabase
            .from("cart_items")
            .select("id", { count: 'exact', head: true })
            .eq("user_id", user.id);
            
          if (!cartError) {
            setCartCount(count || 0);
          }
        } catch (error) {
          console.error("Error counting cart items:", error);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error in AppLayout:", error);
        navigate("/auth");
      }
    };
    
    fetchUserData();
  }, [navigate, isAuthenticated]);
  
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" text="Loading..." />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <DesktopSidebar 
          sidebarLinks={sidebarLinks} 
          handleSignOut={handleSignOut} 
        />
        
        {/* Mobile Sidebar */}
        <MobileSidebar 
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          sidebarLinks={sidebarLinks}
          handleSignOut={handleSignOut}
        />
        
        {/* Main content */}
        <main className="flex-1 overflow-auto bg-gray-50">
          {/* Mobile Header */}
          <MobileHeader 
            setIsMobileMenuOpen={setIsMobileMenuOpen}
            profile={profile}
            user={user}
            cartCount={cartCount}
            handleSignOut={handleSignOut}
          />
          
          {/* Desktop Header */}
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
