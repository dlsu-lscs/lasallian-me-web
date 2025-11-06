import { AppDetailContainer } from '@/features/apps/containers/AppDetailContainer';
import React from 'react';

export interface AppDetailPageProps {
  params: {
    slug: string;
  };
}

const AppDetailPage = ({params}: AppDetailPageProps) => {
  return <AppDetailContainer slug={params.slug} />;
}

export default AppDetailPage;