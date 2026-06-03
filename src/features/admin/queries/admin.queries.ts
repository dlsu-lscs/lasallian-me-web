import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Application, ApplicationsListResponse } from '@/features/apps/types/app.types';
import {
  getAdminApplications,
  approveApplication,
  requestChanges,
  removeApplication,
  editApplication,
  setApplicationUnclaimed,
  permanentlyDeleteApplication,
  getAdminClaimRequests,
  reviewClaimRequest,
  type AdminApplicationStatus,
} from '../services/admin.service';
import type { ClaimRequestStatus, ClaimRequestsListResponse } from '../types/admin.types';

const ADMIN_KEY = ['admin', 'applications'] as const;

export function useAdminApplicationsQuery(page = 1, status: AdminApplicationStatus = 'PENDING', limit = 20) {
  return useQuery({
    queryKey: [...ADMIN_KEY, status, page, limit],
    queryFn: () => getAdminApplications(page, limit, status),
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

export function useRequestChangesMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) =>
      requestChanges(id, reason),
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

export function useSetApplicationUnclaimedMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, unclaimed }: { id: number; unclaimed: boolean }) =>
      setApplicationUnclaimed(id, unclaimed),
    onMutate: async ({ id, unclaimed }) => {
      await qc.cancelQueries({ queryKey: ADMIN_KEY });
      const snapshots = qc.getQueriesData<ApplicationsListResponse>({ queryKey: ADMIN_KEY });
      qc.setQueriesData<ApplicationsListResponse>(
        { queryKey: ADMIN_KEY },
        (old) => old
          ? { ...old, data: old.data.map((a) => (a.id === id ? { ...a, unclaimed } : a)) }
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

export function usePermanentlyDeleteApplicationMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => permanentlyDeleteApplication(id),
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

const CLAIMS_KEY = ['admin', 'claims'] as const;

export function useAdminClaimRequestsQuery(page = 1, status?: ClaimRequestStatus, limit = 20) {
  return useQuery({
    queryKey: [...CLAIMS_KEY, status, page, limit],
    queryFn: () => getAdminClaimRequests(page, limit, status),
    retry: 1,
  });
}

export function useReviewClaimRequestMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      status,
      adminNote,
    }: {
      id: number;
      status: 'APPROVED' | 'DECLINED';
      adminNote?: string;
    }) => reviewClaimRequest(id, status, adminNote),
    onMutate: async ({ id }) => {
      await qc.cancelQueries({ queryKey: CLAIMS_KEY });
      const snapshots = qc.getQueriesData<ClaimRequestsListResponse>({ queryKey: CLAIMS_KEY });
      qc.setQueriesData<ClaimRequestsListResponse>(
        { queryKey: CLAIMS_KEY },
        (old) => old ? { ...old, data: old.data.filter((c) => c.id !== id) } : old,
      );
      return { snapshots };
    },
    onError: (_err, _vars, context) => {
      context?.snapshots.forEach(([key, val]) => qc.setQueryData(key, val));
    },
    onSettled: () => qc.invalidateQueries({ queryKey: CLAIMS_KEY }),
  });
}
