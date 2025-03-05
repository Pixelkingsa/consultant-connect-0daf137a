
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  useEffect(() => {
    // Close mobile menu when route changes
    setIsMobileMenuOpen(false);
  }, [location]);
  
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "Opportunity", path: "/opportunity" },
    { name: "Dashboard", path: "/dashboard" }
  ];
  
  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300 px-4 lg:px-8",
        isScrolled 
          ? "py-3 bg-background/80 backdrop-blur-lg shadow-sm" 
          : "py-5 bg-transparent"
      )}
    >
      <div className="container max-w-7xl mx-auto flex items-center justify-between">
        <Link 
          to="/" 
          className="text-2xl font-medium tracking-tight"
          aria-label="Vamna Fragrances"
        >
          Vamna<span className="text-accent font-normal">.</span>
        </Link>
        
        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "text-sm transition-colors hover:text-accent",
                location.pathname === link.path
                  ? "text-accent font-medium"
                  : "text-foreground/80"
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>
        
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/auth">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
          </Link>
          <Link to="/auth?register=true">
            <Button size="sm">Join Now</Button>
          </Link>
        </div>
        
        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-full hover:bg-accent/10"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>
      
      {/* Mobile menu */}
      <div
        className={cn(
          "fixed inset-0 top-[60px] bg-background/95 backdrop-blur-sm z-40 md:hidden transition-transform duration-300 ease-in-out",
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col p-6 space-y-6">
          <nav className="flex flex-col space-y-6">
            {navLinks.map(link => (
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
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
