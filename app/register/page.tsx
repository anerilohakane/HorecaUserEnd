'use client';

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { User, Mail, Phone, Building, FileText, Lock, Upload, ArrowRight, ArrowLeft, CheckCircle, X, MapPin, Tag, FileCheck, Calendar, FileCode, Check, Store, Briefcase, CreditCard, Folder } from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { INDIAN_STATES, CUSTOMER_TYPES, CUSTOMER_DEPARTMENTS, validateStatePincode } from "@/app/lib/indiaGeoData";

const API_BASE = (process.env.NEXT_PUBLIC_HORECA_BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "https://horeca-backend-six.vercel.app").replace(/\/$/, "");

export default function RegisterPage() {
  const { registerCustomer, isAuthenticated } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Form State
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [department, setDepartment] = useState("");
  const [customDepartment, setCustomDepartment] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [isUrg, setIsUrg] = useState(false);
  const [creditTerm, setCreditTerm] = useState(0);
  const [creditLimit, setCreditLimit] = useState(0);
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [category, setCategory] = useState("");
  const [customerType, setCustomerType] = useState("");
  const [customCustomerType, setCustomCustomerType] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [urcFile, setUrcFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const urcFileInputRef = useRef<HTMLInputElement>(null);
  const [gstEffectiveDate, setGstEffectiveDate] = useState("");
  const [gstDocFile, setGstDocFile] = useState<File | null>(null);
  const [gstDocUploading, setGstDocUploading] = useState(false);
  const gstDocInputRef = useRef<HTMLInputElement>(null);
  // 🛡️ FSSAI & Business License Expiry State
  const [hasFssai, setHasFssai] = useState(true);
  const [fssaiNumber, setFssaiNumber] = useState("");
  const [fssaiExpiryDate, setFssaiExpiryDate] = useState("");
  const [fssaiDocFile, setFssaiDocFile] = useState<File | null>(null);
  const [fssaiUndertakingFile, setFssaiUndertakingFile] = useState<File | null>(null);
  const [licenseExpiryDate, setLicenseExpiryDate] = useState("");
  const fssaiDocInputRef = useRef<HTMLInputElement>(null);
  const fssaiUndertakingInputRef = useRef<HTMLInputElement>(null);
  // 🏢 Multiple Outlets State
  const [hasMultipleOutlets, setHasMultipleOutlets] = useState(false);
  const [outlets, setOutlets] = useState<Array<{
    outletName: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    contactPerson: string;
    contactPhone: string;
  }>>([]);

  const addOutlet = () => {
    setOutlets(prev => [...prev, { outletName: "", address: "", city: "", state: "", pincode: "", contactPerson: "", contactPhone: "" }]);
  };

  const removeOutlet = (index: number) => {
    setOutlets(prev => prev.filter((_, i) => i !== index));
  };

  const updateOutlet = (index: number, field: string, value: string) => {
    setOutlets(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // 📜 Contract-Based Customer State
  const [isContractBased, setIsContractBased] = useState(false);
  const [contractType, setContractType] = useState("");
  const [contractStartDate, setContractStartDate] = useState("");
  const [contractExpiryDate, setContractExpiryDate] = useState("");
  const [contractFile, setContractFile] = useState<File | null>(null);
  const [contractDocUrl, setContractDocUrl] = useState("");
  const [contractNotes, setContractNotes] = useState("");
  const [contractUploading, setContractUploading] = useState(false);
  const contractFileInputRef = useRef<HTMLInputElement>(null);

  // 💰 Advance Payment State
  const [hasPaidAdvance, setHasPaidAdvance] = useState(false);
  const [advanceAmount, setAdvanceAmount] = useState("");
  const [advancePaymentMode, setAdvancePaymentMode] = useState("UPI");
  const [advancePaymentProofFile, setAdvancePaymentProofFile] = useState<File | null>(null);
  const [advancePaymentProofUrl, setAdvancePaymentProofUrl] = useState("");
  const [advancePaymentProofUploading, setAdvancePaymentProofUploading] = useState(false);
  const advancePaymentProofInputRef = useRef<HTMLInputElement>(null);

  // 📁 Tally Group Assignment State
  const [customerGroup, setCustomerGroup] = useState("Sundry Debtors");
  const [tallyGroups, setTallyGroups] = useState<string[]>([]);

  React.useEffect(() => {
    const fetchTallyGroups = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/tally/groups`);
        const json = await res.json();
        if (json.success && json.data) {
          setTallyGroups(json.data);
        }
      } catch (err) {
        console.error("Failed to load Tally groups", err);
      }
    };
    fetchTallyGroups();
  }, [API_BASE]);

  // 🗺️ Route Management Pincode-wise state
  const [availableRoutes, setAvailableRoutes] = useState<any[]>([]);
  const [isPincodeRouteMatched, setIsPincodeRouteMatched] = useState(false);
  const [assignedRoute, setAssignedRoute] = useState("");
  const [routeName, setRouteName] = useState("");
  const [routeCode, setRouteCode] = useState("");
  const [loadingRoutes, setLoadingRoutes] = useState(false);

  React.useEffect(() => {
    if (pincode && pincode.trim().length === 6) {
      const fetchRoutesForPincode = async () => {
        setLoadingRoutes(true);
        try {
          const res = await fetch(`${API_BASE}/api/routes/master?status=Active&pincode=${pincode.trim()}`);
          const data = await res.json();
          
          if (data.success && data.data && data.data.length > 0) {
            setAvailableRoutes(data.data);
            setIsPincodeRouteMatched(true);
            const first = data.data[0];
            setAssignedRoute(first._id);
            setRouteName(first.name);
            setRouteCode(first.code || "");
          } else {
            const allRes = await fetch(`${API_BASE}/api/routes/master?status=Active`);
            const allData = await allRes.json();
            if (allData.success && allData.data) {
              setAvailableRoutes(allData.data);
            } else {
              setAvailableRoutes([]);
            }
            setIsPincodeRouteMatched(false);
          }
        } catch (err) {
          console.error("Error fetching routes for pincode:", err);
        } finally {
          setLoadingRoutes(false);
        }
      };
      fetchRoutesForPincode();
    } else {
      setAvailableRoutes([]);
      setIsPincodeRouteMatched(false);
      setAssignedRoute("");
      setRouteName("");
      setRouteCode("");
    }
  }, [pincode]);

  const handleRouteSelect = (selectedId: string) => {
    setAssignedRoute(selectedId);
    const found = availableRoutes.find(r => r._id === selectedId);
    if (found) {
      setRouteName(found.name);
      setRouteCode(found.code || "");
    } else {
      setRouteName("");
      setRouteCode("");
    }
  };

  // Redirect if already logged in
  React.useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLicenseFile(e.target.files[0]);
    }
  };

  const handleContractFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setContractFile(file);
      setContractUploading(true);
      try {
        const url = await uploadDocument(file);
        setContractDocUrl(url);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to upload contract document");
      } finally {
        setContractUploading(false);
      }
    }
  };

  const handleAdvancePaymentProofFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAdvancePaymentProofFile(file);
      setAdvancePaymentProofUploading(true);
      try {
        const url = await uploadDocument(file);
        setAdvancePaymentProofUrl(url);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to upload advance payment proof");
      } finally {
        setAdvancePaymentProofUploading(false);
      }
    }
  };

  const uploadDocument = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API_BASE}/api/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (!data.success) {
      throw new Error(data.error || "Failed to upload file to Cloudinary");
    }
    return data.url;
  };

  const uploadLicense = async (file: File): Promise<string> => {
    return uploadDocument(file);
  };

  const validateStep = () => {
    const newErrors: Record<string, string> = {};
    if (step === 1) {
      if (name.trim().length < 2) newErrors.name = "Full name is required";
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) newErrors.email = "Please enter a valid email address";
      if (phone.length < 10) newErrors.phone = "Please enter a valid 10-digit phone number";
      if (!department) newErrors.department = "Please select your Department / Designation";
      if (department === "Other" && !customDepartment.trim()) newErrors.customDepartment = "Please specify your Department / Designation";
    } else if (step === 2) {
      if (businessName.trim().length < 2) newErrors.businessName = "Business name is required";
      if (!customerType) newErrors.customerType = "Please select your Business / Customer Type";
      if (customerType === "Other" && !customCustomerType.trim()) newErrors.customCustomerType = "Please enter your custom Business / Customer Type";
      if (address.trim().length < 5) newErrors.address = "Please enter a complete business address";
      if (city.trim().length < 2) newErrors.city = "City is required";
      if (!state) newErrors.state = "Please select a State";
      if (!category) newErrors.category = "Please select a customer tier (A, B, C)";
      
      const pinValidation = validateStatePincode(state, pincode);
      if (!pinValidation.valid) {
        newErrors.pincode = pinValidation.message || "Invalid PIN code for selected State";
      }
      
      if (!isUrg) {
        const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
        if (!gstNumber || !gstRegex.test(gstNumber.toUpperCase())) {
          newErrors.gstNumber = "Please enter a valid 15-digit GST number or mark business as Unregistered (URG)";
        }
        if (!gstEffectiveDate) {
          newErrors.gstEffectiveDate = "Please select GST Effective Date";
        }
        if (!gstDocFile) {
          newErrors.gstDocFile = "Please upload a copy of your GST Certificate";
        }
      }

      if (panNumber.trim()) {
        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
        if (!panRegex.test(panNumber.trim().toUpperCase())) {
          newErrors.panNumber = "Please enter a valid 10-character PAN number (e.g. ABCDE1234F)";
        }
      }

      if (hasMultipleOutlets) {
        if (outlets.length === 0) {
          newErrors.outlets = "Please add details for at least one additional outlet or select 'No'";
        }
        for (let i = 0; i < outlets.length; i++) {
          const o = outlets[i];
          if (!o.outletName.trim()) newErrors[`outletName_${i}`] = `Please enter Outlet Name for Outlet #${i + 1}`;
          if (!o.address.trim()) newErrors[`outletAddress_${i}`] = `Please enter Address for Outlet #${i + 1}`;
          if (!o.city.trim()) newErrors[`outletCity_${i}`] = `Please enter City for Outlet #${i + 1}`;
          if (!o.state) newErrors[`outletState_${i}`] = `Please select State for Outlet #${i + 1}`;
          const oPinVal = validateStatePincode(o.state, o.pincode);
          if (!oPinVal.valid) newErrors[`outletPincode_${i}`] = `Outlet #${i + 1}: ${oPinVal.message || 'Invalid PIN Code'}`;
        }
      }
    } else if (step === 3) {
      if (!licenseFile) newErrors.licenseFile = "Please upload Business License photo";
      if (!licenseExpiryDate) newErrors.licenseExpiryDate = "Please select Trade / Business License Expiry Date";
      if (hasFssai) {
        if (!fssaiNumber.trim()) newErrors.fssaiNumber = "Please enter FSSAI License Number";
        if (!fssaiExpiryDate) newErrors.fssaiExpiryDate = "Please select FSSAI License Expiry Date";
        if (!fssaiDocFile) newErrors.fssaiDocFile = "Please upload FSSAI Certificate document or photo";
      } else {
        if (!fssaiUndertakingFile) newErrors.fssaiUndertakingFile = "Please upload FSSAI Undertaking Document";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    const isValid = validateStep();
    if (!isValid) {
      return;
    }
    setStep(s => s + 1);
  };

  const prevStep = () => {
    setErrors({});
    setStep(s => s - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const newErrors: Record<string, string> = {};

    if (!isUrg) {
      if (!gstEffectiveDate) newErrors.gstEffectiveDate = "Please select GST Effective Date";
      if (!gstDocFile) newErrors.gstDocFile = "Please upload a copy of your GST Certificate";
    }

    if (!licenseFile) newErrors.licenseFile = "Please upload Business License photo";
    if (!licenseExpiryDate) newErrors.licenseExpiryDate = "Please select Trade / Business License Expiry Date";

    if (hasFssai) {
      if (!fssaiNumber.trim()) newErrors.fssaiNumber = "Please enter FSSAI License Number";
      if (!fssaiExpiryDate) newErrors.fssaiExpiryDate = "Please select FSSAI License Expiry Date";
      if (!fssaiDocFile) newErrors.fssaiDocFile = "Please upload FSSAI Certificate document or photo";
    } else {
      if (!fssaiUndertakingFile) newErrors.fssaiUndertakingFile = "Please upload FSSAI Undertaking Document";
    }

    if (!category) {
      newErrors.category = "Please select a customer tier (A, B, C)";
    }

    if (password && password.length < 8) {
      newErrors.password = "Password must be at least 8 characters if entered manually";
    }

    if (password && password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Run step 1 and step 2 validations to be fully complete
    if (name.trim().length < 2) newErrors.name = "Full name is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) newErrors.email = "Please enter a valid email address";
    if (phone.length < 10) newErrors.phone = "Please enter a valid 10-digit phone number";
    if (!department) newErrors.department = "Please select your Department / Designation";
    if (department === "Other" && !customDepartment.trim()) newErrors.customDepartment = "Please specify your Department / Designation";

    if (businessName.trim().length < 2) newErrors.businessName = "Business name is required";
    if (!customerType) newErrors.customerType = "Please select your Business / Customer Type";
    if (customerType === "Other" && !customCustomerType.trim()) newErrors.customCustomerType = "Please enter your custom Business / Customer Type";
    if (address.trim().length < 5) newErrors.address = "Please enter a complete business address";
    if (city.trim().length < 2) newErrors.city = "City is required";
    if (!state) newErrors.state = "Please select a State";
    
    const pinValidation = validateStatePincode(state, pincode);
    if (!pinValidation.valid) {
      newErrors.pincode = pinValidation.message || "Invalid PIN code for selected State";
    }

    if (!isUrg) {
      const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
      if (gstNumber !== "URG") {
        if (!gstNumber || !gstRegex.test(gstNumber.toUpperCase())) {
          newErrors.gstNumber = "Please enter a valid 15-digit GST number or mark business as Unregistered (URG)";
        }
      }
    }

    if (panNumber.trim()) {
      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      if (!panRegex.test(panNumber.trim().toUpperCase())) {
        newErrors.panNumber = "Please enter a valid 10-character PAN number (e.g. ABCDE1234F)";
      }
    }

    if (hasMultipleOutlets) {
      if (outlets.length === 0) {
        newErrors.outlets = "Please add details for at least one additional outlet or select 'No'";
      }
      for (let i = 0; i < outlets.length; i++) {
        const o = outlets[i];
        if (!o.outletName.trim()) newErrors[`outletName_${i}`] = `Please enter Outlet Name for Outlet #${i + 1}`;
        if (!o.address.trim()) newErrors[`outletAddress_${i}`] = `Please enter Address for Outlet #${i + 1}`;
        if (!o.city.trim()) newErrors[`outletCity_${i}`] = `Please enter City for Outlet #${i + 1}`;
        if (!o.state) newErrors[`outletState_${i}`] = `Please select State for Outlet #${i + 1}`;
        const oPinVal = validateStatePincode(o.state, o.pincode);
        if (!oPinVal.valid) newErrors[`outletPincode_${i}`] = `Outlet #${i + 1}: ${oPinVal.message || 'Invalid PIN Code'}`;
      }
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setLoading(true);

    try {
      // 1. Upload License Image if present
      let licenseUrl = null;
      if (licenseFile) {
        licenseUrl = await uploadLicense(licenseFile);
      }

      // 1.5 Upload FSSAI Documents
      let fssaiDocUrl = null;
      if (hasFssai && fssaiDocFile) {
        fssaiDocUrl = await uploadDocument(fssaiDocFile);
      }
      let fssaiUndertakingDocUrl = null;
      if (!hasFssai && fssaiUndertakingFile) {
        fssaiUndertakingDocUrl = await uploadDocument(fssaiUndertakingFile);
      }

      // 2. Upload Contract Document if contract-based and file selected but not uploaded yet
      let finalContractUrl = contractDocUrl;
      if (isContractBased && contractFile && !finalContractUrl) {
        finalContractUrl = await uploadDocument(contractFile);
      }

      // 3. Upload URC Document / Undertaking if URG selected
      let urcUrl = null;
      if (isUrg && urcFile) {
        urcUrl = await uploadDocument(urcFile);
      }

      // 3.5 Upload GST Certificate if GST Registered
      let gstDocUrl = null;
      if (!isUrg && gstDocFile) {
        gstDocUrl = await uploadDocument(gstDocFile);
      }

      const finalCustomerType = customerType === "Other" ? customCustomerType.trim() : customerType;
      const finalDepartment = department === "Other" ? customDepartment.trim() : department;

      // 4. Register Customer
      await registerCustomer({
        username: email.trim(),
        email: email.trim(),
        name: name.trim(),
        phone: countryCode + phone.trim(),
        businessName: businessName.trim(),
        gstNumber: isUrg ? "URG" : (gstNumber.trim().toUpperCase() || "URG"),
        gstEffectiveDate: !isUrg ? (gstEffectiveDate || null) : null,
        gstDocUrl: !isUrg ? gstDocUrl : null,
        panNumber: panNumber ? panNumber.trim().toUpperCase() : null,
        customerGroup: customerGroup || "Sundry Debtors",
        assignedRoute: assignedRoute || null,
        routeName: routeName || null,
        routeCode: routeCode || null,
        urcDocUrl: isUrg ? urcUrl : null,
        hasFssai: Boolean(hasFssai),
        fssaiNumber: hasFssai ? fssaiNumber.trim() : null,
        fssaiExpiryDate: hasFssai ? fssaiExpiryDate : null,
        fssaiDocUrl: hasFssai ? fssaiDocUrl : null,
        fssaiUndertakingDocUrl: !hasFssai ? fssaiUndertakingDocUrl : null,
        licenseExpiryDate: licenseExpiryDate || null,
        hasMultipleOutlets,
        outlets: hasMultipleOutlets ? outlets : [],
        locations: [
          {
            outletName: "Main Branch",
            address: address.trim(),
            city: city.trim(),
            state: state.trim(),
            pincode: pincode.trim(),
            isPrimary: true
          },
          ...(hasMultipleOutlets ? outlets.map(o => ({
            outletName: o.outletName.trim(),
            address: o.address.trim(),
            city: o.city.trim(),
            state: o.state.trim(),
            pincode: o.pincode.trim(),
            contactPerson: o.contactPerson?.trim() || null,
            contactPhone: o.contactPhone?.trim() || null,
            isPrimary: false
          })) : [])
        ],
        category,
        customerType: finalCustomerType,
        department: finalDepartment,
        creditTerm: Number(creditTerm || 0),
        creditLimit: Number(creditLimit || 0),
        password,
        licenseImage: licenseUrl,
        isContractBased,
        contract: isContractBased ? {
          contractType: contractType || null,
          documentUrl: finalContractUrl || null,
          startDate: contractStartDate || null,
          expiryDate: contractExpiryDate || null,
          notes: contractNotes.trim() || null
        } : undefined,
        advanceAmount: hasPaidAdvance ? Number(advanceAmount) : 0,
        hasPaidAdvance: hasPaidAdvance,
        advancePaymentMode: hasPaidAdvance ? advancePaymentMode : null,
        advancePaymentProofUrl: hasPaidAdvance ? advancePaymentProofUrl : null
      });

      setMessage("Registration successful! Your account is pending approval by the Customer Care Team. Redirecting to login...");
      setTimeout(() => router.push('/login'), 3500);
    } catch (err) {
      setErrors({ submit: err instanceof Error ? err.message : "Registration failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-outfit overflow-hidden">
      <main className="flex-grow flex flex-col lg:flex-row relative min-h-screen">
        {/* Left Side: Form */}
        <div className="w-full lg:w-[50%] xl:w-[45%] p-8 sm:p-12 lg:p-16 xl:p-20 flex flex-col justify-center relative bg-white z-20 overflow-y-auto">
          <Link href="/" className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all">
            <X size={24} />
          </Link>

          <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              {[1, 2, 3].map(i => (
                <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${step >= i ? 'w-8 bg-[#D97706]' : 'w-4 bg-gray-200'}`} />
              ))}
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-2">Create Business Account</h2>
            <p className="text-gray-500">Step {step} of 3 — {step === 1 ? 'Contact Details' : step === 2 ? 'Business Information' : 'Security & Verification'}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 max-w-md relative">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Full Name"
                      className="w-full pl-12 pr-5 py-4 border border-gray-200 rounded-2xl bg-gray-50 focus:outline-none focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706] transition-all shadow-sm"
                      required
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1 font-medium">{errors.name}</p>}
                  </div>

                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email Address"
                      className="w-full pl-12 pr-5 py-4 border border-gray-200 rounded-2xl bg-gray-50 focus:outline-none focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706] transition-all shadow-sm"
                      required
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1 font-medium">{errors.email}</p>}
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex gap-3">
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="w-[100px] px-3 py-4 border border-gray-200 rounded-2xl bg-gray-50 focus:outline-none focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706] transition-all shadow-sm font-bold"
                      >
                        <option value="+91">+91</option>
                        <option value="+1">+1</option>
                      </select>
                      <div className="relative flex-1">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                          placeholder="Phone Number *"
                          className="w-full pl-12 pr-5 py-4 border border-gray-200 rounded-2xl bg-gray-50 focus:outline-none focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706] transition-all shadow-sm"
                          required
                        />
                      </div>
                    </div>
                    {errors.phone && <p className="text-red-500 text-xs mt-1 font-medium">{errors.phone}</p>}
                  </div>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className={`w-full pl-12 pr-5 py-4 border border-gray-200 rounded-2xl bg-gray-50 focus:outline-none focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706] transition-all shadow-sm ${!department ? 'text-gray-400' : 'text-gray-900'}`}
                      required
                    >
                      <option value="" disabled>Select Contact Department / Role *</option>
                      {CUSTOMER_DEPARTMENTS.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                    {errors.department && <p className="text-red-500 text-xs mt-1 font-medium">{errors.department}</p>}
                  </div>
                  {department === "Other" && (
                    <div className="relative animate-in fade-in slide-in-from-top-1 duration-200">
                      <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D97706]" size={20} />
                      <input
                        type="text"
                        value={customDepartment}
                        onChange={(e) => setCustomDepartment(e.target.value)}
                        placeholder="Specify Contact Department / Role *"
                        className="w-full pl-12 pr-5 py-4 border border-[#D97706]/40 rounded-2xl bg-amber-50/40 focus:outline-none focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706] transition-all text-gray-900 font-medium text-sm"
                        required
                      />
                      {errors.customDepartment && <p className="text-red-500 text-xs mt-1 font-medium">{errors.customDepartment}</p>}
                    </div>
                  )}
                  <button type="button" onClick={nextStep} className="w-full py-4 bg-[#D97706] text-white font-bold rounded-2xl shadow-lg flex items-center justify-center gap-2">
                    Next Step <ArrowRight size={20} />
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="relative">
                    <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="Business Name"
                      className="w-full pl-12 pr-5 py-4 border border-gray-200 rounded-2xl bg-gray-50 focus:outline-none focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706] transition-all shadow-sm"
                      required
                    />
                    {errors.businessName && <p className="text-red-500 text-xs mt-1 font-medium">{errors.businessName}</p>}
                  </div>

                  {/* GST vs URG Selection Mode */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-gray-700 block ml-1">GST Registration Status *</label>
                    <div className="grid grid-cols-2 gap-2 bg-gray-100 p-1.5 rounded-2xl border border-gray-200">
                      <button
                        type="button"
                        onClick={() => {
                          setIsUrg(false);
                          setGstNumber("");
                        }}
                        className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${!isUrg ? 'bg-white text-gray-900 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-800'}`}
                      >
                        <span>GST Registered</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsUrg(true);
                          setGstNumber("URG");
                        }}
                        className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${isUrg ? 'bg-[#D97706] text-white shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
                      >
                        <span>Unregistered (URG)</span>
                      </button>
                    </div>

                    {!isUrg ? (
                      <div className="space-y-3 animate-in fade-in duration-200">
                        <div className="relative">
                          <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                          <input
                            type="text"
                            value={gstNumber === "URG" ? "" : gstNumber}
                            onChange={(e) => setGstNumber(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 15))}
                            placeholder="Enter 15-Digit GST Number *"
                            maxLength={15}
                            className="w-full pl-12 pr-5 py-4 border border-gray-200 rounded-2xl bg-gray-50 focus:outline-none focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706] transition-all shadow-sm uppercase font-semibold text-gray-900"
                            required={!isUrg}
                          />
                          {errors.gstNumber && <p className="text-red-500 text-xs mt-1 font-medium">{errors.gstNumber}</p>}
                        </div>

                        {/* 📅 GST Effective Date Field */}
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-semibold">Effective Date *</span>
                          <input
                            type="date"
                            value={gstEffectiveDate}
                            onChange={(e) => setGstEffectiveDate(e.target.value)}
                            className="w-full pl-36 pr-5 py-4 border border-gray-200 rounded-2xl bg-gray-50 focus:outline-none focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706] transition-all shadow-sm font-medium text-gray-955"
                            required={!isUrg}
                          />
                          {errors.gstEffectiveDate && <p className="text-red-500 text-xs mt-1 font-medium">{errors.gstEffectiveDate}</p>}
                        </div>

                        {/* 📁 GST Certificate Document Upload */}
                        <div className="flex flex-col gap-1 pt-1">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                            <input
                              type="file"
                              ref={gstDocInputRef}
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  setGstDocFile(e.target.files[0]);
                                }
                              }}
                              accept="image/*,.pdf"
                              className="hidden"
                            />
                            <button
                              type="button"
                              onClick={() => gstDocInputRef.current?.click()}
                              className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 transition-all flex items-center justify-center gap-2 shadow-sm"
                            >
                              <Upload size={16} className="text-gray-500" />
                              {gstDocFile ? "Change GST Certificate" : "Upload GST Certificate *"}
                            </button>
                            {gstDocFile && (
                              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 truncate max-w-[220px]">
                                ✓ {gstDocFile.name}
                              </span>
                            )}
                          </div>
                          {errors.gstDocFile && <p className="text-red-500 text-xs mt-1 font-medium">{errors.gstDocFile}</p>}
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200 space-y-3 animate-in fade-in duration-200">
                        <p className="text-xs text-amber-900 font-medium">
                          <strong>Unregistered Business (URG) Selected.</strong> GSTIN is optional. You can upload your URC Certificate or GST Exemption Undertaking document below.
                        </p>
                        
                        {/* URC Document / Undertaking Upload Button */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-1">
                          <input
                            type="file"
                            ref={urcFileInputRef}
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                setUrcFile(e.target.files[0]);
                              }
                            }}
                            accept="image/*,.pdf"
                            className="hidden"
                          />
                          <button
                            type="button"
                            onClick={() => urcFileInputRef.current?.click()}
                            className="px-4 py-2.5 bg-white border border-amber-300 rounded-xl text-xs font-bold text-amber-900 hover:bg-amber-100/50 transition-all flex items-center justify-center gap-2 shadow-xs"
                          >
                            <Upload size={16} className="text-amber-700" />
                            {urcFile ? "Change URC / Undertaking Doc" : "Upload URC / Undertaking Doc"}
                          </button>
                          {urcFile && (
                            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 truncate max-w-[220px]">
                              ✓ {urcFile.name}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 💳 PAN Number Field */}
                  <div className="relative">
                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      value={panNumber}
                      onChange={(e) => setPanNumber(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10))}
                      placeholder="PAN Number (e.g. ABCDE1234F)"
                      maxLength={10}
                      className="w-full pl-12 pr-5 py-4 border border-gray-200 rounded-2xl bg-gray-50 focus:outline-none focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706] transition-all shadow-sm uppercase font-medium text-gray-900"
                    />
                    {errors.panNumber && <p className="text-red-500 text-xs mt-1 font-medium">{errors.panNumber}</p>}
                  </div>

                   {/* 📁 Under Group (Tally) */}
                   <div className="space-y-1.5">
                     <label className="text-xs font-bold text-gray-700 block ml-1">Customer Group/Under</label>
                     <div className="relative">
                       <Folder className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                       <select
                         value={customerGroup}
                         onChange={(e) => setCustomerGroup(e.target.value)}
                         className={`w-full pl-12 pr-5 py-4 border border-gray-200 rounded-2xl bg-gray-50 focus:outline-none focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706] transition-all shadow-sm font-medium ${!customerGroup ? 'text-gray-400' : 'text-gray-900'}`}
                       >
                         {tallyGroups.length === 0 ? (
                           <option value="Sundry Debtors">Sundry Debtors (Recommended)</option>
                         ) : (
                           tallyGroups.map(g => (
                             <option key={g} value={g}>
                               {g === "Sundry Debtors" ? "Sundry Debtors (Recommended)" : g}
                             </option>
                           ))
                         )}
                       </select>
                     </div>
                   </div>

                  <div className="relative">
                    <Store className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <select
                      value={customerType}
                      onChange={(e) => setCustomerType(e.target.value)}
                      className={`w-full pl-12 pr-5 py-4 border border-gray-200 rounded-2xl bg-gray-50 focus:outline-none focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706] transition-all shadow-sm ${!customerType ? 'text-gray-400' : 'text-gray-900'}`}
                      required
                    >
                      <option value="" disabled>Select Business / Customer Type *</option>
                      {CUSTOMER_TYPES.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    {errors.customerType && <p className="text-red-500 text-xs mt-1 font-medium">{errors.customerType}</p>}
                  </div>
                  {customerType === "Other" && (
                    <div className="relative animate-in fade-in slide-in-from-top-1 duration-200">
                      <Store className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D97706]" size={20} />
                      <input
                        type="text"
                        value={customCustomerType}
                        onChange={(e) => setCustomCustomerType(e.target.value)}
                        placeholder="Specify Your Business / Customer Type *"
                        className="w-full pl-12 pr-5 py-4 border border-[#D97706]/40 rounded-2xl bg-amber-50/40 focus:outline-none focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706] transition-all text-gray-900 font-medium text-sm"
                        required
                      />
                      {errors.customCustomerType && <p className="text-red-500 text-xs mt-1 font-medium">{errors.customCustomerType}</p>}
                    </div>
                  )}
                  <div className="relative">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className={`w-full pl-12 pr-5 py-4 border border-gray-200 rounded-2xl bg-gray-50 focus:outline-none focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706] transition-all shadow-sm ${!category ? 'text-gray-400' : 'text-gray-900'}`}
                      required
                    >
                      <option value="" disabled>Select Customer Tier *</option>
                      <option value="A">Tier A (Premium)</option>
                      <option value="B">Tier B (Standard)</option>
                      <option value="C">Tier C (Basic)</option>
                    </select>
                    {errors.category && <p className="text-red-500 text-xs mt-1 font-medium">{errors.category}</p>}
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-4 text-gray-400" size={20} />
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Full Business Address"
                      rows={2}
                      className="w-full pl-12 pr-5 py-4 border border-gray-200 rounded-2xl bg-gray-50 focus:outline-none focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706] transition-all shadow-sm"
                      required
                    />
                    {errors.address && <p className="text-red-500 text-xs mt-1 font-medium">{errors.address}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                       <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                       <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="City *"
                        className="w-full pl-11 pr-4 py-4 border border-gray-200 rounded-2xl bg-gray-50 focus:outline-none focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706] transition-all shadow-sm"
                        required
                      />
                      {errors.city && <p className="text-red-500 text-xs mt-1 font-medium">{errors.city}</p>}
                    </div>
                    <div className="relative">
                       <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                       <select
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className={`w-full pl-11 pr-3 py-4 border border-gray-200 rounded-2xl bg-gray-50 focus:outline-none focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706] transition-all shadow-sm text-sm font-medium ${!state ? 'text-gray-400' : 'text-gray-900'}`}
                        required
                      >
                        <option value="" disabled>Select State *</option>
                        {INDIAN_STATES.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      {errors.state && <p className="text-red-500 text-xs mt-1 font-medium">{errors.state}</p>}
                    </div>
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="PIN Code (6 digits) *"
                      maxLength={6}
                      className="w-full pl-11 pr-4 py-4 border border-gray-200 rounded-2xl bg-gray-50 focus:outline-none focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706] transition-all shadow-sm"
                      required
                    />
                    {errors.pincode && <p className="text-red-500 text-xs mt-1 font-medium">{errors.pincode}</p>}
                  </div>

                  {/* 🗺️ Pincode-Wise Route Assignment Component */}
                  {pincode && pincode.trim().length === 6 && (
                    <div className="p-4 bg-orange-50/80 rounded-2xl border border-orange-200/80 space-y-3 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-bold text-gray-900 flex items-center gap-2">
                          <MapPin size={18} className="text-orange-600" />
                          Delivery Route Selection
                        </label>
                        {loadingRoutes ? (
                           <span className="text-xs font-semibold text-gray-500">Checking routes...</span>
                        ) : isPincodeRouteMatched ? (
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                            Matched to PIN
                          </span>
                        ) : (
                          <span className="text-xs font-medium text-orange-700 bg-orange-100 px-2.5 py-1 rounded-full">
                            All Active Routes
                          </span>
                        )}
                      </div>

                      {availableRoutes.length > 0 ? (
                        <select
                          value={assignedRoute}
                          onChange={(e) => handleRouteSelect(e.target.value)}
                          className="w-full px-4 py-3 border border-orange-200 rounded-xl bg-white focus:outline-none focus:border-orange-500 text-sm font-bold text-gray-900 shadow-sm"
                        >
                          <option value="">Select your delivery route...</option>
                          {availableRoutes.map(route => (
                            <option key={route._id} value={route._id}>
                              {route.name} ({route.code || 'RM'}) {route.originCity && route.destinationCity ? `[${route.originCity} → ${route.destinationCity}]` : ''}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <p className="text-xs text-gray-500 font-medium">No active delivery routes are currently configured.</p>
                      )}
                    </div>
                  )}

                  {/* 🏢 Multiple Outlets Section */}
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200/80 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-bold text-gray-800 block">Do you have multiple outlets / branches?</span>
                        <span className="text-xs text-gray-500">Add locations for your additional branches</span>
                      </div>
                      <div className="flex bg-gray-200 p-1 rounded-xl">
                        <button
                          type="button"
                          onClick={() => {
                            setHasMultipleOutlets(true);
                            if (outlets.length === 0) addOutlet();
                          }}
                          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${hasMultipleOutlets ? 'bg-[#D97706] text-white shadow-sm' : 'text-gray-600'}`}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={() => setHasMultipleOutlets(false)}
                          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${!hasMultipleOutlets ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-600'}`}
                        >
                          No
                        </button>
                      </div>
                    </div>

                    {hasMultipleOutlets && (
                      <div className="space-y-4 pt-2 border-t border-gray-200 animate-in fade-in slide-in-from-top-1 duration-200">
                        {outlets.map((outlet, index) => (
                          <div key={index} className="p-3.5 bg-white rounded-xl border border-amber-200/80 space-y-3 shadow-sm relative">
                            <div className="flex items-center justify-between pb-1 border-b border-gray-100">
                              <span className="text-xs font-bold text-[#D97706]">Additional Outlet #{index + 1}</span>
                              <button
                                type="button"
                                onClick={() => removeOutlet(index)}
                                className="text-xs text-red-500 hover:text-red-700 font-bold px-2 py-0.5 rounded hover:bg-red-50"
                              >
                                Remove
                              </button>
                            </div>
                            <div>
                              <input
                                type="text"
                                value={outlet.outletName}
                                onChange={(e) => updateOutlet(index, "outletName", e.target.value)}
                                placeholder="Outlet / Branch Name (e.g. Andheri Branch) *"
                                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:border-[#D97706] text-xs font-medium"
                                required
                              />
                              {errors[`outletName_${index}`] && <p className="text-red-500 text-xs mt-1 font-medium">{errors[`outletName_${index}`]}</p>}
                            </div>
                            <div>
                              <textarea
                                value={outlet.address}
                                onChange={(e) => updateOutlet(index, "address", e.target.value)}
                                placeholder="Outlet Address *"
                                rows={2}
                                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:border-[#D97706] text-xs font-medium"
                                required
                              />
                              {errors[`outletAddress_${index}`] && <p className="text-red-500 text-xs mt-1 font-medium">{errors[`outletAddress_${index}`]}</p>}
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <input
                                  type="text"
                                  value={outlet.city}
                                  onChange={(e) => updateOutlet(index, "city", e.target.value)}
                                  placeholder="City *"
                                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:border-[#D97706] text-xs font-medium"
                                  required
                                />
                                {errors[`outletCity_${index}`] && <p className="text-red-500 text-xs mt-1 font-medium">{errors[`outletCity_${index}`]}</p>}
                              </div>
                              <div>
                                <select
                                  value={outlet.state}
                                  onChange={(e) => updateOutlet(index, "state", e.target.value)}
                                  className="w-full px-2 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:border-[#D97706] text-xs font-medium"
                                  required
                                >
                                  <option value="" disabled>State *</option>
                                  {INDIAN_STATES.map(s => (
                                    <option key={s} value={s}>{s}</option>
                                  ))}
                                </select>
                                {errors[`outletState_${index}`] && <p className="text-red-500 text-xs mt-1 font-medium">{errors[`outletState_${index}`]}</p>}
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <input
                                  type="text"
                                  value={outlet.pincode}
                                  onChange={(e) => updateOutlet(index, "pincode", e.target.value.replace(/\D/g, "").slice(0, 6))}
                                  placeholder="PIN Code *"
                                  maxLength={6}
                                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:border-[#D97706] text-xs font-medium"
                                  required
                                />
                                {errors[`outletPincode_${index}`] && <p className="text-red-500 text-xs mt-1 font-medium">{errors[`outletPincode_${index}`]}</p>}
                              </div>
                              <input
                                type="text"
                                value={outlet.contactPerson}
                                onChange={(e) => updateOutlet(index, "contactPerson", e.target.value)}
                                placeholder="Manager Name (Optional)"
                                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:border-[#D97706] text-xs font-medium"
                              />
                            </div>
                            <input
                              type="tel"
                              value={outlet.contactPhone}
                              onChange={(e) => updateOutlet(index, "contactPhone", e.target.value.replace(/\D/g, "").slice(0, 10))}
                              placeholder="Outlet Contact Phone (Optional)"
                              maxLength={10}
                              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:border-[#D97706] text-xs font-medium"
                            />
                          </div>
                        ))}
                        {errors.outlets && <p className="text-red-500 text-xs mt-1 font-medium">{errors.outlets}</p>}
                        <button
                          type="button"
                          onClick={addOutlet}
                          className="w-full py-2.5 border-2 border-dashed border-[#D97706]/40 text-[#D97706] bg-amber-50/50 hover:bg-amber-100/50 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                        >
                          + Add Another Outlet / Branch
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-4">
                    <button type="button" onClick={prevStep} className="flex-1 py-4 border border-gray-200 text-gray-600 font-bold rounded-2xl flex items-center justify-center gap-2">
                      <ArrowLeft size={20} /> Back
                    </button>
                    <button type="button" onClick={nextStep} className="flex-2 py-4 bg-[#D97706] text-white font-bold rounded-2xl shadow-lg flex items-center justify-center gap-2 px-8">
                      Continue <ArrowRight size={20} />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div 
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Business License (Photo) *</label>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className={`w-full border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all ${licenseFile ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-gray-50 hover:bg-white hover:border-[#D97706]'}`}
                    >
                      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                      {licenseFile ? (
                        <>
                          <CheckCircle className="text-green-500 mb-2" size={32} />
                          <span className="text-sm font-medium text-green-700">{licenseFile.name}</span>
                        </>
                      ) : (
                        <>
                          <Upload className="text-gray-400 mb-2" size={32} />
                          <span className="text-sm font-medium text-gray-600">Click to upload license image *</span>
                        </>
                      )}
                    </div>
                    {errors.licenseFile && <p className="text-red-500 text-xs mt-1 font-medium">{errors.licenseFile}</p>}
                  </div>

                  {/* 📅 Business / Trade License Expiry Date */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 block ml-1">Trade / Business License Expiry Date *</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="date"
                        value={licenseExpiryDate}
                        onChange={(e) => setLicenseExpiryDate(e.target.value)}
                        className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#D97706]/20 focus:border-[#D97706] transition-all text-sm font-medium text-gray-900"
                        required
                      />
                    </div>
                    {errors.licenseExpiryDate && <p className="text-red-500 text-xs mt-1 font-medium">{errors.licenseExpiryDate}</p>}
                    <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200">
                      ⚠️ <strong>License Expiry Rule:</strong> If the license expires, bill generation, order placement, and product dispatch for your account will be suspended automatically until updated.
                    </p>
                  </div>

                  {/* 🛡️ FSSAI License & Validation / Expiry Section */}
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3.5">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-gray-800 block">FSSAI License Status *</span>
                        <span className="text-[11px] text-gray-500">Are you registered with FSSAI?</span>
                      </div>
                      <div className="flex bg-gray-200 p-1 rounded-xl">
                        <button
                          type="button"
                          onClick={() => setHasFssai(true)}
                          className={`px-3.5 py-1 text-xs font-bold rounded-lg transition-all ${hasFssai ? 'bg-[#D97706] text-white shadow-sm' : 'text-gray-600'}`}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={() => setHasFssai(false)}
                          className={`px-3.5 py-1 text-xs font-bold rounded-lg transition-all ${!hasFssai ? 'bg-[#D97706] text-white shadow-sm' : 'text-gray-600'}`}
                        >
                          No
                        </button>
                      </div>
                    </div>

                    {hasFssai ? (
                      <div className="space-y-3 pt-2 border-t border-gray-200 animate-in fade-in slide-in-from-top-1 duration-200">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-700 block ml-1">FSSAI License Number *</label>
                          <div className="relative">
                            <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                              type="text"
                              value={fssaiNumber}
                              onChange={(e) => setFssaiNumber(e.target.value)}
                              placeholder="Enter 14-digit FSSAI Number *"
                              className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#D97706]/20 focus:border-[#D97706] text-sm font-medium"
                              required
                            />
                          </div>
                          {errors.fssaiNumber && <p className="text-red-500 text-xs mt-1 font-medium">{errors.fssaiNumber}</p>}
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-700 block ml-1">FSSAI Expiry / Validation Date *</label>
                          <div className="relative">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                              type="date"
                              value={fssaiExpiryDate}
                              onChange={(e) => setFssaiExpiryDate(e.target.value)}
                              className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#D97706]/20 focus:border-[#D97706] text-sm font-medium"
                              required
                            />
                          </div>
                          {errors.fssaiExpiryDate && <p className="text-red-500 text-xs mt-1 font-medium">{errors.fssaiExpiryDate}</p>}
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-700 block ml-1">FSSAI Certificate Document / Photo *</label>
                          <input
                            type="file"
                            ref={fssaiDocInputRef}
                            onChange={(e) => e.target.files && setFssaiDocFile(e.target.files[0])}
                            accept="image/*,.pdf"
                            className="hidden"
                          />
                          <button
                            type="button"
                            onClick={() => fssaiDocInputRef.current?.click()}
                            className="w-full py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
                          >
                            <Upload size={14} className="text-gray-500" />
                            {fssaiDocFile ? `✓ ${fssaiDocFile.name}` : "Upload FSSAI Certificate / Photo *"}
                          </button>
                          {errors.fssaiDocFile && <p className="text-red-500 text-xs mt-1 font-medium">{errors.fssaiDocFile}</p>}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3 pt-2 border-t border-gray-200 animate-in fade-in slide-in-from-top-1 duration-200">
                        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 space-y-2">
                          <p className="text-xs font-bold text-amber-900">FSSAI Undertaking Document Required *</p>
                          <p className="text-[11px] text-amber-700">Since your business does not have an FSSAI license, an official signed FSSAI Undertaking Document must be uploaded.</p>
                          <input
                            type="file"
                            ref={fssaiUndertakingInputRef}
                            onChange={(e) => e.target.files && setFssaiUndertakingFile(e.target.files[0])}
                            accept="image/*,.pdf"
                            className="hidden"
                          />
                          <button
                            type="button"
                            onClick={() => fssaiUndertakingInputRef.current?.click()}
                            className="w-full py-2.5 bg-white border border-amber-300 rounded-xl text-xs font-bold text-amber-900 hover:bg-amber-100/50 transition-all flex items-center justify-center gap-2"
                          >
                            <Upload size={14} className="text-amber-700" />
                            {fssaiUndertakingFile ? `✓ ${fssaiUndertakingFile.name}` : "Upload FSSAI Undertaking Document *"}
                          </button>
                          {errors.fssaiUndertakingFile && <p className="text-red-500 text-xs mt-1 font-medium">{errors.fssaiUndertakingFile}</p>}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 📜 Contract-Based Customer Option (Optional) */}
                  <div className="border border-amber-200 bg-amber-50/40 rounded-2xl p-5 space-y-3 transition-all shadow-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
                          <FileCheck size={18} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-gray-900">Contract-Based Registration</h4>
                          <p className="text-[11px] text-gray-500">Optional for customers with active supply agreement</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={isContractBased} 
                          onChange={(e) => setIsContractBased(e.target.checked)} 
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D97706]"></div>
                      </label>
                    </div>

                    {isContractBased && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-3 pt-3 border-t border-amber-200/60">
                        <div>
                          <label className="text-xs font-bold text-gray-700 block mb-1">Contract Agreement Type</label>
                          <select
                            value={contractType}
                            onChange={(e) => setContractType(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-[#D97706] text-xs font-bold text-gray-800"
                          >
                            <option value="Annual Supply Agreement">Annual Supply Agreement</option>
                            <option value="Fixed Rate Contract">Fixed Rate Contract</option>
                            <option value="Service Level Agreement (SLA)">Service Level Agreement (SLA)</option>
                            <option value="Volume Discount Agreement">Volume Discount Agreement</option>
                            <option value="Custom Contract">Custom Contract / SLA</option>
                          </select>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-bold text-gray-700 block mb-1">Contract Start Date</label>
                            <div className="relative">
                              <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                              <input
                                type="date"
                                value={contractStartDate}
                                onChange={(e) => setContractStartDate(e.target.value)}
                                className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-[#D97706] text-xs font-bold text-gray-800"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="text-xs font-bold text-gray-700 block mb-1">Contract Expiry Date</label>
                            <div className="relative">
                              <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                              <input
                                type="date"
                                value={contractExpiryDate}
                                onChange={(e) => setContractExpiryDate(e.target.value)}
                                className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-[#D97706] text-xs font-bold text-gray-800"
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-bold text-gray-700 block mb-1">Contract Document (PDF/JPG/PNG/DOCX)</label>
                          <div 
                            onClick={() => contractFileInputRef.current?.click()}
                            className={`w-full border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all ${contractDocUrl ? 'border-green-500 bg-green-50/80' : contractFile ? 'border-amber-400 bg-amber-50' : 'border-gray-300 bg-white hover:border-[#D97706]'}`}
                          >
                            <input type="file" ref={contractFileInputRef} onChange={handleContractFileChange} className="hidden" accept=".pdf,.doc,.docx,image/*" />
                            {contractUploading ? (
                              <p className="text-xs font-bold text-amber-700 animate-pulse flex items-center gap-1.5">
                                ☁️ Uploading document to Cloudinary...
                              </p>
                            ) : contractDocUrl ? (
                              <div className="flex items-center gap-2">
                                <CheckCircle className="text-green-600 shrink-0" size={20} />
                                <div className="text-left">
                                  <span className="text-xs font-extrabold text-green-800 block truncate max-w-[240px]">{contractFile?.name || "Contract Document"}</span>
                                  <span className="text-[10px] text-green-600 font-bold">Uploaded to Cloudinary ☁️</span>
                                </div>
                              </div>
                            ) : contractFile ? (
                              <div className="flex items-center gap-2">
                                <FileCheck className="text-amber-600 shrink-0" size={20} />
                                <span className="text-xs font-bold text-amber-800 truncate max-w-[240px]">{contractFile.name}</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <Upload className="text-gray-400" size={18} />
                                <span className="text-xs font-medium text-gray-600">Upload signed agreement document</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-bold text-gray-700 block mb-1">Special Terms / Notes (Optional)</label>
                          <textarea
                            value={contractNotes}
                            onChange={(e) => setContractNotes(e.target.value)}
                            placeholder="Specify fixed rates, credit period terms, volume targets..."
                            rows={2}
                            className="w-full p-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-[#D97706] text-xs font-medium text-gray-800"
                          />
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* 💰 Advance Payment Section */}
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-gray-800 block">Advance Payment Customer?</span>
                        <span className="text-[11px] text-gray-500">Enable placing orders with Advance Payment mode</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={hasPaidAdvance}
                          onChange={(e) => setHasPaidAdvance(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#D97706]"></div>
                      </label>
                    </div>
                  </div>

                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create Password (Optional - Leave blank for Auto-Gen)"
                      className="w-full pl-12 pr-5 py-4 border border-gray-200 rounded-2xl bg-gray-50 focus:outline-none focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706] transition-all shadow-sm"
                    />
                    {errors.password && <p className="text-red-500 text-xs mt-1 font-medium">{errors.password}</p>}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm Password (Optional)"
                      className="w-full pl-12 pr-5 py-4 border border-gray-200 rounded-2xl bg-gray-50 focus:outline-none focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706] transition-all shadow-sm"
                    />
                    {errors.confirmPassword && <p className="text-red-500 text-xs mt-1 font-medium">{errors.confirmPassword}</p>}
                  </div>

                  {errors.submit && <p className="text-red-500 text-sm font-medium">{errors.submit}</p>}
                  {message && <p className="text-green-500 text-sm font-medium">{message}</p>}

                  <div className="flex gap-4 pt-2">
                    <button type="button" onClick={prevStep} className="flex-1 py-4 border border-gray-200 text-gray-600 font-bold rounded-2xl">
                      Back
                    </button>
                    <button type="submit" disabled={loading} className="flex-2 py-4 bg-[#D97706] text-white font-bold rounded-2xl shadow-lg flex items-center justify-center gap-2 px-8">
                      {loading ? "Creating Account..." : "Register Now"}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="text-center mt-6">
              <p className="text-gray-500 font-medium">
                Already have an account?{" "}
                <Link href="/login" className="text-[#D97706] font-bold hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Right Side: Illustration */}
        <div className="hidden lg:block lg:flex-1 relative bg-[#FDF1D3]">
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
            <div className="relative w-[80%] aspect-square">
               <Image 
                src="/images/login-illustration.png" 
                alt="Unifoods Wholesale Journey" 
                fill 
                className="object-contain"
                priority 
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}