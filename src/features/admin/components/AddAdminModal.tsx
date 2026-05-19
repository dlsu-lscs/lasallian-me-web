'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Modal } from '@/components/atoms/Modal';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';
import { useMembersQuery, usePromoteMemberMutation } from '../queries/member.queries';
import { useToastStore } from '@/store/toast.store';
import { useDebounce } from '@/hooks/useDebounce';
import type { Member } from '../types/admin.types';

interface AddAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function MemberAvatar({ member }: { member: Member }) {
  const initials = member.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  if (member.image) {
    return (
      <div className="relative w-8 h-8 shrink-0 rounded-full overflow-hidden border border-white/10">
        <Image fill unoptimized src={member.image} alt={member.name} className="object-cover" />
      </div>
    );
  }

  return (
    <div className="w-8 h-8 shrink-0 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-xs font-semibold text-white/70">
      {initials}
    </div>
  );
}

export function AddAdminModal({ isOpen, onClose }: AddAdminModalProps) {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const { addToast } = useToastStore();

  const promoteMutation = usePromoteMemberMutation();

  const { data, isLoading } = useMembersQuery({
    search: debouncedSearch || undefined,
    excludeRole: 'admin',
    limit: 10,
    sortBy: 'lastLogin',
  });

  const members = data?.data ?? [];

  const handlePromote = (member: Member) => {
    promoteMutation.mutate(member.id, {
      onSuccess: () => {
        addToast(`${member.name} is now an admin`, 'success');
      },
      onError: () => addToast('Failed to promote member', 'error'),
    });
  };

  const handleClose = () => {
    setSearch('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Admin">
      <div className="flex flex-col gap-4">
        <Input
          placeholder="Search members by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="flex flex-col gap-1.5 max-h-72 overflow-y-auto">
          {isLoading ? (
            <p className="text-center text-white/40 text-sm py-4">Searching…</p>
          ) : members.length === 0 ? (
            <p className="text-center text-white/40 text-sm py-4">
              {search ? 'No members found.' : 'Start typing to search members.'}
            </p>
          ) : (
            members.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/8 hover:bg-white/[0.07] transition-colors"
              >
                <MemberAvatar member={member} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{member.name}</p>
                  <p className="text-xs text-white/45 truncate">{member.email}</p>
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handlePromote(member)}
                  disabled={promoteMutation.isPending && promoteMutation.variables === member.id}
                  className="shrink-0 text-xs"
                >
                  {promoteMutation.isPending && promoteMutation.variables === member.id
                    ? 'Promoting…'
                    : 'Promote'}
                </Button>
              </div>
            ))
          )}
        </div>
      </div>
    </Modal>
  );
}
