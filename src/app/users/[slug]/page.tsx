import type { Metadata } from 'next';
import ProfileContainer from '../../../features/apps/containers/ProfileContainer';
import React from 'react';

export interface ProfilePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const { slug } = await params;
  return { title: slug };
}

const ProfilePage = async ({ params }: ProfilePageProps) => {
  const { slug } = await params;
  return <ProfileContainer slug={slug} />;
};

export default ProfilePage;