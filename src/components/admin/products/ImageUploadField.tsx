
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
          <div className="flex flex-col space-y-4">
            {imagePreview ? (
              <div className="relative rounded-md overflow-hidden border border-gray-200">
                <div className="aspect-video w-full bg-gray-50 flex items-center justify-center">
                  <img 
                    src={imagePreview} 
                    alt="Product preview" 
                    className="max-h-[200px] max-w-full object-contain" 
                  />
                </div>
              </div>
            ) : (
              <div className="aspect-video w-full bg-gray-50 flex flex-col items-center justify-center rounded-md border border-dashed border-gray-300 p-4">
                <Image className="h-10 w-10 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">No image selected</p>
                <p className="text-xs text-gray-400 mt-1">Upload a product image to preview it here</p>
              </div>
            )}
            <FormControl>
              <div className="flex items-center space-x-2">
                <div className="relative w-full">
                  <Input
                    type="file"
                    accept="image/*"
                    className="cursor-pointer"
                    onChange={handleImageChange}
                    {...fieldProps}
                  />
                </div>
              </div>
            </FormControl>
            {editingProduct?.image_url && !imagePreview && (
              <div className="text-sm text-muted-foreground mt-2">
                Current image: {editingProduct.image_url}
              </div>
            )}
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
};

export default ImageUploadField;
