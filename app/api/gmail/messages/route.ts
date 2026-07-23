import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { getStore, updateStore, GmailImageDeliveryMessage } from "@/lib/gmail-store";

export const dynamic = "force-dynamic";

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
            const existingStore = getStore();
            const existing = existingStore.find(m => m.id === msgRef.id);
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
      const currentStore = getStore();
      updateStore([...liveGmailMessages, ...currentStore]);
    }

    const finalStore = getStore();
    return NextResponse.json({
      success: true,
      siteEmail: "davidchukwuyem73@gmail.com",
      messages: finalStore
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message || "Failed to fetch image delivery messages"
    }, { status: 500 });
  }
}
