'use client';

import { AdminsPanel } from '../components/AdminsPanel';
import { PublishersPanel } from '../components/PublishersPanel';
import { MembersPanel } from '../components/MembersPanel';

function SectionHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-base font-semibold text-white">{title}</h2>
      {description && <p className="text-sm text-white/40 mt-0.5">{description}</p>}
    </div>
  );
}

export function MembersContainer() {
  return (
    <div className="flex flex-col gap-10">
      <section>
        <SectionHeader title="Admins" description="Users with admin access to this dashboard." />
        <AdminsPanel />
      </section>

      <section>
        <SectionHeader title="App Publishers" description="Members who have submitted at least one app." />
        <PublishersPanel />
      </section>

      <section>
        <SectionHeader title="Members" description="All regular members, sorted by most recent login." />
        <MembersPanel />
      </section>
    </div>
  );
}
