import express from "express";
import cors from "cors";
import mainApiRouter from "./routes/index.js";
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js"; // <-- Import error handlers

const app = express();

const corsOptions = {
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

app.use("/api", mainApiRouter);

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "UP",
    timestamp: new Date().toISOString(),
    message: "Server is healthy and running!",
  });
});

app.use(notFound); 
app.use(errorHandler); 

export default app;
