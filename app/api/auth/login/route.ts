import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";

export async function POST(req: NextRequest) {
  try {
    const { emailOrMqe, password } = await req.json();

    const adminEmail = process.env.ADMIN_EMAIL || "admin@saeahawks.org";
    const adminPassword = process.env.ADMIN_PASSWORD || "admiral_secret_command_2026";
    const jwtSecret = process.env.JWT_SECRET || "super-secret-jwt-key-gnd-corsairs-2026";

    if (
      emailOrMqe &&
      emailOrMqe.trim().toLowerCase() === adminEmail.toLowerCase() &&
      password === adminPassword
    ) {
      // Create a JWT token using jose
      const secret = new TextEncoder().encode(jwtSecret);
      const token = await new jose.SignJWT({ email: adminEmail, superAdmin: true, role: "Admiral" })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("24h")
        .sign(secret);

      return NextResponse.json({
        success: true,
        token,
        user: {
          id: "admin_super",
          email: adminEmail,
          name: "Lord Admiral David Chukwuyem",
          mqeNumber: "MQE-ADMIN-001",
          rank: "Lord Admiral / Grand Admiral",
          status: "Active",
          superAdmin: true
        }
      });
    }

    return NextResponse.json(
      { success: false, message: "Invalid credentials" },
      { status: 401 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Server Error" },
      { status: 500 }
    );
  }
}
