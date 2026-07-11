export default function Loading() {
  return (
    <div className="bg-gray-50 min-h-screen px-4 sm:px-8 lg:px-16 py-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12">

        {/* Sidebar skeleton */}
        <div className="hidden md:flex flex-col gap-6 md:w-56 flex-shrink-0 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="space-y-2.5">
            {[80, 100, 65, 90].map(w => (
              <div key={w} className="h-3 bg-gray-200 rounded" style={{ width: `${w}%` }} />
            ))}
          </div>
          <div className="h-px bg-gray-200" />
          <div className="space-y-2.5">
            <div className="h-3 bg-gray-200 rounded w-1/2" />
            <div className="h-2 bg-gray-200 rounded w-full" />
            <div className="h-2 bg-gray-200 rounded w-full" />
          </div>
        </div>

        {/* Grid skeleton */}
        <div className="flex-1">
          <div className="flex justify-between mb-8 animate-pulse">
            <div className="space-y-2">
              <div className="h-6 bg-gray-200 rounded w-24" />
              <div className="h-3 bg-gray-200 rounded w-16" />
            </div>
            <div className="h-9 bg-gray-200 rounded-lg w-32" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="aspect-[4/5] bg-gray-200 rounded-t-xl" />
                <div className="p-4 space-y-2.5">
                  <div className="h-3 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-8 bg-gray-200 rounded-full mt-3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
