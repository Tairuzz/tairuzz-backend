import express from "express";
import jwt from "jsonwebtoken";
import { usersContainer } from "../../db.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, error: "Missing credentials" });
  }

  try {
    let user = null;
    try {
      const result = await usersContainer.item(email, email).read();
      user = result.resource;
    } catch (readErr) {
      console.error("Cosmos item read failed:", readErr.code, readErr.message);
    }

    console.log("Lookup result for", email, ":", user);

    if (!user || user.password !== password) {
      return res.status(401).json({ success: false, error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { email: user.email, clientId: user.clientId },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ success: true, token, clientId: user.clientId });
  } catch (err) {
    console.error("Cosmos read error:", err.message);
    res.status(500).json({ error: "Login failed" });
  }
});
export default router;