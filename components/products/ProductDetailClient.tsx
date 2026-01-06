// 'use client';

// import { useState } from 'react';
// import { Product } from '@/lib/types/product';
// import ProductImageGallery from './ProductImageGallery';
// import ProductReviews from './ProductReviews';
// import RelatedProducts from './RelatedProducts';
// import { 
//   Star, 
//   Minus, 
//   Plus, 
//   ShoppingCart, 
//   Heart, 
//   Share2,
//   Truck,
//   Shield,
//   RotateCcw,
//   Award
// } from 'lucide-react';
// import Link from 'next/link';
// import { useCart } from '@/lib/context/CartContext';

// interface ProductDetailClientProps {
//   product: Product;
//   relatedProducts: Product[];
// }

// export default function ProductDetailClient({ 
//   product, 
//   relatedProducts 
// }: ProductDetailClientProps) {
//       const { addItem } = useCart();
//   const [isAdding, setIsAdding] = useState(false);

//   const handleAddToCart = () => {
//     setIsAdding(true);
//     addItem(product, quantity);

//     setTimeout(() => {
//       setIsAdding(false);
//       // Optionally redirect to cart or show success message
//     }, 1000);
//   };
//   const [quantity, setQuantity] = useState(product.minOrder);
//   const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'reviews'>('description');

//   const incrementQuantity = () => {
//     setQuantity((prev) => prev + 1);
//   };

//   const decrementQuantity = () => {
//     setQuantity((prev) => Math.max(product.minOrder, prev - 1));
//   };

//   const discountedPrice = product.discount 
//     ? product.price - (product.price * product.discount / 100)
//     : null;

//   const totalPrice = (discountedPrice || product.price) * quantity;

//   // Sample reviews data
//   const reviews = [
//     {
//       id: 1,
//       author: "Priya Sharma",
//       rating: 5,
//       date: "2 weeks ago",
//       title: "Excellent quality!",
//       comment: "This product exceeded my expectations. Perfect for professional baking and the quality is consistent.",
//       verified: true,
//       helpful: 12
//     },
//     {
//       id: 2,
//       author: "Rajesh Kumar",
//       rating: 4,
//       date: "1 month ago",
//       title: "Good value for money",
//       comment: "Great product at a reasonable price. Would recommend for bakeries looking for bulk supplies.",
//       verified: true,
//       helpful: 8
//     },
//     {
//       id: 3,
//       author: "Anita Desai",
//       rating: 5,
//       date: "1 month ago",
//       title: "Best in the market",
//       comment: "We've tried many suppliers but this is by far the best quality we've found. Will order again!",
//       verified: true,
//       helpful: 15
//     }
//   ];

//   return (
//     <div className="min-h-screen bg-[#FAFAF7]">
//       {/* Breadcrumb */}
//       <div className="bg-white border-b border-gray-100">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//           <nav className="flex items-center gap-2 text-sm text-gray-600">
//             <Link href="/" className="hover:text-[#D97706] transition-colors">Home</Link>
//             <span>/</span>
//             <a href="/products" className="hover:text-[#D97706] transition-colors">Products</a>
//             <span>/</span>
//             <a href={`/products?category=${product.category}`} className="hover:text-[#D97706] transition-colors">
//               {product.category}
//             </a>
//             <span>/</span>
//             <span className="text-[#111827] font-medium">{product.name}</span>
//           </nav>
//         </div>
//       </div>

//       {/* Product Details */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="grid lg:grid-cols-2 gap-12 mb-12">
//           {/* Left: Image Gallery */}
//           <div>
//             <ProductImageGallery 
//               productName={product.name}
//               mainImage={product.image}
//               images={[product.image, product.image, product.image]} // Add more images if available
//             />
//           </div>

//           {/* Right: Product Info */}
//           <div className="space-y-6">
//             {/* Category & Badge */}
//             <div className="flex items-center gap-3">
//               <span className="text-sm text-gray-600">{product.category}</span>
//               {product.badge && (
//                 <span className={`px-3 py-1 rounded-full text-xs font-medium ${
//                   product.badge === 'Bestseller' ? 'bg-[#D97706] text-white' :
//                   product.badge === 'New' ? 'bg-[#D97706] text-white' :
//                   product.badge === 'Premium' ? 'bg-purple-500 text-white' :
//                   'bg-emerald-500 text-white'
//                 }`}>
//                   {product.badge}
//                 </span>
//               )}
//             </div>

