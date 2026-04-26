import GuardDeploymentSelector from '../GuardDeploymentSelector';

export default function Step5InitialDeployment({
  data,
  deployableEmployees,
  loadingDeployable,
  onDeploymentField,
  onFilterChange,
  onSelectEmployee,
  toggleScheduleDay,
}) {
  const siteOptions = data.sites.map((site, index) => ({
    value: String(index),
    label: site.siteName || site.siteAddress || `Site ${index + 1}`,
  }));

  if (siteOptions.length === 0) {
    return (
      <div className="ae-step-content">
        <h3 className="ae-step-heading">Initial Guard Deployment</h3>
        <p className="ae-hint">
          Add at least one client site first if you want to assign an initial guard during onboarding.
        </p>
      </div>
    );
  }

  return (
    <div className="ae-step-content">
      <h3 className="ae-step-heading">Initial Guard Deployment</h3>
      <p className="ae-hint" style={{ marginBottom: '0.9rem' }}>
        This step is optional. Guards are ranked by proximity to the selected site.
      </p>

      <GuardDeploymentSelector
        siteOptions={siteOptions}
        siteValue={data.initialDeployment.siteIndex}
        onSiteChange={(value) => onDeploymentField('siteIndex', value)}
        employees={deployableEmployees}
        loadingEmployees={loadingDeployable}
        filters={data.initialDeployment.filters}
        onFilterChange={onFilterChange}
        selectedEmployeeIds={data.initialDeployment.employeeIds}
        onToggleEmployee={onSelectEmployee}
        deploymentForm={data.initialDeployment}
        onFieldChange={onDeploymentField}
        toggleScheduleDay={toggleScheduleDay}
        selectionMode="multiple"
        emptyMessage="No deployable guards match the selected site and filters."
      />
    </div>
  );
}
