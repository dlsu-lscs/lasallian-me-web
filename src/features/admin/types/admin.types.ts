import { Application } from '@/features/apps/types/app.types';

export type AdminTab = 'apps' | 'members';

export type AdminApplication = Application & {
  userId: string;
  userEmail: string;
  rejectionReason: string | null;
};

export interface RejectModalState {
  isOpen: boolean;
  applicationId: number | null;
  reason: string;
}

export interface RemoveModalState {
  isOpen: boolean;
  applicationId: number | null;
  reason: string;
}

export interface EditModalState {
  isOpen: boolean;
  application: Application | null;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: string | null;
  banned: boolean | null;
  banReason: string | null;
  banExpires: string | null;
  createdAt: string;
  favoritesCount: number;
  reviewsCount: number;
  pendingCount: number;
  approvedCount: number;
  changesRequestedCount: number;
  removedCount: number;
  lastLogin: string | null;
}

export interface MembersListMeta {
  page: number;
  limit: number;
  count: number;
  total: number;
  totalPages: number;
}

export interface MembersListResponse {
  data: Member[];
  meta: MembersListMeta;
}

export interface BanModalState {
  isOpen: boolean;
  member: Member | null;
}

export interface MemberAppsModalState {
  isOpen: boolean;
  member: Member | null;
}

export interface AddAdminModalState {
  isOpen: boolean;
}

export interface MemberReviewsModalState {
  isOpen: boolean;
  member: Member | null;
}

export interface MemberReview {
  applicationId: number;
  applicationTitle: string;
  applicationSlug: string;
  score: number;
  comment: string | null;
  isAnonymous: boolean;
}
