// 'use client';

// import { useEffect, useState } from 'react';
// import Link from 'next/link';
// import Header from '@/components/Header';
// import Footer from '@/components/Footer';
// import { Order } from '@/lib/types/checkout';
// import { CheckCircle, Package, MapPin, CreditCard, Download, ArrowRight } from 'lucide-react';
// import Image from 'next/image';

// export default function OrderConfirmationPage() {
//   const [order, setOrder] = useState<Order | null>(null);

//   useEffect(() => {
//     // Load order from localStorage
//     const savedOrder = localStorage.getItem('lastOrder');
//     if (savedOrder) {
//       setOrder(JSON.parse(savedOrder));
//     }
//   }, []);

//   if (!order) {
//     return (
//       <div className="min-h-screen flex flex-col">
//         <Header />
//         <main className="flex-grow bg-[#FAFAF7] flex items-center justify-center">
//           <div className="text-center">
//             <div className="w-16 h-16 border-4 border-[#D97706] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
//             <p className="text-gray-600">Loading order details...</p>
//           </div>
//         </main>
//         <Footer />
//       </div>
//     );
//   }

//   const paymentMethodNames = {
//     cod: 'Cash on Delivery',
//     upi: 'UPI Payment',
//     card: 'Credit/Debit Card',
//     netbanking: 'Net Banking',
//   };

//   return (
//     <div className="min-h-screen flex flex-col">
//       <Header />

//       <main className="flex-grow bg-[#FAFAF7] py-8">
//         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
//           {/* Success Message */}
//           <div className="mb-8 text-center">
//             <div className="w-20 h-20 bg-[#D97706] rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
//               <CheckCircle size={48} className="text-white" strokeWidth={2.5} />
//             </div>
//             <h1 className="text-4xl font-light text-[#111827] mb-2">
//               Order Placed Successfully!
//             </h1>
//             <p className="text-gray-600 mb-4">
//               Thank you for your order. We&apos;ll send you shipping updates to {order.shippingAddress.email}
//             </p>
//             <div className="flex items-center justify-center gap-2 text-2xl font-semibold text-[#D97706]">
//               <span>Order {order.orderNumber}</span>
//             </div>
//           </div>

//           {/* Order Details Cards */}
//           <div className="space-y-6 mb-8">
//             {/* Order Info */}
//             <div className="bg-white rounded-2xl soft-shadow p-6">
//               <div className="grid md:grid-cols-3 gap-6">
//                 <div>
//                   <p className="text-sm text-gray-600 mb-1">Order Number</p>
//                   <p className="font-semibold text-[#111827]">{order.orderNumber}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-600 mb-1">Order Date</p>
//                   <p className="font-semibold text-[#111827]">
//                     {new Date(order.date).toLocaleDateString('en-IN', {
//                       day: 'numeric',
//                       month: 'long',
//                       year: 'numeric',
//                     })}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-600 mb-1">Total Amount</p>
//                   <p className="font-semibold text-[#D97706] text-xl">
//                     ₹{order.total.toFixed(2)}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Shipping Address */}
//             <div className="bg-white rounded-2xl soft-shadow p-6">
//               <h2 className="text-lg font-semibold text-[#111827] mb-4 flex items-center gap-2">
//                 <MapPin size={20} className="text-[#D97706]" />
//                 Shipping Address
//               </h2>
//               <div className="bg-[#FAFAF7] rounded-xl p-4">
//                 <p className="font-semibold text-[#111827] mb-1">
//                   {order.shippingAddress.fullName}
//                 </p>
//                 <p className="text-sm text-gray-700">{order.shippingAddress.addressLine1}</p>
//                 {order.shippingAddress.addressLine2 && (
//                   <p className="text-sm text-gray-700">{order.shippingAddress.addressLine2}</p>
//                 )}
//                 <p className="text-sm text-gray-700">
//                   {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
//                   {order.shippingAddress.pincode}
//                 </p>
//                 <p className="text-sm text-gray-700 mt-2">
//                   Phone: +91 {order.shippingAddress.phone}
//                 </p>
//               </div>
//             </div>

