
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface SidebarLink {
  name: string;
  path: string;
  icon: React.ReactNode;
}

interface SidebarLinksProps {
  links: SidebarLink[];
  onMobileItemClick?: () => void;
}

const SidebarLinks = ({ links, onMobileItemClick }: SidebarLinksProps) => {
  const location = useLocation();
  
  return (
    <nav className="flex-1 px-4 py-2">
      <ul className="space-y-1">
        {links.map((link) => (
          <li key={link.path}>
            <Link
              to={link.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                location.pathname === link.path
                  ? "bg-white/10 text-white font-medium"
                  : "text-gray-300 hover:bg-white/5 hover:text-white"
              )}
              onClick={onMobileItemClick}
            >
              {link.icon}
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default SidebarLinks;
