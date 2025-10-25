import { google } from "googleapis";
import { JWT } from "google-auth-library";

export interface LeaderboardEntry {
  id?: string;
  rank?: number;
  name: string;
  score: number;
  avatar_url?: string;
  department?: string;
}

export class GoogleSheetsService {
  private client: JWT;
  private sheets: ReturnType<typeof google.sheets>;
  private spreadsheetId: string;

  constructor() {
    console.log("Initializing GoogleSheetsService");

    // Check if environment variables are properly set
    const email = import.meta.env.VITE_GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const key = import.meta.env.VITE_GOOGLE_PRIVATE_KEY;
    const spreadsheetId = import.meta.env.VITE_GOOGLE_SPREADSHEET_ID;

    console.log("Environment variables:", {
      hasEmail: !!email,
      emailValue: email,
      hasKey: !!key,
      keyLength: key?.length,
      hasSpreadsheetId: !!spreadsheetId,
      spreadsheetIdValue: spreadsheetId,
    });

    if (!email || !key || !spreadsheetId) {
      const missing = [];
      if (!email) missing.push("VITE_GOOGLE_SERVICE_ACCOUNT_EMAIL");
      if (!key) missing.push("VITE_GOOGLE_PRIVATE_KEY");
      if (!spreadsheetId) missing.push("VITE_GOOGLE_SPREADSHEET_ID");
      throw new Error(
        `Missing required environment variables: ${missing.join(", ")}`
      );
    }

    try {
      // Clean up the private key - ensure proper line breaks
      const cleanKey = key.replace(/\\n/g, "\n").replace(/["']/g, "").trim();

      this.client = new JWT({
        email,
        key: cleanKey,
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
      });

      this.sheets = google.sheets({ version: "v4", auth: this.client });
      this.spreadsheetId = spreadsheetId;

      console.log("GoogleSheetsService initialized successfully");
    } catch (error) {
      console.error("Error initializing GoogleSheetsService:", error);
      throw error;
    }
  }

  async getLeaderboardData(): Promise<LeaderboardEntry[]> {
    try {
      console.log("Fetching leaderboard data...");

      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: "A2:D", // Get Name, Score, Avatar URL, Department
      });

      console.log("Raw response:", response.data);

      const rows = response.data.values;
      if (!rows || rows.length === 0) {
        console.log("No data found in spreadsheet");
        return [];
      }

      const entries: LeaderboardEntry[] = rows.map(
        (row: string[], index: number) => {
          console.log(`Processing row ${index + 1}:`, row);
          return {
            id: `entry-${index + 1}`,
            name: row[0] || "",
            score: parseInt(row[1]) || 0,
            avatar_url: row[2] || undefined,
            department: row[3] || "General",
          };
        }
      );

      console.log("Processed entries:", entries);

      // Sort by score in descending order and add ranks
      return entries
        .sort((a, b) => b.score - a.score)
        .map((entry, index) => ({
          ...entry,
          rank: index + 1,
        }));
    } catch (error) {
      console.error("Error fetching data from Google Sheets:", error);
      throw error;
    }
  }

  watchForChanges(callback: (data: LeaderboardEntry[]) => void): () => void {
    const interval = setInterval(async () => {
      try {
        const data = await this.getLeaderboardData();
        callback(data);
      } catch (error) {
        console.error("Error in watchForChanges:", error);
      }
    }, 30000);

    return () => clearInterval(interval);
  }
}

export const googleSheetsService = new GoogleSheetsService();
