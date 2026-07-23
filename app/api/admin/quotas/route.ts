import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";

export const dynamic = "force-dynamic";

// Standard pre-seeded default quotas
const defaultQuotas = {
  recruitmentCap: 50,
  monthlyDuesQuota: 1500000, // in NGN
  minVoterTurnoutQuorum: 60, // in percentage
  patrolCampaignLimit: 5,
  documentsScribeCap: 100
};

// Helper to verify the Authorization Bearer token
async function verifyAdminToken(req: NextRequest): Promise<boolean> {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return false;
    }
    const token = authHeader.split(" ")[1];
    const jwtSecret = process.env.JWT_SECRET || "super-secret-jwt-key-gnd-corsairs-2026";
    const secret = new TextEncoder().encode(jwtSecret);
    const { payload } = await jose.jwtVerify(token, secret);
    return !!payload.superAdmin;
  } catch (err) {
    return false;
  }
}

export async function GET(req: NextRequest) {
  const isAuthorized = await verifyAdminToken(req);
  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized access to Quota Deck." }, { status: 401 });
  }

  return NextResponse.json({ success: true, quotas: defaultQuotas });
}

export async function POST(req: NextRequest) {
  const isAuthorized = await verifyAdminToken(req);
  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized access to Quota Deck." }, { status: 401 });
  }

  try {
    const adjustedQuotas = await req.json();
    return NextResponse.json({ 
      success: true, 
      quotas: adjustedQuotas, 
      message: "Operational quotas updated on secure Admiralty ledger." 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to save quotas." }, { status: 500 });
  }
}
