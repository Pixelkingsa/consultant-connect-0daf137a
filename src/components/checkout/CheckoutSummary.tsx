
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CartItem } from "@/types/cart";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import PayfastPaymentButton from "@/components/payment/PayfastPaymentButton";

interface CheckoutSummaryProps {
  cartItems: CartItem[];
  calculateSubtotal: () => number;
  calculateTax: () => number;
  calculateTotal: () => number;
  user: any;
  orderId: string;
  formIsValid: boolean;
  onCreditCardSuccess: () => void;
}

const CheckoutSummary = ({
  cartItems,
  calculateSubtotal,
  calculateTax,
  calculateTotal,
  user,
  orderId,
  formIsValid,
  onCreditCardSuccess
}: CheckoutSummaryProps) => {
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'payfast'>('payfast');
  const [submitting, setSubmitting] = useState(false);
  
  const handleCreditCardSubmit = async () => {
    if (!formIsValid || submitting) return;
    
    setSubmitting(true);
    try {
      await onCreditCardSuccess();
    } finally {
      setSubmitting(false);
    }
  };
  
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
        
        {/* Payment Method Selection */}
        <Separator />
        <div className="space-y-4">
          <h3 className="text-md font-medium">Payment Method</h3>
          <div className="flex space-x-4 mb-4">
            <Button 
              type="button" 
              variant={paymentMethod === 'credit_card' ? 'default' : 'outline'}
              onClick={() => setPaymentMethod('credit_card')}
              size="sm"
            >
              Credit Card
            </Button>
            <Button 
              type="button" 
              variant={paymentMethod === 'payfast' ? 'default' : 'outline'}
              onClick={() => setPaymentMethod('payfast')}
              size="sm"
            >
              PayFast
            </Button>
          </div>

          {paymentMethod === 'credit_card' ? (
            <Button 
              onClick={handleCreditCardSubmit}
              className="w-full" 
              size="lg"
              disabled={!formIsValid || submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Complete Purchase (ZAR)"
              )}
            </Button>
          ) : (
            <PayfastPaymentButton
              amount={calculateTotal()}
              orderId={orderId}
              userEmail={user?.email}
              userName={user?.user_metadata?.full_name || ''}
              userId={user?.id}
              disabled={!formIsValid}
            />
          )}
        </div>
        
        <div className="text-xs text-muted-foreground">
          <p>All prices are in South African Rand (ZAR)</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CheckoutSummary;
