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
import { useAuth } from '@/lib/context/AuthContext';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping');
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('cod');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);


  console.log("User ", user);

  useEffect(() => {
    setMounted(true);
  }, []);

  console.log(shippingAddress);

  // // Redirect if cart is empty
  // useEffect(() => {
  //   if (items.length === 0) {
  //     router.push('/cart');
  //   }
  // }, [items, router]);


  // Calculate order totals (same as cart)
  const discount = 0; // Would come from applied coupon
  const subtotalAfterDiscount = subtotal - discount;
  const tax = subtotalAfterDiscount * 0.18;
  const shipping = subtotal >= 500 ? 0 : 20;
  const platformFee = 5;
  const total = subtotalAfterDiscount + tax + shipping + platformFee;

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
      platformFee,
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
                  className="text-[#D97706] hover:text-[#B45309] font-medium text-sm"
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
                  className="text-[#D97706] hover:text-[#B45309] font-medium text-sm"
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
                  platformFee={platformFee}
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
