// 'use client';

// import { useState } from 'react';
// import { ShippingAddress } from '@/lib/types/checkout';
// import { MapPin, Mail, Phone, User } from 'lucide-react';

// interface ShippingFormProps {
//   onSubmit: (address: ShippingAddress) => void;
//   initialData?: ShippingAddress;
// }

// export default function ShippingForm({ onSubmit, initialData }: ShippingFormProps) {
//   const [formData, setFormData] = useState<ShippingAddress>(
//     initialData || {
//       fullName: '',
//       email: '',
//       phone: '',
//       addressLine1: '',
//       addressLine2: '',
//       city: '',
//       state: '',
//       pincode: '',
//       country: 'India',
//     }
//   );

//   const [errors, setErrors] = useState<Partial<ShippingAddress>>({});

//   const indianStates = [
//     'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
//     'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
//     'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
//     'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
//     'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
//   ];

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     // Clear error when user starts typing
//     if (errors[name as keyof ShippingAddress]) {
//       setErrors((prev) => ({ ...prev, [name]: '' }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors: Partial<ShippingAddress> = {};

//     if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
//     if (!formData.email.trim()) {
//       newErrors.email = 'Email is required';
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//       newErrors.email = 'Invalid email address';
//     }
//     if (!formData.phone.trim()) {
//       newErrors.phone = 'Phone number is required';
//     } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
//       newErrors.phone = 'Invalid phone number (10 digits)';
//     }
//     if (!formData.addressLine1.trim()) newErrors.addressLine1 = 'Address is required';
//     if (!formData.city.trim()) newErrors.city = 'City is required';
//     if (!formData.state) newErrors.state = 'State is required';
//     if (!formData.pincode.trim()) {
//       newErrors.pincode = 'Pincode is required';
//     } else if (!/^\d{6}$/.test(formData.pincode)) {
//       newErrors.pincode = 'Invalid pincode (6 digits)';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (validateForm()) {
//       onSubmit(formData);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       <div className="bg-white rounded-2xl soft-shadow p-6">
//         <h2 className="text-xl font-semibold text-[#111827] mb-6 flex items-center gap-2">
//           <MapPin size={24} className="text-[#D97706]" />
//           Shipping Address
//         </h2>

//         <div className="grid md:grid-cols-2 gap-6">
//           {/* Full Name */}
//           <div className="md:col-span-2">
//             <label className="block text-sm font-medium text-[#111827] mb-2">
//               Full Name *
//             </label>
//             <div className="relative">
//               <input
//                 type="text"
//                 name="fullName"
//                 value={formData.fullName}
//                 onChange={handleChange}
//                 className={`w-full px-4 py-3 pl-11 border ${
//                   errors.fullName ? 'border-red-500' : 'border-gray-300'
//                 } rounded-xl focus:outline-none focus:border-[#D97706] transition-colors`}
//                 placeholder="John Doe"
//               />
//               <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
//             </div>
//             {errors.fullName && (
//               <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>
//             )}
//           </div>

//           {/* Email */}
//           <div>
//             <label className="block text-sm font-medium text-[#111827] mb-2">
//               Email Address *
//             </label>
//             <div className="relative">
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 className={`w-full px-4 py-3 pl-11 border ${
//                   errors.email ? 'border-red-500' : 'border-gray-300'
//                 } rounded-xl focus:outline-none focus:border-[#D97706] transition-colors`}
//                 placeholder="john@example.com"
//               />
//               <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
//             </div>
//             {errors.email && (
//               <p className="text-xs text-red-500 mt-1">{errors.email}</p>
//             )}
//           </div>

//           {/* Phone */}
//           <div>
//             <label className="block text-sm font-medium text-[#111827] mb-2">
//               Phone Number *
//             </label>
//             <div className="relative">
//               <input
//                 type="tel"
//                 name="phone"
//                 value={formData.phone}
//                 onChange={handleChange}
//                 className={`w-full px-4 py-3 pl-11 border ${
//                   errors.phone ? 'border-red-500' : 'border-gray-300'
//                 } rounded-xl focus:outline-none focus:border-[#D97706] transition-colors`}
//                 placeholder="9322506730"
//                 maxLength={10}
//               />
//               <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
//             </div>
//             {errors.phone && (
//               <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
//             )}
//           </div>

//           {/* Address Line 1 */}
//           <div className="md:col-span-2">
//             <label className="block text-sm font-medium text-[#111827] mb-2">
//               Address Line 1 *
//             </label>
//             <input
//               type="text"
//               name="addressLine1"
//               value={formData.addressLine1}
//               onChange={handleChange}
//               className={`w-full px-4 py-3 border ${
//                 errors.addressLine1 ? 'border-red-500' : 'border-gray-300'
//               } rounded-xl focus:outline-none focus:border-[#D97706] transition-colors`}
//               placeholder="Street address, P.O. Box, Company name"
//             />
//             {errors.addressLine1 && (
//               <p className="text-xs text-red-500 mt-1">{errors.addressLine1}</p>
//             )}
//           </div>

