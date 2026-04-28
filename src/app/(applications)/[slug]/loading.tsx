import { Skeleton } from '@/components/atoms/Skeleton';

export default function AppDetailLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <Skeleton className="h-8 w-2/3 mb-4" />
        <Skeleton className="h-5 w-1/3 mb-8" />

        {/* Image */}
        <Skeleton className="w-full h-64 rounded-xl mb-8" />

        {/* Description */}
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6 mb-2" />
        <Skeleton className="h-4 w-4/6 mb-8" />

        {/* Tags */}
        <div className="flex gap-2 mb-8">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-14 rounded-full" />
        </div>
      </div>
    </div>
  );
}
