
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { NavLink } from "./types";

interface DesktopNavProps {
  links: NavLink[];
}

const DesktopNav = ({ links }: DesktopNavProps) => {
  const location = useLocation();
  
  return (
    <nav className="hidden md:flex items-center space-x-8">
      {links.map(link => (
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
  );
};

export default DesktopNav;
