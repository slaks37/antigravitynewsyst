/**
 * Email Provider Adapter
 * Compliance with Section 19 & 22: Never claim an email was delivered without provider confirmation
 */

export interface EmailMessage {
  to: string;
  subject: string;
  text: string;
  html?: string;
  from?: string;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  provider: "console" | "resend" | "mock" | "unconfigured";
  statusMessage: string;
}

export async function sendNotificationEmail(message: EmailMessage): Promise<SendEmailResult> {
  const provider = process.env.EMAIL_PROVIDER || "console";
  const defaultFrom = process.env.EMAIL_FROM || "notifications@newsystem.id";
  const from = message.from || defaultFrom;

  // 1. In development / testing or when unconfigured, safely log without claiming external delivery
  if (provider === "console" || !process.env.RESEND_API_KEY) {
    console.log("[Email Notification Adapter - Simulated / Logged Only]");
    console.log(`From: ${from}`);
    console.log(`To: ${message.to}`);
    console.log(`Subject: ${message.subject}`);
    console.log(`Body: ${message.text.substring(0, 150)}...`);

    return {
      success: true,
      messageId: `simulated-${Date.now()}`,
      provider: "console",
      statusMessage: "Disimpan di log sistem (adapter email dalam mode simulasi / pengembangan).",
    };
  }

  // 2. Real Resend Provider (if configured in production)
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from,
        to: message.to,
        subject: message.subject,
        text: message.text,
        html: message.html,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return {
        success: false,
        provider: "resend",
        statusMessage: `Gagal mengirim email via Resend: ${JSON.stringify(errorData)}`,
      };
    }

    const data = await res.json();
    return {
      success: true,
      messageId: data.id,
      provider: "resend",
      statusMessage: "Email berhasil terkirim melalui Resend.",
    };
  } catch (error) {
    return {
      success: false,
      provider: "resend",
      statusMessage: `Kesalahan jaringan saat pengiriman email: ${(error as Error).message}`,
    };
  }
}
