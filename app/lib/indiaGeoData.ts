export const INDIAN_STATES: string[] = [
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal"
];

export const CUSTOMER_TYPES: string[] = [
  "Bakery & Pastry Shop",
  "5-Star Hotel / Resort",
  "Restaurant & Fine Dining",
  "Cafe & Bistro",
  "Cloud Kitchen / QSR",
  "Catering & Event Service",
  "Sweet & Confectionery Shop",
  "Institutional Canteen / Mess",
  "Wholesale / Retail Distributor",
  "Supermarket / Hypermarket",
  "Other"
];

export const CUSTOMER_DEPARTMENTS: string[] = [
  "Purchase & Procurement",
  "Accounts & Finance",
  "Store & Inventory",
  "Kitchen & Executive Chef",
  "Operations & Logistics",
  "Management & Business Owner",
  "Front Office & Admin",
  "Other"
];

export function validateStatePincode(state: string, pincode: string): { valid: boolean; message?: string } {
  if (!pincode) return { valid: true };
  if (!/^[1-9][0-9]{5}$/.test(pincode)) {
    return { valid: false, message: "PIN Code must be a 6-digit number" };
  }
  if (!state) return { valid: true };

  const prefix = parseInt(pincode.substring(0, 2), 10);
  const fullPrefix = parseInt(pincode.substring(0, 3), 10);

  const ranges: Record<string, number[]> = {
    "Delhi": [11],
    "Haryana": [12, 13],
    "Punjab": [14, 15, 16],
    "Chandigarh": [16],
    "Himachal Pradesh": [17],
    "Jammu and Kashmir": [18, 19],
    "Ladakh": [19],
    "Uttar Pradesh": [20, 21, 22, 23, 24, 25, 26, 27, 28],
    "Uttarakhand": [24, 26],
    "Rajasthan": [30, 31, 32, 33, 34],
    "Gujarat": [36, 37, 38, 39],
    "Dadra and Nagar Haveli and Daman and Diu": [39],
    "Maharashtra": [40, 41, 42, 43, 44],
    "Goa": [40], // 403xxx
    "Madhya Pradesh": [45, 46, 47, 48],
    "Chhattisgarh": [49],
    "Telangana": [50],
    "Andhra Pradesh": [51, 52, 53],
    "Karnataka": [56, 57, 58, 59],
    "Tamil Nadu": [60, 61, 62, 63, 64],
    "Puducherry": [60, 67],
    "Kerala": [67, 68, 69],
    "Lakshadweep": [68],
    "West Bengal": [70, 71, 72, 73, 74],
    "Andaman and Nicobar Islands": [74],
    "Sikkim": [73],
    "Odisha": [75, 76, 77],
    "Assam": [78],
    "Arunachal Pradesh": [79],
    "Nagaland": [79],
    "Manipur": [79],
    "Mizoram": [79],
    "Tripura": [79],
    "Meghalaya": [79],
    "Bihar": [80, 81, 82, 83, 84, 85],
    "Jharkhand": [81, 82, 83, 84, 85]
  };

  if (state === "Goa" && fullPrefix !== 403) {
    return { valid: false, message: `PIN code ${pincode} does not belong to Goa (expected prefix 403)` };
  }

  const allowedPrefixes = ranges[state];
  if (allowedPrefixes && !allowedPrefixes.includes(prefix)) {
    return { valid: false, message: `PIN code ${pincode} does not belong to ${state}` };
  }

  return { valid: true };
}
