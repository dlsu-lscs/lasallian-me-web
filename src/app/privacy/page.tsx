import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Privacy Policy' };

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 sm:py-8 -mt-4 sm:mt-0">
      <div className="bg-black/60 backdrop-blur-lg border border-white/10 shadow-[var(--shadow-glass)] rounded-2xl overflow-hidden">

        {/* Header band */}
        <div className="px-7 pt-8 pb-6 border-b border-white/8">
          <p className="text-xs font-mono text-primary-400 uppercase tracking-widest mb-2">Legal</p>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-white/95 leading-tight mb-1">
            Privacy Policy
          </h1>
          <p className="text-xs text-white/35">
            Last updated: May 22, 2026 &nbsp;&middot;&nbsp; Effective immediately
          </p>
        </div>

        {/* Body */}
        <div className="px-7 py-8 space-y-9 text-[15px] leading-relaxed text-white/65 font-body">

          <section>
            <p>
              This Privacy Policy explains how{' '}
              <span className="text-white/90 font-medium">pana</span>, operated by the{' '}
              <span className="text-white/90 font-medium">La Salle Computer Society (LSCS)</span>,
              collects, uses, and protects information when you use this platform. By using pana,
              you agree to the practices described here.
            </p>
          </section>

          <Divider />

          <section>
            <SectionTitle number="1" title="Information We Collect" />

            <SubTitle>Account Information (via Google Sign-In)</SubTitle>
            <p className="mb-3">
              When you sign in with your DLSU Google account, we receive the following from Google:
            </p>
            <DataTable
              rows={[
                ['Name', 'Your full display name'],
                ['Email address', 'Your @dlsu.edu.ph email'],
                ['Profile picture', 'Your Google account avatar URL'],
              ]}
            />

            <SubTitle className="mt-6">Content You Submit</SubTitle>
            <p className="mb-3">
              When you use platform features, we store the content you provide:
            </p>
            <DataTable
              rows={[
                ['App submissions', 'Title, description, slug, links, tags, icon and preview images'],
                ['Ratings and reviews', 'Star score, comment text, anonymity preference'],
                ['Favorites', 'List of app IDs you have favorited'],
                ['Claim requests', 'Your account details and the reason text you provide'],
              ]}
            />

            <SubTitle className="mt-6">Usage Data</SubTitle>
            <p>
              We use <span className="text-white/90">Google Analytics</span> to collect anonymized
              data about how users interact with the platform — pages visited, session duration, and
              general traffic patterns. This data does not identify you personally.
            </p>
          </section>

          <Divider />

          <section>
            <SectionTitle number="2" title="How We Use Your Information" />
            <ul className="space-y-2 pl-1">
              <Item>To provide and operate platform features (app listings, reviews, favorites).</Item>
              <Item>To authenticate your identity and maintain your session.</Item>
              <Item>
                To moderate content and enforce our{' '}
                <Link
                  href="/terms"
                  className="text-primary-400 hover:text-primary-300 underline underline-offset-2 transition-colors"
                >
                  Terms of Service
                </Link>
                .
              </Item>
              <Item>To process app claim requests and admin review actions.</Item>
              <Item>
                To understand aggregate usage patterns via Google Analytics and improve the platform.
              </Item>
            </ul>
            <p className="mt-4">
              We do not use your data for advertising, profiling, or any commercial purpose beyond
              operating pana.
            </p>
          </section>

          <Divider />

          <section>
            <SectionTitle number="3" title="Anonymous Reviews" />
            <div className="bg-white/[0.04] border border-white/10 rounded-xl px-5 py-4">
              <p>
                Reviews you post with the{' '}
                <span className="text-white/90 font-medium">anonymous</span> option hide your name
                and profile picture from other users. However, your review remains internally linked
                to your account and is visible to platform administrators for moderation and
                trust-and-safety purposes.{' '}
                <span className="text-white/90">Anonymous does not mean untraceable.</span>
              </p>
            </div>
          </section>

          <Divider />

          <section>
            <SectionTitle number="4" title="Third-Party Services" />
            <p className="mb-4">pana relies on the following third-party services:</p>
            <div className="space-y-3">
              <ThirdParty
                name="Google"
                purpose="Account authentication (OAuth) and usage analytics (Google Analytics)"
                link="https://policies.google.com/privacy"
              />
              <ThirdParty
                name="Amazon Web Services (S3)"
                purpose="Storage for app icons and preview images you upload"
                link="https://aws.amazon.com/privacy/"
              />
            </div>
            <p className="mt-4">
              Each of these services has its own privacy policy that governs how they handle data
              processed on our behalf.
            </p>
          </section>

          <Divider />

          <section>
            <SectionTitle number="5" title="Data Sharing and Disclosure" />
            <p className="mb-4">
              We do not sell, rent, or trade your personal information. We may share information in
              the following limited circumstances:
            </p>
            <ul className="space-y-2 pl-1">
              <Item>
                <strong className="text-white/80">With third-party service providers</strong> listed
                above, solely to operate the platform.
              </Item>
              <Item>
                <strong className="text-white/80">
                  With DLSU&apos;s Student Discipline Formation Office (SDFO)
                </strong>{' '}
                when we determine that a user&apos;s conduct warrants institutional disciplinary
                review. See our{' '}
                <Link
                  href="/terms"
                  className="text-primary-400 hover:text-primary-300 underline underline-offset-2 transition-colors"
                >
                  Terms of Service
                </Link>{' '}
                for details. In such cases, we may disclose relevant account information, review
                content, or activity logs.
              </Item>
              <Item>
                <strong className="text-white/80">When required by law</strong> — if we are legally
                compelled to disclose information, we will do so to the minimum extent required.
              </Item>
            </ul>
          </section>

          <Divider />

          <section>
            <SectionTitle number="6" title="Data Retention" />
            <p className="mb-3">
              Your account data and content are retained for as long as your account is active on
              the platform. If you request account deletion, we will remove your personal
              information from our records. Note that:
            </p>
            <ul className="space-y-2 pl-1">
              <Item>
                App listings you submitted may be retained in an anonymized or unclaimed state at
                platform administrators&apos; discretion if the listing itself is of community value.
              </Item>
              <Item>
                Anonymized analytics data (via Google Analytics) is retained per Google&apos;s own
                data retention settings.
              </Item>
            </ul>
            <p className="mt-4">
              To request account or data deletion, contact us through the link in Section 8.
            </p>
          </section>

          <Divider />

          <section>
            <SectionTitle number="7" title="Changes to This Policy" />
            <p>
              We may update this Privacy Policy from time to time. We will note the revised date at
              the top of this page. Continued use of pana after changes are posted constitutes your
              acceptance of the updated policy.
            </p>
          </section>

          <Divider />

          <section>
            <SectionTitle number="8" title="Contact" />
            <p>
              For privacy-related questions or data deletion requests, contact the LSCS team via{' '}
              <a
                href="https://dlsu-lscs.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-400 hover:text-primary-300 underline underline-offset-2 transition-colors"
              >
                dlsu-lscs.org
              </a>
              .
            </p>
          </section>

          {/* Footer nav */}
          <div className="pt-2 border-t border-white/8 flex gap-6 text-sm">
            <Link
              href="/terms"
              className="text-primary-400 hover:text-primary-300 transition-colors"
            >
              Terms of Service
            </Link>
            <Link href="/" className="text-white/35 hover:text-white/60 transition-colors">
              Back to Apps
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

