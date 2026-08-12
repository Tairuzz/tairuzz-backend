import "./loadEnv.js";
import express from "express";
import cors from "cors";

import embedConfigRouter from "./routes/embedConfig.js";

const app = express();

import clientConfigRoute from "./clientConfig.js";   // ES module version
app.use(clientConfigRoute);

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Tairuzz Embedded Backend running" });
});

app.use("/api/embed-config", embedConfigRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