//             {/* Payment Method */}
//             <div className="bg-white rounded-2xl soft-shadow p-6">
//               <h2 className="text-lg font-semibold text-[#111827] mb-4 flex items-center gap-2">
//                 <CreditCard size={20} className="text-[#D97706]" />
//                 Payment Method
//               </h2>
//               <div className="bg-[#FAFAF7] rounded-xl p-4">
//                 <p className="font-semibold text-[#111827]">
//                   {paymentMethodNames[order.paymentMethod]}
//                 </p>
//                 {order.paymentMethod === 'cod' && (
//                   <p className="text-sm text-gray-600 mt-1">
//                     Please keep ₹{order.total.toFixed(2)} ready for payment
//                   </p>
//                 )}
//               </div>
//             </div>

//             {/* Order Items */}
//             <div className="bg-white rounded-2xl soft-shadow p-6">
//               <h2 className="text-lg font-semibold text-[#111827] mb-4 flex items-center gap-2">
//                 <Package size={20} className="text-[#D97706]" />
//                 Order Items ({order.items.length})
//               </h2>
//               <div className="space-y-4">
//                 {order.items.map((item) => (
//                   <div
//                     key={item.productId}
//                     className="flex gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
//                   >
//                     <div className="relative w-20 h-20 bg-[#F5F5F5] rounded-xl overflow-hidden flex-shrink-0">
//                       <Image
//                         src={`/images/products/${item.image}`}
//                         alt={item.productName}
//                         fill
//                         className="object-cover"
//                       />
//                     </div>
//                     <div className="flex-1">
//                       <h3 className="font-semibold text-[#111827] mb-1 text-sm">
//                         {item.productName}
//                       </h3>
//                       <p className="text-sm text-gray-600">
//                         Quantity: {item.quantity} × ₹{item.price.toFixed(0)}
//                       </p>
//                     </div>
//                     <div className="text-right">
//                       <p className="font-bold text-[#111827]">
//                         ₹{(item.price * item.quantity).toFixed(0)}
//                       </p>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* Order Summary */}
//               <div className="mt-6 pt-6 border-t border-gray-200">
//                 <div className="space-y-2">
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-600">Subtotal</span>
//                     <span className="font-semibold">₹{order.subtotal.toFixed(2)}</span>
//                   </div>
//                   {order.discount > 0 && (
//                     <div className="flex justify-between text-sm">
//                       <span className="text-[#D97706]">Discount</span>
//                       <span className="font-semibold text-[#D97706]">
//                         -₹{order.discount.toFixed(2)}
//                       </span>
//                     </div>
//                   )}
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-600">Tax (GST 18%)</span>
//                     <span className="font-semibold">₹{order.tax.toFixed(2)}</span>
//                   </div>
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-600">Shipping</span>
//                     {order.shipping === 0 ? (
//                       <span className="font-semibold text-[#D97706]">FREE</span>
//                     ) : (
//                       <span className="font-semibold">₹{order.shipping.toFixed(2)}</span>
//                     )}
//                   </div>
//                   <div className="pt-3 border-t border-gray-200">
//                     <div className="flex justify-between">
//                       <span className="font-semibold text-[#111827]">Total</span>
//                       <span className="text-xl font-bold text-[#D97706]">
//                         ₹{order.total.toFixed(2)}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex flex-col sm:flex-row gap-4 mb-8">
//             <button className="flex-1 bg-white border-2 border-[#D97706] text-[#D97706] py-4 rounded-full hover:bg-[#E8F5E9] transition-all font-semibold flex items-center justify-center gap-2">
//               <Download size={20} />
//               Download Invoice
//             </button>
//             <Link href="/products" className="flex-1">
//               <button className="w-full bg-[#D97706] text-white py-4 rounded-full hover:bg-[#7CB342] transition-all font-semibold flex items-center justify-center gap-2">
//                 Continue Shopping
//                 <ArrowRight size={20} />
//               </button>
//             </Link>
//           </div>

