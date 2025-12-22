'use client';

import { useState } from 'react';
import { PaymentMethod as PaymentMethodType } from '@/lib/types/checkout';
import { CreditCard, Smartphone, Building2, Banknote, CheckCircle } from 'lucide-react';

interface PaymentMethodProps {
  onSubmit: (method: PaymentMethodType) => void;
  initialMethod?: PaymentMethodType;
}

export default function PaymentMethod({ onSubmit, initialMethod }: PaymentMethodProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>(initialMethod || 'cod');

  const paymentMethods = [
    {
      id: 'cod' as PaymentMethodType,
      name: 'Cash on Delivery',
      description: 'Pay with cash when you receive your order',
      icon: Banknote,
      popular: true,
    },
    {
      id: 'upi' as PaymentMethodType,
      name: 'UPI Payment',
      description: 'Pay via Google Pay, PhonePe, Paytm, etc.',
      icon: Smartphone,
      popular: true,
    },
    {
      id: 'card' as PaymentMethodType,
      name: 'Credit/Debit Card',
      description: 'Visa, MasterCard, RuPay, American Express',
      icon: CreditCard,
      popular: false,
    },
    {
      id: 'netbanking' as PaymentMethodType,
      name: 'Net Banking',
      description: 'All major banks supported',
      icon: Building2,
      popular: false,
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(selectedMethod);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-2xl soft-shadow p-6">
        <h2 className="text-xl font-semibold text-[#111827] mb-6 flex items-center gap-2">
          <CreditCard size={24} className="text-[#D97706]" />
          Payment Method
        </h2>

        <div className="space-y-4">
          {paymentMethods.map((method) => {
            const Icon = method.icon;
            const isSelected = selectedMethod === method.id;

            return (
              <label
                key={method.id}
                className={`block cursor-pointer transition-all ${
                  isSelected ? 'scale-[1.02]' : 'hover:scale-[1.01]'
                }`}
              >
                <div
                  className={`relative p-5 border-2 rounded-2xl transition-all ${
                    isSelected
                      ? 'border-[#D97706] bg-[#E8F5E9] shadow-md'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Radio Button */}
                    <div className="flex items-center h-6">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={isSelected}
                        onChange={(e) => setSelectedMethod(e.target.value as PaymentMethodType)}
                        className="w-5 h-5 text-[#D97706] focus:ring-[#D97706]"
                      />
                    </div>

                    {/* Icon */}
                    <div
                      className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
                        isSelected ? 'bg-[#D97706] text-white' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      <Icon size={24} />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-[#111827]">{method.name}</h3>
                        {method.popular && (
                          <span className="text-xs bg-[#D97706] text-white px-2 py-0.5 rounded-full">
                            Popular
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{method.description}</p>
                    </div>

                    {/* Check Icon */}
                    {isSelected && (
                      <CheckCircle size={24} className="text-[#D97706] flex-shrink-0" />
                    )}
                  </div>

                  {/* Additional Info for Selected Method */}
                  {isSelected && method.id === 'cod' && (
                    <div className="mt-4 pt-4 border-t border-[#D97706]/20">
                      <div className="flex items-start gap-2 text-sm text-gray-700">
                        <div className="w-5 h-5 bg-[#D97706] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white text-xs">ℹ</span>
                        </div>
                        <p>
                          Please keep exact change ready. Our delivery partner will collect ₹{' '}
                          <span className="font-semibold">amount</span> at the time of delivery.
                        </p>
                      </div>
                    </div>
                  )}

                  {isSelected && method.id === 'upi' && (
                    <div className="mt-4 pt-4 border-t border-[#D97706]/20">
                      <p className="text-sm text-gray-700 mb-3">
                        You&apos;ll be redirected to complete payment after placing order
                      </p>
                      <div className="flex gap-3">
                        <img src="/images/gpay.png" alt="Google Pay" className="h-8" onError={(e) => e.currentTarget.style.display = 'none'} />
                        <img src="/images/phonepe.png" alt="PhonePe" className="h-8" onError={(e) => e.currentTarget.style.display = 'none'} />
                        <img src="/images/paytm.png" alt="Paytm" className="h-8" onError={(e) => e.currentTarget.style.display = 'none'} />
                      </div>
                    </div>
                  )}

                  {isSelected && method.id === 'card' && (
                    <div className="mt-4 pt-4 border-t border-[#D97706]/20">
                      <p className="text-sm text-gray-700 mb-3">
                        Secure payment via encrypted gateway
                      </p>
                      <div className="flex gap-3">
                        <div className="px-3 py-1 bg-white rounded border border-gray-300 text-xs font-semibold">
                          VISA
                        </div>
                        <div className="px-3 py-1 bg-white rounded border border-gray-300 text-xs font-semibold">
                          MASTERCARD
                        </div>
                        <div className="px-3 py-1 bg-white rounded border border-gray-300 text-xs font-semibold">
                          RUPAY
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </label>
            );
          })}
        </div>

        {/* Security Badge */}
        <div className="mt-6 p-4 bg-[#E8F5E9] rounded-xl flex items-center gap-3">
          <div className="w-10 h-10 bg-[#D97706] rounded-full flex items-center justify-center flex-shrink-0">
            <CheckCircle size={20} className="text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-[#111827] text-sm">100% Secure Payment</h4>
            <p className="text-xs text-gray-600">
              Your payment information is encrypted and secure
            </p>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-[#D97706] text-white py-4 rounded-full hover:bg-[#7CB342] transition-all font-semibold shadow-md hover:shadow-lg"
      >
        Review Order
      </button>
    </form>
  );
}