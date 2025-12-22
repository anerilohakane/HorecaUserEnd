// 'use client';

// import { CartItem as CartItemType } from '@/lib/types/cart';
// import { Minus, Plus, Trash2 } from 'lucide-react';
// import Image from 'next/image';
// import Link from 'next/link';

// interface CartItemProps {
//   item: CartItemType;
//   onUpdateQuantity: (productId: number, quantity: number) => void;
//   onRemove: (productId: number) => void;
// }

// export default function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
//   const { product, quantity } = item;

//   const price = product.discount
//     ? product.price - (product.price * product.discount / 100)
//     : product.price;

//   const itemTotal = price * quantity;

//   const handleIncrement = () => {
//     onUpdateQuantity(product.id, quantity + 1);
//   };

//   const handleDecrement = () => {
//     if (quantity > product.minOrder) {
//       onUpdateQuantity(product.id, quantity - 1);
//     }
//   };

//   return (
//     <div className="bg-white rounded-2xl soft-shadow p-6 flex gap-6">
//       {/* Product Image */}
//       <div className="relative w-32 h-32 bg-[#F5F5F5] rounded-xl overflow-hidden flex-shrink-0">
//         <Link href={`/products/${product.id}`}>
//           <Image
//             src={`/images/products/${product.image}`}
//             alt={product.name}
//             fill
//             className="object-cover hover:scale-105 transition-transform"
//           />
//         </Link>
//       </div>

//       {/* Product Details */}
//       <div className="flex-1 flex flex-col justify-between">
//         <div>
//           {/* Product Name & Category */}
//           <div className="mb-2">
//             <p className="text-xs text-gray-500 mb-1">{product.category}</p>
//             <Link href={`/products/${product.id}`}>
//               <h3 className="font-semibold text-[#111827] hover:text-[#D97706] transition-colors">
//                 {product.name}
//               </h3>
//             </Link>
//           </div>

//           {/* Price */}
//           <div className="flex items-baseline gap-2 mb-3">
//             <span className="text-lg font-bold text-[#111827]">
//               ₹{price.toFixed(0)}
//             </span>
//             {product.discount && (
//               <>
//                 <span className="text-sm text-gray-400 line-through">
//                   ₹{product.price}
//                 </span>
//                 <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
//                   -{product.discount}%
//                 </span>
//               </>
//             )}
//             <span className="text-sm text-gray-500">/ {product.unit}</span>
//           </div>

//           {/* Min Order Notice */}
//           {quantity < product.minOrder && (
//             <p className="text-xs text-red-500 mb-2">
//               Minimum order: {product.minOrder} {product.unit}
//             </p>
//           )}
//         </div>

//         {/* Quantity Controls & Remove */}
//         <div className="flex items-center justify-between">
//           {/* Quantity Selector */}
//           <div className="flex items-center border border-gray-300 rounded-full">
//             <button
//               onClick={handleDecrement}
//               disabled={quantity <= product.minOrder}
//               className={`p-2 hover:bg-gray-100 transition-colors rounded-l-full ${
//                 quantity <= product.minOrder ? 'opacity-50 cursor-not-allowed' : ''
//               }`}
//             >
//               <Minus size={16} />
//             </button>
//             <span className="px-4 font-semibold text-sm">{quantity}</span>
//             <button
//               onClick={handleIncrement}
//               className="p-2 hover:bg-gray-100 transition-colors rounded-r-full"
//             >
//               <Plus size={16} />
//             </button>
//           </div>

//           {/* Item Total */}
//           <div className="text-right">
//             <p className="text-lg font-bold text-[#111827]">
//               ₹{itemTotal.toFixed(0)}
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Remove Button */}
//       <div>
//         <button
//           onClick={() => onRemove(product.id)}
//           className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
//           aria-label="Remove item"
//         >
//           <Trash2 size={20} />
//         </button>
//       </div>
//     </div>
//   );
// }


// 'use client';

