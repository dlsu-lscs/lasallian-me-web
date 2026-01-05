import { AppDetailContainer } from '@/features/apps/containers/AppDetailContainer';
import React from 'react';

export interface AppDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const AppDetailPage = async ({params}: AppDetailPageProps) => {
  const { slug } = await params;
  return <AppDetailContainer slug={slug} />;
}

export default AppDetailPage;