interface ProgressBarProps {
  current: number;
  max: number;
  rank: number;
  animated?: boolean;
}

export default function ProgressBar({ current, max, rank, animated = true }: ProgressBarProps) {
  const percentage = max > 0 ? Math.min((current / max) * 100, 100) : 0;

  const getBarColor = () => {
    if (rank === 1) return 'from-[#FFD700] to-[#FFA500]';
    if (rank === 2) return 'from-[#C0C0C0] to-[#A8A8A8]';
    if (rank === 3) return 'from-[#CD7F32] to-[#B8722A]';
    return 'from-[#498099] to-[#30CDB7]';
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold text-[#E8E8EE]">
          {current} / {max} points
        </span>
        <span className="text-sm font-bold text-[#30CDB7]">
          {percentage.toFixed(0)}%
        </span>
      </div>
      <div className="relative w-full h-3 bg-[#2D2D44] rounded-full overflow-hidden border border-[#E8E8EE]/20">
        <div
          className={`absolute top-0 left-0 h-full bg-gradient-to-r ${getBarColor()} rounded-full ${
            animated ? 'transition-all duration-500 ease-out' : ''
          }`}
          style={{ width: `${percentage}%` }}
        >
          <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
