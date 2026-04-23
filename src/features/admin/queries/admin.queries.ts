import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Application } from '@/features/apps/types/app.types';
import {
  getPendingApplications,
  approveApplication,
  rejectApplication,
  editApplication,
} from '../services/admin.service';

export function usePendingApplicationsQuery(page = 1) {
  return useQuery({
    queryKey: ['admin', 'applications', 'pending', page],
    queryFn: () => getPendingApplications(page),
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

export function useEditApplicationMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: Partial<Application> }) =>
      editApplication(id, updates),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'applications'] }),
  });
}