// import { CartItem as CartItemType } from '@/lib/types/cart';
// import { Minus, Plus, Trash2 } from 'lucide-react';
// import Image from 'next/image';
// import Link from 'next/link';

// interface CartItemProps {
//   item: CartItemType;
//   onUpdateQuantity: (productId: number, quantity: number) => void;
//   onRemove: (productId: number) => void;
// }

// export default function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
//   const { product, quantity } = item;

//   // --- Helper: robust image src resolver ---
//   const getImageSrc = (img: any) => {
//   // 1) No image? return placeholder
//   if (!img) return '/images/placeholder-product.png';

//   // 2) If it's an object with a 'url' field
//   if (typeof img === 'object') {
//     if (typeof img.url === 'string') return normalizeUrl(img.url);
//     if (typeof img.path === 'string') return normalizeUrl(img.path);

//     // If formats exist, use first available safe url (only if formats is real)
//     try {
//       const formats = img.formats;
//       if (formats && typeof formats === 'object') {
//         const found = Object.values(formats).find(
//           (f: any) => f && typeof f.url === 'string'
//         );
//         if (found) return normalizeUrl(found.url);
//       }
//     } catch {
//       // ignore failures
//     }

//     return '/images/placeholder-product.png';
//   }

//   // 3) String value (URL, filename, path)
//   if (typeof img === 'string') {
//     return normalizeUrl(img);
//   }

//   return '/images/placeholder-product.png';
// };

// const normalizeUrl = (url: string) => {
//   const u = url.trim();

//   // Absolute URL
//   if (/^https?:\/\//i.test(u)) return u;

//   // Already root-relative path
//   if (u.startsWith('/')) return u;

//   // If it contains folder e.g. uploads/image.jpg → treat as root-relative
//   if (u.includes('/')) return `/${u.replace(/^\/+/, '')}`;

//   // If plain filename → use local folder
//   return `/images/products/${u}`;
// };


//   const normalizeStringUrl = (s: string) => {
//     const trimmed = s.trim();
//     // absolute http(s) URL -> return as-is
//     if (/^https?:\/\//i.test(trimmed)) return trimmed;
//     // root-relative path -> return as-is
//     if (trimmed.startsWith('/')) return trimmed;
//     // already inside images/products (filename or partial path) -> assume public folder
//     // if the API returns something like 'uploads/abc.jpg' we still want /uploads/abc.jpg OR /images/products/abc.jpg
//     // Prefer using it as-is if contains a slash, else assume filename inside /images/products/
//     if (trimmed.includes('/')) {
//       // if it's a path without protocol and not starting with '/', make it root-relative
//       return `/${trimmed.replace(/^\/+/, '')}`;
//     }
//     return `/images/products/${trimmed}`;
//   };

//   // price calculation (preserve your logic)
//   const price = product.discount
//     ? product.price - (product.price * product.discount) / 100
//     : product.price;

//   const itemTotal = price * quantity;

//   const handleIncrement = () => {
//     onUpdateQuantity(product.id, quantity + 1);
//   };

//   const handleDecrement = () => {
//     if (quantity > (product.minOrder ?? 1)) {
//       onUpdateQuantity(product.id, quantity - 1);
//     }
//   };

//   const imgSrc = getImageSrc(product.image);

//   return (
//     <div className="bg-white rounded-2xl soft-shadow p-6 flex gap-6">
//       {/* Product Image */}
//       <div className="relative w-32 h-32 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
//   <Link href={`/products/${product.id}`}>
//     {/* This works 100% with any URL – local or external */}
//     <Image
//       src={imgSrc || '/images/placeholder-product.png'}
//       alt={product.name || 'Product'}
//       fill
//       className="object-cover hover:scale-105 transition-transform duration-300"
//       sizes="128px"
//       unoptimized={true} // Critical for dynamic/external images
//       onError={(e) => {
//         const target = e.target as HTMLImageElement;
//         target.src = '/images/placeholder-product.png'; // Fallback on error
//       }}
//     />
//   </Link>
// </div>

