export const MAX_RECEIPT_SIZE_BYTES = 10 * 1024 * 1024;

export function formatCurrency(value) {
  return `PHP ${Number(value || 0).toLocaleString('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatCurrencyRaw(value) {
  return Number(value || 0).toLocaleString('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatDate(value) {
  if (!value) return '-';
  return new Date(`${value}T00:00:00`).toLocaleDateString('en-PH', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatDateTime(value) {
  if (!value) return '-';
  return new Date(value).toLocaleString('en-PH', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function formatStatus(status) {
  if (status === 'verifying') return 'For Review';
  if (status === 'pending_review') return 'Pending Review';
  if (status === 'voided') return 'Voided';
  return String(status || 'unpaid')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function formatReviewer(receipt) {
  if (!receipt?.reviewed_at && !receipt?.reviewer_name) return '';
  const reviewer = receipt.reviewer_name || 'HRIS reviewer';
  if (!receipt.reviewed_at) return `Reviewed by ${reviewer}`;
  return `Reviewed by ${reviewer} on ${formatDateTime(receipt.reviewed_at)}`;
}

export function formatPaymentMethod(receipt) {
  if (!receipt) return '-';
  if (receipt.payment_method === 'Other' && receipt.payment_method_other) {
    return `Other - ${receipt.payment_method_other}`;
  }
  return receipt.payment_method || '-';
}

export function getStatusClass(status) {
  if (status === 'paid' || status === 'approved') return 'cms-inv-badge cms-inv-badge--paid';
  if (status === 'verifying' || status === 'pending_review' || status === 'partial') {
    return 'cms-inv-badge cms-inv-badge--verifying';
  }
  if (status === 'overdue' || status === 'rejected' || status === 'voided') return 'cms-inv-badge cms-inv-badge--overdue';
  return 'cms-inv-badge cms-inv-badge--unpaid';
}

export function getTodayDateInputValue() {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${today.getFullYear()}-${month}-${day}`;
}

export function isAllowedReceiptFile(file) {
  return file?.type?.startsWith('image/') || file?.type === 'application/pdf';
}

export function formatFileSize(bytes = 0) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
