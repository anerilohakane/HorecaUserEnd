// 'use client';

// import { ShippingAddress, PaymentMethod as PaymentMethodType } from '@/lib/types/checkout';
// import { CartItem } from '@/lib/types/cart';
// import { MapPin, CreditCard, Package, Edit2 } from 'lucide-react';
// import Image from 'next/image';

// interface OrderReviewProps {
//   shippingAddress: ShippingAddress;
//   paymentMethod: PaymentMethodType;
//   items: CartItem[];
//   subtotal: number;
//   discount: number;
//   tax: number;
//   shipping: number;
//   total: number;
//   couponCode?: string;
//   onEditShipping: () => void;
//   onEditPayment: () => void;
//   onPlaceOrder: () => void;
//   isPlacingOrder: boolean;
// }

// export default function OrderReview({
//   shippingAddress,
//   paymentMethod,
//   items,
//   subtotal,
//   discount,
//   tax,
//   shipping,
//   total,
//   couponCode,
//   onEditShipping,
//   onEditPayment,
//   onPlaceOrder,
//   isPlacingOrder,
// }: OrderReviewProps) {
//   const paymentMethodNames = {
//     cod: 'Cash on Delivery',
//     upi: 'UPI Payment',
//     card: 'Credit/Debit Card',
//     netbanking: 'Net Banking',
//   };

