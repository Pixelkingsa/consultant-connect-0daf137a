
import React from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const EmptyCart = () => {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardContent className="p-10 flex flex-col items-center justify-center">
        <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
        <p className="text-xl font-medium mb-2">Your cart is empty</p>
        <p className="text-muted-foreground mb-6">Looks like you haven't added anything to your cart yet.</p>
        <Button onClick={() => navigate("/shop")}>
          Browse Products
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmptyCart;
