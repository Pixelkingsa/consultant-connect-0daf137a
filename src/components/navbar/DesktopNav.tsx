import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { NavLink } from "./types";

interface DesktopNavProps {
  links: NavLink[];
}

const DesktopNav = ({ links }: DesktopNavProps) => {
  const location = useLocation();
  
  // Filter out links or return only specific ones
  // This approach keeps the component dynamic while allowing you to filter out unwanted links
  const visibleLinks = links.filter(link => {
    // Add your filtering logic here
    // For example, to remove a specific path like "/shop":
    return link.path !== "/shop";
  });
  
  return (
    <nav className="hidden md:flex items-center space-x-8">
      {visibleLinks.map(link => (
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
