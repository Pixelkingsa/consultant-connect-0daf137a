
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody } from "@/components/ui/table";
import { CartItem } from "@/types/cart";
import CartItemRow from "./CartItemRow";

interface CartItemsTableProps {
  cartItems: CartItem[];
  updatingItem: string | null;
  updateQuantity: (itemId: string, newQuantity: number) => void;
  removeItem: (itemId: string) => void;
}

const CartItemsTable = ({ cartItems, updatingItem, updateQuantity, removeItem }: CartItemsTableProps) => {
  return (
    <Card>
      <CardHeader className="pb-0">
        <CardTitle>Cart Items ({cartItems.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cartItems.map((item) => (
              <CartItemRow
                key={item.id}
                item={item}
                updatingItem={updatingItem}
                updateQuantity={updateQuantity}
                removeItem={removeItem}
              />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default CartItemsTable;
