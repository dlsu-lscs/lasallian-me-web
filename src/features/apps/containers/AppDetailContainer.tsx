'use client';

import React from 'react';
import { useAppBySlug} from '@/features/apps/hooks/use-app-by-slug';
import { AppDetail } from '../components/AppDetail';
import { Button } from '@/components/atoms/Button';
import Link from 'next/link';

export interface AppDetailContainerProps {
  slug: string;
}

export function AppDetailContainer({ slug }: AppDetailContainerProps) {
  const app = useAppBySlug(slug);

  if (!app) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50 p-8">
        <div className="text-center">
          <h1 className="text-6xl font-extrabold text-blue-600 mb-2">404</h1>
          <h2 className="text-3xl font-semibold text-gray-900 mb-4">App Not Found</h2>
          <p className="text-gray-600 mb-8">
            The app with the slug &quot;{slug}&quot; could not be found.
          </p>
          <Link href="/">
            <Button variant="primary">
              Go to App Directory
            </Button>
          </Link>
        </div>
      </div>

    );
  }

  return <AppDetail app={app} />;
}