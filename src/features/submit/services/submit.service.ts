import { Application } from '@/features/apps/types/app.types';
import { SubmitApplicationForm } from '../types/submit.types';

export async function submitApplication(data: SubmitApplicationForm): Promise<Application> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/applications`,
    {
      method: 'POST',
      credentials: 'include',
      headers: {
         'Content-Type': 'application/json',
          'x-api-key': process.env.NEXT_PUBLIC_API_SECRET_KEY || '',
        },
      body: JSON.stringify(data),
    },
  );

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message ?? 'Submission failed. Please try again.');
  }

  return response.json();
}
