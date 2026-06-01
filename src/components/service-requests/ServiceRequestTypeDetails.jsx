export default function ServiceRequestTypeDetails({
  request,
  detailBoxClassName = 'sr-description-box',
  labelClassName = 'sr-detail-label',
  textClassName = 'sr-description-text',
  includeFulfillmentRows = false,
  showCancellationLock = false,
}) {
  if (!request) return null;

  return (
    <>
      {request.additional_guard_details && (
        <div className={detailBoxClassName}>
          <p className={labelClassName} style={{ marginBottom: '0.4rem' }}>Additional Guard Progress</p>
          <p className={textClassName}>
            {request.additional_guard_details.fulfilled_guard_count} of {request.additional_guard_details.requested_guard_count} guards deployed
          </p>
          {showCancellationLock && request.has_fulfillments && (
            <p className={textClassName}>
              Cancellation is locked because fulfillment has started.
            </p>
          )}
          {includeFulfillmentRows && request.fulfillments?.length > 0 && (
            <div style={{ marginTop: '0.6rem' }}>
              {request.fulfillments
                .filter((fulfillment) => fulfillment.fulfillment_type === 'additional_guard')
                .map((fulfillment) => (
                  <p key={fulfillment.id} className={textClassName}>
                    {fulfillment.employee_name} ({fulfillment.employee_number}) deployed {fulfillment.fulfilled_at || ''}
                  </p>
                ))}
            </div>
          )}
        </div>
      )}

      {request.replacement_details && (
        <div className={detailBoxClassName}>
          <p className={labelClassName} style={{ marginBottom: '0.4rem' }}>Replacement Details</p>
          <p className={textClassName}>
            Replace: {request.replacement_details.original_guard_name} ({request.replacement_details.original_employee_number})
          </p>
          <p className={textClassName}>
            Site: {request.replacement_details.site_name || request.site}
          </p>
          {request.replacement_details.replacement_deployment_id && (
            <p className={textClassName}>
              Replacement: {request.replacement_details.replacement_guard_name} ({request.replacement_details.replacement_employee_number})
            </p>
          )}
        </div>
      )}
    </>
  );
}
