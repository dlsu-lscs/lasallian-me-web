'use client';

import { useUIStore } from '@/store/uiStore';
import LoginFormContainer from './LoginFormContainer';

export function GlobalLoginModal() {
  const isOpen = useUIStore((s) => s.isLoginModalOpen);
  const onClose = useUIStore((s) => s.closeLoginModal);

  return <LoginFormContainer mode="modal" isOpen={isOpen} onClose={onClose} />;
}
