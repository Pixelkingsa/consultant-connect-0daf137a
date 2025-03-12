
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CartItem } from "@/types/cart";
import { Separator } from "@/components/ui/separator";
import PayfastPaymentButton from "@/components/payment/PayfastPaymentButton";

interface CheckoutSummaryProps {
  cartItems: CartItem[];
  calculateSubtotal: () => number;
  calculateTax: () => number;
  calculateTotal: () => number;
  user: any;
  orderId: string;
  formIsValid: boolean;
}

const CheckoutSummary = ({
  cartItems,
  calculateSubtotal,
  calculateTax,
  calculateTotal,
  user,
  orderId,
  formIsValid
}: CheckoutSummaryProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Cart Items */}
        <div className="space-y-3">
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="flex-1">
                {item.quantity} x {item.products?.name}
              </span>
              <span className="font-medium">
                R {((item.products?.price || 0) * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
        
        {/* Totals */}
        <div className="border-t pt-3 space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>R {calculateSubtotal().toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax (15% VAT)</span>
            <span>R {calculateTax().toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>Total (ZAR)</span>
            <span>R {calculateTotal().toFixed(2)}</span>
          </div>
        </div>
        
        {/* Payment Method */}
        <Separator />
        <div className="space-y-4">
          <h3 className="text-md font-medium">Payment Method</h3>
          <p className="text-sm text-muted-foreground">PayFast - Online Payments</p>
          
          <PayfastPaymentButton
            amount={calculateTotal()}
            orderId={orderId}
            userEmail={user?.email}
            userName={user?.user_metadata?.full_name || ''}
            userId={user?.id}
            disabled={!formIsValid}
          />
        </div>
        
        <div className="text-xs text-muted-foreground">
          <p>All prices are in South African Rand (ZAR)</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CheckoutSummary;