//           {/* Address Line 2 */}
//           <div className="md:col-span-2">
//             <label className="block text-sm font-medium text-[#111827] mb-2">
//               Address Line 2 (Optional)
//             </label>
//             <input
//               type="text"
//               name="addressLine2"
//               value={formData.addressLine2}
//               onChange={handleChange}
//               className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#D97706] transition-colors"
//               placeholder="Apartment, suite, unit, building, floor, etc."
//             />
//           </div>

//           {/* City */}
//           <div>
//             <label className="block text-sm font-medium text-[#111827] mb-2">
//               City *
//             </label>
//             <input
//               type="text"
//               name="city"
//               value={formData.city}
//               onChange={handleChange}
//               className={`w-full px-4 py-3 border ${
//                 errors.city ? 'border-red-500' : 'border-gray-300'
//               } rounded-xl focus:outline-none focus:border-[#D97706] transition-colors`}
//               placeholder="Mumbai"
//             />
//             {errors.city && (
//               <p className="text-xs text-red-500 mt-1">{errors.city}</p>
//             )}
//           </div>

//           {/* State */}
//           <div>
//             <label className="block text-sm font-medium text-[#111827] mb-2">
//               State *
//             </label>
//             <select
//               name="state"
//               value={formData.state}
//               onChange={handleChange}
//               className={`w-full px-4 py-3 border ${
//                 errors.state ? 'border-red-500' : 'border-gray-300'
//               } rounded-xl focus:outline-none focus:border-[#D97706] transition-colors bg-white`}
//             >
//               <option value="">Select State</option>
//               {indianStates.map((state) => (
//                 <option key={state} value={state}>
//                   {state}
//                 </option>
//               ))}
//             </select>
//             {errors.state && (
//               <p className="text-xs text-red-500 mt-1">{errors.state}</p>
//             )}
//           </div>

//           {/* Pincode */}
//           <div>
//             <label className="block text-sm font-medium text-[#111827] mb-2">
//               Pincode *
//             </label>
//             <input
//               type="text"
//               name="pincode"
//               value={formData.pincode}
//               onChange={handleChange}
//               className={`w-full px-4 py-3 border ${
//                 errors.pincode ? 'border-red-500' : 'border-gray-300'
//               } rounded-xl focus:outline-none focus:border-[#D97706] transition-colors`}
//               placeholder="400001"
//               maxLength={6}
//             />
//             {errors.pincode && (
//               <p className="text-xs text-red-500 mt-1">{errors.pincode}</p>
//             )}
//           </div>

//           {/* Country */}
//           <div>
//             <label className="block text-sm font-medium text-[#111827] mb-2">
//               Country
//             </label>
//             <input
//               type="text"
//               name="country"
//               value={formData.country}
//               disabled
//               className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-600"
//             />
//           </div>
//         </div>
//       </div>

//       {/* Submit Button */}
//       <button
//         type="submit"
//         className="w-full bg-[#D97706] text-white py-4 rounded-full hover:bg-[#7CB342] transition-all font-semibold shadow-md hover:shadow-lg"
//       >
//         Continue to Payment
//       </button>
//     </form>
//   );
// }


'use client';

import { useEffect, useState } from "react";
import { ShippingAddress } from "@/lib/types/checkout";
import { MapPin, Plus, User, Mail, Phone } from "lucide-react";

interface Props {
  onSubmit: (address: ShippingAddress) => void;
}

