import { useMutation } from '@tanstack/react-query';
import { submitApplication } from '../services/submit.service';
import { SubmitApplicationForm } from '../types/submit.types';

export const useSubmitApplicationMutation = () => {
  return useMutation({
    mutationFn: (data: SubmitApplicationForm) => submitApplication(data),
  });
};

export function useAcceptTosMutation(email: string) {
  return useMutation({
    mutationFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/${encodeURIComponent(email)}/tos`,
        {
          method: 'PATCH',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ accepted: true }),
        }
      );
      if (!response.ok) throw new Error('Failed to accept Terms');
    },
  });
}