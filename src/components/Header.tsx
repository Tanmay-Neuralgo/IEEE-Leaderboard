import { Zap, WifiOff, Wifi } from 'lucide-react';

interface HeaderProps {
  lastUpdated: Date | null;
  isOnline: boolean;
  totalParticipants: number;
}

export default function Header({ lastUpdated, isOnline, totalParticipants }: HeaderProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <header className="bg-gradient-to-r from-[#0A5394] to-[#012654] text-white py-8 px-6 rounded-2xl shadow-2xl mb-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Zap className="w-8 h-8 text-yellow-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight">Current Logic</h1>
              <p className="text-[#F0F8FC] text-sm mt-1">IEEE Quiz Event - Live Leaderboard</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="text-2xl font-bold">{totalParticipants}</div>
              <div className="text-xs text-[#F0F8FC]">Participants</div>
            </div>

            <div className="h-12 w-px bg-white/20" />

            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-2">
                {isOnline ? (
                  <>
                    <div className="relative">
                      <Wifi className="w-5 h-5 text-green-400" />
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-ping" />
                    </div>
                    <span className="text-sm font-semibold text-green-400">LIVE</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-5 h-5 text-red-400" />
                    <span className="text-sm font-semibold text-red-400">OFFLINE</span>
                  </>
                )}
              </div>

              {lastUpdated && (
                <div className="text-xs text-[#F0F8FC]">
                  Updated: {formatTime(lastUpdated)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
