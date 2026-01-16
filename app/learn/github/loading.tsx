export default function Loading() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress Bar Skeleton */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="h-4 bg-secondary rounded w-32 mb-2 animate-pulse"></div>
          <div className="w-full bg-secondary rounded-full h-2.5 overflow-hidden animate-pulse"></div>
          <div className="h-3 bg-secondary rounded w-24 mt-2 animate-pulse"></div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Sidebar Skeleton */}
        <aside className="hidden lg:block w-80 bg-card border-r border-border p-6">
          <div className="h-6 bg-secondary rounded w-32 mb-4 animate-pulse"></div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="mb-4 flex items-center gap-3 animate-pulse">
              <div className="w-5 h-5 bg-secondary rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-secondary rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-secondary rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </aside>

        {/* Content Skeleton */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            <div className="h-10 bg-secondary rounded w-2/3 mb-8 animate-pulse"></div>
            <div className="space-y-4">
              <div className="h-4 bg-secondary rounded w-full animate-pulse"></div>
              <div className="h-4 bg-secondary rounded w-5/6 animate-pulse"></div>
              <div className="h-4 bg-secondary rounded w-4/5 animate-pulse"></div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
