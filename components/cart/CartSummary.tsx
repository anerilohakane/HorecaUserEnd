'use client';

import { useState } from 'react';
import { Tag, ChevronRight, AlertTriangle, ShoppingBag, Truck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { sileo } from 'sileo';

import { CartItem } from '@/lib/types/cart';
import { MOV_AMOUNT, MOV_DELIVERY_CHARGE } from '@/lib/constants/mov';

interface CartSummaryProps {
  subtotal: number;
  itemCount: number;
  items: CartItem[];
}

export default function CartSummary({ subtotal, itemCount, items }: CartSummaryProps) {
  const router = useRouter();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponError, setCouponError] = useState('');
  const [showMOVPanel, setShowMOVPanel] = useState(false);

  // Sample coupons
  const validCoupons = [
    { code: 'SAVE10', discount: 10, minOrder: 500 },
    { code: 'FIRST20', discount: 20, minOrder: 1000 },
    { code: 'BULK15', discount: 15, minOrder: 2000 },
  ];

  const applyCoupon = () => {
    const coupon = validCoupons.find(
      (c) => c.code.toLowerCase() === couponCode.toLowerCase()
    );

    if (!coupon) {
      setCouponError('Invalid coupon code');
      setAppliedCoupon(null);
      return;
    }

    if (subtotal < coupon.minOrder) {
      setCouponError(`Minimum order of ₹${coupon.minOrder} required`);
      setAppliedCoupon(null);
      return;
    }

    setAppliedCoupon({ code: coupon.code, discount: coupon.discount });
    setCouponError('');
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  // Calculations
  const discount = appliedCoupon ? (subtotal * appliedCoupon.discount) / 100 : 0;
  const subtotalAfterDiscount = subtotal - discount;

  // Dynamic GST calculation using category-specific price (item.price fallback to product.price)
  const totalTaxRaw = items.reduce((acc, item) => {
    const itemPrice = (item as any).price ?? item.product.price;
    const qty = item.quantity;
    const gstRate = item.product.gst || 0;
    return acc + (itemPrice * qty * (gstRate / 100));
  }, 0);

  // Apply discount proportionally to the tax if a coupon is used
  const discountRatio = subtotal > 0 ? subtotalAfterDiscount / subtotal : 1;
  const tax = totalTaxRaw * discountRatio;
  const shipping = 0;      // Removed - no shipping charges
  const platformFee = 0;   // Removed - no platform fee

  // Grand Total (subtotal + GST) — this is what MOV is evaluated against
  const grandTotal = subtotalAfterDiscount + tax;

  // MOV helpers
  const isBelowMOV = grandTotal < MOV_AMOUNT;
  const movShortfall = Math.max(0, MOV_AMOUNT - grandTotal);

  // Checkout handler — intercepts if below MOV
  const handleCheckout = () => {
    if (!isBelowMOV) {
      // Above MOV → clear any previous MOV flag and go directly
      sessionStorage.removeItem('mov_applied');
      router.push('/checkout');
      return;
    }
    // Below MOV → notify and show inline confirmation panel
    sileo.warning({
      title: 'Minimum Order Value Not Met',
      description: `Add ₹${movShortfall.toFixed(0)} more to avoid a ₹${MOV_DELIVERY_CHARGE} delivery charge.`,
    });
    setShowMOVPanel(true);
  };

  // User agrees to pay delivery charge
  const handleContinueWithCharge = () => {
    sessionStorage.setItem('mov_applied', 'true');
    setShowMOVPanel(false);
    router.push('/checkout');
  };

  return (
    <div className="bg-white rounded-2xl soft-shadow p-6 sticky top-24">
      <h2 className="text-xl font-semibold text-[#111827] mb-6">
        Order Summary
      </h2>

      {/* Price Breakdown */}
      <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal ({itemCount} items)</span>
          <span className="font-semibold text-[#111827]">
            ₹{subtotal.toFixed(2)}
          </span>
        </div>

        {appliedCoupon && (
          <div className="flex justify-between text-sm">
            <span className="text-[#D97706]">Coupon Discount</span>
            <span className="font-semibold text-[#D97706]">
              -₹{discount.toFixed(2)}
            </span>
          </div>
        )}

        {(() => {
          const distinctRates = Array.from(new Set(items.map(item => item.product.gst || 0)));
          const rateLabel = distinctRates.length === 1 ? `${distinctRates[0]}%` : distinctRates.map(r => `${r}%`).join(', ');

          return (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">GST ({rateLabel})</span>
              <span className="font-semibold text-[#111827]">
                ₹{tax.toFixed(2)}
              </span>
            </div>
          );
        })()}

      </div>

      {/* MOV Progress Banner */}
      {isBelowMOV && !showMOVPanel && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Truck size={14} className="text-amber-600 flex-shrink-0" />
            <p className="text-xs font-semibold text-amber-800">
              Add ₹{movShortfall.toFixed(0)} more for free delivery
            </p>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-amber-100 rounded-full h-1.5">
            <div
              className="bg-amber-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (grandTotal / MOV_AMOUNT) * 100)}%` }}
            />
          </div>
          <p className="text-xs text-amber-600 mt-1.5">
            ₹{grandTotal.toFixed(0)} / ₹{MOV_AMOUNT.toLocaleString('en-IN')} (incl. GST)
          </p>
        </div>
      )}

      {/* MOV Inline Confirmation Panel */}
      {showMOVPanel && (
        <div className="mb-4 p-4 bg-amber-50 border-2 border-amber-300 rounded-xl">
          <div className="flex items-start gap-2 mb-3">
            <AlertTriangle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-amber-900">Below Minimum Order Value</p>
              <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
                Your order total <strong>₹{grandTotal.toFixed(0)}</strong> is below the{' '}
                <strong>₹{MOV_AMOUNT.toLocaleString('en-IN')}</strong> MOV. A delivery charge of{' '}
                <strong>₹{MOV_DELIVERY_CHARGE}</strong> will be added.
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowMOVPanel(false)}
              className="flex-1 py-2.5 px-3 text-xs font-semibold border border-amber-400 text-amber-800 rounded-lg hover:bg-amber-100 transition-colors"
            >
              <ShoppingBag size={12} className="inline mr-1" />
              Add More Items
            </button>
            <button
              onClick={handleContinueWithCharge}
              className="flex-1 py-2.5 px-3 text-xs font-bold bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors shadow-sm"
            >
              Continue + ₹{MOV_DELIVERY_CHARGE}
            </button>
          </div>
        </div>
      )}

      {/* Total */}
      <div className="flex justify-between items-baseline mb-6">
        <span className="text-lg font-semibold text-[#111827]">Total</span>
        <div className="text-right">
          <span className="text-2xl font-bold text-[#D97706]">
            ₹{grandTotal.toFixed(2)}
          </span>
          <p className="text-xs text-gray-500">inclusive of all taxes</p>
        </div>
      </div>

      {/* Checkout Button */}
      <button
        id="cart-checkout-btn"
        onClick={handleCheckout}
        className="w-full bg-[#D97706] text-white py-4 rounded-full hover:bg-[#B45309] transition-all font-semibold shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
      >
        <span>Proceed to Checkout</span>
        <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
      </button>

      {/* Continue Shopping */}
      <button
        onClick={() => router.push('/products')}
        className="w-full mt-3 border-2 border-gray-300 text-[#111827] py-3 rounded-full hover:border-[#D97706] hover:text-[#D97706] transition-all font-medium"
      >
        Continue Shopping
      </button>

      {/* Trust Badges */}
      <div className="mt-6 pt-6 border-t border-gray-200 space-y-2">
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <div className="w-5 h-5 bg-[#E8F5E9] rounded-full flex items-center justify-center">
            <span className="text-[#D97706]">✓</span>
          </div>
          <span>Secure checkout with SSL encryption</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <div className="w-5 h-5 bg-[#E8F5E9] rounded-full flex items-center justify-center">
            <span className="text-[#D97706]">✓</span>
          </div>
          <span>100% Money-back guarantee</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <div className="w-5 h-5 bg-[#E8F5E9] rounded-full flex items-center justify-center">
            <span className="text-[#D97706]">✓</span>
          </div>
          <span>Fast delivery in 2-3 business days</span>
        </div>
      </div>
    </div>
  );
}