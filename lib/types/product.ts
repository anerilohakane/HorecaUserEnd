// Product Types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  category: string;
  subcategory?: string;
  badge?: 'Bestseller' | 'New' | 'In Stock' | 'Premium' | 'Sale';
  image: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  minOrder: number;
  discount?: number;
  tags: string[];
}

// Filter Types
export interface FilterOptions {
  categories: string[];
  priceRange: {
    min: number;
    max: number;
  };
  rating: number[];
  availability: ('inStock' | 'outOfStock')[];
  badges: string[];
}

// Sort Options
export type SortOption = 
  | 'popular'
  | 'price-low'
  | 'price-high'
  | 'newest'
  | 'rating'
  | 'name-az'
  | 'name-za';

export interface SortConfig {
  value: SortOption;
  label: string;
}