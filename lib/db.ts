import { prisma } from "./prisma";
import {
  MemberRank,
  MemberStatus,
  ContributionType,
  RankDefinition,
  DutyDefinition,
} from "./types";

export { MemberRank, MemberStatus, ContributionType };

export const DEFAULT_RANKS: RankDefinition[] = [
  { id: "rank_1", name: "Landsman", class: "Seaman Class", tier: 1, insignia: "⚓", description: "Entry-level member of the Fleet.", requirements: "Learns traditions, discipline, navigation basics, and service values.", responsibilities: "Assists crew and completes seamanship orientation." },
  { id: "rank_2", name: "Seaman", class: "Seaman Class", tier: 2, insignia: "🌊", description: "Trained sailor who has gained basic experience.", requirements: "3 months active service.", responsibilities: "Standard watchkeeping and maintenance duties." },
  { id: "rank_3", name: "Able Seaman", class: "Seaman Class", tier: 3, insignia: "🧭", description: "Experienced sailor trusted with greater responsibilities.", requirements: "6 months service + seamanship evaluation.", responsibilities: "Sailing operations and junior crew guidance." },
  { id: "rank_4", name: "Salted Seaman", class: "Seaman Class", tier: 4, insignia: "🐟", description: "Veteran sailor with proven experience and loyalty.", requirements: "12 months service + conclave participation.", responsibilities: "Deck leadership and task execution." },
  { id: "rank_5", name: "Seasoned Seaman", class: "Seaman Class", tier: 5, insignia: "⛵🌟", description: "Highly experienced sailor who has gained wisdom through service.", requirements: "18 months service + committee work.", responsibilities: "Senior crew mentorship." },
  { id: "rank_6", name: "Weathered Seaman", class: "Seaman Class", tier: 6, insignia: "⛈️", description: "Senior veteran who has endured challenges and demonstrated reliability.", requirements: "24 months service + exemplary conduct.", responsibilities: "Tradition preservation and deck counsel." },
  { id: "rank_7", name: "Able Privateer", class: "Privateer Class", tier: 7, insignia: "⚔️", description: "First level of recognized Privateer service.", requirements: "Demonstrates skill, discipline, and commitment.", responsibilities: "Active privateering patrol and fleet duties." },
  { id: "rank_8", name: "Privateer", class: "Privateer Class", tier: 8, insignia: "🗡️", description: "Fully recognized member of the Privateer Fleet.", requirements: "Letters of Marque evaluation.", responsibilities: "Full tactical and operational participation." },
  { id: "rank_9", name: "Senior Privateer", class: "Privateer Class", tier: 9, insignia: "🦅", description: "Experienced Privateer trusted with leadership assistance.", requirements: "12 months Privateer service.", responsibilities: "Leadership assistance and squad command." },
  { id: "rank_10", name: "Master Privateer", class: "Privateer Class", tier: 10, insignia: "🌊⛄", description: "Senior specialist and warrant-level rank.", requirements: "Proven specialist expertise or Quartermaster track.", responsibilities: "Warrant leadership, logistics & discipline support." },
  { id: "rank_11", name: "Lieutenant Privateer", class: "Privateer Class", tier: 11, insignia: "🎖️", description: "Junior officer rank responsible for command assistance.", requirements: "Officer commission approval.", responsibilities: "Command assistance and navigation support." },
  { id: "rank_12", name: "Commander Privateer", class: "Privateer Class", tier: 12, insignia: "🔱", description: "Senior officer rank responsible for managing operations.", requirements: "Executive committee recommendation.", responsibilities: "Operations management and fleet coordination." },
  { id: "rank_13", name: "Captain Privateer", class: "Privateer Class", tier: 13, insignia: "🚢", description: "Highest operational command rank.", requirements: "Command clearance + chapter leadership history.", responsibilities: "Eligible to command a flagship or major chapter." },
  { id: "rank_14", name: "Commodore Privateer", class: "Privateer Class", tier: 14, insignia: "🌟", description: "Senior fleet command rank.", requirements: "Fleet-wide distinction.", responsibilities: "Eligible for appointment as Commodore of the Association." },
  { id: "rank_15", name: "Admiral Privateer", class: "Privateer Class", tier: 15, insignia: "👑", description: "Highest rank in the Fleet.", requirements: "Supreme service record + Council elevation.", responsibilities: "Eligible for appointment as Lord Admiral / Grand Admiral of the Fleet." }
];

