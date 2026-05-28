'use client';

import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { FiX } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';

export interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoogleSignIn: () => void;
  isLoading: boolean;
  error?: string | null;
}

export function LoginModal({ isOpen, onClose, onGoogleSignIn, isLoading, error }: LoginModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="login-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[60] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={onClose}
        >
          <motion.div
            key="login-modal-card"
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl bg-black/85 backdrop-blur-xl border border-white/10 shadow-[var(--shadow-modal)] rounded-2xl overflow-hidden flex"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-3.5 right-3.5 z-20 w-7 h-7 flex items-center justify-center rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-colors"
            >
              <FiX className="w-4 h-4" />
            </button>

            {/* Left panel — image + branding */}
            <div className="relative hidden sm:flex flex-col justify-between w-[45%] shrink-0 bg-[#0d5c35] p-8 overflow-hidden text-white">
              {/* Background image */}
              <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-b from-[#0d5c35]/80 via-[#0d5c35]/60 to-[#0d5c35] z-10" />
                <Image
                  fill
                  src="/bg.png"
                  alt="App background"
                  className="object-cover opacity-40 mix-blend-luminosity"
                />
              </div>

              {/* Logo */}
              <p className="relative z-20 font-display font-bold text-xl text-white tracking-tight">
                pana<span className="text-[#c2f068] font-normal">.tools</span>
              </p>

              {/* Headline */}
              <div className="relative z-20">
                <h2 className="text-3xl font-extrabold leading-tight tracking-tight mb-3">
                  The Digital Hub for<br />Archer{' '}
                  <span className="text-[#c2f068]">Innovation.</span>
                </h2>
                <p className="text-sm text-white/55 leading-relaxed">
                  The centralized hub for all La Salle Computer Society applications and community tools.
                </p>
              </div>

              {/* Stats */}
              <div className="relative z-20 border-t border-white/10 pt-5">
                <div className="text-2xl font-bold text-white mb-0.5">10+</div>
                <div className="text-[10px] tracking-widest text-white/40 uppercase font-semibold">Student-led projects</div>
              </div>
            </div>

            {/* Right panel — login form */}
            <div className="flex-1 flex flex-col justify-center px-8 py-10 relative">
              {/* Mobile logo */}
              <p className="sm:hidden font-display font-bold text-xl text-white/90 tracking-tight mb-6">
                pana<span className="text-primary-600 font-normal">.tools</span>
              </p>

              <div className="flex flex-col gap-6 relative">
                <div className="flex flex-col gap-1.5">
                  <h2 className="text-2xl font-bold text-white tracking-tight">
                    Welcome back
                  </h2>
                  <p className="text-white/45 text-sm leading-relaxed">
                    Sign in with your DLSU Google account to access your profile, bookmark apps, and write reviews.
                  </p>
                </div>

                {error && (
                  <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <button
                  onClick={onGoogleSignIn}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-3 py-3.5 px-5 rounded-xl bg-white/8 hover:bg-white/12 active:bg-white/6 border border-white/12 hover:border-white/20 text-white/85 hover:text-white font-medium text-sm transition-all duration-150 disabled:opacity-50 cursor-pointer"
                >
                  <FcGoogle className="w-5 h-5 shrink-0" />
                  <span>{isLoading ? 'Connecting…' : 'Sign in with Google'}</span>
                </button>

                <p className="text-white/20 text-xs text-center leading-snug">
                  The Digital Hub for Archer Innovation — by LSCS
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
