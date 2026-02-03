'use client';

import { useState } from 'react';
import { Tag, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface CartSummaryProps {
  subtotal: number;
  itemCount: number;
}

export default function CartSummary({ subtotal, itemCount }: CartSummaryProps) {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponError, setCouponError] = useState('');

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
  const tax = subtotalAfterDiscount * 0.18; // 18% GST
  const shipping = subtotal >= 500 ? 0 : 20; // Free shipping above ₹500
  const platformFee = 5;
  const total = subtotalAfterDiscount + tax + shipping + platformFee;

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

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tax (GST 18%)</span>
          <span className="font-semibold text-[#111827]">
            ₹{tax.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          {shipping === 0 ? (
            <span className="font-semibold text-[#D97706]">FREE</span>
          ) : (
            <span className="font-semibold text-[#111827]">
              ₹{shipping.toFixed(2)}
            </span>
          )}
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Platform Fee</span>
          <span className="font-semibold text-[#111827]">
            ₹{platformFee.toFixed(2)}
          </span>
        </div>

        {shipping > 0 && subtotal < 500 && (
          <p className="text-xs text-gray-500">
            Add ₹{(500 - subtotal).toFixed(0)} more for FREE shipping
          </p>
        )}
      </div>

      {/* Total */}
      <div className="flex justify-between items-baseline mb-6">
        <span className="text-lg font-semibold text-[#111827]">Total</span>
        <div className="text-right">
          <span className="text-2xl font-bold text-[#D97706]">
            ₹{total.toFixed(2)}
          </span>
          <p className="text-xs text-gray-500">inclusive of all taxes</p>
        </div>
      </div>

      {/* Checkout Button */}
      <Link href="/checkout">
        <button className="w-full bg-[#D97706] text-white py-4 rounded-full hover:bg-[#B45309] transition-all font-semibold shadow-md hover:shadow-lg flex items-center justify-center gap-2 group">
          <span>Proceed to Checkout</span>
          <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </Link>

      {/* Continue Shopping */}
      <Link href="/products">
        <button className="w-full mt-3 border-2 border-gray-300 text-[#111827] py-3 rounded-full hover:border-[#D97706] hover:text-[#D97706] transition-all font-medium">
          Continue Shopping
        </button>
      </Link>

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