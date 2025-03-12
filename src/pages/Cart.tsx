
import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import { useCart } from "@/contexts/CartContext";
import EmptyCart from "@/components/cart/EmptyCart";
import CartItemsTable from "@/components/cart/CartItemsTable";
import OrderSummary from "@/components/cart/OrderSummary";

const Cart = () => {
  const { 
    cartItems, 
    loading, 
    updatingItem, 
    updateQuantity, 
    removeItem,
    calculateSubtotal,
    calculateTax,
    calculateTotal
  } = useCart();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <p className="text-lg text-muted-foreground">Loading your cart...</p>
        </div>
      </div>
    );
  }
  
  return (
    <AppLayout>
      <div className="container max-w-7xl mx-auto px-4 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
        
        {cartItems.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <CartItemsTable 
                cartItems={cartItems}
                updatingItem={updatingItem}
                updateQuantity={updateQuantity}
                removeItem={removeItem}
              />
            </div>
            
            <div>
              <OrderSummary 
                subtotal={calculateSubtotal()}
                tax={calculateTax()}
                total={calculateTotal()}
              />
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Cart;
