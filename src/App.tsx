import { useEffect, useState } from "react";
import { googleSheetsService, type LeaderboardEntry } from "./lib/googleSheets";
import Header from "./components/Header";
import Podium from "./components/Podium";
import LeaderboardRow from "./components/LeaderboardRow";
import SearchBar from "./components/SearchBar";
import LoadingSkeleton from "./components/LoadingSkeleton";

function App() {
  const [participants, setParticipants] = useState<LeaderboardEntry[]>([]);
  const [filteredParticipants, setFilteredParticipants] = useState<
    LeaderboardEntry[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [error, setError] = useState<string | null>(null);

  const fetchParticipants = async () => {
    try {
      console.log("Environment variables:", {
        email: import.meta.env.VITE_GOOGLE_SERVICE_ACCOUNT_EMAIL,
        spreadsheetId: import.meta.env.VITE_GOOGLE_SPREADSHEET_ID,
        hasKey: !!import.meta.env.VITE_GOOGLE_PRIVATE_KEY,
      });

      const data = await googleSheetsService.getLeaderboardData();
      console.log("Fetched data:", data); // Debug log

      if (data && Array.isArray(data)) {
        setParticipants(data);
        setLastUpdated(new Date());
        setIsOnline(true);
        setError(null);
      } else {
        throw new Error("Invalid data format received");
      }
    } catch (error) {
      console.error("Error fetching participants:", error);
      setIsOnline(false);
      if (error instanceof Error) {
        console.error("Error details:", error.message, error.stack);
        setError(error.message);
      } else {
        setError("Failed to fetch data");
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchParticipants();

    // Set up polling for Google Sheets changes
    googleSheetsService.watchForChanges((data) => {
      console.log("Sheet updated:", data); // Debug log
      setParticipants(data);
      setLastUpdated(new Date());
    });

    // Refresh data every minute as backup
    const interval = setInterval(() => {
      fetchParticipants();
    }, 60000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    let filtered = [...participants];

    if (searchTerm) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedDepartment) {
      filtered = filtered.filter((p) => p.department === selectedDepartment);
    }

    setFilteredParticipants(filtered);
  }, [participants, searchTerm, selectedDepartment]);

  const departments = Array.from(
    new Set(participants.map((p) => p.department || "General").filter(Boolean))
  ) as string[];

  const topThree = filteredParticipants.slice(0, 3);
  const remaining = filteredParticipants.slice(3);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1A1A2E] py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1A1A2E] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {error && (
          <div className="glassmorphism border-2 border-[#FF4757] text-[#FF4757] px-6 py-4 rounded-xl mb-6 shadow-lg">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
            <button
              onClick={fetchParticipants}
              className="mt-3 px-4 py-2 bg-[#FF4757] text-white rounded-lg hover:bg-[#FF4757]/80 transition-colors font-semibold"
            >
              Retry
            </button>
          </div>
        )}
        <Header
          lastUpdated={lastUpdated}
          isOnline={isOnline}
          totalParticipants={participants.length}
          onRefresh={fetchParticipants}
        />

        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedDepartment={selectedDepartment}
          onDepartmentChange={setSelectedDepartment}
          departments={departments}
        />

        {filteredParticipants.length === 0 ? (
          <div className="glassmorphism text-center py-16 rounded-2xl">
            <p className="text-2xl text-[#E8E8EE]">No participants found</p>
            <p className="text-sm text-[#E8E8EE]/60 mt-2">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            {topThree.length > 0 && <Podium topThree={topThree} />}

            {remaining.length > 0 && (
              <div className="mt-8">
                <div className="flex items-center justify-between mb-6 px-2">
                  <h2 className="text-3xl font-bold text-[#F7F7FA]">
                    Full Rankings
                  </h2>
                  <div className="text-sm text-[#E8E8EE]/60">
                    {remaining.length} participants
                  </div>
                </div>
                <div className="space-y-3">
                  {remaining.map((participant, index) => (
                    <LeaderboardRow
                      key={participant.id}
                      participant={participant}
                      index={index}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
