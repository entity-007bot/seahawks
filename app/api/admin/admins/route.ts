import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";

// ONE-TIME MIGRATION ROUTE
// Visit: https://yoursite.onrender.com/api/admin/migrate-legacy-data?secret=YOUR_SECRET
// Reads privateers-db.json / admin-accounts.json from local disk (if still present
// on the current Render instance) and copies everything into Neon via Prisma.
//
// IMPORTANT: Render's disk is ephemeral. This only works if the JSON files are
// still present on the currently running instance. Run this IMMEDIATELY after
// deploying this route, before any redeploy wipes the files.
//
// Set MIGRATION_SECRET as an env var on Render (any random string) so this
// route can't be triggered by anyone else.

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.MIGRATION_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const DB_FILE = path.join(process.cwd(), "privateers-db.json");
  const ADMINS_FILE = path.join(process.cwd(), "admin-accounts.json");

  const log: string[] = [];

  if (fs.existsSync(DB_FILE)) {
    const raw = JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
    const memberIdMap = new Map<string, string>();

    log.push(`Migrating ${raw.members?.length || 0} members...`);
    for (const m of raw.members || []) {
      const created = await prisma.member.upsert({
        where: { mqeNumber: m.mqeNumber },
        update: {},
        create: {
          mqeNumber: m.mqeNumber,
          name: m.name,
          preferredName: m.preferredName,
          dob: m.dob,
          gender: m.gender,
          nationality: m.nationality,
          state: m.state,
          lga: m.lga,
          occupation: m.occupation,
          phone: m.phone,
          email: m.email,
          residentialAddress: m.residentialAddress,
          emergencyContactName: m.emergencyContact?.name,
          emergencyContactRelation: m.emergencyContact?.relation,
          emergencyContactPhone: m.emergencyContact?.phone,
          skills: m.skills || [],
          profession: m.profession,
          biography: m.biography,
          dateJoined: m.dateJoined,
          rank: m.rank,
          assignedDuties: m.assignedDuties || [],
          previousRanks: m.previousRanks || [],
          adminRole: m.adminRole,
          status: m.status,
          suite: m.suite,
          fleet: m.fleet,
          chapter: m.chapter,
          committee: m.committee,
          serviceRecord: m.serviceRecord || [],
          awards: m.awards || [],
          disciplinaryRecord: m.disciplinaryRecord || [],
          profilePhoto: m.profilePhoto,
          qrCodeCheckins: m.qrCodeCheckins || [],
          nin: m.nin,
          voterId: m.voterId,
          refereeMqe: m.refereeMqe,
        },
      });
      memberIdMap.set(m.mqeNumber, created.id);
    }

    log.push(`Migrating ${raw.applications?.length || 0} applications...`);
    for (const a of raw.applications || []) {
      await prisma.application.create({
        data: {
          applicantMqe: a.applicantMqe,
          applicantName: a.applicantName,
          dob: a.dob,
          phone: a.phone,
          email: a.email,
          chapterPreference: a.chapterPreference,
          status: a.status,
          decisionHistory: a.decisionHistory || undefined,
        },
      });
    }

    log.push(`Migrating ${raw.contributions?.length || 0} contributions...`);
    for (const c of raw.contributions || []) {
      const memberId = memberIdMap.get(c.memberMqe);
      if (!memberId) continue;
      await prisma.contribution.create({
        data: {
          memberId,
          memberName: c.memberName,
          memberMqe: c.memberMqe,
          type: c.type,
          description: c.description,
          amount: c.amount,
          status: c.status,
          paymentDate: c.paymentDate,
          recordedBy: c.recordedBy,
          auditTrail: c.auditTrail || undefined,
        },
      });
    }

    log.push(`Migrating ${raw.forumPosts?.length || 0} forum posts...`);
    for (const p of raw.forumPosts || []) {
      const authorMqe = raw.members.find((m: any) => m.id === p.authorId)?.mqeNumber;
      const authorId = authorMqe ? memberIdMap.get(authorMqe) : undefined;
      if (!authorId) continue;

      const createdPost = await prisma.forumPost.create({
        data: {
          category: p.category,
          title: p.title,
          content: p.content,
          authorId,
          authorName: p.authorName,
          authorRank: p.authorRank,
          likes: p.likes || [],
          isPinned: p.isPinned,
          isAnnouncement: p.isAnnouncement,
        },
      });

      for (const c of p.comments || []) {
        const commentAuthorMqe = raw.members.find((m: any) => m.id === c.authorId)?.mqeNumber;
        const commentAuthorId = commentAuthorMqe ? memberIdMap.get(commentAuthorMqe) : undefined;
        if (!commentAuthorId) continue;
        await prisma.forumComment.create({
          data: {
            postId: createdPost.id,
            authorId: commentAuthorId,
            authorName: c.authorName,
            authorRank: c.authorRank,
            content: c.content,
          },
        });
      }
    }

    log.push(`Migrating ${raw.eventLogs?.length || 0} events...`);
    for (const e of raw.eventLogs || []) {
      await prisma.eventLog.create({
        data: {
          title: e.title,
          description: e.description,
          date: e.date,
          time: e.time,
          location: e.location,
          meetingLink: e.meetingLink,
          coverImage: e.coverImage,
          attendanceList: e.attendanceList || [],
          reports: e.reports,
        },
      });
    }

    log.push(`Migrating ${raw.documentFiles?.length || 0} documents...`);
    for (const d of raw.documentFiles || []) {
      await prisma.documentFile.create({
        data: { title: d.title, category: d.category, fileUrl: d.fileUrl },
      });
    }

    log.push(`Migrating ${raw.leadershipMembers?.length || 0} leadership roles...`);
    for (const lm of raw.leadershipMembers || []) {
      const memberId = memberIdMap.get(lm.memberMqe);
      if (!memberId) continue;
      await prisma.leadershipMember.create({
        data: {
          memberId,
          memberMqe: lm.memberMqe,
          name: lm.name,
          duty: lm.duty,
          appointedDate: lm.appointedDate,
          status: lm.status,
        },
      });
    }

    log.push(`Migrating ${raw.auditLogs?.length || 0} audit logs...`);
    for (const a of raw.auditLogs || []) {
      await prisma.auditLog.create({
        data: {
          userEmail: a.userEmail,
          userName: a.userName,
          userMqe: a.userMqe,
          action: a.action,
          details: a.details,
        },
      });
    }
  } else {
    log.push("No privateers-db.json found on this instance.");
  }

  if (fs.existsSync(ADMINS_FILE)) {
    const admins = JSON.parse(fs.readFileSync(ADMINS_FILE, "utf-8"));
    log.push(`Migrating ${admins.length} admin accounts...`);
    for (const a of admins) {
      await prisma.adminUser.upsert({
        where: { email: a.email },
        update: {},
        create: {
          name: a.name,
          email: a.email,
          role: a.role,
          password: a.password,
          superAdmin: a.superAdmin,
          status: a.status,
          createdBy: a.createdBy,
        },
      });
    }
  } else {
    log.push("No admin-accounts.json found on this instance.");
  }

  log.push("Migration complete.");
  return NextResponse.json({ success: true, log });
}
