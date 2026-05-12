'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { FiSearch, FiUser, FiLogOut, FiSettings } from 'react-icons/fi';
import { useUIStore } from '@/store/uiStore';
import { authClient } from '@/lib/auth-client';
import { useIsAdmin } from '@/features/auth/hooks/useIsAdmin';

export function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const searchQuery = useUIStore((state) => state.searchQuery);
  const setSearchQuery = useUIStore((state) => state.setSearchQuery);

  const router = useRouter();
  const pathname = usePathname();

  const { data: session, isPending } = authClient.useSession();
  const { isAdmin } = useIsAdmin();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await authClient.signOut();
    setProfileMenuOpen(false);
    router.push('/');
    router.refresh();
  };

  if (pathname === '/login') {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-black/60 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <nav className="flex items-center justify-between h-11 gap-4">

          {/* Left: wordmark + search bar */}
          <div className="flex items-center gap-4 min-w-0">
            <Link href="/" className="font-display font-bold text-lg text-white/90 tracking-tight hover:text-white transition-colors shrink-0">
              pana<span className="text-primary-600 font-normal">.tools</span>
            </Link>

            <div className="hidden md:flex items-center gap-1.5 bg-white/[0.06] border border-white/10 rounded-full px-3 h-7 w-48 lg:w-64 focus-within:border-white/25 transition-colors">
              <FiSearch className="w-3 h-3 text-white/30 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search apps..."
                className="bg-transparent text-xs text-white/80 placeholder:text-white/30 focus:outline-none w-full"
              />
            </div>
          </div>

          {/* Right: nav links + auth */}
          <div className="hidden md:flex items-center gap-5">
            <Link href="/" className="text-sm font-medium text-white/50 hover:text-white/90 transition-colors">
              Apps
            </Link>
            <Link href="https://dlsu-lscs.org/" className="text-sm font-medium text-white/50 hover:text-white/90 transition-colors" target="_blank" rel="noopener noreferrer">
              LSCS
            </Link>
            {session && (
              <Link href="/submit" className="text-sm font-medium text-white/50 hover:text-white/90 transition-colors">
                Submit App
              </Link>
            )}

            <div className="pl-3 border-l border-white/10 flex items-center">
              {!mounted || isPending ? (
                <div className="w-7 h-7 rounded-full bg-white/10 animate-pulse" />
              ) : session ? (
                <div className="relative" ref={dropdownRef}>
                  <button onClick={() => setProfileMenuOpen(!profileMenuOpen)} className="focus:outline-none">
                    {session.user.image ? (
                      <img
                        src={session.user.image}
                        alt="Profile"
                        className="w-7 h-7 rounded-full ring-2 ring-transparent hover:ring-white/30 transition-all object-cover"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary-300 text-xs font-bold ring-2 ring-transparent hover:ring-white/30 transition-all">
                        {session.user.name?.charAt(0) || 'U'}
                      </div>
                    )}
                  </button>

                  {profileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-black/70 backdrop-blur-lg border border-white/10 shadow-[var(--shadow-modal)] rounded-xl py-1.5 overflow-hidden">
                      <div className="px-4 py-2 border-b border-white/10 mb-1">
                        <p className="text-sm font-semibold text-white/90 truncate">{session.user.name}</p>
                        <p className="text-xs text-white/40 truncate">{session.user.email}</p>
                      </div>

                      <Link
                        href={`/users/${session.user.id}`}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-white/60 hover:bg-white/10 hover:text-white/90 transition-colors"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        <FiUser className="w-4 h-4" />
                        My Profile
                      </Link>

                      {isAdmin && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-white/60 hover:bg-white/10 hover:text-white/90 transition-colors"
                          onClick={() => setProfileMenuOpen(false)}
                        >
                          <FiSettings className="w-4 h-4" />
                          Admin Dashboard
                        </Link>
                      )}

                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-400/80 hover:bg-red-400/10 hover:text-red-400 transition-colors border-t border-white/10 mt-1"
                      >
                        <FiLogOut className="w-4 h-4" />
                        Log out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="text-sm font-medium text-white/60 hover:text-white/90 transition-colors"
                >
                  Login
                </Link>
              )}
            </div>
          </div>

          {/* Mobile: hamburger */}
          <button
            type="button"
            className="md:hidden text-white/50 hover:text-white/90 focus:outline-none transition-colors"
            aria-label="Toggle menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <svg className="h-5 w-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </nav>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-black/70 backdrop-blur-lg px-5 py-3 flex flex-col gap-3">
          <div className="flex items-center gap-1.5 bg-white/[0.06] border border-white/10 rounded-full px-3 h-8 focus-within:border-white/25 transition-colors">
            <FiSearch className="w-3.5 h-3.5 text-white/30 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search apps..."
              className="bg-transparent text-sm text-white/80 placeholder:text-white/30 focus:outline-none w-full"
            />
          </div>

          <Link href="/" className="text-sm font-medium text-white/60 hover:text-white/90 transition-colors" onClick={() => setMobileMenuOpen(false)}>
            Apps
          </Link>
          <Link href="https://dlsu-lscs.org/" className="text-sm font-medium text-white/60 hover:text-white/90 transition-colors" target="_blank" rel="noopener noreferrer" onClick={() => setMobileMenuOpen(false)}>
            LSCS
          </Link>

          <div className="border-t border-white/10 pt-3 flex flex-col gap-3">
            {session ? (
              <>
                <div className="flex items-center gap-2.5">
                  {session.user.image && <img src={session.user.image} alt="" className="w-6 h-6 rounded-full" />}
                  <span className="text-sm font-medium text-white/70">{session.user.name}</span>
                </div>
                <Link href={`/users/${session.user.id}`} className="text-sm text-white/50 hover:text-white/90 transition-colors" onClick={() => setMobileMenuOpen(false)}>
                  My Profile
                </Link>
                <Link href="/submit" className="text-sm text-white/50 hover:text-white/90 transition-colors" onClick={() => setMobileMenuOpen(false)}>
                  Submit App
                </Link>
                {isAdmin && (
                  <Link href="/admin" className="text-sm text-white/50 hover:text-white/90 transition-colors" onClick={() => setMobileMenuOpen(false)}>
                    Admin Dashboard
                  </Link>
                )}
                <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="text-left text-sm text-red-400/70 hover:text-red-400 transition-colors">
                  Log out
                </button>
              </>
            ) : (
              <Link href="/login" className="text-sm font-medium text-white/60 hover:text-white/90 transition-colors" onClick={() => setMobileMenuOpen(false)}>
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
