import { Application, ApplicationsListResponse } from '../types/app.types';

interface GetApplicationsParams {
  search?: string;
  tags?: string[];
  userId?: string;
  page?: number;
  limit?: number;
}

export async function getApplications(params: GetApplicationsParams = {}): Promise<ApplicationsListResponse> {
  const parts: string[] = [];

  if (params.search) parts.push(`search=${encodeURIComponent(params.search)}`);
  if (params.tags && params.tags.length > 0) {
    params.tags.forEach((tag) => {
      parts.push(`tags=${encodeURIComponent(tag)}`);
      parts.push(`tags=${encodeURIComponent(tag)}`);
    });
  }
  if (params.userId) parts.push(`userId=${encodeURIComponent(params.userId)}`);
  if (params.page) parts.push(`page=${params.page}`);
  if (params.limit) parts.push(`limit=${params.limit}`);

  const base = `${process.env.NEXT_PUBLIC_API_URL}/api/applications`;
  const finalUrl = parts.length ? `${base}?${parts.join('&')}` : base;
  const response = await fetch(finalUrl);

  if (!response.ok) {
    throw new Error(`Failed to fetch applications: ${response.statusText}`);
  }

  return response.json();
}

export async function getApplicationFavoritesCount(
  applicationId: number,
): Promise<{ applicationId: number; count: number }> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/favorites/applications/${applicationId}/count`,
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch favorites count: ${response.statusText}`);
  }

  return response.json();
}

export async function updateApplication(
  id: number,
  updates: Partial<Pick<Application, 'title' | 'slug' | 'description' | 'url' | 'tags' | 'previewImages'>>,
): Promise<Application> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/applications/${id}`,
    {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to update application: ${response.statusText}`);
  }

  return response.json();
}

export async function deleteApplication(id: number): Promise<void> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/applications/${id}`,
    { method: 'DELETE', credentials: 'include' },
  );

  if (!response.ok) {
    throw new Error(`Failed to delete application: ${response.statusText}`);
  }
}

export async function getApplicationBySlug(slug: string): Promise<Application> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/applications/${encodeURIComponent(slug)}`,
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch application: ${response.statusText}`);
  }

  return response.json();
}
