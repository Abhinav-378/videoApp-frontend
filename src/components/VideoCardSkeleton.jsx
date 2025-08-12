export default function VideoCardSkeleton() {
  return (
    <div className="w-72">
      {/* Thumbnail skeleton */}
      <div className="w-full h-40 bg-gray-500 animate-pulse rounded-xl"></div>

      {/* Title skeleton */}
      <div className="mt-3 h-4 bg-gray-500 animate-pulse rounded"></div>

      {/* Channel name skeleton */}
      <div className="mt-2 h-3 w-1/2 bg-gray-500 animate-pulse rounded"></div>

      {/* Views & date skeleton */}
      <div className="mt-1 h-3 w-1/3 bg-gray-500 animate-pulse rounded"></div>
    </div>
  );
}
