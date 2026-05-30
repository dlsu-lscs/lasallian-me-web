import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Terms of Service' };

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 sm:py-8 -mt-4 sm:mt-0">
      <div className="bg-black/60 backdrop-blur-lg border border-white/10 shadow-[var(--shadow-glass)] rounded-2xl overflow-hidden">

        {/* Header band */}
        <div className="px-7 pt-8 pb-6 border-b border-white/8">
          <p className="text-xs font-mono text-primary-400 uppercase tracking-widest mb-2">Legal</p>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-white/95 leading-tight mb-1">
            Terms of Service
          </h1>
          <p className="text-xs text-white/35">
            Last updated: May 22, 2026 &nbsp;&middot;&nbsp; Effective immediately
          </p>
        </div>

        {/* Body */}
        <div className="px-7 py-8 space-y-9 text-[15px] leading-relaxed text-white/65 font-body">

          <section>
            <p>
              Welcome to <span className="text-white/90 font-medium">pana</span> — a community
              directory for apps built by La Sallian students and developers, maintained by the{' '}
              <span className="text-white/90 font-medium">La Salle Computer Society (LSCS)</span>{' '}
              of De La Salle University (DLSU). By accessing or using this platform, you agree to
              these Terms of Service. If you do not agree, please do not use the platform.
            </p>
          </section>

          <Divider />

          <section>
            <SectionTitle number="1" title="Who Can Use This Platform" />
            <p>
              Anyone may browse the app directory without an account. To submit apps, post reviews,
              or save favorites, you must sign in using a valid{' '}
              <span className="text-white/90">DLSU Google Workspace account</span> (
              <span className="font-mono text-primary-400 text-sm">@dlsu.edu.ph</span>). Access to
              account features is a privilege, not a right, and may be revoked for violations of
              these Terms.
            </p>
          </section>

          <Divider />

          <section>
            <SectionTitle number="2" title="App Submissions" />
            <p className="mb-4">
              The Submit App feature exists to showcase genuine projects created by La Sallian
              developers. By submitting an app, you represent that:
            </p>
            <ul className="space-y-2 mb-5 pl-1">
              <Rule>
                The app is an original project you or your team created — not a copy, clone, or
                plagiarized version of another work.
              </Rule>
              <Rule>
                The title, description, links, tags, and media you provide accurately represent the
                app as submitted. Misleading or deliberately false information is prohibited.
              </Rule>
              <Rule>
                If you are claiming ownership of an existing listing, the app is genuinely yours
                and you are not misrepresenting your association with it.
              </Rule>
            </ul>
            <p className="mb-4">The following are strictly prohibited:</p>
            <ul className="space-y-2 pl-1">
              <Rule variant="warn">
                <strong className="text-white/80">Duplicate submissions.</strong> Do not submit an
                app that already exists on the platform, whether under a different name or slightly
                reworded description.
              </Rule>
              <Rule variant="warn">
                <strong className="text-white/80">Listing replacement via edits.</strong> You may
                not edit an existing app listing to replace it with a different, unrelated
                application. Each listing must represent the same app throughout its lifetime on the
                platform. Updates to an existing app (new features, changed links, revised
                descriptions) are permitted; substituting a completely different app is not.
              </Rule>
              <Rule variant="warn">
                <strong className="text-white/80">Spam or placeholder submissions.</strong> Do not
                submit apps that are incomplete, non-functional, or created solely to occupy a
                listing or slug.
              </Rule>
            </ul>
            <p className="mt-4">
              All submissions enter a pending review queue. Admins may approve, request changes to,
              or remove any submission at their discretion.
            </p>
          </section>

          <Divider />

          <section>
            <SectionTitle number="3" title="Reviews and Ratings" />
            <p className="mb-4">
              The rating system exists to help the community make informed decisions about the apps
              listed here. Your reviews must be honest, relevant, and constructive. The following
              are prohibited:
            </p>
            <ul className="space-y-2 pl-1">
              <Rule variant="warn">
                <strong className="text-white/80">Fake or incentivized reviews.</strong> Do not
                post reviews you have been paid, pressured, or rewarded to post, and do not submit
                reviews for apps you have not genuinely used.
              </Rule>
              <Rule variant="warn">
                <strong className="text-white/80">Review bombing.</strong> Coordinated or
                mass-posting of negative (or positive) reviews to artificially skew an app&apos;s
                rating is strictly forbidden.
              </Rule>
              <Rule variant="warn">
                <strong className="text-white/80">Personal attacks.</strong> Reviews must critique
                the app, not its developer. Harassment, targeted insults, discriminatory language,
                or content intended to intimidate or harm another person have no place here.
              </Rule>
              <Rule variant="warn">
                <strong className="text-white/80">Irrelevant or off-topic content.</strong> Reviews
                must relate to your experience with the app. Do not use the review field to post
                advertisements, personal grievances unrelated to the app, or any other off-topic
                material.
              </Rule>
            </ul>
            <p className="mt-4">
              Reviews marked as <span className="text-white/90 font-medium">anonymous</span> hide
              your identity from other users, but your account remains linked to the review and is
              visible to platform administrators for moderation purposes.
            </p>
          </section>

          <Divider />

          <section>
            <SectionTitle number="4" title="Community Standards and the DLSU Student Handbook" />
            <p className="mb-3">
              pana is a platform built by and for the La Sallian community. All users — whether
              submitting apps, writing reviews, or interacting with others — are expected to uphold
              the values and standards set forth in the{' '}
              <span className="text-white/90 font-medium">DLSU Student Handbook</span>. Your
              conduct on this platform is an extension of your conduct as a member of the De La
              Salle University community.
            </p>
            <p>
              This means that behavior prohibited by the Student Handbook — including but not
              limited to academic dishonesty, harassment, discrimination, and conduct unbecoming of
              a La Sallian — is equally prohibited here, regardless of whether it occurs in an
              anonymous context.
            </p>
          </section>

          <Divider />

          <section>
            <SectionTitle number="5" title="Enforcement and SDFO Referrals" />
            <p className="mb-4">
              LSCS administrators reserve the right to remove any content and to suspend or
              permanently ban any account that violates these Terms, without prior notice.
            </p>
            <div className="bg-primary-900/30 border border-primary-700/40 rounded-xl px-5 py-4 mb-4">
              <p className="text-white/75">
                <strong className="text-white/95">SDFO Referral Policy:</strong> For violations
                that we believe rise to a level of seriousness warranting institutional action —
                including, but not limited to, targeted harassment, sustained abuse of platform
                features, or conduct that may also constitute a violation of the DLSU Student
                Handbook — we reserve the right to refer the matter to the{' '}
                <strong className="text-white/95">
                  Student Discipline Formation Office (SDFO)
                </strong>{' '}
                of De La Salle University. Any such referral may include relevant account
                information and content.
              </p>
            </div>
            <p>
              Enforcement decisions are made at the sole discretion of LSCS platform
              administrators. We encourage users who witness abuse to report it by contacting us
              directly.
            </p>
          </section>

          <Divider />

          <section>
            <SectionTitle number="6" title="Content Ownership and Platform Rights" />
            <p className="mb-3">
              You retain ownership of the content you submit. By posting content on pana, you grant
              LSCS a non-exclusive, royalty-free license to display, distribute, and moderate that
              content as part of operating the platform.
            </p>
            <p>
              LSCS reserves the right to remove, edit, or archive any content at any time for any
              reason, including but not limited to policy violations, platform maintenance, or
              sunset of a feature.
            </p>
          </section>

          <Divider />

          <section>
            <SectionTitle number="7" title="Disclaimers" />
            <p className="mb-3">
              pana is provided as-is. LSCS makes no guarantees about the accuracy, completeness, or
              availability of information on the platform. Apps listed here are submitted by
              community members; LSCS does not endorse, verify, or take responsibility for
              third-party applications.
            </p>
            <p>
              Links to external apps or services leave the pana platform and are governed by their
              own terms and policies.
            </p>
          </section>

          <Divider />

          <section>
            <SectionTitle number="8" title="Changes to These Terms" />
            <p>
              We may update these Terms from time to time. Continued use of the platform after
              changes are posted constitutes your acceptance of the revised Terms. Material changes
              will be communicated through the platform where reasonably practicable.
            </p>
          </section>

          <Divider />

          <section>
            <SectionTitle number="9" title="Contact" />
            <p>
              Questions about these Terms may be directed to the LSCS team via{' '}
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
              href="/privacy"
              className="text-primary-400 hover:text-primary-300 transition-colors"
            >
              Privacy Policy
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

function Divider() {
  return <hr className="border-white/[0.07]" />;
}

function Rule({
  children,
  variant = 'default',
}: {
  children: React.ReactNode;
  variant?: 'default' | 'warn';
}) {
  return (
    <li className="flex gap-3">
      <span
        className={`mt-[6px] w-1.5 h-1.5 rounded-full shrink-0 ${
          variant === 'warn' ? 'bg-warning' : 'bg-primary-500'
        }`}
      />
      <span>{children}</span>
    </li>
  );
}
