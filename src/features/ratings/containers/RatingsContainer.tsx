'use client';

import React, { useState, useEffect } from 'react';
import { authClient } from '@/lib/auth-client';
import { RatingForm } from '../components/RatingForm';
import { ReviewItem } from '../components/ReviewItem';
import { StarRating } from '../components/StarRating';
import {
  useApplicationRatingsQuery,
  useCreateRatingMutation,
  useDeleteRatingMutation,
  usePatchRatingMutation,
} from '../queries/ratings.queries';
import type { CreateRatingPayload } from '../types/rating.types';
import Link from 'next/link';

interface RatingsContainerProps {
  slug: string;
}

export function RatingsContainer({ slug }: RatingsContainerProps) {
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const { data: ratingsData, isLoading: ratingsLoading } = useApplicationRatingsQuery(slug);
  const createMutation = useCreateRatingMutation(slug);
  const patchMutation = usePatchRatingMutation(slug);
  const deleteMutation = useDeleteRatingMutation(slug);

  const [isEditing, setIsEditing] = useState(false);
  const [anonCache, setAnonCache] = useState<Pick<CreateRatingPayload, 'score' | 'comment' | 'isAnonymous'> | null>(null);

  const anonKey = `anon-rated-${slug}`;

  useEffect(() => {
    const stored = localStorage.getItem(anonKey);
    if (stored) setAnonCache(JSON.parse(stored));
  }, [anonKey]);

  const currentUserEmail = session?.user?.email;
  const emailRating = ratingsData?.ratings.find(
    (r) => r.userEmail !== null && r.userEmail === currentUserEmail,
  );
  const userRating = emailRating ?? (anonCache
    ? { score: anonCache.score, comment: anonCache.comment ?? null, isAnonymous: true, userEmail: null, applicationId: ratingsData?.ratings[0]?.applicationId ?? 0 }
    : undefined);

  const handleCreate = (payload: CreateRatingPayload) => {
    createMutation.mutate(payload, {
      onSuccess: () => {
        if (payload.isAnonymous) {
          const cached = { score: payload.score, comment: payload.comment ?? null, isAnonymous: true };
          localStorage.setItem(anonKey, JSON.stringify(cached));
          setAnonCache(cached);
        }
      },
    });
  };

  const handlePatch = (payload: CreateRatingPayload) => {
    patchMutation.mutate(payload, {
      onSuccess: () => {
        setIsEditing(false);
        if (payload.isAnonymous) {
          const cached = { score: payload.score, comment: payload.comment ?? null, isAnonymous: true };
          localStorage.setItem(anonKey, JSON.stringify(cached));
          setAnonCache(cached);
        } else {
          localStorage.removeItem(anonKey);
          setAnonCache(null);
        }
      },
    });
  };

  const handleDelete = () => {
    deleteMutation.mutate(undefined, {
      onSuccess: () => {
        localStorage.removeItem(anonKey);
        setAnonCache(null);
      },
    });
  };

  const anonRatingIndex = (!emailRating && anonCache)
    ? (ratingsData?.ratings.findIndex((r) =>
        r.isAnonymous &&
        r.userEmail === null &&
        r.score === anonCache.score &&
        r.comment === (anonCache.comment ?? null)
      ) ?? -1)
    : -1;

  const otherRatings = (ratingsData?.ratings ?? []).filter((r, i) => {
    if (i === anonRatingIndex) return false;
    return r.userEmail !== currentUserEmail;
  });

  return (
    <div className="lg:col-span-1 flex flex-col gap-4">

      {/* Leave / edit review card */}
      <div className="bg-black/60 backdrop-blur-lg border border-white/10 shadow-[var(--shadow-glass)] rounded-2xl p-6">
        {sessionLoading ? (
          <div className="h-24 bg-white/5 rounded-xl animate-pulse" />
        ) : !session ? (
          <>
            <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">Leave a Review</p>
            <p className="text-sm text-white/50">
              <Link href="/login" className="text-white/80 underline hover:text-white transition-colors">Sign in</Link> to leave a review.
            </p>
          </>
        ) : userRating && !isEditing ? (
          <>
            <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">Your Review</p>
            <StarRating value={userRating.score} />
            {userRating.comment && (
              <p className="text-sm text-white/60 mt-2 leading-relaxed">{userRating.comment}</p>
            )}
            <p className="text-xs text-white/30 mt-1">
              {userRating.isAnonymous ? 'Posted anonymously' : userRating.userEmail}
            </p>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setIsEditing(true)}
                className="px-3 py-1 text-xs font-semibold rounded-full bg-white/8 text-white/70 hover:bg-white/12 hover:text-white transition-colors cursor-pointer"
              >
                Edit
              </button>
              <button
                disabled={deleteMutation.isPending}
                onClick={handleDelete}
                className="px-3 py-1 text-xs font-semibold rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer disabled:opacity-40"
              >
                {deleteMutation.isPending ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">
              {isEditing ? 'Edit Your Review' : 'Leave a Review'}
            </p>
            <RatingForm
              onSubmit={isEditing ? handlePatch : handleCreate}
              onCancel={isEditing ? () => setIsEditing(false) : undefined}
              initialValues={isEditing && userRating ? {
                score: userRating.score,
                comment: userRating.comment,
                isAnonymous: userRating.isAnonymous,
              } : undefined}
              isPending={createMutation.isPending || patchMutation.isPending}
              isEditMode={isEditing}
            />
          </>
        )}
      </div>

      {/* Reviews list card */}
      <div className="bg-black/60 backdrop-blur-lg border border-white/10 shadow-[var(--shadow-glass)] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-semibold text-white/40 uppercase tracking-widest">Reviews</p>
          {ratingsData && ratingsData.total > 0 && (
            <div className="flex items-center gap-2 text-sm text-white/40">
              <StarRating value={Math.round(ratingsData.averageScore)} size="sm" />
              <span className="text-xs">{ratingsData.averageScore.toFixed(1)} ({ratingsData.total})</span>
            </div>
          )}
        </div>

        {ratingsLoading ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-14 bg-white/5 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : !ratingsData || ratingsData.total === 0 ? (
          <p className="text-sm text-white/30">No reviews yet. Be the first!</p>
        ) : (
          <div className="flex flex-col divide-y divide-white/8">
            {userRating && (
              <ReviewItem rating={{ ...userRating, userEmail: userRating.isAnonymous ? null : `${userRating.userEmail} (you)` }} />
            )}
            {otherRatings.map((rating, i) => (
              <ReviewItem key={i} rating={rating} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
