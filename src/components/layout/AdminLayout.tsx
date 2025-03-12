
import AdminAuthChecker from "./admin/AdminAuthChecker";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AdminAuthChecker>
      {(isAdmin) => {
        if (!isAdmin) {
          return null; // Will redirect in AdminAuthChecker
        }

        return (
          <div className="flex h-screen bg-background">
            {/* Main content area without sidebar */}
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