//       {/* Product Details */}
//       <div className="flex-1 flex flex-col justify-between">
//         <div>
//           {/* Product Name & Category */}
//           <div className="mb-2">
//             <p className="text-xs text-gray-500 mb-1">{product.category}</p>
//             <Link href={`/products/${product.id}`}>
//               <h3 className="font-semibold text-[#111827] hover:text-[#D97706] transition-colors">
//                 {product.name}
//               </h3>
//             </Link>
//           </div>

//           {/* Price */}
//           <div className="flex items-baseline gap-2 mb-3">
//             <span className="text-lg font-bold text-[#111827]">₹{price.toFixed(0)}</span>
//             {product.discount && (
//               <>
//                 <span className="text-sm text-gray-400 line-through">₹{product.price}</span>
//                 <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">-{product.discount}%</span>
//               </>
//             )}
//             <span className="text-sm text-gray-500">/ {product.unit}</span>
//           </div>

//           {/* Min Order Notice */}
//           {quantity < (product.minOrder ?? 1) && (
//             <p className="text-xs text-red-500 mb-2">
//               Minimum order: {product.minOrder ?? 1} {product.unit}
//             </p>
//           )}
//         </div>

//         {/* Quantity Controls & Remove */}
//         <div className="flex items-center justify-between">
//           {/* Quantity Selector */}
//           <div className="flex items-center border border-gray-300 rounded-full">
//             <button
//               onClick={handleDecrement}
//               disabled={quantity <= (product.minOrder ?? 1)}
//               className={`p-2 hover:bg-gray-100 transition-colors rounded-l-full ${
//                 quantity <= (product.minOrder ?? 1) ? 'opacity-50 cursor-not-allowed' : ''
//               }`}
//             >
//               <Minus size={16} />
//             </button>
//             <span className="px-4 font-semibold text-sm">{quantity}</span>
//             <button onClick={handleIncrement} className="p-2 hover:bg-gray-100 transition-colors rounded-r-full">
//               <Plus size={16} />
//             </button>
//           </div>

//           {/* Item Total */}
//           <div className="text-right">
//             <p className="text-lg font-bold text-[#111827]">₹{itemTotal.toFixed(0)}</p>
//           </div>
//         </div>
//       </div>

//       {/* Remove Button */}
//       <div>
//         <button
//           onClick={() => onRemove(product.id)}
//           className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
//           aria-label="Remove item"
//         >
//           <Trash2 size={20} />
//         </button>
//       </div>
//     </div>
//   );
// }



// 'use client';

// import React, { useMemo, useState } from 'react';
// import { CartItem as CartItemType } from '@/lib/types/cart';
// import { Minus, Plus, Trash2 } from 'lucide-react';
// import Image from 'next/image';
// import Link from 'next/link';

// interface CartItemProps {
//   item: CartItemType;
//   onUpdateQuantity: (productId: string | number, quantity: number) => void;
//   onRemove: (productId: string | number) => void;
//   useUnoptimizedImages?: boolean;
// }

// export default function CartItem({
//   item,
//   onUpdateQuantity,
//   onRemove,
//   useUnoptimizedImages = false,
// }: CartItemProps) {
//   // destructure incoming item safely
//   const rawProduct: any = item?.product ?? null;
//   const rawQuantity: any = item?.quantity ?? 0;

//   // helpers to coerce safely
//   const safeNumber = (v: any, fallback = 0) => {
//     if (typeof v === 'number' && !Number.isNaN(v)) return v;
//     if (typeof v === 'string' && v.trim() !== '') {
//       const n = Number(v);
//       return Number.isNaN(n) ? fallback : n;
//     }
//     return fallback;
//   };

//   const safeString = (v: any, fallback = '') => {
//     if (typeof v === 'string') return v;
//     if (typeof v === 'number') return String(v);
//     return fallback;
//   };

