
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { initiatePayfastPayment } from "@/services/payfastService";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface PayfastPaymentButtonProps {
  amount: number;
  orderId: string;
  userEmail: string;
  userName?: string;
  userId: string;
  disabled?: boolean;
  onSuccess?: () => void;
}

const PayfastPaymentButton = ({
  amount,
  orderId,
  userEmail,
  userName,
  userId,
  disabled = false,
  onSuccess
}: PayfastPaymentButtonProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [processing, setProcessing] = useState(false);

  const handlePaymentClick = async () => {
    if (processing) return;
    
    setProcessing(true);
    
    try {
      // Split the name into first and last name (if provided)
      let firstName = "", lastName = "";
      if (userName) {
        const nameParts = userName.trim().split(' ');
        firstName = nameParts[0] || "";
        lastName = nameParts.slice(1).join(' ') || "";
      }

      // Initiate PayFast payment
      const paymentInfo = await initiatePayfastPayment({
        amount: amount,
        item_name: `Order #${orderId}`,
        orderId: orderId,
        email_address: userEmail,
        name_first: firstName,
        name_last: lastName,
        return_url: `${window.location.origin}/orders`,
        cancel_url: `${window.location.origin}/checkout`,
      }, userId);

      // Create a hidden form to submit to PayFast
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = paymentInfo.processUrl;
      form.target = '_self';
      form.style.display = 'none';

      // Add all the PayFast data as form fields
      Object.entries(paymentInfo.pfData).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = String(value);
        form.appendChild(input);
      });

      // Append the form to the body, submit it, and remove it
      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);

      // If success callback provided, call it
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "Payment Error",
        description: "There was a problem processing your payment. Please try again.",
        variant: "destructive",
      });
      setProcessing(false);
    }
  };

  return (
    <Button
      onClick={handlePaymentClick}
      disabled={disabled || processing}
      className="w-full"
      size="lg"
    >
      {processing ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        "Pay with PayFast (ZAR)"
      )}
    </Button>
  );
};

export default PayfastPaymentButton;