function SectionTitle({ number, title }: { number: string; title: string }) {
  return (
    <h2 className="font-display font-semibold text-base text-white/90 mb-3 flex items-baseline gap-2">
      <span className="font-mono text-primary-500 text-xs">{number}.</span>
      {title}
    </h2>
  );
}

function SubTitle({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <h3
      className={`font-display font-medium text-white/70 text-xs uppercase tracking-wide mb-2 ${className}`}
    >
      {children}
    </h3>
  );
}

function Divider() {
  return <hr className="border-white/[0.07]" />;
}

function Item({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="mt-[6px] w-1.5 h-1.5 rounded-full bg-primary-500 shrink-0" />
      <span>{children}</span>
    </li>
  );
}

function DataTable({ rows }: { rows: [string, string][] }) {
  return (
    <div className="rounded-xl border border-white/[0.08] overflow-hidden">
      {rows.map(([label, desc], i) => (
        <div
          key={i}
          className={`flex gap-4 px-4 py-3 ${i < rows.length - 1 ? 'border-b border-white/[0.06]' : ''}`}
        >
          <span className="text-white/85 font-medium text-sm w-36 shrink-0">{label}</span>
          <span className="text-white/45 text-sm">{desc}</span>
        </div>
      ))}
    </div>
  );
}

function ThirdParty({ name, purpose, link }: { name: string; purpose: string; link: string }) {
  return (
    <div className="flex gap-4 bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3">
      <div className="min-w-0">
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-white/85 hover:text-primary-300 transition-colors text-sm"
        >
          {name} ↗
        </a>
        <p className="text-white/45 text-sm mt-0.5">{purpose}</p>
      </div>
    </div>
  );
}
