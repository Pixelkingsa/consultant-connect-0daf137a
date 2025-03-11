
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody } from "@/components/ui/table";
import { CartItem as CartItemType } from "@/types/cart";
import CartItemRow from "./CartItem";

interface CartItemsTableProps {
  cartItems: CartItemType[];
  updateQuantity: (itemId: string, newQuantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updatingItem: string | null;
}

const CartItemsTable = ({ 
  cartItems, 
  updateQuantity, 
  removeItem, 
  updatingItem 
}: CartItemsTableProps) => {
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
                updateQuantity={updateQuantity}
                removeItem={removeItem}
                updatingItem={updatingItem}
              />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default CartItemsTable;
