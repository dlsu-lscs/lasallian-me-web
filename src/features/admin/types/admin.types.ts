import { Application } from '@/features/apps/types/app.types';

export type AdminTab = 'apps' | 'approval';

export type AdminApplication = Application & {
  userId: string;
  userEmail: string;
  isApproved: 'PENDING' | 'APPROVED' | 'REJECTED' | 'REMOVED';
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