//             {/* Product Name */}
//             <h1 className="text-4xl font-light text-[#111827]">
//               {product.name}
//             </h1>

//             {/* Rating */}
//             <div className="flex items-center gap-4">
//               <div className="flex items-center gap-2">
//                 <div className="flex items-center gap-1">
//                   {[...Array(5)].map((_, i) => (
//                     <Star
//                       key={i}
//                       size={18}
//                       className={`${
//                         i < Math.floor(product.rating)
//                           ? 'fill-[#FFB800] text-[#FFB800]'
//                           : 'text-gray-300'
//                       }`}
//                     />
//                   ))}
//                 </div>
//                 <span className="font-semibold text-[#111827]">{product.rating}</span>
//               </div>
//               <span className="text-gray-600">({product.reviews} reviews)</span>
//             </div>

//             {/* Price */}
//             <div className="py-4 border-y border-gray-200">
//               <div className="flex items-baseline gap-3">
//                 {discountedPrice ? (
//                   <>
//                     <span className="text-4xl font-bold text-[#D97706]">
//                       ₹{discountedPrice.toFixed(0)}
//                     </span>
//                     <span className="text-xl text-gray-400 line-through">
//                       ₹{product.price}
//                     </span>
//                     <span className="text-sm bg-red-500 text-white px-2 py-1 rounded-full font-semibold">
//                       Save {product.discount}%
//                     </span>
//                   </>
//                 ) : (
//                   <span className="text-4xl font-bold text-[#111827]">
//                     ₹{product.price}
//                   </span>
//                 )}
//                 <span className="text-gray-600">/ {product.unit}</span>
//               </div>
//               <p className="text-sm text-gray-600 mt-2">
//                 Minimum Order: {product.minOrder} {product.unit}
//               </p>
//             </div>

//             {/* Description */}
//             <div>
//               <p className="text-gray-700 leading-relaxed">
//                 {product.description}
//               </p>
//             </div>

//             {/* Quantity Selector */}
//             <div>
//               <label className="block text-sm font-medium text-[#111827] mb-2">
//                 Quantity
//               </label>
//               <div className="flex items-center gap-4">
//                 <div className="flex items-center border border-gray-300 rounded-full">
//                   <button
//                     onClick={decrementQuantity}
//                     className="p-3 hover:bg-gray-100 transition-colors rounded-l-full"
//                     disabled={quantity <= product.minOrder}
//                   >
//                     <Minus size={18} />
//                   </button>
//                   <span className="px-6 font-semibold">{quantity}</span>
//                   <button
//                     onClick={incrementQuantity}
//                     className="p-3 hover:bg-gray-100 transition-colors rounded-r-full"
//                   >
//                     <Plus size={18} />
//                   </button>
//                 </div>
//                 <span className="text-gray-600">
//                   Total: <span className="font-bold text-[#111827]">₹{totalPrice.toFixed(0)}</span>
//                 </span>
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex gap-3">
//              <button 
//         onClick={handleAddToCart}
//         disabled={isAdding}
//         className="flex-1 bg-[#D97706] text-white py-4 px-6 rounded-full hover:bg-[#B45309] transition-all shadow-md hover:shadow-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
//       >
//         <ShoppingCart size={20} />
//         {isAdding ? 'Added to Cart! ✓' : 'Add to Cart'}
//       </button>
//               <button className="p-4 border-2 border-gray-300 rounded-full hover:border-[#D97706] hover:text-[#D97706] transition-all">
//                 <Heart size={20} />
//               </button>
//               <button className="p-4 border-2 border-gray-300 rounded-full hover:border-[#D97706] hover:text-[#D97706] transition-all">
//                 <Share2 size={20} />
//               </button>
//             </div>

//             {/* Buy Now */}
//             <button className="w-full border-2 border-[#D97706] text-[#D97706] py-4 px-6 rounded-full hover:bg-[#D97706] hover:text-white transition-all font-semibold">
//               Buy Now
//             </button>

