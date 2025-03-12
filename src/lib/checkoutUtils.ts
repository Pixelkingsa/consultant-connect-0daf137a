
import { CartItem } from "@/types/cart";

export const calculateSubtotal = (cartItems: CartItem[]) => {
  return cartItems.reduce((total, item) => {
    return total + (item.products?.price || 0) * item.quantity;
  }, 0);
};

export const calculateTax = (cartItems: CartItem[]) => {
  return calculateSubtotal(cartItems) * 0.08; // 8% tax
};

export const calculateTotal = (cartItems: CartItem[]) => {
  return calculateSubtotal(cartItems) + calculateTax(cartItems);
};
