
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Moon, ShoppingCart, Sun } from "lucide-react";

interface DesktopActionsProps {
  theme: string;
  toggleTheme: () => void;
  user: any;
  cartCount: number;
}

const DesktopActions = ({ theme, toggleTheme, user, cartCount }: DesktopActionsProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="hidden md:flex items-center space-x-4">
      <button 
        onClick={toggleTheme} 
        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
      </button>
      
      {user ? (
        <>
          <button 
            className="relative p-2" 
            onClick={() => navigate("/cart")}
          >
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {cartCount}
              </span>
            )}
          </button>
          <Link to="/dashboard">
            <Button size="sm">Dashboard</Button>
          </Link>
        </>
      ) : (
        <>
          <Link to="/auth">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
          </Link>
          <Link to="/auth?register=true">
            <Button size="sm">Join Now</Button>
          </Link>
        </>
      )}
    </div>
  );
};

export default DesktopActions;
