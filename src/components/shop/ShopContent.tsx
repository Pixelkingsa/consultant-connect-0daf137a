
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ChevronDown, Loader2 } from "lucide-react";
import ProductCard from "./ProductCard";

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  vp_points: number;
  category: string;
  subcategory: string | null;
  description: string | null;
  stock_quantity: number;
}

const ShopContent = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSubcategory, setSelectedSubcategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch products from Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false });
          
        if (error) throw error;
        
        setProducts(data || []);
        
        // Extract unique categories and subcategories
        const uniqueCategories = Array.from(
          new Set(data?.map(product => product.category) || [])
        ).filter(Boolean);
        
        const uniqueSubcategories = Array.from(
          new Set(data?.map(product => product.subcategory) || [])
        ).filter(Boolean) as string[];
        
        setCategories(uniqueCategories as string[]);
        setSubcategories(uniqueSubcategories);
      } catch (error: any) {
        console.error("Error fetching products:", error);
        toast({
          title: "Error",
          description: "Failed to load products. " + error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [toast]);

  // Filter products based on category, subcategory, and search query
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesSubcategory = selectedSubcategory === "All" || product.subcategory === selectedSubcategory;
    const matchesSearch = searchQuery === "" || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSubcategory && matchesSearch;
  });

  return (
    <div className="container max-w-7xl px-4 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6">Shop</h1>
      
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <div className="flex-shrink-0">
          <span className="mr-2">Category:</span>
          <select 
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setSelectedSubcategory("All"); // Reset subcategory when category changes
            }}
            className="rounded-md border border-input bg-background px-3 py-1"
          >
            <option value="All">All</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        
        <div className="flex-shrink-0">
          <span className="mr-2">Subcategory:</span>
          <select 
            value={selectedSubcategory}
            onChange={(e) => setSelectedSubcategory(e.target.value)}
            className="rounded-md border border-input bg-background px-3 py-1"
          >
            <option value="All">All</option>
            {subcategories
              .filter(subcat => 
                selectedCategory === "All" || 
                products.some(p => p.category === selectedCategory && p.subcategory === subcat)
              )
              .map(subcategory => (
                <option key={subcategory} value={subcategory}>{subcategory}</option>
              ))
            }
          </select>
        </div>
        
        <div className="relative ml-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            className="pl-9 w-full md:w-64"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-lg text-muted-foreground">No products found matching your criteria.</p>
          <Button 
            variant="link" 
            onClick={() => {
              setSelectedCategory("All");
              setSelectedSubcategory("All");
              setSearchQuery("");
            }}
          >
            Clear filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              image={product.image_url || "/placeholder.svg"}
              name={product.name}
              price={`$${product.price.toFixed(2)}`}
              vp={product.vp_points}
              stock={product.stock_quantity}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ShopContent;
