import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, ShoppingCart, User, Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/cart";

interface MobileHeaderProps {
  profile: any;
  user: any;
  setIsMobileMenuOpen: (open: boolean) => void;
  handleSignOut: () => void;
}

export const MobileHeader = ({ 
  profile, 
  user, 
  setIsMobileMenuOpen, 
  handleSignOut 
}: MobileHeaderProps) => {
  const navigate = useNavigate();
  const { cartCount } = useCart();
  
  return (
    <div className="md:hidden flex items-center justify-between p-4 border-b bg-white">
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
  );
};
