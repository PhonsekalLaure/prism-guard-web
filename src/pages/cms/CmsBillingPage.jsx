import BillingTopbar from '@cms-components/billing/BillingTopbar';
import BillingStatCards from '@cms-components/billing/BillingStatCards';
import BillingTabs from '@cms-components/billing/BillingTabs';

export default function CmsBillingPage() {
  return (
    <>
      <BillingTopbar />
      <div className="cms-content">
        <BillingStatCards />
        <BillingTabs />
      </div>
    </>
  );
}