// backend/index.js

// 1. ABSOLUTELY FIRST: Execute the environment loading script.
import "./src/config/loadEnv.js"; // This line runs loadEnv.js which calls dotenv.config()

// --- Sanity check for critical environment variables AFTER loadEnv.js has run ---
console.log(
  "--- [index.js] Checking process.env (AFTER importing src/config/loadEnv.js) ---"
);
console.log("[index.js] process.env.PORT:", process.env.PORT);
console.log(
  "[index.js] process.env.MONGO_URI (exists?):",
  process.env.MONGO_URI ? "Yes" : "No"
);
console.log(
  "[index.js] process.env.JWT_SECRET (exists?):",
  process.env.JWT_SECRET ? "Yes (Value Hidden)" : "No, UNDEFINED!"
);
console.log("[index.js] process.env.CORS_ORIGIN:", process.env.CORS_ORIGIN);
console.log(
  "--- [index.js] --------------------------------------------------------------"
);

if (!process.env.JWT_SECRET) {
  console.error(
    "🚫 FATAL ERROR in index.js: JWT_SECRET is not defined in process.env AFTER attempting to load .env via src/config/loadEnv.js."
  );
  console.error("Application cannot start. Please check your .env file and src/config/loadEnv.js setup.");
  process.exit(1); // Exit if critical JWT_SECRET is missing
}
if (!process.env.MONGO_URI) {
    console.error(
    "🚫 FATAL ERROR in index.js: MONGO_URI is not defined in process.env AFTER attempting to load .env via src/config/loadEnv.js."
  );
  console.error("Application cannot start without MONGO_URI to connect to the database.");
  process.exit(1); // Exit if critical MONGO_URI is missing
}
// --- End of sanity check ---


// 2. Now import other modules that might rely on process.env
import app from "./src/app.js";
import connectDB from "./src/config/db.js";

// 3. Connect to Database
// This will use process.env.MONGO_URI which should now be loaded.
connectDB();

// 4. Server Port Configuration
const PORT = process.env.PORT || 5001; // Default to 5001 if PORT is not in .env

// 5. Start the Server
const server = app.listen(PORT, () => {
  console.log(
    `--------------------------------------------------------------------`
  );
  console.log(
    `🚀 Server running in ${
      process.env.NODE_ENV || "development"
    } mode on port ${PORT}`
  );
  if (process.env.CORS_ORIGIN) {
    console.log(`🔗 CORS enabled for origin: ${process.env.CORS_ORIGIN}`);
  } else {
    console.warn(
      `⚠️ CORS_ORIGIN not set in .env. Defaulting or open to all might occur.`
    );
  }
  console.log(
    `API base URL will be http://localhost:${PORT}/api (once routes are set up)`
  );
  console.log(
    `--------------------------------------------------------------------`
  );
});

// --- Global Error Handling for Unhandled Rejections ---
process.on("unhandledRejection", (err, promise) => {
  console.error(`🚫 UNHANDLED REJECTION! 💥 Shutting down...`);
  console.error(`Error: ${err.name} - ${err.message}`);
  console.error(err.stack); // Log the stack for more details
  // Close server & exit process
  server.close(() => {
    process.exit(1); // Exit with failure code
  });
});

// --- Graceful Shutdown for SIGTERM (e.g., from Docker, K8s, or PM2) ---
process.on("SIGTERM", () => {
  console.info("👋 SIGTERM signal received. Closing HTTP server gracefully.");
  server.close(() => {
    console.log("✅ HTTP server closed.");
    // Perform any other cleanup here (e.g., close DB connections if not handled by Mongoose)
    process.exit(0); // Exit with success code
  });
});
