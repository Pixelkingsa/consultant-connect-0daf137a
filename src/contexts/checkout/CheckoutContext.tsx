
import React, { createContext, useContext, ReactNode, useRef } from "react";
import { useCheckout } from "@/hooks/useCheckout";
import { CheckoutFormValues } from "@/lib/validationSchemas";

interface CheckoutContextType {
  user: any;
  cartItems: any[];
  loading: boolean;
  orderId: string;
  formIsValid: boolean;
  setFormIsValid: (isValid: boolean) => void;
  getSubtotal: () => number;
  getTax: () => number;
  getTotal: () => number;
  getFormValues: React.MutableRefObject<() => CheckoutFormValues>;
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const {
    user,
    cartItems,
    loading,
    orderId,
    formIsValid,
    setFormIsValid,
    getSubtotal,
    getTax,
    getTotal
  } = useCheckout();

  const getFormValues = useRef<() => CheckoutFormValues>(() => ({
    fullName: "",
    email: "",
    address: "",
    city: "",
    province: "",
    postalCode: "",
    phoneNumber: ""
  }));

  return (
    <CheckoutContext.Provider
      value={{
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
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckoutContext() {
  const context = useContext(CheckoutContext);
  if (context === undefined) {
    throw new Error("useCheckoutContext must be used within a CheckoutProvider");
  }
  return context;
}
