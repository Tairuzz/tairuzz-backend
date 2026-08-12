import express from "express";
import axios from "axios";

const router = express.Router();

const tenantId = process.env.TENANT_ID;
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const workspaceId = process.env.WORKSPACE_ID;
const reportId = process.env.REPORT_ID;

console.log("TENANT_ID:", tenantId);

const authorityUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
const powerBiApiUrl = "https://api.powerbi.com/v1.0/myorg";

router.get("/", async (req, res) => {
  console.log("Embed route hit");

  try {
    // 1. Get Azure AD access token (client credentials)
    const tokenResponse = await axios.post(
      authorityUrl,
      new URLSearchParams({
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret,
        scope: "https://analysis.windows.net/powerbi/api/.default"
      })
    );

    const accessToken = tokenResponse.data.access_token;

    // 2. Get report details
    const reportResponse = await axios.get(
      `${powerBiApiUrl}/groups/${workspaceId}/reports/${reportId}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` }
      }
    );

    const embedUrl = reportResponse.data.embedUrl;

    // 3. Generate embed token
    const embedTokenResponse = await axios.post(
      `${powerBiApiUrl}/groups/${workspaceId}/reports/${reportId}/GenerateToken`,
      { accessLevel: "View" },
      {
        headers: { Authorization: `Bearer ${accessToken}` }
      }
    );

    const embedToken = embedTokenResponse.data.token;

    // 4. Return config to frontend
    res.json({
      reportId,
      embedUrl,
      embedToken
    });

  } catch (err) {
    console.error("Embed error:", err.response?.data || err.message);
    console.error("Full error:", err.toJSON?.() || err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
