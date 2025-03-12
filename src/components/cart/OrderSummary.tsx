
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CartItem } from "@/types/cart";
import { Badge } from "@/components/ui/badge";

interface OrderSummaryProps {
  cartItems: CartItem[];
  onCheckout: () => void;
  paymentMethod?: string;
  transactionId?: string;
}

const OrderSummary = ({ cartItems, onCheckout, paymentMethod, transactionId }: OrderSummaryProps) => {
  const navigate = useNavigate();
  
  // Calculate cart totals
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.products?.price || 0) * item.quantity;
    }, 0);
  };
  
  const calculateTax = () => {
    return calculateSubtotal() * 0.15; // 15% VAT in South Africa
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
          <span>R {calculateSubtotal().toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax (15% VAT)</span>
          <span>R {calculateTax().toFixed(2)}</span>
        </div>
        <div className="border-t pt-4 flex justify-between font-bold">
          <span>Total (ZAR)</span>
          <span>R {calculateTotal().toFixed(2)}</span>
        </div>
        
        {paymentMethod && (
          <div className="pt-2">
            <p className="text-sm text-muted-foreground">
              Payment method: <Badge variant="outline">{paymentMethod}</Badge>
            </p>
            {transactionId && (
              <p className="text-sm text-muted-foreground mt-1">
                Transaction ID: <span className="font-mono text-xs">{transactionId}</span>
              </p>
            )}
          </div>
        )}
        
        <Button 
          className="w-full mt-6" 
          size="lg"
          onClick={onCheckout}
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
        
        <div className="text-xs text-muted-foreground">
          <p>All prices are in South African Rand (ZAR)</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderSummary;
