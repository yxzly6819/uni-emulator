import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  disabled?: boolean;
  className?: string;
  fullWidth?: boolean;
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  className = '',
  fullWidth = false,
}: ButtonProps) {
  const base = 'px-6 py-3 rounded-lg font-medium transition-all duration-200 text-base';
  const variants: Record<string, string> = {
    primary: 'bg-ink-black text-paper-white hover:bg-gray-800 active:bg-black',
    secondary: 'bg-white border border-bureau-gray/30 text-ink-black hover:bg-gray-50',
    danger: 'bg-party-red text-white hover:bg-red-700',
    ghost: 'bg-transparent text-bureau-gray hover:text-ink-black hover:bg-gray-100',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${base} ${variants[variant]}
        ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      {children}
    </button>
  );
}
