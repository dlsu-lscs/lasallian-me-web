import { Skeleton } from '@/components/atoms/Skeleton';

export function AppCardSkeleton() {
  return (
    <div className="glass-md rounded-xl p-3 flex flex-col">
      {/* Image */}
      <Skeleton className="w-full h-45 mb-4 rounded-xl" />

      {/* Title row */}
      <div className="flex items-center justify-between mb-2">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-4 w-8" />
      </div>

      {/* Description */}
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-5/6 mb-2" />
      <Skeleton className="h-4 w-4/6 mb-4" />

      {/* Tags */}
      <div className="flex gap-2">
        <Skeleton className="h-5 w-12 rounded-full" />
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-10 rounded-full" />
      </div>
    </div>
  );
}
