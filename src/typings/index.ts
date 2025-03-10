export interface cartProduct {
  category: string;
  content: string;
  description: string;
  id: string;
  imageUrl: string;
  imagesUrl: string[];
  is_enabled: number; // 1 表示啟用, 0 表示未啟用
  origin_price: number;
  price: number;
  title: string;
  unit: string;
};

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