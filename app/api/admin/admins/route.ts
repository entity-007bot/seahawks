import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { MemberRank, MemberStatus } from "@/lib/types";

// ONE-TIME SETUP ROUTE
// Visit once: https://yoursite.onrender.com/api/admin/seed-admiral?secret=YOUR_SECRET
// Creates (or upgrades) your Admiral account directly in Neon, since it
// previously only existed as hardcoded seed data and was never a real DB row.
//
// Safe to re-run: uses upsert, so running it twice won't create duplicates —
// it will just re-confirm the rank is Admiral Privateer.

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.MIGRATION_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admiral = await prisma.member.upsert({
    where: { email: "davidchukwuyem73@gmail.com" },
    update: {
      rank: MemberRank.ADMIRAL_PRIVATEER,
      status: MemberStatus.ACTIVE,
      adminRole: "Super Admin",
    },
    create: {
      mqeNumber: "MQE-ADMIN-1",
      name: "Admiral David Chukwuyem",
      preferredName: "Admiral David",
      dob: "1985-03-15",
      gender: "Male",
      nationality: "Nigerian",
      state: "Lagos",
      lga: "Lagos Island",
      occupation: "Fleet Commander",
      phone: "+234-801-234-5678",
      email: "davidchukwuyem73@gmail.com",
      residentialAddress: "Admiral's Quarters, Coastal Naval Base",
      emergencyContactName: "Caroline Chukwuyem",
      emergencyContactRelation: "Spouse",
      emergencyContactPhone: "+234-801-234-5679",
      skills: ["Naval Command", "Strategy", "Leadership"],
      profession: "Admiral",
      biography: "Supreme guardian of the fleet and visionary leader.",
      dateJoined: "2024-01-01",
      rank: MemberRank.ADMIRAL_PRIVATEER,
      assignedDuties: ["Lord Admiral / Grand Admiral"],
      status: MemberStatus.ACTIVE,
      adminRole: "Super Admin",
      suite: "Executive",
      fleet: "Main Fleet",
      chapter: "Great Niger Delta Chapter",
      committee: "Admiralty Council",
      serviceRecord: ["Served with distinction for 25 years"],
      awards: ["Fleet Commendation", "Leadership Award"],
      profilePhoto: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admiral",
    },
  });

  // Also ensure the AdminUser login account exists with Super Admin access
  const adminUser = await prisma.adminUser.upsert({
    where: { email: "davidchukwuyem73@gmail.com" },
    update: { superAdmin: true, status: "Active" },
    create: {
      name: "Lord Admiral David Chukwuyem",
      email: "davidchukwuyem73@gmail.com",
      role: "Lord Admiral / Grand Admiral",
      password: process.env.ADMIN_PASSWORD || "CHANGE_ME_IMMEDIATELY",
      superAdmin: true,
      status: "Active",
      createdBy: "System Initializer",
    },
  });

  return NextResponse.json({
    success: true,
    member: { id: admiral.id, mqeNumber: admiral.mqeNumber, rank: admiral.rank },
    adminUser: { id: adminUser.id, email: adminUser.email, superAdmin: adminUser.superAdmin },
  });
}
