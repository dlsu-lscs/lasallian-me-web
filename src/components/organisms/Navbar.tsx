'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiFilter, FiSearch } from 'react-icons/fi';
import { useUIStore } from '@/store/uiStore';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const toggleSearch = useUIStore((state) => state.toggleSearch);
  const toggleFilters = useUIStore((state) => state.toggleFilters);
  return (
    <nav className="bg-[#006633] shadow-sm border-b border-gray-200 py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">

            <div className="flex items-center space-x-10">
              <h1 className="text-white font-bold text-[35px] leading-[150%] font-sans m-0 p-0 flex items-center">
                LaSallian.Me
              </h1>

              {/* Desktop Navigation Links */}
              <div className="hidden md:flex items-center space-x-6 pl-10">
                <Link
                  href="/"
                  className="text-white hover:text-yellow-300 font-medium transition-colors"
                >
                  Apps
                </Link>

                <Link
                  href="https://dlsu-lscs.org/"
                  className="text-white hover:text-yellow-300 font-medium transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LSCS
                </Link>

                <Link
                  href="/signup"
                  className="text-white hover:text-yellow-300 font-medium transition-colors"
                >
                  Sign Up
                </Link>

                <Link
                  href="/login"
                  className="text-white hover:text-yellow-300 font-medium transition-colors"
                >
                  Login
                </Link>
              </div>
          </div>

          {/* Right Side: Icons */}
          <div className="hidden md:flex items-center space-x-4 text-white">
            <button
              aria-label="Search"
              className="hover:text-yellow-300 transition-colors"
              onClick={toggleSearch}
            >
              <FiSearch className="w-6 h-6" />
            </button>
            <button
              aria-label="Filter"
              className="hover:text-yellow-300 transition-colors"
              onClick={toggleFilters}
            >
              <FiFilter className="w-6 h-6" />
            </button>
          </div>


          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden text-gray-700 hover:text-blue-600 focus:outline-none focus:text-blue-600"
            aria-label="Toggle menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-3">
              <Link
                href="/"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/"
                className="text-gray-700 hover:text-blue-600 font-medium "
                onClick={() => setMobileMenuOpen(false)}
              >
                Apps
              </Link>
              <Link
                href="/about"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
              href="/signup"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              onClick={() => setMobileMenuOpen(false)}
              >
                Sign Up
              </Link>

            <Link
              href="/login"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
