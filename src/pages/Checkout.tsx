
import AppLayout from "@/components/layout/AppLayout";
import { CheckoutProvider } from "@/contexts/checkout/CheckoutContext";
import CheckoutContainer from "@/components/checkout/CheckoutContainer";

const Checkout = () => {
  return (
    <AppLayout>
      <CheckoutProvider>
        <CheckoutContainer />
      </CheckoutProvider>
    </AppLayout>
  );
};

export default Checkout;
