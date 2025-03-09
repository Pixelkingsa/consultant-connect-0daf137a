import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Bell, ChevronDown, CreditCard, Home, LogOut, Menu, Package, Settings, ShoppingCart, User, Users } from "lucide-react";
import Navbar from "@/components/Navbar";

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
    { name: "Dashboard", path: "/dashboard", icon: <Home className="h-5 w-5" /> },
    { name: "Shop", path: "/shop", icon: <Package className="h-5 w-5" /> },
    { name: "Orders", path: "/orders", icon: <CreditCard className="h-5 w-5" /> },
    { name: "Referrals", path: "/referrals", icon: <Users className="h-5 w-5" /> },
    { name: "Profile", path: "/profile", icon: <User className="h-5 w-5" /> },
    { name: "Settings", path: "/settings", icon: <Settings className="h-5 w-5" /> },
  ];
  
  if (isAdmin) {
    sidebarLinks.push(
      { name: "Admin Dashboard", path: "/admin-dashboard", icon: <Bell className="h-5 w-5" /> }
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex flex-1 pt-16">
        {/* Sidebar for desktop */}
        <aside className="hidden md:flex flex-col w-64 border-r bg-card">
          <div className="p-6">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={profile?.avatar_url} />
                <AvatarFallback>{profile?.full_name?.charAt(0) || user?.email?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{profile?.full_name || "User"}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            
            {profile && (
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Rank</span>
                  <Badge variant="outline">{profile.rank}</Badge>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm font-medium">PV</span>
                  <span className="text-sm">{profile.personal_volume}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm font-medium">GV</span>
                  <span className="text-sm">{profile.group_volume}</span>
                </div>
              </div>
            )}
          </div>
          
          <Separator />
          
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {sidebarLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                      window.location.pathname === link.path
                        ? "bg-accent text-accent-foreground font-medium"
                        : "hover:bg-muted"
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
            <Button variant="outline" className="w-full justify-start" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </aside>
        
        {/* Mobile sidebar */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetContent side="left" className="w-64 p-0">
            <div className="p-6">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={profile?.avatar_url} />
                  <AvatarFallback>{profile?.full_name?.charAt(0) || user?.email?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{profile?.full_name || "User"}</p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>
              
              {profile && (
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Rank</span>
                    <Badge variant="outline">{profile.rank}</Badge>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm font-medium">PV</span>
                    <span className="text-sm">{profile.personal_volume}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm font-medium">GV</span>
                    <span className="text-sm">{profile.group_volume}</span>
                  </div>
                </div>
              )}
            </div>
            
            <Separator />
            
            <nav className="flex-1 p-4">
              <ul className="space-y-2">
                {sidebarLinks.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                        window.location.pathname === link.path
                          ? "bg-accent text-accent-foreground font-medium"
                          : "hover:bg-muted"
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
              <Button variant="outline" className="w-full justify-start" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </SheetContent>
        </Sheet>
        
        {/* Main content */}
        <main className="flex-1 overflow-auto">
          {/* Mobile header */}
          <div className="md:hidden flex items-center justify-between p-4 border-b">
            <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="h-6 w-6" />
            </Button>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative"
                onClick={() => navigate("/cart")}
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
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/settings")}>
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
          
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
