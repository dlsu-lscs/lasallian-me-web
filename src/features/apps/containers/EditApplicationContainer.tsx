'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { useAppBySlug } from '@/features/apps/hooks/use-app-by-slug';
import { useUpdateApplicationMutation } from '@/features/apps/queries/apps.queries';
import { uploadImages, uploadIcon } from '@/features/submit/services/upload.service';
import { EditApplicationForm } from '@/features/apps/components/EditApplicationForm';
import { Skeleton } from '@/components/atoms/Skeleton';
import { Application } from '../types/app.types';

export function EditApplicationContainer({ slug }: { slug: string }) {
  const router = useRouter();
  const [hasMounted, setHasMounted] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { data: session, isPending: isSessionPending } = authClient.useSession();
  const { data: app, isLoading, isError } = useAppBySlug(slug);
  const updateMutation = useUpdateApplicationMutation();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (hasMounted && !isSessionPending && !session) {
      router.push('/login');
    }
  }, [hasMounted, isSessionPending, session, router]);

  if (!hasMounted || isSessionPending) {
    return null;
  }

  if (!session) {
    return null;
  }

  const isSubmitting = isUploading || updateMutation.isPending;
  const error = uploadError ?? (updateMutation.isError ? updateMutation.error.message : null);

  const handleCancel = () => router.back();

  const handleSubmit = async (
    updates: {
      title: string;
      slug: string;
      description: string;
      url: string;
      author: string;
      githubLink: string;
      tags: string;
      previewImages: string[];
      iconUrl: string;
      removeIcon: boolean;
    },
    newPreviewFiles: File[],
    iconFile: File | null,
    removeIcon: boolean,
  ) => {
    if (!app) return;

    setUploadError(null);
    setIsUploading(true);

    try {
      let previewImages = [...updates.previewImages];

      if (newPreviewFiles.length > 0) {
        const uploaded = await uploadImages(newPreviewFiles);
        previewImages = previewImages.concat(
          uploaded.map((result) => `${window.location.origin}/api/image?key=${encodeURIComponent(result.key)}`),
        );
      }

      let icon: string | null | undefined = undefined;
      if (removeIcon) {
        icon = null;
      } else if (iconFile) {
        const uploaded = await uploadIcon(iconFile);
        icon = `${window.location.origin}/api/image?key=${encodeURIComponent(uploaded.key)}`;
      }

      updateMutation.mutate(
        {
          id: app.id,
          updates: {
            title: updates.title || undefined,
            slug: updates.slug || undefined,
            description: updates.description || undefined,
            url: updates.url || undefined,
            author: updates.author || undefined,
            githubLink: updates.githubLink || undefined,
            tags: updates.tags
              ? updates.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
              : undefined,
            previewImages,
            icon,
          },
        },
        {
          onSuccess: (result) => {
            const destination = result?.slug
              ? `/${encodeURIComponent(result.slug)}`
              : `/${encodeURIComponent(app.slug)}`;
            router.push(destination);
          },
          onError: (err) => {
            setUploadError(err instanceof Error ? err.message : 'Failed to update application.');
          },
        },
      );
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Image upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="bg-black/60 backdrop-blur-lg border border-white/10 rounded-3xl p-8">
          <Skeleton className="h-10 w-56 mb-6" />
          <div className="grid gap-5">
            <Skeleton className="h-16 rounded-3xl" />
            <Skeleton className="h-16 rounded-3xl" />
            <Skeleton className="h-96 rounded-[1.5rem]" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !app) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 text-center text-white/70">
        <p className="text-lg font-semibold">Unable to load the application.</p>
        <p className="mt-2 text-sm">Please try again later or return to the apps list.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="bg-black/60 backdrop-blur-lg border border-white/10 shadow-[var(--shadow-glass)] rounded-3xl p-8">
        <EditApplicationForm
          application={app}
          isSubmitting={isSubmitting}
          error={error}
          onCancel={handleCancel}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
