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
      <div className="min-h-screen bg-gradient-to-br from-[#F0F8FC] to-white py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0F8FC] to-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <Header
          lastUpdated={lastUpdated}
          isOnline={isOnline}
          totalParticipants={participants.length}
        />

        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedDepartment={selectedDepartment}
          onDepartmentChange={setSelectedDepartment}
          departments={departments}
        />

        {filteredParticipants.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-2xl text-[#585458]">No participants found</p>
          </div>
        ) : (
          <>
            {topThree.length > 0 && <Podium topThree={topThree} />}

            {remaining.length > 0 && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold text-[#012654] mb-6 px-2">
                  Full Rankings
                </h2>
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
