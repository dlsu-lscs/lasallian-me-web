import type { Metadata } from 'next';
import { SubmitContainer } from '@/features/submit/containers/SubmitContainer';

export const metadata: Metadata = { title: 'Submit an App' };

export default function SubmitPage() {
  return <SubmitContainer />;
}
