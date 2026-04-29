import type { Metadata } from 'next';
import LoginFormContainer from '@/features/auth/containers/LoginFormContainer';

export const metadata: Metadata = { title: 'Login' };

export default function LoginPage() {
  return <LoginFormContainer />;
}