export const DEFAULT_DUTIES: DutyDefinition[] = [
  { id: "duty_lord_admiral", title: "Lord Admiral / Grand Admiral", category: "Admiralty Compass", description: "Supreme Guardian of the Fleet", eligibleRanks: ["Admiral Privateer"], responsibilities: ["Protects the vision and traditions of the Fleet.", "Final authority on major decisions.", "Represents the entire association."], holderMqe: "MQE-ADMIN-1", holderName: "Admiral David Chukwuyem" },
  { id: "duty_commodore", title: "Commodore", category: "Admiralty Compass", description: "Fleet Coordination Commander", eligibleRanks: ["Commodore Privateer", "Admiral Privateer"], responsibilities: ["Coordinates ships, chapters, and operations.", "Oversees fleet expansion and strategic routes."] },
  { id: "duty_captain_flagship", title: "Captain of the Flagship", category: "Admiralty Compass", description: "Commander of the Main Ship/Chapter", eligibleRanks: ["Captain Privateer", "Commodore Privateer", "Admiral Privateer"], responsibilities: ["Leads the flagship and primary chapter deck.", "Executes fleet decisions.", "Commands major conclave activities."] },
  { id: "duty_master_fleet", title: "Master of the Fleet", category: "Admiralty Compass", description: "Fleet Organization Officer", eligibleRanks: ["Lieutenant Privateer", "Commander Privateer", "Captain Privateer", "Commodore Privateer", "Admiral Privateer"], responsibilities: ["Maintains organization and fleet registry.", "Coordinates crews across regional ports.", "Oversees procedures and discipline."] },
  { id: "duty_quartermaster_gen", title: "Quartermaster General", category: "Admiralty Compass", description: "Resources and Logistics Officer", eligibleRanks: ["Master Privateer", "Lieutenant Privateer", "Commander Privateer", "Captain Privateer", "Commodore Privateer", "Admiral Privateer"], responsibilities: ["Manages supplies and cargo distribution.", "Controls resources and ledgers.", "Oversees financial organization and dues auditing."] },
  { id: "duty_navigator_gen", title: "Navigator General", category: "Admiralty Compass", description: "Strategy and Intelligence Officer", eligibleRanks: ["Lieutenant Privateer", "Commander Privateer", "Captain Privateer", "Commodore Privateer", "Admiral Privateer"], responsibilities: ["Research and nautical mapping.", "Strategic direction and planning.", "Intelligence and navigation knowledge."] },
  { id: "duty_admiralty_council", title: "Admiralty Council Member", category: "Admiralty Compass", description: "Senior Advisory Board", eligibleRanks: ["Captain Privateer", "Commodore Privateer", "Admiral Privateer"], responsibilities: ["Strategic planning and policy-making.", "Ceremonial and leadership roles.", "Apex decision-making authority."] }
];

// Helper: convert a Prisma Member row back into the shape the rest of the app expects
function toMemberShape(m: any) {
  return {
    ...m,
    emergencyContact: {
      name: m.emergencyContactName || "",
      relation: m.emergencyContactRelation || "",
      phone: m.emergencyContactPhone || "",
    },
  };
}

async function pushAuditLog(email: string, name: string, mqe: string, action: string, details: string, memberId?: string) {
  await prisma.auditLog.create({
    data: { userEmail: email, userName: name, userMqe: mqe, action, details, memberId },
  });
}

