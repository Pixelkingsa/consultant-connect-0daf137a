
import React, { createContext, useContext, ReactNode } from "react";
import { useCartAuth } from "./useCartAuth";
import { useCartState } from "./cartHooks";
import { CartContextType } from "./types";

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { userId } = useCartAuth();
  const { 
    cartItems, 
    cartCount, 
    isLoading, 
    refreshCart, 
    addToCart, 
    updateCartItem, 
    removeCartItem 
  } = useCartState(userId);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        isLoading,
        addToCart,
        updateCartItem,
        removeCartItem,
        refreshCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
