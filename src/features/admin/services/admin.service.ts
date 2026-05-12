import { Application, ApplicationsListResponse } from '@/features/apps/types/app.types';

const BASE = `${process.env.NEXT_PUBLIC_API_URL}/api/applications`;

export type AdminApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'REMOVED';

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

export async function rejectApplication(id: number, reason: string): Promise<void> {
  const response = await fetch(`${BASE}/admin/${id}/review`, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'REJECTED', rejectionReason: reason }),
  });

  if (!response.ok) {
    throw new Error('Failed to reject application');
  }
}

export async function removeApplication(id: number, reason: string): Promise<void> {
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
