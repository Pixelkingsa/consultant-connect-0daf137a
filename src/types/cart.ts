
export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
  products?: {
    name: string;
    price: number;
    image_url: string | null;
    vp_points: number;
  };
}
