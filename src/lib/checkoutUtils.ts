
import { CartItem } from "@/types/cart";

export const calculateSubtotal = (cartItems: CartItem[]) => {
  return cartItems.reduce((total, item) => {
    return total + (item.products?.price || 0) * item.quantity;
  }, 0);
};

export const calculateTax = (cartItems: CartItem[]) => {
  return calculateSubtotal(cartItems) * 0.15; // 15% VAT in South Africa
};

export const calculateTotal = (cartItems: CartItem[]) => {
  return calculateSubtotal(cartItems) + calculateTax(cartItems);
};

export const formatCurrency = (amount: number) => {
  return `R ${amount.toFixed(2)}`;
};
