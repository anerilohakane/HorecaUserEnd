'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Order } from '@/lib/types/checkout';
import {
  CheckCircle2,
  MapPin,
  CreditCard,
  Download,
  Package,
  Truck,
  ShieldCheck,
  ChevronRight,
  Gift,
  Star,
  Clock,
  Home,
  Phone,
  Receipt
} from 'lucide-react';
import { generateInvoice } from '@/lib/utils/invoice-generator';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
type PaymentMethodKey = 'cod' | 'upi' | 'card' | 'netbanking';

const OrderConfirmationPage = () => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  // ----------------------------------------------------------------------
  // 📥 Load Order Logic
  // ----------------------------------------------------------------------
  useEffect(() => {
    async function loadOrder() {
      const localOrder = localStorage.getItem("lastOrder");
      if (localOrder) {
        setOrder(JSON.parse(localOrder));
        setLoading(false);
        return;
      }
      try {
        const storedOrderId = localStorage.getItem("lastOrderId");
        const storedUserId = localStorage.getItem("userId");
        if (!storedOrderId || !storedUserId) {
          setLoading(false);
          return;
        }
        const apiUrl = `${API_BASE}/api/order?id=${storedOrderId}&userId=${storedUserId}`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        if (data?.success && data.order) {
          setOrder(data.order);
        }
      } catch (error) {
        console.error("Error loading order:", error);
      } finally {
        setLoading(false);
      }
    }
    loadOrder();
  }, []);

  // ----------------------------------------------------------------------
  // 🛠️ Helpers
  // ----------------------------------------------------------------------
  const handleDownloadInvoice = () => {
    if (!order) return;
    try { generateInvoice(order); } catch (err) { console.error(err); }
  };

  const resolveImage = (image?: string) => {
    if (!image) return "/images/placeholder.png";
    const cleanImage = image.trim();
    if (cleanImage.startsWith("http") || cleanImage.startsWith("data:")) return cleanImage;
    // Local images are in /images/products/
    return `/images/products/${cleanImage.replace(/^\/+/, "").replace(/^images\/products\//, "")}`;
  };

  const paymentMethodNames: Record<PaymentMethodKey, string> = {
    cod: 'Cash on Delivery',
    upi: 'UPI Payment',
    card: 'Credit/Debit Card',
    netbanking: 'Net Banking',
  };

  // ----------------------------------------------------------------------
  // 🔄 Loading State
  // ----------------------------------------------------------------------
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-gray-500 font-medium animate-pulse">Fetching your order...</p>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------------------------
  // ❌ Error State
  // ----------------------------------------------------------------------
  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4">
            <Package className="text-gray-400" size={32} />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Order Not Found</h2>
          <p className="text-gray-500 mb-6 max-w-xs mx-auto">We couldn't retrieve the order details. Please check your orders page.</p>
          <Link href="/products" className="bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors">
            Continue Shopping
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // ----------------------------------------------------------------------
  // 🎨 Main UI (Professional E-Commerce)
  // ----------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#F1F3F6] font-sans text-gray-900">
      <Header />

      {/* 🟢 Status Strip (Amazon/Flipkart Style) */}
      <div className="bg-white border-b border-gray-200 sticky top-20 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              className="w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center text-white shadow-sm"
            >
              <CheckCircle2 size={18} strokeWidth={3} />
            </motion.div>
            <div>
              <h1 className="text-lg font-bold text-gray-800 leading-tight">Order Placed Successfully</h1>
              <p className="text-xs text-gray-500 font-medium">Order ID: <span className="font-mono text-gray-700">#{order.orderNumber}</span></p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* <button onClick={handleDownloadInvoice} className="hidden sm:flex items-center gap-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-md transition-colors border border-transparent hover:border-blue-100">
              <Receipt size={16} />
              Invoice
            </button> */}
            <Link href="/products" className="bg-amber-500 text-white text-sm font-bold px-5 py-2 rounded shadow-sm hover:shadow-md hover:bg-amber-600 transition-all">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 lg:px-6 py-6 lg:py-8">
        <div className="grid lg:grid-cols-12 gap-6">

          {/* ------------------------------------------------------- */}
          {/* LEFT COLUMN (Timeline, Rewards, Items) - Span 8 */}
          {/* ------------------------------------------------------- */}
          <div className="lg:col-span-8 space-y-5">

            {/* 🚚 1. Delivery & Timeline Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-full text-blue-600 mt-1">
                    <Truck size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Arriving by Thu, 16 Jan</h2>
                    <p className="text-sm text-gray-600 mt-1">Super fast delivery activated. We're packing your order now!</p>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="p-6 pt-8">
                <div className="relative">
                  {/* Mobile Vertical Line */}
                  <div className="absolute top-0 bottom-0 left-[19px] w-0.5 bg-gray-200 md:hidden" />
                  {/* Desktop Horizontal Line */}
                  <div className="hidden md:block absolute top-[14px] left-0 right-0 h-1 bg-gray-100 rounded-full" />
                  <div className="hidden md:block absolute top-[14px] left-0 w-1/3 h-1 bg-amber-500 rounded-full" />

                  <div className="flex flex-col md:flex-row justify-between gap-6 md:gap-0 relative">
                    {[
                      { title: "Order Placed", date: "Today, 2:30 PM", active: true },
                      { title: "Packed", date: "Tomorrow", active: false },
                      { title: "Shipped", date: "Fri, 14 Jan", active: false },
                      { title: "Out for Delivery", date: "Thu, 16 Jan", active: false },
                    ].map((step, idx) => (
                      <div key={idx} className="flex md:flex-col items-center md:items-center gap-4 md:gap-3 relative z-10 md:w-1/4">
                        <div className={`w-10 h-10 md:w-8 md:h-8 rounded-full border-[3px] flex items-center justify-center bg-white ${step.active ? 'border-amber-500' : 'border-gray-200'}`}>
                          {step.active && <div className="w-3 h-3 md:w-2.5 md:h-2.5 bg-amber-500 rounded-full" />}
                        </div>
                        <div className="md:text-center pt-2 md:pt-0">
                          <p className={`text-sm font-bold ${step.active ? 'text-gray-900' : 'text-gray-400'}`}>{step.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{step.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 🎁 2. Reward / Scratch Card (Blinkit Style) */}
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-lg shadow-md p-0.5 text-white relative overflow-hidden group cursor-pointer"
            >
              <div className="bg-white/10 backdrop-blur-sm p-4 sm:p-5 flex items-center justify-between relative z-10 hover:bg-white/15 transition-colors rounded-[inherit]">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg text-amber-500">
                    <Gift size={24} className="animate-bounce" />
                  </div>
                  <div>
                    <p className="font-bold text-lg leading-tight">You've unlocked a Mystery Reward!</p>
                    <p className="text-amber-100 text-xs sm:text-sm">Claim it on your next order above ₹500</p>
                  </div>
                </div>
                <ChevronRight className="text-white/80 group-hover:translate-x-1 transition-transform" />
              </div>
              {/* Shine Effect */}
              <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />
            </motion.div>

            {/* 📦 3. Items List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <Package size={18} className="text-gray-500" />
                  Items in this Order ({order.items.length})
                </h3>
              </div>
              <div className="divide-y divide-gray-100">
                {order.items.map((item, idx) => {
                  // Robust Data Extraction
                  const name = item.productName || (item as any).product?.name || (item as any).name || (item as any).title || "Product Name Unavailable";
                  const image = item.image || (item as any).product?.image || "/images/placeholder.png";
                  const price = item.price ?? (item as any).unitPrice ?? (item as any).product?.price ?? 0;
                  const qty = item.quantity || (item as any).qty || 1;
                  const itemTotal = qty * price;

                  const finalImage = resolveImage(image);

                  return (
                    <div key={idx} className="p-4 sm:p-5 flex gap-4 sm:gap-6 hover:bg-gray-50/50 transition-colors">
                      <div className="w-24 h-24 bg-white border border-gray-200 rounded-md p-2 relative flex-shrink-0">
                        <Image
                          src={finalImage}
                          alt={name}
                          fill
                          className="object-contain"
                          unoptimized={finalImage.startsWith("http")}
                        />
                      </div>
                      {/* DEBUG: Show filtered image path */}
                      <p className="hidden text-[10px] text-red-500 absolute bottom-0 bg-white/80 p-0.5 z-10">{finalImage}</p>

                      <div className="flex-1 min-w-0">
                        <Link href={(item as any).productId ? `/product/${(item as any).productId}` : (item as any).product?._id ? `/product/${(item as any).product._id}` : '#'} className="text-base font-semibold text-gray-900 hover:text-amber-600 line-clamp-2 transition-colors">
                          {name}
                        </Link>
                        <p className="text-sm text-gray-500 mt-1">Unit Price: ₹{price.toFixed(2)}</p>
                        <p className="text-sm text-gray-500">Qty: <span className="font-semibold text-gray-800">{qty}</span></p>
                        <p className="font-bold text-lg text-gray-900 mt-2">₹{itemTotal.toFixed(2)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 📍 4. Delivery Address */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col sm:flex-row gap-6">
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <MapPin size={18} className="text-gray-400" />
                  Shipping Details
                </h3>
                <div className="pl-6">
                  <p className="font-bold text-gray-900">{order.shippingAddress.fullName}</p>
                  <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                    {order.shippingAddress.addressLine1}, {order.shippingAddress.addressLine2} <br />
                    {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                  </p>
                  <div className="flex items-center gap-2 mt-3 text-sm text-gray-600">
                    <Phone size={14} />
                    <span>{order.shippingAddress.phone}</span>
                  </div>
                </div>
              </div>
              {/* Visual Map Placeholder (Aesthetic Touch) */}
              <div className="w-full sm:w-48 h-32 bg-amber-50 rounded-lg border border-amber-100 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <MapPin className="text-amber-300 w-12 h-12" />
              </div>
            </div>

          </div>

          {/* ------------------------------------------------------- */}
          {/* RIGHT COLUMN (Summary) - Span 4 */}
          {/* ------------------------------------------------------- */}
          <div className="lg:col-span-4 space-y-5">

            {/* Price Breakdown */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-28">
              {/* Price Breakdown */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-28">
                <div className="px-5 py-4 border-b border-gray-100">
                  <h3 className="font-bold text-gray-800">Price Details</h3>
                </div>
                <div className="p-5 space-y-3">
                  {(() => {
                    // ----------------------------------------------------------------------
                    // 🧮 CLIENT-SIDE RECALCULATION FOR CONSISTENCY
                    // This ensures that what the user sees is mathematically correct (A+B+C = Total)
                    // preventing mismatch between backend 'total' and frontend calculated components.
                    // ----------------------------------------------------------------------
                    const platformFee = 5;

                    // 1. Calculate Subtotal from Items
                    const calculatedSubtotal = order.items.reduce((acc, item) => {
                      const price = item.price ?? (item as any).unitPrice ?? (item as any).product?.price ?? 0;
                      const qty = item.quantity || (item as any).qty || 1;
                      return acc + (price * qty);
                    }, 0);

                    // 2. Shipping Logic (consistent with Checkout)
                    const dbShipping = order.shipping ?? (order as any).shippingCharges;
                    const calculatedShipping = dbShipping !== undefined
                      ? dbShipping
                      : (calculatedSubtotal >= 500 ? 0 : 20);

                    // 3. Discount (from DB)
                    const discountVal = order.discount || (order as any).discounts || 0;

                    // 4. Tax (18% of Taxable Value)
                    const taxableAmount = Math.max(0, calculatedSubtotal - discountVal);
                    const calculatedTax = taxableAmount * 0.18;

                    // 5. Final Total
                    const calculatedTotal = calculatedSubtotal - discountVal + calculatedTax + calculatedShipping + platformFee;

                    return (
                      <>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Price ({order.items.length} items)</span>
                          <span>₹{calculatedSubtotal.toFixed(2)}</span>
                        </div>
                        {discountVal > 0 && (
                          <div className="flex justify-between text-sm text-green-600">
                            <span>Discount</span>
                            <span>- ₹{discountVal.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Platform Fee</span>
                          <span>₹{platformFee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Delivery Charges</span>
                          <span className={calculatedShipping === 0 ? "text-green-600 uppercase text-xs font-bold" : ""}>
                            {calculatedShipping === 0 ? 'FREE' : `₹${calculatedShipping.toFixed(2)}`}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Tax (18% GST)</span>
                          <span>₹{calculatedTax.toFixed(2)}</span>
                        </div>

                        <div className="p-5 pt-0 -mx-5 pb-0"> {/* Negative margin to break out of padding then re-add */}
                          <div className="border-t border-dashed border-gray-200 pt-4 mb-4">
                            <div className="flex justify-between items-center px-5">
                              <span className="font-bold text-lg text-gray-900">Total Amount</span>
                              <span className="font-bold text-xl text-gray-900">₹{calculatedTotal.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>

                <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-md border border-gray-100 text-sm text-gray-600 mb-4">
                  <CreditCard size={16} />
                  <span>Payment via <b>{
                    (() => {
                      // Fix: Check order.payment.method (DB structure) OR order.paymentMethod (Frontend structure)
                      const method = (order as any).payment?.method || order.paymentMethod;
                      const normalizedMethod = method?.toLowerCase();

                      const names: Record<string, string> = {
                        cod: 'Cash on Delivery',
                        upi: 'UPI Payment',
                        card: 'Credit/Debit Card',
                        netbanking: 'Net Banking'
                      };
                      return names[normalizedMethod] || method || 'Unknown Method';
                    })()
                  }</b></span>
                </div>

                <button
                  onClick={handleDownloadInvoice}
                  className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-lg transition-all text-sm mb-2"
                >
                  <Download size={16} />
                  Download Invoice
                </button>
              </div>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderConfirmationPage;