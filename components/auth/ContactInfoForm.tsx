'use client';

import { useState } from 'react';
import { User, Mail, Lock, Phone, Globe } from 'lucide-react';

interface ContactInfoFormProps {
  onSubmit: (data: {
    contactPerson: string;
    email: string;
    password: string;
    phone: string;
    alternatePhone?: string;
    website?: string;
  }) => void;
  initialData?: {
    contactPerson: string;
    email: string;
    password: string;
    phone: string;
    alternatePhone?: string;
    website?: string;
  };
}

export default function ContactInfoForm({ onSubmit, initialData }: ContactInfoFormProps) {
  const [formData, setFormData] = useState({
    contactPerson: initialData?.contactPerson || '',
    email: initialData?.email || '',
    password: initialData?.password || '',
    confirmPassword: '',
    phone: initialData?.phone || '',
    alternatePhone: initialData?.alternatePhone || '',
    website: initialData?.website || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Contact Person
    if (!formData.contactPerson.trim()) {
      newErrors.contactPerson = 'Contact person name is required';
    }

    // Email
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    // Password
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }

    // Confirm Password
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Phone
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number (10 digits, starts with 6-9)';
    }

    // Alternate Phone (optional)
    if (formData.alternatePhone && !/^[6-9]\d{9}$/.test(formData.alternatePhone)) {
      newErrors.alternatePhone = 'Invalid phone number';
    }

    // Website (optional)
    if (formData.website && !/^https?:\/\/.+\..+/.test(formData.website)) {
      newErrors.website = 'Invalid website URL (must start with http:// or https://)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const { confirmPassword, ...submitData } = formData;
      onSubmit(submitData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Contact Person */}
      <div>
        <label className="block text-sm font-medium text-[#111827] mb-2">
          Contact Person Name *
        </label>
        <div className="relative">
          <input
            type="text"
            value={formData.contactPerson}
            onChange={(e) => handleChange('contactPerson', e.target.value)}
            className={`w-full px-4 py-3 pl-11 border ${errors.contactPerson ? 'border-red-500' : 'border-gray-300'
              } rounded-xl focus:outline-none focus:border-[#D97706] transition-colors`}
            placeholder="John Doe"
          />
          <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
        {errors.contactPerson && (
          <p className="text-xs text-red-500 mt-1">{errors.contactPerson}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-[#111827] mb-2">
          Business Email *
        </label>
        <div className="relative">
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className={`w-full px-4 py-3 pl-11 border ${errors.email ? 'border-red-500' : 'border-gray-300'
              } rounded-xl focus:outline-none focus:border-[#D97706] transition-colors`}
            placeholder="business@example.com"
          />
          <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
        {errors.email && (
          <p className="text-xs text-red-500 mt-1">{errors.email}</p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-[#111827] mb-2">
            Password *
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              className={`w-full px-4 py-3 pl-11 border ${errors.password ? 'border-red-500' : 'border-gray-300'
                } rounded-xl focus:outline-none focus:border-[#D97706] transition-colors`}
              placeholder="••••••••"
            />
            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          {errors.password && (
            <p className="text-xs text-red-500 mt-1">{errors.password}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Min 8 characters, 1 uppercase, 1 lowercase, 1 number
          </p>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-[#111827] mb-2">
            Confirm Password *
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              className={`w-full px-4 py-3 pl-11 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                } rounded-xl focus:outline-none focus:border-[#D97706] transition-colors`}
              placeholder="••••••••"
            />
            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>
          )}
        </div>
      </div>

      {/* Show Password Toggle */}
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={showPassword}
          onChange={(e) => setShowPassword(e.target.checked)}
          className="w-4 h-4 text-[#D97706] focus:ring-[#D97706] rounded"
        />
        <span className="text-sm text-gray-700">Show passwords</span>
      </label>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-[#111827] mb-2">
            Primary Phone Number *
          </label>
          <div className="relative">
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className={`w-full px-4 py-3 pl-11 border ${errors.phone ? 'border-red-500' : 'border-gray-300'
                } rounded-xl focus:outline-none focus:border-[#D97706] transition-colors`}
              placeholder="9322506730"
              maxLength={10}
            />
            <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          {errors.phone && (
            <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
          )}
        </div>

        {/* Alternate Phone */}
        <div>
          <label className="block text-sm font-medium text-[#111827] mb-2">
            Alternate Phone (Optional)
          </label>
          <div className="relative">
            <input
              type="tel"
              value={formData.alternatePhone}
              onChange={(e) => handleChange('alternatePhone', e.target.value)}
              className={`w-full px-4 py-3 pl-11 border ${errors.alternatePhone ? 'border-red-500' : 'border-gray-300'
                } rounded-xl focus:outline-none focus:border-[#D97706] transition-colors`}
              placeholder="9322506730"
              maxLength={10}
            />
            <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          {errors.alternatePhone && (
            <p className="text-xs text-red-500 mt-1">{errors.alternatePhone}</p>
          )}
        </div>
      </div>

      {/* Website */}
      <div>
        <label className="block text-sm font-medium text-[#111827] mb-2">
          Website (Optional)
        </label>
        <div className="relative">
          <input
            type="url"
            value={formData.website}
            onChange={(e) => handleChange('website', e.target.value)}
            className={`w-full px-4 py-3 pl-11 border ${errors.website ? 'border-red-500' : 'border-gray-300'
              } rounded-xl focus:outline-none focus:border-[#D97706] transition-colors`}
            placeholder="https://www.yourbusiness.com"
          />
          <Globe size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
        {errors.website && (
          <p className="text-xs text-red-500 mt-1">{errors.website}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-[#D97706] text-white py-4 rounded-full hover:bg-[#B45309] transition-all font-semibold shadow-md hover:shadow-lg"
      >
        Continue to Business Address
      </button>
    </form>
  );
}