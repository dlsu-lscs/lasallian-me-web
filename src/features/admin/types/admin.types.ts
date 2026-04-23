import { Application } from '@/features/apps/types/app.types';

export type AdminTab = 'apps' | 'approval';

export interface RejectModalState {
  isOpen: boolean;
  applicationId: number | null;
  reason: string;
}

export interface EditModalState {
  isOpen: boolean;
  application: Application | null;
}
