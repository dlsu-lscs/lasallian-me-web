'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useIsAdmin } from '@/features/auth/hooks/useIsAdmin';
import { SidebarLayout } from '@/components/organisms/SidebarLayout';
import { ApprovalContainer } from './ApprovalContainer';
import { MembersContainer } from './MembersContainer';
import { ClaimApprovalContainer } from './ClaimApprovalContainer';
import { AdminReportsContainer } from '@/features/reports/containers/AdminReportsContainer';
import { useAdminApplicationsQuery, useAdminClaimRequestsQuery } from '../queries/admin.queries';
import { useAdminReportsQuery } from '@/features/reports/queries/reports.queries';
import type { AdminTab } from '../types/admin.types';
import { FiGrid, FiUsers, FiFlag, FiShield } from 'react-icons/fi';

export function AdminDashboardContainer() {
  const router = useRouter();
  const { isAdmin, isPending } = useIsAdmin();
  const [activeTab, setActiveTab] = useState<AdminTab>('apps');
  const [hasMounted, setHasMounted] = useState(false);

  const { data: pendingApps } = useAdminApplicationsQuery(1, 'PENDING', 1);
  const { data: pendingClaims } = useAdminClaimRequestsQuery(1, 'PENDING', 1);
  const { data: pendingReports } = useAdminReportsQuery({ status: 'PENDING', limit: 1 });

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

  const sidebarSections = [
    {
      label: 'Content',
      items: [
        { id: 'apps' as AdminTab, label: 'Apps', icon: <FiGrid />, badge: pendingApps?.meta.total },
        { id: 'claims' as AdminTab, label: 'Claim Requests', icon: <FiShield />, badge: pendingClaims?.meta.total },
        { id: 'reports' as AdminTab, label: 'Reports', icon: <FiFlag />, badge: pendingReports?.meta.total },
      ],
    },
    {
      label: 'Management',
      items: [{ id: 'members' as AdminTab, label: 'Members', icon: <FiUsers /> }],
    },
  ];

  return (
    <div className="min-h-screen flex items-start justify-center px-4 py-10">
      <div className="glass-lg rounded-2xl overflow-hidden w-full max-w-7xl" style={{ minHeight: 'calc(100vh - 5rem)' }}>
        <SidebarLayout
          title="Admin"
          sections={sidebarSections}
          activeId={activeTab}
          onSelect={setActiveTab}
        >
          {activeTab === 'apps' && <ApprovalContainer />}
          {activeTab === 'claims' && <ClaimApprovalContainer />}
          {activeTab === 'reports' && <AdminReportsContainer />}
          {activeTab === 'members' && <MembersContainer />}
        </SidebarLayout>
      </div>
    </div>
  );
}