import { authClient } from '@/lib/auth-client';

export function useIsAdmin(): { isAdmin: boolean; isPending: boolean } {
  const { data: session, isPending } = authClient.useSession();
  const isAdmin = session?.user?.role === 'admin';
  return { isAdmin, isPending };
}
