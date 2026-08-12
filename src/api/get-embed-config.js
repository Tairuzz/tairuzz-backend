import jwt from "jsonwebtoken";
import { getEmbedConfig } from "../getEmbedConfig.js";

export default async function (req, res) {

// Verify JWT
const authHeader = req.headers.authorization;

if (!authHeader) {
  return res.status(401).json({ error: "Missing authorization header" });
}

const token = authHeader.replace("Bearer ", "");

try {
  jwt.verify(token, process.env.JWT_SECRET);
} catch (err) {
  return res.status(401).json({ error: "Invalid or expired token" });
}
  try {
    const config = await getEmbedConfig();
    res.json(config);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating embed config");
  }
}

