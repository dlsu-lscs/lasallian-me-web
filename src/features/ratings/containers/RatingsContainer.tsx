'use client';

import React, { useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { Button } from '@/components/atoms/Button';
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

  const currentUserEmail = session?.user?.email;
  const userRating = ratingsData?.ratings.find(
    (r) => r.userEmail !== null && r.userEmail === currentUserEmail,
  );

  const handleCreate = (payload: CreateRatingPayload) => {
    createMutation.mutate(payload);
  };

  const handlePatch = (payload: CreateRatingPayload) => {
    patchMutation.mutate(payload, { onSuccess: () => setIsEditing(false) });
  };

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  const otherRatings = ratingsData?.ratings.filter(
    (r) => r.userEmail !== currentUserEmail,
  ) ?? [];

  return (
    <div className="lg:col-span-1 lg:border-l border-gray-200 lg:pl-8">

      {/* Leave a Review / Current Rating */}
      <div className="bg-white rounded-xl p-6 shadow-md mb-8 border border-gray-100">

        {sessionLoading ? (
          <div className="h-24 bg-gray-100 rounded animate-pulse" />
        ) : !session ? (
          <>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Leave a Review</h2>
            <p className="text-sm text-gray-500">
              <Link href="/login" className="text-blue-600 hover:underline">Login</Link> to leave a review.
            </p>
          </>
        ) : userRating && !isEditing ? (
          <>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Your Review</h2>
            <StarRating value={userRating.score} />
            {userRating.comment && (
              <p className="text-sm text-gray-700 mt-2">{userRating.comment}</p>
            )}
            <p className="text-xs text-gray-400 mt-1">
              {userRating.isAnonymous ? 'Posted anonymously' : userRating.userEmail}
            </p>
            <div className="flex gap-2 mt-4">
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={deleteMutation.isPending}
                onClick={handleDelete}
                className="text-red-500 border-red-300 hover:bg-red-50"
              >
                {deleteMutation.isPending ? 'Deleting…' : 'Delete'}
              </Button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {isEditing ? 'Edit Your Review' : 'Leave a Review'}
            </h2>
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

      {/* Reviews List */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Reviews</h2>
          {ratingsData && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <StarRating value={Math.round(ratingsData.averageScore)} size="sm" />
              <span>{ratingsData.averageScore.toFixed(1)} ({ratingsData.total})</span>
            </div>
          )}
        </div>

        {ratingsLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-14 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        ) : !ratingsData || ratingsData.total === 0 ? (
          <p className="text-sm text-gray-400">No reviews yet. Be the first!</p>
        ) : (
          <>
            {userRating && (
              <ReviewItem rating={{ ...userRating, userEmail: userRating.isAnonymous ? null : `${userRating.userEmail} (you)` }} />
            )}
            {otherRatings.map((rating, i) => (
              <ReviewItem key={i} rating={rating} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
