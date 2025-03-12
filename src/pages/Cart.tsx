
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { useCart } from "@/contexts/CartContext";
import CartItemsList from "@/components/cart/CartItemsList";
import OrderSummary from "@/components/cart/OrderSummary";
import EmptyCart from "@/components/cart/EmptyCart";
import LoadingCart from "@/components/cart/LoadingCart";

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, isLoading, updateCartItem, removeCartItem } = useCart();
  const [updatingItem, setUpdatingItem] = useState<string | null>(null);
  
  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setUpdatingItem(itemId);
    await updateCartItem(itemId, newQuantity);
    setUpdatingItem(null);
  };
  
  const handleRemoveItem = async (itemId: string) => {
    setUpdatingItem(itemId);
    await removeCartItem(itemId);
    setUpdatingItem(null);
  };
  
  const handleCheckout = () => {
    navigate("/checkout");
  };
  
  if (isLoading) {
    return <LoadingCart />;
  }
  
  return (
    <AppLayout>
      <div className="container max-w-7xl mx-auto px-4 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
        
        {cartItems.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items Table */}
            <div className="lg:col-span-2">
              <CartItemsList 
                cartItems={cartItems}
                updatingItem={updatingItem}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
              />
            </div>
            
            {/* Order Summary */}
            <div>
              <OrderSummary 
                cartItems={cartItems}
                onCheckout={handleCheckout}
              />
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Cart;
