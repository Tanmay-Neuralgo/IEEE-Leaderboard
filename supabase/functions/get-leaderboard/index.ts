import { google } from "npm:googleapis@140.0.1";
import { JWT } from "npm:google-auth-library@9.14.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  score: number;
  maxPoints: number;
  percentage: number;
  status: string;
  department?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const serviceAccountEmail = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_EMAIL");
    const privateKey = Deno.env.get("GOOGLE_PRIVATE_KEY");
    const spreadsheetId = Deno.env.get("GOOGLE_SPREADSHEET_ID");

    if (!serviceAccountEmail || !privateKey || !spreadsheetId) {
      throw new Error("Missing required environment variables");
    }

    const cleanKey = privateKey.replace(/\\n/g, "\n");

    const client = new JWT({
      email: serviceAccountEmail,
      key: cleanKey,
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth: client });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "A2:F",
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      return new Response(
        JSON.stringify({
          participants: [],
          lastSync: new Date().toISOString(),
          totalParticipants: 0,
        }),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const entries: LeaderboardEntry[] = rows.map((row: string[], index: number) => {
      const score = parseInt(row[1]) || 0;
      const maxPoints = parseInt(row[2]) || 100;
      const percentage = maxPoints > 0 ? Math.round((score / maxPoints) * 100) : 0;

      return {
        id: `entry-${index + 1}`,
        name: row[0] || "Unknown",
        score,
        maxPoints,
        percentage,
        status: row[3] || "active",
        department: row[4] || "General",
        rank: 0,
      };
    });

    const sortedEntries = entries
      .sort((a, b) => b.score - a.score)
      .map((entry, index) => ({
        ...entry,
        rank: index + 1,
      }));

    return new Response(
      JSON.stringify({
        participants: sortedEntries,
        lastSync: new Date().toISOString(),
        totalParticipants: sortedEntries.length,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching leaderboard data:", error);

    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error occurred",
        participants: [],
        lastSync: new Date().toISOString(),
        totalParticipants: 0,
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});