
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { NavItem } from "../hooks/useUserLayoutData";

interface MobileNavBarProps {
  navItems: NavItem[];
  userMenuItems: NavItem[];
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (value: boolean) => void;
  toggleMobileMenu: () => void;
  onSignOut: () => Promise<void>;
  profile: any;
  cartCount: number;
}

const MobileNavBar = ({
  navItems,
  userMenuItems,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  toggleMobileMenu,
  onSignOut,
  profile,
  cartCount
}: MobileNavBarProps) => {
  return (
    <div className="sticky top-0 z-10 lg:hidden flex items-center justify-between p-4 border-b bg-white">
      <div className="flex items-center gap-2">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <div className="p-6 border-b">
              <div className="flex flex-col gap-1">
                <h1 className="font-bold text-2xl">VAMNA</h1>
                <p className="text-sm text-muted-foreground">Your lasting beauty</p>
              </div>
            </div>

            <div className="flex flex-col p-4 gap-4">
              <nav>
                <ul className="space-y-1">
                  {navItems.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <li key={item.href}>
                        <Link 
                          to={item.href}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                            item.isActive 
                              ? "bg-gray-100 text-gray-900 font-medium" 
                              : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                          )}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <IconComponent className="h-5 w-5" />
                          {item.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
              
              <div className="mt-auto space-y-1">
                {userMenuItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <Button
                      key={item.href}
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "w-full justify-start", 
                        item.isActive && "bg-gray-100 text-gray-900 font-medium"
                      )}
                      onClick={() => {
                        if (item.name === "Logout") {
                          onSignOut();
                        } else {
                          setIsMobileMenuOpen(false);
                        }
                      }}
                      asChild={item.name !== "Logout"}
                    >
                      {item.name !== "Logout" ? (
                        <Link to={item.href} className="flex items-center gap-3">
                          <IconComponent className="h-4 w-4" />
                          {item.name}
                        </Link>
                      ) : (
                        <div className="flex items-center gap-3 text-red-500 hover:text-red-600">
                          <IconComponent className="h-4 w-4" />
                          {item.name}
                        </div>
                      )}
                    </Button>
                  );
                })}
              </div>
            </div>
          </SheetContent>
        </Sheet>
        
        <Link to="/" className="font-bold text-xl">VAMNA</Link>
      </div>
      
      <div className="flex items-center gap-2">
        <Link to="/cart">
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Button>
        </Link>
        
        <Avatar className="h-8 w-8">
          <AvatarImage src={profile?.avatar_url} />
          <AvatarFallback>
            {profile?.full_name?.charAt(0) || profile?.email?.charAt(0) || "U"}
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
};

export default MobileNavBar;
