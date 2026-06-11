import { useEffect, useState } from 'react';
import { FaImage, FaTimes } from 'react-icons/fa';

const EMPTY_FORM = {
  heading: '',
  text: '',
  isActive: true,
  image: null,
};

export default function PromoCarouselSlideModal({
  slide,
  saving,
  onClose,
  onSubmit,
}) {
  const [form, setForm] = useState(() => (slide ? {
    heading: slide.heading || '',
    text: slide.text || '',
    isActive: Boolean(slide.is_active),
    image: null,
  } : EMPTY_FORM));
  const [previewUrl, setPreviewUrl] = useState(() => slide?.image_url || '');
  const [error, setError] = useState('');

  useEffect(() => () => {
    if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const selectImage = (event) => {
    const file = event.target.files?.[0] || null;
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Select a valid image file.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('The image must be 10 MB or smaller.');
      return;
    }
    setError('');
    setForm((current) => ({ ...current, image: file }));
    setPreviewUrl(URL.createObjectURL(file));
  };

  const submit = async (event) => {
    event.preventDefault();
    const heading = form.heading.trim();
    const text = form.text.trim();
    if (!heading || !text || (!slide && !form.image)) {
      setError('Heading, text, and an image are required.');
      return;
    }
    if (heading.length > 120 || text.length > 500) {
      setError('Heading must be 120 characters or fewer and text 500 or fewer.');
      return;
    }

    const payload = new FormData();
    payload.append('heading', heading);
    payload.append('text', text);
    payload.append('isActive', String(form.isActive));
    if (form.image) payload.append('image', form.image);
    try {
      await onSubmit(payload);
    } catch {
      // The page-level notification presents the server error.
    }
  };

  return (
    <div className="pc-modal-overlay" onClick={(event) => event.target === event.currentTarget && !saving && onClose()}>
      <section className="pc-modal">
        <header className="pc-modal-header">
          <div>
            <h2>{slide ? 'Edit Promo Slide' : 'Add Promo Slide'}</h2>
            <p>Images display as the public homepage hero background.</p>
          </div>
          <button type="button" onClick={onClose} disabled={saving} aria-label="Close">
            <FaTimes />
          </button>
        </header>

        <form className="pc-form" onSubmit={submit}>
          <label className="pc-image-field">
            <span className="pc-image-preview">
              {previewUrl ? <img src={previewUrl} alt="Slide preview" /> : <FaImage />}
            </span>
            <strong>{previewUrl ? 'Replace image' : 'Choose image'}</strong>
            <small>Recommended: 1920 x 1080 (16:9), up to 10 MB</small>
            <input type="file" accept="image/*" onChange={selectImage} />
          </label>

          <label>
            <span>Heading</span>
            <textarea
              rows="2"
              maxLength="120"
              value={form.heading}
              onChange={(event) => setForm((current) => ({ ...current, heading: event.target.value }))}
              required
            />
            <small>{form.heading.length}/120</small>
          </label>

          <label>
            <span>Supporting text</span>
            <textarea
              rows="5"
              maxLength="500"
              value={form.text}
              onChange={(event) => setForm((current) => ({ ...current, text: event.target.value }))}
              required
            />
            <small>{form.text.length}/500</small>
          </label>

          <label className="pc-toggle">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(event) => setForm((current) => ({ ...current, isActive: event.target.checked }))}
            />
            <span>Active on promo website</span>
          </label>

          {error && <p className="pc-form-error">{error}</p>}

          <footer className="pc-modal-actions">
            <button type="button" className="pc-btn secondary" onClick={onClose} disabled={saving}>Cancel</button>
            <button type="submit" className="pc-btn primary" disabled={saving}>
              {saving ? 'Saving...' : (slide ? 'Save Changes' : 'Add Slide')}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}
