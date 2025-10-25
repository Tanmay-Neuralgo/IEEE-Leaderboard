import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { LeaderboardEntry } from "../lib/googleSheets";
import ProgressBar from "./ProgressBar";

interface LeaderboardRowProps {
  participant: LeaderboardEntry;
  index: number;
}

export default function LeaderboardRow({
  participant,
  index,
}: LeaderboardRowProps) {
  const rankChange =
    participant.previous_rank && participant.rank
      ? participant.previous_rank - participant.rank
      : 0;

  const getRankBadge = (rank: number) => {
    if (rank <= 3) {
      const colors = {
        1: "bg-gradient-to-br from-[#FFD700] to-[#FFA500] text-white shadow-lg",
        2: "bg-gradient-to-br from-[#C0C0C0] to-[#A8A8A8] text-white shadow-lg",
        3: "bg-gradient-to-br from-[#CD7F32] to-[#B8722A] text-white shadow-lg",
      };
      return colors[rank as keyof typeof colors];
    }
    return "bg-[#2D2D44] text-[#30CDB7] border-2 border-[#498099]";
  };

  const getStatusBadge = () => {
    const statusStyles = {
      active: 'bg-[#00C896] text-white',
      completed: 'bg-[#30CDB7] text-white',
      'at risk': 'bg-[#FF8C42] text-white',
      failed: 'bg-[#FF4757] text-white',
    };

    const status = participant.status?.toLowerCase() || 'active';
    return statusStyles[status as keyof typeof statusStyles] || statusStyles.active;
  };

  return (
    <div
      className="glassmorphism rounded-xl p-5 mb-3 transition-all duration-300 hover:shadow-2xl hover:scale-[1.01] hover:border-[#852467] group"
      style={{
        animation: rankChange !== 0 ? "slideIn 0.5s ease-out" : undefined,
      }}
    >
      <div className="flex items-start gap-4">
        <div
          className={`flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl ${getRankBadge(
            participant.rank || index + 4
          )}`}
        >
          {participant.rank || index + 4}
        </div>

        <div className="flex-grow min-w-0 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-[#F7F7FA] truncate">
                {participant.name}
              </h3>
              {rankChange !== 0 && (
                <div
                  className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
                    rankChange > 0 ? "bg-[#00C896]/20 text-[#00C896]" : "bg-[#FF4757]/20 text-[#FF4757]"
                  }`}
                >
                  {rankChange > 0 ? (
                    <>
                      <TrendingUp className="w-3 h-3" />
                      <span>+{rankChange}</span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="w-3 h-3" />
                      <span>{rankChange}</span>
                    </>
                  )}
                </div>
              )}
              {rankChange === 0 && participant.previous_rank && (
                <Minus className="w-4 h-4 text-[#E8E8EE]" />
              )}
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge()}`}>
              {participant.status || 'Active'}
            </span>
          </div>

          <div className="flex items-center gap-4 text-sm text-[#E8E8EE]">
            {participant.department && (
              <span className="px-2 py-1 bg-[#498099]/20 text-[#30CDB7] rounded-md font-medium">
                {participant.department}
              </span>
            )}
          </div>

          <ProgressBar
            current={participant.score}
            max={participant.maxPoints}
            rank={participant.rank || index + 4}
          />
        </div>
      </div>
    </div>
  );
}
