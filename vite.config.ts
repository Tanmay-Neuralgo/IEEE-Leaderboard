import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react()],
    optimizeDeps: {
      exclude: ["lucide-react"],
    },
    define: {
      __GOOGLE_SHEETS_CONFIG__: {
        email: JSON.stringify(env.VITE_GOOGLE_SERVICE_ACCOUNT_EMAIL),
        spreadsheetId: JSON.stringify(env.VITE_GOOGLE_SPREADSHEET_ID),
        key: JSON.stringify(env.VITE_GOOGLE_PRIVATE_KEY),
      },
    },
  };
});
