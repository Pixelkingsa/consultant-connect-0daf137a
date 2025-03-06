
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ChevronDown } from "lucide-react";
import ProductCard from "./ProductCard";

// Mock product data
const MOCK_PRODUCTS = [
  { id: 1, name: "Product Name", price: "R150", image: "/lovable-uploads/0653c87b-1203-4f94-94e5-d15b881ef9ad.png", vp: 1 },
  { id: 2, name: "Product Name", price: "R150", image: "/lovable-uploads/0653c87b-1203-4f94-94e5-d15b881ef9ad.png", vp: 1 },
  { id: 3, name: "Product Name", price: "R150", image: "/lovable-uploads/0653c87b-1203-4f94-94e5-d15b881ef9ad.png", vp: 1 },
  { id: 4, name: "Product Name", price: "R150", image: "/lovable-uploads/0653c87b-1203-4f94-94e5-d15b881ef9ad.png", vp: 1 },
  { id: 5, name: "Product Name", price: "R150", image: "/lovable-uploads/0653c87b-1203-4f94-94e5-d15b881ef9ad.png", vp: 1 },
  { id: 6, name: "Product Name", price: "R150", image: "/lovable-uploads/0653c87b-1203-4f94-94e5-d15b881ef9ad.png", vp: 1 },
  { id: 7, name: "Product Name", price: "R150", image: "/lovable-uploads/0653c87b-1203-4f94-94e5-d15b881ef9ad.png", vp: 1 },
  { id: 8, name: "Product Name", price: "R150", image: "/lovable-uploads/0653c87b-1203-4f94-94e5-d15b881ef9ad.png", vp: 1 },
];

const ShopContent = () => {
  const [category, setCategory] = useState("All");
  const [subcategory, setSubcategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="container max-w-7xl px-4 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6">Shop</h1>
      
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <div className="flex-shrink-0">
          <span className="mr-2">Category:</span>
          <select 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-md border border-input bg-background px-3 py-1"
          >
            <option value="All">All</option>
            <option value="Perfumes">Perfumes</option>
            <option value="Colognes">Colognes</option>
          </select>
        </div>
        
        <div className="flex-shrink-0">
          <span className="mr-2">Subcategory:</span>
          <select 
            value={subcategory}
            onChange={(e) => setSubcategory(e.target.value)}
            className="rounded-md border border-input bg-background px-3 py-1"
          >
            <option value="All">All</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Unisex">Unisex</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {MOCK_PRODUCTS.map((product) => (
          <ProductCard
            key={product.id}
            image={product.image}
            name={product.name}
            price={product.price}
            vp={product.vp}
          />
        ))}
      </div>
    </div>
  );
};

export default ShopContent;
