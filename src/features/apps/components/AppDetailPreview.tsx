'use client';

import { Application } from '../types/app.types';
import { AppDetail } from './AppDetail';

interface AppDetailPreviewProps {
  app: Application;
}

export function AppDetailPreview({ app }: AppDetailPreviewProps) {
  return (
    <div className="h-full overflow-y-auto">
      <div className="px-4 py-4">
        <AppDetail
          app={app}
          preview
          favoritesCount={app.favoritesCount ?? 0}
          isLoggedIn={false}
          averageScore={app.averageRating ?? 0}
          totalRatings={app.ratingCount ?? 0}
        />
      </div>
    </div>
  );
}
