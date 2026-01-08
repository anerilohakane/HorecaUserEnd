'use client';

import { useAuth } from '@/lib/context/AuthContext';
import { Product } from '@/lib/types/product';
import { Star, Plus, Heart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, useMemo } from 'react';

interface ProductCardProps {
  product?: Partial<Product> | null;
  initialWishlistState?: boolean;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

// Get API base URL with fallback
const getApiBase = () => {
  return process.env.NEXT_PUBLIC_API_BASE_URL || "http://horeca-backend-six.vercel.app";  // backend
};

function mapRawToProduct(raw: any): Product | null {
  if (!raw) return null;
  const id = raw._id ?? raw.id ?? raw.productId;
  if (!id) return null;

  return {
    id: String(id),
    name: raw.name ?? raw.title ?? 'Unnamed product',
    description: raw.description ?? raw.desc ?? '',
    price: typeof raw.price === 'number' ? raw.price : Number(raw.price ?? 0),
    discount: typeof raw.discount === 'number' ? raw.discount : (typeof raw.offerPercentage === 'number' ? raw.offerPercentage : 0),
    image:
      typeof raw.image === 'string'
        ? raw.image
        : Array.isArray(raw.images) && raw.images.length
          ? (raw.images[0].url ?? raw.images[0])
          : '',
    unit: raw.unit ?? 'pcs',
    minOrder: typeof raw.minOrder === 'number' ? raw.minOrder : (raw.minOrder ?? 1),
    rating: typeof raw.rating === 'number' ? raw.rating : (raw.averageRating ?? 0),
    reviews: typeof raw.reviews === 'number' ? raw.reviews : (raw.totalReviews ?? 0),
    category: raw.category ?? raw.categoryName ?? raw.categoryId ?? '',
    badge: raw.badge ?? (raw.isFeatured ? 'Featured' : undefined),
    inStock: typeof raw.inStock === 'boolean' ? raw.inStock : (typeof raw.stockQuantity === 'number' ? raw.stockQuantity > 0 : true),
    ...(raw as any),
  } as Product;
}

export default function ProductCard({ product: incoming, initialWishlistState = false }: ProductCardProps) {
  // All state declarations first
  const [isAdding, setIsAdding] = useState(false);
  const [isWishlisting, setIsWishlisting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [wishlistError, setWishlistError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [wishlistSuccess, setWishlistSuccess] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(initialWishlistState);
  const [API_BASE, setApiBase] = useState('');
  const [productState, setProductState] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const { user } = useAuth();

  // Helper function defined early
  const looksPartial = (p: Partial<Product> | null | undefined) =>
    !p || !p.id || p.price == null || !p.image;

  // Initialize API base on client side
  useEffect(() => {
    setApiBase(getApiBase());
  }, []);

  // Fetch product data
  useEffect(() => {
    if (!incoming) return;

    const mapped = mapRawToProduct(incoming);
    if (mapped) {
      setProductState(mapped);
    }
  }, [incoming]);


  // Define effectiveProduct using useMemo
  const effectiveProduct = useMemo(() => {
    return (productState ?? (incoming as Product) ?? {
      id: 'unknown',
      name: 'Unnamed product',
      description: '',
      price: 0,
      discount: 0,
      image: '',
      unit: 'pcs',
      minOrder: 1,
      rating: 0,
      reviews: 0,
      category: '',
      badge: undefined,
      inStock: true,
      // minOrder: 1, // Ensure minOrder is set to default
    }) as Product;
  }, [productState, incoming]);

  // Fetch Reviews specifically for this card to ensure accurate rating
  useEffect(() => {
    if (!effectiveProduct?.id || !API_BASE) return;

    const fetchReviews = async () => {
      try {
        console.log(`⭐ Fetching reviews for product: ${effectiveProduct.id} from ${API_BASE}`);
        const res = await fetch(`${API_BASE}/api/reviews?productId=${effectiveProduct.id}`);
        console.log(`⭐ Fetch status for ${effectiveProduct.id}: ${res.status}`);
        if (res.ok) {
          const data = await res.json();
          console.log(`⭐ Reviews data for ${effectiveProduct.id}:`, data);
          setReviews(data.reviews || []);
        } else {
          console.log(`⭐ Fetch failed for ${effectiveProduct.id}`);
        }
      } catch (e) {
        console.error(`⭐ Error fetching reviews for ${effectiveProduct.id}:`, e);
      }
    };

    fetchReviews();
  }, [effectiveProduct.id, API_BASE]);

  // Check wishlist status - NOW it can use effectiveProduct safely
  useEffect(() => {
    if (!effectiveProduct?.id || !user?.id) return;

    const checkWishlistStatus = async () => {
      try {
        const token = localStorage.getItem("unifoods_token");
        if (!token) return;

        const response = await fetch(`https://horeca-backend-six.vercel.app/api/wishlist/check/${effectiveProduct.id}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setIsInWishlist(data.isInWishlist || false);
        }
      } catch (err) {
        console.error("Failed to check wishlist status:", err);
      }
    };

    checkWishlistStatus();
  }, [effectiveProduct?.id, user?.id, "https://horeca-backend-six.vercel.app"]);


  // Cart handler
  const handleAddToCart = async () => {
    if (!effectiveProduct?.id || isAdding) return;

    setIsAdding(true);
    setError(null);
    setSuccess(false);

    try {

      const token = localStorage.getItem("unifoods_token");
      if (!token) {
        throw new Error("Please log in to add items to your cart.");
      }

      const payload = {
        userId: user?.id,                 // ✅ BACKEND EXPECTS THIS
        productId: effectiveProduct.id,   // ✅ BACKEND EXPECTS THIS
        quantity: effectiveProduct.minOrder,
      };

      const response = await fetch(`https://horeca-backend-six.vercel.app/api/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => null);
        console.error("🔴 FULL BACKEND ERROR:", err);
        throw new Error(err?.message || err?.error || "Failed to add to cart");
      }

      const result = await response.json();
      window.dispatchEvent(new Event("cart-updated"));
      setSuccess(true);

    } catch (err: any) {
      setError(err?.message || "Failed to add to cart.");
      setTimeout(() => setError(null), 4000);
    } finally {
      setIsAdding(false);
      setTimeout(() => setSuccess(false), 2000);
    }
  };

  // Wishlist handler
  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!effectiveProduct?.id || isWishlisting) return;

    setIsWishlisting(true);
    setWishlistError(null);
    setWishlistSuccess(false);

    try {
      const token = localStorage.getItem("unifoods_token");
      if (!token) {
        throw new Error("Please log in to manage your wishlist.");
      }

      const payload = {
        productId: effectiveProduct.id,
        userId: user?.id || '',
      };

      const method = isInWishlist ? "DELETE" : "POST";
      const endpoint = isInWishlist
        ? `https://horeca-backend-six.vercel.app/api/wishlist/${effectiveProduct.id}`
        : `https://horeca-backend-six.vercel.app/api/wishlist`;

      const response = await fetch(endpoint, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: method === "POST" ? JSON.stringify(payload) : undefined,
      });

      if (!response.ok) {
        const err = await response.json().catch(() => null);
        console.error("🔴 WISHLIST BACKEND ERROR:", err);
        throw new Error(err?.message || err?.error ||
          (isInWishlist ? "Failed to remove from wishlist" : "Failed to add to wishlist"));
      }

      const result = await response.json();

      // Toggle the wishlist status
      setIsInWishlist(!isInWishlist);
      setWishlistSuccess(true);

    } catch (err: any) {
      setWishlistError(err?.message ||
        (isInWishlist ? "Failed to remove from wishlist" : "Failed to add to wishlist"));
      setTimeout(() => setWishlistError(null), 4000);
    } finally {
      setIsWishlisting(false);
      setTimeout(() => setWishlistSuccess(false), 2000);
    }
  };

  // Helper functions for rendering
  const getBadgeColor = (badge: string | undefined) => {
    switch (badge) {
      case 'Bestseller':
        return 'bg-[#D97706] text-white';
      case 'New':
        return 'bg-[#D97706] text-white';
      case 'In Stock':
        return 'bg-emerald-500 text-white';
      case 'Premium':
        return 'bg-purple-500 text-white';
      case 'Sale':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const discountedPrice = effectiveProduct.discount
    ? (effectiveProduct.price - (effectiveProduct.price * effectiveProduct.discount) / 100)
    : null;

  const computeCategoryLabel = (cat: any) => {
    if (!cat) return '';
    if (typeof cat === 'object') {
      return String(cat.name ?? cat.title ?? cat.slug ?? '').trim();
    }
    const s = String(cat).trim();
    const isHex24 = /^[0-9a-fA-F]{24}$/.test(s);
    const isUuid = /^[0-9a-fA-F-]{36}$/.test(s);
    if (isHex24 || isUuid) return '';
    return s;
  };

  const categoryLabel = computeCategoryLabel(effectiveProduct.category);

  // Dynamic Rating Calculation
  const dynamicRating = reviews.length > 0
    ? Number((reviews.reduce((acc: any, r: any) => acc + (r.rating || 0), 0) / reviews.length).toFixed(1))
    : effectiveProduct.rating;

  const dynamicCount = reviews.length > 0 ? reviews.length : effectiveProduct.reviews;

  // Render component
  return (
    <div className="group bg-white rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-300 relative border border-transparent hover:border-gray-100">
      {/* Error Messages */}
      {error && (
        <div className="absolute top-2 left-2 right-2 bg-red-100 text-red-700 text-xs p-2 rounded-md z-20 animate-fade-in whitespace-pre-line">
          {error}
        </div>
      )}

      {wishlistError && (
        <div className="absolute top-2 left-2 right-2 bg-red-100 text-red-700 text-xs p-2 rounded-md z-20 animate-fade-in whitespace-pre-line">
          {wishlistError}
        </div>
      )}

      {success && (
        <div className="pointer-events-none absolute top-2 left-2 right-2 bg-green-100 text-green-700 text-xs p-2 rounded-md z-20">
          Added to cart!
        </div>
      )}

      {/* Product Image Area */}
      <div className="relative aspect-[4/3] bg-[#F9F9F9] overflow-hidden">
        <Link href={`/products/${effectiveProduct.id}`} className="block w-full h-full relative">
          {(() => {
            const rawImage = (effectiveProduct.image ?? '').trim();
            let src = '/images/placeholder.png';

            if (rawImage) {
              if (rawImage.startsWith('http://') || rawImage.startsWith('https://') || rawImage.startsWith('//')) {
                src = rawImage;
              } else {
                const filename = rawImage.replace(/^\/+/, '');
                src = `/images/products/${filename}`;
              }
            }

            const isExternal = src.startsWith('http') || src.startsWith('//');

            return (
              <Image
                src={src}
                alt={effectiveProduct.name}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500 rounded-t-xl"
                unoptimized={isExternal}
                priority={false}
              />
            );
          })()}
        </Link>

        {/* Wishlist Button - Top Right */}
        <button
          onClick={handleWishlistToggle}
          disabled={isWishlisting || !API_BASE}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-white/80 hover:bg-white text-gray-400 hover:text-red-500 transition-colors z-10"
        >
          <Heart
            size={18}
            className={isInWishlist ? "fill-red-500 text-red-500" : ""}
          />
        </button>
      </div>

      {/* Product Info */}
      <div className="p-3">
        {/* Veg Indicator */}
        <div className="mb-1">
          <div className="border border-green-600 p-[2px] w-4 h-4 flex items-center justify-center rounded-[2px]">
            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
          </div>
        </div>

        {/* Title */}
        <Link href={`/products/${effectiveProduct.id}`}>
          <h3 className="font-bold text-gray-900 text-[15px] mb-1 leading-tight line-clamp-2 min-h-[40px]">
            {effectiveProduct.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className={`flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold ${dynamicRating > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
            {dynamicRating > 0 ? dynamicRating : 'New'}
            {dynamicRating > 0 && <Star size={10} className="fill-green-700 ml-0.5" />}
          </div>
          {dynamicCount > 0 && (
            <span className="text-xs text-gray-400">({dynamicCount} reviews)</span>
          )}
        </div>

        {/* Price and Add Button */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-gray-900">
              ₹{discountedPrice ? discountedPrice.toFixed(0) : effectiveProduct.price}
              <span className="text-gray-500 font-normal ml-1">/ {effectiveProduct.unit}</span>
            </span>
            {discountedPrice && (
              <span className="text-xs text-gray-400 line-through">₹{effectiveProduct.price}</span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isAdding || !API_BASE}
            className={`px-4 py-1.5 rounded border text-xs font-bold transition-all uppercase
              ${isAdding
                ? 'bg-orange-50 border-orange-500 text-orange-600'
                : 'bg-white border-orange-400 text-orange-500 hover:bg-orange-50'
              }`}
          >
            {isAdding ? 'ADD...' : 'ADD +'}
          </button>
        </div>
      </div>
    </div >
  );
}