import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

export const dynamic = "force-dynamic";

export interface GmailImageDeliveryMessage {
  id: string;
  threadId?: string;
  senderName: string;
  senderEmail: string;
  subject: string;
  snippet: string;
  body: string;
  timestamp: string;
  status: "Pending Image Delivery" | "Image Generated" | "Replied & Delivered";
  requestedImagePrompt?: string;
  deliveredImageUrl?: string;
  deliveredMessage?: string;
  replyTimestamp?: string;
}

// In-memory backend store for image delivery emails
let imageDeliveryStore: GmailImageDeliveryMessage[] = [
  {
    id: "msg_gmail_1",
    threadId: "thread_001",
    senderName: "Admiral David",
    senderEmail: "davidchukwuyem73@gmail.com",
    subject: "Image Delivery Request: Custom Maritime Crest Logo",
    snippet: "Hello, I am requesting a high-resolution crest logo delivery for our coastal vessel...",
    body: "Hello Image Delivery Team,\n\nI am sending this message from my Gmail app to request a custom high-resolution maritime crest illustration with gold trim and anchor details.\n\nPlease process this request and email me back directly with the image attached.\n\nThank you,\nAdmiral David",
    timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    status: "Pending Image Delivery",
    requestedImagePrompt: "A majestic gold and navy maritime crest featuring crossed anchors and privateers emblem"
  },
  {
    id: "msg_gmail_2",
    threadId: "thread_002",
    senderName: "Captain Jack Sparrow",
    senderEmail: "jack@corsairs.org",
    subject: "Urgent Image Delivery: Vessel Inspection Blueprint",
    snippet: "Requesting high-res nautical blueprint scan for inspection...",
    body: "Ahoy Image Hub,\n\nKindly send over the detailed nautical vessel architectural blueprint illustration to my inbox.\n\nFair winds,\nCaptain Jack",
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    status: "Replied & Delivered",
    requestedImagePrompt: "Nautical architectural vessel blueprint with technical grid lines",
    deliveredImageUrl: "https://picsum.photos/seed/blueprint/800/600",
    deliveredMessage: "Ahoy Jack! Here is your requested high-resolution nautical blueprint illustration delivered directly to your inbox.",
    replyTimestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString()
  }
];

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization") || req.headers.get("x-goog-authenticated-user-token");
    const oauthToken = process.env.GOOGLE_OAUTH_TOKEN || (authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null);

    let liveGmailMessages: GmailImageDeliveryMessage[] = [];

    if (oauthToken) {
      try {
        const auth = new google.auth.OAuth2();
        auth.setCredentials({ access_token: oauthToken });
        const gmail = google.gmail({ version: "v1", auth });

        const listRes = await gmail.users.messages.list({
          userId: "me",
          maxResults: 15,
        });

        if (listRes.data.messages && listRes.data.messages.length > 0) {
          for (const msgRef of listRes.data.messages.slice(0, 10)) {
            if (!msgRef.id) continue;
            const fullMsg = await gmail.users.messages.get({
              userId: "me",
              id: msgRef.id,
              format: "full"
            });

            const headers = fullMsg.data.payload?.headers || [];
            const subjectHeader = headers.find(h => h.name?.toLowerCase() === "subject")?.value || "No Subject";
            const fromHeader = headers.find(h => h.name?.toLowerCase() === "from")?.value || "Unknown Sender";
            const dateHeader = headers.find(h => h.name?.toLowerCase() === "date")?.value || new Date().toISOString();

            // Extract email & name
            let senderName = fromHeader;
            let senderEmail = fromHeader;
            if (fromHeader.includes("<")) {
              senderName = fromHeader.split("<")[0].replace(/"/g, "").trim();
              senderEmail = fromHeader.split("<")[1].replace(">", "").trim();
            }

            let bodyText = fullMsg.data.snippet || "";
            if (fullMsg.data.payload?.body?.data) {
              bodyText = Buffer.from(fullMsg.data.payload.body.data, "base64").toString("utf-8");
            } else if (fullMsg.data.payload?.parts) {
              const textPart = fullMsg.data.payload.parts.find(p => p.mimeType === "text/plain" || p.mimeType === "text/html");
              if (textPart?.body?.data) {
                bodyText = Buffer.from(textPart.body.data, "base64").toString("utf-8");
              }
            }

            // Check if already in our store
            const existing = imageDeliveryStore.find(m => m.id === msgRef.id);
            if (!existing) {
              const newMsg: GmailImageDeliveryMessage = {
                id: msgRef.id,
                threadId: fullMsg.data.threadId || undefined,
                senderName: senderName || "Gmail User",
                senderEmail,
                subject: subjectHeader,
                snippet: fullMsg.data.snippet || bodyText.substring(0, 100),
                body: bodyText,
                timestamp: new Date(dateHeader).toISOString(),
                status: "Pending Image Delivery",
                requestedImagePrompt: subjectHeader.replace(/Image Delivery Request:|Request:/i, "").trim() || bodyText.substring(0, 80)
              };
              liveGmailMessages.push(newMsg);
            }
          }
        }
      } catch (err) {
        console.warn("Gmail API live sync notice:", err);
      }
    }

    // Merge live messages into store
    if (liveGmailMessages.length > 0) {
      imageDeliveryStore = [...liveGmailMessages, ...imageDeliveryStore];
    }

    return NextResponse.json({
      success: true,
      siteEmail: "davidchukwuyem73@gmail.com",
      messages: imageDeliveryStore
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message || "Failed to fetch image delivery messages"
    }, { status: 500 });
  }
}

// Export internal access for other API handlers in same process
export function getStore() {
  return imageDeliveryStore;
}

export function updateStore(updated: GmailImageDeliveryMessage[]) {
  imageDeliveryStore = updated;
}
