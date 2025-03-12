
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody } from "@/components/ui/table";
import { CartItem as CartItemType } from "@/types/cart";
import CartItem from "./CartItem";

interface CartItemsListProps {
  cartItems: CartItemType[];
  updatingItem: string | null;
  onUpdateQuantity: (itemId: string, quantity: number) => Promise<void>;
  onRemoveItem: (itemId: string) => Promise<void>;
}

const CartItemsList = ({ 
  cartItems, 
  updatingItem, 
  onUpdateQuantity, 
  onRemoveItem 
}: CartItemsListProps) => {
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
              <CartItem
                key={item.id}
                item={item}
                updatingItem={updatingItem}
                onUpdateQuantity={onUpdateQuantity}
                onRemoveItem={onRemoveItem}
              />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default CartItemsList;
