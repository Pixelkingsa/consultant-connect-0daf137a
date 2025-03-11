
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import DesktopSidebar from "./sidebar/DesktopSidebar";
import MobileSidebar from "./sidebar/MobileSidebar";
import MobileHeader from "./header/MobileHeader";
import DesktopHeader from "./header/DesktopHeader";
import { useSidebarLinks } from "./hooks/useSidebarLinks";
import { Loader } from "@/components/ui/loader";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const sidebarLinks = useSidebarLinks(isAdmin);
  
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        navigate("/auth");
        return;
      }
      
      setUser(user);
      
      // Check if user is admin
      const { data: profiles, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
        
      if (!profileError && profiles) {
        setProfile(profiles);
        setIsAdmin(profiles.rank === "Admin");
      }
      
      // Get cart count from the cart_items table
      try {
        const { count, error: cartError } = await supabase
          .from("cart_items")
          .select("id", { count: 'exact', head: true })
          .eq("user_id", user.id);
          
        if (!cartError) {
          setCartCount(count || 0);
        } else {
          console.error("Error fetching cart count:", cartError);
          setCartCount(0);
        }
      } catch (cartError) {
        console.error("Error counting cart items:", cartError);
        setCartCount(0);
      }
      
      setLoading(false);
    };
    
    checkUser();
  }, [navigate]);
  
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
