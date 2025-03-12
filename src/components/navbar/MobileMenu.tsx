import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { NavLink } from "./types";
import { useCart } from "@/contexts/cart";

interface MobileMenuProps {
  isMobileMenuOpen: boolean;
  links: NavLink[];
  user: any;
}

const MobileMenu = ({ isMobileMenuOpen, links, user }: MobileMenuProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartCount } = useCart();
  
  return (
    <div
      className={cn(
        "fixed inset-0 top-[60px] bg-background/95 backdrop-blur-sm z-40 md:hidden transition-transform duration-300 ease-in-out",
        isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
      )}
    >
      <div className="flex flex-col p-6 space-y-6">
        <nav className="flex flex-col space-y-6">
          {links.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "text-xl transition-colors hover:text-accent",
                location.pathname === link.path
                  ? "text-accent font-medium"
                  : "text-foreground/80"
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>
        
        <div className="flex flex-col space-y-4 pt-4 border-t">
          {user ? (
            <>
              <Link to="/cart" className="w-full flex items-center gap-2">
                <Button variant="ghost" className="w-full justify-start">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Cart {cartCount > 0 && `(${cartCount})`}
                </Button>
              </Link>
              <Link to="/dashboard" className="w-full">
                <Button className="w-full justify-center">
                  Dashboard
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/auth" className="w-full">
                <Button variant="ghost" className="w-full justify-center">
                  Sign In
                </Button>
              </Link>
              <Link to="/auth?register=true" className="w-full">
                <Button className="w-full justify-center">
                  Join Now
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
