/**
 * Core business calculations for Jewellery Plating Manufacturing ERP
 */

/**
 * Calculates Plating per KG strictly using the required formula:
 * Plating per KG = ((Outward Weight - Inward Weight) / Inward Weight) * 1000
 * @param inwardWeight Inward weight in kg
 * @param outwardWeight Outward weight in kg
 * @returns Plating per kg in g/kg rounded to 3 decimal places
 */
export function calculatePlatingPerKg(inwardWeight: number, outwardWeight: number): number {
  if (!inwardWeight || inwardWeight <= 0 || !outwardWeight || outwardWeight <= inwardWeight) {
    return 0;
  }
  const diff = outwardWeight - inwardWeight;
  const plating = (diff / inwardWeight) * 1000;
  return Number(plating.toFixed(3));
}

/**
 * Calculates Bill Total strictly as:
 * Total Amount = Inward Weight × Price per KG
 * @param inwardWeight Inward weight in kg (3 decimals)
 * @param pricePerKg Price in ₹ per kg
 * @returns Total Amount in ₹ rounded to 2 decimal places
 */
export function calculateBillTotal(inwardWeight: number, pricePerKg: number): number {
  if (!inwardWeight || inwardWeight <= 0 || !pricePerKg || pricePerKg <= 0) {
    return 0;
  }
  return Number((inwardWeight * pricePerKg).toFixed(2));
}

/**
 * Calculates Labour Charge strictly as:
 * Total Labour Charge = Quantity/Weight × Labour Charge Rate
 */
export function calculateLabourCharge(weightOrQty: number, rate: number): number {
  if (!weightOrQty || weightOrQty <= 0 || !rate || rate <= 0) {
    return 0;
  }
  return Number((weightOrQty * rate).toFixed(2));
}

/**
 * Generates the next sequential Job ID for a customer.
 * E.g. Customer "Darshan" with lastSeq 0 -> "DARSHAN1"
 * Customer "Rajesh Jewellers" -> "RAJESH1"
 */
export function generateNextJobId(customerName: string, nextSeq: number): string {
  // Convert customer name to uppercase, remove spaces, keep alphanumeric
  const cleanName = customerName
    .toUpperCase()
    .replace(/\s+/g, '')
    .replace(/[^A-Z0-9]/g, '') || 'CUSTOMER';
  return `${cleanName}${nextSeq}`;
}

/**
 * Calculates age in days from a date string to current date
 */
export function calculateAgeDays(dateString: string): number {
  if (!dateString) return 0;
  const now = new Date();
  const past = new Date(dateString);
  const diffTime = Math.abs(now.getTime() - past.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}
