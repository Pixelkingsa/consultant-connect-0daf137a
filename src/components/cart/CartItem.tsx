
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableRow, TableCell } from "@/components/ui/table";
import { Loader2, Trash2, MinusCircle, PlusCircle } from "lucide-react";
import { CartItem as CartItemType } from "@/types/cart";

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (itemId: string, quantity: number) => Promise<void>;
  onRemoveItem: (itemId: string) => Promise<void>;
  updatingItem: string | null;
}

const CartItem = ({ 
  item, 
  onUpdateQuantity, 
  onRemoveItem, 
  updatingItem 
}: CartItemProps) => {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center space-x-3">
          <div className="h-12 w-12 rounded-md overflow-hidden">
            <img 
              src={item.products?.image_url || "/placeholder.svg"} 
              alt={item.products?.name || "Product"} 
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <p className="font-medium">{item.products?.name}</p>
            <p className="text-sm text-muted-foreground">
              ID: {item.product_id.substring(0, 8)}
            </p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            disabled={!!updatingItem}
          >
            <MinusCircle className="h-4 w-4" />
          </Button>
          <Input
            type="number"
            min="1"
            value={item.quantity}
            onChange={(e) => {
              const newQuantity = parseInt(e.target.value);
              if (!isNaN(newQuantity) && newQuantity > 0) {
                onUpdateQuantity(item.id, newQuantity);
              }
            }}
            className="w-16 text-center"
          />
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            disabled={!!updatingItem}
          >
            <PlusCircle className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
      <TableCell>${(item.products?.price || 0) * item.quantity}</TableCell>
      <TableCell>
        <Button
          variant="ghost"
          size="icon"
          className="text-destructive"
          onClick={() => onRemoveItem(item.id)}
          disabled={!!updatingItem}
        >
          {updatingItem === item.id ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default CartItem;
