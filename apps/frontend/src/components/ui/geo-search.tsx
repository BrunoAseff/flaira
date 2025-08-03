'use client';

import { useState, useEffect, useRef, forwardRef } from 'react';
import { createPortal } from 'react-dom';
import { Input } from '@/components/ui/input';
import { useGeocoding } from '../../hooks/use-geocoding';
import { cn } from '@/lib/utils';
import type { Location } from '../../types/route';

interface GeoSearchInputProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onLocationSelect: (location: Location) => void;
  className?: string;
}

interface GeocodingResult {
  id: string;
  place_name: string;
  center: [number, number];
  place_type?: string[];
}

export const GeoSearchInput = forwardRef<HTMLInputElement, GeoSearchInputProps>(
  ({ placeholder, value, onChange, onLocationSelect, className }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [dropdownPosition, setDropdownPosition] = useState({
      top: 0,
      left: 0,
      width: 0,
    });
    const { results, loading, search, clearResults } = useGeocoding();
    const containerRef = useRef<HTMLDivElement>(null);
    const isSelectingRef = useRef(false);

    const updateDropdownPosition = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDropdownPosition({
          top: rect.bottom + window.scrollY + 4,
          left: rect.left + window.scrollX,
          width: rect.width,
        });
      }
    };

    useEffect(() => {
      if (isSelectingRef.current) {
        isSelectingRef.current = false;
        return;
      }

      const timer = setTimeout(() => {
        if (value) {
          search(value);
          setIsOpen(true);
          updateDropdownPosition();
        } else {
          clearResults();
          setIsOpen(false);
        }
      }, 300);

      return () => clearTimeout(timer);
    }, [value, search, clearResults]);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        const dropdown = document.querySelector('[data-autocomplete-dropdown]');
        if (dropdown && dropdown.contains(event.target as Node)) {
          return;
        }

        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
          setSelectedIndex(-1);
        }
      };

      const handleScroll = () => {
        if (isOpen) {
          updateDropdownPosition();
        }
      };

      const handleResize = () => {
        if (isOpen) {
          updateDropdownPosition();
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('scroll', handleScroll, true);
      window.addEventListener('resize', handleResize);

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        window.removeEventListener('scroll', handleScroll, true);
        window.removeEventListener('resize', handleResize);
      };
    }, [isOpen]);
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (!isOpen || results.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => Math.max(prev - 1, -1));
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0) {
            handleSelect(results[selectedIndex]);
          }
          break;
        case 'Escape':
          setIsOpen(false);
          setSelectedIndex(-1);
          break;
      }
    };

    const handleSelect = (result: GeocodingResult) => {
      const location: Location = {
        id: result.id,
        name: result.place_name,
        coordinates: result.center,
        address: result.place_name,
      };

      isSelectingRef.current = true;
      onChange(result.place_name);
      onLocationSelect(location);
      setIsOpen(false);
      setSelectedIndex(-1);
      clearResults();
    };

    return (
      <div ref={containerRef} className="relative w-full">
        <Input
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={updateDropdownPosition}
          placeholder={placeholder}
          className={cn('w-full', className)}
          autoComplete="off"
        />

        {isOpen &&
          (results.length > 0 || loading) &&
          typeof window !== 'undefined' &&
          createPortal(
            <div
              data-autocomplete-dropdown
              className="fixed bg-muted border border-accent rounded-lg shadow-xl max-h-64 overflow-auto z-[9999]"
              style={{
                top: dropdownPosition.top,
                left: dropdownPosition.left,
                width: dropdownPosition.width,
                pointerEvents: 'auto',
              }}
              onMouseDown={(e) => e.preventDefault()}
            >
              {loading && (
                <div className="px-3 py-2 text-sm mx-auto text-bold text-foreground">
                  Searching...
                </div>
              )}

              {results.map((result, index) => (
                <button
                  key={result.id}
                  className={cn(
                    'w-full px-3 py-2 text-left text-sm hover:bg-primary-foreground transition-colors',
                    'focus:bg-primary-foreground focus:outline-none cursor-pointer',
                    selectedIndex === index && 'bg-primary-foreground'
                  )}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelect(result);
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                  type="button"
                >
                  <div className="font-medium truncate">
                    {result.place_name}
                  </div>
                  {result.place_type && (
                    <div className="text-xs text-foreground/60 capitalize">
                      {result.place_type.join(', ')}
                    </div>
                  )}
                </button>
              ))}
            </div>,
            document.body
          )}
      </div>
    );
  }
);

GeoSearchInput.displayName = 'GeoSearchInput';
