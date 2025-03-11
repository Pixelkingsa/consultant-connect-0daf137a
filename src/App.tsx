
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import UserDashboard from "./pages/UserDashboard";
import Shop from "./pages/Shop";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import Cart from "./pages/Cart";
import Referrals from "./pages/Referrals";
import News from "./pages/News";
import Settings from "./pages/Settings";
import AdminDashboard from "./pages/AdminDashboard";
import ProductsManagement from "./pages/admin/ProductsManagement";
import OrdersManagement from "./pages/admin/OrdersManagement";
import CustomersManagement from "./pages/admin/CustomersManagement";
import CompensationManagement from "./pages/admin/CompensationManagement";
import WithdrawalsManagement from "./pages/admin/WithdrawalsManagement";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import { useState, useEffect } from "react";
import { supabase } from "./integrations/supabase/client";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
      
      if (data.session) {
        const { data: { user } } = await supabase.auth.getUser();
        
        // Check if user is admin (using same logic as AdminAuthChecker)
        if (user && user.email === "zonkebonke@gmail.com") {
          setIsAdmin(true);
        } else {
          // Check if user is the first user in the system
          const { data: profiles } = await supabase
            .from("profiles")
            .select("*")
            .order("created_at", { ascending: true })
            .limit(1);
            
          if (profiles && profiles.length > 0 && profiles[0].id === user?.id) {
            setIsAdmin(true);
          }
        }
      }
      
      // Set up auth state listener
      const { data: authListener } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          setIsAuthenticated(!!session);
          
          // Reset admin status when logged out
          if (!session) {
            setIsAdmin(false);
            return;
          }
          
          // Check admin status when logged in
          const { data: { user } } = await supabase.auth.getUser();
          
          if (user && user.email === "zonkebonke@gmail.com") {
            setIsAdmin(true);
          } else {
            // Check if user is the first user in the system
            const { data: profiles } = await supabase
              .from("profiles")
              .select("*")
              .order("created_at", { ascending: true })
              .limit(1);
              
            if (profiles && profiles.length > 0 && profiles[0].id === user?.id) {
              setIsAdmin(true);
            } else {
              setIsAdmin(false);
            }
          }
        }
      );
      
      return () => {
        authListener.subscription.unsubscribe();
      };
    };
    
    checkAuth();
  }, []);

  // Show loading state while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" storageKey="vamna-theme">
          <TooltipProvider>
            <Toaster />
            <Sonner />
            
            {/* Only show Navbar for unauthenticated users */}
            {!isAuthenticated && <Navbar />}
            
            <Routes>
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
              <Route path="/auth" element={
                isAuthenticated 
                  ? (isAdmin 
                      ? <Navigate to="/admin-dashboard" replace /> 
                      : <Navigate to="/dashboard" replace />)
                  : <Auth />
              } />
              
              {/* Redirect admin to admin dashboard if they try to access user pages */}
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
              
              {/* Regular user routes */}
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
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;