export const db = {
  getMembers: async () => {
    const members = await prisma.member.findMany({ orderBy: { createdAt: "asc" } });
    return members.map(toMemberShape);
  },

  getMember: async (mqeNumber: string) => {
    const m = await prisma.member.findUnique({ where: { mqeNumber } });
    return m ? toMemberShape(m) : undefined;
  },

  addMember: async (member: any) => {
    const created = await prisma.member.create({
      data: {
        mqeNumber: member.mqeNumber,
        name: member.name,
        preferredName: member.preferredName,
        dob: member.dob,
        gender: member.gender,
        nationality: member.nationality,
        state: member.state,
        lga: member.lga,
        occupation: member.occupation,
        phone: member.phone,
        email: member.email,
        residentialAddress: member.residentialAddress,
        emergencyContactName: member.emergencyContact?.name,
        emergencyContactRelation: member.emergencyContact?.relation,
        emergencyContactPhone: member.emergencyContact?.phone,
        skills: member.skills || [],
        profession: member.profession,
        biography: member.biography,
        dateJoined: member.dateJoined,
        rank: member.rank || MemberRank.LANDSMAN,
        status: member.status || MemberStatus.ACTIVE,
        suite: member.suite,
        fleet: member.fleet,
        chapter: member.chapter,
        committee: member.committee,
        serviceRecord: member.serviceRecord || [],
        awards: member.awards || [],
        disciplinaryRecord: member.disciplinaryRecord || [],
        profilePhoto: member.profilePhoto,
        qrCodeCheckins: member.qrCodeCheckins || [],
        nin: member.nin,
        voterId: member.voterId,
        refereeMqe: member.refereeMqe,
      },
    });
    return toMemberShape(created);
  },

  getApplications: async () => prisma.application.findMany({ orderBy: { createdAt: "asc" } }),

  addApplication: async (app: any) => {
    return prisma.application.create({
      data: {
        applicantMqe: app.applicantMqe,
        applicantName: app.applicantName,
        dob: app.dob,
        phone: app.phone,
        email: app.email,
        chapterPreference: app.chapterPreference,
        status: app.status || "Pending",
      },
    });
  },

  setApplicationStatus: async (applicationId: string, status: string, comment: string, actingUserEmail: string) => {
    const app = await prisma.application.findUnique({ where: { id: applicationId } });
    if (!app) return false;
    const actor = await prisma.member.findUnique({ where: { email: actingUserEmail } });

    const decisionHistory = Array.isArray(app.decisionHistory) ? app.decisionHistory : [];
    decisionHistory.push({
      status,
      decidedBy: actor?.name || "Admin",
      decidedAt: new Date().toISOString(),
      comment,
    });

    await prisma.application.update({
      where: { id: applicationId },
      data: { status, decisionHistory },
    });

    if (status === "APPROVED" && app.applicantMqe) {
      const existing = await prisma.member.findUnique({ where: { mqeNumber: app.applicantMqe } });
      if (!existing) {
        await prisma.member.create({
          data: {
            mqeNumber: app.applicantMqe,
            name: app.applicantName,
            preferredName: app.applicantName.split(" ")[0],
            dob: app.dob || "",
            phone: app.phone || "",
            email: app.email,
            dateJoined: new Date().toISOString(),
            rank: MemberRank.LANDSMAN,
            status: MemberStatus.ACTIVE,
            suite: "Standard",
            chapter: app.chapterPreference || "Great Niger Delta Chapter",
          },
        });
      }
    }

    await pushAuditLog(
      actingUserEmail,
      actor?.name || "Admin",
      actor?.mqeNumber || "SYSTEM",
      "APPLICATION_DECISION",
      `Application for ${app.applicantName} (${app.applicantMqe}) set to ${status}. Notes: ${comment}`
    );

    return true;
  },

  getContributions: async () => prisma.contribution.findMany({ orderBy: { createdAt: "asc" } }),

  addContribution: async (contribution: any, actingUserEmail: string) => {
    const actor = await prisma.member.findUnique({ where: { email: actingUserEmail } });
    const member = await prisma.member.findUnique({ where: { mqeNumber: contribution.memberMqe } });
    if (!member) throw new Error(`No member found for MQE ${contribution.memberMqe}`);

    const newContrib = await prisma.contribution.create({
      data: {
        memberId: member.id,
        memberName: contribution.memberName,
        memberMqe: contribution.memberMqe,
        type: contribution.type,
        description: contribution.description,
        amount: contribution.amount,
        status: contribution.status || "OUTSTANDING",
        paymentDate: contribution.paymentDate,
        recordedBy: contribution.recordedBy,
        auditTrail: [
          {
            action: "RECORDED_PAYMENT",
            updatedBy: actor?.name || "Quartermaster",
            updatedAt: new Date().toISOString(),
            comment: "Payment recorded",
          },
        ],
      },
    });

    await pushAuditLog(
      actingUserEmail,
      actor?.name || "Quartermaster",
      actor?.mqeNumber || "SYSTEM",
      "CONTRIBUTION_RECORDED",
      `Contribution of ${contribution.amount} for ${contribution.memberMqe} recorded (${contribution.type})`
    );

    return newContrib;
  },

  getForumPosts: async () => {
    return prisma.forumPost.findMany({
      include: { comments: true },
      orderBy: { createdAt: "desc" },
    });
  },

  addForumPost: async (post: any, actingUserEmail: string) => {
    const actor = await prisma.member.findUnique({ where: { email: actingUserEmail } });
    if (!actor) throw new Error("Author not found");
    return prisma.forumPost.create({
      data: {
        category: post.category,
        title: post.title,
        content: post.content,
        authorId: actor.id,
        authorName: actor.name,
        authorRank: actor.rank,
        isPinned: post.isPinned || false,
        isAnnouncement: post.isAnnouncement || false,
      },
    });
  },

  addForumComment: async (postId: string, content: string, actingUserEmail: string) => {
    const post = await prisma.forumPost.findUnique({ where: { id: postId } });
    const actor = await prisma.member.findUnique({ where: { email: actingUserEmail } });
    if (!post || !actor) return null;

    return prisma.forumComment.create({
      data: {
        postId: post.id,
        authorId: actor.id,
        authorName: actor.name,
        authorRank: actor.rank,
        content,
      },
    });
  },

  getElections: async () => prisma.election.findMany({ orderBy: { createdAt: "desc" } }),

  castVote: async (electionId: string, candidateMqe: string, voterMqe: string) => {
    const el = await prisma.election.findUnique({ where: { id: electionId } });
    if (!el || el.status !== "ACTIVE") {
      return { success: false, message: "Election not active or candidate not found" };
    }
    if (el.votedMqes.includes(voterMqe)) {
      return { success: false, message: "Member has already voted" };
    }
    const candidates = Array.isArray(el.candidates) ? (el.candidates as any[]) : [];
    const candidate = candidates.find((c) => c.mqeNumber === candidateMqe);
    if (!candidate) {
      return { success: false, message: "Election not active or candidate not found" };
    }
    candidate.votesCount = (candidate.votesCount || 0) + 1;

    await prisma.election.update({
      where: { id: electionId },
      data: {
        candidates,
        votedMqes: { push: voterMqe },
      },
    });

    return { success: true, message: "Vote cast successfully" };
  },

  getEventLogs: async () => prisma.eventLog.findMany({ orderBy: { createdAt: "desc" } }),

  addEventLog: async (event: any) => {
    return prisma.eventLog.create({
      data: {
        title: event.title,
        description: event.description,
        date: event.date,
        time: event.time,
        location: event.location,
        meetingLink: event.meetingLink,
        coverImage: event.coverImage,
        attendanceList: event.attendanceList || [],
        reports: event.reports,
      },
    });
  },

  getDocuments: async () => prisma.documentFile.findMany({ orderBy: { uploadedAt: "desc" } }),

  addDocument: async (doc: any) => {
    return prisma.documentFile.create({
      data: {
        title: doc.title,
        category: doc.category,
        fileUrl: doc.fileUrl,
      },
    });
  },

  getAuditLogs: async () => prisma.auditLog.findMany({ orderBy: { timestamp: "desc" }, take: 5000 }),

  addAuditLog: async (email: string, name: string, mqe: string, action: string, details: string) => {
    await pushAuditLog(email, name, mqe, action, details);
  },

  getLeadershipMembers: async () => prisma.leadershipMember.findMany(),

  assignDuty: async (memberMqe: string, dutyId: string, actingUserEmail: string) => {
    const member = await prisma.member.findUnique({ where: { mqeNumber: memberMqe } });
    const actor = await prisma.member.findUnique({ where: { email: actingUserEmail } });
    const duty = DEFAULT_DUTIES.find((d) => d.id === dutyId);
    if (!member || !duty) return false;

    const prevHolder = await prisma.leadershipMember.findFirst({ where: { duty: duty.title, status: "ACTIVE" } });
    if (prevHolder) {
      const prevMember = await prisma.member.findUnique({ where: { mqeNumber: prevHolder.memberMqe } });
      if (prevMember) {
        await prisma.member.update({
          where: { id: prevMember.id },
          data: {
            assignedDuties: (prevMember.assignedDuties || []).filter(
              (d) => !d.toLowerCase().includes("lord admiral")
            ),
          },
        });
      }
      await prisma.leadershipMember.update({ where: { id: prevHolder.id }, data: { status: "INACTIVE" } });
    }

    await prisma.member.update({
      where: { id: member.id },
      data: { assignedDuties: { push: duty.title } },
    });

    await prisma.leadershipMember.create({
      data: {
        memberId: member.id,
        memberMqe: member.mqeNumber,
        name: member.name,
        duty: duty.title,
        appointedDate: new Date().toISOString(),
        status: "ACTIVE",
      },
    });

    await pushAuditLog(
      actingUserEmail,
      actor?.name || "Admin",
      actor?.mqeNumber || "SYSTEM",
      "DUTY_ASSIGNED",
      `Duty "${duty.title}" assigned to ${member.name} (${member.mqeNumber}) by ${actor?.name || actingUserEmail}.`,
      member.id
    );

    return true;
  },

  removeDuty: async (memberMqe: string, dutyTitle: string, actingUserEmail: string) => {
    const member = await prisma.member.findUnique({ where: { mqeNumber: memberMqe } });
    const actor = await prisma.member.findUnique({ where: { email: actingUserEmail } });
    if (!member) return false;

    await prisma.member.update({
      where: { id: member.id },
      data: { assignedDuties: (member.assignedDuties || []).filter((d) => d !== dutyTitle) },
    });

    const lm = await prisma.leadershipMember.findFirst({ where: { memberMqe, duty: dutyTitle } });
    if (lm) {
      await prisma.leadershipMember.update({ where: { id: lm.id }, data: { status: "INACTIVE" } });
    }

    await pushAuditLog(
      actingUserEmail,
      actor?.name || "Admin",
      actor?.mqeNumber || "SYSTEM",
      "DUTY_REMOVED",
      `Duty "${dutyTitle}" removed from ${member.name} (${member.mqeNumber}) by ${actor?.name || actingUserEmail}.`,
      member.id
    );

    return true;
  },

  // ---- THE FUNCTION THAT WAS CAUSING YOUR BUG ----
  promoteMember: async (memberMqe: string, newRank: string, reason: string, actingUserEmail: string) => {
    const member = await prisma.member.findUnique({ where: { mqeNumber: memberMqe } });
    const actor = await prisma.member.findUnique({ where: { email: actingUserEmail } });
    if (!member) return false;

    const previousRank = member.rank;
    if (previousRank === newRank) return true;

    const previousRanks = member.previousRanks.includes(previousRank)
      ? member.previousRanks
      : [...member.previousRanks, previousRank];

    await prisma.member.update({
      where: { id: member.id },
      data: { rank: newRank, previousRanks },
    });

    await prisma.promotionRecord.create({
      data: {
        memberId: member.id,
        memberMqe: member.mqeNumber,
        memberName: member.name,
        previousRank,
        newRank,
        promotedBy: actor?.name || actingUserEmail,
        reason,
      },
    });

    await pushAuditLog(
      actingUserEmail,
      actor?.name || "Admin",
      actor?.mqeNumber || "SYSTEM",
      "PROMOTION",
      `${member.name} (${member.mqeNumber}) promoted from ${previousRank} to ${newRank}. Reason: ${reason}`,
      member.id
    );

    return true;
  },
};
