
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  wholeSalePrice: number;
  retailPrice: number;
  image: string;
  category: string;
  isNew?: boolean;
}

const ProductCard = ({
  id,
  name,
  description,
  wholeSalePrice,
  retailPrice,
  image,
  category,
  isNew = false
}: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const profit = retailPrice - wholeSalePrice;
  const profitPercentage = Math.round((profit / wholeSalePrice) * 100);
  
  return (
    <motion.div
      className="group h-full flex flex-col rounded-xl overflow-hidden bg-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {isNew && (
          <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">
            New
          </Badge>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <Button className="w-full">View Details</Button>
        </div>
      </div>
      
      <div className="p-5 flex-grow flex flex-col">
        <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
          {category}
        </div>
        <h3 className="font-medium text-lg">{name}</h3>
        <p className="text-sm text-foreground/70 mt-2 line-clamp-2 mb-4">
          {description}
        </p>
        
        <div className="mt-auto">
          <div className="flex justify-between items-end">
            <div>
              <div className="text-sm text-muted-foreground">Wholesale</div>
              <div className="font-medium">R{wholeSalePrice.toFixed(2)}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Retail</div>
              <div className="font-medium">R{retailPrice.toFixed(2)}</div>
            </div>
          </div>
          
          <div className="mt-3 pt-3 border-t">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Your Profit</span>
              <span className="font-medium text-accent">R{profit.toFixed(2)}</span>
            </div>
            <div className="mt-2 w-full h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-accent transition-all duration-500 ease-in-out" 
                style={{ width: `${isHovered ? profitPercentage : 0}%` }}
              />
            </div>
            <div className="mt-1 text-xs text-right text-foreground/70">
              {profitPercentage}% profit margin
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
