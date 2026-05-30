'use client';

import Image from 'next/image';
import { motion } from 'motion/react';
import { FiChevronRight } from 'react-icons/fi';
import { useUIStore } from '@/store/uiStore';

export function GuestPanel() {
  const openLoginModal = useUIStore((s) => s.openLoginModal);

  return (
    <motion.div
      onClick={openLoginModal}
      className="
        relative overflow-hidden
        bg-black/60 backdrop-blur-lg border border-white/10 shadow-[var(--shadow-glass)] rounded-xl
        flex flex-row items-center gap-4 px-5 py-4
        lg:flex-row lg:items-center lg:px-8 lg:py-6
        cursor-pointer w-full
      "
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* Decorative bow-arrow overlay */}
      <div
        aria-hidden="true"
        className="absolute -bottom-3 -right-3 w-28 h-28 lg:-bottom-10 lg:-right-6 lg:w-48 lg:h-48 opacity-[0.04] pointer-events-none"
        style={{ filter: 'brightness(0) invert(1) drop-shadow(0 2px 6px rgba(0,0,0,0.8)) drop-shadow(0 1px 2px rgba(0,0,0,0.9))' }}
      >
        <Image fill unoptimized src="/bow-arrow.svg" alt="" />
      </div>

      {/* Icon */}
      <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-white/8 border border-white/12 flex items-center justify-center shrink-0 relative">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5 lg:w-6 lg:h-6 text-white/40"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </div>

      {/* Text */}
      <div className="flex flex-col gap-0.5 min-w-0 flex-1 relative">
        <p className="text-white font-regular truncate text-base lg:text-lg">
          Welcome to <span className="font-bold">pana</span><span className="font-normal">.tools</span>!
        </p>
        <p className="text-white/40 text-xs lg:text-sm leading-snug">
          Login to bookmark apps and write reviews
        </p>
      </div>

      {/* Chevron */}
      <FiChevronRight className="shrink-0 text-white/40 w-6 h-6 relative" />
    </motion.div>
  );
}
