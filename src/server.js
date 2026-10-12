import "./loadEnv.js";
import express from "express";
import cors from "cors";

const app = express();

// CORS â€” updated for Bearer tokens
app.use(cors({
  origin: "https://analytics.tairuzz.co.uk",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.options("*", cors());

import embedConfigRouter from "./routes/embedConfig.js";
import { requireAuth } from "./middleware/requireAuth.js";
import loginRouter from "./routes/login.js";
import getClientConfigRoute from "./getClientConfig.js";

app.use(express.json());

// Routes
app.use("/api", loginRouter);
app.use("/api", getClientConfigRoute);
app.use("/api/embed-config", requireAuth, embedConfigRouter);

// Health check
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Tairuzz Embedded Backend running" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
