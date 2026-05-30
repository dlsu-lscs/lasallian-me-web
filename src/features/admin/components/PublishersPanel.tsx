'use client';

import { useState } from 'react';
import { Button } from '@/components/atoms/Button';
import { MemberAvatar } from './MemberAvatar';
import { BanModal } from './BanModal';
import { MemberAppsModal } from './MemberAppsModal';
import { MemberReviewsModal } from './MemberReviewsModal';
import {
  useMembersQuery,
  useBanMemberMutation,
  useUnbanMemberMutation,
} from '../queries/member.queries';
import { relativeTime } from '@/lib/relative-time';
import { useDebounce } from '@/hooks/useDebounce';
import { useToastStore } from '@/store/toast.store';
import type { Member, BanModalState, MemberAppsModalState, MemberReviewsModalState } from '../types/admin.types';
import { FiSearch, FiHeart, FiMessageSquare } from 'react-icons/fi';

type BanFilter = 'all' | 'active' | 'banned';
type SortField = 'lastLogin' | 'totalAppCount' | 'favoritesCount';

const BAN_FILTERS: { label: string; value: BanFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Banned', value: 'banned' },
];

function StatusChip({ count, colorClass, label }: { count: number; colorClass: string; label: string }) {
  if (count === 0) return null;
  return (
    <span title={`${count} ${label}`} className={`inline-flex items-center gap-1 text-[11px] font-medium px-1.5 py-0.5 rounded-md ${colorClass}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />{count}
    </span>
  );
}

export function PublishersPanel() {
  const [search, setSearch] = useState('');
  const [banFilter, setBanFilter] = useState<BanFilter>('all');
  const [sortBy, setSortBy] = useState<SortField>('lastLogin');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [banModal, setBanModal] = useState<BanModalState>({ isOpen: false, member: null });
  const [appsModal, setAppsModal] = useState<MemberAppsModalState>({ isOpen: false, member: null });
  const [reviewsModal, setReviewsModal] = useState<MemberReviewsModalState>({ isOpen: false, member: null });

  const debouncedSearch = useDebounce(search, 300);
  const { addToast } = useToastStore();

  const bannedParam = banFilter === 'active' ? 'false' : banFilter === 'banned' ? 'true' : undefined;

  const { data, isLoading, isError } = useMembersQuery({
    search: debouncedSearch || undefined,
    banned: bannedParam,
    hasApps: 'true',
    page,
    sortBy,
    sortOrder,
  });

  const banMutation = useBanMemberMutation();
  const unbanMutation = useUnbanMemberMutation();

  const members = data?.data ?? [];
  const meta = data?.meta;

  const toggleSort = (field: SortField) => {
    if (sortBy === field) setSortOrder((o) => (o === 'desc' ? 'asc' : 'desc'));
    else { setSortBy(field); setSortOrder('desc'); }
    setPage(1);
  };

  const sortIcon = (field: SortField) => sortBy === field
    ? <span className="text-white/55">{sortOrder === 'desc' ? '↓' : '↑'}</span>
    : <span className="text-white/20">↕</span>;

  const handleBan = (member: Member) => setBanModal({ isOpen: true, member });
  const handleConfirmBan = (reason: string) => {
    if (!banModal.member) return;
    banMutation.mutate(
      { userId: banModal.member.id, reason },
      {
        onSuccess: () => { setBanModal({ isOpen: false, member: null }); addToast(`${banModal.member!.name} has been banned`, 'success'); },
        onError: () => addToast('Failed to ban member', 'error'),
      },
    );
  };
  const handleUnban = (member: Member) => {
    unbanMutation.mutate(member.id, {
      onSuccess: () => addToast(`${member.name} has been unbanned`, 'success'),
      onError: () => addToast('Failed to unban member', 'error'),
    });
  };

  return (
    <div>
      <div className="glass-md rounded-xl overflow-hidden">
        {/* Integrated toolbar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/8">
          <FiSearch className="w-4 h-4 text-white/30 shrink-0" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search publishers…"
            className="flex-1 bg-transparent text-sm text-white placeholder:text-white/30 focus:outline-none"
          />
          <div className="flex gap-1.5 shrink-0">
            {BAN_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => { setBanFilter(f.value); setPage(1); }}
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                  banFilter === f.value
                    ? 'bg-white/12 text-white border border-white/20'
                    : 'text-white/40 border border-white/10 hover:text-white/60 hover:bg-white/[0.06]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-white/40 text-sm">Loading publishers…</div>
        ) : isError ? (
          <div className="text-center py-12 text-red-400 text-sm">Failed to load publishers.</div>
        ) : members.length === 0 ? (
          <div className="text-center py-12 text-white/40 text-sm">No publishers found.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8">
                <th className="text-left px-4 py-3 text-white/40 font-medium">Publisher</th>
                <th className="px-4 py-3 text-left">
                  <button onClick={() => toggleSort('totalAppCount')} className="flex items-center gap-1 text-white/40 font-medium hover:text-white/60 transition-colors">
                    Apps {sortIcon('totalAppCount')}
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <button onClick={() => toggleSort('favoritesCount')} className="flex items-center gap-1.5 text-white/40 font-medium hover:text-white/60 transition-colors">
                    <FiHeart className="w-3.5 h-3.5" />Favs {sortIcon('favoritesCount')}
                  </button>
                </th>
                <th className="text-left px-4 py-3 text-white/40 font-medium">
                  <span className="flex items-center gap-1.5"><FiMessageSquare className="w-3.5 h-3.5" />Reviews</span>
                </th>
                <th className="px-4 py-3 text-left">
                  <button onClick={() => toggleSort('lastLogin')} className="flex items-center gap-1 text-white/40 font-medium hover:text-white/60 transition-colors">
                    Last Login {sortIcon('lastLogin')}
                  </button>
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {members.map((member) => (
                <tr key={member.id} className="hover:bg-white/[0.03] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <MemberAvatar member={member} />
                      <div className="min-w-0">
                        <p className="text-white font-medium truncate">{member.name}</p>
                        <p className="text-white/45 text-xs truncate">{member.email}</p>
                      </div>
                      {member.banned && (
                        <span className="shrink-0 text-xs font-medium px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/25">Banned</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setAppsModal({ isOpen: true, member })}
                      className="flex items-center gap-1 hover:opacity-80 transition-opacity"
                      title="View apps"
                    >
                      <StatusChip count={member.pendingCount} colorClass="text-yellow-400 bg-yellow-500/10" label="pending" />
                      <StatusChip count={member.approvedCount} colorClass="text-green-400 bg-green-500/10" label="approved" />
                      <StatusChip count={member.changesRequestedCount} colorClass="text-amber-400 bg-amber-500/10" label="changes" />
                      <StatusChip count={member.removedCount} colorClass="text-white/35 bg-white/5" label="removed" />
                    </button>
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
                    {member.banned ? (
                      <Button size="sm" variant="outline" onClick={() => handleUnban(member)} disabled={unbanMutation.isPending && unbanMutation.variables === member.id}>
                        {unbanMutation.isPending && unbanMutation.variables === member.id ? 'Unbanning…' : 'Unban'}
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => handleBan(member)} className="border-red-500/30 text-red-400 hover:bg-red-500/10">
                        Ban
                      </Button>
                    )}
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

      <BanModal isOpen={banModal.isOpen} onClose={() => setBanModal({ isOpen: false, member: null })} onConfirm={handleConfirmBan} isSubmitting={banMutation.isPending} memberName={banModal.member?.name ?? ''} />
      <MemberAppsModal isOpen={appsModal.isOpen} onClose={() => setAppsModal({ isOpen: false, member: null })} member={appsModal.member} />
      <MemberReviewsModal isOpen={reviewsModal.isOpen} onClose={() => setReviewsModal({ isOpen: false, member: null })} member={reviewsModal.member} />
    </div>
  );
}
