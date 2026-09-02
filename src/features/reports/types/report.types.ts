import type { Application } from '@/features/apps/types/app.types';
import type { Rating } from '@/features/ratings/types/rating.types';

export type ReportStatus = 'PENDING' | 'RESOLVED' | 'DISMISSED';
export type ReportTargetType = 'APPLICATION' | 'REVIEW';

/**
 * Discriminated union representing the frontend target entity for report modals.
 */
export type ReportTarget =
  | {
      type: 'APPLICATION';
      app: Application;
    }
  | {
      type: 'REVIEW';
      rating: Rating;
    };

export const REPORT_REASONS = [
  { value: 'INAPPROPRIATE', label: 'Inappropriate Content' },
  { value: 'SPAM', label: 'Spam or Advertising' },
  { value: 'HARASSMENT', label: 'Harassment or Hate Speech' },
  { value: 'BROKEN_LINK', label: 'Broken Link or Non-functional' },
  { value: 'PLAGIARISM', label: 'Plagiarism or Copyright Violation' },
  { value: 'OTHER', label: 'Other' },
] as const;

export type ReportReasonValue = (typeof REPORT_REASONS)[number]['value'];

export interface Report {
  id: number;
  targetType: ReportTargetType;
  targetId: number | string;
  applicationId?: number;
  applicationTitle?: string;
  applicationSlug?: string;
  applicationIcon?: string | null;
  reviewId?: number;
  reviewScore?: number;
  reviewComment?: string | null;
  reviewUserName?: string | null;
  reviewUserEmail?: string | null;
  reviewIsAnonymous?: boolean;
  userId: string;
  userName?: string | null;
  userEmail?: string | null;
  userImage?: string | null;
  reason: string;
  description?: string | null;
  status: ReportStatus;
  adminNotes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ReportsMeta {
  page: number;
  limit: number;
  count: number;
  total: number;
  totalPages: number;
}

export interface ReportsListResponse {
  data: Report[];
  meta: ReportsMeta;
}

export interface UpdateReportPayload {
  status?: ReportStatus;
  adminNotes?: string | null;
}

export interface CreateReportPayload {
  targetType: ReportTargetType;
  targetId: number | string;
  reason: string;
  description?: string | null;
}