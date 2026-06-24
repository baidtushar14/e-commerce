export interface ApiProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: { rate: number; count: number };
}

export interface Product extends ApiProduct {
  brand: string;
  salePrice?: number;
  stock: number; // 0 = sold out, 1-3 = low stock
  images: string[];
}

export interface CartItem {
  productId: number;
  title: string;
  image: string;
  unitPrice: number;
  quantity: number;
}
