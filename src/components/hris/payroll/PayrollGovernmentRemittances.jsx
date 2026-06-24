import { useEffect, useMemo, useState } from 'react';
import {
  FaCheckCircle,
  FaDownload,
  FaExclamationTriangle,
  FaLandmark,
  FaReceipt,
} from 'react-icons/fa';

import ReportActionButton from '@components/ui/ReportActionButton';
import ReportConfirmDialog from '@components/ui/ReportConfirmDialog';
import useReportAction from '@hooks/useReportAction';
import payrollService from '@services/hris/payrollService';
import { formatDate, money } from './payrollFormatters';
import {
  buildGovernmentRemittanceSummary,
  formatContributionMonth,
  getManilaDateKey,
} from './payrollRemittanceUtils';
import { getPayrollErrorMessage } from './payrollPageUtils';

const MAX_RECEIPT_SIZE = 10 * 1024 * 1024;

export default function PayrollGovernmentRemittances({
  run,
  showNotification,
}) {
  const [context, setContext] = useState(null);
  const [contextLoading, setContextLoading] = useState(false);
  const [target, setTarget] = useState(null);
  const [referenceNumber, setReferenceNumber] = useState('');
  const [remittanceDate, setRemittanceDate] = useState(getManilaDateKey);
  const [receiptFile, setReceiptFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [downloadingAgency, setDownloadingAgency] = useState('');
  const [downloadingReportAgency, setDownloadingReportAgency] = useState('');
  const [issueTarget, setIssueTarget] = useState(null);
  const summaries = useMemo(
    () => buildGovernmentRemittanceSummary(context),
    [context]
  );
  const canRemit = Boolean(context?.ready);

  const remitAction = useReportAction({
    loadingMessage: 'Recording government remittance...',
    successMessage: (_, payload) => `${payload.label} marked as remitted.`,
    errorFallback: 'Failed to record government remittance.',
    showNotification,
    getErrorMessage: getPayrollErrorMessage,
    run: (payload) => payrollService.markGovernmentRemittance(run.id, payload.agency, {
      referenceNumber: payload.referenceNumber,
      remittanceDate: payload.remittanceDate,
      receiptFile: payload.receiptFile,
    }),
    afterSuccess: async (updatedContext) => {
      setTarget(null);
      setContext(updatedContext);
    },
  });

  useEffect(() => {
    let cancelled = false;
    if (!run?.id) {
      setContext(null);
      return () => { cancelled = true; };
    }

    setContextLoading(true);
    payrollService.getGovernmentRemittanceContext(run.id)
      .then((result) => {
        if (!cancelled) setContext(result);
      })
      .catch((error) => {
        if (!cancelled) {
          setContext(null);
          showNotification(
            getPayrollErrorMessage(error, 'Failed to load government remittances.'),
            'error'
          );
        }
      })
      .finally(() => {
        if (!cancelled) setContextLoading(false);
      });

    return () => { cancelled = true; };
  }, [run?.id, run?.status, showNotification]);

  if (!run) return null;

  const openRemittanceDialog = (summary) => {
    setTarget(summary);
    setReferenceNumber('');
    setRemittanceDate(getManilaDateKey());
    setReceiptFile(null);
    setFileError('');
  };

  const closeRemittanceDialog = () => {
    if (remitAction.loading) return;
    setTarget(null);
    setFileError('');
  };

  const handleReceiptChange = (event) => {
    const file = event.target.files?.[0] || null;
    if (file && file.size > MAX_RECEIPT_SIZE) {
      setReceiptFile(null);
      setFileError('Receipt must not exceed 10 MB.');
      event.target.value = '';
      return;
    }
    setReceiptFile(file);
    setFileError('');
  };

  const handleConfirm = async () => {
    if (!target || !referenceNumber.trim() || !remittanceDate || fileError) return;
    await remitAction.execute({
      agency: target.key,
      label: target.label,
      referenceNumber: referenceNumber.trim(),
      remittanceDate,
      receiptFile,
    });
  };

  const parseReportDownloadError = async (error, summary) => {
    const blob = error?.response?.data;
    if (blob instanceof Blob && blob.type.includes('application/json')) {
      try {
        const data = JSON.parse(await blob.text());
        if (Array.isArray(data.issues)) {
          setIssueTarget({ ...summary, report: { issues: data.issues, issue_count: data.issues.length } });
        }
        return data.error || 'Failed to download government report.';
      } catch {
        return 'Failed to download government report.';
      }
    }
    return getPayrollErrorMessage(error, 'Failed to download government report.');
  };

  const handleDownloadReport = async (summary) => {
    if (downloadingReportAgency) return;
    if (!summary.report?.ready) {
      setIssueTarget(summary);
      return;
    }
    setDownloadingReportAgency(summary.key);
    try {
      const { blob, filename } = await payrollService.downloadGovernmentReport(
        run.id,
        summary.key
      );
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      showNotification(await parseReportDownloadError(error, summary), 'error');
    } finally {
      setDownloadingReportAgency('');
    }
  };

  const handleDownloadReceipt = async (agency) => {
    if (downloadingAgency) return;
    setDownloadingAgency(agency);
    try {
      const { blob, filename } = await payrollService.downloadGovernmentRemittanceReceipt(
        run.id,
        agency
      );
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      showNotification(
        getPayrollErrorMessage(error, 'Failed to download remittance receipt.'),
        'error'
      );
    } finally {
      setDownloadingAgency('');
    }
  };

  return (
    <section className='pr-remittance-section' aria-labelledby='payroll-remittance-title'>
      <div className='pr-remittance-heading'>
        <div>
          <h3 id='payroll-remittance-title'><FaLandmark /> Government Remittances</h3>
          <p>
            {context?.contribution_month
              ? `${formatContributionMonth(context.contribution_month)} - both payroll cutoffs`
              : 'Monthly employee deductions and employer contributions'}
          </p>
        </div>
        <span className={canRemit ? 'pr-remittance-ready' : 'pr-remittance-pending'}>
          {contextLoading
            ? 'Loading remittance'
            : canRemit
              ? 'Ready for remittance'
              : 'Requires both approved cutoffs'}
        </span>
      </div>

      <div className='pr-remittance-cutoffs'>
        {(context?.runs || []).map((cutoff) => (
          <span key={cutoff.cutoff} className={`is-${cutoff.status}`}>
            {cutoff.cutoff === 'first' ? '1-15' : `16-${cutoff.period_end.slice(8)}`}
            <strong>{cutoff.status.replaceAll('_', ' ')}</strong>
          </span>
        ))}
      </div>

      <div className='pr-remittance-grid'>
        {summaries.map((summary) => {
          const remittance = summary.remittance;
          return (
            <article className='pr-remittance-item' key={summary.key}>
              <div className='pr-remittance-item-header'>
                <div>
                  <h4>{summary.label}</h4>
                  <strong>{money(remittance?.total_amount ?? summary.totalAmount)}</strong>
                </div>
                <span className={remittance ? 'is-remitted' : 'is-outstanding'}>
                  {remittance ? <FaCheckCircle /> : <FaReceipt />}
                  {remittance ? 'Remitted' : 'Outstanding'}
                </span>
              </div>

              <dl className='pr-remittance-breakdown'>
                <div>
                  <dt>Employee share</dt>
                  <dd>{money(remittance?.employee_share ?? summary.employeeShare)}</dd>
                </div>
                <div>
                  <dt>Employer share</dt>
                  <dd>{money(remittance?.employer_share ?? summary.employerShare)}</dd>
                </div>
                {summary.key === 'sss' && (
                  <div>
                    <dt>EC</dt>
                    <dd>{money(remittance?.ec_amount ?? summary.ecAmount)}</dd>
                  </div>
                )}
              </dl>

              <div className='pr-remittance-report-actions'>
                {summary.report?.issue_count > 0 ? (
                  <ReportActionButton
                    className='pr-remittance-report-button warning'
                    label={`Fix ${summary.report.issue_count} records`}
                    icon={FaExclamationTriangle}
                    disabled={contextLoading}
                    variant='secondary'
                    onClick={() => setIssueTarget(summary)}
                  />
                ) : (
                  <ReportActionButton
                    className='pr-remittance-report-button'
                    label={downloadingReportAgency === summary.key ? 'Downloading' : 'Download Report'}
                    icon={FaDownload}
                    disabled={
                      contextLoading
                      || !canRemit
                      || !summary.report?.ready
                      || summary.totalAmount <= 0
                      || Boolean(downloadingReportAgency)
                    }
                    variant='secondary'
                    onClick={() => handleDownloadReport(summary)}
                  />
                )}
              </div>

              {remittance ? (
                <div className='pr-remittance-record'>
                  <span>{formatDate(remittance.remittance_date)}</span>
                  <strong>Ref: {remittance.reference_number}</strong>
                  {remittance.has_receipt && (
                    <button
                      type='button'
                      className='pr-remittance-receipt-button'
                      onClick={() => handleDownloadReceipt(summary.key)}
                      disabled={Boolean(downloadingAgency)}
                      title='Download receipt'
                    >
                      <FaDownload />
                      <span>{downloadingAgency === summary.key ? 'Downloading' : 'Receipt'}</span>
                    </button>
                  )}
                </div>
              ) : (
                <ReportActionButton
                  className='pr-remittance-action'
                  label='Mark Remitted'
                  icon={FaCheckCircle}
                  disabled={
                    contextLoading
                    || !canRemit
                    || remitAction.loading
                    || summary.totalAmount <= 0
                  }
                  variant='secondary'
                  onClick={() => openRemittanceDialog(summary)}
                />
              )}
            </article>
          );
        })}
      </div>

      <ReportConfirmDialog
        open={Boolean(issueTarget)}
        title={issueTarget ? `Fix ${issueTarget.label} Report Records` : 'Fix Report Records'}
        description={issueTarget ? `${issueTarget.report?.issue_count || 0} issue(s) must be corrected before this agency report can be downloaded.` : ''}
        confirmLabel='Done'
        cancelLabel='Close'
        tone='warning'
        width='640px'
        onCancel={() => setIssueTarget(null)}
        onConfirm={() => setIssueTarget(null)}
      >
        <div className='pr-remittance-issues'>
          {(issueTarget?.report?.issues || []).map((issue, index) => (
            <div className='pr-remittance-issue' key={`${issue.employee_id || 'report'}-${issue.field}-${issue.issue}-${index}`}>
              <strong>{issue.name || 'Report total'}</strong>
              <span>{issue.employee_number || issue.employee_id || 'No employee ID'}</span>
              <p>{issue.field}: {issue.issue.replaceAll('_', ' ')}</p>
              {issue.detail && <small>{issue.detail}</small>}
            </div>
          ))}
        </div>
      </ReportConfirmDialog>

      <ReportConfirmDialog
        open={Boolean(target)}
        title={target ? `Mark ${target.label} as Remitted?` : 'Mark as Remitted?'}
        description={target ? `Total remittance: ${money(target.totalAmount)}` : ''}
        confirmLabel='Mark Remitted'
        confirmDisabled={!referenceNumber.trim() || !remittanceDate || Boolean(fileError)}
        loading={remitAction.loading}
        tone='info'
        width='520px'
        onCancel={closeRemittanceDialog}
        onConfirm={handleConfirm}
      >
        <div className='pr-remittance-form'>
          <label>
            <span>Reference Number</span>
            <input
              type='text'
              maxLength={200}
              value={referenceNumber}
              onChange={(event) => setReferenceNumber(event.target.value)}
              disabled={remitAction.loading}
              required
            />
          </label>
          <label>
            <span>Remittance Date</span>
            <input
              type='date'
              max={getManilaDateKey()}
              value={remittanceDate}
              onChange={(event) => setRemittanceDate(event.target.value)}
              disabled={remitAction.loading}
              required
            />
          </label>
          <label>
            <span>Receipt (optional)</span>
            <input
              type='file'
              accept='image/*,application/pdf'
              onChange={handleReceiptChange}
              disabled={remitAction.loading}
            />
          </label>
          {fileError && <p className='pr-remittance-file-error'>{fileError}</p>}
        </div>
      </ReportConfirmDialog>
    </section>
  );
}
