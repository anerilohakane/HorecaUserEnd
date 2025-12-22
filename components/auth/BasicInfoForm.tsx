'use client';

import { useState } from 'react';
import { BusinessType, BusinessSize } from '@/lib/types/user';
import { Building2, Users, Calendar, Store, Coffee, UtensilsCrossed, Hotel, ChefHat, ShoppingBag, Factory, Truck } from 'lucide-react';

interface BasicInfoFormProps {
  onSubmit: (data: {
    businessName: string;
    businessType: BusinessType;
    businessSize: BusinessSize;
    yearEstablished: number;
  }) => void;
  initialData?: {
    businessName: string;
    businessType: BusinessType;
    businessSize: BusinessSize;
    yearEstablished: number;
  };
}

export default function BasicInfoForm({ onSubmit, initialData }: BasicInfoFormProps) {
  const [formData, setFormData] = useState({
    businessName: initialData?.businessName || '',
    businessType: initialData?.businessType || '' as BusinessType,
    businessSize: initialData?.businessSize || '' as BusinessSize,
    yearEstablished: initialData?.yearEstablished || new Date().getFullYear(),
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const businessTypes = [
    { id: 'bakery' as BusinessType, name: 'Bakery', icon: Store, desc: 'Bread, cakes, pastries' },
    { id: 'cafe' as BusinessType, name: 'Café', icon: Coffee, desc: 'Coffee shop, snacks' },
    { id: 'restaurant' as BusinessType, name: 'Restaurant', icon: UtensilsCrossed, desc: 'Fine dining, QSR' },
    { id: 'hotel' as BusinessType, name: 'Hotel', icon: Hotel, desc: 'Hospitality, catering' },
    { id: 'catering' as BusinessType, name: 'Catering Service', icon: ChefHat, desc: 'Event catering' },
    { id: 'retail' as BusinessType, name: 'Retail Store', icon: ShoppingBag, desc: 'Grocery, supermarket' },
    { id: 'manufacturer' as BusinessType, name: 'Manufacturer', icon: Factory, desc: 'Food production' },
    { id: 'distributor' as BusinessType, name: 'Distributor', icon: Truck, desc: 'Wholesale supplier' },
  ];

  const businessSizes = [
    { id: 'individual' as BusinessSize, name: 'Individual/Freelancer', range: '< ₹10L/year' },
    { id: 'small' as BusinessSize, name: 'Small Business', range: '₹10L - ₹50L/year' },
    { id: 'medium' as BusinessSize, name: 'Medium Business', range: '₹50L - ₹5Cr/year' },
    { id: 'large' as BusinessSize, name: 'Large Business', range: '₹5Cr - ₹25Cr/year' },
    { id: 'enterprise' as BusinessSize, name: 'Enterprise', range: '> ₹25Cr/year' },
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.businessName.trim()) {
      newErrors.businessName = 'Business name is required';
    } else if (formData.businessName.length < 3) {
      newErrors.businessName = 'Business name must be at least 3 characters';
    }

    if (!formData.businessType) {
      newErrors.businessType = 'Please select a business type';
    }

    if (!formData.businessSize) {
      newErrors.businessSize = 'Please select a business size';
    }

    if (formData.yearEstablished > currentYear) {
      newErrors.yearEstablished = 'Year cannot be in the future';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Business Name */}
      <div>
        <label className="block text-sm font-medium text-[#111827] mb-2">
          Business Name *
        </label>
        <div className="relative">
          <input
            type="text"
            value={formData.businessName}
            onChange={(e) => handleChange('businessName', e.target.value)}
            className={`w-full px-4 py-3 pl-11 border ${
              errors.businessName ? 'border-red-500' : 'border-gray-300'
            } rounded-xl focus:outline-none focus:border-[#D97706] transition-colors`}
            placeholder="Your Business Name Pvt. Ltd."
          />
          <Building2 size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
        {errors.businessName && (
          <p className="text-xs text-red-500 mt-1">{errors.businessName}</p>
        )}
      </div>

      {/* Business Type */}
      <div>
        <label className="block text-sm font-medium text-[#111827] mb-3">
          Business Type *
        </label>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {businessTypes.map((type) => {
            const Icon = type.icon;
            const isSelected = formData.businessType === type.id;

            return (
              <label
                key={type.id}
                className={`relative cursor-pointer transition-all ${
                  isSelected ? 'scale-[1.02]' : 'hover:scale-[1.01]'
                }`}
              >
                <div
                  className={`p-4 border-2 rounded-xl transition-all ${
                    isSelected
                      ? 'border-[#D97706] bg-[#E8F5E9] shadow-md'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="businessType"
                    value={type.id}
                    checked={isSelected}
                    onChange={(e) => handleChange('businessType', e.target.value)}
                    className="sr-only"
                  />
                  <div className="flex flex-col items-center text-center">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 ${
                        isSelected ? 'bg-[#D97706] text-white' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      <Icon size={24} />
                    </div>
                    <h3 className="font-semibold text-[#111827] text-sm mb-1">
                      {type.name}
                    </h3>
                    <p className="text-xs text-gray-600">{type.desc}</p>
                  </div>
                </div>
              </label>
            );
          })}
        </div>
        {errors.businessType && (
          <p className="text-xs text-red-500 mt-2">{errors.businessType}</p>
        )}
      </div>

      {/* Business Size */}
      <div>
        <label className="block text-sm font-medium text-[#111827] mb-3">
          Business Size *
        </label>
        <div className="space-y-3">
          {businessSizes.map((size) => {
            const isSelected = formData.businessSize === size.id;

            return (
              <label
                key={size.id}
                className="block cursor-pointer"
              >
                <div
                  className={`p-4 border-2 rounded-xl transition-all flex items-center justify-between ${
                    isSelected
                      ? 'border-[#D97706] bg-[#E8F5E9]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="businessSize"
                      value={size.id}
                      checked={isSelected}
                      onChange={(e) => handleChange('businessSize', e.target.value)}
                      className="w-5 h-5 text-[#D97706] focus:ring-[#D97706]"
                    />
                    <div>
                      <h3 className="font-semibold text-[#111827] text-sm">
                        {size.name}
                      </h3>
                      <p className="text-xs text-gray-600">{size.range}</p>
                    </div>
                  </div>
                  <Users size={20} className={isSelected ? 'text-[#D97706]' : 'text-gray-400'} />
                </div>
              </label>
            );
          })}
        </div>
        {errors.businessSize && (
          <p className="text-xs text-red-500 mt-2">{errors.businessSize}</p>
        )}
      </div>

      {/* Year Established */}
      <div>
        <label className="block text-sm font-medium text-[#111827] mb-2">
          Year Established *
        </label>
        <div className="relative">
          <select
            value={formData.yearEstablished}
            onChange={(e) => handleChange('yearEstablished', parseInt(e.target.value))}
            className={`w-full px-4 py-3 pl-11 border ${
              errors.yearEstablished ? 'border-red-500' : 'border-gray-300'
            } rounded-xl focus:outline-none focus:border-[#D97706] transition-colors bg-white`}
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
        {errors.yearEstablished && (
          <p className="text-xs text-red-500 mt-1">{errors.yearEstablished}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-[#D97706] text-white py-4 rounded-full hover:bg-[#7CB342] transition-all font-semibold shadow-md hover:shadow-lg"
      >
        Continue to Contact Information
      </button>
    </form>
  );
}