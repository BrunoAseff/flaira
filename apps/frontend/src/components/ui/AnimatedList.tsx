import { useLayoutEffect, useRef, useState } from 'react';

interface AnimatedListProps {
  children: React.ReactNode;
  marginOffset?: number;
  gap?: string;
}

export function AnimatedList({
  children,
  marginOffset = 16,
  gap = 'gap-3',
}: AnimatedListProps) {
  const contentWrapperRef = useRef<HTMLDivElement>(null);
  const [currentMaxHeight, setCurrentMaxHeight] = useState('0px');

  useLayoutEffect(() => {
    if (contentWrapperRef.current) {
      const hasContent = contentWrapperRef.current.scrollHeight > 0;
      const offset = hasContent ? marginOffset : 0;
      const height = contentWrapperRef.current.scrollHeight + offset;
      setCurrentMaxHeight(`${height}px`);
    }
  }, [children, marginOffset]);

  return (
    <div
      style={{ maxHeight: currentMaxHeight }}
      className="w-full overflow-hidden transition-[max-height] duration-500 ease-in-out"
    >
      <div ref={contentWrapperRef} className={`flex flex-col ${gap}`}>
        {children}
      </div>
    </div>
  );
}
