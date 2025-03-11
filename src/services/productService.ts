
import { supabase } from "@/integrations/supabase/client";
import { Product, ProductFormValues } from "@/types/product";

export const fetchProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  
  if (error) throw error;
  
  return data as Product[] || [];
};

export const createProduct = async (values: ProductFormValues): Promise<void> => {
  const { error } = await supabase
    .from("products")
    .insert([{
      name: values.name,
      description: values.description,
      price: values.price,
      category: values.category,
      vp_points: values.vp_points,
      image_url: values.image_url,
      stock_quantity: values.stock_quantity
    }]);
  
  if (error) throw error;
};

export const updateProduct = async (id: string, values: ProductFormValues): Promise<void> => {
  const { error } = await supabase
    .from("products")
    .update({
      name: values.name,
      description: values.description,
      price: values.price,
      category: values.category,
      vp_points: values.vp_points,
      image_url: values.image_url,
      stock_quantity: values.stock_quantity
    })
    .eq("id", id);
  
  if (error) throw error;
};

export const deleteProduct = async (productId: string): Promise<void> => {
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId);
  
  if (error) throw error;
};
