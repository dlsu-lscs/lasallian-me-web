import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center font-semibold rounded-full transition-colors focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer';

  const variants = {
    primary:   'bg-white text-black hover:bg-white/90',
    secondary: 'bg-white/10 text-white hover:bg-white/15 border border-white/10',
    outline:   'border border-white/20 text-white hover:bg-white/8',
    ghost:     'text-white/60 hover:text-white hover:bg-white/8',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
