import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Banknote, CreditCard, Wallet, Truck, AlertCircle, Smartphone } from 'lucide-react';
import { MOV_AMOUNT, MOV_DELIVERY_CHARGE } from '@/lib/constants/mov';
import { sileo } from 'sileo';
import { useRouter } from 'next/navigation';

interface NegotiatedOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  negotiation: any;
  user: any;
  addresses: any[];
  token: string;
  onSuccess: () => void;
}

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "https://horeca-backend-six.vercel.app";

export default function NegotiatedOrderModal({ 
  isOpen, 
  onClose, 
  negotiation, 
  user, 
  addresses,
  token, 
  onSuccess 
}: NegotiatedOrderModalProps) {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'cn' | 'wallet' | 'upi'>('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string>(addresses?.[0]?._id || addresses?.[0]?.id || '');

  if (!isOpen || !negotiation) return null;

  const productName = negotiation.product?.name || "Product";
  const qty = negotiation.quantity || 1;
  const unitPrice = negotiation.requestedPrice || 0;
  const subtotal = qty * unitPrice;
  
  const gstRate = negotiation.product?.gst || 0;
  const gstAmount = subtotal * (gstRate / 100);
  
  const grandTotalBeforeMOV = subtotal + gstAmount;
  const isBelowMOV = grandTotalBeforeMOV < MOV_AMOUNT;
  const deliveryCharge = isBelowMOV ? MOV_DELIVERY_CHARGE : 0;
  
  const finalGrandTotal = grandTotalBeforeMOV + deliveryCharge;

  const handleConfirm = async () => {
    if (!addresses || addresses.length === 0) {
      sileo.error({ title: "No Address Found", description: "Please add a shipping address in your profile first." });
      return;
    }

    if (!selectedAddressId) {
      sileo.error({ title: "No Address Selected", description: "Please select a shipping address." });
      return;
    }

    setIsSubmitting(true);
    try {
      const selectedAddress = addresses.find((a: any, idx: number) => (a._id || a.id || String(idx)) === selectedAddressId) || addresses[0];
      const payload = {
        userId: user?.id || user?._id,
        priceNegotiationId: negotiation._id || negotiation.id,
        items: [{
          product: negotiation.product?._id || negotiation.product?.id || negotiation.product,
          quantity: qty,
          unitPrice: unitPrice
        }],
        shippingAddress: selectedAddress,
        paymentMethod: paymentMethod,
        status: "pending",
        movApplied: isBelowMOV,
        movDeliveryCharge: deliveryCharge,
        gstAmount: gstAmount,
        total: finalGrandTotal
      };

      const res = await fetch(`${API_BASE}/api/order`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (data.success) {
        sileo.success({ title: "Order Placed", description: "Your negotiated order has been placed successfully." });
        onSuccess();
        onClose();
        router.push(`/order-confirmation?order=${data.order?._id || data.order?.id}`);
      } else {
        throw new Error(data.error || "Failed to place order");
      }
    } catch (e: any) {
      console.error("Order Failed:", e);
      sileo.error({ title: "Order Failed", description: e.message || "Something went wrong." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto flex flex-col p-6 scrollbar-hide"
          >
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-[#111827]">Place Order</h2>
              <p className="text-[#6B7280] text-sm mt-1">Review the order summary and choose a payment method.</p>
            </div>

            {/* Summary Card */}
            <div className="bg-[#F9FAFB] rounded-2xl p-5 mb-6 text-sm">
              <div className="flex justify-between mb-3 text-[#4B5563]">
                <span>Product</span>
                <span className="font-medium text-[#111827] line-clamp-1 max-w-[180px] text-right">{productName}</span>
              </div>
              <div className="flex justify-between mb-3 text-[#4B5563]">
                <span>Qty × Unit Price</span>
                <span className="font-medium text-[#111827]">{qty} × ₹{unitPrice}</span>
              </div>
              
              {gstAmount > 0 && (
                <div className="flex justify-between mb-3 text-[#4B5563]">
                  <span>GST ({gstRate}%)</span>
                  <span className="font-medium text-[#111827]">₹{gstAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between mb-3 text-[#4B5563]">
                <span>Subtotal</span>
                <span className="font-medium text-[#111827]">₹{grandTotalBeforeMOV.toFixed(2)}</span>
              </div>

              {isBelowMOV && (
                <div className="flex justify-between mb-4 text-[#D97706]">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-4 h-4" /> 
                    Delivery charge <span className="text-[11px]">(below MOV ₹{MOV_AMOUNT})</span>
                  </span>
                  <span className="font-medium">+ ₹{MOV_DELIVERY_CHARGE}</span>
                </div>
              )}

              <div className="border-t border-[#E5E7EB] my-3"></div>

              <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-[#111827] text-base">Grand Total</span>
                <span className="font-bold text-emerald-600 text-lg">₹{finalGrandTotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center text-[13px] text-[#6B7280]">
                <span>Customer</span>
                <span className="text-[#4B5563]">{user?.name || 'Customer'} {user?.category ? `(Tier ${user.category})` : ''}</span>
              </div>
            </div>

            {/* Address Selection */}
            <div className="mb-6">
              <h3 className="text-[15px] font-semibold text-[#374151] mb-2">Shipping Address</h3>
              {addresses && addresses.length > 0 ? (
                <select
                  value={selectedAddressId}
                  onChange={(e) => setSelectedAddressId(e.target.value)}
                  className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm text-[#4B5563] focus:outline-none focus:ring-2 focus:ring-[#D97706]/20 focus:border-[#D97706] appearance-none bg-white cursor-pointer"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.2em 1.2em' }}
                >
                  {addresses.map((addr: any, idx: number) => {
                    const val = addr._id || addr.id || String(idx);
                    return (
                      <option key={val} value={val}>
                        {addr.fullName} - {addr.addressLine1}, {addr.city} {addr.pincode}
                      </option>
                    );
                  })}
                </select>
              ) : (
                <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  No address found. Please add one in your profile.
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="mb-8">
              <h3 className="text-[15px] font-semibold text-[#374151] mb-3">Payment Method</h3>
              <div className="grid grid-cols-2 gap-3">
                
                {/* COD */}
                <button 
                  onClick={() => setPaymentMethod('cod')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                    paymentMethod === 'cod' 
                      ? 'border-[#D97706] bg-[#FFFBEB] text-[#D97706]' 
                      : 'border-[#E5E7EB] bg-white text-[#6B7280] hover:bg-[#F9FAFB]'
                  }`}
                >
                  <Banknote className="w-6 h-6 mb-2" strokeWidth={1.5} />
                  <span className="text-[11px] font-medium leading-tight text-center">Cash on Delivery</span>
                </button>

                {/* Credit Note */}
                <button 
                  onClick={() => setPaymentMethod('cn')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                    paymentMethod === 'cn' 
                      ? 'border-[#D97706] bg-[#FFFBEB] text-[#D97706]' 
                      : 'border-[#E5E7EB] bg-white text-[#6B7280] hover:bg-[#F9FAFB]'
                  }`}
                >
                  <CreditCard className="w-6 h-6 mb-2" strokeWidth={1.5} />
                  <span className="text-[11px] font-medium leading-tight text-center">Credit Note</span>
                </button>

                {/* Wallet */}
                <button 
                  onClick={() => setPaymentMethod('wallet')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                    paymentMethod === 'wallet' 
                      ? 'border-[#D97706] bg-[#FFFBEB] text-[#D97706]' 
                      : 'border-[#E5E7EB] bg-white text-[#6B7280] hover:bg-[#F9FAFB]'
                  }`}
                >
                  <Wallet className="w-6 h-6 mb-2" strokeWidth={1.5} />
                  <span className="text-[11px] font-medium leading-tight text-center">Wallet</span>
                </button>

                {/* UPI */}
                <button 
                  onClick={() => setPaymentMethod('upi')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                    paymentMethod === 'upi' 
                      ? 'border-[#D97706] bg-[#FFFBEB] text-[#D97706]' 
                      : 'border-[#E5E7EB] bg-white text-[#6B7280] hover:bg-[#F9FAFB]'
                  }`}
                >
                  <Smartphone className="w-6 h-6 mb-2" strokeWidth={1.5} />
                  <span className="text-[11px] font-medium leading-tight text-center">UPI</span>
                </button>

              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-4 mt-auto">
              <button 
                onClick={onClose}
                className="text-[#4B5563] font-medium text-sm px-4 py-3 hover:text-[#111827] transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirm}
                disabled={isSubmitting}
                className="flex-1 bg-[#D97706] hover:bg-[#B45309] text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <span className="animate-pulse">Processing...</span>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    Confirm — ₹{finalGrandTotal.toFixed(0)}
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
