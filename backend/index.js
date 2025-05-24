import "./src/config/loadEnv.js";

if (!process.env.JWT_SECRET) {
  console.error(
    "🚫 FATAL ERROR in index.js: JWT_SECRET is not defined in process.env AFTER attempting to load .env via src/config/loadEnv.js."
  );
  console.error("Application cannot start. Please check your .env file and src/config/loadEnv.js setup.");
  process.exit(1);
}
if (!process.env.MONGO_URI) {
  console.error(
    "🚫 FATAL ERROR in index.js: MONGO_URI is not defined in process.env AFTER attempting to load .env via src/config/loadEnv.js."
  );
  console.error("Application cannot start without MONGO_URI to connect to the database.");
  process.exit(1);
}

import app from "./src/app.js";
import connectDB from "./src/config/db.js";

connectDB();

const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, () => {
  console.log(
    `--------------------------------------------------------------------`
  );
  console.log(
    `🚀 Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`
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

process.on("unhandledRejection", (err, promise) => {
  console.error(`🚫 UNHANDLED REJECTION! 💥 Shutting down...`);
  console.error(`Error: ${err.name} - ${err.message}`);
  console.error(err.stack);
  server.close(() => {
    process.exit(1);
  });
});

process.on("SIGTERM", () => {
  console.info("👋 SIGTERM signal received. Closing HTTP server gracefully.");
  server.close(() => {
    console.log("✅ HTTP server closed.");
    process.exit(0);
  });
});