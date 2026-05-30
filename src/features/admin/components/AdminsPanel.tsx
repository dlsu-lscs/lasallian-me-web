'use client';

import { useState } from 'react';
import { Button } from '@/components/atoms/Button';
import { MemberAvatar } from './MemberAvatar';
import { AddAdminModal } from './AddAdminModal';
import { MemberReviewsModal } from './MemberReviewsModal';
import { useMembersQuery, useDemoteMemberMutation } from '../queries/member.queries';
import { relativeTime } from '@/lib/relative-time';
import { useToastStore } from '@/store/toast.store';
import type { Member, MemberReviewsModalState } from '../types/admin.types';
import { FiHeart, FiUserPlus, FiMessageSquare } from 'react-icons/fi';

export function AdminsPanel() {
  const [addAdminOpen, setAddAdminOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [reviewsModal, setReviewsModal] = useState<MemberReviewsModalState>({ isOpen: false, member: null });
  const { addToast } = useToastStore();

  const { data, isLoading, isError } = useMembersQuery({
    role: 'admin',
    page,
    sortBy: 'lastLogin',
    sortOrder: 'desc',
  });

  const demoteMutation = useDemoteMemberMutation();

  const admins = data?.data ?? [];
  const meta = data?.meta;

  const handleDemote = (member: Member) => {
    demoteMutation.mutate(member.id, {
      onSuccess: () => addToast(`${member.name} has been removed from admin`, 'success'),
      onError: () => addToast('Failed to remove admin', 'error'),
    });
  };

  return (
    <div>
      <div className="glass-md rounded-xl overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/8">
          <span className="text-sm text-white/40">
            {meta ? `${meta.total} admin${meta.total !== 1 ? 's' : ''}` : 'Admins'}
          </span>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setAddAdminOpen(true)}
            className="flex items-center gap-2"
          >
            <FiUserPlus className="w-3.5 h-3.5" />
            Add Admin
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-white/40 text-sm">Loading admins…</div>
        ) : isError ? (
          <div className="text-center py-12 text-red-400 text-sm">Failed to load admins.</div>
        ) : admins.length === 0 ? (
          <div className="text-center py-12 text-white/40 text-sm">No admins found.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8">
                <th className="text-left px-4 py-3 text-white/40 font-medium">Admin</th>
                <th className="text-left px-4 py-3 text-white/40 font-medium">
                  <span className="flex items-center gap-1.5"><FiHeart className="w-3.5 h-3.5" />Favs</span>
                </th>
                <th className="text-left px-4 py-3 text-white/40 font-medium">
                  <span className="flex items-center gap-1.5"><FiMessageSquare className="w-3.5 h-3.5" />Reviews</span>
                </th>
                <th className="text-left px-4 py-3 text-white/40 font-medium">Last Login</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {admins.map((member) => (
                <tr key={member.id} className="hover:bg-white/[0.03] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <MemberAvatar member={member} />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-white font-medium truncate">{member.name}</p>
                          <span className="shrink-0 text-[11px] font-medium px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 border border-green-500/25">
                            Admin
                          </span>
                        </div>
                        <p className="text-white/45 text-xs truncate">{member.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-white/60">{member.favoritesCount || <span className="text-white/25">—</span>}</td>
                  <td className="px-4 py-3">
                    {member.reviewsCount > 0 ? (
                      <button
                        onClick={() => setReviewsModal({ isOpen: true, member })}
                        className="text-white/60 hover:text-white transition-colors underline underline-offset-2 decoration-white/20"
                      >
                        {member.reviewsCount}
                      </button>
                    ) : (
                      <span className="text-white/25">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-white/50">{relativeTime(member.lastLogin)}</td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDemote(member)}
                      disabled={demoteMutation.isPending && demoteMutation.variables === member.id}
                      className="border-white/15 text-white/50 hover:text-white/75"
                    >
                      {demoteMutation.isPending && demoteMutation.variables === member.id ? 'Removing…' : 'Remove Admin'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-4">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
          <span className="text-sm text-white/50">Page {meta.page} of {meta.totalPages}</span>
          <Button variant="outline" size="sm" disabled={page >= meta.totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
        </div>
      )}

      <AddAdminModal isOpen={addAdminOpen} onClose={() => setAddAdminOpen(false)} />
      <MemberReviewsModal isOpen={reviewsModal.isOpen} onClose={() => setReviewsModal({ isOpen: false, member: null })} member={reviewsModal.member} />
    </div>
  );
}
