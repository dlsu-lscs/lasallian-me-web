'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { Application } from '../types/app.types';
import { FiBookmark, FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi';
import { FaBookmark, FaStar, FaPlay } from 'react-icons/fa';
import { LuTag, LuSquareUser } from 'react-icons/lu';
import { imgSrc } from '@/lib/img-src';

export interface AppDetailProps {
  app: Application;
  favoritesCount?: number;
  isFavorited?: boolean;
  onToggleFavorite?: () => void;
  isFavoritePending?: boolean;
  isLoggedIn?: boolean;
  averageScore?: number;
  totalRatings?: number;
  ratingsSection?: React.ReactNode;
  /** When true, strips the outer page-padding wrapper so the card fills its container. */
  preview?: boolean;
}

export function AppDetail({
  app,
  favoritesCount,
  isFavorited = false,
  onToggleFavorite,
  isFavoritePending = false,
  isLoggedIn = false,
  averageScore,
  totalRatings,
  ratingsSection,
  preview = false,
}: AppDetailProps) {
  const screenshotRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);

  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const [descExpanded, setDescExpanded] = useState(false);
  const [descOverflows, setDescOverflows] = useState(false);

  const tagline = (app.description ?? '').split('\n')[0];
  const previewImages = app.previewImages ?? [];
  const tags = [...new Set(app.tags ?? [])];

  useEffect(() => {
    const el = descRef.current;
    if (!el) return;
    setDescOverflows(el.scrollHeight > el.clientHeight + 1);
  }, [app.description]);

  useEffect(() => {
    if (!lightboxImg) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxImg(null);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightboxImg]);

  const showTagMeta = tags.length > 0;
  const showAuthorMeta = !!(app.author || app.userEmail);

  const card = (
    <div className="bg-black/60 backdrop-blur-lg border border-white/10 shadow-[var(--shadow-glass)] rounded-2xl overflow-hidden flex flex-col">

          {/* ── 1. Hero ── */}
          <div className="relative h-56 shrink-0">
            {previewImages[0] ? (
              <div className="absolute inset-0 overflow-hidden">
                <Image
                  fill
                  unoptimized
                  src={imgSrc(previewImages[0])}
                  alt=""
                  className="object-cover scale-125 blur-xl brightness-50"
                />
              </div>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-white/8 to-transparent" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 flex items-end gap-4 p-5">
              {app.icon && (
                <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-white/20 shrink-0 shadow-xl">
                  <Image fill unoptimized src={imgSrc(app.icon)} alt={app.title} className="object-cover" />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <h1 className="text-xl font-extrabold text-white leading-tight truncate">{app.title}</h1>
                {tagline && (
                  <p className="text-white/55 text-sm mt-0.5 truncate">{tagline}</p>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {app.url && (
                  <a
                    href={app.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white text-black text-sm font-semibold hover:bg-white/90 transition-colors"
                  >
                    <FaPlay className="w-3 h-3" /> Open 
                  </a>
                )}
                <button
                  onClick={onToggleFavorite}
                  disabled={isFavoritePending || !isLoggedIn}
                  title={
                    isLoggedIn
                      ? isFavorited ? 'Remove from favorites' : 'Save to favorites'
                      : 'Sign in to save'
                  }
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                    isFavorited
                      ? 'bg-white/15 text-white hover:bg-white/20'
                      : 'bg-white/10 border border-white/20 text-white hover:bg-white/15'
                  }`}
                >
                  {isFavorited ? <FaBookmark className="w-3.5 h-3.5" /> : <FiBookmark className="w-3.5 h-3.5" />}
                  {isFavorited ? 'Saved' : 'Save'}
                </button>
              </div>
            </div>
          </div>

          {/* ── 2. Meta Row ── */}
          <div className="flex items-stretch divide-x divide-white/8 border-b border-white/8">

            {/* Reviews — always visible */}
            <div className="flex-1 flex flex-col items-center justify-center gap-1 px-4 py-4">
              <span className="text-white/35 text-[10px] uppercase tracking-widest font-semibold">
                {totalRatings ?? 0} Reviews
              </span>
              <span className="text-xl font-bold text-white leading-none">
                {(averageScore ?? 0).toFixed(1)}
              </span>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }, (_, i) => (
                  <FaStar
                    key={i}
                    className={`w-2.5 h-2.5 ${i < Math.round(averageScore ?? 0) ? 'text-white' : 'text-white/20'}`}
                  />
                ))}
              </div>
            </div>

            {/* Favorites — always visible */}
            <div className="flex-1 flex flex-col items-center justify-center gap-1 px-4 py-4">
              <span className="text-white/35 text-[10px] uppercase tracking-widest font-semibold">
                Favorites
              </span>
              <span className="flex items-center gap-1.5 text-white font-bold text-xl leading-none">
                <FiBookmark className="w-4 h-4" />
                {favoritesCount ?? 0}
              </span>
              <span className="text-white/35 text-[10px]">Saved this app</span>
            </div>

            {/* Category */}
            {showTagMeta && (
              <div className="flex-1 flex flex-col items-center justify-center gap-1 px-4 py-4">
                <span className="text-white/35 text-[10px] uppercase tracking-widest font-semibold">
                  Category
                </span>
                <LuTag className="w-5 h-5 text-white/70" />
                <span className="text-white/35 text-[10px] text-center max-w-[80px] truncate">
                  {tags[0]}
                </span>
              </div>
            )}

            {/* Author */}
            {showAuthorMeta && (
              <div className="flex-1 flex flex-col items-center justify-center gap-1 px-4 py-4">
                <span className="text-white/35 text-[10px] uppercase tracking-widest font-semibold">
                  Author
                </span>
                <LuSquareUser className="w-5 h-5 text-white/70" />
                <span className="text-white/35 text-[10px] text-center max-w-[80px] truncate">
                  {app.author ?? app.userEmail?.split('@')[0]}
                </span>
              </div>
            )}

          </div>

          {/* ── 3. Screenshots Carousel ── */}
          {previewImages.length > 0 && (
            <div className="border-b border-white/8 py-5">
              <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3 px-6">
                Screenshots
              </h2>
              <div className="relative group/screenshots">
                <button
                  onClick={() => screenshotRef.current?.scrollBy({ left: -300, behavior: 'smooth' })}
                  aria-label="Scroll left"
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-10 rounded-lg p-2 bg-white/5 border border-white/10 text-white/40 hover:bg-white/10 hover:text-white/80 transition-all opacity-0 group-hover/screenshots:opacity-100"
                >
                  <FiChevronLeft className="w-4 h-4" />
                </button>

                <div
                  ref={screenshotRef}
                  className="flex gap-1 overflow-x-auto px-6 pb-1"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {previewImages.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setLightboxImg(img)}
                      className="relative shrink-0 h-44 w-72 rounded-xl overflow-hidden bg-white/5 cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                    >
                      <Image
                        fill
                        unoptimized
                        src={imgSrc(img)}
                        alt={`${app.title} screenshot ${i + 1}`}
                        className="object-cover transition-transform hover:scale-[1.02]"
                      />
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => screenshotRef.current?.scrollBy({ left: 300, behavior: 'smooth' })}
                  aria-label="Scroll right"
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-10 rounded-lg p-2 bg-white/5 border border-white/10 text-white/40 hover:bg-white/10 hover:text-white/80 transition-all opacity-0 group-hover/screenshots:opacity-100"
                >
                  <FiChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ── 4. Description ── */}
          {app.description && (
            <div className="px-6 py-5 border-b border-white/8">
              <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">
                Description
              </h2>
              <p
                ref={descRef}
                className={`text-white/70 text-sm leading-relaxed whitespace-pre-line ${!descExpanded ? 'line-clamp-5' : ''}`}
              >
                {app.description}
              </p>
              {descOverflows && (
                <button
                  onClick={() => setDescExpanded((v) => !v)}
                  className="mt-2 text-xs text-white/45 hover:text-white/70 transition-colors cursor-pointer"
                >
                  {descExpanded ? 'Show less' : 'Read more'}
                </button>
              )}
            </div>
          )}

          {/* ── 5. Ratings ── */}
          {ratingsSection}

          {/* ── 6. Tags ── */}
          {tags.length > 0 && (
            <div className="px-6 py-5">
              <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">
                Tags
              </h2>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/8 text-white/60 border border-white/10"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

    </div>
  );

  const lightbox = lightboxImg ? (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center"
      onClick={() => setLightboxImg(null)}
    >
      <div className="relative" onClick={(e) => e.stopPropagation()}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imgSrc(lightboxImg)}
          alt="Screenshot preview"
          style={{ maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain' }}
          className="rounded-xl shadow-2xl"
        />
        <button
          onClick={() => setLightboxImg(null)}
          aria-label="Close preview"
          className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 hover:bg-black/80 border border-white/10 text-white/60 hover:text-white transition-colors"
        >
          <FiX className="w-4 h-4" />
        </button>
      </div>
    </div>
  ) : null;

  if (preview) {
    return (
      <>
        {card}
        {lightbox}
      </>
    );
  }

  return (
    <>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {card}
      </div>
      {lightbox}
    </>
  );
}