//             {/* Features */}
//             <div className="grid grid-cols-2 gap-4 pt-6">
//               <div className="flex items-start gap-3">
//                 <div className="bg-[#E8F5E9] p-2 rounded-full">
//                   <Truck size={20} className="text-[#D97706]" />
//                 </div>
//                 <div>
//                   <h4 className="font-medium text-[#111827] text-sm">Fast Delivery</h4>
//                   <p className="text-xs text-gray-600">2-3 business days</p>
//                 </div>
//               </div>
//               <div className="flex items-start gap-3">
//                 <div className="bg-[#E8F5E9] p-2 rounded-full">
//                   <Shield size={20} className="text-[#D97706]" />
//                 </div>
//                 <div>
//                   <h4 className="font-medium text-[#111827] text-sm">Quality Assured</h4>
//                   <p className="text-xs text-gray-600">100% authentic</p>
//                 </div>
//               </div>
//               <div className="flex items-start gap-3">
//                 <div className="bg-[#E8F5E9] p-2 rounded-full">
//                   <RotateCcw size={20} className="text-[#D97706]" />
//                 </div>
//                 <div>
//                   <h4 className="font-medium text-[#111827] text-sm">Easy Returns</h4>
//                   <p className="text-xs text-gray-600">7-day return policy</p>
//                 </div>
//               </div>
//               <div className="flex items-start gap-3">
//                 <div className="bg-[#E8F5E9] p-2 rounded-full">
//                   <Award size={20} className="text-[#D97706]" />
//                 </div>
//                 <div>
//                   <h4 className="font-medium text-[#111827] text-sm">Verified Seller</h4>
//                   <p className="text-xs text-gray-600">Trusted supplier</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Tabs Section */}
//         <div className="bg-white rounded-2xl soft-shadow mb-12">
//           {/* Tab Headers */}
//           <div className="border-b border-gray-200">
//             <div className="flex gap-8 px-8">
//               <button
//                 onClick={() => setActiveTab('description')}
//                 className={`py-4 font-medium transition-colors relative ${
//                   activeTab === 'description'
//                     ? 'text-[#D97706]'
//                     : 'text-gray-600 hover:text-[#D97706]'
//                 }`}
//               >
//                 Description
//                 {activeTab === 'description' && (
//                   <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D97706]" />
//                 )}
//               </button>
//               <button
//                 onClick={() => setActiveTab('specifications')}
//                 className={`py-4 font-medium transition-colors relative ${
//                   activeTab === 'specifications'
//                     ? 'text-[#D97706]'
//                     : 'text-gray-600 hover:text-[#D97706]'
//                 }`}
//               >
//                 Specifications
//                 {activeTab === 'specifications' && (
//                   <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D97706]" />
//                 )}
//               </button>
//               <button
//                 onClick={() => setActiveTab('reviews')}
//                 className={`py-4 font-medium transition-colors relative ${
//                   activeTab === 'reviews'
//                     ? 'text-[#D97706]'
//                     : 'text-gray-600 hover:text-[#D97706]'
//                 }`}
//               >
//                 Reviews ({product.reviews})
//                 {activeTab === 'reviews' && (
//                   <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D97706]" />
//                 )}
//               </button>
//             </div>
//           </div>

//           {/* Tab Content */}
//           <div className="p-8">
//             {activeTab === 'description' && (
//               <div className="prose max-w-none">
//                 <h3 className="text-xl font-medium text-[#111827] mb-4">Product Description</h3>
//                 <p className="text-gray-700 leading-relaxed mb-4">
//                   {product.description}
//                 </p>
//                 <h4 className="text-lg font-medium text-[#111827] mb-3">Features:</h4>
//                 <ul className="space-y-2 text-gray-700">
//                   <li>• Premium quality ingredients for professional use</li>
//                   <li>• Consistent texture and flavor in every batch</li>
//                   <li>• Suitable for all types of baking applications</li>
//                   <li>• Long shelf life with proper storage</li>
//                   <li>• Food-grade packaging for freshness</li>
//                 </ul>
//               </div>
//             )}

