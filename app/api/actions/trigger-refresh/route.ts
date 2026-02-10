import { NextResponse } from "next/server";

export async function POST() {
  const webhookUrl = process.env.N8N_WEBHOOK_URL;

  if (!webhookUrl) {
    return NextResponse.json(
      { error: "N8N_WEBHOOK_URL is not configured" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "refresh-prices", timestamp: new Date().toISOString() }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Webhook call failed", status: response.status },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true, message: "Refresh triggered" });
  } catch (error) {
    console.error("Error triggering refresh:", error);
    return NextResponse.json(
      { error: "Failed to call webhook" },
      { status: 500 }
    );
  }
}
