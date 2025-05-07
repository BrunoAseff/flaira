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
  [key: string]: any;
}) {
  const variantStyles = {
    error: "text-error bg-error/10 border-error"
  };

  const variantStyle = variant && variantStyles[variant] ? variantStyles[variant] : '';

  return (
    <div 
      className={`w-full rounded-xl p-4 h-13 border-2 flex items-center ${variantStyle} ${className || ''}`}
      {...props}
    >
      {children}
    </div>
  );
}