//             {activeTab === 'specifications' && (
//               <div>
//                 <h3 className="text-xl font-medium text-[#111827] mb-4">Product Specifications</h3>
//                 <div className="grid md:grid-cols-2 gap-6">
//                   <div className="space-y-3">
//                     <div className="flex justify-between py-2 border-b border-gray-100">
//                       <span className="text-gray-600">Category:</span>
//                       <span className="font-medium text-[#111827]">{product.category}</span>
//                     </div>
//                     <div className="flex justify-between py-2 border-b border-gray-100">
//                       <span className="text-gray-600">Unit:</span>
//                       <span className="font-medium text-[#111827]">{product.unit}</span>
//                     </div>
//                     <div className="flex justify-between py-2 border-b border-gray-100">
//                       <span className="text-gray-600">Minimum Order:</span>
//                       <span className="font-medium text-[#111827]">{product.minOrder} {product.unit}</span>
//                     </div>
//                     <div className="flex justify-between py-2 border-b border-gray-100">
//                       <span className="text-gray-600">Stock Status:</span>
//                       <span className="font-medium text-[#D97706]">{product.inStock ? 'In Stock' : 'Out of Stock'}</span>
//                     </div>
//                   </div>
//                   <div className="space-y-3">
//                     <div className="flex justify-between py-2 border-b border-gray-100">
//                       <span className="text-gray-600">Storage:</span>
//                       <span className="font-medium text-[#111827]">Cool, dry place</span>
//                     </div>
//                     <div className="flex justify-between py-2 border-b border-gray-100">
//                       <span className="text-gray-600">Shelf Life:</span>
//                       <span className="font-medium text-[#111827]">12 months</span>
//                     </div>
//                     <div className="flex justify-between py-2 border-b border-gray-100">
//                       <span className="text-gray-600">Origin:</span>
//                       <span className="font-medium text-[#111827]">India</span>
//                     </div>
//                     <div className="flex justify-between py-2 border-b border-gray-100">
//                       <span className="text-gray-600">Certification:</span>
//                       <span className="font-medium text-[#111827]">FSSAI Approved</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {activeTab === 'reviews' && (
//               <ProductReviews 
//                 reviews={reviews}
//                 averageRating={product.rating}
//                 totalReviews={product.reviews}
//               />
//             )}
//           </div>
//         </div>

//         {/* Related Products */}
//         <RelatedProducts products={relatedProducts} />
//       </div>
//     </div>
//   );
// }


'use client';

import { useEffect, useState } from 'react';
import { Product } from '@/lib/types/product';
import ProductImageGallery from './ProductImageGallery';
import ProductReviews from './ProductReviews';
import ReviewFormModal from './ReviewFormModal'; // Added
import RelatedProducts from './RelatedProducts';
import { Review } from '@/lib/types/product'; // Added
import {
  Star,
  Minus,
  Plus,
  ShoppingCart,
  Heart,
  Share2,
  Truck,
  Shield,
  RotateCcw,
  Award,
} from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/lib/context/CartContext';
import { useAuth } from '@/lib/context/AuthContext';
import { useMemo } from 'react';

interface ProductDetailClientProps {
  product?: Product; // made optional so the component can fetch when not provided
  relatedProducts?: Product[];
}

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || 'https://horeca-backend-six.vercel.app').trim();

