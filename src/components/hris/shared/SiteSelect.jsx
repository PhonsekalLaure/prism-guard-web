import { useEffect, useRef, useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import EntityAvatar from '@components/ui/EntityAvatar';
import { formatSiteLabel } from './siteDisplay';

function SiteOptionContent({ site }) {
  return (
    <>
      <EntityAvatar
        avatarUrl={site?.clients?.avatar_url}
        initials={(site?.clients?.company || 'C').charAt(0).toUpperCase()}
        alt={site?.clients?.company}
        className="dep-site-option-avatar"
      />
      <span>{formatSiteLabel(site)}</span>
    </>
  );
}

export default function SiteSelect({
  sites,
  selectedSiteId,
  onSelect,
  emptyLabel = '- Select a site -',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const selectedSite = sites.find((site) => site.id === selectedSiteId);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (site) => {
    onSelect(site);
    setIsOpen(false);
  };

  return (
    <div className="dep-site-select" ref={dropdownRef}>
      <button
        type="button"
        className="dep-input dep-site-select-trigger"
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className={selectedSite ? 'dep-site-select-value' : 'dep-site-select-placeholder'}>
          {selectedSite ? <SiteOptionContent site={selectedSite} /> : emptyLabel}
        </span>
        <FaChevronDown className="dep-site-select-chevron" />
      </button>

      {isOpen && (
        <div className="dep-site-select-menu">
          <button
            type="button"
            className="dep-site-select-option placeholder"
            onClick={() => handleSelect(null)}
          >
            {emptyLabel}
          </button>
          {sites.map((site) => (
            <button
              type="button"
              key={site.id}
              className={`dep-site-select-option${selectedSiteId === site.id ? ' selected' : ''}`}
              onClick={() => handleSelect(site)}
            >
              <SiteOptionContent site={site} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
