import { useState } from 'react';
import {
  FaPenFancy, FaInfoCircle, FaUsers, FaFlag, FaHeading,
  FaAlignLeft, FaBullhorn, FaCheckCircle, FaCalendarAlt,
} from 'react-icons/fa';

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

export default function HrisAnnouncementsCompose({ onPublish, publishing = false, canWrite = true }) {
  const [audience, setAudience] = useState('All');
  const [priority, setPriority] = useState('Normal');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [error, setError] = useState('');

  const handlePublish = async () => {
    if (!subject.trim() || !message.trim()) {
      setError('Subject and message are required.');
      return;
    }

    const normalizedExpiresAt = toIsoOrNull(expiresAt);
    if (expiresAt && (!normalizedExpiresAt || new Date(normalizedExpiresAt) <= new Date())) {
      setError('Expiration must be a future date and time.');
      return;
    }

    const audienceMap = {
      All: 'both',
      'Clients Only': 'clients',
      'Guards Only': 'employees',
    };
    const priorityMap = {
      Normal: 'normal',
      Important: 'important',
      Urgent: 'urgent',
    };

    try {
      await onPublish({
        targetAudience: audienceMap[audience],
        priority: priorityMap[priority],
        title: subject.trim(),
        message: message.trim(),
        expiresAt: normalizedExpiresAt,
      });
    } catch {
      return;
    }

    setError('');
    setSubject('');
    setMessage('');
    setExpiresAt('');
    setAudience('All');
    setPriority('Normal');
  };

  return (
    <div className="an-compose">
      {/* Dark blue header */}
      <div className="an-compose-header">
        <h3><FaPenFancy /> Compose Announcement</h3>
        <p><FaInfoCircle /> Broadcast updates to clients and guards</p>
      </div>

      <div className="an-compose-body">
        {/* Audience + Priority row */}
        <div className="an-compose-row">
          <div className="an-field-group">
            <label className="an-field-label"><FaUsers /> To</label>
            <select
              className="an-field-select"
              value={audience}
              disabled={publishing || !canWrite}
              onChange={(e) => setAudience(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Clients Only">Clients Only</option>
              <option value="Guards Only">Guards Only</option>
            </select>
          </div>
          <div className="an-field-group">
            <label className="an-field-label"><FaFlag /> Priority</label>
            <select
              className="an-field-select"
              value={priority}
              disabled={publishing || !canWrite}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="Normal">Normal</option>
              <option value="Important">Important</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>
        </div>

        {/* Subject */}
        <div className="an-field-group" style={{ marginBottom: '1rem' }}>
          <label className="an-field-label"><FaHeading /> Subject</label>
          <input
            type="text"
            className="an-field-input"
            placeholder="Enter announcement subject"
            value={subject}
            disabled={publishing || !canWrite}
            onChange={(e) => {
              setSubject(e.target.value);
              if (error) setError('');
            }}
          />
        </div>

        {/* Message */}
        <div className="an-field-group">
          <label className="an-field-label"><FaAlignLeft /> Message</label>
          <textarea
            className="an-field-textarea"
            placeholder="Write your announcement message here"
            rows={4}
            value={message}
            disabled={publishing || !canWrite}
            onChange={(e) => {
              setMessage(e.target.value);
              if (error) setError('');
            }}
          />
        </div>

        <div className="an-field-group an-expires-field">
          <label className="an-field-label"><FaCalendarAlt /> Expiration</label>
          <input
            type="datetime-local"
            className="an-field-input"
            min={getDatetimeLocalMin()}
            value={expiresAt}
            disabled={publishing || !canWrite}
            onChange={(e) => {
              setExpiresAt(e.target.value);
              if (error) setError('');
            }}
          />
          <p className="an-field-hint">Leave blank to keep the announcement visible until archived.</p>
        </div>

        {error && <p className="an-field-error">{error}</p>}

        {/* Publish */}
        <div className="an-compose-footer">
          <button className="an-publish-btn" onClick={handlePublish} disabled={publishing || !canWrite}>
            {publishing ? <FaCheckCircle /> : <FaBullhorn />}
            {publishing ? 'Publishing...' : 'Publish Announcement'}
          </button>
        </div>
      </div>
    </div>
  );
}
