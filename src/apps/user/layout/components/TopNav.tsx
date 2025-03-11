
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Search, ShoppingCart } from "lucide-react";
import { NavItem } from "../hooks/useUserLayoutData";

interface TopNavProps {
  userMenuItems: NavItem[];
  onSignOut: () => Promise<void>;
  profile: any;
  cartCount: number;
}

const TopNav = ({ userMenuItems, onSignOut, profile, cartCount }: TopNavProps) => {
  return (
    <div className="hidden lg:flex items-center justify-between p-4 border-b bg-white">
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search products..."
          className="pl-10 bg-gray-50 border-gray-100"
        />
      </div>
      
      <div className="flex items-center gap-4">
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
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 flex items-center">
              <Avatar className="h-8 w-8">
                <AvatarImage src={profile?.avatar_url} />
                <AvatarFallback>
                  {profile?.full_name?.charAt(0) || profile?.email?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="text-sm font-medium text-left">
                {profile?.full_name || profile?.email || "User"}
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            {userMenuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                item.name !== "Logout" ? (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link to={item.href} className="flex items-center gap-2 cursor-pointer">
                      <IconComponent className="h-4 w-4" />
                      {item.name}
                    </Link>
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem 
                    key={item.href} 
                    className="text-red-500 hover:text-red-600 cursor-pointer"
                    onClick={() => onSignOut()}
                  >
                    <IconComponent className="h-4 w-4" />
                    {item.name}
                  </DropdownMenuItem>
                )
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default TopNav;
