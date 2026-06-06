import { useCallback, useEffect, useState } from 'react';
import BillingTopbar from '@cms-components/billing/BillingTopbar';
import BillingStatCards from '@cms-components/billing/BillingStatCards';
import BillingTabs from '@cms-components/billing/BillingTabs';
import BillingDetailModal from '@cms-components/billing/BillingDetailModal';
import Notification from '@components/ui/Notification';
import useNotification from '@hooks/useNotification';
import billingService from '@services/cms/billingService';

const PAGE_LIMIT = 8;
const DEFAULT_METADATA = { total: 0, page: 1, limit: PAGE_LIMIT, totalPages: 0 };

function getErrorMessage(error, fallback) {
  return error?.response?.data?.error || error?.message || fallback;
}

function sanitizeFilenamePart(value, fallback = 'file') {
  const normalized = String(value || fallback)
    .trim()
    .replace(/[^a-z0-9-_]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
  return normalized || fallback;
}

function buildStatementFallbackFilename(invoice) {
  const invoiceKey = sanitizeFilenamePart(invoice?.invoice_number || invoice?.statement_no || invoice?.id, 'invoice');
  return `prism-guard-invoice-${invoiceKey}.pdf`;
}

function buildReceiptFilename(receipt) {
  const refKey = sanitizeFilenamePart(receipt?.reference_number || receipt?.id, 'receipt');
  return `payment-receipt-${refKey}`;
}

function downloadBlob(blob, filename = 'download') {
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

export default function CmsBillingPage() {
  const [invoices, setInvoices] = useState([]);
  const [metadata, setMetadata] = useState(DEFAULT_METADATA);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('invoices');
  const [filters, setFilters] = useState({ status: '', periodStart: '', periodEnd: '' });
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [viewingInvoice, setViewingInvoice] = useState(null);
  const [viewingInvoiceLoading, setViewingInvoiceLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { notification, showNotification, closeNotification } = useNotification();

  const loadStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      const data = await billingService.getStats();
      setStats(data);
    } catch (error) {
      showNotification(getErrorMessage(error, 'Failed to load billing stats.'), 'error');
    } finally {
      setStatsLoading(false);
    }
  }, [showNotification]);

  const loadInvoices = useCallback(async (page = 1, currentFilters = { status: '', periodStart: '', periodEnd: '' }) => {
    try {
      setLoading(true);
      const result = await billingService.getBillings({
        page,
        limit: PAGE_LIMIT,
        status: currentFilters.status || undefined,
        periodStart: currentFilters.periodStart || undefined,
        periodEnd: currentFilters.periodEnd || undefined,
      });
      setInvoices(result.data || []);
      setMetadata(result.metadata || { ...DEFAULT_METADATA, page });
    } catch (error) {
      setInvoices([]);
      setMetadata({ ...DEFAULT_METADATA, page });
      showNotification(getErrorMessage(error, 'Failed to load billing statements.'), 'error');
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    loadStats();
    loadInvoices(1);
  }, [loadInvoices, loadStats]);

  const refresh = useCallback(async () => {
    await Promise.all([
      loadInvoices(metadata.page, filters),
      loadStats(),
    ]);
  }, [filters, loadInvoices, loadStats, metadata.page]);

  const openStatement = async (invoice, download = false) => {
    try {
      if (download) {
        const { blob, filename } = await billingService.downloadStatement(invoice.id);
        downloadBlob(blob, filename || buildStatementFallbackFilename(invoice));
        return;
      }
      const { url } = await billingService.getStatementUrl(invoice.id, false);
      if (!url) return;
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (error) {
      showNotification(getErrorMessage(error, 'Failed to open statement.'), 'error');
    }
  };

  const handleViewReceipt = (invoice) => {
    const url = invoice.latest_receipt?.receipt_url;
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
      return;
    }
    showNotification('No receipt is available for this statement.', 'info');
  };

  const handleDownloadReceipt = async (receiptOrInvoice) => {
    const receipt = receiptOrInvoice?.latest_receipt || receiptOrInvoice;
    const billingId = receipt?.billing_id || (receiptOrInvoice?.latest_receipt ? receiptOrInvoice.id : '');
    if (!receipt?.receipt_url) {
      showNotification('No receipt is available for this statement.', 'info');
      return;
    }
    if (!billingId || !receipt.id) {
      showNotification('Receipt download details are incomplete.', 'error');
      return;
    }
    try {
      const { blob, filename } = await billingService.downloadReceipt(billingId, receipt.id);
      downloadBlob(blob, filename || buildReceiptFilename(receipt));
    } catch (error) {
      showNotification(getErrorMessage(error, 'Failed to download receipt.'), 'error');
    }
  };

  const handleViewInvoice = async (invoice) => {
    setViewingInvoice(invoice);
    try {
      setViewingInvoiceLoading(true);
      const detail = await billingService.getBilling(invoice.id);
      setViewingInvoice(detail);
    } catch (error) {
      showNotification(getErrorMessage(error, 'Failed to load billing statement.'), 'error');
      setViewingInvoice(null);
    } finally {
      setViewingInvoiceLoading(false);
    }
  };

  const handleSubmitReceipt = async ({ amount, date, method, reference, receiptFile }) => {
    if (!selectedInvoice) {
      showNotification('Select an invoice before submitting a receipt.', 'error');
      return;
    }
    if (!receiptFile) {
      showNotification('Upload a payment receipt file.', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('amount', amount);
    formData.append('payment_date', date);
    formData.append('payment_method', method);
    formData.append('reference_number', reference);
    formData.append('receipt', receiptFile);

    try {
      setSubmitting(true);
      await billingService.submitReceipt(selectedInvoice.id, formData);
      setSelectedInvoice(null);
      await refresh();
      showNotification('Payment receipt submitted for review.', 'success');
    } catch (error) {
      showNotification(getErrorMessage(error, 'Failed to submit receipt.'), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFilterChange = (nextFilters) => {
    setFilters(nextFilters);
    loadInvoices(1, nextFilters);
  };

  const handlePayFromModal = (invoice) => {
    setSelectedInvoice(invoice);
    setViewingInvoice(null);
    setActiveTab('submit');
  };

  return (
    <>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          duration={notification.duration}
          onClose={closeNotification}
        />
      )}

      <BillingTopbar />
      <div className="cms-content">
        <BillingStatCards stats={stats} loading={statsLoading} />
        <BillingTabs
          invoices={invoices}
          metadata={metadata}
          loading={loading}
          activeTab={activeTab}
          filters={filters}
          selectedInvoice={selectedInvoice}
          submitting={submitting}
          onTabChange={setActiveTab}
          onFilterChange={handleFilterChange}
          onPageChange={(page) => loadInvoices(page, filters)}
          onSelectInvoice={setSelectedInvoice}
          onSubmitReceipt={handleSubmitReceipt}
          onViewInvoice={handleViewInvoice}
        />
      </div>

      {(viewingInvoice || viewingInvoiceLoading) && (
        <BillingDetailModal
          invoice={viewingInvoice}
          loading={viewingInvoiceLoading}
          onClose={() => setViewingInvoice(null)}
          onViewPdf={openStatement}
          onViewReceipt={handleViewReceipt}
          onDownloadReceipt={handleDownloadReceipt}
          onPay={handlePayFromModal}
        />
      )}
    </>
  );
}
