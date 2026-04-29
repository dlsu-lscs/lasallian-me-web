'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { SubmitForm } from '../components/SubmitForm';
import { useSubmitApplicationMutation } from '../queries/submit.queries';
import type { SubmitApplicationForm } from '../types/submit.types';

export function SubmitContainer() {
  const router = useRouter();
  const [hasMounted, setHasMounted] = useState(false);

  const { data: session, isPending: isSessionPending } = authClient.useSession();
  const mutation = useSubmitApplicationMutation();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (hasMounted && !isSessionPending && !session) {
      router.push('/login');
    }
  }, [session, isSessionPending, router, hasMounted]);

  if (!hasMounted || isSessionPending) {
    return null;
  }

  if (!session) {
    return null;
  }

  const handleSubmit = (formData: SubmitApplicationForm) => {
    mutation.mutate(formData);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Submit an App</h1>

      <SubmitForm
        onSubmit={handleSubmit}
        isSubmitting={mutation.isPending}
        error={mutation.isError ? mutation.error.message : null}
        isSuccess={mutation.isSuccess}
        onReset={() => mutation.reset()}
      />
    </div>
  );
}
