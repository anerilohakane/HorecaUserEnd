// Shipping Address Type
export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

// Payment Method Type
export type PaymentMethod = 'cod' | 'upi' | 'card' | 'netbanking';

// Order Type
export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  items: {
    productId: number;
    productName: string;
    quantity: number;
    price: number;
    image: string;
  }[];
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  platformFee: number;
  total: number;
  couponCode?: string;
  invoice?: {
    invoiceNumber: string;
    url?: string;
  };
}

// Checkout Step Type
export type CheckoutStep = 'shipping' | 'payment' | 'review';