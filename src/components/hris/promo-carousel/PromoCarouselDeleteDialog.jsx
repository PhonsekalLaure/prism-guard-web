import { FaTrash } from 'react-icons/fa';

export default function PromoCarouselDeleteDialog({
  deleting,
  onCancel,
  onConfirm,
}) {
  return (
    <div className="pc-modal-overlay">
      <section className="pc-confirm">
        <FaTrash />
        <h2>Delete this promo slide?</h2>
        <p>This removes it from HRIS and deletes its hosted image.</p>
        <div>
          <button className="pc-btn secondary" type="button" onClick={onCancel} disabled={deleting}>
            Cancel
          </button>
          <button className="pc-btn danger" type="button" onClick={onConfirm} disabled={deleting}>
            {deleting ? 'Deleting...' : 'Delete Slide'}
          </button>
        </div>
      </section>
    </div>
  );
}
