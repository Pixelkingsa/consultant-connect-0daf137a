
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Search, ShoppingCart, User, Settings, LogOut, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DesktopHeaderProps {
  profile: any;
  user: any;
  cartCount: number;
  handleSignOut: () => void;
}

const DesktopHeader = ({ 
  profile, 
  user, 
  cartCount, 
  handleSignOut 
}: DesktopHeaderProps) => {
  const navigate = useNavigate();
  
  return (
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
          onClick={() => navigate("/cart")}
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

export default DesktopHeader;
