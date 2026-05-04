import React from 'react';
import { Application } from '../types/app.types';
import { FiBookmark, FiExternalLink } from 'react-icons/fi';
import { FaBookmark } from 'react-icons/fa';
import { StarRating } from '@/features/ratings/components/StarRating';

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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column: App Info and Description */}
        <div className="lg:col-span-2">

          {/* Header Section */}
          <div className="flex-1 min-w-0">

            {/* App Icon/Image */}
            <div className="w-full h-48 sm:h-64 mb-6 rounded-xl bg-gray-100 overflow-hidden flex items-center justify-center">
              {app.previewImages?.[0] ? (
                <img
                  src={app.previewImages[0]}
                  alt={`${app.title} header image`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-300 text-3xl font-bold">App Image Placeholder</span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-extrabold text-gray-900">
                {app.title}
              </h1>
            </div>

            <p className="text-xl text-gray-600 mt-1">By Author Name</p>

            <div className="mt-2 flex items-center gap-4 flex-wrap">
              {/* Favorites */}
              <button
                onClick={onToggleFavorite}
                disabled={isFavoritePending || !isLoggedIn}
                title={isLoggedIn ? (isFavorited ? 'Remove from favorites' : 'Add to favorites') : 'Sign in to favorite'}
                className="flex items-center gap-1.5 text-gray-600 hover:text-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isFavorited ? (
                  <FaBookmark className="w-5 h-5 text-yellow-500" />
                ) : (
                  <FiBookmark className="w-5 h-5" />
                )}
                {favoritesCount !== undefined && (
                  <span>{favoritesCount} {favoritesCount === 1 ? 'favorite' : 'favorites'}</span>
                )}
              </button>

              {/* Average rating */}
              {averageScore !== undefined && totalRatings !== undefined && totalRatings > 0 && (
                <div className="flex items-center gap-1.5 text-gray-600">
                  <StarRating value={Math.round(averageScore)} size="sm" />
                  <span className="text-sm">{averageScore.toFixed(1)} ({totalRatings})</span>
                </div>
              )}
            </div>
          </div>

          <hr className="border-gray-100 my-6" />

          {/* Description */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">About</h2>
            <p className="text-gray-700 leading-relaxed">{app.description}</p>
          </section>

          <hr className="border-gray-100 my-6" />

          {/* Links */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Links</h2>
            {app.url ? (
              <a
                href={app.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-green-600 hover:text-blue-800 hover:underline break-all text-sm"
              >
                <FiExternalLink className="w-4 h-4 shrink-0" />
                {app.url}
              </a>
            ) : (
              <p className="text-gray-500 text-sm">No links provided.</p>
            )}
          </section>

          <hr className="border-gray-100 my-6" />

          {/* Tags */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Tags</h2>
            {app.tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {[...new Set(app.tags)].map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No tags added yet.</p>
            )}
          </section>

      

          

        </div>

        {ratingsSection}
      </div>
    </div>
  );
}
