'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { SubmitForm } from '../components/SubmitForm';
import { useSubmitApplicationMutation } from '../queries/submit.queries';
import { uploadImages } from '../services/upload.service';
import type { SubmitApplicationForm } from '../types/submit.types';

export function SubmitContainer() {
  const router = useRouter();
  const [hasMounted, setHasMounted] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

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

  const handleSubmit = async (formData: SubmitApplicationForm, files: File[]) => {
    setUploadError(null);

    let previewImages: string[] | undefined;

    if (files.length > 0) {
      setIsUploading(true);
      try {
        previewImages = await uploadImages(files);
      } catch (err) {
        setUploadError(err instanceof Error ? err.message : 'Image upload failed.');
        setIsUploading(false);
        return;
      }
      setIsUploading(false);
    }

    mutation.mutate({ ...formData, previewImages });
  };

  const isSubmitting = isUploading || mutation.isPending;
  const submitLabel = isUploading
    ? 'Uploading images…'
    : mutation.isPending
      ? 'Submitting…'
      : 'Submit App for Review';

  const error = uploadError ?? (mutation.isError ? mutation.error.message : null);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Submit an App</h1>

      <SubmitForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitLabel={submitLabel}
        error={error}
        isSuccess={mutation.isSuccess}
        onReset={() => {
          mutation.reset();
          setUploadError(null);
        }}
      />
    </div>
  );
}
