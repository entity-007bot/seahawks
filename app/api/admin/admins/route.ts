import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// GET /api/admin/admins - List all admin users
export async function GET() {
  try {
    const { getAdminAccounts } = await import("@/lib/admin-store");
    const accounts = getAdminAccounts();
    // Strip passwords for listing
    const safeAccounts = accounts.map(({ password, ...rest }) => rest);
    return NextResponse.json({
      success: true,
      admins: safeAccounts
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch admins" },
      { status: 500 }
    );
  }
}

// POST /api/admin/admins - Create a new admin user
export async function POST(req: NextRequest) {
  try {
    const { getAdminAccounts, saveAdminAccounts } = await import("@/lib/admin-store");
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

    const newAdmin = {
      id: `admin_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: name.trim(),
      email: cleanEmail,
      role: role || "Co-Administrator",
      password: password,
      superAdmin: true,
      status: "Active" as const,
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
    const { getAdminAccounts, saveAdminAccounts } = await import("@/lib/admin-store");
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
