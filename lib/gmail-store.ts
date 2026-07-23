import fs from "fs";
import path from "path";

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

const STORE_FILE = path.join(process.cwd(), "gmail-messages-store.json");

// In-memory backend store for image delivery emails
let imageDeliveryStore: GmailImageDeliveryMessage[] = [
  {
    id: "msg_gmail_1",
    threadId: "thread_001",
    senderName: "Admiral David",
    senderEmail: "davidchukwuyem73@gmail.com",
    subject: "Image Delivery Request: Custom Maritime Crest Logo",
    snippet: "Hello, I am requesting a high-resolution crest logo delivery for our coastal vessel...",
    body: "Hello Image Delivery Team,\n\nI am sending this message from my Gmail app to request a custom high-resolution maritime crest illustration with gold trim and anchor details.\n\nPlease provide the deliverable at your earliest convenience.\n\nBest regards,\nAdmiral David",
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

// Load from file if it exists
function loadStoreFromFile() {
  try {
    if (fs.existsSync(STORE_FILE)) {
      const data = fs.readFileSync(STORE_FILE, "utf-8");
      imageDeliveryStore = JSON.parse(data);
    }
  } catch (err) {
    console.warn("Could not load gmail messages store, using default:", err);
  }
}

// Save to file
function saveStoreToFile() {
  try {
    fs.writeFileSync(STORE_FILE, JSON.stringify(imageDeliveryStore, null, 2), "utf-8");
  } catch (err) {
    console.warn("Could not save gmail messages store:", err);
  }
}

// Load on initialization
loadStoreFromFile();

export function getStore() {
  return imageDeliveryStore;
}

export function updateStore(updated: GmailImageDeliveryMessage[]) {
  imageDeliveryStore = updated;
  saveStoreToFile();
}
