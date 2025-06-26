/**
 * Skeleton Loading Components
 * Provides smooth loading states for various UI elements
 */

"use client";

// Base skeleton component
export function Skeleton({ className = "", ...props }) {
  return (
    <div
      className={`animate-pulse bg-gray-700/50 rounded ${className}`}
      {...props}
    />
  );
}

// Movie detail header skeleton
export function MovieDetailSkeleton() {
  return (
    <div className="relative">
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 py-6 sm:py-8">
        {/* Poster Skeleton */}
        <div className="lg:col-span-1">
          <div className="relative aspect-[2/3] max-w-xs sm:max-w-sm mx-auto lg:mx-0">
            <Skeleton className="w-full h-full rounded-lg" />
          </div>
        </div>

        {/* Movie Info Skeleton */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Title */}
          <div className="flex items-start justify-between gap-3 sm:gap-4">
            <div className="flex-1 min-w-0 space-y-3">
              <Skeleton className="h-8 sm:h-10 lg:h-12 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
            </div>
            <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />
          </div>

          {/* Details badges */}
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <Skeleton className="h-8 w-24 rounded-full" />
            <Skeleton className="h-8 w-16 rounded-full" />
            <Skeleton className="h-8 w-20 rounded-full" />
            <Skeleton className="h-8 w-28 rounded-full" />
          </div>

          {/* Genres */}
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-8 w-16 rounded-full" />
            <Skeleton className="h-8 w-20 rounded-full" />
            <Skeleton className="h-8 w-18 rounded-full" />
          </div>

          {/* Overview */}
          <div className="space-y-3">
            <Skeleton className="h-6 w-24" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>

          {/* Additional details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Cast section skeleton
export function CastSkeleton() {
  return (
    <section className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-4 w-32" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 sm:gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="space-y-3">
            <Skeleton className="aspect-[2/3] w-full rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// Movie card skeleton (for similar movies grid)
export function MovieCardSkeleton() {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg">
      <Skeleton className="aspect-[2/3] w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-full" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-3/4" />
        </div>
      </div>
    </div>
  );
}

// Similar movies section skeleton
export function SimilarMoviesSkeleton({ count = 10 }) {
  return (
    <section className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-8 w-32" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {Array.from({ length: count }).map((_, index) => (
          <MovieCardSkeleton key={index} />
        ))}
      </div>
    </section>
  );
}

// Generic grid skeleton
export function GridSkeleton({ 
  columns = "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
  count = 10,
  itemComponent: ItemComponent = MovieCardSkeleton
}) {
  return (
    <div className={`grid ${columns} gap-6`}>
      {Array.from({ length: count }).map((_, index) => (
        <ItemComponent key={index} />
      ))}
    </div>
  );
}

// Loading spinner with text
export function LoadingSpinnerWithText({ text = "Loading...", size = "md" }) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8"
  };

  return (
    <div className="flex items-center justify-center space-x-3 text-gray-400">
      <div className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-gray-600 border-t-blue-500`} />
      <span className="text-sm">{text}</span>
    </div>
  );
}
