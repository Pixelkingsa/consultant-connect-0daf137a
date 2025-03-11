
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "@/components/layout/AdminLayout";
import AdminDashboard from "@/pages/AdminDashboard";
import ProductsManagement from "@/pages/admin/ProductsManagement";
import OrdersManagement from "@/pages/admin/OrdersManagement";
import CustomersManagement from "@/pages/admin/CustomersManagement";
import CompensationManagement from "@/pages/admin/CompensationManagement";
import WithdrawalsManagement from "@/pages/admin/WithdrawalsManagement";

const AdminApp = () => {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<ProductsManagement />} />
        <Route path="orders" element={<OrdersManagement />} />
        <Route path="customers" element={<CustomersManagement />} />
        <Route path="compensation" element={<CompensationManagement />} />
        <Route path="withdrawals" element={<WithdrawalsManagement />} />
      </Route>
    </Routes>
  );
};

export default AdminApp;
