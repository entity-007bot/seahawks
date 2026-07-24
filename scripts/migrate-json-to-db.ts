/**
 * One-time migration: reads privateers-db.json (and admin-accounts.json)
 * and inserts everything into Neon via Prisma.
 *
 * Usage:
 *   npx tsx scripts/migrate-json-to-db.ts
 *
 * Run this ONCE, locally, with DATABASE_URL pointed at your Neon instance.
 * Make sure `npx prisma db push` (or migrate) has been run first so the
 * tables exist.
 */

import fs from "fs";
import path from "path";
import { prisma } from "../lib/prisma";

const DB_FILE = path.join(process.cwd(), "privateers-db.json");
const ADMINS_FILE = path.join(process.cwd(), "admin-accounts.json");

async function main() {
  if (!fs.existsSync(DB_FILE)) {
    console.log("No privateers-db.json found — nothing to migrate for members/etc.");
  } else {
    const raw = JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));

    console.log(`Migrating ${raw.members?.length || 0} members...`);
    const memberIdMap = new Map<string, string>(); // old mqeNumber -> new cuid

    for (const m of raw.members || []) {
      const created = await prisma.member.upsert({
        where: { mqeNumber: m.mqeNumber },
        update: {}, // don't overwrite if re-run
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

    console.log(`Migrating ${raw.applications?.length || 0} applications...`);
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
          interviewStatus: a.interviewStatus,
          interviewNotes: a.interviewNotes,
          backgroundStatus: a.backgroundStatus,
          adminNotes: a.adminNotes,
          approvalStatus: a.approvalStatus,
          approvalHistory: a.approvalHistory || undefined,
        },
      });
    }

    console.log(`Migrating ${raw.contributions?.length || 0} contributions...`);
    for (const c of raw.contributions || []) {
      const memberId = memberIdMap.get(c.memberMqe);
      if (!memberId) {
        console.warn(`Skipping contribution — no member found for MQE ${c.memberMqe}`);
        continue;
      }
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

    console.log(`Migrating ${raw.forumPosts?.length || 0} forum posts...`);
    for (const p of raw.forumPosts || []) {
      const authorId = memberIdMap.get(
        raw.members.find((m: any) => m.id === p.authorId)?.mqeNumber
      );
      if (!authorId) {
        console.warn(`Skipping forum post "${p.title}" — author not found`);
        continue;
      }
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
        const commentAuthorId = memberIdMap.get(
          raw.members.find((m: any) => m.id === c.authorId)?.mqeNumber
        );
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

    console.log(`Migrating ${raw.eventLogs?.length || 0} events...`);
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
          rsvps: e.rsvps || undefined,
          attendanceList: e.attendanceList || [],
          reports: e.reports,
        },
      });
    }

    console.log(`Migrating ${raw.documentFiles?.length || 0} documents...`);
    for (const d of raw.documentFiles || []) {
      await prisma.documentFile.create({
        data: {
          title: d.title,
          category: d.category,
          fileUrl: d.fileUrl,
          versionHistory: d.versionHistory || undefined,
        },
      });
    }

    console.log(`Migrating ${raw.leadershipMembers?.length || 0} leadership roles...`);
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

    console.log(`Migrating ${raw.auditLogs?.length || 0} audit logs...`);
    for (const log of raw.auditLogs || []) {
      await prisma.auditLog.create({
        data: {
          userEmail: log.userEmail,
          userName: log.userName,
          userMqe: log.userMqe,
          action: log.action,
          details: log.details,
        },
      });
    }
  }

  if (fs.existsSync(ADMINS_FILE)) {
    const admins = JSON.parse(fs.readFileSync(ADMINS_FILE, "utf-8"));
    console.log(`Migrating ${admins.length} admin accounts...`);
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
    console.log("No admin-accounts.json found.");
  }

  console.log("Migration complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