export default function ProductDetailClient({
  product: initialProduct,
  relatedProducts: initialRelated = [],
}: ProductDetailClientProps) {
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(initialProduct ?? null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>(initialRelated);
  const [isAdding, setIsAdding] = useState(false);
  const [quantity, setQuantity] = useState<number>(initialProduct?.minOrder ?? 1);
  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'reviews'>('description');
  const [isWishlisting, setIsWishlisting] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistError, setWishlistError] = useState<string | null>(null);
  const { user } = useAuth();
  const [shareMessage, setShareMessage] = useState<string | null>(null);

  // Reviews State
  const [reviews, setReviews] = useState<Review[]>([]);


  const averageRating = useMemo(() => {
    if (!reviews.length) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return Number((sum / reviews.length).toFixed(1));
  }, [reviews]);


  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [reviewsLoading, setReviewsLoading] = useState(false);


  const handleShare = async () => {
    if (!product) return;

    const shareUrl =
      typeof window !== "undefined"
        ? window.location.href
        : "";

    try {
      // ✅ Use native share if available (mobile, modern browsers)
      if (navigator.share) {
        await navigator.share({
          title: product.name,
          text: `Check out this product: ${product.name}`,
          url: shareUrl,
        });
        setShareMessage("Product shared successfully!");
      } else {
        // 🧠 Fallback: copy to clipboard
        await navigator.clipboard.writeText(shareUrl);
        setShareMessage("Product link copied to clipboard!");
      }
    } catch (err) {
      console.error("Share failed:", err);
      setShareMessage("Failed to share product.");
    } finally {
      setTimeout(() => setShareMessage(null), 3000);
    }
  };


  useEffect(() => {
    if (!product?.id) return;

    const checkWishlist = async () => {
      try {
        const token = localStorage.getItem("unifoods_token");
        if (!token) return;

        const base =
          (process.env.NEXT_PUBLIC_API_BASE_URL ||
            "https://horeca-backend-six.vercel.app").replace(/\/$/, "");

        const res = await fetch(
          `${base}/api/wishlist/check/${product.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        if (!res.ok) return;

        const data = await res.json();
        setIsInWishlist(Boolean(data?.isInWishlist));
      } catch (err) {
        console.error("Wishlist check failed:", err);
      }
    };

    checkWishlist();
  }, [product?.id]);


  const handleWishlistToggle = async () => {
    if (!product?.id || isWishlisting) return;

    setIsWishlisting(true);
    setWishlistError(null);

    try {
      const token = localStorage.getItem("unifoods_token");
      if (!token) {
        throw new Error("Please log in to manage your wishlist.");
      }

      // ✅ DEFINE BASE HERE
      const base =
        (process.env.NEXT_PUBLIC_API_BASE_URL ||
          "https://horeca-backend-six.vercel.app").replace(/\/$/, "");

      const endpoint = isInWishlist
        ? `${base}/api/wishlist/${product.id}`
        : `${base}/api/wishlist`;

      const res = await fetch(endpoint, {
        method: isInWishlist ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: isInWishlist
          ? undefined
          : JSON.stringify({
            productId: product.id,
            userId: user?.id || user?.id,
          }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        console.error("WISHLIST ERROR:", err);
        throw new Error(err?.message || "Wishlist update failed");
      }

      setIsInWishlist((prev) => !prev);
    } catch (err: any) {
      setWishlistError(err.message || "Wishlist error");
      setTimeout(() => setWishlistError(null), 3000);
    } finally {
      setIsWishlisting(false);
    }
  };






  // helper builder & mapper (same defensive approach)
  const buildUrl = (path: string) => {
    const base = API_BASE.replace(/\/+$/, '');
    const raw = base ? `${base}/${path.replace(/^\/+/, '')}` : `/${path.replace(/^\/+/, '')}`;
    return raw.replace(/([^:]\/)\/+/g, '$1');
  };

  const mapProduct = (raw: any): Product | null => {
    if (!raw) return null;
    const id = raw._id ?? raw.id ?? raw.productId ?? String(raw.sku ?? '');
    if (!id) return null;
    return {
      id: String(id),
      name: raw.name ?? raw.title ?? 'Unnamed product',
      description: raw.description ?? raw.desc ?? '',
      price: typeof raw.price === 'number' ? raw.price : Number(raw.price ?? 0),
      discount: typeof raw.discount === 'number' ? raw.discount : (typeof raw.offerPercentage === 'number' ? raw.offerPercentage : 0),
      image: (raw.image && typeof raw.image === 'string') ? raw.image : (Array.isArray(raw.images) && raw.images[0] ? (raw.images[0].url ?? raw.images[0]) : ''),
      unit: raw.unit ?? 'pcs',
      minOrder: typeof raw.minOrder === 'number' ? raw.minOrder : (raw.minOrder ?? 1),
      rating: typeof raw.rating === 'number' ? raw.rating : (raw.averageRating ?? 0),
      reviews: typeof raw.reviews === 'number' ? raw.reviews : (raw.totalReviews ?? 0),
      category: raw.category ?? raw.categoryName ?? raw.categoryId ?? '',
      badge: raw.badge ?? (raw.isFeatured ? 'Featured' : undefined),
      inStock: typeof raw.inStock === 'boolean' ? raw.inStock : (typeof raw.stockQuantity === 'number' ? raw.stockQuantity > 0 : true),
      ...(raw as any),
    } as Product;
  };

  // fetch single product when initialProduct not provided
  useEffect(() => {
    if (product) {
      // set initial quantity if product arrives
      setQuantity(product.minOrder ?? 1);
      return;
    }

    // try to extract product id from URL if we are on /products/:id
    let productId: string | null = null;
    try {
      const path = typeof window !== 'undefined' ? window.location.pathname : '';
      const match = path.match(/\/products\/([^/]+)/);
      if (match && match[1]) productId = decodeURIComponent(match[1]);
    } catch (e) {
      // ignore
    }
    if (!productId) return;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    (async () => {
      try {
        const url = buildUrl(`api/products/${encodeURIComponent(productId)}`);
        const res = await fetch(url, { signal: controller.signal, headers: { Accept: 'application/json' } });
        if (!res.ok) {
          let msg = '';
          try {
            const b = await res.json();
            msg = b?.message ? ` — ${b.message}` : '';
          } catch { }
          throw new Error(`Failed to fetch product (status ${res.status})${msg}`);
        }
        const ct = res.headers.get('content-type') ?? '';
        if (!ct.includes('application/json')) throw new Error('Invalid response: expected JSON');
        const json = await res.json();
        const raw = json?.data ?? json?.product ?? json;
        const mapped = mapProduct(raw);
        if (mapped) {
          setProduct(mapped);
          setQuantity(mapped.minOrder ?? 1);
        } else {
          console.warn('[ProductDetailClient] product shape invalid', raw);
        }
      } catch (err: any) {
        if (err?.name === 'AbortError') {
          console.debug('[ProductDetailClient] product fetch aborted');
        } else {
          console.error('[ProductDetailClient] error fetching product', err);
        }
      } finally {
        clearTimeout(timeoutId);
      }
    })();

    return () => {
      controller.abort();
      clearTimeout(timeoutId);
    };
    // we want to run once on mount if no product passed
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // fetch related products (simple approach by category) when we have the product and no initial related products
  useEffect(() => {
    if (!product) return;
    if (initialRelated && initialRelated.length > 0) return;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    (async () => {
      try {
        // naive related fetch: by category with limit
        const urlObj = new URL(buildUrl('api/products'), typeof window !== 'undefined' ? window.location.origin : 'http://localhost');
        if (product.category) urlObj.searchParams.set('category', product.category);
        urlObj.searchParams.set('limit', '6');

        const res = await fetch(urlObj.toString(), { signal: controller.signal, headers: { Accept: 'application/json' } });
        if (!res.ok) return;
        const json = await res.json();
        let list: any[] = [];

        if (Array.isArray(json)) {
          list = json;
        } else if (Array.isArray(json?.data)) {
          list = json.data;
        } else if (Array.isArray(json?.products)) {
          list = json.products;
        } else if (Array.isArray(json?.data?.products)) {
          list = json.data.products;
        } else {
          console.warn(
            "[ProductDetailClient] Related products response is not an array:",
            json
          );
          list = [];
        }

        const mapped = list
          .map(mapProduct)
          .filter(Boolean) as Product[];


        // remove the current product from related list if present
        const filtered = mapped.filter((p) => p.id !== product.id).slice(0, 6);
        setRelatedProducts(filtered);
      } catch (err: any) {
        if (err?.name === 'AbortError') return;
        console.error('[ProductDetailClient] related products fetch failed', err);
      } finally {
        clearTimeout(timeoutId);
      }
    })();

    return () => {
      controller.abort();
      clearTimeout(timeoutId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id]);

  // Fetch Reviews
  const fetchReviews = async () => {
    if (!product?.id) return;

    setReviewsLoading(true);
    try {
      const res = await fetch(
        `${API_BASE.replace(/\/$/, '')}/api/reviews?productId=${product.id}`,
        { headers: { Accept: 'application/json' } }
      );

      if (!res.ok) throw new Error("Failed to fetch reviews");

      const json = await res.json();
      setReviews(json.reviews || []);
    } catch (err) {
      console.error("Fetch reviews failed:", err);
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [product?.id]);


  const handleReviewSubmit = async (data: { rating: number; comment: string; images: string[] }) => {
    if (!product?.id) return;

    // Check auth
    const token = localStorage.getItem("unifoods_token");
    if (!token) {
      // You might want to show a toast or alert here
      alert("Please log in to submit a review.");
      return;
    }

    const payload = {
      productId: product.id,
      rating: data.rating,
      comment: data.comment,
      images: data.images
    };

    const base = API_BASE.replace(/\/$/, "");
    const res = await fetch(`${base}/api/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to submit review");
    }

    // Refresh reviews
    fetchReviews();
  };

  const handleAddToCart = () => {
    if (!product) return;
    setIsAdding(true);
    addItem(product, quantity);
    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
  };

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => setQuantity((prev) => Math.max(product?.minOrder ?? 1, prev - 1));

  const discountedPrice = product?.discount
    ? (product.price - (product.price * product.discount) / 100)
    : null;

  const totalPrice = ((discountedPrice ?? product?.price) ?? 0) * quantity;

  // fallback while loading product
  if (!product) {
    return (
      <div className="min-h-screen bg-[#FAFAF7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-24">
            <p className="text-gray-500">Loading product...</p>
          </div>
        </div>
      </div>
    );
  }

  // Reviews now fetched from API


  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-[#D97706] transition-colors">Home</Link>
            <span>/</span>
            <a href="/products" className="hover:text-[#D97706] transition-colors">Products</a>
            <span>/</span>
            <a href={`/products?category=${product.category}`} className="hover:text-[#D97706] transition-colors">
              {product.category}
            </a>
            <span>/</span>
            <span className="text-[#111827] font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          {/* Left: Image Gallery */}
          <div>
            <ProductImageGallery
              productName={product.name}
              mainImage={product.image}
              images={[product.image, product.image, product.image]}
            />
          </div>

          {/* Right: Product Info */}
          <div className="space-y-6">
            {/* Category & Badge */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">{product.category}</span>
              {product.badge && (
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${product.badge === 'Bestseller' ? 'bg-[#D97706] text-white' :
                  product.badge === 'New' ? 'bg-[#D97706] text-white' :
                    product.badge === 'Premium' ? 'bg-purple-500 text-white' :
                      'bg-emerald-500 text-white'
                  }`}>
                  {product.badge}
                </span>
              )}
            </div>

            {/* Product Name */}
            <h1 className="text-4xl font-light text-[#111827]">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={`${i < Math.floor(averageRating || 0)
                        ? 'fill-[#FFB800] text-[#FFB800]'
                        : 'text-gray-300'
                        }`}
                    />
                  ))}
                </div>
                {/* Dynamically calculated average rating */}
                <span className="font-semibold text-[#111827]">{averageRating || 0}</span>
              </div>
              {/* Actual fetched review count */}
              <span className="text-gray-600">({reviews.length} reviews)</span>
            </div>

            {/* Price */}
            <div className="py-4 border-y border-gray-200">
              <div className="flex items-baseline gap-3">
                {discountedPrice ? (
                  <>
                    <span className="text-4xl font-bold text-[#D97706]">
                      ₹{discountedPrice.toFixed(0)}
                    </span>
                    <span className="text-xl text-gray-400 line-through">
                      ₹{product.price}
                    </span>
                    <span className="text-sm bg-red-500 text-white px-2 py-1 rounded-full font-semibold">
                      Save {product.discount}%
                    </span>
                  </>
                ) : (
                  <span className="text-4xl font-bold text-[#111827]">
                    ₹{product.price}
                  </span>
                )}
                <span className="text-gray-600">/ {product.unit}</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Minimum Order: {product.minOrder} {product.unit}
              </p>
            </div>

            {/* Description */}
            <div>
              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Quantity Selector */}
            <div>
              <label className="block text-sm font-medium text-[#111827] mb-2">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded-full">
                  <button
                    onClick={decrementQuantity}
                    className="p-3 hover:bg-gray-100 transition-colors rounded-l-full"
                    disabled={quantity <= product.minOrder}
                  >
                    <Minus size={18} />
                  </button>
                  <span className="px-6 font-semibold">{quantity}</span>
                  <button
                    onClick={incrementQuantity}
                    className="p-3 hover:bg-gray-100 transition-colors rounded-r-full"
                  >
                    <Plus size={18} />
                  </button>
                </div>
                <span className="text-gray-600">
                  Total: <span className="font-bold text-[#111827]">₹{totalPrice.toFixed(0)}</span>
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className="flex-1 bg-[#D97706] text-white py-4 px-6 rounded-full hover:bg-[#B45309] transition-all shadow-md hover:shadow-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <ShoppingCart size={20} />
                {isAdding ? 'Added to Cart! ✓' : 'Add to Cart'}
              </button>
              <button
                onClick={handleWishlistToggle}
                disabled={isWishlisting}
                title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                className={`p-4 border-2 rounded-full transition-all ${isInWishlist
                  ? "border-red-500 text-red-500"
                  : "border-gray-300 hover:border-[#D97706] hover:text-[#D97706]"
                  } disabled:opacity-50`}
              >
                {isWishlisting ? (
                  <span className="inline-block h-5 w-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Heart
                    size={20}
                    className={isInWishlist ? "fill-red-500 text-red-500" : ""}
                  />
                )}
              </button>

              <button
                onClick={handleShare}
                title="Share product"
                className="p-4 border-2 border-gray-300 rounded-full hover:border-[#D97706] hover:text-[#D97706] transition-all"
              >
                <Share2 size={20} />
              </button>

            </div>

            {/* Buy Now */}
            {/* <button className="w-full border-2 border-[#D97706] text-[#D97706] py-4 px-6 rounded-full hover:bg-[#D97706] hover:text-white transition-all font-semibold">
              Buy Now
            </button> */}

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 pt-6">
              <div className="flex items-start gap-3">
                <div className="bg-[#E8F5E9] p-2 rounded-full">
                  <Truck size={20} className="text-[#D97706]" />
                </div>
                <div>
                  <h4 className="font-medium text-[#111827] text-sm">Fast Delivery</h4>
                  <p className="text-xs text-gray-600">2-3 business days</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-[#E8F5E9] p-2 rounded-full">
                  <Shield size={20} className="text-[#D97706]" />
                </div>
                <div>
                  <h4 className="font-medium text-[#111827] text-sm">Quality Assured</h4>
                  <p className="text-xs text-gray-600">100% authentic</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-[#E8F5E9] p-2 rounded-full">
                  <RotateCcw size={20} className="text-[#D97706]" />
                </div>
                <div>
                  <h4 className="font-medium text-[#111827] text-sm">Easy Returns</h4>
                  <p className="text-xs text-gray-600">7-day return policy</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-[#E8F5E9] p-2 rounded-full">
                  <Award size={20} className="text-[#D97706]" />
                </div>
                <div>
                  <h4 className="font-medium text-[#111827] text-sm">Verified Seller</h4>
                  <p className="text-xs text-gray-600">Trusted supplier</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-white rounded-2xl soft-shadow mb-12">
          {/* Tab Headers */}
          <div className="border-b border-gray-200">
            <div className="flex gap-8 px-8">
              <button
                onClick={() => setActiveTab('description')}
                className={`py-4 font-medium transition-colors relative ${activeTab === 'description' ? 'text-[#D97706]' : 'text-gray-600 hover:text-[#D97706]'
                  }`}
              >
                Description
                {activeTab === 'description' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D97706]" />}
              </button>
              <button
                onClick={() => setActiveTab('specifications')}
                className={`py-4 font-medium transition-colors relative ${activeTab === 'specifications' ? 'text-[#D97706]' : 'text-gray-600 hover:text-[#D97706]'
                  }`}
              >
                Specifications
                {activeTab === 'specifications' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D97706]" />}
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`py-4 font-medium transition-colors relative ${activeTab === 'reviews' ? 'text-[#D97706]' : 'text-gray-600 hover:text-[#D97706]'
                  }`}
              >
                Reviews ({reviews.length})
                {activeTab === 'reviews' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D97706]" />}
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <h3 className="text-xl font-medium text-[#111827] mb-4">Product Description</h3>
                <p className="text-gray-700 leading-relaxed mb-4">{product.description}</p>
                <h4 className="text-lg font-medium text-[#111827] mb-3">Features:</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• Premium quality ingredients for professional use</li>
                  <li>• Consistent texture and flavor in every batch</li>
                  <li>• Suitable for all types of baking applications</li>
                  <li>• Long shelf life with proper storage</li>
                  <li>• Food-grade packaging for freshness</li>
                </ul>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div>
                <h3 className="text-xl font-medium text-[#111827] mb-4">Product Specifications</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Category:</span>
                      <span className="font-medium text-[#111827]">{product.category}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Unit:</span>
                      <span className="font-medium text-[#111827]">{product.unit}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Minimum Order:</span>
                      <span className="font-medium text-[#111827]">{product.minOrder} {product.unit}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Stock Status:</span>
                      <span className="font-medium text-[#D97706]">{product.inStock ? 'In Stock' : 'Out of Stock'}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Storage:</span>
                      <span className="font-medium text-[#111827]">Cool, dry place</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Shelf Life:</span>
                      <span className="font-medium text-[#111827]">12 months</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Origin:</span>
                      <span className="font-medium text-[#111827]">India</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Certification:</span>
                      <span className="font-medium text-[#111827]">FSSAI Approved</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <ProductReviews
                reviews={reviews}
                averageRating={averageRating}
                totalReviews={reviews.length}
                onWriteReview={() => setIsReviewFormOpen(true)}
              />

            )}
          </div>
        </div>

        {/* Related Products */}
        {/* <RelatedProducts products={relatedProducts} /> */}

        <ReviewFormModal
          isOpen={isReviewFormOpen}
          onClose={() => setIsReviewFormOpen(false)}
          onSubmit={handleReviewSubmit}
          productName={product.name}
        />
      </div>
    </div>
  );
}

