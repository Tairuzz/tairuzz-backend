import fetch from "node-fetch";
import qs from "qs";

const tenantId = "41f63eb4-f8aa-485a-86d6-c3762e4e8db5";
const clientId = "cb099af1-7789-4110-8797-937c8b0fb9e5";
const clientSecret = process.env.AZURE_APP_SECRET;

const workspaceId = "3155d8d0-9725-40c1-b9f4-0ebdd5e9706c";
const reportId = "c1dd388a-a664-43ff-ad25-6b0c6adabe81";

export async function getEmbedConfig() {
  // 1. Authenticate with Azure AD
  const tokenResponse = await fetch(
    `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: qs.stringify({
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret,
        scope: "https://analysis.windows.net/powerbi/api/.default"
      })
    }
  );

  const { access_token } = await tokenResponse.json();

  // 2. Get report metadata (this returns semanticModelId + embedUrl)
  const reportResponse = await fetch(
    `https://api.powerbi.com/v1.0/myorg/groups/${workspaceId}/reports/${reportId}`,
    {
      headers: { Authorization: `Bearer ${access_token}` }
    }
  );

  const report = await reportResponse.json();

  const embedUrl = report.embedUrl;
  const semanticModelId = report.datasetId;

  // 3. Generate embed token
  const tokenGenResponse = await fetch(
    `https://api.powerbi.com/v1.0/myorg/groups/${workspaceId}/reports/${reportId}/GenerateToken`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        accessLevel: "View",
        identities: []
      })
    }
  );

  const tokenData = await tokenGenResponse.json();

  return {
    embedUrl,
    reportId,
    semanticModelId,
    embedToken: tokenData.token
  };
}
