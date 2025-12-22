'use client';

import { useEffect, useState } from 'react';
import { CheckCircle } from 'lucide-react';

interface AddToCartToastProps {
  show: boolean;
  productName: string;
  onClose: () => void;
}

export default function AddToCartToast({ show, productName, onClose }: AddToCartToastProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed top-24 right-4 bg-white rounded-2xl soft-shadow p-4 flex items-center gap-3 z-50 animate-slide-in">
      <div className="w-10 h-10 bg-[#E8F5E9] rounded-full flex items-center justify-center">
        <CheckCircle size={20} className="text-[#D97706]" />
      </div>
      <div>
        <p className="font-semibold text-[#111827] text-sm">Added to cart!</p>
        <p className="text-xs text-gray-600">{productName}</p>
      </div>
    </div>
  );
}