//   return (
//     <div className="space-y-6">
//       {/* Shipping Address */}
//       <div className="bg-white rounded-2xl soft-shadow p-6">
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-xl font-semibold text-[#111827] flex items-center gap-2">
//             <MapPin size={24} className="text-[#D97706]" />
//             Shipping Address
//           </h2>
//           <button
//             onClick={onEditShipping}
//             className="text-[#D97706] hover:text-[#B45309] font-medium text-sm flex items-center gap-1"
//           >
//             <Edit2 size={16} />
//             Edit
//           </button>
//         </div>
//         <div className="bg-[#FAFAF7] rounded-xl p-4">
//           <p className="font-semibold text-[#111827] mb-1">{shippingAddress.fullName}</p>
//           <p className="text-sm text-gray-700">{shippingAddress.addressLine1}</p>
//           {shippingAddress.addressLine2 && (
//             <p className="text-sm text-gray-700">{shippingAddress.addressLine2}</p>
//           )}
//           <p className="text-sm text-gray-700">
//             {shippingAddress.city}, {shippingAddress.state} {shippingAddress.pincode}
//           </p>
//           <p className="text-sm text-gray-700 mt-2">
//             <span className="font-medium">Email:</span> {shippingAddress.email}
//           </p>
//           <p className="text-sm text-gray-700">
//             <span className="font-medium">Phone:</span> +91 {shippingAddress.phone}
//           </p>
//         </div>
//       </div>

//       {/* Payment Method */}
//       <div className="bg-white rounded-2xl soft-shadow p-6">
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-xl font-semibold text-[#111827] flex items-center gap-2">
//             <CreditCard size={24} className="text-[#D97706]" />
//             Payment Method
//           </h2>
//           <button
//             onClick={onEditPayment}
//             className="text-[#D97706] hover:text-[#B45309] font-medium text-sm flex items-center gap-1"
//           >
//             <Edit2 size={16} />
//             Edit
//           </button>
//         </div>
//         <div className="bg-[#FAFAF7] rounded-xl p-4">
//           <p className="font-semibold text-[#111827]">
//             {paymentMethodNames[paymentMethod]}
//           </p>
//           {paymentMethod === 'cod' && (
//             <p className="text-sm text-gray-600 mt-1">
//               Pay with cash when you receive your order
//             </p>
//           )}
//         </div>
//       </div>

//       {/* Order Items */}
//       <div className="bg-white rounded-2xl soft-shadow p-6">
//         <h2 className="text-xl font-semibold text-[#111827] mb-4 flex items-center gap-2">
//           <Package size={24} className="text-[#D97706]" />
//           Order Items ({items.length})
//         </h2>
//         <div className="space-y-4">
//           {items.map((item) => {
//             const price = item.product.discount
//               ? item.product.price - (item.product.price * item.product.discount / 100)
//               : item.product.price;
//             const itemTotal = price * item.quantity;

//             return (
//               <div key={item.product.id} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
//                 {/* Product Image */}
//                 <div className="relative w-20 h-20 bg-[#F5F5F5] rounded-xl overflow-hidden flex-shrink-0">
//                   <Image
//                     src={
//   item.product.image.startsWith('http')
//     ? item.product.image
//     : `/images/products/${item.product.image}`
// }

//                     alt={item.product.name}
//                     fill
//                     className="object-cover"
//                   />
//                 </div>

//                 {/* Product Info */}
//                 <div className="flex-1">
//                   <h3 className="font-semibold text-[#111827] mb-1 text-sm">
//                     {item.product.name}
//                   </h3>
//                   <p className="text-xs text-gray-500 mb-2">
//                     {item.product.category}
//                   </p>
//                   <div className="flex items-center gap-3">
//                     <span className="text-sm text-gray-600">
//                       Qty: {item.quantity}
//                     </span>
//                     <span className="text-sm text-gray-600">
//                       ₹{price.toFixed(0)} / {item.product.unit}
//                     </span>
//                   </div>
//                 </div>

//                 {/* Item Total */}
//                 <div className="text-right">
//                   <p className="font-bold text-[#111827]">
//                     ₹{itemTotal.toFixed(0)}
//                   </p>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       {/* Order Summary */}
//       <div className="bg-white rounded-2xl soft-shadow p-6">
//         <h2 className="text-xl font-semibold text-[#111827] mb-4">
//           Order Summary
//         </h2>
//         <div className="space-y-3">
//           <div className="flex justify-between text-sm">
//             <span className="text-gray-600">Subtotal</span>
//             <span className="font-semibold text-[#111827]">₹{subtotal.toFixed(2)}</span>
//           </div>

//           {discount > 0 && (
//             <div className="flex justify-between text-sm">
//               <span className="text-[#D97706]">
//                 Discount {couponCode && `(${couponCode})`}
//               </span>
//               <span className="font-semibold text-[#D97706]">-₹{discount.toFixed(2)}</span>
//             </div>
//           )}

//           <div className="flex justify-between text-sm">
//             <span className="text-gray-600">Tax (GST 18%)</span>
//             <span className="font-semibold text-[#111827]">₹{tax.toFixed(2)}</span>
//           </div>

//           <div className="flex justify-between text-sm">
//             <span className="text-gray-600">Shipping</span>
//             {shipping === 0 ? (
//               <span className="font-semibold text-[#D97706]">FREE</span>
//             ) : (
//               <span className="font-semibold text-[#111827]">₹{shipping.toFixed(2)}</span>
//             )}
//           </div>

//           <div className="pt-3 border-t border-gray-200">
//             <div className="flex justify-between items-baseline">
//               <span className="text-lg font-semibold text-[#111827]">Total</span>
//               <div className="text-right">
//                 <span className="text-2xl font-bold text-[#D97706]">
//                   ₹{total.toFixed(2)}
//                 </span>
//                 <p className="text-xs text-gray-500">inclusive of all taxes</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Place Order Button */}
//       <button
//         onClick={onPlaceOrder}
//         disabled={isPlacingOrder}
//         className="w-full bg-[#D97706] text-white py-4 rounded-full hover:bg-[#B45309] transition-all font-semibold shadow-md hover:shadow-lg disabled:opacity-75 flex items-center justify-center gap-2"
//       >
//         {isPlacingOrder ? (
//           <>
//             <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
//             <span>Placing Order...</span>
//           </>
//         ) : (
//           <span>Place Order</span>
//         )}
//       </button>

//       {/* Terms */}
//       <p className="text-xs text-gray-500 text-center">
//         By placing this order, you agree to our{' '}
//         <a href="/terms" className="text-[#D97706] hover:underline">
//           Terms & Conditions
//         </a>{' '}
//         and{' '}
//         <a href="/privacy" className="text-[#D97706] hover:underline">
//           Privacy Policy
//         </a>
//       </p>
//     </div>
//   );
// }



"use client";

import { use, useState } from "react";
import { ShippingAddress, PaymentMethod as PaymentMethodType } from "@/lib/types/checkout";
import { CartItem } from "@/lib/types/cart";
import { MapPin, CreditCard, Package, Edit2 } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/lib/context/CartContext";
import { useAuth } from "@/lib/context/AuthContext";
// import { u } from "framer-motion/client"; // This looked accidental in previous read?? removing it.
import OrderSuccessModal from "./OrderSuccessModal";
import { generateInvoice } from "@/lib/utils/invoice-generator";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

interface OrderReviewProps {
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethodType;
  items: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  couponCode?: string;
  platformFee?: number;
  onEditShipping: () => void;
  onEditPayment: () => void;
}

export default function OrderReview({
  shippingAddress,
  paymentMethod,
  items,
  subtotal,
  discount,
  tax,
  shipping,
  total,
  platformFee = 5,
  onEditShipping,
  onEditPayment,
}: OrderReviewProps) {
  
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successOrder, setSuccessOrder] = useState<any>(null); // Using any or Order type if available
  const { clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const paymentMethodNames = {
    cod: "Cash on Delivery",
    upi: "UPI Payment",
    card: "Credit/Debit Card",
    netbanking: "Net Banking",
  };

  // ---------------------------------------------------------
  // 🚀 PLACE ORDER FUNCTION (FULL WORKING IMPLEMENTATION)
  // ---------------------------------------------------------
  const handlePlaceOrder = async () => {
    if (isPlacingOrder) return;
    setIsPlacingOrder(true);

    try {
      if (!user?.id) {
        alert("You are not logged in.");
        setIsPlacingOrder(false);
        return;
      }

      // Convert cart items to backend format
      const formattedItems = items.map((item) => ({
        product: item.product.id,
        quantity: item.quantity,
        unitPrice: item.product.price,
        attributes: item.selectedAttributes || {},
      }));

      const body = {
        user: user?.id,
        shippingAddress: {
          fullName: shippingAddress.fullName,
          email: shippingAddress.email,
          phone: shippingAddress.phone,
          addressLine1: shippingAddress.addressLine1,
          addressLine2: shippingAddress.addressLine2,
          city: shippingAddress.city,
          state: shippingAddress.state,
          pincode: shippingAddress.pincode,
          country: shippingAddress.country,
        },
        items: formattedItems,
        tax,
        shippingCharges: shipping,
        discounts: discount,
    total,
        paymentMethod,
        transactionId: null,
      };

      console.log("📤 Sending order to backend:", body);

      const response = await fetch(`${API_BASE}/api/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      console.log("📥 Order response:", data);

      if (!data.success) {
        alert("Failed to place order!");
        setIsPlacingOrder(false);
        return;
      }

      // Success! Show modal
      setSuccessOrder(data.order);
      setShowSuccessModal(true);
      await clearCart();
      window.dispatchEvent(new Event("cart-updated"));
      
      // Removed redirect
      // window.location.href = `/order-confirmation?order=${data.order._id}`;

    } catch (err) {
      console.error("🔥 Error placing order:", err);
      alert("Something went wrong.");
    }

    setIsPlacingOrder(false);
  };

  // ---------------------------------------------------------
  // 🚀 RENDER UI
  // ---------------------------------------------------------
  return (
    <div className="space-y-6">

      {/* SHIPPING */}
      <div className="bg-white rounded-2xl soft-shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-[#111827] flex items-center gap-2">
            <MapPin size={24} className="text-[#D97706]" />
            Shipping Address
          </h2>
          <button
            onClick={onEditShipping}
            className="text-[#D97706] hover:text-[#B45309] font-medium text-sm flex items-center gap-1"
          >
            <Edit2 size={16} /> Edit
          </button>
        </div>

        <div className="bg-[#FAFAF7] rounded-xl p-4">
          <p className="font-semibold">{shippingAddress.fullName}</p>
          <p className="text-sm">{shippingAddress.addressLine1}</p>
          {shippingAddress.addressLine2 && <p className="text-sm">{shippingAddress.addressLine2}</p>}
          <p className="text-sm">
            {shippingAddress.city}, {shippingAddress.state} {shippingAddress.pincode}
          </p>
          <p className="text-sm mt-2">Email: {shippingAddress.email}</p>
          <p className="text-sm">Phone: +91 {shippingAddress.phone}</p>
        </div>
      </div>

      {/* PAYMENT */}
      <div className="bg-white rounded-2xl soft-shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <CreditCard size={24} className="text-[#D97706]" /> Payment Method
          </h2>
          <button
            onClick={onEditPayment}
            className="text-[#D97706] hover:text-[#B45309] font-medium text-sm flex items-center gap-1"
          >
            <Edit2 size={16} /> Edit
          </button>
        </div>

        <div className="bg-[#FAFAF7] rounded-xl p-4">
          <p className="font-semibold text-[#111827]">{paymentMethodNames[paymentMethod]}</p>
        </div>
      </div>

      {/* ORDER ITEMS */}
      <div className="bg-white rounded-2xl soft-shadow p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Package size={24} className="text-[#D97706]" /> Order Items ({items.length})
        </h2>

        <div className="space-y-4">
          {items.map((item) => {
            const price = item.product.discount
              ? item.product.price - (item.product.price * item.product.discount) / 100
              : item.product.price;

            return (
              <div key={item.product.id} className="flex gap-4 border-b pb-4">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100">
                  <Image
                    src={
                      item.product.image.startsWith("http")
                        ? item.product.image
                        : `/images/products/${item.product.image}`
                    }
                    alt={item.product.name}
                    fill
                    className="object-cover"
                    unoptimized={item.product.image.startsWith("http")}
                  />
                </div>

                <div className="flex-1">
                  <h3 className="text-sm font-semibold">{item.product.name}</h3>
                  <p className="text-xs text-gray-500">{item.product.category}</p>
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                </div>

                <p className="font-bold text-[#111827]">
                  ₹{(price * item.quantity).toFixed(0)}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ORDER SUMMARY */}
      <div className="bg-white rounded-2xl soft-shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span> <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax</span> <span>₹{tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
          </div>
          <div className="flex justify-between">
            <span>Platform Fee</span>
            <span>₹{platformFee.toFixed(2)}</span>
          </div>
        </div>

        <div className="border-t mt-3 pt-3 flex justify-between">
          <span className="text-lg font-semibold">Total</span>
          <span className="text-2xl font-bold text-[#D97706]">₹{total.toFixed(2)}</span>
        </div>
      </div>

      {/* PLACE ORDER BUTTON */}
      <button
        onClick={handlePlaceOrder}
        disabled={isPlacingOrder}
        className="w-full bg-[#D97706] text-white py-4 rounded-full font-semibold hover:bg-[#B45309] transition-all"
      >
        {isPlacingOrder ? "Placing Order..." : "Place Order"}
      </button>

      {/* SUCCESS MODAL */}
      <OrderSuccessModal
        isOpen={showSuccessModal}
        onClose={() => router.push('/products')} 
        orderId={successOrder?.orderNumber || successOrder?._id || "---"}
        onDownloadInvoice={() => successOrder && generateInvoice(successOrder)}
      />
    </div>
  );
}


// "use client";

// import { useState } from "react";
// import { ShippingAddress, PaymentMethod as PaymentMethodType } from "@/lib/types/checkout";
// import { CartItem } from "@/lib/types/cart";
// import { MapPin, CreditCard, Package, Edit2 } from "lucide-react";
// import Image from "next/image";

// interface OrderReviewProps {
//   shippingAddress: ShippingAddress;
//   paymentMethod: PaymentMethodType;
//   items: CartItem[];
//   subtotal: number;
//   discount: number;
//   tax: number;
//   shipping: number;
//   total: number;
//   couponCode?: string;
//   onEditShipping: () => void;
//   onEditPayment: () => void;
// }

// export default function OrderReview({
//   shippingAddress,
//   paymentMethod,
//   items,
//   subtotal,
//   discount,
//   tax,
//   shipping,
//   total,
//   onEditShipping,
//   onEditPayment,
// }: OrderReviewProps) {
  
//   const [isPlacingOrder, setIsPlacingOrder] = useState(false);

//   const paymentMethodNames = {
//     cod: "Cash on Delivery",
//     upi: "UPI Payment",
//     card: "Credit/Debit Card",
//     netbanking: "Net Banking",
//   };

//   // ---------------------------------------------------------
//   // 🚀 PLACE ORDER FUNCTION (FULL WORKING IMPLEMENTATION)
//   // ---------------------------------------------------------
//   const handlePlaceOrder = async () => {
//     if (isPlacingOrder) return;
//     setIsPlacingOrder(true);

//     try {
//       const userId = localStorage.getItem("userId");

//       if (!userId) {
//         alert("You are not logged in.");
//         setIsPlacingOrder(false);
//         return;
//       }

//       // Convert cart items to backend format
//       const formattedItems = items.map((item) => ({
//         product: item.product.id,
//         quantity: item.quantity,
//         unitPrice: item.product.price,
//         attributes: item.selectedAttributes || {},
//       }));

//       const body = {
//         userId,
//         shippingAddress: {
//           fullName: shippingAddress.fullName,
//           email: shippingAddress.email,
//           phone: shippingAddress.phone,
//           addressLine1: shippingAddress.addressLine1,
//           addressLine2: shippingAddress.addressLine2,
//           city: shippingAddress.city,
//           state: shippingAddress.state,
//           pincode: shippingAddress.pincode,
//           country: shippingAddress.country,
//         },
//         items: formattedItems,
//         tax,
//         shippingCharges: shipping,
//         discounts: discount,
//     total,
//         paymentMethod,
//         transactionId: null,
//       };

//       console.log("📤 Sending order to backend:", body);

//       const response = await fetch(`${API_BASE}/api/order`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(body),
//       });

//       const data = await response.json();
//       console.log("📥 Order response:", data);

//       if (!data.success) {
//         alert("Failed to place order!");
//         setIsPlacingOrder(false);
//         return;
//       }

//       // Save Order ID for next page
//       localStorage.setItem("lastOrderId", data.order._id);

//       // Redirect to confirmation
//       window.location.href = "/order-confirmation";

//     } catch (err) {
//       console.error("🔥 Error placing order:", err);
//       alert("Something went wrong.");
//     }

//     setIsPlacingOrder(false);
//   };

//   // ---------------------------------------------------------
//   // 🚀 RENDER UI
//   // ---------------------------------------------------------
//   return (
//     <div className="space-y-6">

//       {/* SHIPPING */}
//       <div className="bg-white rounded-2xl soft-shadow p-6">
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-xl font-semibold text-[#111827] flex items-center gap-2">
//             <MapPin size={24} className="text-[#D97706]" />
//             Shipping Address
//           </h2>
//           <button
//             onClick={onEditShipping}
//             className="text-[#D97706] hover:text-[#B45309] font-medium text-sm flex items-center gap-1"
//           >
//             <Edit2 size={16} /> Edit
//           </button>
//         </div>

//         <div className="bg-[#FAFAF7] rounded-xl p-4">
//           <p className="font-semibold">{shippingAddress.fullName}</p>
//           <p className="text-sm">{shippingAddress.addressLine1}</p>
//           {shippingAddress.addressLine2 && <p className="text-sm">{shippingAddress.addressLine2}</p>}
//           <p className="text-sm">
//             {shippingAddress.city}, {shippingAddress.state} {shippingAddress.pincode}
//           </p>
//           <p className="text-sm mt-2">Email: {shippingAddress.email}</p>
//           <p className="text-sm">Phone: +91 {shippingAddress.phone}</p>
//         </div>
//       </div>

//       {/* PAYMENT */}
//       <div className="bg-white rounded-2xl soft-shadow p-6">
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-xl font-semibold flex items-center gap-2">
//             <CreditCard size={24} className="text-[#D97706]" /> Payment Method
//           </h2>
//           <button
//             onClick={onEditPayment}
//             className="text-[#D97706] hover:text-[#B45309] font-medium text-sm flex items-center gap-1"
//           >
//             <Edit2 size={16} /> Edit
//           </button>
//         </div>

//         <div className="bg-[#FAFAF7] rounded-xl p-4">
//           <p className="font-semibold text-[#111827]">{paymentMethodNames[paymentMethod]}</p>
//         </div>
//       </div>

//       {/* ORDER ITEMS */}
//       <div className="bg-white rounded-2xl soft-shadow p-6">
//         <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
//           <Package size={24} className="text-[#D97706]" /> Order Items ({items.length})
//         </h2>

//         <div className="space-y-4">
//           {items.map((item) => {
//             const price = item.product.discount
//               ? item.product.price - (item.product.price * item.product.discount) / 100
//               : item.product.price;

//             return (
//               <div key={item.product.id} className="flex gap-4 border-b pb-4">
//                 <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100">
//                   <Image
//                     src={
//                       item.product.image.startsWith("http")
//                         ? item.product.image
//                         : `/images/products/${item.product.image}`
//                     }
//                     alt={item.product.name}
//                     fill
//                     className="object-cover"
//                     unoptimized={item.product.image.startsWith("http")}
//                   />
//                 </div>

//                 <div className="flex-1">
//                   <h3 className="text-sm font-semibold">{item.product.name}</h3>
//                   <p className="text-xs text-gray-500">{item.product.category}</p>
//                   <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
//                 </div>

//                 <p className="font-bold text-[#111827]">
//                   ₹{(price * item.quantity).toFixed(0)}
//                 </p>
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       {/* ORDER SUMMARY */}
//       <div className="bg-white rounded-2xl soft-shadow p-6">
//         <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

//         <div className="space-y-2 text-sm">
//           <div className="flex justify-between">
//             <span>Subtotal</span> <span>₹{subtotal.toFixed(2)}</span>
//           </div>
//           <div className="flex justify-between">
//             <span>Tax</span> <span>₹{tax.toFixed(2)}</span>
//           </div>
//           <div className="flex justify-between">
//             <span>Shipping</span>
//             <span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
//           </div>
//         </div>

//         <div className="border-t mt-3 pt-3 flex justify-between">
//           <span className="text-lg font-semibold">Total</span>
//           <span className="text-2xl font-bold text-[#D97706]">₹{total.toFixed(2)}</span>
//         </div>
//       </div>

//       {/* PLACE ORDER BUTTON */}
//       <button
//         onClick={handlePlaceOrder}
//         disabled={isPlacingOrder}
//         className="w-full bg-[#D97706] text-white py-4 rounded-full font-semibold hover:bg-[#B45309] transition-all"
//       >
//         {isPlacingOrder ? "Placing Order..." : "Place Order"}
//       </button>
//     </div>
//   );
// }