import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";
import { getAdminAccounts } from "@/app/api/admin/admins/route";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { emailOrMqe, password } = await req.json();

    const envAdminEmail = (process.env.ADMIN_EMAIL || "admin@saeahawks.org").toLowerCase();
    const envAdminPassword = process.env.ADMIN_PASSWORD || "admiral_secret_command_2026";
    const jwtSecret = process.env.JWT_SECRET || "super-secret-jwt-key-gnd-corsairs-2026";

    const cleanInput = (emailOrMqe || "").trim().toLowerCase();

    // Fetch dynamic admin list
    const adminAccounts = getAdminAccounts();

    // Check environment default or dynamic admin user
    const matchedAdmin = adminAccounts.find(
      a => a.email.toLowerCase() === cleanInput && a.status === "Active" && a.password === password
    );

    const isEnvAdminMatch = cleanInput === envAdminEmail && password === envAdminPassword;

    if (matchedAdmin || isEnvAdminMatch) {
      const activeEmail = matchedAdmin ? matchedAdmin.email : envAdminEmail;
      const activeName = matchedAdmin ? matchedAdmin.name : "Lord Admiral David Chukwuyem";
      const activeRole = matchedAdmin ? matchedAdmin.role : "Lord Admiral / Grand Admiral";

      // Create a JWT token using jose
      const secret = new TextEncoder().encode(jwtSecret);
      const token = await new jose.SignJWT({ email: activeEmail, superAdmin: true, role: activeRole })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("24h")
        .sign(secret);

      return NextResponse.json({
        success: true,
        token,
        user: {
          id: matchedAdmin ? matchedAdmin.id : "admin_super",
          email: activeEmail,
          name: activeName,
          mqeNumber: "MQE-ADMIN-001",
          rank: activeRole,
          status: "Active",
          superAdmin: true
        }
      });
    }

    return NextResponse.json(
      { success: false, message: "Invalid administrative credentials" },
      { status: 401 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Server Error" },
      { status: 500 }
    );
  }
}
