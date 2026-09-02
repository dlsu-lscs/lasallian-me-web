import {
  Report,
  ReportsListResponse,
  ReportStatus,
  ReportTargetType,
  UpdateReportPayload,
  CreateReportPayload,
} from '../types/report.types';

const BASE = `${process.env.NEXT_PUBLIC_API_URL}/api/reports`;

export interface GetAdminReportsParams {
  page?: number;
  limit?: number;
  status?: ReportStatus;
  targetType?: ReportTargetType;
}

export async function getAdminReports(
  params: GetAdminReportsParams = {},
): Promise<ReportsListResponse> {
  const query = new URLSearchParams();
  if (params.page) query.set('page', String(params.page));
  if (params.limit) query.set('limit', String(params.limit));
  if (params.status) query.set('status', params.status);
  if (params.targetType) query.set('targetType', params.targetType);

  const response = await fetch(`${BASE}/admin?${query}`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch reports');
  }

  return response.json();
}

export async function updateAdminReport(
  id: number,
  payload: UpdateReportPayload,
): Promise<Report> {
  const response = await fetch(`${BASE}/admin/${id}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody?.message ?? 'Failed to update report');
  }

  return response.json();
}

/**
 * Submits a new user report for an application or review.
 * @param payload Object containing the target, reason, and optional description.
 * @returns The created Report object returned by the API.
 */
export async function createReport(
  payload: CreateReportPayload,
): Promise<Report> {
  const response = await fetch(BASE, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody?.message ?? 'Failed to submit report');
  }

  return response.json();
}