// Netlify Function: send-results
// Uses Netlify Email Integration template: emails/results/index.html
// Frontend POSTs JSON: { email, primaryRole, secondaryCraft, resultsHtml, contactUrl }
import { handler as sendResultsEmail } from "@netlify/emails/handlers/results";

export async function handler(event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  let data;
  try {
    data = JSON.parse(event.body || "{}");
  } catch {
    return { statusCode: 400, body: "Invalid JSON" };
  }

  const { email, primaryRole, secondaryCraft, resultsHtml, contactUrl } = data || {};
  if (!email) return { statusCode: 400, body: "Missing email" };

  const payload = {
    to: email,
    from: "hello@rolecraftid.com", // change to your verified sender in SendGrid
    subject: "Your RoleCraftID Results",
    parameters: {
      primaryRole: primaryRole || "",
      secondaryCraft: secondaryCraft || "",
      resultsHtml: resultsHtml || "",
      contactUrl: contactUrl || "https://www.rolecraftid.com/contact"
    }
  };

  return await sendResultsEmail({
    ...event,
    body: JSON.stringify(payload)
  }, context);
}
