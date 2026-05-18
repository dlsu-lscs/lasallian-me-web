import type { Metadata } from 'next';
import { EditApplicationContainer } from '@/features/apps/containers/EditApplicationContainer';
import { getApplicationBySlug } from '@/features/apps/services/apps.service';
import React from 'react';

export interface EditApplicationPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: EditApplicationPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const app = await getApplicationBySlug(slug);
    return {
      title: `Edit ${app.title}`,
      description: `Edit ${app.title} on Lasallian Me`,
    };
  } catch {
    return { title: 'Edit Application' };
  }
}

const EditApplicationPage = async ({ params }: EditApplicationPageProps) => {
  const { slug } = await params;
  return <EditApplicationContainer slug={slug} />;
};

export default EditApplicationPage;
