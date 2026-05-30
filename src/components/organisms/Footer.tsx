import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mt-16 w-full bg-black/60 backdrop-blur-lg border-t border-white/10">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-11 flex items-center justify-between gap-3 text-xs text-white/30">
        <span>
          &copy; {new Date().getFullYear()}{' '}
          <a
            href="https://dlsu-lscs.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white/60 transition-colors"
          >
            La Salle Computer Society
          </a>
        </span>
        <div className="flex items-center gap-5">
          <Link href="/terms" className="hover:text-white/60 transition-colors">
            Terms
          </Link>
          <Link href="/privacy" className="hover:text-white/60 transition-colors">
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}
