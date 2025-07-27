'use client';

import React, { useEffect, useState, useRef } from 'react';

interface BannerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'className' | 'children'> {
  className?: string;
  variant?: 'error';
  children: React.ReactNode;
}

export function Banner({
  className,
  variant,
  children,
  ...props
}: BannerProps) {
  const variantStyles = {
    error: 'text-error bg-error/10 border-error/20',
  };
  const variantStyle =
    variant && variantStyles[variant] ? variantStyles[variant] : '';

  const [isVisible, setIsVisible] = useState(false);
  const [currentMaxHeight, setCurrentMaxHeight] = useState('0px');
  const contentWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 10);
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    if (isVisible && contentWrapperRef.current) {
      setCurrentMaxHeight(`${contentWrapperRef.current.scrollHeight + 15}px`);
    } else if (!isVisible) {
      setCurrentMaxHeight('0px');
    }
  }, [isVisible, children]);

  return (
    <div
      style={{ maxHeight: currentMaxHeight }}
      className={`w-full z-50 overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out
                  ${isVisible ? 'opacity-100' : 'opacity-0'}
                  ${className || ''}`}
      {...props}
    >
      <div
        ref={contentWrapperRef}
        className={`rounded-xl text-sm md:text-base md:font-semibold p-4 border-1
                    font-medium flex items-center
                    ${variantStyle}`}
      >
        {children}
      </div>
    </div>
  );
}
