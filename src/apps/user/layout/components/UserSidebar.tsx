
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { NavItem } from "../hooks/useUserLayoutData";
import { Link } from "react-router-dom";

interface UserSidebarProps {
  navItems: NavItem[];
  userMenuItems: NavItem[];
  onSignOut: () => Promise<void>;
  profile: any;
}

const UserSidebar = ({ navItems, userMenuItems, onSignOut, profile }: UserSidebarProps) => {
  return (
    <div className="hidden lg:flex flex-col w-64 bg-white border-r h-screen sticky top-0">
      <div className="p-6 border-b">
        <div className="flex flex-col gap-1">
          <h1 className="font-bold text-2xl">VAMNA</h1>
          <p className="text-sm text-muted-foreground">Your lasting beauty</p>
        </div>
      </div>
      
      <div className="flex flex-col flex-1 p-4 gap-4">
        <nav>
          <ul className="space-y-1">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <li key={item.href}>
                  <Link 
                    to={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                      item.isActive 
                        ? "bg-gray-100 text-gray-900 font-medium" 
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    )}
                  >
                    <IconComponent className="h-5 w-5" />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        
        <div className="mt-auto space-y-1">
          {userMenuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <Button
                key={item.href}
                variant="ghost"
                size="sm"
                className={cn(
                  "w-full justify-start", 
                  item.isActive && "bg-gray-100 text-gray-900 font-medium"
                )}
                onClick={() => {
                  if (item.name === "Logout") {
                    onSignOut();
                  }
                }}
                asChild={item.name !== "Logout"}
              >
                {item.name !== "Logout" ? (
                  <Link to={item.href} className="flex items-center gap-3">
                    <IconComponent className="h-4 w-4" />
                    {item.name}
                  </Link>
                ) : (
                  <div className="flex items-center gap-3 text-red-500 hover:text-red-600">
                    <IconComponent className="h-4 w-4" />
                    {item.name}
                  </div>
                )}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default UserSidebar;
