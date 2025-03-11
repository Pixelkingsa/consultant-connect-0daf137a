
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Wallet, 
  HandCoins 
} from "lucide-react";

export interface NavItem {
  name: string;
  icon: JSX.Element;
  path: string;
}

export const getAdminNavItems = (): NavItem[] => {
  return [
    { 
      name: "Dashboard", 
      icon: <LayoutDashboard className="h-5 w-5" />, 
      path: "/admin" 
    },
    { 
      name: "Products", 
      icon: <Package className="h-5 w-5" />, 
      path: "/admin/products" 
    },
    { 
      name: "Orders", 
      icon: <ShoppingCart className="h-5 w-5" />, 
      path: "/admin/orders" 
    },
    { 
      name: "Customers", 
      icon: <Users className="h-5 w-5" />, 
      path: "/admin/customers" 
    },
    { 
      name: "Compensation", 
      icon: <HandCoins className="h-5 w-5" />, 
      path: "/admin/compensation" 
    },
    { 
      name: "Withdrawals", 
      icon: <Wallet className="h-5 w-5" />, 
      path: "/admin/withdrawals" 
    },
  ];
};
