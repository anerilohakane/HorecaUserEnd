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
  stockQuantity?: number;
  discount?: number;
  tags: string[];
  // Dynamic fields
  specifications?: { name: string; value: string }[];
  storage?: string;
  shelfLife?: string;
  origin?: string;
  certification?: string;
}

export interface Review {
  _id: string;
  user: any; // User object or null often comes back
  product: string;
  order?: string;
  rating: number;
  comment: string;
  images?: string[];
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
  author?: string; // Derived for UI
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