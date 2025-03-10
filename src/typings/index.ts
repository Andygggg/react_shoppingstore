export interface Product {
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