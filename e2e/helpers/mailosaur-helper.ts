// tests/utils/mailosaur-helper.ts
import MailosaurClient from "mailosaur";

const serverId = "ymxgovm8"; // from ymxgovm8.mailosaur.net

// Lazy initialization - only check API key when function is called
// This ensures dotenv has loaded the .env file by the time we need it
function getClient(): MailosaurClient {
  const apiKey = process.env.MAILOSAUR_API_KEY;
  if (!apiKey) {
    throw new Error("MAILOSAUR_API_KEY is not set in environment");
  }
  return new MailosaurClient(apiKey);
}

export async function getTwoFactorCode(
  toEmail: string = "anything@ymxgovm8.mailosaur.net"
): Promise<string> {
  console.log("[Mailosaur] Waiting for 2FA email...");

  const client = getClient();
  const message = await client.messages.get(
    serverId,
    { sentTo: toEmail },
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

