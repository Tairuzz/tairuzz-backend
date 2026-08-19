import express from "express";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";

const router = express.Router();

// Bearer auth middleware
function auth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Missing authorization header" });
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

router.post("/get-client-config", auth, (req, res) => {
  const { clientId } = req.body;

  if (!clientId) {
    return res.status(400).json({ error: "clientId is required" });
  }

  const configPath = path.join(process.cwd(), "clients", `${clientId}.json`);

  if (!fs.existsSync(configPath)) {
    return res.status(404).json({ error: "Client config not found" });
  }

  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));

  res.json({
    clientId,
    email: req.user.email,
    config
  });
});

export default router;
