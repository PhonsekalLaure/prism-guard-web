import {
  FaArrowDown,
  FaArrowUp,
  FaEdit,
  FaImages,
  FaTrash,
} from 'react-icons/fa';

export default function PromoCarouselSlideList({
  actionId,
  canWrite,
  loading,
  onDelete,
  onEdit,
  onMove,
  onToggle,
  slides,
}) {
  if (loading) {
    return <div className="pc-empty">Loading promo slides...</div>;
  }

  if (slides.length === 0) {
    return (
      <div className="pc-empty">
        <FaImages />
        <h3>No managed slides yet</h3>
        <p>The promo website will continue using its bundled hero content.</p>
      </div>
    );
  }

  return (
    <section className="pc-grid">
      {slides.map((slide, index) => (
        <article className="pc-card" key={slide.id}>
          <div className="pc-card-image">
            <img src={slide.image_url} alt="" />
            <span className={slide.is_active ? 'active' : 'inactive'}>
              {slide.is_active ? 'Active' : 'Inactive'}
            </span>
            <b>#{index + 1}</b>
          </div>
          <div className="pc-card-body">
            <h3>{slide.heading}</h3>
            <p>{slide.text}</p>
          </div>
          {canWrite && (
            <footer className="pc-card-actions">
              <button type="button" onClick={() => onMove(index, -1)} disabled={index === 0 || actionId}>
                <FaArrowUp /> Up
              </button>
              <button type="button" onClick={() => onMove(index, 1)} disabled={index === slides.length - 1 || actionId}>
                <FaArrowDown /> Down
              </button>
              <button type="button" onClick={() => onToggle(slide)} disabled={Boolean(actionId)}>
                {slide.is_active ? 'Deactivate' : 'Activate'}
              </button>
              <button type="button" onClick={() => onEdit(slide)} disabled={Boolean(actionId)}>
                <FaEdit /> Edit
              </button>
              <button className="danger" type="button" onClick={() => onDelete(slide)} disabled={Boolean(actionId)}>
                <FaTrash /> Delete
              </button>
            </footer>
          )}
        </article>
      ))}
    </section>
  );
}
