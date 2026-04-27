import type { Metadata } from 'next';
import { AdminDashboardContainer } from '@/features/admin/containers/AdminDashboardContainer';

export const metadata: Metadata = { title: 'Admin' };

export default function AdminPage() {
  return <AdminDashboardContainer />;
}
