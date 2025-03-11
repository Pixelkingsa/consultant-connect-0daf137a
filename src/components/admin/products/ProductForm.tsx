
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { DialogFooter } from "@/components/ui/dialog";
import { ProductFormValues, productSchema, Product } from "@/types/product";
import { supabase } from "@/integrations/supabase/client";
import { Image } from "lucide-react";

interface ProductFormProps {
  editingProduct: Product | null;
  onSubmit: (values: ProductFormValues) => Promise<void>;
}

const ProductForm = ({ editingProduct, onSubmit }: ProductFormProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      category: "Uncategorized",
      vp_points: 0,
      image_url: ""
    }
  });

  // Reset form when editing product changes
  useEffect(() => {
    if (editingProduct) {
      form.reset({
        name: editingProduct.name || "",
        description: editingProduct.description || "",
        price: editingProduct.price || 0,
        category: editingProduct.category || "Uncategorized",
        vp_points: editingProduct.vp_points || 0,
        image_url: editingProduct.image_url || ""
      });
      
      if (editingProduct.image_url) {
        setImagePreview(editingProduct.image_url);
      } else {
        setImagePreview(null);
      }
    } else {
      form.reset({
        name: "",
        description: "",
        price: 0,
        category: "Uncategorized",
        vp_points: 0,
        image_url: ""
      });
      setImagePreview(null);
    }
  }, [editingProduct, form]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Set the image in the form
    form.setValue("image", file);
    
    // Create a preview
    const objectUrl = URL.createObjectURL(file);
    setImagePreview(objectUrl);
    
    // Clear the image_url as we're using a file upload
    form.setValue("image_url", "");
  };

  const handleSubmit = async (values: ProductFormValues) => {
    setIsUploading(true);
    try {
      // Check if there's a file to upload
      if (values.image instanceof File) {
        const file = values.image;
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `product-images/${fileName}`;
        
        // Upload the file to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('products')
          .upload(filePath, file);
          
        if (uploadError) {
          throw uploadError;
        }
        
        // Get the public URL
        const { data } = supabase.storage
          .from('products')
          .getPublicUrl(filePath);
          
        // Set the image_url to the uploaded file's public URL
        values.image_url = data.publicUrl;
      }
      
      // Remove the file from values before submitting (it's already uploaded)
      const { image, ...submitValues } = values;
      
      // Call the parent's onSubmit with the processed values
      await onSubmit(submitValues as ProductFormValues);
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input placeholder="Product name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price ($)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="vp_points"
            render={({ field }) => (
              <FormItem>
                <FormLabel>VP Points</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image"
          render={({ field: { value, onChange, ...fieldProps } }) => (
            <FormItem>
              <FormLabel>Product Image</FormLabel>
              <div className="flex flex-col space-y-2">
                {imagePreview && (
                  <div className="relative w-full h-40 bg-gray-100 rounded-md overflow-hidden">
                    <img 
                      src={imagePreview} 
                      alt="Product preview" 
                      className="w-full h-full object-contain" 
                    />
                  </div>
                )}
                <FormControl>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="file"
                      accept="image/*"
                      className="flex-1"
                      onChange={handleImageChange}
                      {...fieldProps}
                    />
                  </div>
                </FormControl>
                {editingProduct?.image_url && !imagePreview && (
                  <div className="text-sm text-muted-foreground">
                    Current image: {editingProduct.image_url}
                  </div>
                )}
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <textarea
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px] resize-y"
                  placeholder="Product description"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter className="mt-6">
          <Button type="submit" disabled={isUploading}>
            {isUploading ? "Uploading..." : "Save Product"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default ProductForm;
