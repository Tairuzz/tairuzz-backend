const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");

// Decode token (simple example)
function decodeToken(token) {
  try {
    return JSON.parse(Buffer.from(token, "base64").toString());
  } catch {
    return null;
  }
}

router.get("/api/get-client-config", (req, res) => {
  const token = req.headers["x-tairuzz-auth"];
  if (!token) {
    return res.status(401).json({ error: "Missing auth token" });
  }

  const decoded = decodeToken(token);
  if (!decoded || !decoded.clientId) {
    return res.status(401).json({ error: "Invalid token" });
  }

  const clientId = decoded.clientId;
  const filePath = path.join(__dirname, "../clients", `${clientId}.json`);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "Client config not found" });
  }

  const config = JSON.parse(fs.readFileSync(filePath, "utf8"));
  res.json(config);
});

module.exports = router;
