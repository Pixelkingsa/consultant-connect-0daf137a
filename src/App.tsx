import { QueryClient, QueryClientProvider } from "react-query";
import { ThemeProvider } from "@/context/ThemeContext";
import { CartProvider } from "./contexts/cart";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "@/pages/Home";
import Shop from "@/pages/Shop";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import UserDashboard from "@/pages/UserDashboard";
import Auth from "@/pages/Auth";
import Orders from "@/pages/Orders";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <CartProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/user-dashboard" element={<UserDashboard />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/orders" element={<Orders />} />
            </Routes>
          </Router>
        </CartProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
