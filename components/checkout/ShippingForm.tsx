'use client';

import { useEffect, useState } from "react";
import { ShippingAddress } from "@/lib/types/checkout";
import { MapPin, Plus } from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";
import AddressMap from "@/components/ui/AddressMap";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

interface Props {
  onSubmit: (address: ShippingAddress) => void;
  initialData?: ShippingAddress;
  onCancel?: () => void;
}

// City ↔ State mapping (Indian cities subset)
const CITY_STATE_MAP: Record<string, string> = {
  Mumbai: "Maharashtra", Pune: "Maharashtra", Nagpur: "Maharashtra", Nashik: "Maharashtra",
  Delhi: "Delhi", "New Delhi": "Delhi",
  Bengaluru: "Karnataka", Bangalore: "Karnataka", Mysuru: "Karnataka",
  Chennai: "Tamil Nadu", Coimbatore: "Tamil Nadu", Madurai: "Tamil Nadu",
  Hyderabad: "Telangana", Warangal: "Telangana",
  Kolkata: "West Bengal", Howrah: "West Bengal",
  Ahmedabad: "Gujarat", Surat: "Gujarat", Vadodara: "Gujarat",
  Jaipur: "Rajasthan", Jodhpur: "Rajasthan", Udaipur: "Rajasthan",
  Lucknow: "Uttar Pradesh", Kanpur: "Uttar Pradesh", Agra: "Uttar Pradesh", Varanasi: "Uttar Pradesh",
  Patna: "Bihar", Gaya: "Bihar",
  Bhopal: "Madhya Pradesh", Indore: "Madhya Pradesh",
  Chandigarh: "Punjab", Ludhiana: "Punjab", Amritsar: "Punjab",
  Bhubaneswar: "Odisha", Cuttack: "Odisha",
  Guwahati: "Assam",
  Kochi: "Kerala", Thiruvananthapuram: "Kerala", Kozhikode: "Kerala",
  Dehradun: "Uttarakhand",
  Ranchi: "Jharkhand",
  Raipur: "Chhattisgarh",
};

// --- Utils ---
const parsePhoneNumber = (rawPhone: string) => {
  if (!rawPhone) return { extension: '+91', phone: '' };
  const cleaned = rawPhone.replace(/[^\d+]/g, '');
  if (cleaned.startsWith('+91')) return { extension: '+91', phone: cleaned.slice(3).slice(-10) };
  if (cleaned.startsWith('91') && cleaned.length === 12) return { extension: '+91', phone: cleaned.slice(2) };
  if (cleaned.startsWith('0')) return { extension: '+91', phone: cleaned.slice(1).slice(-10) };
  return { extension: '+91', phone: cleaned.slice(-10) };
};