//   // resolve id when rawProduct could be primitive or object
//   const resolvedId = (() => {
//     if (!rawProduct) return '';
//     if (typeof rawProduct === 'string' || typeof rawProduct === 'number') return String(rawProduct);
//     return safeString(rawProduct.id ?? rawProduct._id ?? '');
//   })();

//   // normalized product shape with safe defaults
//   const product = {
//     id: resolvedId,
//     name: safeString(rawProduct?.name ?? rawProduct?.title, 'Product'),
//     image: (rawProduct && (rawProduct.image ?? rawProduct.photo)) ?? null,
//     price: safeNumber(rawProduct?.price, 0),
//     discount: safeNumber(rawProduct?.discount, 0),
//     unit: safeString(rawProduct?.unit ?? rawProduct?.uom, ''),
//     minOrder: Math.max(1, safeNumber(rawProduct?.minOrder, 1)),
//     category: safeString(rawProduct?.category, ''),
//   };

//   const quantity = Math.max(0, safeNumber(rawQuantity, 0));

//   // --------------------
//   // Image helpers
//   // --------------------
//   const normalizeUrl = (url: string) => {
//     const u = (url || '').trim();
//     if (!u) return '/images/placeholder-product.png';
//     if (/^https?:\/\//i.test(u)) return u; // absolute URL
//     if (u.startsWith('/')) return u; // root-relative
//     if (u.includes('/')) return `/${u.replace(/^\/+/, '')}`; // path -> root-relative
//     return `/images/products/${u}`; // filename -> public folder
//   };

//   const getImageSrc = (img: any) => {
//     if (!img) return '/images/placeholder-product.png';

//     // object shapes
//     if (typeof img === 'object') {
//       if (typeof img.url === 'string' && img.url.trim()) return normalizeUrl(img.url);
//       if (typeof img.path === 'string' && img.path.trim()) return normalizeUrl(img.path);

//       // formats: { thumbnail: { url } } or similar
//       try {
//         const formats = (img as any).formats;
//         if (formats && typeof formats === 'object') {
//           for (const f of Object.values(formats)) {
//             if (f && typeof (f as any).url === 'string' && (f as any).url.trim()) {
//               return normalizeUrl((f as any).url);
//             }
//           }
//         }
//       } catch {
//         // ignore
//       }

//       return '/images/placeholder-product.png';
//     }

//     // string values
//     if (typeof img === 'string') return normalizeUrl(img);

//     return '/images/placeholder-product.png';
//   };

//   const [imgFailed, setImgFailed] = useState(false);
//   const imgSrc = useMemo(
//     () => (imgFailed ? '/images/placeholder-product.png' : getImageSrc(product.image)),
//     [product.image, imgFailed]
//   );

//   // --------------------
//   // Pricing & handlers
//   // --------------------
//   const price = product.discount
//     ? product.price - (product.price * product.discount) / 100
//     : product.price;

//   const itemTotal = price * Math.max(0, quantity);

//   const handleIncrement = () => onUpdateQuantity(product.id, quantity + 1);
//   const handleDecrement = () => {
//     if (quantity > (product.minOrder ?? 1)) onUpdateQuantity(product.id, quantity - 1);
//   };
//   const handleRemove = () => onRemove(product.id);

//   // Render
//   return (
//     <div className="bg-white rounded-2xl soft-shadow p-6 flex gap-6">
//       {/* Product Image */}
//       <div className="relative w-32 h-32 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
//         <Link href={`/products/${String(product.id)}`} prefetch={false} className="block w-full h-full">
//           <Image
//             src={imgSrc}
//             alt={product.name || 'Product'}
//             fill
//             className="object-cover hover:scale-105 transition-transform duration-300"
//             sizes="128px"
//             unoptimized={useUnoptimizedImages}
//             onError={() => setImgFailed(true)}
//           />
//         </Link>
//       </div>

