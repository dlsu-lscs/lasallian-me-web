'use client';

import React, { useState } from 'react';
import { Button } from '@/components/atoms/Button';
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
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <StarRating value={score} interactive onChange={setScore} />
        {score === 0 && <p className="text-xs text-red-500 mt-1">Please select a score</p>}
      </div>

      <textarea
        value={comment as string}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your thoughts (optional)"
        rows={3}
        maxLength={255}
        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg resize-none focus:ring-blue-500 focus:border-blue-500 mb-3"
      />

      <label className="flex items-center gap-2 text-sm text-gray-600 mb-4 cursor-pointer">
        <input
          type="checkbox"
          checked={isAnonymous}
          onChange={(e) => setIsAnonymous(e.target.checked)}
          className="rounded border-gray-300"
        />
        Post anonymously
      </label>

      <div className="flex gap-2">
        <Button type="submit" variant="primary" className="flex-1" disabled={isPending || score === 0}>
          {isPending ? 'Submitting…' : isEditMode ? 'Update' : 'Submit'}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