export default function ShippingAddressSelector({ onSubmit, initialData, onCancel }: Props) {
  const [savedAddress, setSavedAddress] = useState<ShippingAddress | null>(null);
  const [selectedType, setSelectedType] = useState<"saved" | "new" | null>(null);
  const [hasPriorOrders, setHasPriorOrders] = useState(false);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [showMap, setShowMap] = useState(false);

  const [formData, setFormData] = useState<ShippingAddress>(
    initialData ?? {
      fullName: '',
      email: '',
      phoneExtension: '+91',
      phone: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India',
    }
  );

  const [errors, setErrors] = useState<Partial<Record<keyof ShippingAddress, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof ShippingAddress, boolean>>>({});

  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
    "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Delhi", "Chandigarh", "Puducherry", "Jammu & Kashmir", "Ladakh",
    "Andaman & Nicobar Islands", "Dadra & Nagar Haveli", "Daman & Diu", "Lakshadweep",
  ];

  const fetchAddress = async () => {
    try {
      const orderRes = await fetch(`${API_BASE}/api/order?userId=${user?.id}&limit=1&sort=-createdAt`);
      const orderJson = await orderRes.json();
      const hasOrders = orderJson.success && Array.isArray(orderJson.orders) && orderJson.orders.length > 0;
      setHasPriorOrders(hasOrders);

      if (hasOrders) {
        const lastOrder = orderJson.orders[0];
        if (lastOrder.shippingAddress?.addressLine1) {
          const addr = lastOrder.shippingAddress;
          const { extension: ext, phone: ph } = parsePhoneNumber(addr.phone || '');
          const normalizedAddr = {
            ...addr,
            phoneExtension: addr.phoneExtension || ext,
            phone: addr.phoneExtension ? addr.phone : ph,
          };
          setSavedAddress(normalizedAddr);
          setSelectedType("saved");
          setFormData(normalizedAddr);
          setLoading(false);
          return;
        }
      }

      const res = await fetch(`${API_BASE}/api/customers/${user?.id}`);
      const data = await res.json();
      if (data?.success && data.data) {
        const c = data.data;
        // Auto-fill name and email from profile
        const { extension, phone } = parsePhoneNumber(c.phone || '');
        setFormData(prev => ({
          ...prev,
          fullName: prev.fullName || c.name || '',
          email: prev.email || c.email || '',
          phoneExtension: extension,
          phone: prev.phone || phone || '',
        }));
        if (c.address && c.pincode) {
          const { extension: savedExt, phone: savedPhone } = parsePhoneNumber(c.phone || '');
          setSavedAddress({
            fullName: c.name || '', email: c.email || '', 
            phoneExtension: savedExt, phone: savedPhone,
            addressLine1: c.address || '', addressLine2: '',
            city: c.city || '', state: c.state || '', pincode: c.pincode || '', country: "India",
          });
        }
      }
      setSelectedType("new");
    } catch (err) {
      console.error("❌ Failed to fetch address/orders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) fetchAddress();
  }, [user?.id]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    let updatedForm = { ...formData, [name]: value };

    // Auto-detect state from city
    if (name === "city") {
      const detectedState = CITY_STATE_MAP[value.trim()];
      if (detectedState) {
        updatedForm = { ...updatedForm, state: detectedState };
        setErrors(prev => ({ ...prev, state: '' }));
      }
    }

    setFormData(updatedForm);
    if (errors[name as keyof ShippingAddress]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e: any) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, formData[name as keyof ShippingAddress] as string);
  };

  const validateField = (name: string, value: string) => {
    let error = '';
    switch (name) {
      case 'fullName':
        if (!value.trim()) error = 'Full name is required';
        else if (value.trim().length < 3) error = 'Name must be at least 3 characters';
        else if (/[^a-zA-Z\s]/.test(value)) error = 'Name must contain letters only — no numbers or special characters';
        break;
      case 'email':
        if (!value.trim()) error = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Enter a valid email address';
        break;
      case 'phone':
        if (!value.trim()) error = 'Phone is required';
        else if (!/^[6-9]\d{9}$/.test(value)) error = 'Enter a valid 10-digit mobile number';
        break;
      case 'addressLine1':
        if (!value.trim()) error = 'Address Line 1 is required';
        break;
      case 'city':
        if (!value.trim()) error = 'City is required';
        break;
      case 'state':
        if (!value.trim()) error = 'Please select a state';
        break;
      case 'pincode':
        if (!value.trim()) error = 'Pincode is required';
        else if (!/^\d{6}$/.test(value)) error = 'Enter a valid 6-digit pincode';
        break;
    }
    setErrors(prev => ({ ...prev, [name]: error }));
    return error;
  };

  const validateForm = () => {
    const fields = ['fullName', 'email', 'phone', 'addressLine1', 'city', 'state', 'pincode'];
    const newErrors: any = {};
    const newTouched: any = {};
    let valid = true;

    fields.forEach(field => {
      const error = validateField(field, formData[field as keyof ShippingAddress] as string);
      newErrors[field] = error;
      newTouched[field] = true;
      if (error) valid = false;
    });

    // City ↔ State mismatch check
    if (formData.city && formData.state) {
      const expectedState = CITY_STATE_MAP[formData.city.trim()];
      if (expectedState && expectedState !== formData.state) {
        newErrors.city = `"${formData.city}" is typically in ${expectedState}, not ${formData.state}`;
        valid = false;
      }
    }

    setErrors(newErrors);
    setTouched(newTouched);
    return valid;
  };

  const handleNewAddressSubmit = () => {
    if (validateForm()) onSubmit(formData);
  };

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
      {savedAddress && hasPriorOrders && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="font-bold text-lg flex items-center gap-2 mb-4 text-[#D97706]">
            <MapPin className="text-[#D97706]" /> Select Delivery Address
          </h2>
          <label className={`flex gap-4 p-4 rounded-xl cursor-pointer transition-all border-2 ${selectedType === "saved" ? "border-[#D97706] shadow-md" : "border-gray-300 hover:border-[#D97706]/60"}`}>
            <input type="radio" name="addressSelect" checked={selectedType === "saved"}
              onChange={() => setSelectedType("saved")} className="w-5 h-5 accent-[#D97706]" />
            <div className="text-sm leading-relaxed">
              <p className="font-semibold text-base">{savedAddress.fullName}</p>
              <p>{savedAddress.addressLine1}</p>
              <p>{savedAddress.city}, {savedAddress.state} - {savedAddress.pincode}</p>
              <p className="mt-1 text-gray-600">📞 {savedAddress.phoneExtension} {savedAddress.phone}</p>
            </div>
          </label>

          {selectedType === "saved" && (
            <div className="mt-4 flex gap-3">
              {onCancel && (
                <button onClick={onCancel}
                  className="flex-1 py-3 rounded-full border border-gray-300 font-semibold text-gray-600 hover:bg-gray-50 transition">
                  Cancel
                </button>
              )}
              <button onClick={() => onSubmit(savedAddress)}
                className="flex-1 bg-[#D97706] hover:bg-[#c56a04] text-white py-3 rounded-full font-semibold transition">
                Continue to Payment
              </button>
            </div>
          )}

          <button onClick={() => setSelectedType("new")}
            className="mt-4 w-full flex items-center justify-center gap-2 border border-gray-300 py-3 rounded-full font-semibold hover:bg-gray-100 transition">
            <Plus size={18} /> Add New Address
          </button>
        </div>
      )}

      {/* NEW ADDRESS FORM */}
      {(!savedAddress || selectedType === "new") && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="font-bold text-lg mb-5 flex items-center justify-between gap-2 text-[#D97706]">
            <span className="flex items-center gap-2"><MapPin className="text-[#D97706]" /> Add New Address</span>
            <button type="button" onClick={() => setShowMap(!showMap)}
              className="text-xs font-semibold bg-[#D97706]/10 text-[#D97706] px-3 py-1.5 rounded-full hover:bg-[#D97706]/20 transition flex items-center gap-1">
              {showMap ? 'Hide Map' : '📍 Pick on Map'}
            </button>
          </h3>

          {showMap && (
            <div className="mb-6 animate-in zoom-in-95 duration-300">
              <AddressMap onLocationSelect={(loc: any) => {
                setFormData(prev => ({
                  ...prev,
                  addressLine1: loc.addressLine1 || prev.addressLine1,
                  city: loc.city || prev.city,
                  state: loc.state || prev.state,
                  country: loc.country || prev.country,
                  pincode: loc.pincode || prev.pincode,
                  lat: loc.lat, lng: loc.lng,
                }));
                setErrors(prev => ({ ...prev, addressLine1: '', city: '', state: '', pincode: '' }));
              }} />
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-5">
            {/* Full Name */}
            <Field label="Full Name" name="fullName" required
              value={formData.fullName}
              onChange={(e: any) => {
                const val = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                handleChange({ target: { name: 'fullName', value: val } });
              }}
              onBlur={handleBlur} error={errors.fullName}
              placeholder="e.g. Ramesh Kumar" />

            {/* Email */}
            <Field label="Email" name="email" type="email" required
              value={formData.email} onChange={handleChange} onBlur={handleBlur} error={errors.email}
              placeholder="e.g. ramesh@gmail.com" />

            {/* Phone */}
            <div className="">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Phone <span className="text-[#D97706]">*</span>
              </label>
              <div className="flex gap-2">
                <div className="flex-shrink-0 px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-600 font-medium flex items-center justify-center min-w-[60px]">
                  {formData.phoneExtension}
                </div>
                <input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e: any) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                    handleChange({ target: { name: 'phone', value: val } });
                  }}
                  onBlur={handleBlur}
                  placeholder="10-digit mobile number"
                  className={`flex-grow px-4 py-3 text-sm rounded-lg border outline-none transition
                    focus:ring-1 focus:ring-[#D97706]/30
                    ${errors.phone ? 'border-red-400 bg-red-50 focus:border-red-400' : 'border-gray-300 focus:border-[#D97706]'}`}
                />
              </div>
              {errors.phone && <p className="text-xs text-red-500 mt-1 flex items-center gap-1">⚠ {errors.phone}</p>}
            </div>

            {/* Address Line 1 */}
            <Field label="Address Line 1" name="addressLine1" required full
              value={formData.addressLine1} onChange={handleChange} onBlur={handleBlur} error={errors.addressLine1}
              placeholder="Street, Building, Area" />

            {/* Address Line 2 — Optional, NO asterisk */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Address Line 2 <span className="text-gray-400 font-normal text-xs">(Optional)</span>
              </label>
              <input
                name="addressLine2"
                value={formData.addressLine2}
                onChange={handleChange}
                placeholder="Apartment, Floor, Landmark (optional)"
                className="w-full px-4 py-3 text-sm rounded-lg border border-gray-300 focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706]/30 outline-none transition"
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                City <span className="text-[#D97706]">*</span>
              </label>
              <input
                name="city"
                value={formData.city}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="e.g. Mumbai"
                className={`w-full px-4 py-3 text-sm rounded-lg border outline-none transition
                  focus:ring-1 focus:ring-[#D97706]/30
                  ${errors.city ? 'border-red-400 bg-red-50 focus:border-red-400' : 'border-gray-300 focus:border-[#D97706]'}`}
              />
              {errors.city && <p className="text-xs text-red-500 mt-1 flex items-center gap-1">⚠ {errors.city}</p>}
            </div>

            {/* State */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                State <span className="text-[#D97706]">*</span>
              </label>
              <select
                name="state"
                value={formData.state}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-3 border rounded-lg text-sm outline-none transition
                  focus:ring-1 focus:ring-[#D97706]/30
                  ${errors.state ? 'border-red-400 bg-red-50 focus:border-red-400' : 'border-gray-300 focus:border-[#D97706]'}`}
              >
                <option value="">Select State</option>
                {indianStates.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
              {errors.state && <p className="text-xs text-red-500 mt-1 flex items-center gap-1">⚠ {errors.state}</p>}
              {formData.city && CITY_STATE_MAP[formData.city.trim()] && formData.state &&
                CITY_STATE_MAP[formData.city.trim()] !== formData.state && (
                  <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                    ⚠ Heads up: {formData.city} is typically in {CITY_STATE_MAP[formData.city.trim()]}
                  </p>
                )}
            </div>

            {/* Pincode */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Pincode <span className="text-[#D97706]">*</span>
              </label>
              <input
                name="pincode"
                value={formData.pincode}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                  handleChange({ target: { name: 'pincode', value: val } });
                }}
                onBlur={handleBlur}
                maxLength={6}
                placeholder="6-digit pincode"
                className={`w-full px-4 py-3 text-sm rounded-lg border outline-none transition
                  focus:ring-1 focus:ring-[#D97706]/30
                  ${errors.pincode ? 'border-red-400 bg-red-50 focus:border-red-400' : 'border-gray-300 focus:border-[#D97706]'}`}
              />
              {errors.pincode && <p className="text-xs text-red-500 mt-1 flex items-center gap-1">⚠ {errors.pincode}</p>}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="mt-6 flex gap-3">
            {(onCancel || (savedAddress && hasPriorOrders)) && (
              <button
                type="button"
                onClick={() => {
                  if (savedAddress && hasPriorOrders) setSelectedType("saved");
                  else if (onCancel) onCancel();
                }}
                className="flex-1 py-4 rounded-full border border-gray-300 font-semibold text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            )}
            <button
              onClick={handleNewAddressSubmit}
              className="flex-1 bg-gradient-to-r from-[#D97706] to-[#B45309] hover:from-[#C26A05] hover:to-[#92400E] text-white py-4 rounded-full font-semibold transition shadow-md hover:shadow-lg active:scale-[0.98]"
            >
              Continue to Payment →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* REUSABLE FIELD COMPONENT — no icons, clean */
function Field({ label, name, required, error, full, type = "text", ...props }: any) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <label className="block text-sm font-medium mb-1 text-gray-700">
        {label} {required && <span className="text-[#D97706]">*</span>}
      </label>
      <input
        name={name}
        type={type}
        {...props}
        className={`w-full px-4 py-3 text-sm rounded-lg border outline-none transition
          focus:ring-1 focus:ring-[#D97706]/30
          ${error
            ? 'border-red-400 bg-red-50 focus:border-red-400'
            : 'border-gray-300 focus:border-[#D97706]'
          }`}
      />
      {error && <p className="text-xs text-red-500 mt-1 flex items-center gap-1">⚠ {error}</p>}
    </div>
  );
}
