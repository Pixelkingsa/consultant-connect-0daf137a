
import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import { ShoppingBag, Loader2 } from "lucide-react";
import { Loader } from "@/components/ui/loader";
import { useCart } from "@/hooks/use-cart";
import CartHeader from "@/components/cart/CartHeader";
import EmptyCart from "@/components/cart/EmptyCart";
import CartItemsTable from "@/components/cart/CartItemsTable";
import CartSummary from "@/components/cart/CartSummary";

const Cart = () => {
  const { 
    cartItems, 
    loading, 
    updatingItem, 
    updateQuantity, 
    removeItem, 
    handleCheckout 
  } = useCart();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" text="Loading your cart..." />
      </div>
    );
  }
  
  return (
    <AppLayout>
      <div className="container max-w-7xl mx-auto px-4 lg:px-8 py-8">
        <CartHeader title="Your Cart" />
        
        {cartItems.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items Table */}
            <div className="lg:col-span-2">
              <CartItemsTable 
                cartItems={cartItems}
                updateQuantity={updateQuantity}
                removeItem={removeItem}
                updatingItem={updatingItem}
              />
            </div>
            
            {/* Order Summary */}
            <div>
              <CartSummary 
                cartItems={cartItems}
                handleCheckout={handleCheckout}
              />
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Cart;
