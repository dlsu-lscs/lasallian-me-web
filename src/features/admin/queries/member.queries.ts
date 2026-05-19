import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getMembers,
  getUserApplications,
  getUserReviews,
  banMember,
  unbanMember,
  promoteMember,
  demoteMember,
  type GetMembersParams,
} from '../services/member.service';

const MEMBERS_KEY = ['members'] as const;

export function useMembersQuery(params: GetMembersParams = {}) {
  return useQuery({
    queryKey: [...MEMBERS_KEY, 'list', params],
    queryFn: () => getMembers(params),
    retry: 1,
  });
}

export function useUserApplicationsQuery(userId: string | null, enabled = false) {
  return useQuery({
    queryKey: [...MEMBERS_KEY, userId, 'applications'],
    queryFn: () => getUserApplications(userId!),
    enabled: enabled && userId != null,
    retry: 1,
  });
}

export function useUserReviewsQuery(userId: string | null, enabled = false) {
  return useQuery({
    queryKey: [...MEMBERS_KEY, userId, 'reviews'],
    queryFn: () => getUserReviews(userId!),
    enabled: enabled && userId != null,
    retry: 1,
  });
}

export function useBanMemberMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, reason }: { userId: string; reason: string }) =>
      banMember(userId, reason),
    onSettled: () => qc.invalidateQueries({ queryKey: MEMBERS_KEY }),
  });
}

export function useUnbanMemberMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => unbanMember(userId),
    onSettled: () => qc.invalidateQueries({ queryKey: MEMBERS_KEY }),
  });
}

export function usePromoteMemberMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => promoteMember(userId),
    onSettled: () => qc.invalidateQueries({ queryKey: MEMBERS_KEY }),
  });
}

export function useDemoteMemberMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => demoteMember(userId),
    onSettled: () => qc.invalidateQueries({ queryKey: MEMBERS_KEY }),
  });
}
