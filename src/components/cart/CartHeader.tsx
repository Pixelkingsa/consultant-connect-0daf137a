
import React from "react";

interface CartHeaderProps {
  title: string;
}

const CartHeader = ({ title }: CartHeaderProps) => {
  return <h1 className="text-3xl font-bold mb-8">{title}</h1>;
};

export default CartHeader;
