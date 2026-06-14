import { isSafePreviewMimeType } from '@utils/security';

function sanitizeFilenamePart(value, fallback = 'file') {
  const normalized = String(value || fallback)
    .trim()
    .replace(/[^a-z0-9-_]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
  return normalized || fallback;
}

export function buildStatementFallbackFilename(invoice) {
  const invoiceKey = sanitizeFilenamePart(invoice?.invoice_number || invoice?.statement_no || invoice?.id, 'invoice');
  return `prism-guard-invoice-${invoiceKey}.pdf`;
}

export function buildReceiptFilename(receipt) {
  const refKey = sanitizeFilenamePart(receipt?.reference_number || receipt?.id, 'receipt');
  return `payment-receipt-${refKey}`;
}

export function downloadBlob(blob, filename = 'download') {
  if (!blob) return;
  const resolvedUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = resolvedUrl;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(resolvedUrl), 1000);
}

export function openBlobInNewTab(blob) {
  if (!blob) return;
  if (!isSafePreviewMimeType(blob.type)) {
    throw new Error('This file type cannot be previewed safely.');
  }
  const resolvedUrl = URL.createObjectURL(blob);
  window.open(resolvedUrl, '_blank', 'noopener,noreferrer');
  window.setTimeout(() => URL.revokeObjectURL(resolvedUrl), 60000);
}

export function getReceiptDownloadTarget(receiptOrInvoice) {
  const receipt = receiptOrInvoice?.latest_receipt || receiptOrInvoice;
  const billingId = receipt?.billing_id || (receiptOrInvoice?.latest_receipt ? receiptOrInvoice.id : '');
  return { billingId, receipt };
}
