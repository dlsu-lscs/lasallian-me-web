'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { useUpdateApplicationMutation, useOwnApplicationBySlugQuery } from '@/features/apps/queries/apps.queries';
import { FiAlertTriangle } from 'react-icons/fi';
import { AppEditPreviewPanel } from '@/features/apps/components/AppEditPreviewPanel';
import { Application } from '@/features/apps/types/app.types';
import { Skeleton } from '@/components/atoms/Skeleton';

export function EditApplicationContainer({ slug }: { slug: string }) {
  const router = useRouter();
  const [hasMounted, setHasMounted] = useState(false);

  const { data: session, isPending: isSessionPending } = authClient.useSession();
  const { data: app, isLoading, isError } = useOwnApplicationBySlugQuery(slug);
  const updateMutation = useUpdateApplicationMutation();

  useEffect(() => { setHasMounted(true); }, []);

  useEffect(() => {
    if (hasMounted && !isSessionPending && !session) {
      router.push('/');
    }
  }, [hasMounted, isSessionPending, session, router]);

  if (!hasMounted || isSessionPending || !session) return null;

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

  const isChangesRequested = app.status === 'CHANGES_REQUESTED';

  const handleSave = (updates: Partial<Application>) => {
    updateMutation.mutate(
      { id: app.id, updates },
      {
        onSuccess: (result) => {
          if (isChangesRequested) {
            router.push('/');
          } else {
            const destination = result?.slug
              ? `/${encodeURIComponent(result.slug)}`
              : `/${encodeURIComponent(app.slug)}`;
            router.push(destination);
          }
        },
      },
    );
  };

  const changesRequestedBanner = isChangesRequested ? (
    <div className="rounded-xl border border-amber-500/20 bg-amber-500/8 p-3 flex gap-2.5">
      <FiAlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
      <div>
        <p className="text-xs font-semibold mb-0.5 text-amber-400">Changes Requested</p>
        <p className="text-xs leading-snug text-amber-300/70">
          {app.rejectionReason || 'Please review and update your application before resubmitting.'}
        </p>
      </div>
    </div>
  ) : null;

  return (
    <AppEditPreviewPanel
      app={app}
      onSave={handleSave}
      isSaving={updateMutation.isPending}
      saveError={updateMutation.isError ? updateMutation.error?.message : null}
      sidebarTop={changesRequestedBanner}
    />
  );
}
