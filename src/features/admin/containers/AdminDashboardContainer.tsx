'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useIsAdmin } from '@/features/auth/hooks/useIsAdmin';
import { SidebarLayout } from '@/components/organisms/SidebarLayout';
import { ApprovalContainer } from './ApprovalContainer';
import { MembersContainer } from './MembersContainer';
import { ClaimApprovalContainer } from './ClaimApprovalContainer';
import type { AdminTab } from '../types/admin.types';
import { FiGrid, FiUsers, FiFlag } from 'react-icons/fi';

const SIDEBAR_SECTIONS = [
  {
    label: 'Content',
    items: [
      { id: 'apps' as AdminTab, label: 'Apps', icon: <FiGrid /> },
      { id: 'claims' as AdminTab, label: 'Claim Requests', icon: <FiFlag /> },
    ],
  },
  {
    label: 'Management',
    items: [{ id: 'members' as AdminTab, label: 'Members', icon: <FiUsers /> }],
  },
];

export function AdminDashboardContainer() {
  const router = useRouter();
  const { isAdmin, isPending } = useIsAdmin();
  const [activeTab, setActiveTab] = useState<AdminTab>('apps');
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!isPending && !isAdmin) {
      router.push('/');
    }
  }, [isAdmin, isPending, router]);

  if (!hasMounted || isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white/40">
        Loading…
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-start justify-center px-4 py-10">
      <div className="glass-lg rounded-2xl overflow-hidden w-full max-w-7xl" style={{ minHeight: 'calc(100vh - 5rem)' }}>
        <SidebarLayout
          title="Admin"
          sections={SIDEBAR_SECTIONS}
          activeId={activeTab}
          onSelect={setActiveTab}
        >
          {activeTab === 'apps' && <ApprovalContainer />}
          {activeTab === 'claims' && <ClaimApprovalContainer />}
          {activeTab === 'members' && <MembersContainer />}
        </SidebarLayout>
      </div>
    </div>
  );
}
