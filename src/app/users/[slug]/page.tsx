import ProfileContainer from '../../../features/apps/containers/ProfileContainer';
import React from 'react';

export interface ProfilePageProps {
  params: Promise<{
    slug: string;
  }>;
}

const ProfilePage = async ({ params }: ProfilePageProps) => {
  const { slug } = await params;
  return <ProfileContainer slug={slug} />;
};

export default ProfilePage;