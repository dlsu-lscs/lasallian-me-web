import type { Metadata } from 'next';
import { AppDetailContainer } from '@/features/apps/containers/AppDetailContainer';
import { getApplicationBySlug } from '@/features/apps/services/apps.service';
import React from 'react';

export interface AppDetailPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ from?: string }>;
}

export async function generateMetadata({ params }: AppDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const app = await getApplicationBySlug(slug);
    return {
      title: app.title,
      description: app.description ?? undefined,
      openGraph: {
        title: app.title,
        description: app.description ?? undefined,
        images: (app.previewImages?.length ?? 0) > 0 
        ? [{ url: app.previewImages![0] }] 
        : [],
      },
    };
  } catch {
    return { title: 'App Not Found' };
  }
}

const AppDetailPage = async ({ params, searchParams }: AppDetailPageProps) => {
  const { slug } = await params;
  const { from } = await searchParams;
  return <AppDetailContainer slug={slug} from={from} />;
}

export default AppDetailPage;