
export function ProfileTabs({ activeTab, onTabChange }: { activeTab: string; onTabChange: (tab: string) => void }) {
  const tabs = ['Apps', 'My Reviews', 'Favorites'];
  return (
    <div className="flex gap-1">
      {tabs.map((tab) => {
        const key = tab.toLowerCase();
        const isActive = activeTab === key;
        return (
          <button
            key={tab}
            onClick={() => onTabChange(key)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors cursor-pointer ${
              isActive
                ? 'bg-white/10 text-white'
                : 'text-white/40 hover:text-white/70 hover:bg-white/5'
            }`}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}
