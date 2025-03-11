import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation, Outlet } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Bell,
  ChevronDown,
  CreditCard,
  HelpCircle,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Search,
  Settings,
  ShoppingCart,
  User,
  Users
} from "lucide-react";
import { Input } from "@/components/ui/input";

const UserLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  
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
  
  const sidebarLinks = [
    { name: "User Dashboard", path: "/user/user-dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: "Home", path: "/user/dashboard", icon: <Home className="h-5 w-5" /> },
    { name: "Shop", path: "/user/shop", icon: <Package className="h-5 w-5" /> },
    { name: "Orders", path: "/user/orders", icon: <CreditCard className="h-5 w-5" /> },
    { name: "Referrals", path: "/user/referrals", icon: <Users className="h-5 w-5" /> },
    { name: "Profile", path: "/user/profile", icon: <User className="h-5 w-5" /> },
    { name: "News", path: "/user/news", icon: <Bell className="h-5 w-5" /> },
    { name: "Settings", path: "/user/settings", icon: <Settings className="h-5 w-5" /> },
  ];
  
  if (isAdmin) {
    sidebarLinks.push(
      { name: "Admin Dashboard", path: "/admin", icon: <LayoutDashboard className="h-5 w-5" /> }
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        {/* Sidebar for desktop */}
        <aside className="hidden md:flex flex-col w-64 bg-black text-white">
          <div className="p-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold uppercase tracking-wider text-white">VAMNA</h1>
              <span className="text-xs ml-1 mt-1 text-gray-400">YOUR LASTING BEAUTY</span>
            </div>
          </div>
          
          <nav className="flex-1 px-4 py-2">
            <ul className="space-y-1">
              {sidebarLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                      location.pathname === link.path
                        ? "bg-white/10 text-white font-medium"
                        : "text-gray-300 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    {link.icon}
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
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
        </aside>
        
        {/* Mobile sidebar */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetContent side="left" className="w-64 p-0 bg-black text-white">
            <div className="p-6">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold uppercase tracking-wider text-white">VAMNA</h1>
                <span className="text-xs ml-1 mt-1 text-gray-400">YOUR LASTING BEAUTY</span>
              </div>
            </div>
            
            <nav className="flex-1 px-4 py-2">
              <ul className="space-y-1">
                {sidebarLinks.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                        location.pathname === link.path
                          ? "bg-white/10 text-white font-medium"
                          : "text-gray-300 hover:bg-white/5 hover:text-white"
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.icon}
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            
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
        
        {/* Main content */}
        <main className="flex-1 overflow-auto bg-gray-50">
          {/* Mobile header */}
          <div className="md:hidden flex items-center justify-between p-4 border-b bg-white">
            <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="h-6 w-6" />
            </Button>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative"
                onClick={() => navigate("/user/cart")}
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={profile?.avatar_url} />
                      <AvatarFallback>{profile?.full_name?.charAt(0) || user?.email?.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/user/profile")}>
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/user/settings")}>
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          {/* Desktop header */}
          <div className="hidden md:flex items-center justify-between p-4 bg-white border-b">
            <div className="relative w-72">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input 
                type="search" 
                placeholder="Search" 
                className="pl-8 bg-gray-100 border-gray-100"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative"
                onClick={() => navigate("/user/cart")}
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={profile?.avatar_url} />
                      <AvatarFallback>{profile?.full_name?.charAt(0) || user?.email?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/user/profile")}>
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/user/settings")}>
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          {/* Outlet for nested routes */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
