
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminMobileToggleProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

const AdminMobileToggle = ({ sidebarOpen, toggleSidebar }: AdminMobileToggleProps) => {
  return (
    <Button
      variant="outline"
      size="icon"
      className="fixed top-4 left-4 z-50 lg:hidden"
      onClick={toggleSidebar}
    >
      {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
    </Button>
  );
};

export default AdminMobileToggle;
