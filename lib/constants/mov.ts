/**
 * Minimum Order Value (MOV) Configuration
 * ----------------------------------------
 * MOV is evaluated against Grand Total (subtotal + GST).
 * If grandTotal < MOV_AMOUNT → show warning; user may opt to pay MOV_DELIVERY_CHARGE.
 */

export const MOV_AMOUNT = 3500;          // INR — minimum grand total (incl. GST)
export const MOV_DELIVERY_CHARGE = 250;  // INR — extra delivery charge for below-MOV orders
