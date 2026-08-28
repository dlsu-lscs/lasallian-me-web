'use client';

import React from 'react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: ReadonlyArray<{ value: string; label: string }>;
  label?: string;
  icon?: React.ElementType;
  labelPosition?: 'top' | 'left' | 'inside';
}

export function Select({
  options,
  label,
  icon: Icon,
  labelPosition = 'left',
  className = '',
  ...props
}: SelectProps) {
  
  const layoutClass = {
    left: 'flex-row items-center gap-2',
    top: 'flex-col items-start gap-1.5',
    inside: 'items-center',
  };

  const isInside = labelPosition === 'inside';

  return (
    <div className={`relative inline-flex ${layoutClass[labelPosition]}`}>
      {label && !isInside && (
        <label className="text-xs font-semibold text-white/40 uppercase tracking-wide whitespace-nowrap">
          {label}
        </label>
      )}

      <div className="relative inline-flex items-center w-full">

        <select
          className={`appearance-none py-2 px-3 pr-9 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-white/20 transition-colors ${className}`}
          {...props}
        >
          {label && isInside && (
            <option value="" disabled hidden className="bg-neutral-900 text-white/50">
              {label}
            </option>
          )}

          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-neutral-900 text-white">
              {option.label}
            </option>
          ))}
        </select>

        {Icon && (
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-white/40">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>
    </div>
  );
}