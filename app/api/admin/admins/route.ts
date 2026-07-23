import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  password?: string;
  superAdmin: boolean;
  status: "Active" | "Suspended";
  createdAt: string;
  createdBy?: string;
}

const ADMINS_FILE = path.join(process.cwd(), "admin-accounts.json");

let memoryAdmins: AdminUser[] = [
  {
    id: "admin_super_1",
    name: "Lord Admiral David Chukwuyem",
    email: "davidchukwuyem73@gmail.com",
    role: "Lord Admiral / Grand Admiral",
    password: "admiral_secret_command_2026",
    superAdmin: true,
    status: "Active",
    createdAt: "2026-01-01T00:00:00.000Z",
    createdBy: "System Initializer"
  },
  {
    id: "admin_super_2",
    name: "Primary Admiralty Command",
    email: "admin@saeahawks.org",
    role: "Grand Admiral",
    password: "admiral_secret_command_2026",
    superAdmin: true,
    status: "Active",
    createdAt: "2026-01-01T00:00:00.000Z",
    createdBy: "System Initializer"
  }
];

export function getAdminAccounts(): AdminUser[] {
  try {
    if (fs.existsSync(ADMINS_FILE)) {
      const data = fs.readFileSync(ADMINS_FILE, "utf-8");
      memoryAdmins = JSON.parse(data);
      return memoryAdmins;
    }
  } catch (err) {
    console.warn("Could not read admin accounts file, using memory store:", err);
  }
  return memoryAdmins;
}

export function saveAdminAccounts(admins: AdminUser[]) {
  memoryAdmins = admins;
  try {
    fs.writeFileSync(ADMINS_FILE, JSON.stringify(admins, null, 2), "utf-8");
  } catch (err) {
    console.warn("Could not write admin accounts file:", err);
  }
}

// GET /api/admin/admins - List all admin users
export async function GET() {
  const accounts = getAdminAccounts();
  // Strip passwords for listing
  const safeAccounts = accounts.map(({ password, ...rest }) => rest);
  return NextResponse.json({
    success: true,
    admins: safeAccounts
  });
}

// POST /api/admin/admins - Create a new admin user
export async function POST(req: NextRequest) {
  try {
    const { name, email, role, password, createdBy } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Name, email, and password are required." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const accounts = getAdminAccounts();

    if (accounts.some(a => a.email.toLowerCase() === cleanEmail)) {
      return NextResponse.json(
        { success: false, message: `Admin user with email '${cleanEmail}' already exists.` },
        { status: 400 }
      );
    }

    const newAdmin: AdminUser = {
      id: `admin_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: name.trim(),
      email: cleanEmail,
      role: role || "Co-Administrator",
      password: password,
      superAdmin: true,
      status: "Active",
      createdAt: new Date().toISOString(),
      createdBy: createdBy || "Grand Admiral"
    };

    const updated = [newAdmin, ...accounts];
    saveAdminAccounts(updated);

    const { password: _, ...safeAdmin } = newAdmin;

    return NextResponse.json({
      success: true,
      message: `New Admin '${newAdmin.name}' (${newAdmin.email}) successfully created with full administrative clearance!`,
      admin: safeAdmin
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create admin" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/admins - Revoke or delete an admin
export async function DELETE(req: NextRequest) {
  try {
    const { adminId } = await req.json();
    if (!adminId) {
      return NextResponse.json({ success: false, message: "Admin ID is required." }, { status: 400 });
    }

    let accounts = getAdminAccounts();
    if (accounts.length <= 1) {
      return NextResponse.json(
        { success: false, message: "Cannot remove the sole remaining admin account." },
        { status: 400 }
      );
    }

    const target = accounts.find(a => a.id === adminId);
    if (!target) {
      return NextResponse.json({ success: false, message: "Admin not found." }, { status: 404 });
    }

    accounts = accounts.filter(a => a.id !== adminId);
    saveAdminAccounts(accounts);

    return NextResponse.json({
      success: true,
      message: `Administrative access for '${target.name}' (${target.email}) has been revoked.`
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete admin" },
      { status: 500 }
    );
  }
}
