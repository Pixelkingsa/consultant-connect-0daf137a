import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import UserDashboard from "@/pages/UserDashboard";
import Shop from "@/pages/Shop";
import Profile from "@/pages/Profile";
import Orders from "@/pages/Orders";
import Cart from "@/pages/Cart";
import Referrals from "@/pages/Referrals";
import News from "@/pages/News";
import Settings from "@/pages/Settings";
import AdminDashboard from "@/pages/AdminDashboard";
import ProductsManagement from "@/pages/admin/ProductsManagement";
import OrdersManagement from "@/pages/admin/OrdersManagement";
import CustomersManagement from "@/pages/admin/CustomersManagement";
import CompensationManagement from "@/pages/admin/CompensationManagement";
import WithdrawalsManagement from "@/pages/admin/WithdrawalsManagement";
import NotFound from "@/pages/NotFound";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/components/auth/AuthProvider";
import { Loader } from "@/components/ui/loader";

export const AppRoutes = () => {
  const { isAuthenticated, isAdmin, userId } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Show loading state while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader size="lg" text="Loading application..." />
      </div>
    );
  }

  // Log current route and auth status for debugging
  useEffect(() => {
    console.log(`Current route: ${location.pathname}`);
    console.log(`Auth status: isAuthenticated=${isAuthenticated}, isAdmin=${isAdmin}, userId=${userId}`);
    
    // Handle specific routing based on role
    if (isAuthenticated) {
      if (isAdmin) {
        // If admin is on a user-specific route, redirect to admin dashboard
        if (location.pathname === "/dashboard" || location.pathname === "/user-dashboard") {
          console.log("Admin user detected, redirecting to admin dashboard");
          navigate("/admin-dashboard", { replace: true });
        }
      } else {
        // If regular user tries to access admin routes, redirect to user dashboard
        if (location.pathname.startsWith("/admin")) {
          console.log("Regular user detected on admin route, redirecting to dashboard");
          navigate("/dashboard", { replace: true });
        }
      }
    }
  }, [isAuthenticated, isAdmin, location.pathname, userId, navigate]);

  return (
    <>
      {/* Only show Navbar for unauthenticated users */}
      {!isAuthenticated && <Navbar />}
      
      <Routes>
        {/* Root redirect based on auth and admin status */}
        <Route 
          path="/" 
          element={
            isAuthenticated 
              ? (isAdmin 
                  ? <Navigate to="/admin-dashboard" replace /> 
                  : <Navigate to="/dashboard" replace />)
              : <Navigate to="/auth" replace />
          } 
        />

        {/* Auth route - redirect authenticated users based on role */}
        <Route path="/auth" element={
          isAuthenticated 
            ? (isAdmin 
                ? <Navigate to="/admin-dashboard" replace /> 
                : <Navigate to="/dashboard" replace />)
            : <Auth />
        } />
        
        {/* Dashboard routes with role-based redirects */}
        <Route path="/dashboard" element={
          isAuthenticated 
            ? (isAdmin 
                ? <Navigate to="/admin-dashboard" replace /> 
                : <Dashboard />)
            : <Navigate to="/auth" replace />
        } />
        
        <Route path="/user-dashboard" element={
          isAuthenticated 
            ? (isAdmin 
                ? <Navigate to="/admin-dashboard" replace /> 
                : <UserDashboard />)
            : <Navigate to="/auth" replace />
        } />
        
        {/* Regular user routes - accessible by both regular users and admins */}
        <Route path="/shop" element={isAuthenticated ? <Shop /> : <Navigate to="/auth" replace />} />
        <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/auth" replace />} />
        <Route path="/orders" element={isAuthenticated ? <Orders /> : <Navigate to="/auth" replace />} />
        <Route path="/cart" element={isAuthenticated ? <Cart /> : <Navigate to="/auth" replace />} />
        <Route path="/referrals" element={isAuthenticated ? <Referrals /> : <Navigate to="/auth" replace />} />
        <Route path="/news" element={isAuthenticated ? <News /> : <Navigate to="/auth" replace />} />
        <Route path="/settings" element={isAuthenticated ? <Settings /> : <Navigate to="/auth" replace />} />
        
        {/* Admin routes - only accessible by admins */}
        <Route path="/admin-dashboard" element={
          isAuthenticated 
            ? (isAdmin 
                ? <AdminDashboard /> 
                : <Navigate to="/dashboard" replace />)
            : <Navigate to="/auth" replace />
        } />
        <Route path="/admin/products" element={
          isAuthenticated 
            ? (isAdmin 
                ? <ProductsManagement /> 
                : <Navigate to="/dashboard" replace />)
            : <Navigate to="/auth" replace />
        } />
        <Route path="/admin/orders" element={
          isAuthenticated 
            ? (isAdmin 
                ? <OrdersManagement /> 
                : <Navigate to="/dashboard" replace />)
            : <Navigate to="/auth" replace />
        } />
        <Route path="/admin/customers" element={
          isAuthenticated 
            ? (isAdmin 
                ? <CustomersManagement /> 
                : <Navigate to="/dashboard" replace />)
            : <Navigate to="/auth" replace />
        } />
        <Route path="/admin/compensation" element={
          isAuthenticated 
            ? (isAdmin 
                ? <CompensationManagement /> 
                : <Navigate to="/dashboard" replace />)
            : <Navigate to="/auth" replace />
        } />
        <Route path="/admin/withdrawals" element={
          isAuthenticated 
            ? (isAdmin 
                ? <WithdrawalsManagement /> 
                : <Navigate to="/dashboard" replace />)
            : <Navigate to="/auth" replace />
        } />
        
        {/* Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};
