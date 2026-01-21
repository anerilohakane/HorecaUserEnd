'use client';

import { useEffect, useState } from "react";
import { ShippingAddress } from "@/lib/types/checkout";
import { MapPin, Plus, User, Mail, Phone } from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

interface Props {
  onSubmit: (address: ShippingAddress) => void;
  initialData?: ShippingAddress;
}

console.log("ShippingAddressSelector loaded with API_BASE:", API_BASE);


export default function ShippingAddressSelector({ onSubmit, initialData }: Props) {
  const [savedAddress, setSavedAddress] = useState<ShippingAddress | null>(null);
  const [selectedType, setSelectedType] = useState<"saved" | "new" | null>(null);
  const [hasPriorOrders, setHasPriorOrders] = useState(false);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  const primary = "#D97706";

  console.log("User Data", user);


  console.log("InitalData", initialData);

  const [formData, setFormData] = useState<ShippingAddress>(
    initialData ?? {
      fullName: '',
      email: '',
      phone: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India',
    }
  );

  const [errors, setErrors] = useState<Partial<ShippingAddress>>({});

  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
    "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
  ];

  console.log("user id in ShippingForm: hellooooo", user?.id);

  const fetchAddress = async () => {
    // if (!user?.id) return;

    console.log("✅ Fetching address for user:", user?.id);

    try {
      // 1. Fetch Latest Order first (Prioritize this)
      const orderRes = await fetch(`${API_BASE}/api/order?userId=${user?.id}&limit=1&sort=-createdAt`);
      const orderJson = await orderRes.json();
      const hasOrders = orderJson.success && Array.isArray(orderJson.orders) && orderJson.orders.length > 0;

      setHasPriorOrders(hasOrders);

      // If user has prior orders, try to use that address
      if (hasOrders) {
        const lastOrder = orderJson.orders[0];
        if (lastOrder.shippingAddress && lastOrder.shippingAddress.addressLine1) {
          setSavedAddress(lastOrder.shippingAddress);
          setSelectedType("saved");

          // Pre-fill form just in case
          setFormData(lastOrder.shippingAddress);
          setLoading(false);
          return; // EXIT EARLY - we found a good address
        }
      }

      // 2. Fallback to Customer Profile ONLY if no order address found
      // AND only if the profile actually has address fields
      const res = await fetch(`${API_BASE}/api/customers/${user?.id}`);
      const data = await res.json();

      if (data?.success && data.data && data.data.address) {
        const c = data.data;
        // Verify it's not just a partial profile with only phone/email
        if (c.address && c.pincode) {
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
          // If we are here, it means we have a profile address but NO orders.
          // But we already set 'hasPriorOrders' to false above.
          // So the "Select Address" card will NOT show (due to my previous fix).
          // That is CORRECT behavior for new users.
        }
      }

      // Default to new address if no good data found
      setSelectedType("new");

    } catch (err) {
      console.error("❌ Failed to fetch address/orders", err);
    } finally {
      setLoading(false);
    }
  };


  /* FETCH ADDRESS */
  useEffect(() => {
    if (user?.id) {
      fetchAddress();
    }
  }, [user?.id]);


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

      {/* SAVED ADDRESS CARD (Only if address exists AND user has prior orders) */}
      {savedAddress && hasPriorOrders && (
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
