import { Application, ApplicationsListResponse } from '../types/app.types';

interface GetApplicationsParams {
  search?: string;
  tags?: string[];
  page?: number;
  limit?: number;
}

export async function getApplications(params: GetApplicationsParams = {}): Promise<ApplicationsListResponse> {
  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/api/applications`);

  if (params.search) url.searchParams.set('search', params.search);
  if (params.tags && params.tags.length > 0) {
    params.tags.forEach((tag) => url.searchParams.append('tags', tag));
  }
  if (params.page) url.searchParams.set('page', String(params.page));
  if (params.limit) url.searchParams.set('limit', String(params.limit));

  const response = await fetch(url.toString());

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

export async function getApplicationBySlug(slug: string): Promise<Application> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/applications/${encodeURIComponent(slug)}`,
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch application: ${response.statusText}`);
  }

  return response.json();
}
