import express from "express";
import jwt from "jsonwebtoken";
import { clientsContainer } from "../db.js";

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

router.post("/get-client-config", auth, async (req, res) => {
  const { clientId } = req.body;

  if (!clientId) {
    return res.status(400).json({ error: "clientId is required" });
  }

  try {
    const { resource: client } = await clientsContainer
      .item(clientId, clientId)
      .read();

    if (!client) {
      return res.status(404).json({ error: "Client config not found" });
    }

    // Strip Cosmos-internal fields before returning
    const { id, _rid, _self, _etag, _attachments, _ts, clientId: cid, ...config } = client;

    res.json({
      clientId: cid,
      email: req.user.email,
      config
    });
  } catch (err) {
    if (err.code === 404) {
      return res.status(404).json({ error: "Client config not found" });
    }
    console.error("Cosmos read error:", err.message);
    res.status(500).json({ error: "Failed to load client config" });
  }
});

export default router;
