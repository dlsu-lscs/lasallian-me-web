import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-white/60 mb-1.5">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-lg text-white placeholder:text-white/25 text-sm focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 transition-colors ${
          error ? 'border-red-400/60' : ''
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  );
}
