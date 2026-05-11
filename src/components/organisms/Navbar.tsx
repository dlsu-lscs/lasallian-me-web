'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { FiFilter, FiSearch, FiUser, FiLogOut, FiSettings } from 'react-icons/fi';
import { useUIStore } from '@/store/uiStore';
import { authClient } from '@/lib/auth-client';
import { useIsAdmin } from '@/features/auth/hooks/useIsAdmin';

export function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  
  const toggleSearch = useUIStore((state) => state.toggleSearch);
  const toggleFilters = useUIStore((state) => state.toggleFilters);
  
  const router = useRouter();
  const pathname = usePathname();

  // Fetch the current user session
  const { data: session, isPending } = authClient.useSession();
  const { isAdmin } = useIsAdmin();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  // Close dropdown if clicked outside
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

  // Hide the navbar on login
  if (pathname === '/login') {
    return null;
  }

  return (
    <nav className="bg-[#006633] shadow-sm border-b border-gray-200 py-3 relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">

          <div className="flex items-center space-x-10">
         
            <h1 className="text-white font-bold text-[35px] leading-[150%] font-sans m-0 p-0 flex items-center transition-colors">
              pana
            </h1>
        

            {/*Desktop Links*/}
            <div className="hidden md:flex items-center space-x-6 pl-10">
              <Link href="/" className="text-white hover:text-lime-300 font-medium transition-colors">
                Apps
              </Link>
              <Link href="https://dlsu-lscs.org/" className="text-white hover:text-lime-300 font-medium transition-colors" target="_blank" rel="noopener noreferrer">
                LSCS
              </Link>
              {session && (
                <Link href="/submit" className="text-white hover:text-lime-300 font-medium transition-colors">
                  Submit App
                </Link>
              )}
            </div>
          </div>

          {/*Right Side: Icons & Auth*/}
          <div className="hidden md:flex items-center space-x-6 text-white">
            <button aria-label="Search" className="hover:text-lime-300 transition-colors" onClick={toggleSearch}>
              <FiSearch className="w-6 h-6" />
            </button>
            <button aria-label="Filter" className="hover:text-lime-300 transition-colors" onClick={toggleFilters}>
              <FiFilter className="w-6 h-6" />
            </button>

            {/* Auth State Rendering */}
            <div className="pl-4 border-l border-white/20 flex items-center space-x-6">
              {!mounted || isPending ? (
                <div className="w-9 h-9 rounded-full bg-white/20 animate-pulse" />
              ) : session ? (
                <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    className="flex items-center space-x-2 focus:outline-none"
                  >
                    {session.user.image ? (
                      <img
                        src={session.user.image} 
                        alt="Profile" 
                        className="w-9 h-9 rounded-full border-2 border-transparent hover:border-lime-300 transition-all object-cover"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-lime-400 flex items-center justify-center text-[#006633] font-bold border-2 border-transparent hover:border-white transition-all">
                        {session.user.name?.charAt(0) || 'U'}
                      </div>
                    )}
                  </button>

                  {/* Profile Dropdown */}
                  {profileMenuOpen && (
                    <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-lg py-2 border border-gray-100 overflow-hidden transform origin-top-right transition-all">
                      <div className="px-4 py-2 border-b border-gray-100 mb-1">
                        <p className="text-sm font-medium text-gray-900 truncate">{session.user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{session.user.email}</p>
                      </div>
                      
                      <Link
                        href={`/users/${session.user.id}`}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#006633] transition-colors"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        <FiUser className="mr-2" />
                        My Profile
                      </Link>

                      {isAdmin && (
                        <Link
                          href="/admin"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#006633] transition-colors"
                          onClick={() => setProfileMenuOpen(false)}
                        >
                          <FiSettings className="mr-2" />
                          Admin Dashboard
                        </Link>
                      )}

                      <button
                        onClick={handleLogout} 
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors mt-1 border-t border-gray-100 pt-2"
                      >
                        <FiLogOut className="mr-2" />
                        Log out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link href="/login" className="bg-white text-[#006633] px-4 py-2 rounded-lg font-medium hover:bg-lime-300 transition-colors">
                    Login
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden text-white hover:text-lime-300 focus:outline-none transition-colors"
            aria-label="Toggle menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/20 mt-3">
            <div className="flex flex-col space-y-4">
              <Link href="/" className="text-white hover:text-lime-300 font-medium transition-colors" onClick={() => setMobileMenuOpen(false)}>
                Home
              </Link>
              <Link href="/" className="text-white hover:text-lime-300 font-medium transition-colors" onClick={() => setMobileMenuOpen(false)}>
                Apps
              </Link>
              
              <div className="border-t border-white/20 pt-4 mt-2 flex flex-col space-y-4">
                {session ? (
                  <>
                    <div className="flex items-center space-x-3 px-2">
                      {session.user.image && <img src={session.user.image} alt="" className="w-8 h-8 rounded-full" />}
                      <span className="text-white font-medium">{session.user.name}</span>
                    </div>
                    <Link href={`/users/${session.user.id}`} className="text-lime-100 hover:text-lime-300 font-medium transition-colors pl-2" onClick={() => setMobileMenuOpen(false)}>
                      My Profile
                    </Link>
                    <Link href="/submit" className="text-lime-100 hover:text-lime-300 font-medium transition-colors pl-2" onClick={() => setMobileMenuOpen(false)}>
                      Submit App
                    </Link>
                    {isAdmin && (
                      <Link href="/admin" className="text-lime-100 hover:text-lime-300 font-medium transition-colors pl-2" onClick={() => setMobileMenuOpen(false)}>
                        Admin Dashboard
                      </Link>
                    )}
                    <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="text-left text-red-300 hover:text-red-400 font-medium transition-colors pl-2">
                      Log out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="text-white hover:text-lime-300 font-medium transition-colors" onClick={() => setMobileMenuOpen(false)}>
                      Login
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}