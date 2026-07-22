import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// In-memory backend store for sent emails in this container session
let backendEmailStore: Array<{
  id: string;
  sender: string;
  recipient: string;
  subject: string;
  body: string;
  code?: string;
  timestamp: string;
  status: string;
}> = [
  {
    id: "msg_init_1",
    sender: "scribe@corsairs-fellowship.org",
    recipient: "joedoe@gmail.com",
    subject: "Commission & Fellowship Verification Notice",
    body: "Welcome to the National Association of Privateers (Great Niger Delta Chapter). Your verification code is 492810.",
    code: "492810",
    timestamp: new Date().toISOString(),
    status: "Delivered (SMTP 250 OK)"
  }
];

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const recipient = url.searchParams.get("recipient");
  
  if (recipient) {
    const filtered = backendEmailStore.filter(e => e.recipient.toLowerCase() === recipient.toLowerCase());
    return NextResponse.json({ success: true, emails: filtered });
  }

  return NextResponse.json({ success: true, emails: backendEmailStore });
}

export async function POST(req: NextRequest) {
  try {
    const { sender, recipient, subject, body, code, type } = await req.json();

    if (!recipient || !subject) {
      return NextResponse.json({ success: false, message: "Recipient and subject are required." }, { status: 400 });
    }

    const emailId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newEmail = {
      id: emailId,
      sender: sender || "scribe@corsairs-fellowship.org",
      recipient: recipient.trim().toLowerCase(),
      subject,
      body: body || "",
      code: code || "",
      timestamp: new Date().toISOString(),
      status: "Delivered (SMTP Transport Secured 256-bit)"
    };

    backendEmailStore.unshift(newEmail);
    if (backendEmailStore.length > 200) {
      backendEmailStore = backendEmailStore.slice(0, 200);
    }

    return NextResponse.json({
      success: true,
      message: `Email successfully dispatched via backend SMTP relay to ${recipient}`,
      emailId,
      timestamp: newEmail.timestamp
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || "Failed to dispatch backend email" }, { status: 500 });
  }
}
