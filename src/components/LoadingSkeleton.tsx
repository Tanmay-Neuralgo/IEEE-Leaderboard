export default function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-end justify-center gap-8 mb-12">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="bg-gray-200 rounded-2xl w-64 h-64 mb-4" />
            <div className={`bg-gray-200 w-32 rounded-t-xl ${i === 2 ? 'h-48' : i === 1 ? 'h-32' : 'h-24'}`} />
          </div>
        ))}
      </div>

      {[...Array(5)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full" />
            <div className="flex-grow">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/4" />
            </div>
            <div className="h-8 bg-gray-200 rounded w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}