export default function ShippingAddressSelector({ onSubmit }: Props) {
  const [savedAddress, setSavedAddress] = useState<ShippingAddress | null>(null);
  // const [selectedType, setSelectedType] = useState<"saved" | "new">("saved");
  const [selectedType, setSelectedType] = useState<"saved" | "new" | null>(null);

  const [loading, setLoading] = useState(true);

  const primary = "#D97706";

  const [formData, setFormData] = useState<ShippingAddress>({
    fullName: "",
    email: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });

  const [errors, setErrors] = useState<Partial<ShippingAddress>>({});

  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
    "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
  ];

  /* FETCH ADDRESS */
  useEffect(() => {
    const fetchAddress = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`http://localhost:3000/api/customers/${userId}`);
        const data = await res.json();

        if (data?.success && data.data) {
          const c = data.data;

          setSavedAddress({
            fullName: c.name || "",
            email: c.email || "",
            phone: c.phone || "",
            addressLine1: c.address || "",
            addressLine2: "",
            city: c.city || "",
            state: c.state || "",
            pincode: c.pincode || "",
            country: "India",
          });
        }
      } catch { }
      setLoading(false);
    };

    fetchAddress();
  }, []);

  /* FORM HANDLING */
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ShippingAddress]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<ShippingAddress> = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email";
    if (!/^[6-9]\d{9}$/.test(formData.phone)) newErrors.phone = "Invalid phone";
    if (!formData.addressLine1.trim()) newErrors.addressLine1 = "Required";
    if (!formData.city.trim()) newErrors.city = "Required";
    if (!formData.state.trim()) newErrors.state = "Required";
    if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = "Invalid pincode";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNewAddressSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  /* LOADING */
  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="w-10 h-10 border-4 border-[#D97706] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="mt-2 text-gray-600 font-medium">Loading your address…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* SAVED ADDRESS CARD */}
      {savedAddress && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="font-bold text-lg flex items-center gap-2 mb-4 text-[#D97706]">
            <MapPin className="text-[#D97706]" /> Select Delivery Address
          </h2>

          <label
            className={`flex gap-4 p-4 rounded-xl cursor-pointer transition-all border-2 
              ${selectedType === "saved"
                ? "border-[#D97706] shadow-md"
                : "border-gray-300 hover:border-[#D97706]/60"
              }`}
          >
            <input
              type="radio"
              name="addressSelect"
              checked={selectedType === "saved"}
              onChange={() => setSelectedType("saved")}
              className="w-5 h-5 accent-[#D97706]"
            />


            <div className="text-sm leading-relaxed">
              <p className="font-semibold text-base">{savedAddress.fullName}</p>
              <p>{savedAddress.addressLine1}</p>
              <p>{savedAddress.city}, {savedAddress.state} - {savedAddress.pincode}</p>
              <p className="mt-1 text-gray-600">📞 {savedAddress.phone}</p>
            </div>
          </label>

          {selectedType === "saved" && (
            <button
              onClick={() => onSubmit(savedAddress)}
              className="mt-4 w-full bg-[#D97706] hover:bg-[#c56a04] text-white py-3 rounded-full font-semibold transition"
            >
              Continue to Payment
            </button>
          )}

          {/* ADD NEW ADDRESS */}
          <button
            onClick={() => setSelectedType("new")}
            className="mt-5 w-full flex items-center justify-center gap-2 border border-gray-300 py-3 rounded-full font-semibold hover:bg-gray-100 transition"
          >
            <Plus size={18} /> Add New Address
          </button>

        </div>
      )}

      {/* NEW ADDRESS FORM */}
      {(!savedAddress || selectedType === "new") && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-[#D97706]">
            <MapPin className="text-[#D97706]" /> Add New Address
          </h3>

          <div className="grid md:grid-cols-2 gap-5">
            <InputField label="Full Name" name="fullName" icon={<User size={18} />} value={formData.fullName} onChange={handleChange} error={errors.fullName} />
            <InputField label="Email" name="email" icon={<Mail size={18} />} value={formData.email} onChange={handleChange} error={errors.email} />
            <InputField label="Phone" name="phone" icon={<Phone size={18} />} value={formData.phone} onChange={handleChange} maxLength={10} error={errors.phone} />

            <InputField label="Address Line 1" name="addressLine1" value={formData.addressLine1} onChange={handleChange} error={errors.addressLine1} full />
            <InputField label="Address Line 2" name="addressLine2" value={formData.addressLine2} onChange={handleChange} full />

            <InputField label="City" name="city" value={formData.city} onChange={handleChange} error={errors.city} />

            {/* STATE */}
            <div>
              <label className="block text-sm font-medium mb-1">State *</label>
              <select
                name="state"
                value={formData.state}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg text-sm 
                  ${errors.state ? "border-red-500" : "border-gray-300"} 
                  focus:border-[#D97706] outline-none`}
              >
                <option value="">Select State</option>
                {indianStates.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
              {errors.state && (
                <p className="text-xs text-red-500 mt-1">{errors.state}</p>
              )}
            </div>

            <InputField label="Pincode" name="pincode" maxLength={6} value={formData.pincode} onChange={handleChange} error={errors.pincode} />
          </div>

          {/* CTA */}
          <button
            onClick={handleNewAddressSubmit}
            className="mt-6 w-full bg-[#D97706] hover:bg-[#c56a04] text-white py-4 rounded-full font-semibold transition active:scale-[0.98]"
          >
            Continue to Payment
          </button>
        </div>
      )}
    </div>
  );
}

/* INPUT FIELD SUB-COMPONENT */
function InputField({ label, name, icon, error, full, ...props }: any) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <label className="block text-sm font-medium mb-1">{label} *</label>
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#D97706]">
            {icon}
          </span>
        )}
        <input
          name={name}
          {...props}
          className={`w-full px-4 py-3 text-sm rounded-lg border 
          ${icon ? "pl-10" : ""} 
          ${error ? "border-red-500" : "border-gray-300"} 
          focus:border-[#D97706] outline-none transition`}
        />
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