//       {/* Product Details */}
//       <div className="flex-1 flex flex-col justify-between">
//         <div>
//           <div className="mb-2">
//             <p className="text-xs text-gray-500 mb-1">{product.category}</p>
//             <Link href={`/products/${String(product.id)}`} prefetch={false} className="font-semibold text-[#111827] hover:text-[#D97706] transition-colors">
//               {product.name}
//             </Link>
//           </div>

//           <div className="flex items-baseline gap-2 mb-3">
//             <span className="text-lg font-bold text-[#111827]">₹{price.toFixed(0)}</span>
//             {product.discount ? (
//               <>
//                 <span className="text-sm text-gray-400 line-through">₹{product.price.toFixed(0)}</span>
//                 <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">-{product.discount}%</span>
//               </>
//             ) : null}
//             <span className="text-sm text-gray-500">/ {product.unit || 'unit'}</span>
//           </div>

//           {quantity < (product.minOrder ?? 1) && (
//             <p className="text-xs text-red-500 mb-2">
//               Minimum order: {product.minOrder ?? 1} {product.unit ?? ''}
//             </p>
//           )}
//         </div>

//         <div className="flex items-center justify-between">
//           <div className="flex items-center border border-gray-300 rounded-full">
//             <button
//               onClick={handleDecrement}
//               disabled={quantity <= (product.minOrder ?? 1)}
//               className={`p-2 hover:bg-gray-100 transition-colors rounded-l-full ${
//                 quantity <= (product.minOrder ?? 1) ? 'opacity-50 cursor-not-allowed' : ''
//               }`}
//               aria-label="Decrease quantity"
//             >
//               <Minus size={16} />
//             </button>

//             <span className="px-4 font-semibold text-sm">{quantity}</span>

//             <button
//               onClick={handleIncrement}
//               className="p-2 hover:bg-gray-100 transition-colors rounded-r-full"
//               aria-label="Increase quantity"
//             >
//               <Plus size={16} />
//             </button>
//           </div>

//           <div className="text-right">
//             <p className="text-lg font-bold text-[#111827]">₹{itemTotal.toFixed(0)}</p>
//           </div>
//         </div>
//       </div>

//       {/* Remove Button */}
//       <div>
//         <button
//           onClick={handleRemove}
//           className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
//           aria-label="Remove item"
//         >
//           <Trash2 size={20} />
//         </button>
//       </div>
//     </div>
//   );
// }


'use client';

import React, { useMemo, useState } from 'react';
import { CartItem as CartItemType } from '@/lib/types/cart';
import { Minus, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';

// interface CartItemProps {
//   item: CartItemType;
//   onUpdateQuantity: (productId: number, quantity: number) => void;
//   onRemove: (productId: number) => void;
//   useUnoptimizedImages?: boolean;
// }

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (productId: string, quantity: number) => Promise<void>;
  onRemove: (productId: string) => Promise<void>;
  useUnoptimizedImages?: boolean;
}


