'use client';

import { useAuth } from '@/lib/context/AuthContext';
import { Product } from '@/lib/types/product';
import { Star, Plus, Heart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, useMemo } from 'react';

interface ProductCardProps {
  product?: Partial<Product> | null;
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

export default function ProductCard({ product: incoming }: ProductCardProps) {
  // All state declarations first
  const [isAdding, setIsAdding] = useState(false);
  const [isWishlisting, setIsWishlisting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [wishlistError, setWishlistError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [wishlistSuccess, setWishlistSuccess] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
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

    // Determine if we should fetch reviews. 
    // Optimization: Only fetch if reviews are 0 (implies listing API didn't provide them)
    // or always fetch to be safe. Since listing API returns 0 rating, we fetch.

    const fetchReviews = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/reviews?productId=${effectiveProduct.id}`);
        if (res.ok) {
          const data = await res.json();
          setReviews(data.reviews || []);
        }
      } catch (e) {
        // silent fail
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
    <div className="group cursor-pointer bg-white rounded-2xl overflow-hidden soft-shadow hover:elegant-shadow transition-all relative">
      {/* Error Messages */}
      {error && (
        <div className="absolute top-2 left-2 right-2 bg-red-100 text-red-700 text-xs p-2 rounded-md z-10 animate-fade-in whitespace-pre-line">
          {error}
        </div>
      )}

      {wishlistError && (
        <div className="absolute top-2 left-2 right-2 bg-red-100 text-red-700 text-xs p-2 rounded-md z-10 animate-fade-in whitespace-pre-line">
          {wishlistError}
        </div>
      )}

      {success && (
        <div className="pointer-events-none absolute top-2 left-2 right-2 bg-green-100 text-green-700 text-xs p-2 rounded-md z-10">
          {effectiveProduct.name} added to cart!
        </div>
      )}

      {wishlistSuccess && (
        <div className="absolute top-2 left-2 right-2 bg-green-100 text-green-700 text-xs p-2 rounded-md z-10 animate-fade-in">
          {effectiveProduct.name} {isInWishlist ? 'added to' : 'added to'} wishlist!
        </div>
      )}

      {/* Product Image */}
      <div className="relative aspect-square bg-[#F5F5F5] overflow-hidden">
        <Link href={`/products/${effectiveProduct.id}`}>
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
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                unoptimized={isExternal}
                priority={false}
              />
            );
          })()}
        </Link>

        {effectiveProduct.badge && (
          <div className="absolute top-3 left-3">
            <span className={`${getBadgeColor(effectiveProduct.badge)} px-3 py-1 rounded-full text-xs font-medium`}>
              {effectiveProduct.badge}
            </span>
          </div>
        )}

        {effectiveProduct.discount ? (
          <div className="absolute top-3 right-3">
            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
              -{effectiveProduct.discount}%
            </span>
          </div>
        ) : null}

        <div className="absolute bottom-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleWishlistToggle}
            disabled={isWishlisting || !API_BASE}
            className="bg-white p-3 rounded-full shadow-lg hover:bg-[#D97706] hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed relative"
            title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            {isWishlisting ? (
              <span className="inline-block h-4 w-4 border-2 border-[#D97706] border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <Heart
                size={18}
                strokeWidth={2.5}
                className={isInWishlist ? "fill-red-500 text-red-500" : ""}
              />
            )}
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {categoryLabel ? <p className="text-xs text-gray-500 mb-1">{categoryLabel}</p> : null}

        <Link href={`/products/${effectiveProduct.id}`}>
          <h3 className="font-medium text-gray-800 mb-2 text-sm group-hover:text-[#D97706] transition-colors line-clamp-2 min-h-[40px]">
            {effectiveProduct.name}
          </h3>
        </Link>

        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className={`${i < Math.floor(dynamicRating)
                  ? 'fill-[#FFB800] text-[#FFB800]'
                  : 'text-gray-300'
                  }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">({dynamicCount})</span>
        </div>

        <div className="flex items-baseline gap-2 mb-3">
          {discountedPrice ? (
            <>
              <span className="text-lg font-bold text-[#D97706]">₹{discountedPrice.toFixed(0)}</span>
              <span className="text-sm text-gray-400 line-through">₹{effectiveProduct.price}</span>
            </>
          ) : (
            <span className="text-lg font-bold text-[#111827]">₹{effectiveProduct.price}</span>
          )}
          <span className="text-xs text-gray-500">/ {effectiveProduct.unit}</span>
        </div>

        <p className="text-xs text-gray-500 mb-3">
          Min. Order: {effectiveProduct.minOrder} {effectiveProduct.unit}
        </p>

        <button
          onClick={handleAddToCart}
          disabled={isAdding || !API_BASE}
          className={`w-full py-2.5 rounded-full transition-all font-medium text-sm shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed relative ${success
            ? 'bg-green-600 text-white hover:bg-green-700'
            : 'bg-[#D97706] text-white hover:bg-[#B45309]'
            }`}
        >
          {isAdding ? (
            <>
              <span className="inline-block mr-2">Adding...</span>
              <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            </>
          ) : success ? (
            'Added ✓'
          ) : !API_BASE ? (
            'Configuring...'
          ) : (
            'Add to Cart'
          )}
        </button>
      </div>
    </div>
  );
}