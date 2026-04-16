export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  original_price?: number;
  category: string;
  subcategory?: string;
  images: string[];
  stock: number;
  featured: boolean;
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

export interface Order {
  id: string;
  customer_name: string;
  phone: string;
  email: string;
  location: string;
  total_price: number;
  items: CartItem[];
  status: OrderStatus;
  created_at: string;
}

export interface Category {
  name: string;
  slug: string;
  icon?: string;
  count?: number;
}

export type AdminProduct = Omit<Product, "created_at"> & {
  created_at?: string;
};
