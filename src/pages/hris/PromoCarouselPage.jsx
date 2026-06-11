import { useCallback, useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { FaBars, FaImages, FaPlus, FaShieldAlt } from 'react-icons/fa';
import Notification from '@components/ui/Notification';
import PromoCarouselDeleteDialog from '@hris-components/promo-carousel/PromoCarouselDeleteDialog';
import PromoCarouselSlideList from '@hris-components/promo-carousel/PromoCarouselSlideList';
import PromoCarouselSlideModal from '@hris-components/promo-carousel/PromoCarouselSlideModal';
import useNotification from '@hooks/useNotification';
import authService from '@services/authService';
import promoCarouselService from '@services/hris/promoCarouselService';
import { hasPermission } from '@utils/adminPermissions';
import '@styles/hris/PromoCarousel.css';

const MAX_SLIDES = 5;

function getErrorMessage(error, fallback) {
  return error.response?.data?.error || fallback;
}

export default function PromoCarouselPage() {
  const { toggleSidebar } = useOutletContext() || {};
  const canWrite = hasPermission(authService.getProfile() || {}, 'promocarousel.write');
  const { notification, showNotification, closeNotification } = useNotification();
  const [slides, setSlides] = useState([]);
  const [settings, setSettings] = useState({ use_default_hero: true });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionId, setActionId] = useState('');
  const [editingSlide, setEditingSlide] = useState(undefined);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const loadSlides = useCallback(async () => {
    setLoading(true);
    try {
      const [nextSlides, nextSettings] = await Promise.all([
        promoCarouselService.listSlides(),
        promoCarouselService.getSettings(),
      ]);
      setSlides(nextSlides);
      setSettings(nextSettings);
    } catch (error) {
      showNotification(getErrorMessage(error, 'Failed to load promo slides.'), 'error');
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    loadSlides();
  }, [loadSlides]);

  const saveSlide = async (payload) => {
    setSaving(true);
    try {
      if (editingSlide) {
        await promoCarouselService.updateSlide(editingSlide.id, payload);
      } else {
        await promoCarouselService.createSlide(payload);
      }
      setEditingSlide(undefined);
      await loadSlides();
      showNotification(editingSlide ? 'Promo slide updated.' : 'Promo slide added.', 'success');
    } catch (error) {
      showNotification(getErrorMessage(error, 'Failed to save promo slide.'), 'error');
      throw error;
    } finally {
      setSaving(false);
    }
  };

  const toggleDefaultHero = async () => {
    setActionId('settings');
    try {
      const nextSettings = await promoCarouselService.updateSettings({
        useDefaultHero: !settings.use_default_hero,
      });
      setSettings(nextSettings);
      showNotification(
        nextSettings.use_default_hero
          ? 'Default promo hero enabled. Custom slides are hidden.'
          : 'Custom promo carousel enabled.',
        'success',
      );
    } catch (error) {
      showNotification(getErrorMessage(error, 'Failed to update promo hero mode.'), 'error');
    } finally {
      setActionId('');
    }
  };

  const toggleSlide = async (slide) => {
    setActionId(slide.id);
    try {
      const payload = new FormData();
      payload.append('isActive', String(!slide.is_active));
      await promoCarouselService.updateSlide(slide.id, payload);
      await loadSlides();
      showNotification(`Slide ${slide.is_active ? 'deactivated' : 'activated'}.`, 'success');
    } catch (error) {
      showNotification(getErrorMessage(error, 'Failed to update slide status.'), 'error');
    } finally {
      setActionId('');
    }
  };

  const moveSlide = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= slides.length) return;
    const reordered = [...slides];
    [reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]];
    setActionId(slides[index].id);
    try {
      const saved = await promoCarouselService.reorderSlides(reordered.map((slide) => slide.id));
      setSlides(saved);
      showNotification('Slide order updated.', 'success');
    } catch (error) {
      showNotification(getErrorMessage(error, 'Failed to reorder slides.'), 'error');
    } finally {
      setActionId('');
    }
  };

  const deleteSlide = async () => {
    if (!deleteTarget) return;
    setActionId(deleteTarget.id);
    try {
      await promoCarouselService.deleteSlide(deleteTarget.id);
      setDeleteTarget(null);
      await loadSlides();
      showNotification('Promo slide deleted.', 'success');
    } catch (error) {
      showNotification(getErrorMessage(error, 'Failed to delete slide.'), 'error');
    } finally {
      setActionId('');
    }
  };

  const atLimit = slides.length >= MAX_SLIDES;

  return (
    <>
      <header className="pc-topbar">
        <div>
          <button className="mobile-toggle" type="button" onClick={toggleSidebar}><FaBars /></button>
          <span>
            <h2>Promo Carousel</h2>
            <p>Manage homepage hero images and messaging</p>
          </span>
        </div>
        {canWrite && (
          <button
            className="pc-btn primary"
            type="button"
            disabled={atLimit}
            onClick={() => setEditingSlide(null)}
          >
            <FaPlus /> Add Slide
          </button>
        )}
      </header>

      <main className="pc-content">
        <section className="pc-settings">
          <div className="pc-settings-icon"><FaShieldAlt /></div>
          <div className="pc-settings-copy">
            <h3>Default Promo Hero</h3>
            <p>
              {settings.use_default_hero
                ? 'The promo site is showing the original two-image hero. Custom slides are hidden.'
                : 'The promo site is showing active custom carousel slides.'}
            </p>
          </div>
          {canWrite && (
            <label className="pc-switch">
              <input
                type="checkbox"
                checked={Boolean(settings.use_default_hero)}
                disabled={actionId === 'settings'}
                onChange={toggleDefaultHero}
              />
              <span />
            </label>
          )}
        </section>

        <section className="pc-summary">
          <div><FaImages /><span><strong>{slides.length} / {MAX_SLIDES}</strong> slides used</span></div>
          <p>
            {settings.use_default_hero
              ? 'Inactive and active custom slides are saved but not shown while default mode is on.'
              : 'Inactive slides count toward the five-slide limit.'}
          </p>
        </section>

        <PromoCarouselSlideList
          actionId={actionId}
          canWrite={canWrite}
          loading={loading}
          slides={slides}
          onDelete={setDeleteTarget}
          onEdit={setEditingSlide}
          onMove={moveSlide}
          onToggle={toggleSlide}
        />
      </main>

      {editingSlide !== undefined && (
        <PromoCarouselSlideModal
          key={editingSlide?.id || 'new'}
          slide={editingSlide}
          saving={saving}
          onClose={() => !saving && setEditingSlide(undefined)}
          onSubmit={saveSlide}
        />
      )}

      {deleteTarget && (
        <PromoCarouselDeleteDialog
          deleting={Boolean(actionId)}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={deleteSlide}
        />
      )}

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          duration={notification.duration}
          onClose={closeNotification}
        />
      )}
    </>
  );
}
