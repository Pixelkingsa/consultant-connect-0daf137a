
import { Routes, Route, Navigate } from "react-router-dom";
import Auth from "@/pages/Auth";
import UserApp from "@/apps/user/UserApp";
import AdminApp from "@/apps/admin/AdminApp";
import NotFound from "@/pages/NotFound";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/components/auth/AuthProvider";
import { Loader } from "@/components/ui/loader";

export const AppRoutes = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  // Show loading state while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader size="lg" text="Loading application..." />
      </div>
    );
  }

  return (
    <>
      {/* Only show Navbar for unauthenticated users */}
      {!isAuthenticated && <Navbar />}
      
      <Routes>
        <Route 
          path="/" 
          element={
            isAuthenticated 
              ? (isAdmin 
                  ? <Navigate to="/admin" replace /> 
                  : <Navigate to="/user" replace />)
              : <Navigate to="/auth" replace />
          } 
        />
        
        <Route path="/auth" element={
          isAuthenticated 
            ? (isAdmin 
                ? <Navigate to="/admin" replace /> 
                : <Navigate to="/user" replace />)
            : <Auth />
        } />
        
        {/* User App Routes */}
        <Route path="/user/*" element={
          isAuthenticated 
            ? <UserApp />
            : <Navigate to="/auth" replace />
        } />
        
        {/* Admin App Routes */}
        <Route path="/admin/*" element={
          isAuthenticated 
            ? (isAdmin 
                ? <AdminApp /> 
                : <Navigate to="/user" replace />)
            : <Navigate to="/auth" replace />
        } />
        
        {/* Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};
