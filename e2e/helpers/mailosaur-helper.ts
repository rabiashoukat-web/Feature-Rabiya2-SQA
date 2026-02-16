// tests/utils/mailosaur-helper.ts
import MailosaurClient from "mailosaur";

// Derive server ID from Mailosaur email (e.g. user@6am9erf4.mailosaur.net -> 6am9erf4)
function getServerIdFromEmail(email: string): string {
  const match = email.match(/@([a-z0-9]+)\.mailosaur\.net$/i);
  if (!match) {
    throw new Error(
      `Invalid Mailosaur email "${email}". Expected format: something@SERVER_ID.mailosaur.net`
    );
  }
  return match[1];
}

// Lazy initialization - only check API key when function is called
// This ensures dotenv has loaded the .env file by the time we need it
function getClient(): MailosaurClient {
  const apiKey = process.env.MAILOSAUR_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("MAILOSAUR_API_KEY is not set in environment");
  }
  return new MailosaurClient(apiKey);
}

export async function getTwoFactorCode(toEmail: string): Promise<string> {
  if (!toEmail?.trim()) {
    throw new Error("Mailosaur email (toEmail) is required");
  }
  const serverId = getServerIdFromEmail(toEmail.trim());
  console.log("[Mailosaur] Waiting for 2FA email...");

  const client = getClient();
  const message = await client.messages.get(
    serverId,
    { sentTo: toEmail.trim() },
    {
      timeout: 20_000, // 20s max waiting for the email
      receivedAfter: new Date(Date.now() - 15 * 60_000),
    }
  );

  const textBody = message.text?.body;
  const htmlBody = message.html?.body;
  const searchableBody = textBody || stripHtml(htmlBody) || "";
  console.log("[Mailosaur] Email body:\n", searchableBody);

  const code = extractCode(searchableBody);

  if (!code) {
    console.log("[Mailosaur] 2FA code not found in body!");
    throw new Error("2FA code not found in email.");
  }

  console.log("[Mailosaur] Extracted 2FA code:", code);

  return code;
}

function stripHtml(body?: string | null): string {
  if (!body) {
    return "";
  }

  return body
    .replace(/&nbsp;/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractCode(body: string): string | null {
  const patterns = [
    /Your 2-Factor authentication code is:\s*([0-9]{6})/,
    /(?:code|Code)[^0-9]*([0-9]{6})/,
  ];

  for (const pattern of patterns) {
    const match = body.match(pattern);
    if (match?.[1]) {
      return match[1].replace(/\D/g, "");
    }
  }

  const fallback = body.match(/([0-9][0-9\s-]{5,})/);
  if (!fallback) {
    return null;
  }

  const digits = fallback[0].replace(/\D/g, "");
  return digits.length >= 6 ? digits.slice(0, 6) : null;
}