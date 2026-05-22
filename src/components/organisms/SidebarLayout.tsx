import React from 'react';

export interface SidebarNavItem<T extends string = string> {
  id: T;
  label: string;
  icon?: React.ReactNode;
  badge?: number;
}

export interface SidebarNavSection<T extends string = string> {
  label?: string;
  items: SidebarNavItem<T>[];
}

interface SidebarLayoutProps<T extends string = string> {
  sections: SidebarNavSection<T>[];
  activeId: T;
  onSelect: (id: T) => void;
  children: React.ReactNode;
  title?: string;
  sidebarHeader?: React.ReactNode;
  sidebarWidth?: string;
}

export function SidebarLayout<T extends string = string>({
  sections,
  activeId,
  onSelect,
  children,
  title,
  sidebarHeader,
  sidebarWidth = 'w-52',
}: SidebarLayoutProps<T>) {
  const allItems = sections.flatMap((s) => s.items);

  return (
    <div className="flex flex-col h-full sm:flex-row">
      {/* Mobile top navbar */}
      <div className="sm:hidden shrink-0 flex flex-col border-b border-white/8">
        {sidebarHeader && <div className="px-4 py-3">{sidebarHeader}</div>}
        <nav className="flex overflow-x-auto">
          {allItems.map((item) => (
            <button
              key={item.id as string}
              onClick={() => onSelect(item.id)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                activeId === item.id
                  ? 'text-white border-white'
                  : 'text-white/40 border-transparent hover:text-white/70'
              }`}
            >
              {item.icon && (
                <span className="w-4 h-4 shrink-0 flex items-center justify-center">
                  {item.icon}
                </span>
              )}
              {item.label}
              {item.badge != null && item.badge > 0 && (
                <span className="text-[10px] font-semibold bg-white/15 text-white/60 rounded-full px-1.5 py-0.5 min-w-[18px] text-center leading-none">
                  {item.badge > 9 ? '9+' : item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Desktop sidebar */}
      <nav className={`sidebar-nav hidden sm:flex ${sidebarWidth} shrink-0 flex-col py-6 px-3 overflow-y-auto`}>
        {sidebarHeader && <div className="mb-4">{sidebarHeader}</div>}
        {title && (
          <p className="px-3 mb-5 text-sm font-semibold text-white/60 font-display">{title}</p>
        )}
        <div className="flex flex-col gap-5">
          {sections.map((section, i) => (
            <div key={i}>
              {section.label && (
                <p className="px-3 mb-1 text-[11px] font-semibold uppercase tracking-wider text-white/30">
                  {section.label}
                </p>
              )}
              <ul className="flex flex-col gap-0.5">
                {section.items.map((item) => (
                  <li key={item.id as string}>
                    <button
                      onClick={() => onSelect(item.id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeId === item.id
                          ? 'bg-white/10 text-white'
                          : 'text-white/50 hover:text-white/80 hover:bg-white/[0.05]'
                      }`}
                    >
                      {item.icon && (
                        <span className="w-4 h-4 shrink-0 flex items-center justify-center">
                          {item.icon}
                        </span>
                      )}
                      {item.label}
                      {item.badge != null && item.badge > 0 && (
                        <span className="ml-auto text-[10px] font-semibold bg-white/15 text-white/60 rounded-full px-1.5 py-0.5 min-w-[18px] text-center leading-none">
                          {item.badge > 99 ? '99+' : item.badge}
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </nav>

      <main className="flex-1 min-w-0 py-6 px-5 sm:py-8 sm:px-6 lg:px-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
