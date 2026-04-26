import HrisCashAdvanceTopbar from '@hris-components/cash-advance/HrisCashAdvanceTopbar';
import HrisCashAdvanceStatCards from '@hris-components/cash-advance/HrisCashAdvanceStatCards';
import HrisCashAdvanceAlert from '@hris-components/cash-advance/HrisCashAdvanceAlert';
import HrisCashAdvanceFilterBar from '@hris-components/cash-advance/HrisCashAdvanceFilterBar';
import HrisCashAdvanceList from '@hris-components/cash-advance/HrisCashAdvanceList';
import '../../styles/hris/HrisCashAdvance.css';

export default function HrisCashAdvancePage() {
  return (
    <>
      <HrisCashAdvanceTopbar />

      <div className="dashboard-content">
        <HrisCashAdvanceStatCards />
        <HrisCashAdvanceAlert />
        <HrisCashAdvanceFilterBar />
        <HrisCashAdvanceList />
      </div>
    </>
  );
}
