import { AdminTab } from '../types/admin.types';

interface AdminTabsProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
}

const TABS: { label: string; value: AdminTab }[] = [
  { label: 'Apps', value: 'apps' },
  { label: 'Approval Queue', value: 'approval' },
];

export function AdminTabs({ activeTab, onTabChange }: AdminTabsProps) {
  return (
    <div className="flex w-full border border-black rounded-xl overflow-hidden">
      {TABS.map((tab, i) => (
        <button
          key={tab.value}
          onClick={() => onTabChange(tab.value)}
          className={`flex-1 py-4 transition-colors ${i < TABS.length - 1 ? 'border-r border-black' : ''} ${
            activeTab === tab.value ? 'bg-gray-100' : 'bg-white'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
