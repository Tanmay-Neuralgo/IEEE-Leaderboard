import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { LeaderboardEntry } from "../lib/googleSheets";

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
        1: "bg-gradient-to-br from-yellow-400 to-yellow-600 text-white",
        2: "bg-gradient-to-br from-gray-300 to-gray-500 text-white",
        3: "bg-gradient-to-br from-amber-500 to-amber-700 text-white",
      };
      return colors[rank as keyof typeof colors];
    }
    return "bg-[#F0F8FC] text-[#0A5394]";
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md p-4 mb-3 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border border-transparent hover:border-[#0A5394]"
      style={{
        animation: rankChange !== 0 ? "slideIn 0.5s ease-out" : undefined,
      }}
    >
      <div className="flex items-center gap-4">
        <div
          className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${getRankBadge(
            participant.rank || index + 4
          )}`}
        >
          {participant.rank || index + 4}
        </div>

        <div className="flex-grow min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-bold text-[#012654] truncate">
              {participant.name}
            </h3>
            {rankChange !== 0 && (
              <div
                className={`flex items-center gap-1 text-xs font-semibold ${
                  rankChange > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {rankChange > 0 ? (
                  <>
                    <TrendingUp className="w-4 h-4" />
                    <span>+{rankChange}</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="w-4 h-4" />
                    <span>{rankChange}</span>
                  </>
                )}
              </div>
            )}
            {rankChange === 0 && participant.previous_rank && (
              <Minus className="w-4 h-4 text-[#585458]" />
            )}
          </div>

          <div className="flex items-center gap-4 text-sm text-[#585458]">
            {participant.department && (
              <span className="truncate">{participant.department}</span>
            )}
          </div>
        </div>

        <div className="flex-shrink-0 text-right">
          <div className="text-3xl font-bold bg-gradient-to-r from-[#0A5394] to-[#012654] bg-clip-text text-transparent">
            {participant.score}
          </div>
          <div className="text-xs text-[#585458]">points</div>
        </div>
      </div>
    </div>
  );
}
