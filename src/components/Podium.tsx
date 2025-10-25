import { Trophy, Medal } from "lucide-react";
import { LeaderboardEntry } from "../lib/googleSheets";
import ProgressBar from "./ProgressBar";

interface PodiumProps {
  topThree: LeaderboardEntry[];
}

export default function Podium({ topThree }: PodiumProps) {
  const [first, second, third] = topThree;

  const PodiumCard = ({
    participant,
    position,
    height,
  }: {
    participant?: LeaderboardEntry;
    position: number;
    height: string;
  }) => {
    if (!participant) return null;

    const medals = {
      1: { icon: Trophy, color: "text-[#FFD700]", label: "CHAMPION", gradient: "from-[#3B0855] via-[#EE2270] to-[#FD8083]" },
      2: { icon: Medal, color: "text-[#C0C0C0]", label: "RUNNER-UP", gradient: "from-[#852467] to-[#498099]" },
      3: { icon: Medal, color: "text-[#CD7F32]", label: "THIRD PLACE", gradient: "from-[#498099] to-[#30CDB7]" },
    };

    const medal = medals[position as keyof typeof medals];
    const Icon = medal.icon;

    const podiumGradients = {
      1: "from-[#FFD700] to-[#FFA500]",
      2: "from-[#C0C0C0] to-[#A8A8A8]",
      3: "from-[#CD7F32] to-[#B8722A]",
    };

    return (
      <div className="flex flex-col items-center">
        <div className="glassmorphism relative rounded-2xl shadow-2xl p-6 w-full max-w-xs transition-all duration-500 hover:shadow-[0_0_30px_rgba(48,205,183,0.3)] hover:-translate-y-3">
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center bg-gradient-to-br ${podiumGradients[position as keyof typeof podiumGradients]} shadow-2xl animate-pulse`}
            >
              <Icon className={`w-10 h-10 ${medal.color}`} />
            </div>
          </div>

          <div className="mt-8 text-center">
            <div className={`text-xs font-bold text-[#30CDB7] mb-2 tracking-wider`}>
              {medal.label}
            </div>
            <h3 className="text-2xl font-bold text-[#F7F7FA] mb-4 truncate">
              {participant.name}
            </h3>

            <div className={`my-4 py-5 px-6 bg-gradient-to-r ${medal.gradient} rounded-xl shadow-lg relative overflow-hidden`}>
              <div className="absolute inset-0 bg-white/10"></div>
              <div className="relative">
                <div className="text-4xl font-bold text-white">
                  {participant.score}
                </div>
                <div className="text-xs text-white/80 mt-1">POINTS</div>
              </div>
            </div>

            <div className="mb-4">
              <ProgressBar
                current={participant.score}
                max={participant.maxPoints}
                rank={position}
              />
            </div>

            {participant.department && (
              <div className="bg-[#498099]/20 rounded-lg p-3">
                <div className="text-xs text-[#E8E8EE]">Department</div>
                <div className="text-sm font-semibold text-[#30CDB7] truncate">
                  {participant.department}
                </div>
              </div>
            )}
          </div>
        </div>

        <div
          className={`mt-6 ${height} w-36 bg-gradient-to-t ${podiumGradients[position as keyof typeof podiumGradients]} rounded-t-2xl shadow-2xl flex items-center justify-center relative overflow-hidden`}
        >
          <div className="absolute inset-0 bg-white/10"></div>
          <span className="text-6xl font-bold text-white opacity-40 relative z-10">
            {position}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex items-end justify-center gap-8 mb-16 flex-wrap lg:flex-nowrap px-4">
      <div className="order-2 lg:order-1">
        <PodiumCard
          participant={second}
          position={2}
          height="h-36"
        />
      </div>

      <div className="order-1 lg:order-2">
        <PodiumCard
          participant={first}
          position={1}
          height="h-52"
        />
      </div>

      <div className="order-3">
        <PodiumCard
          participant={third}
          position={3}
          height="h-28"
        />
      </div>
    </div>
  );
}
