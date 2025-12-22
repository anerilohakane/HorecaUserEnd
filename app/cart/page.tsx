// 'use client';

// import { useCart } from '@/lib/context/CartContext';
// import Header from '@/components/Header';
// import Footer from '@/components/Footer';
// import CartItem from '@/components/cart/CartItem';
// import CartSummary from '@/components/cart/CartSummary';
// import EmptyCart from '@/components/cart/EmptyCart';
// import { Trash2 } from 'lucide-react';
// import Link from 'next/link';
// import { useEffect } from 'react';

// export default function CartPage() {
//   const { items, updateQuantity, removeItem, clearCart, itemCount, subtotal } = useCart();

//   // useEffect(() => {

//   //   console.log('🛒 Cart Items Updated:', items);
//   // }, [items]);
//   console.log(items);
  
//   return (
//     <div className="min-h-screen flex flex-col">
//       <Header />
      
//       <main className="flex-grow bg-[#FAFAF7] py-8">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

//           {/* Breadcrumb */}
//           <div className="mb-6">
//             <nav className="flex items-center gap-2 text-sm text-gray-600">
//               <Link href="/" className="hover:text-[#D97706] transition-colors">Home</Link>
//               <span>/</span>
//               <span className="text-[#111827] font-medium">Shopping Cart</span>
//             </nav>
//           </div>

//           {/* Page Header */}
//           <div className="mb-8 flex items-center justify-between">
//             <div>
//               <h1 className="text-4xl font-light text-[#111827] mb-2">Shopping Cart</h1>
//               <p className="text-gray-600">
//                 {itemCount > 0 ? `${itemCount} ${itemCount === 1 ? 'item' : 'items'} in your cart` : 'Your cart is empty'}
//               </p>
//             </div>

//             {items.length > 0 && (
//               <button
//                 onClick={clearCart}
//                 className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 rounded-full transition-all text-sm font-medium"
//               >
//                 <Trash2 size={16} />
//                 Clear Cart
//               </button>
//             )}
//           </div>

//           {/* Cart Content */}
//           {items.length === 0 ? (
//             <EmptyCart />
//           ) : (
//             <div className="grid lg:grid-cols-3 gap-8">

//               {/* Cart Items List */}
//               <div className="lg:col-span-2 space-y-4">
//                 {items.map((item) => (
//                   <CartItem
//                     key={item?.productId}  // 🔥 FIXED KEY
//                     item={item}
//                     onUpdateQuantity={updateQuantity}
//                     onRemove={removeItem}
//                   />
//                 ))}

//                 {/* Mobile Summary */}
//                 <div className="lg:hidden mt-6">
//                   <CartSummary subtotal={subtotal} itemCount={itemCount} />
//                 </div>
//               </div>

//               {/* Desktop Summary */}
//               <div className="hidden lg:block">
//                 <CartSummary subtotal={subtotal} itemCount={itemCount} />
//               </div>
//             </div>
//           )}

//           {/* Recommendation Section */}
//           {items.length > 0 && (
//             <div className="mt-12 bg-white rounded-2xl soft-shadow p-8">
//               <h3 className="text-xl font-semibold text-[#111827] mb-4">You might also like</h3>
//               <p className="text-gray-600 text-sm">
//                 Customers who bought these items also purchased related products.
//                 <Link href="/products" className="text-[#D97706] hover:text-[#7CB342] ml-1 font-medium">
//                   View recommendations →
//                 </Link>
//               </p>
//             </div>
//           )}

//         </div>
//       </main>

//       <Footer />
//     </div>
//   );
// }


"use client";

import { useCart } from '@/lib/context/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartItem from '@/components/cart/CartItem';
import CartSummary from '@/components/cart/CartSummary';
import EmptyCart from '@/components/cart/EmptyCart';
import { Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, itemCount, subtotal } = useCart();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow bg-[#FAFAF7] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-6">
            <nav className="flex items-center gap-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-[#D97706] transition-colors">Home</Link>
              <span>/</span>
              <span className="text-[#111827] font-medium">Shopping Cart</span>
            </nav>
          </div>

          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-light text-[#111827] mb-2">Shopping Cart</h1>
              <p className="text-gray-600">
                {itemCount > 0
                  ? `${itemCount} ${itemCount === 1 ? "item" : "items"} in your cart`
                  : "Your cart is empty"}
              </p>
            </div>

            {items.length > 0 && (
              <button
                onClick={clearCart}
                className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 rounded-full transition-all text-sm font-medium"
              >
                <Trash2 size={16} />
                Clear Cart
              </button>
            )}
          </div>

          {/* Cart Content */}
          {items.length === 0 ? (
            <EmptyCart />
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <CartItem
                    key={item.productId}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeItem}
                  />
                ))}

                {/* Mobile Summary */}
                <div className="lg:hidden mt-6">
                  <CartSummary subtotal={subtotal} itemCount={itemCount} />
                </div>
              </div>

              {/* Desktop Summary */}
              <div className="hidden lg:block">
                <CartSummary subtotal={subtotal} itemCount={itemCount} />
              </div>
            </div>
          )}

          {/* Recommendations */}
          {items.length > 0 && (
            <div className="mt-12 bg-white rounded-2xl soft-shadow p-8">
              <h3 className="text-xl font-semibold text-[#111827] mb-4">You might also like</h3>
              <p className="text-gray-600 text-sm">
                Customers who bought these items also purchased related products.
                <Link href="/products" className="text-[#D97706] ml-1 font-medium">View recommendations →</Link>
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

