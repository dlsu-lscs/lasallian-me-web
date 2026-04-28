import { AppCardSkeleton } from '@/components/molecules/AppCardSkeleton';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, i) => (
            <AppCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
