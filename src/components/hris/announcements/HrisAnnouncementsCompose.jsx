import { useState } from 'react';
import {
  FaPenFancy, FaInfoCircle, FaUsers, FaFlag, FaHeading,
  FaAlignLeft, FaBullhorn, FaCheckCircle,
} from 'react-icons/fa';

export default function HrisAnnouncementsCompose({ onPublish }) {
  const [audience, setAudience] = useState('All');
  const [priority, setPriority] = useState('Normal');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handlePublish = () => {
    if (!subject.trim() || !message.trim()) return;

    onPublish({ audience, priority, subject: subject.trim(), message: message.trim() });

    setSubject('');
    setMessage('');
    setAudience('All');
    setPriority('Normal');
  };

  return (
    <div className="an-compose">
      {/* Dark blue header */}
      <div className="an-compose-header">
        <h3><FaPenFancy /> Compose Announcement</h3>
        <p><FaInfoCircle /> Share your feedback on our security services</p>
      </div>

      <div className="an-compose-body">
        {/* Audience + Priority row */}
        <div className="an-compose-row">
          <div className="an-field-group">
            <label className="an-field-label"><FaUsers /> To</label>
            <select
              className="an-field-select"
              value={audience}
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
            onChange={(e) => setSubject(e.target.value)}
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
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        {/* Publish */}
        <div className="an-compose-footer">
          <button className="an-publish-btn" onClick={handlePublish}>
            <FaBullhorn /> Publish Announcement
          </button>
        </div>
      </div>
    </div>
  );
}
