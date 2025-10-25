import { Trophy, Medal } from "lucide-react";
import { LeaderboardEntry } from "../lib/googleSheets";

interface PodiumProps {
  topThree: LeaderboardEntry[];
}

export default function Podium({ topThree }: PodiumProps) {
  const [first, second, third] = topThree;

  const PodiumCard = ({
    participant,
    position,
    height,
    bgGradient,
  }: {
    participant?: LeaderboardEntry;
    position: number;
    height: string;
    bgGradient: string;
  }) => {
    if (!participant) return null;

    const medals = {
      1: { icon: Trophy, color: "text-yellow-400", label: "CHAMPION" },
      2: { icon: Medal, color: "text-gray-300", label: "RUNNER-UP" },
      3: { icon: Medal, color: "text-amber-600", label: "THIRD PLACE" },
    };

    const medal = medals[position as keyof typeof medals];
    const Icon = medal.icon;

    return (
      <div className="flex flex-col items-center">
        <div
          className={`relative bg-white rounded-2xl shadow-lg p-6 w-full max-w-xs transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ${bgGradient}`}
        >
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center ${
                position === 1
                  ? "bg-gradient-to-br from-yellow-300 to-yellow-500"
                  : position === 2
                  ? "bg-gradient-to-br from-gray-200 to-gray-400"
                  : "bg-gradient-to-br from-amber-400 to-amber-600"
              } shadow-lg animate-pulse`}
            >
              <Icon className={`w-8 h-8 ${medal.color}`} />
            </div>
          </div>

          <div className="mt-6 text-center">
            <div className="text-sm font-semibold text-[#585458] mb-1">
              {medal.label}
            </div>
            <h3 className="text-xl font-bold text-[#012654] mb-2 truncate">
              {participant.name}
            </h3>

            <div className="my-4 py-4 px-6 bg-gradient-to-r from-[#0A5394] to-[#012654] rounded-lg">
              <div className="text-3xl font-bold text-white">
                {participant.score}
              </div>
              <div className="text-xs text-[#F0F8FC] mt-1">POINTS</div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              {participant.time_taken && (
                <div className="bg-[#F0F8FC] rounded-lg p-2">
                  <div className="text-xs text-[#585458]">Time</div>
                  <div className="text-sm font-semibold text-[#0A5394]">
                    {Math.floor(participant.time_taken / 60)}:
                    {(participant.time_taken % 60).toString().padStart(2, "0")}
                  </div>
                </div>
              )}
              {participant.department && (
                <div className="bg-[#F0F8FC] rounded-lg p-2">
                  <div className="text-xs text-[#585458]">Dept</div>
                  <div className="text-sm font-semibold text-[#0A5394] truncate">
                    {participant.department}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div
          className={`mt-4 ${height} w-32 bg-gradient-to-t ${bgGradient} rounded-t-xl shadow-inner flex items-center justify-center`}
        >
          <span className="text-5xl font-bold text-white opacity-30">
            {position}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex items-end justify-center gap-8 mb-12 flex-wrap lg:flex-nowrap">
      <div className="order-2 lg:order-1">
        <PodiumCard
          participant={second}
          position={2}
          height="h-32"
          bgGradient="from-gray-50 to-gray-100"
        />
      </div>

      <div className="order-1 lg:order-2">
        <PodiumCard
          participant={first}
          position={1}
          height="h-48"
          bgGradient="from-yellow-50 to-amber-50"
        />
      </div>

      <div className="order-3">
        <PodiumCard
          participant={third}
          position={3}
          height="h-24"
          bgGradient="from-orange-50 to-amber-50"
        />
      </div>
    </div>
  );
}
