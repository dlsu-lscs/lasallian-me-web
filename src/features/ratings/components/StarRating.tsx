'use client';

import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';

interface StarRatingProps {
  value: number;
  interactive?: boolean;
  onChange?: (score: number) => void;
  size?: 'sm' | 'md';
}

export function StarRating({ value, interactive = false, onChange, size = 'md' }: StarRatingProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  const sizeClass = size === 'sm' ? 'w-4 h-4' : 'w-6 h-6';
  const active = hovered ?? value;

  return (
    <div className="flex">
      {Array.from({ length: 5 }, (_, i) => {
        const filled = i < active;
        return (
          <FaStar
            key={i}
            className={`${sizeClass} transition-colors ${
              filled ? 'text-white/80' : 'text-white/15'
            } ${interactive ? 'cursor-pointer hover:text-white' : ''}`}
            onMouseEnter={interactive ? () => setHovered(i + 1) : undefined}
            onMouseLeave={interactive ? () => setHovered(null) : undefined}
            onClick={interactive && onChange ? () => onChange(i + 1) : undefined}
          />
        );
      })}
    </div>
  );
}
