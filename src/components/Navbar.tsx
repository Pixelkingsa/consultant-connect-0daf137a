
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/ThemeProvider";
import Logo from "./navbar/Logo";
import DesktopNav from "./navbar/DesktopNav";
import DesktopActions from "./navbar/DesktopActions";
import MobileMenuButton from "./navbar/MobileMenuButton";
import MobileMenu from "./navbar/MobileMenu";
import { useNavbar } from "./navbar/useNavbar";

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const { 
    isScrolled, 
    isMobileMenuOpen, 
    setIsMobileMenuOpen,
    user, 
    cartCount,
    navLinks 
  } = useNavbar();
  
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };
  
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
        <Logo />
        <DesktopNav links={navLinks} />
        <DesktopActions 
          theme={theme} 
          toggleTheme={toggleTheme} 
          user={user} 
          cartCount={cartCount} 
        />
        
        <MobileMenuButton 
          isMobileMenuOpen={isMobileMenuOpen} 
          setIsMobileMenuOpen={setIsMobileMenuOpen} 
        />
      </div>
      
      <MobileMenu 
        isMobileMenuOpen={isMobileMenuOpen}
        links={navLinks}
        user={user}
        cartCount={cartCount}
      />
    </header>
  );
};

export default Navbar;
