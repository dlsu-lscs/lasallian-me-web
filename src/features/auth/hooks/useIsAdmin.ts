import { authClient } from '@/lib/auth-client';

export function useIsAdmin(): { isAdmin: boolean; isPending: boolean } {
  const { data: session, isPending } = authClient.useSession();
  const adminEmails =
    process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',').map((e) => e.trim()) ?? [];
  const isAdmin =
    !!session?.user?.email && adminEmails.includes(session.user.email);
  return { isAdmin, isPending };
}
