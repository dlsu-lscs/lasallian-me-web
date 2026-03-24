
export function ProfileTabs({ activeTab, onTabChange }: { activeTab: string, onTabChange: (tab: string) => void }) {
  const tabs = ['Apps', 'My Reviews', 'Favorites'];
  return (
    <div className="flex w-full border border-black rounded-xl overflow-hidden">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab.toLowerCase())}
          className={`flex-1 py-4 border-r last:border-r-0 border-black transition-colors
            ${activeTab === tab.toLowerCase() ? 'bg-gray-100' : 'bg-white'}`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}