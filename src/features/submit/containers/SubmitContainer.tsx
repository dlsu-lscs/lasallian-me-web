'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { SubmitForm } from '../components/SubmitForm';
import { useSubmitApplicationMutation } from '../queries/submit.queries';
import { useAuthorByEmail } from '../queries/author.queries';
import type { SubmitApplicationForm } from '../types/submit.types';

export function SubmitContainer() {
  const router = useRouter();
  const [hasMounted, setHasMounted] = useState(false);

  // Get the Session from Better Auth
  const { data: session, isPending: isSessionPending } = authClient.useSession();

  // Fetch the Author ID from your DB using the session email
  const { 
    data: author, 
    isLoading: isAuthorLoading, 
    error: authorError 
  } = useAuthorByEmail(session?.user?.email);

  const mutation = useSubmitApplicationMutation();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Redirect to login if the session check finishes and no user is found
  useEffect(() => {
    if (hasMounted && !isSessionPending && !session) {
      router.push('/login');
    }
  }, [session, isSessionPending, router, hasMounted]);


  if (!hasMounted) {
    return null; 
  }


  if (isSessionPending || isAuthorLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center text-gray-500">
        <div className="animate-pulse">Verifying author profile...</div>
      </div>
    );
  }

  if (!session || !author || authorError) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center text-red-500 border border-red-200 rounded-lg bg-red-50">
        <p className="font-semibold">Author Profile Not Found</p>
        <p className="text-sm mt-2">You must be a registered author to submit apps.</p>
      </div>
    );
  }

  const handleSubmit = (formData: SubmitApplicationForm) => {
    mutation.mutate({
      ...formData,
      authorId: author.id,
    });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Submit an App</h1>
      
      <SubmitForm
        defaultAuthorName={session.user.name}
        defaultAuthorEmail={session.user.email}
        onSubmit={handleSubmit}
        isSubmitting={mutation.isPending}
        error={mutation.isError ? mutation.error.message : null}
        isSuccess={mutation.isSuccess}
        onReset={() => mutation.reset()}
      />
    </div>
  );
}