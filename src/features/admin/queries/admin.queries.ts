import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Application, ApplicationsListResponse } from '@/features/apps/types/app.types';
import {
  getAdminApplications,
  approveApplication,
  rejectApplication,
  removeApplication,
  editApplication,
  type AdminApplicationStatus,
} from '../services/admin.service';

const ADMIN_KEY = ['admin', 'applications'] as const;

export function useAdminApplicationsQuery(page = 1, status: AdminApplicationStatus = 'PENDING') {
  return useQuery({
    queryKey: [...ADMIN_KEY, status, page],
    queryFn: () => getAdminApplications(page, 20, status),
    retry: 1,
  });
}

export function useApproveApplicationMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => approveApplication(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ADMIN_KEY });
      const snapshots = qc.getQueriesData<ApplicationsListResponse>({ queryKey: ADMIN_KEY });
      qc.setQueriesData<ApplicationsListResponse>(
        { queryKey: ADMIN_KEY },
        (old) => old ? { ...old, data: old.data.filter((a) => a.id !== id) } : old,
      );
      return { snapshots };
    },
    onError: (_err, _vars, context) => {
      context?.snapshots.forEach(([key, val]) => qc.setQueryData(key, val));
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ADMIN_KEY }),
  });
}

export function useRejectApplicationMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) =>
      rejectApplication(id, reason),
    onMutate: async ({ id }) => {
      await qc.cancelQueries({ queryKey: ADMIN_KEY });
      const snapshots = qc.getQueriesData<ApplicationsListResponse>({ queryKey: ADMIN_KEY });
      qc.setQueriesData<ApplicationsListResponse>(
        { queryKey: ADMIN_KEY },
        (old) => old ? { ...old, data: old.data.filter((a) => a.id !== id) } : old,
      );
      return { snapshots };
    },
    onError: (_err, _vars, context) => {
      context?.snapshots.forEach(([key, val]) => qc.setQueryData(key, val));
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ADMIN_KEY }),
  });
}

export function useRemoveApplicationMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) =>
      removeApplication(id, reason),
    onMutate: async ({ id }) => {
      await qc.cancelQueries({ queryKey: ADMIN_KEY });
      const snapshots = qc.getQueriesData<ApplicationsListResponse>({ queryKey: ADMIN_KEY });
      qc.setQueriesData<ApplicationsListResponse>(
        { queryKey: ADMIN_KEY },
        (old) => old ? { ...old, data: old.data.filter((a) => a.id !== id) } : old,
      );
      return { snapshots };
    },
    onError: (_err, _vars, context) => {
      context?.snapshots.forEach(([key, val]) => qc.setQueryData(key, val));
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ADMIN_KEY }),
  });
}

export function useEditApplicationMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: Partial<Application> }) =>
      editApplication(id, updates),
    onMutate: async ({ id, updates }) => {
      await qc.cancelQueries({ queryKey: ADMIN_KEY });
      const snapshots = qc.getQueriesData<ApplicationsListResponse>({ queryKey: ADMIN_KEY });
      qc.setQueriesData<ApplicationsListResponse>(
        { queryKey: ADMIN_KEY },
        (old) => old
          ? { ...old, data: old.data.map((a) => (a.id === id ? { ...a, ...updates } : a)) }
          : old,
      );
      return { snapshots };
    },
    onError: (_err, _vars, context) => {
      context?.snapshots.forEach(([key, val]) => qc.setQueryData(key, val));
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ADMIN_KEY }),
  });
}