export default function CartItem({
  item,
  onUpdateQuantity,
  onRemove,
  useUnoptimizedImages = false,
}: CartItemProps) {

  console.log(item);
  
  // Ensure we have valid data
  if (!item) return null;

  const rawProduct = item.product;
  const rawQuantity = item.quantity;

  // State for custom confirmation modal
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showMinOrderModal, setShowMinOrderModal] = useState(false);

  // Safe value extraction
  const safeNumber = (value: any, fallback = 0): number => {
    if (typeof value === 'number' && !isNaN(value)) return value;
    const num = Number(value);
    return isNaN(num) ? fallback : num;
  };

  const safeString = (value: any, fallback = ''): string => {
    if (typeof value === 'string') return value.trim();
    if (typeof value === 'number') return String(value);
    if (typeof value === 'boolean') return String(value);
    return fallback;
  };

  // Get product ID
  // const getProductId = (): number => {
  //   if (!rawProduct) return 0;

  //   if (typeof rawProduct === 'number') return rawProduct;
  //   if (typeof rawProduct === 'string') return Number(rawProduct) || 0;

  //   if (typeof rawProduct === 'object') {
  //     const id = (rawProduct as any).id ||
  //       (rawProduct as any)._id ||
  //       (rawProduct as any).productId;

  //       console.log(id);
  //       console.log(typeof(id));
        
        
  //     // if (typeof id === 'string') return Number(id) || 0;
  //     // if (typeof id === 'number') return id;
  //     return id;
  //   }

  //   return 0;
  // };

  // const productId = getProductId();

  // const rawProduct = item.product;

  const productId: string =
  typeof rawProduct === 'object' && rawProduct !== null
    ? String((rawProduct as any).id)
    : '';


  // Normalize product data
  const product = {
    id: productId,
    name: safeString(
      (rawProduct as any)?.name || (rawProduct as any)?.title ||
      (rawProduct as any)?.productName || 'Product'
    ),
    image: (rawProduct as any)?.image || (rawProduct as any)?.photo ||
      (rawProduct as any)?.thumbnail || null,
    price: safeNumber((rawProduct as any)?.price || (rawProduct as any)?.unitPrice, 0),
    discount: safeNumber((rawProduct as any)?.discount || (rawProduct as any)?.discountPercentage, 0),
    unit: safeString((rawProduct as any)?.unit || (rawProduct as any)?.uom || 'unit'),
    minOrder: Math.max(1, safeNumber((rawProduct as any)?.minOrder || (rawProduct as any)?.minimumOrder, 1)),
    category: safeString((rawProduct as any)?.category || (rawProduct as any)?.type, ''),
  };


  console.log(product);
  
  const quantity = Math.max(1, safeNumber(rawQuantity, 1));

  // Image handling
  const [imageError, setImageError] = useState(false);

  const getImageSrc = (): string => {
    if (imageError) return '/images/placeholder-product.png';

    if (!product.image) return '/images/placeholder-product.png';

    // Handle string URLs
    if (typeof product.image === 'string') {
      const imgUrl = product.image.trim();
      if (!imgUrl) return '/images/placeholder-product.png';

      if (imgUrl.startsWith('http://') || imgUrl.startsWith('https://')) {
        return imgUrl;
      }

      if (imgUrl.startsWith('/')) {
        return imgUrl;
      }

      return `/images/products/${imgUrl}`;
    }

    // Handle image objects
    if (typeof product.image === 'object') {
      const url = (product.image as any)?.url || (product.image as any)?.src || '';
      if (url && typeof url === 'string') {
        return getImageSrc(); // Recursively process the string URL
      }
    }

    return '/images/placeholder-product.png';
  };

  const imageSrc = useMemo(() => getImageSrc(), [product.image, imageError]);

  // Pricing calculations
  const price = product.discount > 0
    ? product.price - (product.price * product.discount / 100)
    : product.price;

  const itemTotal = price * quantity;

  // Event handlers
  const handleIncrement = (productId:any) => {
    console.log('Incrementing quantity for product ID:', productId);
    
    // onUpdateQuantity(productId, quantity + 1);

    onUpdateQuantity(productId, quantity + 1);
  };

  const handleDecrement = () => {
    const newQuantity = quantity - 1;
    if (newQuantity >= product.minOrder) {
      onUpdateQuantity(productId, newQuantity);
    } else if (newQuantity < product.minOrder && newQuantity > 0) {
      // Quantity below minimum - show custom modal to remove
      setShowMinOrderModal(true);
    }
  };

  const handleRemoveClick = () => {
    // Show custom confirmation modal
    setShowDeleteConfirm(true);
  };

  const confirmRemove = () => {
    onRemove(productId);
    setShowDeleteConfirm(false);
    toast.success(`Removed ${product.name} from cart`);
  };

  const confirmRemoveFromMinOrder = () => {
    onRemove(productId);
    setShowMinOrderModal(false);
    toast.success(`Removed ${product.name} from cart`);
  };

  const cancelRemove = () => {
    setShowDeleteConfirm(false);
    setShowMinOrderModal(false);
  };

  // Quick remove without confirmation
  const handleQuickRemove = () => {
    onRemove(productId);
    toast.success(`Removed ${product.name} from cart`);
  };

  return (
    <>
      {/* Custom Confirmation Modal for Delete */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Remove Item
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure to remove <span className="font-medium">"{product.name}"</span> from your cart?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={cancelRemove}
                  className="flex-1 py-2.5 px-4 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmRemove}
                  className="flex-1 py-2.5 px-4 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors font-medium"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Modal for Minimum Order */}
      {showMinOrderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
                <Minus className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Minimum Order Quantity
              </h3>
              <p className="text-gray-600 mb-4">
                The minimum order for <span className="font-medium">"{product.name}"</span> is {product.minOrder} {product.unit}.
              </p>
              <p className="text-gray-600 mb-6">
                Would you like to remove this item from your cart?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={cancelRemove}
                  className="flex-1 py-2.5 px-4 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmRemoveFromMinOrder}
                  className="flex-1 py-2.5 px-4 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors font-medium"
                >
                  Remove Item
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart Item */}
      <div className="bg-white rounded-2xl soft-shadow p-6 flex gap-6">
        {/* Product Image */}
        <div className="relative w-32 h-32 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
          <Link
            href={`/products/${productId}`}
            prefetch={false}
            className="block w-full h-full"
          >
            <Image
              src={imageSrc}
              alt={product.name}
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
              sizes="128px"
              unoptimized={useUnoptimizedImages}
              onError={() => setImageError(true)}
              priority={false}
            />
          </Link>
        </div>

        {/* Product Details */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="mb-2">
              {product.category && (
                <p className="text-xs text-gray-500 mb-1">{product.category}</p>
              )}
              <Link
                href={`/products/${product.id}`}
                prefetch={false}
                className="font-semibold text-[#111827] hover:text-[#D97706] transition-colors line-clamp-2"
              >
                {product.name}
              </Link>
            </div>

            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-lg font-bold text-[#111827]">
                ₹{price.toFixed(0)}
              </span>
              {product.discount > 0 && (
                <>
                  <span className="text-sm text-gray-400 line-through">
                    ₹{product.price.toFixed(0)}
                  </span>
                  <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
                    -{product.discount}%
                  </span>
                </>
              )}
              <span className="text-sm text-gray-500">/ {product.unit}</span>
            </div>

            {quantity < product.minOrder && (
              <p className="text-xs text-red-500 mb-2">
                Minimum order: {product.minOrder} {product.unit}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center border border-gray-300 rounded-full">
              <button
                type="button"
                onClick={handleDecrement}
                disabled={quantity <= product.minOrder}
                className={`p-2 hover:bg-gray-100 transition-colors rounded-l-full ${quantity <= product.minOrder
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:text-red-500'
                  }`}
                aria-label="Decrease quantity"
              >
                <Minus size={16} />
              </button>

              <span className="px-4 font-semibold text-sm min-w-[40px] text-center">
                {quantity}
              </span>

              <button
                type="button"
                onClick={() => handleIncrement(product.id)}
                className="p-2 hover:bg-gray-100 hover:text-green-600 transition-colors rounded-r-full"
                aria-label="Increase quantity"
              >
                <Plus size={16} />
              </button>
            </div>

            <div className="text-right">
              <p className="text-lg font-bold text-[#111827]">
                ₹{itemTotal.toFixed(0)}
              </p>
            </div>
          </div>
        </div>

        {/* Remove Button */}
        <div className="flex-shrink-0">
          <button
            type="button"
            onClick={handleRemoveClick} // With custom confirmation modal
            // onClick={handleQuickRemove} // Without confirmation
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all group"
            aria-label={`Remove ${product.name} from cart`}
          >
            <Trash2 size={20} className="group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    </>
  );
}