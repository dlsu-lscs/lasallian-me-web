import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getAdminReports,
  updateAdminReport,
  GetAdminReportsParams,
} from '../services/reports.service';
import { ReportsListResponse, UpdateReportPayload } from '../types/report.types';

export const REPORTS_KEY = ['admin', 'reports'] as const;

export function useAdminReportsQuery(params: GetAdminReportsParams = {}) {
  return useQuery({
    queryKey: [...REPORTS_KEY, params],
    queryFn: () => getAdminReports(params),
    retry: 1,
  });
}

export function useUpdateAdminReportMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateReportPayload }) =>
      updateAdminReport(id, payload),
    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: REPORTS_KEY });
      const snapshots = queryClient.getQueriesData<ReportsListResponse>({
        queryKey: REPORTS_KEY,
      });

      queryClient.setQueriesData<ReportsListResponse>(
        { queryKey: REPORTS_KEY },
        (old) =>
          old
            ? {
                ...old,
                data: old.data.map((r) =>
                  r.id === id ? { ...r, ...payload, updatedAt: new Date().toISOString() } : r,
                ),
              }
            : old,
      );

      return { snapshots };
    },
    onError: (_err, _vars, context) => {
      context?.snapshots.forEach(([key, val]) => queryClient.setQueryData(key, val));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: REPORTS_KEY });
    },
  });
}