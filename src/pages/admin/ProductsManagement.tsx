
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import ProductsTable from "@/components/admin/products/ProductsTable";
import ProductDialog from "@/components/admin/products/ProductDialog";
import { Product, ProductFormValues } from "@/types/product";
import { 
  fetchProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} from "@/services/productService";

const ProductsManagement = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch products
  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (error: any) {
      console.error("Error fetching products:", error);
      toast({
        title: "Error",
        description: "Failed to load products. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Handle form submission
  const onSubmit = async (values: ProductFormValues) => {
    try {
      if (editingProduct) {
        // Update existing product
        await updateProduct(editingProduct.id, values);
        
        toast({
          title: "Success",
          description: "Product updated successfully",
        });
      } else {
        // Create new product
        await createProduct(values);
        
        toast({
          title: "Success",
          description: "Product created successfully",
        });
      }
      
      // Close dialog and refresh products
      setIsDialogOpen(false);
      setEditingProduct(null);
      loadProducts();
    } catch (error: any) {
      console.error("Error saving product:", error);
      toast({
        title: "Error",
        description: "Failed to save product. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle product deletion
  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    try {
      await deleteProduct(productId);
      
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
      
      loadProducts();
    } catch (error: any) {
      console.error("Error deleting product:", error);
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Open dialog for creating/editing a product
  const openProductDialog = (product: Product | null = null) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Products Management</h1>
          <p className="text-muted-foreground">Manage your product catalog</p>
        </div>
        <ProductDialog
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          editingProduct={editingProduct}
          onOpenProductDialog={() => openProductDialog()}
          onSubmit={onSubmit}
        />
      </div>

      {loading ? (
        <div className="flex justify-center">
          <div className="animate-pulse">Loading products...</div>
        </div>
      ) : (
        <ProductsTable
          products={products}
          onEdit={(product) => openProductDialog(product)}
          onDelete={handleDeleteProduct}
        />
      )}
    </div>
  );
};

export default ProductsManagement;
