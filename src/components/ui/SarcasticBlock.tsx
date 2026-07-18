import React from 'react';

interface SarcasticBlockProps {
  children: React.ReactNode;
  className?: string;
}

export function SarcasticBlock({ children, className = '' }: SarcasticBlockProps) {
  return (
    <div className={`sarcasm-block ${className}`}>
      {children}
    </div>
  );
}
