/**
 * Formatting and Helper Utilities
 */
export function formatCurrency(amount) {
  if (amount === undefined || amount === null) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

export const formatINR = formatCurrency;

export function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch (e) {
    return String(dateStr);
  }
}

export function formatDateTime(dateStr) {
  if (!dateStr) return 'N/A';
  try {
    const d = new Date(dateStr);
    return d.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    return String(dateStr);
  }
}

export function getBloodGroupBadgeClass(group) {
  switch (group) {
    case 'O+':
    case 'O-':
      return 'badge-red';
    case 'A+':
    case 'A-':
      return 'badge-blue';
    case 'B+':
    case 'B-':
      return 'badge-amber';
    default:
      return 'badge-green';
  }
}
