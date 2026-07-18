import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  highlight?: boolean;
  onClick?: () => void;
  selected?: boolean;
}

export function Card({ children, className = '', highlight = false, onClick, selected = false }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        paper-card transition-all duration-200
        ${highlight ? 'border-sarcasm-purple/30 shadow-lg' : ''}
        ${selected ? 'ring-2 ring-ink-black border-ink-black' : ''}
        ${onClick ? 'cursor-pointer hover:shadow-lg hover:-translate-y-0.5' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
