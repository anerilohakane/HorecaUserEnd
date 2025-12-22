// Business Type
export type BusinessType = 'bakery' | 'cafe' | 'restaurant' | 'hotel' | 'catering' | 'retail' | 'manufacturer' | 'distributor';

// Business Size
export type BusinessSize = 'individual' | 'small' | 'medium' | 'large' | 'enterprise';

// Verification Status
export type VerificationStatus = 'pending' | 'under_review' | 'verified' | 'rejected';

// Document Type
export type DocumentType = 'gst' | 'pan' | 'fssai' | 'trade_license' | 'shop_act' | 'incorporation' | 'bank_statement' | 'address_proof';

// Business Document
export interface BusinessDocument {
  id: string;
  type: DocumentType;
  documentNumber: string;
  documentName: string;
  fileUrl: string;
  fileName: string;
  uploadedAt: string;
  verificationStatus: VerificationStatus;
  rejectionReason?: string;
}

// Business Address
export interface BusinessAddress {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

// Business Profile
export interface BusinessProfile {
  id: string;
  businessName: string;
  businessType: BusinessType;
  businessSize: BusinessSize;
  yearEstablished: number;
  
  // Contact Information
  contactPerson: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  website?: string;
  
  // Business Address
  address: BusinessAddress;
  
  // Business Details
  gstNumber?: string;
  panNumber?: string;
  fssaiNumber?: string;
  tradeLicenseNumber?: string;
  
  // Verification
  verificationStatus: VerificationStatus;
  verifiedAt?: string;
  
  // Documents
  documents: BusinessDocument[];
  
  // Account
  accountCreatedAt: string;
  lastLoginAt: string;
  
  // Preferences
  monthlyPurchaseVolume?: string;
  preferredPaymentMethod?: string;
  deliveryPreference?: string;
}

// Registration Form Data
export interface BusinessRegistrationForm {
  // Step 1: Basic Information
  businessName: string;
  businessType: BusinessType;
  businessSize: BusinessSize;
  yearEstablished: number;
  
  // Step 2: Contact Information
  contactPerson: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  alternatePhone?: string;
  
  // Step 3: Business Address
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  
  // Step 4: Business Documents
  gstNumber?: string;
  panNumber?: string;
  fssaiNumber?: string;
  tradeLicenseNumber?: string;
  
  // Preferences
  monthlyPurchaseVolume?: string;
  agreeToTerms: boolean;
}

// User Session
export interface UserSession {
  id: string;
  businessName: string;
  email: string;
  verificationStatus: VerificationStatus;
  businessType: BusinessType;
}