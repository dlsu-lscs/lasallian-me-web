import { Application, ApplicationsListResponse } from '@/features/apps/types/app.types';

const BASE = `${process.env.NEXT_PUBLIC_API_URL}/api/admin`;

export async function getPendingApplications(
  page = 1,
  limit = 20,
  status = 'pending',
): Promise<ApplicationsListResponse> {
  const response = await fetch(
    `${BASE}/applications?status=${status}&page=${page}&limit=${limit}`,
    { credentials: 'include' },
  );

  if (!response.ok) {
    throw new Error('Failed to fetch pending applications');
  }

  return response.json();
}

export async function approveApplication(id: number): Promise<Application> {
  const response = await fetch(`${BASE}/applications/${id}/approve`, {
    method: 'PATCH',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to approve application');
  }

  return response.json();
}

export async function rejectApplication(id: number, reason: string): Promise<Application> {
  const response = await fetch(`${BASE}/applications/${id}/reject`, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reason }),
  });

  if (!response.ok) {
    throw new Error('Failed to reject application');
  }

  return response.json();
}

export async function editApplication(
  id: number,
  updates: Partial<Application>,
): Promise<Application> {
  const response = await fetch(`${BASE}/applications/${id}`, {
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
