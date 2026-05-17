import { motion } from 'motion/react';
import { FiChevronRight } from 'react-icons/fi';

interface UserProfileCardProps {
  name?: string | null;
  image?: string | null;
  email?: string | null;
  onClick?: () => void;
}

function getInitials(name?: string | null): string {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export function UserProfileCard({ name, image, email, onClick }: UserProfileCardProps) {
  const avatar = image ? (
    <img
      src={image}
      alt={name ?? 'User'}
      className="w-12 h-12 lg:w-28 lg:h-28 rounded-full object-cover border border-white/15 shadow-lg shrink-0"
    />
  ) : (
    <div className="w-12 h-12 lg:w-28 lg:h-28 rounded-full bg-white/10 border border-white/15 shadow-lg flex items-center justify-center shrink-0">
      <span className="text-white/70 text-xl lg:text-4xl font-bold font-display select-none">
        {getInitials(name)}
      </span>
    </div>
  );

  return (
    <motion.div
      onClick={onClick}
      className="
        relative overflow-hidden
        bg-black/60 backdrop-blur-lg border border-white/10 shadow-[var(--shadow-glass)] rounded-xl shrink-0
        flex flex-row items-center gap-4 px-5 py-4
        lg:flex-col lg:items-start lg:justify-between lg:w-80 lg:min-h-72 lg:px-8 lg:py-7
        cursor-pointer
      "
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* Decorative bow-arrow overlay */}
      <img
        src="/bow-arrow.svg"
        alt=""
        aria-hidden="true"
        className="absolute -bottom-3 -right-3 w-28 h-28 lg:top-auto lg:-bottom-10 lg:-left-10 lg:right-auto lg:translate-y-0 lg:w-52 lg:h-52 opacity-[0.04] pointer-events-none"
        style={{ filter: 'brightness(0) invert(1) drop-shadow(0 2px 6px rgba(0,0,0,0.8)) drop-shadow(0 1px 2px rgba(0,0,0,0.9))' }}
      />

      <div className="flex flex-row items-center gap-4 min-w-0 flex-1 lg:flex-col lg:items-start lg:gap-5 lg:flex-none lg:w-full relative">
        {avatar}

        <div className="flex flex-col gap-0.5 min-w-0 flex-1 lg:flex-none lg:w-full">
          <p className="text-white font-bold truncate text-base lg:text-2xl">{name}</p>
          {email && (
            <p className="text-white/45 truncate text-xs lg:text-sm">{email}</p>
          )}
          {/* <p className="text-white text-md font-semibold mt-0.5 lg:hidden">Lasallian</p> */}
        </div>
      </div>

      <FiChevronRight className="lg:hidden shrink-0 text-white/80 w-10 h-10 relative" />

      <p className="hidden lg:block text-white text-lg font-semibold relative">Lasallian</p>
    </motion.div>
  );
}
