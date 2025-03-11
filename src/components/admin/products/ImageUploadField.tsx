
import { useState, useEffect } from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Image } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { ProductFormValues } from "@/types/product";

interface ImageUploadFieldProps {
  form: UseFormReturn<ProductFormValues>;
  imagePreview: string | null;
  setImagePreview: (preview: string | null) => void;
  editingProduct: { image_url?: string } | null;
}

const ImageUploadField = ({ 
  form, 
  imagePreview, 
  setImagePreview, 
  editingProduct 
}: ImageUploadFieldProps) => {
  
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

  return (
    <FormField
      control={form.control}
      name="image"
      render={({ field: { value, onChange, ...fieldProps } }) => (
        <FormItem>
          <FormLabel>Product Image</FormLabel>
          <div className="flex flex-col gap-4">
            {imagePreview ? (
              <div className="w-24 h-24 rounded-md overflow-hidden border border-gray-200">
                <img 
                  src={imagePreview} 
                  alt="Product preview" 
                  className="w-full h-full object-cover" 
                />
              </div>
            ) : (
              <div className="w-24 h-24 bg-gray-50 flex flex-col items-center justify-center rounded-md border border-dashed border-gray-300">
                <Image className="h-6 w-6 text-gray-400 mb-1" />
                <p className="text-xs text-gray-500">No image</p>
              </div>
            )}
            
            <div className="flex-1">
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  className="cursor-pointer"
                  onChange={handleImageChange}
                  {...fieldProps}
                />
              </FormControl>
              {editingProduct?.image_url && !imagePreview && (
                <div className="text-sm text-muted-foreground mt-2">
                  Current image: {editingProduct.image_url}
                </div>
              )}
            </div>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ImageUploadField;
