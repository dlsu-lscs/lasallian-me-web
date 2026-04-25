import React from 'react';
import { FiArrowLeft } from 'react-icons/fi'; 
import { FcGoogle } from 'react-icons/fc'; // Make sure react-icons is installed
import Link from 'next/link';
import Image from 'next/image';

export interface LoginFormProps {
  onGoogleSignIn: () => void;
  isLoading: boolean;
  error?: string | null;
}

export function LoginForm({ onGoogleSignIn, isLoading, error }: LoginFormProps) {
  return (
    <div className="flex min-h-screen bg-white font-sans">
      
      {/*left Panel*/}
      <div className="relative hidden lg:flex flex-col justify-between w-[55%] bg-[#062c1e] p-12 lg:p-16 overflow-hidden text-white">
        
        {/*Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#062c1e]/80 via-[#062c1e]/70 to-[#062c1e] z-10"></div>
        
          <img
            src="/HenrySy.jpg"
            alt="University Campus" 
            className="w-full h-full object-cover opacity-40 mix-blend-luminosity" 
          />
        </div>

        {/* Top Logo */}
        <div className="relative z-20">
          <Link href="/" className="inline-block hover:opacity-80 transition-opacity">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              LaSallian.Me
            </h1>
          </Link>
        </div>

        {/* Center Content */}
        <div className="relative z-20 mt-20 mb-auto pt-24">
          
          <h2 className="text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight mb-6">
            The Digital Hub for<br />Archer <span className="text-[#c2f068]">Innovation.</span>
          </h2>
          <p className="text-lg text-gray-300 max-w-md font-light leading-relaxed">
            The centralized hub for all La Salle Computer Society applications and community tools.
          </p>
        </div>

        {/* Bottom Stats */}
        {/* Mock details */}
        <div className="relative z-20 flex space-x-16 border-t border-white/10 pt-8 mt-12">
          <div>
            <div className="text-3xl font-bold text-white mb-1">10+</div>
            <div className="text-[10px] tracking-widest text-gray-400 uppercase font-semibold">Student-led projects</div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex flex-col justify-center w-full lg:w-[45%] px-8 sm:px-16 xl:px-24 py-12 relative overflow-y-auto">
        
        {/* Back to Home Button */}
        <div className="absolute top-8 left-8 sm:left-16 xl:left-24">
          <Link 
            href="/" 
            className="flex items-center text-sm font-medium text-gray-400 hover:text-[#062c1e] transition-colors"
          >
            <FiArrowLeft className="mr-2 w-4 h-4" />
            Back to Home
          </Link>
        </div>

        <div className="max-w-md w-full mx-auto mt-8">
          
          {/* Mobile Logo */}
          <div className="lg:hidden mb-12 mt-4">
            <Link href="/" className="inline-block hover:opacity-80 transition-opacity">
              <h1 className="text-3xl font-bold tracking-tight text-[#062c1e]">
                LaSallian<span className="text-[#84a938]">.Me</span>
              </h1>
            </Link>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">Welcome Back</h2>
          <p className="text-gray-500 text-sm mb-10">Sign in with your DLSU Google account to access your profile and write your own reviews</p>

          {error && (
            <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100 font-medium">
              {error}
            </div>
          )}

          <div className="space-y-6">
            {/* Primary Google Login Button */}
            <button
              onClick={onGoogleSignIn}
              disabled={isLoading}
              className="w-full flex items-center justify-center py-4 px-6 text-base font-medium bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-xl shadow-sm transition-all duration-200 ease-in-out hover:shadow-md hover:border-gray-400 focus:ring-4 focus:ring-gray-100 disabled:opacity-70"
            >
              <FcGoogle className="w-6 h-6 mr-3" />
              <span>{isLoading ? 'Connecting securely...' : 'Sign in with Google'}</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}