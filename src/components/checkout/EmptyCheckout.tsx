
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingBag } from "lucide-react";

const EmptyCheckout = () => {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardContent className="p-10 flex flex-col items-center justify-center">
        <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
        <p className="text-xl font-medium mb-2">Your cart is empty</p>
        <p className="text-muted-foreground mb-6">Add items to your cart before checking out.</p>
        <Button onClick={() => navigate("/shop")}>
          Browse Products
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmptyCheckout;