//           {/* What's Next */}
//           <div className="bg-white rounded-2xl soft-shadow p-6">
//             <h3 className="text-lg font-semibold text-[#111827] mb-4">
//               What happens next?
//             </h3>
//             <div className="space-y-4">
//               <div className="flex gap-4">
//                 <div className="w-8 h-8 bg-[#E8F5E9] rounded-full flex items-center justify-center flex-shrink-0">
//                   <span className="text-[#D97706] font-semibold">1</span>
//                 </div>
//                 <div>
//                   <h4 className="font-semibold text-[#111827] mb-1">Order Confirmation</h4>
//                   <p className="text-sm text-gray-600">
//                     You&apos;ll receive an order confirmation email with order details
//                   </p>
//                 </div>
//               </div>
//               <div className="flex gap-4">
//                 <div className="w-8 h-8 bg-[#E8F5E9] rounded-full flex items-center justify-center flex-shrink-0">
//                   <span className="text-[#D97706] font-semibold">2</span>
//                 </div>
//                 <div>
//                   <h4 className="font-semibold text-[#111827] mb-1">Order Processing</h4>
//                   <p className="text-sm text-gray-600">
//                     We&apos;ll prepare your order for shipping within 24 hours
//                   </p>
//                 </div>
//               </div>
//               <div className="flex gap-4">
//                 <div className="w-8 h-8 bg-[#E8F5E9] rounded-full flex items-center justify-center flex-shrink-0">
//                   <span className="text-[#D97706] font-semibold">3</span>
//                 </div>
//                 <div>
//                   <h4 className="font-semibold text-[#111827] mb-1">Shipping Updates</h4>
//                   <p className="text-sm text-gray-600">
//                     Track your order with shipping updates sent to your email
//                   </p>
//                 </div>
//               </div>
//               <div className="flex gap-4">
//                 <div className="w-8 h-8 bg-[#E8F5E9] rounded-full flex items-center justify-center flex-shrink-0">
//                   <span className="text-[#D97706] font-semibold">4</span>
//                 </div>
//                 <div>
//                   <h4 className="font-semibold text-[#111827] mb-1">Delivery</h4>
//                   <p className="text-sm text-gray-600">
//                     Expect delivery within 2-3 business days
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>

//       <Footer />
//     </div>
//   );
// }

'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Order } from '@/lib/types/checkout';
import { CheckCircle, Package, MapPin, CreditCard, Download, ArrowRight, Calendar, Hash, IndianRupee } from 'lucide-react';
import Image from 'next/image';

type PaymentMethodKey = 'cod' | 'upi' | 'card' | 'netbanking';


