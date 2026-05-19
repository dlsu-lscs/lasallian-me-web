import Image from 'next/image';
import type { Member } from '../types/admin.types';

export function MemberAvatar({ member }: { member: Member }) {
  const initials = member.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
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
