'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FiChevronDown, FiCheck } from 'react-icons/fi';
import { motion, AnimatePresence } from 'motion/react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectChangeEvent {
  target: {
    value: string;
    name?: string;
  };
}

export interface SelectProps {
  options: ReadonlyArray<SelectOption>;
  value?: string;
  defaultValue?: string;
  onChange?: (e: SelectChangeEvent) => void;
  label?: string;
  icon?: React.ElementType;
  labelPosition?: 'top' | 'left' | 'inside';
  error?: string;
  disabled?: boolean;
  name?: string;
  placeholder?: string;
  className?: string;
  containerClassName?: string;
  menuClassName?: string;
}

export function Select({
  options,
  value: controlledValue,
  defaultValue,
  onChange,
  label,
  icon,
  labelPosition = 'left',
  error,
  disabled = false,
  name,
  placeholder,
  className = '',
  containerClassName = '',
  menuClassName = '',
}: SelectProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState<string>(
    defaultValue ?? (options[0]?.value || '')
  );
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : uncontrolledValue;

  const selectedOption = options.find((opt) => opt.value === currentValue);

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (val: string) => {
    if (disabled) return;
    if (!isControlled) {
      setUncontrolledValue(val);
    }
    onChange?.({ target: { value: val, name } });
    setIsOpen(false);
  };

  const Icon = icon ?? FiChevronDown;
  const isInside = labelPosition === 'inside';
  const showOutsideLabel = label && !isInside;

  const layoutClass = {
    left: 'flex-row items-center gap-2.5',
    top: 'flex-col items-start gap-1.5',
    inside: 'flex-col items-start',
  };

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex ${layoutClass[labelPosition]} ${containerClassName}`}
    >
      {showOutsideLabel && (
        <label className="text-xs font-semibold text-white/50 uppercase tracking-wider whitespace-nowrap select-none">
          {label}
        </label>
      )}

      <div className="relative w-full min-w-0">
        {/* Custom Trigger Button */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen((prev) => !prev)}
          className={`w-full flex items-center justify-between gap-2 py-2.5 px-3.5 bg-white/[0.04] hover:bg-white/[0.07] border ${
            isOpen
              ? 'border-white/30 bg-black/60 ring-2 ring-white/10'
              : error
              ? 'border-red-500/50 hover:border-red-400'
              : 'border-white/10 hover:border-white/20'
          } rounded-xl text-white text-xs font-medium transition-all shadow-[var(--shadow-glass)] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-left focus:outline-none ${className}`}
        >
          <span className="truncate">
            {selectedOption ? (
              selectedOption.label
            ) : isInside && label ? (
              <span className="text-white/40">{label}</span>
            ) : placeholder ? (
              <span className="text-white/40">{placeholder}</span>
            ) : (
              <span className="text-white/40">Select…</span>
            )}
          </span>

          <Icon
            className={`w-3.5 h-3.5 text-white/40 shrink-0 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-white/80' : ''
            }`}
          />
        </button>

        {/* Hidden input for HTML form compliance */}
        {name && <input type="hidden" name={name} value={currentValue} />}

        {/* Custom Animated Liquid Glass Dropdown Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 450, damping: 30 }}
              className={`absolute left-0 right-0 top-full mt-1.5 z-50 bg-black/85 backdrop-blur-xl border border-white/10 shadow-[var(--shadow-modal)] rounded-xl py-1.5 overflow-hidden max-h-60 overflow-y-auto ${menuClassName}`}
            >
              {options.map((option) => {
                const isSelected = option.value === currentValue;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className={`w-[calc(100%-0.5rem)] mx-1 px-3 py-2 text-xs flex items-center justify-between rounded-lg transition-colors cursor-pointer text-left ${
                      isSelected
                        ? 'bg-white/12 text-white font-medium'
                        : 'text-white/70 hover:text-white hover:bg-white/8'
                    }`}
                  >
                    <span className="truncate">{option.label}</span>
                    {isSelected && <FiCheck className="w-3.5 h-3.5 text-green-400 shrink-0 ml-2" />}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {error && <span className="text-xs text-red-400 mt-0.5">{error}</span>}
    </div>
  );
}