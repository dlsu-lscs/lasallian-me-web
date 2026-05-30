'use client';

import { useState } from 'react';
import { LoginForm } from '../components/LoginForm';
import { LoginModal } from '../components/LoginModal';
import { authClient } from '@/lib/auth-client';

interface LoginFormContainerProps {
  mode?: 'page' | 'modal';
  isOpen?: boolean;
  onClose?: () => void;
}

export default function LoginFormContainer({ mode = 'page', isOpen = false, onClose }: LoginFormContainerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await authClient.signIn.social({
        provider: 'google',
        callbackURL: window.location.origin,
      });
    } catch (err) {
      // console.error('Authentication failed:', err);
      setError('Failed to authenticate. Please ensure you are using a valid DLSU email.');
      setIsLoading(false);
    }
  };

  if (mode === 'modal') {
    return (
      <LoginModal
        isOpen={isOpen}
        onClose={onClose ?? (() => {})}
        onGoogleSignIn={handleGoogleSignIn}
        isLoading={isLoading}
        error={error}
      />
    );
  }

  return (
    <LoginForm
      onGoogleSignIn={handleGoogleSignIn}
      isLoading={isLoading}
      error={error}
    />
  );
}