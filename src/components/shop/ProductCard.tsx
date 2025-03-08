
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, ChevronUp, ChevronDown, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  id: string;
  image: string;
  name: string;
  price: string;
  vp: number;
  stock: number;
}

const ProductCard = ({ id, image, name, price, vp, stock }: ProductCardProps) => {
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();
  const isOutOfStock = stock <= 0;

  const incrementQuantity = () => {
    if (quantity < stock) {
      setQuantity(prev => prev + 1);
    } else {
      toast({
        title: "Maximum stock reached",
        description: `Only ${stock} items available.`,
        variant: "destructive",
      });
    }
  };
  
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (isOutOfStock) {
      toast({
        title: "Out of Stock",
        description: "This product is currently unavailable.",
        variant: "destructive",
      });
      return;
    }
    
    // Here you would add the item to the cart
    // For now, we'll just show a toast
    toast({
      title: "Added to cart",
      description: `${quantity} ${name} added to your cart.`,
    });
  };

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="p-4 h-48 flex items-center justify-center bg-gray-50">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-contain"
        />
      </div>
      <CardContent className="p-4 flex-1 flex flex-col">
        <h3 className="font-bold text-lg mb-1">{name}</h3>
        <p className="text-xl font-bold mb-1">{price}</p>
        
        <div className="flex items-center gap-2 mb-3">
          <div className="bg-green-500 text-white rounded-md px-2 py-1 text-xs">
            {vp} VP
          </div>
          
          {isOutOfStock ? (
            <Badge variant="destructive" className="ml-auto">
              Out of Stock
            </Badge>
          ) : (
            <Badge variant="outline" className="ml-auto">
              In Stock: {stock}
            </Badge>
          )}
        </div>
        
        <div className="mt-auto pt-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center border rounded-md">
              <input
                type="text"
                value={quantity}
                readOnly
                className="w-8 text-center border-none"
              />
              <div className="flex flex-col">
                <button 
                  onClick={incrementQuantity} 
                  className="p-1" 
                  disabled={isOutOfStock}
                >
                  <ChevronUp size={14} />
                </button>
                <button 
                  onClick={decrementQuantity} 
                  className="p-1"
                  disabled={isOutOfStock}
                >
                  <ChevronDown size={14} />
                </button>
              </div>
            </div>
            
            <Button 
              onClick={handleAddToCart} 
              className="flex-1"
              disabled={isOutOfStock}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
