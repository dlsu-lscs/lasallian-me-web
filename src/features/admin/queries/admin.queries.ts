import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Application } from '@/features/apps/types/app.types';
import {
  getAdminApplications,
  approveApplication,
  rejectApplication,
  removeApplication,
  editApplication,
  type AdminApplicationStatus,
} from '../services/admin.service';

export function useAdminApplicationsQuery(page = 1, status: AdminApplicationStatus = 'PENDING') {
  return useQuery({
    queryKey: ['admin', 'applications', status, page],
    queryFn: () => getAdminApplications(page, 20, status),
  });
}

export function useApproveApplicationMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => approveApplication(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'applications'] }),
  });
}

export function useRejectApplicationMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) =>
      rejectApplication(id, reason),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'applications'] }),
  });
}

export function useRemoveApplicationMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) =>
      removeApplication(id, reason),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'applications'] }),
  });
}

export function useEditApplicationMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: Partial<Application> }) =>
      editApplication(id, updates),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'applications'] }),
  });
}
