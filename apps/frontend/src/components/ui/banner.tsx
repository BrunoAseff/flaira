import React from 'react';

export function Banner({
  className,
  variant,
  children,
  ...props
}: {
  className?: string;
  variant?: 'error';
  children: React.ReactNode;
  } & Omit<React.HTMLAttributes<HTMLDivElement>, 'className' | 'children'>) {
  const variantStyles = {
    error: "text-error bg-error/10 border-error"
  };

  const variantStyle = variant && variantStyles[variant] ? variantStyles[variant] : '';

  return (
    <div 
      className={`w-full rounded-xl text-sm md:text-base md:font-semibold p-4 h-13 border-1 md:border-2 font-medium flex items-center ${variantStyle} ${className || ''}`}
      {...props}
    >
      {children}
    </div>
  );
}