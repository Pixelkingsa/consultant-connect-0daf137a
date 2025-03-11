
import { Routes, Route, Navigate } from "react-router-dom";
import UserLayout from "@/apps/user/layout/UserLayout";
import Dashboard from "@/pages/Dashboard";
import UserDashboard from "@/pages/UserDashboard";
import Shop from "@/pages/Shop";
import Profile from "@/pages/Profile";
import Orders from "@/pages/Orders";
import Cart from "@/pages/Cart";
import Referrals from "@/pages/Referrals";
import News from "@/pages/News";
import Settings from "@/pages/Settings";

const UserApp = () => {
  return (
    <Routes>
      <Route element={<UserLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="user-dashboard" element={<UserDashboard />} />
        <Route path="shop" element={<Shop />} />
        <Route path="profile" element={<Profile />} />
        <Route path="orders" element={<Orders />} />
        <Route path="cart" element={<Cart />} />
        <Route path="referrals" element={<Referrals />} />
        <Route path="news" element={<News />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
};

export default UserApp;
