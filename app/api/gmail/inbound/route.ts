import { NextRequest, NextResponse } from "next/server";
import { getStore, updateStore, GmailImageDeliveryMessage } from "@/lib/gmail-store";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { senderName, senderEmail, subject, body, requestedPrompt } = await req.json();

    if (!senderEmail || !body) {
      return NextResponse.json({
        success: false,
        message: "Sender email and message body are required."
      }, { status: 400 });
    }

    const newMessage: GmailImageDeliveryMessage = {
      id: `msg_inbound_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      threadId: `thread_${Date.now()}`,
      senderName: senderName || senderEmail.split("@")[0],
      senderEmail: senderEmail.trim().toLowerCase(),
      subject: subject || "Image Delivery Request from Gmail",
      snippet: body.length > 120 ? body.substring(0, 120) + "..." : body,
      body: body,
      timestamp: new Date().toISOString(),
      status: "Pending Image Delivery",
      requestedImagePrompt: requestedPrompt || subject || "High resolution custom graphic illustration"
    };

    const store = getStore();
    updateStore([newMessage, ...store]);

    // Save inbound message to Firestore
    try {
      await addDoc(collection(db, "gmail_inbound"), newMessage);
    } catch (fsErr) {
      console.warn("Firestore inbound message notice:", fsErr);
    }

    return NextResponse.json({
      success: true,
      message: `Inbound message from ${senderEmail} successfully received and posted to the backend image delivery portal queue!`,
      messageId: newMessage.id,
      timestamp: newMessage.timestamp
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message || "Failed to process inbound Gmail message"
    }, { status: 500 });
  }
}
