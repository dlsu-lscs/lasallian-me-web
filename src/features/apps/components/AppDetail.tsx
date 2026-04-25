import React from 'react';
import { Application } from '../types/app.types';
import { FiBookmark } from 'react-icons/fi';
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
              {app.previewImages[0] ? (
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

          {/* Main Content Tabs/Sections */}
          <div className="border-b border-gray-200 mb-6 mt-6">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {['Description', 'Tags', 'How to use?', 'Links'].map((item) => (
                <a
                  key={item}
                  href="#"
                  className={`
                    ${item === 'Description' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                    whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm
                  `}
                  aria-current={item === 'Description' ? 'page' : undefined}
                >
                  {item}
                </a>
              ))}
            </nav>
          </div>

          {/* Description Content */}
          <div className="prose max-w-none text-gray-700">
            <h2 className="text-2xl font-bold mb-3">Description</h2>
            <p className="mb-4">{app.description}</p>
          </div>

        </div>

        {ratingsSection}
      </div>
    </div>
  );
}
