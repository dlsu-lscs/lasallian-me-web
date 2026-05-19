'use client';

import React, { useState, useEffect, useRef } from 'react';
import { authClient } from '@/lib/auth-client';
import { StarRating } from '../components/StarRating';
import { FiChevronLeft, FiChevronRight, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import {
  useApplicationRatingsQuery,
  useCreateRatingMutation,
  useDeleteRatingMutation,
  usePatchRatingMutation,
} from '../queries/ratings.queries';
import type { CreateRatingPayload, Rating } from '../types/rating.types';
import Link from 'next/link';

interface RatingsContainerProps {
  slug: string;
}

// ── Shared helpers ────────────────────────────────────────────────────────────

function Stars({
  score,
  size = 'sm',
  variant = 'gold',
}: {
  score: number;
  size?: 'xs' | 'sm' | 'md';
  variant?: 'gold' | 'white';
}) {
  const cls = size === 'xs' ? 'w-2 h-2' : size === 'sm' ? 'w-2.5 h-2.5' : 'w-3.5 h-3.5';
  const filled = variant === 'white' ? 'text-white' : 'text-amber-500';
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <FaStar key={i} className={`${cls} ${i < score ? filled : 'text-white/15'}`} />
      ))}
    </div>
  );
}

function CarouselBtn({
  direction,
  onClick,
}: {
  direction: 'left' | 'right';
  onClick: () => void;
}) {
  const Icon = direction === 'left' ? FiChevronLeft : FiChevronRight;
  const pos = direction === 'left' ? 'left-3' : 'right-3';
  return (
    <button
      onClick={onClick}
      aria-label={direction === 'left' ? 'Scroll left' : 'Scroll right'}
      className={`absolute ${pos} top-1/2 -translate-y-1/2 z-10 rounded-lg p-2 bg-white/5 border border-white/10 text-white/35 hover:bg-white/10 hover:text-white/70 transition-all opacity-0 group-hover/reviews:opacity-100`}
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}

// ── Share button with copy tooltip ───────────────────────────────────────────

function ShareButton() {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="underline underline-offset-2 hover:text-white/35 transition-colors cursor-pointer"
    >
      {copied ? 'Link copied!' : 'Share this app'}
    </button>
  );
}

// ── Full review dialog ────────────────────────────────────────────────────────

type DialogData = {
  displayName: string;
  score: number;
  comment: string;
};

function ReviewDialog({ data, onClose }: { data: DialogData; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-black/90 border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl backdrop-blur-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <p className="text-sm font-semibold text-white/80">{data.displayName}</p>
            <div className="mt-1.5">
              <Stars score={data.score} />
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-white/40 hover:text-white/70 transition-colors shrink-0"
          >
            <FiX className="w-3.5 h-3.5" />
          </button>
        </div>
        <p className="text-white/60 text-sm leading-relaxed">{data.comment}</p>
      </div>
    </div>
  );
}

// ── Regular review card (4:3) ─────────────────────────────────────────────────

