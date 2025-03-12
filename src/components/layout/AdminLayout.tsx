
import { useState } from "react";
import AdminAuthChecker from "./admin/AdminAuthChecker";
import AdminSidebar from "./admin/AdminSidebar";
import AdminMobileToggle from "./admin/AdminMobileToggle";
import { getAdminNavItems } from "./admin/AdminNavItems";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navItems = getAdminNavItems();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <AdminAuthChecker>
      {(isAdmin) => {
        if (!isAdmin) {
          return null; // Will redirect in AdminAuthChecker
        }

        return (
          <div className="flex h-screen bg-background">
            {/* Mobile sidebar toggle */}
            <AdminMobileToggle 
              sidebarOpen={sidebarOpen}
              toggleSidebar={toggleSidebar}
            />

            {/* Sidebar */}
            <AdminSidebar
              navItems={navItems}
              sidebarOpen={sidebarOpen}
            />

            {/* Main content area */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Main content */}
              <main className="flex-1 overflow-y-auto p-4">
                {children}
              </main>
            </div>
          </div>
        );
      }}
    </AdminAuthChecker>
  );
};

export default AdminLayout;
