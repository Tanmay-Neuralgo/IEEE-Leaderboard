import { Zap, WifiOff, Wifi, RefreshCw } from 'lucide-react';

interface HeaderProps {
  lastUpdated: Date | null;
  isOnline: boolean;
  totalParticipants: number;
  onRefresh?: () => void;
}

export default function Header({ lastUpdated, isOnline, totalParticipants, onRefresh }: HeaderProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <header className="bg-gradient-to-r from-[#3B0855] via-[#852467] to-[#EE2270] text-white py-8 px-6 rounded-2xl shadow-2xl mb-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-white/5"></div>
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-[#30CDB7] to-[#498099] rounded-2xl flex items-center justify-center shadow-lg">
              <Zap className="w-9 h-9 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight">Current Logic</h1>
              <p className="text-[#F7F7FA]/90 text-sm mt-1 font-medium">IEEE Quiz Event - Live Leaderboard</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right bg-white/10 rounded-xl px-4 py-2 backdrop-blur-sm">
              <div className="text-3xl font-bold text-[#30CDB7]">{totalParticipants}</div>
              <div className="text-xs text-[#F7F7FA]">Participants</div>
            </div>

            <div className="h-14 w-px bg-white/20" />

            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-2">
                {isOnline ? (
                  <>
                    <div className="relative">
                      <Wifi className="w-5 h-5 text-[#00C896]" />
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#00C896] rounded-full animate-ping" />
                    </div>
                    <span className="text-sm font-bold text-[#00C896]">LIVE</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-5 h-5 text-[#FF4757]" />
                    <span className="text-sm font-bold text-[#FF4757]">OFFLINE</span>
                  </>
                )}
              </div>

              {lastUpdated && (
                <div className="text-xs text-[#F7F7FA]/80 font-medium">
                  Updated: {formatTime(lastUpdated)}
                </div>
              )}
            </div>

            {onRefresh && (
              <button
                onClick={onRefresh}
                className="p-3 bg-[#FD8083] hover:bg-[#EE2270] rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                title="Refresh data"
              >
                <RefreshCw className="w-5 h-5 text-white" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
