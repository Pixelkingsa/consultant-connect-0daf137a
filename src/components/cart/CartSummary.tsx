
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CartItem } from "@/types/cart";

interface CartSummaryProps {
  cartItems: CartItem[];
  handleCheckout: () => void;
}

const CartSummary = ({ cartItems, handleCheckout }: CartSummaryProps) => {
  const navigate = useNavigate();
  
  // Calculate cart totals
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.products?.price || 0) * item.quantity;
    }, 0);
  };
  
  const calculateTax = () => {
    return calculateSubtotal() * 0.08; // 8% tax
  };
  
  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${calculateSubtotal().toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax (8%)</span>
          <span>${calculateTax().toFixed(2)}</span>
        </div>
        <div className="border-t pt-4 flex justify-between font-bold">
          <span>Total</span>
          <span>${calculateTotal().toFixed(2)}</span>
        </div>
        <Button 
          className="w-full mt-6" 
          size="lg"
          onClick={handleCheckout}
        >
          Proceed to Checkout
        </Button>
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={() => navigate("/shop")}
        >
          Continue Shopping
        </Button>
      </CardContent>
    </Card>
  );
};

export default CartSummary;
