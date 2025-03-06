
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, ChevronUp, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  image: string;
  name: string;
  price: string;
  vp: number;
}

const ProductCard = ({ image, name, price, vp }: ProductCardProps) => {
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = () => {
    toast({
      title: "Added to cart",
      description: `${quantity} ${name} added to your cart.`,
    });
  };

  return (
    <Card className="overflow-hidden">
      <div className="p-4">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-48 object-contain"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-bold text-lg">{name}</h3>
        <p className="text-xl font-bold mb-3">{price}</p>
        
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center border rounded-md">
            <input
              type="text"
              value={quantity}
              readOnly
              className="w-8 text-center border-none"
            />
            <div className="flex flex-col">
              <button onClick={incrementQuantity} className="p-1">
                <ChevronUp size={14} />
              </button>
              <button onClick={decrementQuantity} className="p-1">
                <ChevronDown size={14} />
              </button>
            </div>
          </div>
          
          <Button onClick={handleAddToCart} className="flex-1">
            Add to Cart
          </Button>
          
          <div className="bg-green-500 text-white rounded-md px-2 py-1 text-sm">
            {vp} VP
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
