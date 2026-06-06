import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[calc(100dvh-10rem)] flex items-center justify-center px-4">
      <div className="glass-md rounded-2xl p-10 max-w-md w-full text-center animate-glass-enter">
        <svg
          className="mx-auto mb-6 text-primary-400/60"
          width="56"
          height="56"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
          <path d="M11 8v3m0 3v.01" />
        </svg>

        <p className="font-display text-8xl font-bold text-primary-400 leading-none mb-4">
          404
        </p>

        <h1 className="text-2xl font-semibold text-white/90 mb-3">
          Page Not Found
        </h1>

        <p className="text-sm text-white/55 mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <Link
          href="/"
          className="inline-flex items-center justify-center font-semibold rounded-full transition-colors bg-white text-black hover:bg-white/90 px-6 py-3 text-base cursor-pointer"
        >
          Go to App Directory
        </Link>
      </div>
    </div>
  );
}
