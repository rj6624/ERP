/**
 * Formatting utilities for Jewellery Plating Manufacturing ERP
 */

/**
 * Formats jewellery weight strictly with 3 decimal places.
 * e.g. 10.25 -> "10.250 kg"
 * e.g. 0.55 -> "0.550 kg"
 * Never returns integer representation like "10250"
 */
export function formatWeight(weight: number | string | undefined | null, includeUnit = true): string {
  if (weight === undefined || weight === null || weight === '') {
    return includeUnit ? '0.000 kg' : '0.000';
  }
  const num = typeof weight === 'string' ? parseFloat(weight) : weight;
  if (isNaN(num)) {
    return includeUnit ? '0.000 kg' : '0.000';
  }
  const formatted = num.toFixed(3);
  return includeUnit ? `${formatted} kg` : formatted;
}

/**
 * Formats Plating per KG strictly with 3 decimal places.
 * e.g. 53.659 -> "53.659 g/kg"
 */
export function formatPlating(plating: number | string | undefined | null): string {
  if (plating === undefined || plating === null || plating === '') {
    return '0.000 g/kg';
  }
  const num = typeof plating === 'string' ? parseFloat(plating) : plating;
  if (isNaN(num) || num <= 0) {
    return '0.000 g/kg';
  }
  return `${num.toFixed(3)} g/kg`;
}

/**
 * Formats Indian Currency (INR ₹)
 * e.g. 42500 -> "₹42,500" or "₹42,500.00"
 */
export function formatCurrency(amount: number | string | undefined | null, showDecimals = false): string {
  if (amount === undefined || amount === null || amount === '') {
    return '₹0';
  }
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) {
    return '₹0';
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: showDecimals ? 2 : 0,
    minimumFractionDigits: showDecimals ? 2 : 0,
  }).format(num);
}

/**
 * Formats standard date into concise professional format: "24 Sep 2026"
 */
export function formatDate(dateString: string | undefined | null): string {
  if (!dateString) return '-';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

/**
 * Formats standard date-time: "24 Sep 2026, 02:45 PM"
 */
export function formatDateTime(dateString: string | undefined | null): string {
  if (!dateString) return '-';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return dateString;
  }
}
