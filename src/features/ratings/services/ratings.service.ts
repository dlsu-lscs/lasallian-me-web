import type { ApplicationRatings, CreateRatingPayload, Rating } from '../types/rating.types';

const base = () => `${process.env.NEXT_PUBLIC_API_URL}/api/applications`;

export async function getApplicationRatings(slug: string): Promise<ApplicationRatings> {
  const response = await fetch(`${base()}/${encodeURIComponent(slug)}/ratings`);
  if (!response.ok) throw new Error(`Failed to fetch ratings: ${response.statusText}`);
  return response.json();
}

export async function createRating(slug: string, payload: CreateRatingPayload): Promise<Rating> {
  const response = await fetch(`${base()}/${encodeURIComponent(slug)}/ratings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(`Failed to create rating: ${response.statusText}`);
  return response.json();
}

export async function patchRating(slug: string, payload: Partial<CreateRatingPayload>): Promise<Rating> {
  const response = await fetch(`${base()}/${encodeURIComponent(slug)}/ratings`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(`Failed to update rating: ${response.statusText}`);
  return response.json();
}

export async function deleteRating(slug: string): Promise<Rating> {
  const response = await fetch(`${base()}/${encodeURIComponent(slug)}/ratings`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) throw new Error(`Failed to delete rating: ${response.statusText}`);
  return response.json();
}
