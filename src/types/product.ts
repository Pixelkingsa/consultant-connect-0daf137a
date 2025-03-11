
import { z } from "zod";

// Schema for product validation
export const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  category: z.string().default("Uncategorized"),
  vp_points: z.coerce.number().min(0, "VP points must be a positive number"),
  image_url: z.string().optional()
});

export type ProductFormValues = z.infer<typeof productSchema>;

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  vp_points: number;
  image_url?: string;
  created_at: string;
  updated_at?: string;
  subcategory?: string;
}