function ReviewCard({
  rating,
  onReadMore,
}: {
  rating: Rating;
  onReadMore: (data: DialogData) => void;
}) {
  const displayName =
    rating.isAnonymous || (!rating.userName && !rating.userEmail)
      ? 'Anonymous'
      : (rating.userName ?? rating.userEmail!);

  const hasMore = (rating.comment?.length ?? 0) > 80;

  return (
    <div className="shrink-0 w-72 aspect-[4/3] bg-black/50 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-col overflow-hidden">
      {/* Header: stars (top, bigger, white) then name below */}
      <div className="flex items-start gap-2.5 shrink-0">
        <div className="w-7 h-7 rounded-full bg-white/8 border border-white/10 flex items-center justify-center text-white/50 text-xs font-bold shrink-0 select-none">
          {displayName[0].toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <Stars score={rating.score} size="md" variant="white" />
          <p className="text-xs text-white/40 truncate leading-tight mt-1">{displayName}</p>
        </div>
      </div>

      {/* Comment */}
      <p className="text-white/50 text-sm leading-relaxed line-clamp-3 mt-3 flex-1 min-h-0">
        {rating.comment ?? <span className="italic text-white/20">No comment</span>}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-end pt-2 mt-1 border-t border-white/6 shrink-0">
        {hasMore && (
          <button
            onClick={() =>
              onReadMore({ displayName, score: rating.score, comment: rating.comment! })
            }
            className="text-[10px] text-white/30 hover:text-white/60 transition-colors cursor-pointer"
          >
            Read more
          </button>
        )}
      </div>
    </div>
  );
}

// ── Your review card (4:3) ────────────────────────────────────────────────────

function YourReviewCard({
  rating,
  onEdit,
  onDelete,
  isDeleting,
}: {
  rating: Pick<Rating, 'score' | 'comment' | 'isAnonymous' | 'userEmail'>;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}) {
  const displayName = rating.isAnonymous ? 'Anonymous' : (rating.userEmail ?? 'You');
  const initial = displayName[0].toUpperCase();

  return (
    <div className="shrink-0 w-72 aspect-[4/3] bg-black/50 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-col overflow-hidden">
      {/* Header — same layout as ReviewCard */}
      <div className="flex items-start gap-2.5 shrink-0">
        <div className="w-7 h-7 rounded-full bg-white/8 border border-white/10 flex items-center justify-center text-white/50 text-xs font-bold shrink-0 select-none">
          {initial}
        </div>
        <div className="min-w-0 flex-1">
          <Stars score={rating.score} size="md" variant="white" />
          <p className="text-xs text-white/40 truncate leading-tight mt-1">{displayName}</p>
        </div>
      </div>

      {/* Comment */}
      <p className="text-white/50 text-sm leading-relaxed line-clamp-3 mt-3 flex-1 min-h-0">
        {rating.comment ?? <span className="italic text-white/20">No comment</span>}
      </p>

      {/* Footer — chip + action icons, no border */}
      <div className="flex items-center justify-between mt-auto pt-1 shrink-0">
        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-white/6 border border-white/8 text-[9px] uppercase tracking-widest font-semibold text-white/25">
          Your Review
        </span>
        <div className="flex items-center gap-0.5">
          <button
            onClick={onEdit}
            title="Edit review"
            className="p-1.5 rounded-lg hover:bg-white/8 text-white/30 hover:text-white/65 transition-colors cursor-pointer"
          >
            <FiEdit2 className="w-3 h-3" />
          </button>
          <button
            onClick={onDelete}
            disabled={isDeleting}
            title="Delete review"
            className="p-1.5 rounded-lg hover:bg-red-500/15 text-white/30 hover:text-red-400 transition-colors cursor-pointer disabled:opacity-40"
          >
            <FiTrash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Leave / edit review card ──────────────────────────────────────────────────

function LeaveReviewCard({
  onSubmit,
  onCancel,
  initialValues,
  isPending,
  isEditMode,
  isLoggedIn,
}: {
  onSubmit: (p: CreateRatingPayload) => void;
  onCancel?: () => void;
  initialValues?: Partial<CreateRatingPayload>;
  isPending: boolean;
  isEditMode: boolean;
  isLoggedIn: boolean;
}) {
  const [score, setScore] = useState(initialValues?.score ?? 0);
  const [comment, setComment] = useState<string>(initialValues?.comment ?? '');
  const [isAnonymous, setIsAnonymous] = useState(initialValues?.isAnonymous ?? false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (score === 0) return;
    onSubmit({ score, comment: comment.trim() || null, isAnonymous });
  };

  return (
    <div className="shrink-0 w-72 aspect-[4/3] bg-black/50 backdrop-blur-md border border-white/10 rounded-2xl flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-3.5 pb-3 flex items-center gap-2 border-b border-white/8 shrink-0">
        <FaStar className="w-3.5 h-3.5 text-white/30 shrink-0" />
        <span className="text-xs uppercase tracking-widest font-semibold text-white/30">
          {isEditMode ? 'Edit Review' : 'Leave a Review'}
        </span>
      </div>

      {!isLoggedIn ? (
        <div className="px-4 py-4 flex-1 flex items-center">
          <p className="text-sm text-white/40 leading-relaxed">
            <Link
              href="/login"
              className="text-white/65 underline underline-offset-2 hover:text-white transition-colors"
            >
              Sign in
            </Link>{' '}
            to leave a review.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          {/* Stars — centered */}
          <div className="px-4 py-3 flex justify-center border-b border-white/8 shrink-0">
            <StarRating value={score} interactive onChange={setScore} />
            {score === 0 && (
              <span className="sr-only">Please select a score</span>
            )}
          </div>

          {/* Textarea — borderless, integrated */}
          <div className="px-4 py-2.5 flex-1 min-h-0">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts… (optional)"
              maxLength={255}
              className="w-full h-full bg-transparent resize-none text-white/65 text-sm placeholder:text-white/20 focus:outline-none leading-relaxed"
            />
          </div>

          {/* Footer */}
          <div className="px-4 pb-3.5 flex items-center justify-between gap-3 border-t border-white/8 pt-3 shrink-0">
            <label className="flex items-center gap-1.5 text-xs text-white/30 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="rounded border-white/20 bg-black/40 accent-white"
              />
              Anonymous
            </label>
            <div className="flex items-center gap-2">
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="text-[10px] text-white/35 hover:text-white/60 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={isPending || score === 0}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/90 text-black hover:bg-white transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isPending ? '…' : isEditMode ? 'Update' : 'Submit'}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

// ── Main container ────────────────────────────────────────────────────────────

export function RatingsContainer({ slug }: RatingsContainerProps) {
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const { data: ratingsData, isLoading: ratingsLoading } = useApplicationRatingsQuery(slug);
  const createMutation = useCreateRatingMutation(slug);
  const patchMutation = usePatchRatingMutation(slug);
  const deleteMutation = useDeleteRatingMutation(slug);
  const reviewsRef = useRef<HTMLDivElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [dialogData, setDialogData] = useState<DialogData | null>(null);
  const [anonCache, setAnonCache] = useState<Pick<
    CreateRatingPayload,
    'score' | 'comment' | 'isAnonymous'
  > | null>(null);

  const anonKey = `anon-rated-${slug}`;

  useEffect(() => {
    const stored = localStorage.getItem(anonKey);
    if (stored) setAnonCache(JSON.parse(stored));
  }, [anonKey]);

  const isLoggedIn = !!session;
  const currentUserEmail = session?.user?.email;

  const emailRating = ratingsData?.ratings.find(
    (r) => r.userEmail !== null && r.userEmail === currentUserEmail,
  );
  const userRating = emailRating ?? (anonCache
    ? {
        score: anonCache.score,
        comment: anonCache.comment ?? null,
        isAnonymous: true,
        userEmail: null,
        userName: null,
        applicationId: ratingsData?.ratings[0]?.applicationId ?? 0,
      }
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

  const anonRatingIndex = !emailRating && anonCache
    ? (ratingsData?.ratings.findIndex(
        (r) =>
          r.isAnonymous &&
          r.userEmail === null &&
          r.score === anonCache.score &&
          r.comment === (anonCache.comment ?? null),
      ) ?? -1)
    : -1;

  const otherRatings = (ratingsData?.ratings ?? []).filter((r, i) => {
    if (i === anonRatingIndex) return false;
    return r.userEmail !== currentUserEmail;
  });

  const showYourReview = !sessionLoading && isLoggedIn && !!userRating && !isEditing;
  const showForm = !sessionLoading && (!isLoggedIn || !userRating || isEditing);

  return (
    <>
      <div className="border-t border-white/8 py-5">
        {/* Header */}
        <div className="px-6 mb-4 flex flex-col gap-1">
          <div className="flex items-center gap-1">
            {ratingsData && ratingsData.total > 0 && (
              <span className="text-xs font-semibold text-white/40 uppercase tracking-widest">
                {ratingsData.total}
              </span>
            )}
            <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest">
              Ratings &amp; Reviews
            </h2>
          </div>
          {ratingsData && ratingsData.total > 0 && (
            <div className="flex items-center gap-1.5">
              <Stars score={Math.round(ratingsData.averageScore)} variant="white" />
              <span className="text-xs text-white/30">{ratingsData.averageScore.toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* Carousel */}
        {ratingsLoading || sessionLoading ? (
          <div className="flex gap-3 px-6 overflow-hidden">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="shrink-0 w-72 aspect-[4/3] bg-white/4 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="relative group/reviews">
            <CarouselBtn
              direction="left"
              onClick={() => reviewsRef.current?.scrollBy({ left: -280, behavior: 'smooth' })}
            />

            <div
              ref={reviewsRef}
              className="flex gap-1 overflow-x-auto px-6 pb-1 items-start"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {/* Action card — always first */}
              {showYourReview && userRating && (
                <YourReviewCard
                  rating={userRating}
                  onEdit={() => setIsEditing(true)}
                  onDelete={handleDelete}
                  isDeleting={deleteMutation.isPending}
                />
              )}
              {showForm && (
                <LeaveReviewCard
                  isLoggedIn={isLoggedIn}
                  isEditMode={isEditing}
                  onSubmit={isEditing ? handlePatch : handleCreate}
                  onCancel={isEditing ? () => setIsEditing(false) : undefined}
                  initialValues={
                    isEditing && userRating
                      ? { score: userRating.score, comment: userRating.comment, isAnonymous: userRating.isAnonymous }
                      : undefined
                  }
                  isPending={createMutation.isPending || patchMutation.isPending}
                />
              )}

              {/* Other reviews */}
              {otherRatings.map((r, i) => (
                <ReviewCard key={i} rating={r} onReadMore={setDialogData} />
              ))}

              {/* Empty state — shown whenever there are no other reviews */}
              {otherRatings.length === 0 && (
                <div className="flex-1 self-stretch flex flex-col items-center justify-center gap-2.5 text-center px-6">
                  <FaStar className="w-8 h-8 text-white/8" />
                  {userRating ? (
                    <>
                      <p className="text-sm text-white/35 font-medium">You&apos;re the first to review!</p>
                      <p className="text-xs text-white/20 leading-relaxed">
                        <ShareButton />{' '}to see more reviews!
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-white/35 font-medium">No reviews yet.</p>
                      <p className="text-xs text-white/20">Be the first to share your thoughts!</p>
                    </>
                  )}
                </div>
              )}
            </div>

            <CarouselBtn
              direction="right"
              onClick={() => reviewsRef.current?.scrollBy({ left: 280, behavior: 'smooth' })}
            />
          </div>
        )}
      </div>

      {/* Full review dialog */}
      {dialogData && (
        <ReviewDialog data={dialogData} onClose={() => setDialogData(null)} />
      )}
    </>
  );
}
