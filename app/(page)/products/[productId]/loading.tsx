export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 lg:p-12">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 bg-white border border-gray-100 shadow-sm rounded-2xl overflow-hidden animate-pulse">

        {/* Image skeleton */}
        <div className="flex items-center justify-center p-10 bg-gray-50 border-b lg:border-b-0 lg:border-r border-gray-100">
          <div className="w-full aspect-square max-h-[450px] bg-gray-200 rounded-xl" />
        </div>

        {/* Info skeleton */}
        <div className="flex flex-col justify-center p-8 lg:p-16 space-y-5">
          <div className="flex gap-3">
            <div className="h-6 w-20 bg-gray-200 rounded-full" />
            <div className="h-6 w-16 bg-gray-200 rounded-full" />
          </div>
          <div className="h-8 bg-gray-200 rounded w-3/4" />
          <div className="h-8 bg-gray-200 rounded w-1/2" />
          <div className="space-y-2 pt-4">
            <div className="h-3 bg-gray-200 rounded w-full" />
            <div className="h-3 bg-gray-200 rounded w-full" />
            <div className="h-3 bg-gray-200 rounded w-2/3" />
          </div>
          <div className="flex gap-2 pt-4">
            <div className="h-10 bg-gray-200 rounded-xl w-16" />
            <div className="h-10 bg-gray-200 rounded-xl w-16" />
            <div className="h-10 bg-gray-200 rounded-xl w-16" />
          </div>
          <div className="flex gap-3 pt-2">
            <div className="h-14 bg-gray-200 rounded-xl flex-1" />
            <div className="h-14 w-14 bg-gray-200 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
