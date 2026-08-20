import express from "express";
import path from "path";
import fs from "fs";
import jwt from "jsonwebtoken";
import { fileURLToPath } from "url";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, error: "Missing credentials" });
  }

  const usersPath = path.join(__dirname, "../../users.json");
  const users = JSON.parse(fs.readFileSync(usersPath, "utf8"));

  const user = users.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    return res.status(401).json({ success: false, error: "Invalid email or password" });
  }

  // Generate a real JWT
  const token = jwt.sign(
    { email: user.email, clientId: user.clientId },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({ success: true, token, clientId: user.clientId });
});

export default router;
