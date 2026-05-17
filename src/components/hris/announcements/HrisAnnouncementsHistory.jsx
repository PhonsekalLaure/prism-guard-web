import { useEffect, useMemo, useState } from 'react';
import {
  FaHistory, FaBullhorn, FaEye, FaChevronLeft, FaChevronRight,
  FaTimes, FaArrowLeft, FaSearch, FaEdit, FaArchive, FaTrash,
  FaSave, FaExclamationTriangle,
} from 'react-icons/fa';

const AUDIENCE_OPTIONS = [
  { value: '', label: 'All Audiences' },
  { value: 'both', label: 'All' },
  { value: 'clients', label: 'Clients Only' },
  { value: 'employees', label: 'Guards Only' },
];

const PRIORITY_OPTIONS = [
  { value: '', label: 'All Priorities' },
  { value: 'normal', label: 'Normal' },
  { value: 'important', label: 'Important' },
  { value: 'urgent', label: 'Urgent' },
];

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'active', label: 'Active' },
  { value: 'archived', label: 'Archived' },
  { value: 'expired', label: 'Expired' },
];

function toDatetimeLocalValue(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
}

function toDisplayDateTime(value) {
  if (!value) return 'No expiration';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'No expiration';
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function toIsoOrNull(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function getDatetimeLocalMin() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset() + 1);
  return now.toISOString().slice(0, 16);
}