export default function OrderConfirmationPage() {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);


  const handleDownloadInvoice = async () => {
    console.log("🧾 Download Invoice clicked");

    if (!order) {
      console.error("❌ order is null");
      return;
    }

    console.log("📦 Order object:", order);
    console.log("🆔 order._id:", order.id);

    // if (!order._id) {
    //   console.error("❌ order._id missing");
    //   alert("Order ID missing");
    //   return;
    // }

    // const apiUrl = `/api/order/invoice?orderId=${order._id}`;

    console.log("🆔 order.id:", order.id);

    if (!order.id) {
      alert("Order ID missing");
    }

    const apiUrl = `/api/order/invoice?orderId=${order.id}`;

    console.log("🌐 Fetching Invoice API:", apiUrl);

    try {
      const res = await fetch(apiUrl);

      console.log("📥 Raw response:", res);
      console.log("📥 Response status:", res.status);
      console.log("📥 Response ok?:", res.ok);

      const text = await res.text();
      console.log("📥 Raw response text:", text);

      let data;
      try {
        data = JSON.parse(text);
        console.log("📥 Parsed JSON:", data);
      } catch (e) {
        console.error("❌ Failed to parse JSON", e);
        throw new Error("Invalid JSON from server");
      }

      if (!res.ok) {
        console.error("❌ API returned error:", data);
        throw new Error(`Failed to fetch invoice (${res.status})`);
      }

      if (!data.success || !data.invoice) {
        console.error("❌ success=false or invoice missing", data);
        throw new Error("Invoice not available");
      }

      console.log("✅ Invoice fetched successfully");

      const blob = new Blob(
        [JSON.stringify(data.invoice, null, 2)],
        { type: "application/json" }
      );

      const url = window.URL.createObjectURL(blob);
      console.log("⬇️ Download URL created:", url);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${data.invoice.invoiceNumber}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
      console.log("✅ Invoice download triggered");
    } catch (err) {
      console.error("🔥 Invoice download error (FINAL):", err);
      alert("Unable to download invoice");
    }
  };


  const resolveImage = (image?: string) => {
    if (!image) return "/images/placeholder.png";

    if (image.startsWith("http")) return image;

    return `http://localhost:3000/${image.replace(/^\/+/, "")}`;
  };



  useEffect(() => {
    console.log("📦 OrderConfirmationPage mounted");
    async function loadOrder() {
      console.log("🔍 Fetching order...");
      const localOrder = localStorage.getItem("lastOrder");
      if (localOrder) {
        console.log("✅ Loaded order from localStorage");
        setOrder(JSON.parse(localOrder));
        setLoading(false);
        return;
      }
      try {
        const storedOrderId = localStorage.getItem("lastOrderId");
        const storedUserId = localStorage.getItem("userId");
        console.log("🔑 lastOrderId in localStorage:", localStorage.getItem("lastOrderId"));
        console.log("🔑 stored userId:", localStorage.getItem("userId"));
        if (!storedOrderId || !storedUserId) {
          console.warn("⚠ Missing lastOrderId or userId in localStorage");
          setLoading(false);
          return;
        }
        const apiUrl = `http://localhost:3000/api/order?id=${storedOrderId}&userId=${storedUserId}`;
        console.log("🌐 API URL:", apiUrl);
        const response = await fetch(apiUrl);
        console.log("📥 API Raw Response:", response);
        const data = await response.json();
        console.log("📥 API JSON:", data);
        if (data?.success && data.order) {
          console.log("✅ Order found:", data.order);
          setOrder(data.order);
        } else {
          console.error("❌ Order not found in API response:", data);
        }
      } catch (error) {
        console.error("🔥 Error loading order:", error);
      } finally {
        console.log("⏹ Stopping loading...");
        setLoading(false);
      }
    }
    loadOrder();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-amber-50 to-orange-50">
        <Header />
        <main className="flex-grow flex items-center justify-center px-4">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
            <p className="text-lg font-medium text-gray-700">Loading your order details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-amber-50 to-orange-50">
        <Header />
        <main className="flex-grow flex items-center justify-center px-4">
          <div className="text-center max-w-md bg-white rounded-2xl shadow-sm p-10">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">No Order Found</h2>
            <p className="text-gray-600 mb-8">Unable to retrieve order details. Please try again later.</p>
            <Link href="/products">
              <button className="bg-amber-600 text-white px-8 py-4 rounded-xl hover:bg-amber-700 transition-all shadow-sm font-medium">
                Continue Shopping
              </button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // const paymentMethodNames = {
  //   cod: 'Cash on Delivery',
  //   upi: 'UPI Payment',
  //   card: 'Credit/Debit Card',
  //   netbanking: 'Net Banking',
  // };

  const paymentMethodNames: Record<PaymentMethodKey, string> = {
    cod: 'Cash on Delivery',
    upi: 'UPI Payment',
    card: 'Credit/Debit Card',
    netbanking: 'Net Banking',
  };


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-amber-50 to-orange-50">
      <Header />
      <main className="flex-grow py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Success Header */}
          <div className="mb-12 text-center">
            <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <CheckCircle className="w-14 h-14 text-amber-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Thank you for your purchase! Your order <span className="font-bold text-amber-600">#{order.orderNumber}</span> has been placed successfully.
            </p>
            {/* <p className="text-sm text-gray-500 mt-3">{formatDate(order.date)}</p> */}
          </div>

          {/* Main Order Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 mb-8 overflow-hidden">
            {/* Order Summary Header */}
            <div className="bg-gradient-to-r from-amber-600 to-yellow-500 px-8 py-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-white">
                <div>
                  <h2 className="text-2xl font-bold">Order Summary</h2>
                  {/* <p className="text-amber-50">Placed on {formatDate(order.date)}</p> */}
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">₹{order.total.toFixed(2)}</div>
                  <div className="text-amber-100">{order.items.length} item{order.items.length > 1 ? 's' : ''}</div>
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div className="p-6 md:p-8 space-y-8">
              {/* Shipping Information */}
              <div className="bg-gradient-to-r from-gray-50 to-amber-50 rounded-xl p-6 border border-amber-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Shipping Address</h3>
                </div>
                <div className="ml-13">
                  <p className="font-semibold text-gray-900 text-lg">{order.shippingAddress.fullName}</p>
                  <p className="text-gray-700 mt-1 leading-relaxed">
                    {order.shippingAddress.addressLine1}<br />
                    {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                  </p>
                  <p className="text-gray-700 mt-3 font-medium">📱 +91 {order.shippingAddress.phone}</p>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-gradient-to-r from-gray-50 to-amber-50 rounded-xl p-6 border border-amber-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Payment Method</h3>
                </div>
                <div className="ml-13">
                  {/* <p className="font-semibold text-gray-900 text-lg">{paymentMethodNames[order.payment?.method]}</p> */}

                  <p className="font-semibold text-gray-900 text-lg">
                    {paymentMethodNames[order.paymentMethod as PaymentMethodKey]}
                  </p>
                  {/* <p className="text-green-600 font-medium mt-2 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Payment Successful
                  </p> */}
                </div>
              </div>

              {/* Order Items */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                    <Package className="w-6 h-6 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Order Items</h3>
                </div>
                <div className="space-y-4">
                {order.items.map((item, index) => {
  const unitPrice =
    typeof item.price === "number"
      ? item.price
      : typeof (item as any).unitPrice === "number"
      ? (item as any).unitPrice
      : 0;

  return (
    <div
      key={index}
      className="flex items-center gap-5 p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all border border-gray-200"
    >
      {/* PRODUCT IMAGE */}
      <div className="relative w-20 h-20 bg-white rounded-xl overflow-hidden shadow-sm flex-shrink-0 border border-gray-300">
        <Image
          src={resolveImage(item.image)}
          alt={item.productName || "Ordered product image"}
          fill
          className="object-cover"
          unoptimized={resolveImage(item.image).startsWith("http")}
        />
      </div>

      {/* PRODUCT INFO */}
      <div className="flex-1">
        <h4 className="font-semibold text-gray-900 text-lg">
          {item.productName}
        </h4>
        <p className="text-gray-600 mt-1">
          Quantity: <span className="font-medium">{item.quantity}</span>
        </p>
      </div>

      {/* PRICE */}
      <div className="text-right">
        <p className="font-bold text-amber-600 text-xl">
          ₹{(item.quantity * unitPrice).toFixed(2)}
        </p>
        <p className="text-sm text-gray-500">
          ₹{unitPrice.toFixed(2)} each
        </p>
      </div>
    </div>
  );
})}

                </div>
              </div>

              {/* Price Breakdown */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-5 flex items-center gap-3">
                  <IndianRupee className="w-7 h-7 text-amber-600" />
                  Price Details
                </h3>
                <div className="space-y-4 text-lg">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span className="font-medium">₹{order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Tax (GST)</span>
                    <span className="font-medium">₹{order.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Shipping</span>
                    <span className="font-medium text-amber-600">
                      {order.shipping === 0 ? 'FREE' : `₹${order.shipping}`}
                    </span>
                  </div>
                  <div className="border-t-2 border-amber-300 pt-4">
                    <div className="flex justify-between">
                      <span className="text-xl font-bold text-gray-900">Total Amount</span>
                      <span className="text-2xl font-bold text-amber-600">₹{order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
            <button
              onClick={handleDownloadInvoice}
              className="flex-1 flex items-center justify-center gap-3 bg-white border-2 border-gray-300 text-gray-800 px-8 py-4 rounded-xl hover:bg-gray-50 transition-all shadow-sm font-medium"
            >
              <Download className="w-6 h-6" />
              Download Invoice
            </button>

            <Link href="/products" className="flex-1">
              <button className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-4 rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg font-medium text-lg">
                Continue Shopping
                <ArrowRight className="w-6 h-6" />
              </button>
            </Link>
          </div>

          {/* Help Section */}
          <div className="mt-12 text-center">
            <p className="text-gray-600">
              Need help with your order?{' '}
              <Link href="/contact" className="font-semibold text-amber-600 hover:text-amber-700 hover:underline">
                Contact Support
              </Link>
            </p>
            <p className="text-sm text-gray-500 mt-2">We're here to help you 24/7</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}