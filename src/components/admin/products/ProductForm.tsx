
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { DialogFooter } from "@/components/ui/dialog";
import { ProductFormValues, productSchema, Product } from "@/types/product";
import { supabase } from "@/integrations/supabase/client";

// Import our new components
import BasicProductFields from "./BasicProductFields";
import DescriptionField from "./DescriptionField";
import ImageUploadField from "./ImageUploadField";

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
        <BasicProductFields form={form} />
        
        <ImageUploadField 
          form={form} 
          imagePreview={imagePreview}
          setImagePreview={setImagePreview}
          editingProduct={editingProduct}
        />
        
        <DescriptionField form={form} />
        
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
