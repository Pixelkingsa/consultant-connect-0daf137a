
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Sidebar from "./Sidebar";
import MobileSidebar from "./MobileSidebar";
import Header from "./Header";
import { useSidebarLinks } from "@/hooks/use-sidebar-links";

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
    };
    
    checkUser();
  }, [navigate]);
  
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        {/* Sidebar for desktop */}
        <aside className="hidden md:flex flex-col w-64 bg-black text-white">
          <Sidebar
            sidebarLinks={sidebarLinks}
            handleSignOut={handleSignOut}
          />
        </aside>
        
        {/* Mobile sidebar */}
        <MobileSidebar
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          sidebarLinks={sidebarLinks}
          handleSignOut={handleSignOut}
        />
        
        {/* Main content */}
        <main className="flex-1 overflow-auto bg-gray-50">
          {/* Mobile header */}
          <Header
            profile={profile}
            user={user}
            handleSignOut={handleSignOut}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
            cartCount={cartCount}
            isMobile={true}
          />
          
          {/* Desktop header */}
          <Header
            profile={profile}
            user={user}
            handleSignOut={handleSignOut}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
            cartCount={cartCount}
          />
          
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
