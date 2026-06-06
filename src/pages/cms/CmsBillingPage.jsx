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

export default function CmsBillingPage() {
  const [invoices, setInvoices] = useState([]);
  const [metadata, setMetadata] = useState(DEFAULT_METADATA);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [historyMetadata, setHistoryMetadata] = useState(DEFAULT_METADATA);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
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

  const loadInvoices = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const result = await billingService.getBillings({ page, limit: PAGE_LIMIT });
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

  const loadPaymentHistory = useCallback(async (page = 1) => {
    try {
      setHistoryLoading(true);
      const result = await billingService.getPaymentHistory({ page, limit: PAGE_LIMIT });
      setPaymentHistory(result.data || []);
      setHistoryMetadata(result.metadata || { ...DEFAULT_METADATA, page });
    } catch (error) {
      setPaymentHistory([]);
      setHistoryMetadata({ ...DEFAULT_METADATA, page });
      showNotification(getErrorMessage(error, 'Failed to load payment history.'), 'error');
    } finally {
      setHistoryLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    loadStats();
    loadInvoices(1);
    loadPaymentHistory(1);
  }, [loadInvoices, loadPaymentHistory, loadStats]);

  const refresh = useCallback(async () => {
    await Promise.all([
      loadInvoices(metadata.page),
      loadPaymentHistory(historyMetadata.page),
      loadStats(),
    ]);
  }, [historyMetadata.page, loadInvoices, loadPaymentHistory, loadStats, metadata.page]);

  const openStatement = async (invoice, download = false) => {
    try {
      const { url } = await billingService.getStatementUrl(invoice.id, download);
      if (url) window.open(url, '_blank', 'noopener,noreferrer');
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
          paymentHistory={paymentHistory}
          historyMetadata={historyMetadata}
          loading={loading}
          historyLoading={historyLoading}
          selectedInvoice={selectedInvoice}
          submitting={submitting}
          onPageChange={loadInvoices}
          onHistoryPageChange={loadPaymentHistory}
          onSelectInvoice={setSelectedInvoice}
          onSubmitReceipt={handleSubmitReceipt}
          onViewInvoice={handleViewInvoice}
          onViewReceipt={handleViewReceipt}
          onViewPdf={openStatement}
        />
      </div>

      {(viewingInvoice || viewingInvoiceLoading) && (
        <BillingDetailModal
          invoice={viewingInvoice}
          loading={viewingInvoiceLoading}
          onClose={() => setViewingInvoice(null)}
          onViewPdf={openStatement}
          onViewReceipt={handleViewReceipt}
        />
      )}
    </>
  );
}
