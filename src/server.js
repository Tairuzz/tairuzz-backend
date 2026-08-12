import "./loadEnv.js";      // Load .env FIRST
import express from "express";
import cors from "cors";

import embedConfigRouter from "./routes/embedConfig.js";

const app = express();      // <-- MUST come before app.use()

const clientConfigRoute = require("./clientConfig");
app.use(clientConfigRoute);

app.use(cors());            // Now safe
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Tairuzz Embedded Backend running" });
});

// Routes
app.use("/api/embed-config", embedConfigRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
