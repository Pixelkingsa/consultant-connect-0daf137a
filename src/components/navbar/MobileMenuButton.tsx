
import { Menu, X } from "lucide-react";

interface MobileMenuButtonProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
}

const MobileMenuButton = ({ isMobileMenuOpen, setIsMobileMenuOpen }: MobileMenuButtonProps) => {
  return (
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
  );
};

export default MobileMenuButton;
