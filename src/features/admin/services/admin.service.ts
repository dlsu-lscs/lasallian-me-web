import {
  Application,
  ApplicationsListResponse,
} from '@/features/apps/types/app.types';
import type {
  ClaimRequestsListResponse,
  ClaimRequestStatus,
} from '../types/admin.types';

const BASE = `${process.env.NEXT_PUBLIC_API_URL}/api/applications`;

export type AdminApplicationStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'CHANGES_REQUESTED'
  | 'REMOVED';

export async function getAdminApplications(
  page = 1,
  limit = 20,
  status: AdminApplicationStatus = 'PENDING',
): Promise<ApplicationsListResponse> {
  const response = await fetch(
    `${BASE}/admin?status=${status}&page=${page}&limit=${limit}`,
    { credentials: 'include' },
  );

  if (!response.ok) {
    throw new Error('Failed to fetch applications');
  }

  return response.json();
}

export async function approveApplication(id: number): Promise<void> {
  const response = await fetch(`${BASE}/admin/${id}/review`, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'APPROVED' }),
  });

  if (!response.ok) {
    throw new Error('Failed to approve application');
  }
}

export async function requestChanges(
  id: number,
  reason: string,
): Promise<void> {
  const response = await fetch(`${BASE}/admin/${id}/review`, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      status: 'CHANGES_REQUESTED',
      rejectionReason: reason,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to request changes for application');
  }
}

export async function removeApplication(
  id: number,
  reason: string,
): Promise<void> {
  const response = await fetch(`${BASE}/admin/${id}/review`, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'REMOVED', rejectionReason: reason }),
  });

  if (!response.ok) {
    throw new Error('Failed to remove application');
  }
}

export async function editApplication(
  id: number,
  updates: Partial<Application>,
): Promise<Application> {
  const response = await fetch(`${BASE}/${id}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error('Failed to update application');
  }

  return response.json();
}

export async function setApplicationUnclaimed(
  id: number,
  unclaimed: boolean,
): Promise<void> {
  const response = await fetch(`${BASE}/admin/${id}/unclaimed`, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ unclaimed }),
  });

  if (!response.ok) {
    throw new Error('Failed to update unclaimed status');
  }
}

export async function getAdminClaimRequests(
  page = 1,
  limit = 20,
  status?: ClaimRequestStatus,
): Promise<ClaimRequestsListResponse> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (status) params.set('status', status);

  const response = await fetch(`${BASE}/admin/claims?${params}`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch claim requests');
  }

  return response.json();
}

export async function reviewClaimRequest(
  id: number,
  status: 'APPROVED' | 'DECLINED',
  adminNote?: string,
): Promise<void> {
  const response = await fetch(`${BASE}/admin/claims/${id}/review`, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, adminNote }),
  });

  if (!response.ok) {
    throw new Error(`Failed to ${status.toLowerCase()} claim request`);
  }
}
