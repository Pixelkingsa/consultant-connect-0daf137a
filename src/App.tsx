
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import Auth from "./pages/Auth";
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

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
      
      // Set up auth state listener
      const { data: authListener } = supabase.auth.onAuthStateChange(
        (event, session) => {
          setIsAuthenticated(!!session);
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
              <Route path="/" element={<Navigate to="/user-dashboard" replace />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<Navigate to="/user-dashboard" replace />} />
              <Route path="/user-dashboard" element={<UserDashboard />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/referrals" element={<Referrals />} />
              <Route path="/news" element={<News />} />
              <Route path="/settings" element={<Settings />} />
              
              {/* Admin routes */}
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/admin/products" element={<ProductsManagement />} />
              <Route path="/admin/orders" element={<OrdersManagement />} />
              <Route path="/admin/customers" element={<CustomersManagement />} />
              <Route path="/admin/compensation" element={<CompensationManagement />} />
              <Route path="/admin/withdrawals" element={<WithdrawalsManagement />} />
              
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
