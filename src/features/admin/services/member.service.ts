import type { MembersListResponse } from '../types/admin.types';

const BASE = `${process.env.NEXT_PUBLIC_API_URL}/api/members`;

export interface GetMembersParams {
  page?: number;
  limit?: number;
  search?: string;
  banned?: 'true' | 'false';
  role?: string;
  excludeRole?: string;
  hasApps?: 'true';
  sortBy?: 'lastLogin' | 'favoritesCount' | 'totalAppCount' | 'banned';
  sortOrder?: 'asc' | 'desc';
}

export interface UserApplication {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  url: string;
  icon: string | null;
  previewImages: string[] | null;
  tags: string[] | null;
  status: 'PENDING' | 'APPROVED' | 'CHANGES_REQUESTED' | 'REMOVED';
  rejectionReason: string | null;
  createdAt: string;
}

export async function getMembers(params: GetMembersParams = {}): Promise<MembersListResponse> {
  const query = new URLSearchParams();
  if (params.page) query.set('page', String(params.page));
  if (params.limit) query.set('limit', String(params.limit));
  if (params.search) query.set('search', params.search);
  if (params.banned) query.set('banned', params.banned);
  if (params.role) query.set('role', params.role);
  if (params.excludeRole) query.set('excludeRole', params.excludeRole);
  if (params.hasApps) query.set('hasApps', params.hasApps);
  if (params.sortBy) query.set('sortBy', params.sortBy);
  if (params.sortOrder) query.set('sortOrder', params.sortOrder);

  const response = await fetch(`${BASE}?${query}`, { credentials: 'include' });

  if (!response.ok) throw new Error('Failed to fetch members');
  return response.json();
}

export async function getUserApplications(userId: string): Promise<{ data: UserApplication[] }> {
  const response = await fetch(`${BASE}/${userId}/applications`, { credentials: 'include' });
  if (!response.ok) throw new Error('Failed to fetch user applications');
  return response.json();
}

export interface UserReview {
  applicationId: number;
  applicationTitle: string;
  applicationSlug: string;
  score: number;
  comment: string | null;
  isAnonymous: boolean;
}

export async function getUserReviews(userId: string): Promise<{ data: UserReview[] }> {
  const response = await fetch(`${BASE}/${userId}/reviews`, { credentials: 'include' });
  if (!response.ok) throw new Error('Failed to fetch user reviews');
  return response.json();
}

export async function banMember(userId: string, reason: string): Promise<void> {
  const response = await fetch(`${BASE}/${userId}/ban`, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reason }),
  });
  if (!response.ok) throw new Error('Failed to ban member');
}

export async function unbanMember(userId: string): Promise<void> {
  const response = await fetch(`${BASE}/${userId}/unban`, {
    method: 'PATCH',
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to unban member');
}

export async function promoteMember(userId: string): Promise<void> {
  const response = await fetch(`${BASE}/${userId}/promote`, {
    method: 'PATCH',
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to promote member');
}

export async function demoteMember(userId: string): Promise<void> {
  const response = await fetch(`${BASE}/${userId}/demote`, {
    method: 'PATCH',
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to demote member');
}
