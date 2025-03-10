import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Loader2, Edit, Trash2, Search, Plus, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  vp_points: number;
  category: string;
  subcategory: string | null;
  image_url: string | null;
  stock_quantity: number;
  created_at: string;
}
const AdminProducts = () => {
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddEdit, setShowAddEdit] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    vp_points: "",
    category: "",
    subcategory: "",
    stock_quantity: "",
    image_url: ""
  });
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);

  // Fetch products
  const fetchProducts = async () => {
    try {
      const {
        data,
        error
      } = await supabase.from("products").select("*").order("created_at", {
        ascending: false
      });
      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      console.error("Error fetching products:", error);
      toast({
        title: "Error",
        description: "Failed to load products. " + error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, [toast]);

  // Filter products based on search term
  const filteredProducts = products.filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()) || product.category.toLowerCase().includes(searchTerm.toLowerCase()));

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedImage(e.target.files[0]);
    }
  };

  // Upload image to Supabase Storage
  const uploadImage = async (file: File): Promise<string | null> => {
    setUploadLoading(true);
    try {
      const fileName = `${Date.now()}_${file.name}`;
      const {
        data,
        error
      } = await supabase.storage.from('products').upload(fileName, file);
      if (error) throw error;

      // Get public URL
      const {
        data: urlData
      } = supabase.storage.from('products').getPublicUrl(fileName);
      return urlData.publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    } finally {
      setUploadLoading(false);
    }
  };

  // Add/Edit Product
  const handleSaveProduct = async () => {
    try {
      if (!formData.name || !formData.price) {
        toast({
          title: "Missing Information",
          description: "Product name and price are required.",
          variant: "destructive"
        });
        return;
      }
      let imageUrl = formData.image_url;

      // Upload image if a new one is selected
      if (uploadedImage) {
        const uploadedUrl = await uploadImage(uploadedImage);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      }
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        vp_points: parseInt(formData.vp_points) || 0,
        category: formData.category || "Uncategorized",
        subcategory: formData.subcategory || null,
        stock_quantity: parseInt(formData.stock_quantity) || 0,
        image_url: imageUrl
      };
      if (currentProduct) {
        // Update existing product
        const {
          error
        } = await supabase.from('products').update(productData).eq('id', currentProduct.id);
        if (error) throw error;
        toast({
          title: "Product Updated",
          description: "The product has been updated successfully."
        });
      } else {
        // Create new product
        const {
          error
        } = await supabase.from('products').insert([productData]);
        if (error) throw error;
        toast({
          title: "Product Added",
          description: "The new product has been added successfully."
        });
      }

      // Reset form and refresh products
      setShowAddEdit(false);
      setCurrentProduct(null);
      setFormData({
        name: "",
        description: "",
        price: "",
        vp_points: "",
        category: "",
        subcategory: "",
        stock_quantity: "",
        image_url: ""
      });
      setUploadedImage(null);
      fetchProducts();
    } catch (error: any) {
      console.error("Error saving product:", error);
      toast({
        title: "Error",
        description: "Failed to save product. " + error.message,
        variant: "destructive"
      });
    }
  };

  // Edit Product
  const handleEditProduct = (product: Product) => {
    setCurrentProduct(product);
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      vp_points: product.vp_points.toString(),
      category: product.category || "",
      subcategory: product.subcategory || "",
      stock_quantity: product.stock_quantity.toString(),
      image_url: product.image_url || ""
    });
    setShowAddEdit(true);
  };

  // Delete Product
  const handleDeleteProduct = async (id: string) => {
    try {
      const {
        error
      } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      toast({
        title: "Product Deleted",
        description: "The product has been deleted successfully."
      });

      // Refresh products
      fetchProducts();
    } catch (error: any) {
      console.error("Error deleting product:", error);
      toast({
        title: "Error",
        description: "Failed to delete product. " + error.message,
        variant: "destructive"
      });
    }
  };
  return <AppLayout>
      <div className="container max-w-7xl mx-auto px-4 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => navigate("/admin-dashboard")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold">Product Management</h1>
          </div>
          <div className="flex w-full md:w-auto gap-2">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search products..." className="pl-8" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <Button onClick={() => {
            setCurrentProduct(null);
            setFormData({
              name: "",
              description: "",
              price: "",
              vp_points: "",
              category: "",
              subcategory: "",
              stock_quantity: "",
              image_url: ""
            });
            setUploadedImage(null);
            setShowAddEdit(true);
          }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>
        </div>
        
        <Card>
          <CardContent className="p-0">
            {loading ? <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div> : <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Product Name</TableHead>
                    
                    
                    <TableHead>VP Points</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.length === 0 ? <TableRow>
                      <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                        {searchTerm ? "No products found matching your search." : "No products available. Add your first product!"}
                      </TableCell>
                    </TableRow> : filteredProducts.map(product => <TableRow key={product.id}>
                        <TableCell>
                          <div className="h-12 w-12 rounded-md overflow-hidden">
                            <img src={product.image_url || "/placeholder.svg"} alt={product.name} className="h-full w-full object-cover" />
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{product.category}</Badge>
                          {product.subcategory && <Badge variant="outline" className="ml-2">{product.subcategory}</Badge>}
                        </TableCell>
                        <TableCell>${product.price.toFixed(2)}</TableCell>
                        <TableCell>{product.vp_points}</TableCell>
                        <TableCell>
                          <Badge variant={product.stock_quantity > 0 ? "default" : "destructive"}>
                            {product.stock_quantity > 0 ? `In Stock (${product.stock_quantity})` : "Out of Stock"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="icon" onClick={() => handleEditProduct(product)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="icon" className="text-destructive">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Delete Product</DialogTitle>
                                  <DialogDescription>
                                    Are you sure you want to delete "{product.name}"? This action cannot be undone.
                                  </DialogDescription>
                                </DialogHeader>
                                <DialogFooter className="flex gap-2 justify-end">
                                  <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                  </DialogClose>
                                  <Button variant="destructive" onClick={() => handleDeleteProduct(product.id)}>
                                    Delete
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </TableCell>
                      </TableRow>)}
                </TableBody>
              </Table>}
          </CardContent>
        </Card>
        
        {/* Add/Edit Product Dialog */}
        <Dialog open={showAddEdit} onOpenChange={setShowAddEdit}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{currentProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
              <DialogDescription>
                {currentProduct ? "Update the product details below." : "Fill in the details for the new product."}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">Price ($) *</Label>
                <Input id="price" name="price" type="number" min="0" step="0.01" value={formData.price} onChange={handleInputChange} required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="vp_points">VP Points</Label>
                <Input id="vp_points" name="vp_points" type="number" min="0" value={formData.vp_points} onChange={handleInputChange} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="stock_quantity">Stock Quantity</Label>
                <Input id="stock_quantity" name="stock_quantity" type="number" min="0" value={formData.stock_quantity} onChange={handleInputChange} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input id="category" name="category" value={formData.category} onChange={handleInputChange} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subcategory">Subcategory</Label>
                <Input id="subcategory" name="subcategory" value={formData.subcategory} onChange={handleInputChange} />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Input id="description" name="description" value={formData.description} onChange={handleInputChange} />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="image">Product Image</Label>
                <div className="flex items-start gap-4">
                  <div className="h-24 w-24 rounded-md overflow-hidden border bg-gray-50 flex items-center justify-center">
                    {uploadedImage ? <img src={URL.createObjectURL(uploadedImage)} alt="Preview" className="h-full w-full object-cover" /> : formData.image_url ? <img src={formData.image_url} alt="Current" className="h-full w-full object-cover" /> : <span className="text-muted-foreground text-sm">No image</span>}
                  </div>
                  <div className="flex-1">
                    <Input id="image" type="file" accept="image/*" onChange={handleImageUpload} />
                    <p className="text-sm text-muted-foreground mt-1">
                      Recommended: 800x800px JPG, PNG or WebP
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleSaveProduct} disabled={uploadLoading}>
                {uploadLoading ? <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </> : currentProduct ? "Update Product" : "Add Product"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>;
};
export default AdminProducts;