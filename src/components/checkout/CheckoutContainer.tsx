
import { useCheckoutContext } from "@/contexts/checkout/CheckoutContext";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import CheckoutSummary from "@/components/checkout/CheckoutSummary";
import EmptyCheckout from "@/components/checkout/EmptyCheckout";
import CheckoutLoading from "@/components/checkout/CheckoutLoading";

const CheckoutContainer = () => {
  const {
    user,
    cartItems,
    loading,
    orderId,
    formIsValid,
    setFormIsValid,
    getSubtotal,
    getTax,
    getTotal,
    getFormValues
  } = useCheckoutContext();

  if (loading) {
    return <CheckoutLoading />;
  }
  
  return (
    <div className="container max-w-7xl mx-auto px-4 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      {cartItems.length === 0 ? (
        <EmptyCheckout />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <CheckoutForm 
              user={user}
              onFormValidityChange={setFormIsValid}
              getFormValues={getFormValues}
            />
          </div>
          
          {/* Order Summary with Payment Methods */}
          <div>
            <CheckoutSummary 
              cartItems={cartItems}
              calculateSubtotal={getSubtotal}
              calculateTax={getTax}
              calculateTotal={getTotal}
              user={user}
              orderId={orderId}
              formIsValid={formIsValid}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutContainer;
