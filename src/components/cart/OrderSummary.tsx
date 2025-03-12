
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface OrderSummaryProps {
  subtotal: number;
  tax: number;
  total: number;
}

const OrderSummary = ({ subtotal, tax, total }: OrderSummaryProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleCheckout = () => {
    // Placeholder for checkout functionality
    toast({
      title: "Checkout",
      description: "Checkout functionality will be implemented soon.",
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax (8%)</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="border-t pt-4 flex justify-between font-bold">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
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

export default OrderSummary;
