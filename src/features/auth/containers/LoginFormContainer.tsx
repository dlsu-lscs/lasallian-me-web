'use client';

import { useState } from 'react';
import { LoginForm } from '../components/LoginForm';
import { authClient } from '@/lib/auth-client';

export default function LoginFormContainer() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await authClient.signIn.social({
        provider: 'google',
        callbackURL: '/', // Redirect back to the apps directory upon success
      });
    } catch (err) {
      setError('Failed to authenticate. Please ensure you are using a valid DLSU email.');
      setIsLoading(false);
    }
  };

  return (
    <LoginForm
      onGoogleSignIn={handleGoogleSignIn}
      isLoading={isLoading}
      error={error}
    />
  );
}