function ViewModal({ item, onClose }) {
  if (!item) return null;

  return (
    <div
      className="an-modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="an-modal" role="dialog" aria-modal="true" aria-labelledby="hris-announcement-details-title">
        <div className="an-modal-header">
          <div>
            <h2 id="hris-announcement-details-title">Announcement Details</h2>
            <p>{item.id}</p>
          </div>
          <button className="an-modal-close" onClick={onClose}><FaTimes /></button>
        </div>

        <div className="an-modal-body">
          <div className="an-modal-badges">
            <span className={`an-badge ${item.audienceClass}`}>{item.audience}</span>
            <span className={`an-badge ${item.priorityClass}`}>{item.priority}</span>
            <span className={`an-badge ${item.statusClass}`}>{item.status}</span>
          </div>

          <div className="an-modal-cell">
            <label>Subject</label>
            <p>{item.subject}</p>
          </div>

          <div className="an-modal-grid">
            <div className="an-modal-cell">
              <label>Published By</label>
              <p>{item.publishedBy}</p>
            </div>
            <div className="an-modal-cell">
              <label>Date Published</label>
              <p>{item.date}</p>
            </div>
            <div className="an-modal-cell">
              <label>Expiration</label>
              <p>{toDisplayDateTime(item.expiresAt)}</p>
            </div>
          </div>

          <div className="an-modal-message">
            <label>Message</label>
            <p>{item.message}</p>
          </div>

          <div className="an-modal-actions">
            <button className="an-back-btn" onClick={onClose}>
              <FaArrowLeft /> Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function EditModal({ item, saving, canWrite, onClose, onSave }) {
  const initialExpiresAt = toDatetimeLocalValue(item?.expiresAt);
  const [form, setForm] = useState(() => ({
    title: item?.subject || '',
    message: item?.message || '',
    targetAudience: item?.targetAudience || 'both',
    priority: item?.priorityValue || 'normal',
    expiresAt: initialExpiresAt,
  }));
  const [error, setError] = useState('');

  if (!item) return null;

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.title.trim() || !form.message.trim()) {
      setError('Subject and message are required.');
      return;
    }

    const expirationChanged = form.expiresAt !== initialExpiresAt;
    const normalizedExpiresAt = toIsoOrNull(form.expiresAt);
    if (expirationChanged && form.expiresAt && (!normalizedExpiresAt || new Date(normalizedExpiresAt) <= new Date())) {
      setError('Expiration must be a future date and time.');
      return;
    }

    const payload = {
      ...form,
      title: form.title.trim(),
      message: form.message.trim(),
    };

    if (expirationChanged) {
      payload.expiresAt = normalizedExpiresAt;
    } else {
      delete payload.expiresAt;
    }

    await onSave(item.id, payload);
  };

  return (
    <div
      className="an-modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <form className="an-modal an-edit-modal" role="dialog" aria-modal="true" aria-labelledby="hris-announcement-edit-title" onSubmit={handleSubmit}>
        <div className="an-modal-header">
          <div>
            <h2 id="hris-announcement-edit-title">Edit Announcement</h2>
            <p>{item.id}</p>
          </div>
          <button type="button" className="an-modal-close" onClick={onClose}><FaTimes /></button>
        </div>

        <div className="an-modal-body">
          <div className="an-compose-row">
            <div className="an-field-group">
              <label className="an-field-label">Audience</label>
              <select
                className="an-field-select"
                value={form.targetAudience}
                disabled={saving || !canWrite}
                onChange={(e) => updateField('targetAudience', e.target.value)}
              >
                {AUDIENCE_OPTIONS.slice(1).map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            <div className="an-field-group">
              <label className="an-field-label">Priority</label>
              <select
                className="an-field-select"
                value={form.priority}
                disabled={saving || !canWrite}
                onChange={(e) => updateField('priority', e.target.value)}
              >
                {PRIORITY_OPTIONS.slice(1).map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="an-field-group">
            <label className="an-field-label">Subject</label>
            <input
              className="an-field-input"
              value={form.title}
              disabled={saving || !canWrite}
              onChange={(e) => updateField('title', e.target.value)}
            />
          </div>

          <div className="an-field-group">
            <label className="an-field-label">Message</label>
            <textarea
              className="an-field-textarea"
              rows={5}
              value={form.message}
              disabled={saving || !canWrite}
              onChange={(e) => updateField('message', e.target.value)}
            />
          </div>

          <div className="an-field-group">
            <label className="an-field-label">Expiration</label>
            <input
              type="datetime-local"
              className="an-field-input"
              min={getDatetimeLocalMin()}
              value={form.expiresAt}
              disabled={saving || !canWrite}
              onChange={(e) => updateField('expiresAt', e.target.value)}
            />
            <p className="an-field-hint">Clear this field to remove the expiration date.</p>
          </div>

          {error && <p className="an-field-error">{error}</p>}

          <div className="an-modal-actions an-modal-actions-row">
            <button type="button" className="an-back-btn" onClick={onClose} disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="an-save-btn" disabled={saving || !canWrite}>
              <FaSave /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

function ConfirmModal({ action, saving, onCancel, onConfirm }) {
  if (!action) return null;

  const isDelete = action.type === 'delete';

  return (
    <div
      className="an-modal-overlay"
      onClick={(e) => e.target === e.currentTarget && !saving && onCancel()}
    >
      <div className="an-confirm-modal" role="dialog" aria-modal="true" aria-labelledby="hris-announcement-confirm-title">
        <div className={`an-confirm-icon ${isDelete ? 'danger' : ''}`}>
          <FaExclamationTriangle />
        </div>
        <div>
          <h2 id="hris-announcement-confirm-title">{isDelete ? 'Delete announcement?' : 'Archive announcement?'}</h2>
          <p>
            {isDelete
              ? 'This permanently removes the announcement from history.'
              : 'This hides the announcement from CMS and mobile while keeping it in HRIS history.'}
          </p>
          <strong>{action.row.subject}</strong>
        </div>
        <div className="an-confirm-actions">
          <button className="an-back-btn" onClick={onCancel} disabled={saving}>
            Cancel
          </button>
          <button
            className={`an-confirm-btn ${isDelete ? 'danger' : ''}`}
            onClick={onConfirm}
            disabled={saving}
          >
            {saving ? 'Working...' : (isDelete ? 'Delete' : 'Archive')}
          </button>
        </div>
      </div>
    </div>
  );
}

function buildPageNumbers(page, totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set([1, totalPages, page, page - 1, page + 1]);
  if (page <= 3) {
    pages.add(2);
    pages.add(3);
    pages.add(4);
  }
  if (page >= totalPages - 2) {
    pages.add(totalPages - 1);
    pages.add(totalPages - 2);
    pages.add(totalPages - 3);
  }

  const sorted = [...pages]
    .filter((item) => item >= 1 && item <= totalPages)
    .sort((a, b) => a - b);

  return sorted.reduce((result, item, index) => {
    if (index > 0 && item - sorted[index - 1] > 1) {
      result.push(`gap-${sorted[index - 1]}-${item}`);
    }
    result.push(item);
    return result;
  }, []);
}

export default function HrisAnnouncementsHistory({
  rows = [],
  loading = false,
  metadata = { total: 0, page: 1, limit: 8, totalPages: 0 },
  filters = {},
  actionLoadingId = null,
  onArchive,
  onDelete,
  onEdit,
  onFiltersChange,
  onPageChange,
  canWrite = true,
}) {
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);
  const [searchInput, setSearchInput] = useState(filters.search || '');
  const page = metadata.page || 1;
  const totalPages = metadata.totalPages || 0;
  const start = metadata.total ? ((page - 1) * metadata.limit) + 1 : 0;
  const end = metadata.total ? Math.min(page * metadata.limit, metadata.total) : 0;
  const pageNumbers = useMemo(() => buildPageNumbers(page, totalPages), [page, totalPages]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchInput !== (filters.search || '')) {
        onFiltersChange({ ...filters, search: searchInput });
      }
    }, 350);

    return () => clearTimeout(timeout);
  }, [filters, onFiltersChange, searchInput]);

  const updateFilter = (field, value) => {
    onFiltersChange({ ...filters, search: searchInput, [field]: value });
  };

  const handleArchive = (row) => {
    if (row.status === 'Archived') return;
    setPendingAction({ type: 'archive', row });
  };

  const handleDelete = (row) => {
    setPendingAction({ type: 'delete', row });
  };

  const handleSave = async (id, form) => {
    await onEdit(id, form);
    setEditing(null);
  };

  const confirmPendingAction = async () => {
    if (!pendingAction) return;

    try {
      if (pendingAction.type === 'delete') {
        await onDelete(pendingAction.row.id);
      } else {
        await onArchive(pendingAction.row.id);
      }
      setPendingAction(null);
    } catch {
      return;
    }
  };

  return (
    <div className="an-table-container">
      <div className="an-table-header an-table-header-row">
        <h3><FaHistory /> Announcement History</h3>
      </div>

      <div className="an-filter-bar">
        <div className="an-search-box">
          <FaSearch />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search announcements"
          />
        </div>
        <select
          className="an-filter-select"
          value={filters.targetAudience || ''}
          onChange={(e) => updateFilter('targetAudience', e.target.value)}
        >
          {AUDIENCE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        <select
          className="an-filter-select"
          value={filters.priority || ''}
          onChange={(e) => updateFilter('priority', e.target.value)}
        >
          {PRIORITY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        <select
          className="an-filter-select"
          value={filters.status || ''}
          onChange={(e) => updateFilter('status', e.target.value)}
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>

      <div className="an-table-wrap">
        <table className="an-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Subject</th>
              <th>Audience</th>
              <th>Priority</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan="7" className="an-empty-cell">Loading announcements...</td>
              </tr>
            )}

            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan="7" className="an-empty-cell">No announcements found.</td>
              </tr>
            )}

            {!loading && rows.map((row, i) => {
              const isBusy = actionLoadingId === row.id;
              return (
                <tr key={`${row.id}-${i}`} onClick={() => setSelected(row)}>
                  <td className="an-id-cell">{row.id}</td>
                  <td>
                    <div className="an-subject-cell">
                      <div className={`an-subject-icon ${row.iconClass}`}>
                        <FaBullhorn />
                      </div>
                      <span className="an-subject-text">{row.subject}</span>
                    </div>
                  </td>
                  <td><span className={`an-badge ${row.audienceClass}`}>{row.audience}</span></td>
                  <td><span className={`an-badge ${row.priorityClass}`}>{row.priority}</span></td>
                  <td style={{ color: '#4b5563' }}>{row.date}</td>
                  <td><span className={`an-badge ${row.statusClass}`}>{row.status}</span></td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <div className="an-row-actions">
                      <button className="an-icon-btn" onClick={() => setSelected(row)} title="View">
                        <FaEye />
                      </button>
                      <button className="an-icon-btn" onClick={() => setEditing(row)} title="Edit" disabled={isBusy || !canWrite}>
                        <FaEdit />
                      </button>
                      <button
                        className="an-icon-btn"
                        onClick={() => handleArchive(row)}
                        title="Archive"
                        disabled={isBusy || row.status === 'Archived' || !canWrite}
                      >
                        <FaArchive />
                      </button>
                      <button className="an-icon-btn danger" onClick={() => handleDelete(row)} title="Delete" disabled={isBusy || !canWrite}>
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="an-pagination">
        <p className="an-pagination-text">
          Showing {start ? `${start}-${end}` : '0'} of {metadata.total || 0} announcements
        </p>
        <div className="an-pagination-controls">
          <button
            className="an-page-btn"
            disabled={loading || page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            <FaChevronLeft />
          </button>
          {pageNumbers.map((item) => (
            typeof item === 'number' ? (
              <button
                key={item}
                className={`an-page-btn ${item === page ? 'active' : ''}`}
                disabled={loading}
                onClick={() => onPageChange(item)}
              >
                {item}
              </button>
            ) : (
              <span key={item} className="an-page-gap">...</span>
            )
          ))}
          <button
            className="an-page-btn"
            disabled={loading || page >= totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            <FaChevronRight />
          </button>
        </div>
      </div>

      {selected && <ViewModal item={selected} onClose={() => setSelected(null)} />}
      {editing && (
        <EditModal
          item={editing}
          saving={actionLoadingId === editing.id}
          canWrite={canWrite}
          onClose={() => setEditing(null)}
          onSave={handleSave}
        />
      )}
      {pendingAction && (
        <ConfirmModal
          action={pendingAction}
          saving={actionLoadingId === pendingAction.row.id}
          onCancel={() => setPendingAction(null)}
          onConfirm={confirmPendingAction}
        />
      )}
    </div>
  );
}
