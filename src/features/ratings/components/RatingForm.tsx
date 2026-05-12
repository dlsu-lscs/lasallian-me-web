'use client';

import React, { useState } from 'react';
import type { CreateRatingPayload } from '../types/rating.types';
import { StarRating } from './StarRating';

interface RatingFormProps {
  onSubmit: (payload: CreateRatingPayload) => void;
  onCancel?: () => void;
  initialValues?: Partial<CreateRatingPayload>;
  isPending: boolean;
  isEditMode?: boolean;
}

export function RatingForm({ onSubmit, onCancel, initialValues, isPending, isEditMode = false }: RatingFormProps) {
  const [score, setScore] = useState(initialValues?.score ?? 0);
  const [comment, setComment] = useState(initialValues?.comment ?? '');
  const [isAnonymous, setIsAnonymous] = useState(initialValues?.isAnonymous ?? false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (score === 0) return;
    onSubmit({ score, comment: comment.trim() || null, isAnonymous });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div>
        <StarRating value={score} interactive onChange={setScore} />
        {score === 0 && <p className="text-xs text-red-400 mt-1">Please select a score</p>}
      </div>

      <textarea
        value={comment as string}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your thoughts (optional)"
        rows={3}
        maxLength={255}
        className="w-full px-3 py-2 text-sm bg-black/40 border border-white/10 rounded-lg resize-none text-white/80 placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 transition-colors"
      />

      <label className="flex items-center gap-2 text-sm text-white/50 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={isAnonymous}
          onChange={(e) => setIsAnonymous(e.target.checked)}
          className="rounded border-white/20 bg-black/40 accent-white"
        />
        Post anonymously
      </label>

      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          disabled={isPending || score === 0}
          className="flex-1 px-4 py-2 rounded-full text-sm font-semibold bg-white text-black hover:bg-white/80 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isPending ? 'Submitting…' : isEditMode ? 'Update' : 'Submit'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isPending}
            className="px-4 py-2 rounded-full text-sm font-semibold bg-white/8 text-white/60 hover:bg-white/12 transition-colors cursor-pointer disabled:opacity-40"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
