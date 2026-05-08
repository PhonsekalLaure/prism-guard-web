import { useEffect, useRef, useState } from 'react';
import googlePlacesService from '@services/googlePlacesService';

const DEBOUNCE_MS = 200;
const MIN_QUERY_LENGTH = 3;

const dropdownStyle = {
  position: 'absolute',
  top: 'calc(100% + 0.25rem)',
  left: 0,
  right: 0,
  zIndex: 20,
  background: '#fff',
  border: '1px solid #d1d5db',
  borderRadius: '0.65rem',
  boxShadow: '0 8px 24px rgba(15, 23, 42, 0.12)',
  maxHeight: '240px',
  overflowY: 'auto',
};

const itemStyle = {
  width: '100%',
  textAlign: 'left',
  padding: '0.7rem 0.85rem',
  border: 'none',
  background: '#fff',
  cursor: 'pointer',
};

export default function GoogleAddressAutofill({
  onPlaceSelected,
  value,
  onChange,
  className,
  placeholder,
}) {
  const inputRef = useRef(null);
  const [predictions, setPredictions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isResolvingSelection, setIsResolvingSelection] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef(null);
  const latestRequestIdRef = useRef(0);
  const suppressNextLookupRef = useRef(false);

  useEffect(() => {
    if (suppressNextLookupRef.current) {
      suppressNextLookupRef.current = false;
      return undefined;
    }

    const trimmedValue = String(value || '').trim();
    if (trimmedValue.length < MIN_QUERY_LENGTH) {
      setPredictions([]);
      setIsOpen(false);
      setActiveIndex(-1);
      return undefined;
    }

    const requestId = latestRequestIdRef.current + 1;
    latestRequestIdRef.current = requestId;
    const controller = new AbortController();
    const timeoutId = window.setTimeout(async () => {
      try {
        setIsLoading(true);
        const nextPredictions = await googlePlacesService.autocompleteAddress(trimmedValue, controller.signal);
        if (latestRequestIdRef.current !== requestId) {
          return;
        }

        setPredictions(nextPredictions);
        setIsOpen(nextPredictions.length > 0);
        setActiveIndex(-1);
      } catch (error) {
        if (error.name !== 'CanceledError' && error.name !== 'AbortError') {
          console.error('Google address autocomplete failed:', error);
        }
        if (latestRequestIdRef.current === requestId) {
          setPredictions([]);
          setIsOpen(false);
        }
      } finally {
        if (latestRequestIdRef.current === requestId) {
          setIsLoading(false);
        }
      }
    }, DEBOUNCE_MS);

    return () => {
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectPrediction = async (prediction) => {
    suppressNextLookupRef.current = true;
    onChange?.({
      target: {
        value: prediction.description,
      },
    });

    setPredictions([]);
    setIsOpen(false);
    setActiveIndex(-1);

    try {
      setIsResolvingSelection(true);
      const details = await googlePlacesService.getPlaceDetails(prediction.placeId);
      suppressNextLookupRef.current = true;
      onPlaceSelected?.({
        formattedAddress: details.formattedAddress,
        lat: details.latitude,
        lng: details.longitude,
        raw: details.raw,
      });
    } catch (error) {
      console.error('Google place details failed:', error);
    } finally {
      setIsResolvingSelection(false);
    }
  };

  const handleKeyDown = async (event) => {
    if (!isOpen || predictions.length === 0) {
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((currentIndex) => (currentIndex + 1) % predictions.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((currentIndex) => (currentIndex <= 0 ? predictions.length - 1 : currentIndex - 1));
    } else if (event.key === 'Enter' && activeIndex >= 0) {
      event.preventDefault();
      await handleSelectPrediction(predictions[activeIndex]);
    } else if (event.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div ref={wrapperRef} style={{ position: 'relative' }}>
      <input
        ref={inputRef}
        type="text"
        className={className}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={() => {
          if (predictions.length > 0) {
            setIsOpen(true);
          }
        }}
        onKeyDown={handleKeyDown}
        required
        autoComplete="off"
      />

      {isLoading && (
        <p className="ae-hint" style={{ marginTop: '0.35rem' }}>
          Loading address suggestions...
        </p>
      )}

      {isResolvingSelection && (
        <p className="ae-hint" style={{ marginTop: '0.35rem' }}>
          Finalizing selected address...
        </p>
      )}

      {isOpen && predictions.length > 0 && (
        <div style={dropdownStyle}>
          {predictions.map((prediction, index) => (
            <button
              key={prediction.placeId}
              type="button"
              style={{
                ...itemStyle,
                background: index === activeIndex ? '#f8fafc' : '#fff',
              }}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => handleSelectPrediction(prediction)}
            >
              <div style={{ fontWeight: 600, color: '#0f172a' }}>{prediction.mainText}</div>
              {prediction.secondaryText ? (
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{prediction.secondaryText}</div>
              ) : null}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
