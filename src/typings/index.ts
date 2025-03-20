export interface cartProduct {
  id: string; // `id` 在 Products 內有，但在 Product 內沒有
  category: string;
  content: string;
  description: string;
  is_enabled: number;
  origin_price: number;
  price: number;
  title: string;
  unit: string;
  num?: number; // `num` 只在 Products 內出現
  imageUrl: string;
  imagesUrl: string[];
  saveYear?: number; // `saveYear` 只在 Product 內出現
}

export interface Cart {
  final_total: number;
  id: string;
  product: cartProduct;
  product_id: string;
  qty: number;
  total: number;
}

export interface Product {
  id?: string; // `id` 在 Products 內有，但在 Product 內沒有
  category: string;
  content: string;
  description: string;
  is_enabled: number;
  origin_price: number;
  price: number;
  title: string;
  unit: string;
  num?: number; // `num` 只在 Products 內出現
  imageUrl: string;
  imagesUrl: string[];
  saveYear?: number; // `saveYear` 只在 Product 內出現
}

export interface Coupon {
  title: string;
  is_enabled: number;
  percent: number;
  due_date: number | string;
  code: string;
  num: number;
  id: string;
}

export interface Order {
  create_at: number;
  id: string;
  is_paid: boolean;
  message: string;
  num: number;
  products: { [key: string]: Cart };
  total: number;
  user: {
    address: string;
    email: string;
    message: string;
    name: string;
    tel: string;
  };
}
