'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/context/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ShippingForm from '@/components/checkout/ShippingForm';
import PaymentMethod from '@/components/checkout/PaymentMethod';
import OrderReview from '@/components/checkout/OrderReview';
import { ShippingAddress, PaymentMethod as PaymentMethodType, CheckoutStep } from '@/lib/types/checkout';
import { Check } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();

  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping');
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('cod');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);


  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart');
    }
  }, [items, router]);


  // Calculate order totals (same as cart)
  const discount = 0; // Would come from applied coupon
  const subtotalAfterDiscount = subtotal - discount;
  const tax = subtotalAfterDiscount * 0.18;
  const shipping = subtotal >= 1000 ? 0 : 50;
  const total = subtotalAfterDiscount + tax + shipping;

  const steps = [
    { id: 'shipping' as CheckoutStep, label: 'Shipping', number: 1 },
    { id: 'payment' as CheckoutStep, label: 'Payment', number: 2 },
    { id: 'review' as CheckoutStep, label: 'Review', number: 3 },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  const handleShippingSubmit = (address: ShippingAddress) => {
    setShippingAddress(address);
    setCurrentStep('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePaymentSubmit = (method: PaymentMethodType) => {
    setPaymentMethod(method);
    setCurrentStep('review');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Generate order
    const orderId = `ORD-${Date.now()}`;
    const orderNumber = `#${Math.floor(100000 + Math.random() * 900000)}`;

    const order = {
      id: orderId,
      orderNumber,
      date: new Date().toISOString(),
      status: 'confirmed' as const,
      shippingAddress: shippingAddress!,
      paymentMethod,
      items: items.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.product.discount
          ? item.product.price - (item.product.price * item.product.discount / 100)
          : item.product.price,
        image: item.product.image,
      })),
      subtotal,
      discount,
      tax,
      shipping,
      total,
    };

    // // Save to localStorage
    // localStorage.setItem('lastOrder', JSON.stringify(order));

    // Save order to localStorage
    localStorage.setItem("lastOrder", JSON.stringify(order));
    localStorage.setItem("lastOrderId", order.id);

    // Clear cart
    clearCart();

    // Redirect to confirmation
    // router.push(`/order-confirmation?order=${orderId}`);
    router.push(`/order-confirmation?order=${order.id}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow bg-[#FAFAF7] py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-6">
            <nav className="flex items-center gap-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-[#D97706] transition-colors">Home</Link>
              <span>/</span>
              <a href="/cart" className="hover:text-[#D97706] transition-colors">Cart</a>
              <span>/</span>
              <span className="text-[#111827] font-medium">Checkout</span>
            </nav>
          </div>

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-light text-[#111827] mb-2">
              Checkout
            </h1>
            <p className="text-gray-600">
              Complete your order in just a few steps
            </p>
          </div>

          {/* Step Indicator */}
          <div className="mb-8">
            <div className="bg-white rounded-2xl soft-shadow p-6">
              <div className="flex items-center justify-between">
                {steps.map((step, index) => {
                  const isCompleted = index < currentStepIndex;
                  const isCurrent = step.id === currentStep;

                  return (
                    <div key={step.id} className="flex items-center flex-1">
                      {/* Step Circle */}
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all ${isCompleted
                              ? 'bg-[#D97706] text-white'
                              : isCurrent
                                ? 'bg-[#D97706] text-white ring-4 ring-[#D97706]/20'
                                : 'bg-gray-200 text-gray-500'
                            }`}
                        >
                          {isCompleted ? (
                            <Check size={24} strokeWidth={3} />
                          ) : (
                            step.number
                          )}
                        </div>
                        <span
                          className={`mt-2 text-sm font-medium ${isCurrent ? 'text-[#D97706]' : 'text-gray-600'
                            }`}
                        >
                          {step.label}
                        </span>
                      </div>

                      {/* Connector Line */}
                      {index < steps.length - 1 && (
                        <div
                          className={`flex-1 h-1 mx-4 rounded transition-all ${index < currentStepIndex ? 'bg-[#D97706]' : 'bg-gray-200'
                            }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Step Content */}
          <div>
            {currentStep === 'shipping' && (
              <ShippingForm
                onSubmit={handleShippingSubmit}
                initialData={shippingAddress || undefined}
              />
            )}

            {currentStep === 'payment' && (
              <div className="space-y-4">
                <button
                  onClick={() => setCurrentStep('shipping')}
                  className="text-[#D97706] hover:text-[#7CB342] font-medium text-sm"
                >
                  ← Back to Shipping
                </button>
                <PaymentMethod
                  onSubmit={handlePaymentSubmit}
                  initialMethod={paymentMethod}
                />
              </div>
            )}

            {currentStep === 'review' && shippingAddress && (
              <div className="space-y-4">
                <button
                  onClick={() => setCurrentStep('payment')}
                  className="text-[#D97706] hover:text-[#7CB342] font-medium text-sm"
                >
                  ← Back to Payment
                </button>
                {/* <OrderReview
                  shippingAddress={shippingAddress}
                  paymentMethod={paymentMethod}
                  items={items}
                  subtotal={subtotal}
                  discount={discount}
                  tax={tax}
                  shipping={shipping}
                  total={total}
                  onEditShipping={() => setCurrentStep('shipping')}
                  onEditPayment={() => setCurrentStep('payment')}
                  onPlaceOrder={handlePlaceOrder}
                  isPlacingOrder={isPlacingOrder}
                /> */}

                <OrderReview
                  shippingAddress={shippingAddress}
                  paymentMethod={paymentMethod}
                  items={items}
                  subtotal={subtotal}
                  discount={discount}
                  tax={tax}
                  shipping={shipping}
                  total={total}
                  onEditShipping={() => setCurrentStep('shipping')}
                  onEditPayment={() => setCurrentStep('payment')}
                />

              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { useCart } from '@/lib/context/CartContext';
// import { useAuth } from '@/lib/context/AuthContext';

// import Header from '@/components/Header';
// import Footer from '@/components/Footer';
// import ShippingForm from '@/components/checkout/ShippingForm';
// import PaymentMethod from '@/components/checkout/PaymentMethod';
// import OrderReview from '@/components/checkout/OrderReview';

// import {
//   ShippingAddress,
//   PaymentMethod as PaymentMethodType,
//   CheckoutStep,
// } from '@/lib/types/checkout';

// import { Check } from 'lucide-react';
// import Link from 'next/link';

// export default function CheckoutPage() {
//   const router = useRouter();
//   const { items, subtotal, clearCart } = useCart();
//   const { user } = useAuth();

//   const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping');
//   const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(null);
//   const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('cod');
//   const [isPlacingOrder, setIsPlacingOrder] = useState(false);

//   // prevent redirect error
//   useEffect(() => {
//     if (items.length === 0) router.push('/cart');
//   }, [items]);

//   if (items.length === 0) return null;

//   // price calculations
//   const discount = 0;
//   const subtotalAfterDiscount = subtotal - discount;
//   const tax = subtotalAfterDiscount * 0.18;
//   const shipping = subtotal >= 1000 ? 0 : 50;
//   const total = subtotalAfterDiscount + tax + shipping;

//   // Step definitions (from old code)
//   const steps = [
//     { id: 'shipping' as CheckoutStep, label: 'Shipping', number: 1 },
//     { id: 'payment' as CheckoutStep, label: 'Payment', number: 2 },
//     { id: 'review' as CheckoutStep, label: 'Review', number: 3 },
//   ];
//   const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

//   const handleShippingSubmit = (address: ShippingAddress) => {
//     setShippingAddress(address);
//     setCurrentStep("payment");
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   const handlePaymentSubmit = (method: PaymentMethodType) => {
//     setPaymentMethod(method);
//     setCurrentStep("review");
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   const handlePlaceOrder = async () => {
//     if (!user?._id) {
//       alert("Please log in to place an order.");
//       return;
//     }
//     if (!shippingAddress) return;

//     setIsPlacingOrder(true);

//     try {
//       const token = localStorage.getItem("unifoods_token");
//       if (!token) throw new Error("Not authenticated");

//       const payload = {
//         userId: user._id,
//         shippingAddress,
//         paymentMethod,
//         items: items.map((i) => ({
//           productId: i.product.id,
//           quantity: i.quantity,
//           price: i.product.discount
//             ? i.product.price - (i.product.price * i.product.discount) / 100
//             : i.product.price,
//           image: i.product.image,
//           productName: i.product.name,
//         })),
//         subtotal,
//         discount,
//         tax,
//         shipping,
//         total,
//       };

//       console.log("📦 Sending order payload:", payload);

//       const res = await fetch(`${API_BASE}/api/order`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(payload),
//       });

//       const data = await res.json();
//       console.log("📥 Order API response:", data);

//       if (!res.ok || !data.order?._id) {
//         throw new Error(data?.message || "Order failed");
//       }

//       localStorage.setItem("lastOrderId", data.order._id);
//       localStorage.setItem("userId", user._id);

//       clearCart();

//       router.push("/order-confirmation");

//     } catch (err: any) {
//       console.error("🔥 Order error:", err);
//       alert(err.message || "Order failed");
//     } finally {
//       setIsPlacingOrder(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col">
//       <Header />

//       <main className="flex-grow bg-[#FAFAF7] py-8">
//         <div className="max-w-5xl mx-auto px-4">

//           {/* STEP INDICATOR (INSERTED FROM OLD CODE) */}
//           <div className="mb-8 bg-white rounded-2xl soft-shadow p-6">
//             <div className="flex items-center justify-between">
//               {steps.map((step, index) => {
//                 const isCompleted = index < currentStepIndex;
//                 const isCurrent = step.id === currentStep;

//                 return (
//                   <div key={step.id} className="flex items-center flex-1">
//                     {/* Step Circle */}
//                     <div className="flex flex-col items-center">
//                       <div
//                         className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all ${
//                           isCompleted
//                             ? 'bg-[#D97706] text-white'
//                             : isCurrent
//                             ? 'bg-[#D97706] text-white ring-4 ring-[#D97706]/20'
//                             : 'bg-gray-200 text-gray-500'
//                         }`}
//                       >
//                         {isCompleted ? (
//                           <Check size={24} strokeWidth={3} />
//                         ) : (
//                           step.number
//                         )}
//                       </div>
//                       <span
//                         className={`mt-2 text-sm font-medium ${
//                           isCurrent ? 'text-[#D97706]' : 'text-gray-600'
//                         }`}
//                       >
//                         {step.label}
//                       </span>
//                     </div>

//                     {/* Connector Line */}
//                     {index < steps.length - 1 && (
//                       <div
//                         className={`flex-1 h-1 mx-4 rounded transition-all ${
//                           index < currentStepIndex ? 'bg-[#D97706]' : 'bg-gray-200'
//                         }`}
//                       />
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           </div>

//           {/* CONTENT */}
//           {currentStep === "shipping" && (
//             <ShippingForm onSubmit={handleShippingSubmit} initialData={shippingAddress || undefined} />
//           )}

//           {currentStep === "payment" && (
//             <div className="space-y-4">
//               <button
//                 onClick={() => setCurrentStep("shipping")}
//                 className="text-[#D97706] hover:text-[#7CB342] font-medium text-sm"
//               >
//                 ← Back to Shipping
//               </button>

//               <PaymentMethod onSubmit={handlePaymentSubmit} initialMethod={paymentMethod} />
//             </div>
//           )}

//           {currentStep === "review" && (
//             <div className="space-y-4">
//               <button
//                 onClick={() => setCurrentStep("payment")}
//                 className="text-[#D97706] hover:text-[#7CB342] font-medium text-sm"
//               >
//                 ← Back to Payment
//               </button>

//               <OrderReview
//                 shippingAddress={shippingAddress!}
//                 paymentMethod={paymentMethod}
//                 items={items}
//                 subtotal={subtotal}
//                 discount={discount}
//                 tax={tax}
//                 shipping={shipping}
//                 total={total}
//                 onEditShipping={() => setCurrentStep("shipping")}
//                 onEditPayment={() => setCurrentStep("payment")}
//                 onPlaceOrder={handlePlaceOrder}
//                 isPlacingOrder={isPlacingOrder}
//               />
//             </div>
//           )}

//         </div>
//       </main>

//       <Footer />
//     </div>
//   );
// }
