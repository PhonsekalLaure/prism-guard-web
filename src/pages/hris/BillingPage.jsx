import { useState } from 'react';
import BillingTopbar from '@hris-components/billing/BillingTopbar';
import BillingStatCards from '@hris-components/billing/BillingStatCards';
import BillingFilterBar from '@hris-components/billing/BillingFilterBar';
import BillingTable from '@hris-components/billing/BillingTable';
import ViewPaymentModal from '@hris-components/billing/ViewPaymentModal';
import MarkPaidModal from '@hris-components/billing/MarkPaidModal';

export default function BillingPage() {
  const [viewRecord, setViewRecord] = useState(null);
  const [markPaidRecord, setMarkPaidRecord] = useState(null);

  return (
    <>
      <BillingTopbar />

      <div className="dashboard-content">
        <BillingStatCards />
        <BillingFilterBar />
        <BillingTable
          onView={(record) => setViewRecord(record)}
          onMarkPaid={(record) => setMarkPaidRecord(record)}
        />
      </div>

      <ViewPaymentModal
        isOpen={!!viewRecord}
        record={viewRecord}
        onClose={() => setViewRecord(null)}
      />

      <MarkPaidModal
        isOpen={!!markPaidRecord}
        record={markPaidRecord}
        onClose={() => setMarkPaidRecord(null)}
      />
    </>
  );
}
