import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  className?: string;
}

export function Badge({
  children,
  variant = 'default',
  className = '',
}: BadgeProps) {
  const variantStyles = {
    default: 'bg-white/10 text-white/55 backdrop-blur-lg border border-white/12',
    primary: 'bg-primary-400/20 text-primary-300 border border-primary-400/30',
    secondary: 'bg-white/10 text-white/55 border border-white/12',
    success: 'bg-white text-black border border-white/80',
    warning: 'bg-yellow-400/15 text-yellow-300 border border-yellow-400/25',
    danger: 'bg-red-400/15 text-red-300 border border-red-400/25',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}


