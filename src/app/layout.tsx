import type { Metadata } from 'next';
import { Sora, DM_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/organisms/Navbar';
import { Footer } from '@/components/organisms/Footer';
import { QueryProvider } from '@/providers/QueryProvider';
import { Toaster } from '@/components/atoms/Toaster';
import { GlobalLoginModal } from '@/features/auth/containers/GlobalLoginModal';

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  weight: ['300', '400', '500'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  weight: ['400', '500'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL!),
  title: {
    template: '%s | pana',
    default: 'pana',
  },
  description:
    'Discover apps built by the La Sallian community. Managed by LSCS, the premier tech organization of De La Salle University',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
  },
  openGraph: {
    siteName: 'pana',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${sora.variable} ${dmSans.variable} ${jetbrainsMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <QueryProvider>
          <Navbar />
          <main className="pt-4">
            {children}
          </main>
          <Footer />
          <Toaster />
          <GlobalLoginModal />
        </QueryProvider>
      </body>
    </html>
  );
}

