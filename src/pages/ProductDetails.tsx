
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { refreshCart } = useCart();
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error || !user) {
          navigate("/auth");
          return;
        }
        
        setUser(user);
        fetchProduct();
      } catch (error) {
        console.error("Error:", error);
        navigate("/auth");
      }
    };
    
    checkUser();
  }, [navigate, productId]);
  
  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .single();
        
      if (error) {
        console.error("Error fetching product:", error);
        navigate("/shop");
        return;
      }
      
      setProduct(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddToCart = async () => {
    if (!user || !product) return;
    
    setAddingToCart(true);
    
    try {
      // Check if product already in cart
      const { data: existingItem, error: checkError } = await supabase
        .from("cart_items")
        .select("*")
        .eq("user_id", user.id)
        .eq("product_id", product.id)
        .single();
        
      if (existingItem) {
        // Update quantity if already in cart
        const { error: updateError } = await supabase
          .from("cart_items")
          .update({ 
            quantity: existingItem.quantity + 1,
            updated_at: new Date() 
          })
          .eq("id", existingItem.id);
          
        if (updateError) {
          console.error("Error updating cart:", updateError);
          toast({
            title: "Error",
            description: "Could not update cart quantity.",
            variant: "destructive",
          });
          return;
        }
      } else {
        // Add new item to cart
        const { error: insertError } = await supabase
          .from("cart_items")
          .insert({
            user_id: user.id,
            product_id: product.id,
            quantity: 1
          });
          
        if (insertError) {
          console.error("Error adding to cart:", insertError);
          toast({
            title: "Error",
            description: "Could not add product to cart.",
            variant: "destructive",
          });
          return;
        }
      }
      
      toast({
        title: "Added to Cart",
        description: `${product.name} has been added to your cart.`,
      });
      
      // Refresh cart
      await refreshCart();
      
      // Dispatch cart updated event
      const cartUpdatedEvent = new CustomEvent('cart-updated');
      window.dispatchEvent(cartUpdatedEvent);
      
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setAddingToCart(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <p className="text-lg text-muted-foreground">Loading product details...</p>
        </div>
      </div>
    );
  }
  
  if (!product) {
    return (
      <AppLayout>
        <div className="container max-w-7xl mx-auto px-4 lg:px-8 py-12">
          <Card className="p-8 text-center">
            <h2 className="text-2xl font-semibold mb-4">Product Not Found</h2>
            <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate("/shop")}>Back to Shop</Button>
          </Card>
        </div>
      </AppLayout>
    );
  }
  
  return (
    <AppLayout>
      <div className="container max-w-7xl mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="rounded-lg overflow-hidden bg-accent/5 flex items-center justify-center p-8">
            {product.image_url ? (
              <img 
                src={product.image_url} 
                alt={product.name} 
                className="max-h-[400px] object-contain"
              />
            ) : (
              <div className="w-full h-[400px] bg-accent/10 flex items-center justify-center rounded-md">
                <p className="text-muted-foreground">No image available</p>
              </div>
            )}
          </div>
          
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-xl font-medium text-accent mb-4">${product.price.toFixed(2)}</p>
            
            {product.vp_points > 0 && (
              <div className="bg-accent/10 text-accent rounded-md px-3 py-2 mb-6 inline-block">
                {product.vp_points} VP Points
              </div>
            )}
            
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-2">Description</h3>
              <p className="text-muted-foreground">{product.description || "No description available."}</p>
            </div>
            
            <Button 
              onClick={handleAddToCart} 
              className="w-full md:w-auto" 
              size="lg"
              disabled={addingToCart}
            >
              {addingToCart ? "Adding..." : "Add to Cart"}
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ProductDetails;
