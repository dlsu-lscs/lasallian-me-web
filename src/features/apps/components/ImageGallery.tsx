'use client';

import { useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { imgSrc } from '@/lib/img-src';

interface ImageGalleryProps {
  images: string[] | null;
  title: string;
}

export function ImageGallery({ images, title }: ImageGalleryProps) {
  const [index, setIndex] = useState(0);
  const list = images ?? [];

  if (list.length === 0) {
    return (
      <div className="w-full aspect-video mb-6 rounded-xl bg-white/5 overflow-hidden flex items-center justify-center">
        <span className="text-white/20 text-xl font-bold">No preview available</span>
      </div>
    );
  }

  const prev = () => setIndex((i) => (i - 1 + list.length) % list.length);
  const next = () => setIndex((i) => (i + 1) % list.length);

  return (
    <div className="w-full mb-6">
      <div className="relative w-full aspect-video rounded-xl bg-white/5 overflow-hidden">
        <img
          src={imgSrc(list[index])}
          alt={`${title} preview ${index + 1}`}
          className="w-full h-full object-cover"
        />

        {list.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-1 transition-colors"
            >
              <FiChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              aria-label="Next image"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-1 transition-colors"
            >
              <FiChevronRight className="w-5 h-5" />
            </button>

            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
              {list.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  aria-label={`Go to image ${i + 1}`}
                  className={`w-2 h-2 rounded-full transition-colors ${i === index ? 'bg-white' : 'bg-white/50'}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
