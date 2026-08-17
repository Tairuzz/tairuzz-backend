import "./loadEnv.js";
import express from "express";
import cors from "cors";

const app = express();

// FULL CORS CONFIG — this is the fix
app.use(cors({
  origin: "https://analytics.tairuzz.co.uk",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "x-tairuzz-auth"]
}));

// Explicitly handle preflight requests
app.options("*", cors());

import embedConfigRouter from "./routes/embedConfig.js";
import clientConfigRoute from "./clientConfig.js";

app.use(express.json());

import loginRouter from "./routes/login.js";
app.use("/api", loginRouter);

// Routes
app.use("/api", clientConfigRoute);
app.use("/api/embed-config", embedConfigRouter);

// Health check
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Tairuzz Embedded Backend running" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
