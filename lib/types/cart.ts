import { Product } from './product';

// Cart Item Type
export interface CartItem {
  product: Product;
  quantity: number;

  selectedAttributes?: Record<string, string>;
}

// Cart Summary Type
export interface CartSummary {
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
}

// Coupon Type
export interface Coupon {
  code: string;
  discount: number; // percentage
  minOrder: number;
}