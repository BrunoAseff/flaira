'use client';

import { useState, useEffect, useRef, forwardRef } from 'react';
import { Input } from '@/components/ui/input';
import { useGeocoding } from '../hooks/use-geocoding';
import { cn } from '@/lib/utils';
import type { Location } from '../types/route';

interface AutocompleteInputProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onLocationSelect: (location: Location) => void;
  className?: string;
}

export const AutocompleteInput = forwardRef<
  HTMLInputElement,
  AutocompleteInputProps
>(({ placeholder, value, onChange, onLocationSelect, className }, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const { results, loading, search, clearResults } = useGeocoding();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (value) {
        search(value);
        setIsOpen(true);
      } else {
        clearResults();
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [value, search, clearResults]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const handleSelect = (result: any) => {
    const location: Location = {
      id: result.id,
      name: result.place_name,
      coordinates: result.center,
      address: result.place_name,
    };

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
        placeholder={placeholder}
        className={cn('w-full', className)}
        autoComplete="off"
      />

      {isOpen && (results.length > 0 || loading) && (
        <div className="absolute  w-full mt-3 z-50 bg-muted border border-accent rounded-lg shadow-lg max-h-64 overflow-auto">
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
                'focus:bg-primary-foreground focus:outline-none',
                selectedIndex === index && 'bg-primary-foreground'
              )}
              onClick={() => handleSelect(result)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <div className="font-medium truncate">{result.place_name}</div>
              {result.place_type && (
                <div className="text-xs text-foreground/60 capitalize">
                  {result.place_type.join(', ')}
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
});

AutocompleteInput.displayName = 'AutocompleteInput';
