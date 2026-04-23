import { useMutation } from '@tanstack/react-query';
import { SubmitApplicationForm } from '../types/submit.types';

export const useSubmitApplicationMutation = () => {
  return useMutation({
    mutationFn: async (data: SubmitApplicationForm & { authorId: number }) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/applications`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.NEXT_PUBLIC_API_SECRET_KEY || '',
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err?.error?.message ?? 'Failed to submit application');
      }

      return response.json();
    },
  });
};