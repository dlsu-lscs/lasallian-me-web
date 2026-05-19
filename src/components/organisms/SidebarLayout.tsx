import React from 'react';

export interface SidebarNavItem<T extends string = string> {
  id: T;
  label: string;
  icon?: React.ReactNode;
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
  return (
    <div className="flex h-full">
      <nav className={`sidebar-nav ${sidebarWidth} shrink-0 flex flex-col py-6 px-3 overflow-y-auto`}>
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
                  <li key={item.id}>
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
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </nav>

      <main className="flex-1 min-w-0 py-8 px-6 lg:px-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
