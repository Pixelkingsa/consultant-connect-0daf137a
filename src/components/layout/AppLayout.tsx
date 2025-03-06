
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Search, 
  Menu, 
  ShoppingCart, 
  User, 
  Home, 
  ShoppingBag, 
  ClipboardList, 
  Share2, 
  Settings, 
  HelpCircle, 
  LogOut,
  Bell,
  X,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(3);
  
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error || !user) {
          navigate("/auth");
          return;
        }
        
        setUser(user);
        
        // Get user profile
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        
        if (!profileError) {
          setProfile(profile);
        }
      } catch (error) {
        console.error("Error:", error);
        navigate("/auth");
      }
    };
    
    checkUser();
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
      });
      
      navigate("/auth");
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-10 w-64 bg-black text-white transition-transform duration-300 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}>
        <div className="p-4 flex items-center justify-center border-b border-white/10 h-16">
          <img 
            src="/lovable-uploads/a79a2128-78e1-4f37-99af-a9640dcc8da6.png" 
            alt="Vamna Fragrances" 
            className="h-12 w-auto"
          />
        </div>
        
        <nav className="py-6">
          <ul className="space-y-1 px-2">
            <li>
              <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-white/10">
                <Home className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link to="/shop" className="flex items-center gap-3 px-4 py-3 rounded-md bg-white/10">
                <ShoppingBag className="h-5 w-5" />
                <span>Shop</span>
              </Link>
            </li>
            <li>
              <Link to="/orders" className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-white/10">
                <ClipboardList className="h-5 w-5" />
                <span>Orders</span>
              </Link>
            </li>
            <li>
              <Link to="/referals" className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-white/10">
                <Share2 className="h-5 w-5" />
                <span>Referals</span>
              </Link>
            </li>
            <li>
              <Link to="/profile" className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-white/10">
                <User className="h-5 w-5" />
                <span>Profile</span>
              </Link>
            </li>
            <li>
              <Link to="/news" className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-white/10">
                <Bell className="h-5 w-5" />
                <span>News</span>
              </Link>
            </li>
          </ul>

          <div className="border-t border-white/10 my-6"></div>

          <ul className="space-y-1 px-2">
            <li>
              <Link to="/settings" className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-white/10">
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </Link>
            </li>
            <li>
              <Link to="/help" className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-white/10">
                <HelpCircle className="h-5 w-5" />
                <span>Help & Support</span>
              </Link>
            </li>
            <li>
              <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-red-500 hover:bg-white/10">
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b sticky top-0 z-10">
          <div className="flex items-center justify-between h-16 px-4">
            <div className="flex items-center gap-4">
              <button onClick={toggleSidebar} className="p-2 rounded-md hover:bg-gray-100 md:hidden">
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <div className="relative w-64 hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input 
                  type="search"
                  placeholder="Search"
                  className="pl-10 pr-4 py-2 w-full"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="relative p-2">
                <ShoppingCart size={24} />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {cartCount}
                  </span>
                )}
              </button>
              
              <div className="relative">
                <button 
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center gap-2 rounded-full bg-gray-100 p-1 pr-3"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                    <User size={20} />
                  </div>
                  <ChevronDown size={16} />
                </button>

                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border">
                    <div className="py-1">
                      <Link to="/profile" className="block px-4 py-2 text-sm hover:bg-gray-100">
                        Update Profile
                      </Link>
                      <Link to="/news" className="block px-4 py-2 text-sm hover:bg-gray-100">
                        News & Updates
                      </Link>
                      <Link to="/settings" className="block px-4 py-2 text-sm hover:bg-gray-100">
                        Settings
                      </Link>
                      <button 
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
