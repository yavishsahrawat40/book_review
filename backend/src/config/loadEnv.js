import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(__dirname, "..", "..", ".env");

console.log(
  `--- [loadEnv.js] Attempting to load .env file from: ${envPath} ---`
);

const result = dotenv.config({ path: envPath });

if (result.error) {
  console.error("🚫 [loadEnv.js] DOTENV ERROR: Failed to load .env file.");
  console.error(result.error);
} else {
  console.log("✅ [loadEnv.js] DOTENV: .env file processed.");
  if (result.parsed) {
    console.log("[loadEnv.js] Parsed variables:", Object.keys(result.parsed));
  } else {
    console.log(
      "[loadEnv.js] dotenv.config() did not return parsed variables (file might be empty or not found)."
    );
  }
}
console.log(
  "--- [loadEnv.js] Finished. process.env.JWT_SECRET (is defined?):",
  process.env.JWT_SECRET ? "Yes" : "No, UNDEFINED!"
);
console.log(
  "--- [loadEnv.js] ---------------------------------------------------"
);
