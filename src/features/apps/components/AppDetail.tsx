import React from 'react';
import { Application } from '../types/app.types';
import { FiBookmark, FiExternalLink } from 'react-icons/fi';
import { FaBookmark } from 'react-icons/fa';
import { FaStar } from 'react-icons/fa';
import { ImageGallery } from './ImageGallery';

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
}: AppDetailProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Left column — main app info */}
        <div className="lg:col-span-2 bg-black/60 backdrop-blur-lg border border-white/10 shadow-[var(--shadow-glass)] rounded-2xl p-6 flex flex-col gap-6">

          <ImageGallery images={app.previewImages} title={app.title} />

          {/* Title + author + stats */}
          <div className="flex flex-col gap-2">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <h1 className="text-3xl font-extrabold text-white leading-tight">{app.title}</h1>

              {/* Save button */}
              <button
                onClick={onToggleFavorite}
                disabled={isFavoritePending || !isLoggedIn}
                title={isLoggedIn ? (isFavorited ? 'Remove from favorites' : 'Save to favorites') : 'Sign in to save'}
                className={`px-4 py-1.5 cursor-pointer rounded-full text-sm font-semibold transition-colors shrink-0 disabled:opacity-40 disabled:cursor-not-allowed ${
                  isFavorited
                    ? 'bg-black/50 text-white hover:bg-white/10'
                    : 'bg-white text-black hover:bg-white/80'
                }`}
              >
                {isFavorited ? (
                  <span className="flex items-center gap-1.5"><FaBookmark className="w-3.5 h-3.5" /> Saved</span>
                ) : (
                  <span className="flex items-center gap-1.5"><FiBookmark className="w-3.5 h-3.5" /> Save</span>
                )}
              </button>
            </div>

            <p className="text-white/45 text-sm">
              By <span className="text-white/65 font-semibold">{app.userEmail?.split('@')[0] ?? 'Unknown'}</span>
            </p>

            {/* Stats row */}
            <div className="flex items-center gap-4 flex-wrap">
              {favoritesCount !== undefined && (
                <span className="flex items-center gap-1.5 text-white/40 text-sm">
                  <FiBookmark className="w-3.5 h-3.5" />
                  {favoritesCount} {favoritesCount === 1 ? 'save' : 'saves'}
                </span>
              )}
              {averageScore !== undefined && totalRatings !== undefined && totalRatings > 0 && (
                <span className="flex items-center gap-1.5 text-white/40 text-sm">
                  <FaStar className="w-3.5 h-3.5" />
                  {averageScore.toFixed(1)} <span className="text-white/25">({totalRatings})</span>
                </span>
              )}
            </div>
          </div>

          <div className="border-t border-white/8" />

          {/* About */}
          <section className="flex flex-col gap-2">
            <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest">About</h2>
            <p className="text-white/70 leading-relaxed text-sm">{app.description ?? 'No description provided.'}</p>
          </section>

          <div className="border-t border-white/8" />

          {/* Links */}
          <section className="flex flex-col gap-2">
            <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest">Links</h2>
            {app.url ? (
              <a
                href={app.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm break-all group"
              >
                <FiExternalLink className="w-4 h-4 shrink-0 text-white/40 group-hover:text-white/70 transition-colors" />
                {app.url}
              </a>
            ) : (
              <p className="text-white/30 text-sm">No links provided.</p>
            )}
          </section>

          {(app.tags ?? []).length > 0 && (
            <>
              <div className="border-t border-white/8" />
              <section className="flex flex-col gap-2">
                <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {[...new Set(app.tags ?? [])].map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/8 text-white/60 border border-white/10"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </section>
            </>
          )}
        </div>

        {/* Right column — ratings */}
        {ratingsSection}
      </div>
    </div>
  );
}
