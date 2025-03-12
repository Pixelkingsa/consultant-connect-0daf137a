
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { supabase } from "@/integrations/supabase/client";

interface ProductCardProps {
  id: string;
  image: string;
  name: string;
  price: string;
  vp: number;
}

const ProductCard = ({ id, image, name, price, vp }: ProductCardProps) => {
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAddToCart = async () => {
    setIsLoading(true);
    
    try {
      // Check if user is authenticated
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to add items to your cart.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      // Check if the item is already in the cart
      const { data: existingItem, error: checkError } = await supabase
        .from("cart_items")
        .select("id, quantity")
        .eq("user_id", user.id)
        .eq("product_id", id)
        .single();
      
      if (checkError && checkError.code !== "PGRST116") { // PGRST116 means no rows returned
        throw checkError;
      }
      
      if (existingItem) {
        // Update existing cart item
        const newQuantity = existingItem.quantity + quantity;
        const { error: updateError } = await supabase
          .from("cart_items")
          .update({ quantity: newQuantity, updated_at: new Date().toISOString() })
          .eq("id", existingItem.id);
          
        if (updateError) throw updateError;
        
        toast({
          title: "Cart updated",
          description: `Updated ${name} quantity to ${newQuantity} in your cart.`,
        });
      } else {
        // Add new cart item
        const { error: insertError } = await supabase
          .from("cart_items")
          .insert({ 
            user_id: user.id, 
            product_id: id, 
            quantity: quantity 
          });
          
        if (insertError) throw insertError;
        
        toast({
          title: "Added to cart",
          description: `${quantity} ${name} added to your cart.`,
        });
      }
      
      // Create and dispatch a custom event to refresh cart count
      const cartUpdatedEvent = new CustomEvent('cart-updated');
      window.dispatchEvent(cartUpdatedEvent);
      
    } catch (error: any) {
      console.error("Error adding to cart:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add item to cart.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? "Removed from favorites" : "Added to favorites",
      description: `${name} has been ${isFavorite ? "removed from" : "added to"} your favorites.`,
    });
  };

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative p-4 h-48 flex items-center justify-center bg-gray-50">
        <img 
          src={image} 
          alt={name} 
          className="max-h-full max-w-full object-contain"
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
          onClick={toggleFavorite}
        >
          <Heart className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
        </Button>
      </div>
      <CardContent className="p-4 flex-1 flex flex-col">
        <h3 className="font-bold text-lg mb-1 line-clamp-2">{name}</h3>
        <p className="text-xl font-bold mb-1">{price}</p>
        
        <div className="flex items-center gap-2 mb-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="bg-green-500 text-white rounded-md px-2 py-1 text-xs">
                  {vp} VP
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Earn {vp} Volume Points with this purchase</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <div className="mt-auto pt-3">
          <Button 
            onClick={handleAddToCart} 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <ShoppingCart className="h-4 w-4 mr-2 animate-pulse" />
                Adding...
              </span>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
