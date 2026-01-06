'use client';

import { useState } from 'react';
import { FileText, Upload, CheckCircle, X } from 'lucide-react';

interface DocumentsFormProps {
  onSubmit: (data: {
    gstNumber?: string;
    panNumber?: string;
    fssaiNumber?: string;
    tradeLicenseNumber?: string;
    monthlyPurchaseVolume?: string;
    agreeToTerms: boolean;
  }) => void;
  initialData?: any;
}

export default function DocumentsForm({ onSubmit, initialData }: DocumentsFormProps) {
  const [formData, setFormData] = useState({
    gstNumber: initialData?.gstNumber || '',
    panNumber: initialData?.panNumber || '',
    fssaiNumber: initialData?.fssaiNumber || '',
    tradeLicenseNumber: initialData?.tradeLicenseNumber || '',
    monthlyPurchaseVolume: initialData?.monthlyPurchaseVolume || '',
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, File>>({});

  const purchaseVolumes = [
    '< ₹50,000',
    '₹50,000 - ₹1 Lakh',
    '₹1 Lakh - ₹5 Lakhs',
    '₹5 Lakhs - ₹25 Lakhs',
    '> ₹25 Lakhs',
  ];

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileUpload = (docType: string, file: File) => {
    setUploadedDocs(prev => ({ ...prev, [docType]: file }));
  };

  const removeFile = (docType: string) => {
    setUploadedDocs(prev => {
      const newDocs = { ...prev };
      delete newDocs[docType];
      return newDocs;
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // GST validation (optional but if provided, validate)
    if (formData.gstNumber && !/^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/.test(formData.gstNumber)) {
      newErrors.gstNumber = 'Invalid GST format (e.g., 22AAAAA0000A1Z5)';
    }

    // PAN validation (optional but if provided, validate)
    if (formData.panNumber && !/^[A-Z]{5}\d{4}[A-Z]{1}$/.test(formData.panNumber)) {
      newErrors.panNumber = 'Invalid PAN format (e.g., ABCDE1234F)';
    }

    // FSSAI validation (optional)
    if (formData.fssaiNumber && !/^\d{14}$/.test(formData.fssaiNumber)) {
      newErrors.fssaiNumber = 'Invalid FSSAI number (14 digits)';
    }

    // Terms agreement
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
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

  const FileUploadCard = ({ label, docType, required = false }: { label: string; docType: string; required?: boolean }) => {
    const file = uploadedDocs[docType];

    return (
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-[#D97706] transition-colors">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h4 className="font-medium text-[#111827] text-sm mb-1">
              {label} {required && <span className="text-red-500">*</span>}
            </h4>
            <p className="text-xs text-gray-600">PDF, JPG, PNG (Max 5MB)</p>
          </div>
          <FileText size={20} className="text-gray-400" />
        </div>

        {file ? (
          <div className="bg-[#E8F5E9] rounded-lg p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-[#D97706]" />
              <span className="text-sm text-[#111827] truncate max-w-[200px]">
                {file.name}
              </span>
            </div>
            <button
              type="button"
              onClick={() => removeFile(docType)}
              className="text-red-500 hover:text-red-600"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center gap-2 cursor-pointer">
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(docType, file);
              }}
              className="hidden"
            />
            <Upload size={24} className="text-gray-400" />
            <span className="text-sm text-[#D97706] font-medium">Click to upload</span>
          </label>
        )}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Document Numbers */}
      <div className="bg-[#E8F5E9] rounded-2xl p-6">
        <h3 className="font-semibold text-[#111827] mb-4">Business Registration Numbers</h3>
        <p className="text-sm text-gray-700 mb-4">
          Provide your business registration numbers. These help verify your business and may be required for tax compliance.
        </p>

        <div className="space-y-4">
          {/* GST Number */}
          <div>
            <label className="block text-sm font-medium text-[#111827] mb-2">
              GST Number (Optional)
            </label>
            <input
              type="text"
              value={formData.gstNumber}
              onChange={(e) => handleChange('gstNumber', e.target.value.toUpperCase())}
              className={`w-full px-4 py-3 border ${errors.gstNumber ? 'border-red-500' : 'border-gray-300'
                } rounded-xl focus:outline-none focus:border-[#D97706] transition-colors bg-white`}
              placeholder="22AAAAA0000A1Z5"
              maxLength={15}
            />
            {errors.gstNumber && (
              <p className="text-xs text-red-500 mt-1">{errors.gstNumber}</p>
            )}
          </div>

          {/* PAN Number */}
          <div>
            <label className="block text-sm font-medium text-[#111827] mb-2">
              PAN Number (Optional)
            </label>
            <input
              type="text"
              value={formData.panNumber}
              onChange={(e) => handleChange('panNumber', e.target.value.toUpperCase())}
              className={`w-full px-4 py-3 border ${errors.panNumber ? 'border-red-500' : 'border-gray-300'
                } rounded-xl focus:outline-none focus:border-[#D97706] transition-colors bg-white`}
              placeholder="ABCDE1234F"
              maxLength={10}
            />
            {errors.panNumber && (
              <p className="text-xs text-red-500 mt-1">{errors.panNumber}</p>
            )}
          </div>

          {/* FSSAI Number */}
          <div>
            <label className="block text-sm font-medium text-[#111827] mb-2">
              FSSAI License Number (Optional)
            </label>
            <input
              type="text"
              value={formData.fssaiNumber}
              onChange={(e) => handleChange('fssaiNumber', e.target.value)}
              className={`w-full px-4 py-3 border ${errors.fssaiNumber ? 'border-red-500' : 'border-gray-300'
                } rounded-xl focus:outline-none focus:border-[#D97706] transition-colors bg-white`}
              placeholder="12345678901234"
              maxLength={14}
            />
            {errors.fssaiNumber && (
              <p className="text-xs text-red-500 mt-1">{errors.fssaiNumber}</p>
            )}
          </div>

          {/* Trade License Number */}
          <div>
            <label className="block text-sm font-medium text-[#111827] mb-2">
              Trade License Number (Optional)
            </label>
            <input
              type="text"
              value={formData.tradeLicenseNumber}
              onChange={(e) => handleChange('tradeLicenseNumber', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#D97706] transition-colors bg-white"
              placeholder="Enter trade license number"
            />
          </div>
        </div>
      </div>

      {/* Document Uploads */}
      <div>
        <h3 className="font-semibold text-[#111827] mb-2">Upload Documents (Optional)</h3>
        <p className="text-sm text-gray-600 mb-4">
          Upload business documents for faster verification. You can also upload these later from your profile.
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          <FileUploadCard label="GST Certificate" docType="gst" />
          <FileUploadCard label="PAN Card" docType="pan" />
          <FileUploadCard label="FSSAI License" docType="fssai" />
          <FileUploadCard label="Trade License" docType="trade" />
        </div>
      </div>

      {/* Purchase Volume */}
      <div>
        <label className="block text-sm font-medium text-[#111827] mb-3">
          Expected Monthly Purchase Volume (Optional)
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {purchaseVolumes.map((volume) => (
            <label
              key={volume}
              className={`p-3 border-2 rounded-xl cursor-pointer transition-all text-center ${formData.monthlyPurchaseVolume === volume
                  ? 'border-[#D97706] bg-[#E8F5E9]'
                  : 'border-gray-200 hover:border-gray-300'
                }`}
            >
              <input
                type="radio"
                name="purchaseVolume"
                value={volume}
                checked={formData.monthlyPurchaseVolume === volume}
                onChange={(e) => handleChange('monthlyPurchaseVolume', e.target.value)}
                className="sr-only"
              />
              <span className="text-sm font-medium text-[#111827]">{volume}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Terms Agreement */}
      <div className="bg-gray-50 rounded-xl p-6">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.agreeToTerms}
            onChange={(e) => handleChange('agreeToTerms', e.target.checked)}
            className="w-5 h-5 text-[#D97706] focus:ring-[#D97706] rounded mt-0.5"
          />
          <div className="flex-1">
            <p className="text-sm text-gray-700">
              I agree to the{' '}
              <a href="/terms" className="text-[#D97706] hover:underline font-medium">
                Terms & Conditions
              </a>
              {' '}and{' '}
              <a href="/privacy" className="text-[#D97706] hover:underline font-medium">
                Privacy Policy
              </a>
              . I confirm that all information provided is accurate and I'm authorized to register this business.
            </p>
          </div>
        </label>
        {errors.agreeToTerms && (
          <p className="text-xs text-red-500 mt-2 ml-8">{errors.agreeToTerms}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-[#D97706] text-white py-4 rounded-full hover:bg-[#B45309] transition-all font-semibold shadow-md hover:shadow-lg"
      >
        Complete Registration
      </button>
    </form>
  );
}