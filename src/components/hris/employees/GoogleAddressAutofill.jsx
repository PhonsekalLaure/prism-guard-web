import React, { useEffect, useRef } from 'react';
import { getAutocompleteLibrary } from '@utils/googleMaps';

/**
 * GoogleAddressAutofill Component (v2.x Compatible)
 */
const GoogleAddressAutofill = ({ 
  apiKey, 
  onPlaceSelected, 
  value, 
  onChange, 
  className, 
  placeholder 
}) => {
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    async function initAutocomplete() {
      try {
        // Use our utility to safely get the Autocomplete library
        const { Autocomplete } = await getAutocompleteLibrary();

        if (!isMounted || !inputRef.current) return;

        // Initialize Autocomplete
        autocompleteRef.current = new Autocomplete(inputRef.current, {
          fields: ['address_components', 'geometry', 'formatted_address'],
          types: ['address'], 
          componentRestrictions: { country: 'ph' } 
        });

        // Listen for place selection
        autocompleteRef.current.addListener('place_changed', () => {
          const place = autocompleteRef.current.getPlace();
          
          if (place.geometry && place.geometry.location) {
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            const formattedAddress = place.formatted_address;

            if (onPlaceSelected) {
              onPlaceSelected({
                formattedAddress,
                lat,
                lng,
                raw: place
              });
            }
          }
        });
      } catch (error) {
        console.error('Google Maps Load Error:', error);
      }
    }

    initAutocomplete();

    // Cleanup
    return () => {
      isMounted = false;
      if (autocompleteRef.current && window.google) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
        
        // Remove the dropdown containers left in the body
        const containers = document.querySelectorAll('.pac-container');
        containers.forEach(container => container.remove());
      }
    };
  }, []); // Run once on mount

  return (
    <input
      ref={inputRef}
      type="text"
      className={className}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required
      autoComplete="off"
    />
  );
};

export default GoogleAddressAutofill;
