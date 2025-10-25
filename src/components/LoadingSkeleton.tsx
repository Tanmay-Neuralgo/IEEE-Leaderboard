export default function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-end justify-center gap-8 mb-12 flex-wrap lg:flex-nowrap px-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="glassmorphism rounded-2xl w-full max-w-xs h-80 mb-6" />
            <div className={`bg-gradient-to-t from-[#498099] to-[#30CDB7] w-36 rounded-t-2xl ${i === 2 ? 'h-52' : i === 1 ? 'h-36' : 'h-28'}`} />
          </div>
        ))}
      </div>

      {[...Array(5)].map((_, i) => (
        <div key={i} className="glassmorphism rounded-xl p-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#2D2D44] rounded-full" />
            <div className="flex-grow space-y-2">
              <div className="h-6 bg-[#2D2D44] rounded w-1/3" />
              <div className="h-4 bg-[#2D2D44] rounded w-1/4" />
              <div className="h-3 bg-[#2D2D44] rounded w-full mt-3" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
