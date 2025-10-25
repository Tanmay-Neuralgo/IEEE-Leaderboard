import { google } from "googleapis";
import { JWT } from "google-auth-library";
import dotenv from "dotenv";

dotenv.config();

async function validateSetup() {
  console.log("\nValidating Google Sheets setup...\n");

  // Check environment variables
  const email = process.env.VITE_GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.VITE_GOOGLE_PRIVATE_KEY;
  const spreadsheetId = process.env.VITE_GOOGLE_SPREADSHEET_ID;

  console.log("Environment variables:");
  console.log("- Service Account Email:", email ? "✅ Present" : "❌ Missing");
  console.log("- Private Key:", key ? "✅ Present" : "❌ Missing");
  console.log("- Spreadsheet ID:", spreadsheetId ? "✅ Present" : "❌ Missing");

  if (!email || !key || !spreadsheetId) {
    console.error("\n❌ Missing required environment variables");
    return;
  }

  try {
    // Try to initialize the client
    const client = new JWT({
      email,
      key: key.replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    console.log("\nTesting Google Sheets API connection...");

    const sheets = google.sheets({ version: "v4", auth: client });

    // Try to access the spreadsheet
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "A1:D1", // Just get the header row
    });

    if (response.data.values && response.data.values.length > 0) {
      console.log("\n✅ Successfully connected to spreadsheet");
      console.log("Header row:", response.data.values[0]);
    } else {
      console.log("\n⚠️ Connected to spreadsheet but no data found");
    }
  } catch (error) {
    console.error(
      "\n❌ Error testing connection:",
      error instanceof Error ? error.message : error
    );
  }
}

validateSetup().catch(console.error);
