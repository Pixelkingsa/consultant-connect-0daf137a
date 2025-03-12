
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CartItem } from "@/types/cart";

interface CheckoutSummaryProps {
  cartItems: CartItem[];
  calculateSubtotal: () => number;
  calculateTax: () => number;
  calculateTotal: () => number;
}

const CheckoutSummary = ({ 
  cartItems, 
  calculateSubtotal, 
  calculateTax, 
  calculateTotal 
}: CheckoutSummaryProps) => {
  const navigate = useNavigate();
  
  return (
    <Card className="sticky top-6">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {cartItems.map((item) => (
          <div key={item.id} className="flex justify-between pb-2">
            <div className="flex items-start">
              <div className="flex-shrink-0 h-10 w-10 rounded-md overflow-hidden mr-3">
                <img
                  src={item.products?.image_url || "/placeholder.svg"}
                  alt={item.products?.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="font-medium">{item.products?.name}</p>
                <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
              </div>
            </div>
            <p className="font-medium">${(item.products?.price || 0) * item.quantity}</p>
          </div>
        ))}
        
        <Separator />
        
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
        
        <div className="pt-4">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => navigate("/cart")}
          >
            Back to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CheckoutSummary;
