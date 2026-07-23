import fs from "fs";
import path from "path";
import {
  MemberRank,
  MemberStatus,
  Member,
  Application,
  ContributionType,
  Contribution,
  ForumPost,
  Election,
  EventLog,
  DocumentFile,
  AuditLog,
  PrivateersDB,
  LeadershipMember,
  RankDefinition,
  DutyDefinition,
  PromotionRecord,
  DutyAssignmentRecord,
  LeadershipTransferRecord,
  PermissionConfig
} from "./types";

export { MemberRank, MemberStatus, ContributionType };
export type { 
  Member, 
  Application, 
  Contribution, 
  ForumPost, 
  Election, 
  EventLog, 
  DocumentFile, 
  AuditLog, 
  PrivateersDB, 
  LeadershipMember,
  RankDefinition,
  DutyDefinition,
  PromotionRecord,
  DutyAssignmentRecord,
  LeadershipTransferRecord,
  PermissionConfig
};

export const DEFAULT_RANKS: RankDefinition[] = [
  // Seaman Class
  { id: "rank_1", name: "Landsman", class: "Seaman Class", tier: 1, insignia: "⚓", description: "Entry-level member of the Fleet.", requirements: "Learns traditions, discipline, navigation basics, and service values.", responsibilities: "Assists crew and completes seamanship orientation." },
  { id: "rank_2", name: "Seaman", class: "Seaman Class", tier: 2, insignia: "🌊", description: "Trained sailor who has gained basic experience.", requirements: "3 months active service.", responsibilities: "Standard watchkeeping and maintenance duties." },
  { id: "rank_3", name: "Able Seaman", class: "Seaman Class", tier: 3, insignia: "🧭", description: "Experienced sailor trusted with greater responsibilities.", requirements: "6 months service + seamanship evaluation.", responsibilities: "Sailing operations and junior crew guidance." },
  { id: "rank_4", name: "Salted Seaman", class: "Seaman Class", tier: 4, insignia: "🐟", description: "Veteran sailor with proven experience and loyalty.", requirements: "12 months service + conclave participation.", responsibilities: "Deck leadership and task execution." },
  { id: "rank_5", name: "Seasoned Seaman", class: "Seaman Class", tier: 5, insignia: "⛵🌟", description: "Highly experienced sailor who has gained wisdom through service.", requirements: "18 months service + committee work.", responsibilities: "Senior crew mentorship." },
  { id: "rank_6", name: "Weathered Seaman", class: "Seaman Class", tier: 6, insignia: "⛈️", description: "Senior veteran who has endured challenges and demonstrated reliability.", requirements: "24 months service + exemplary conduct.", responsibilities: "Tradition preservation and deck counsel." },

  // Privateer Class
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
  {
    id: "duty_lord_admiral",
    title: "Lord Admiral / Grand Admiral",
    category: "Admiralty Compass",
    description: "Supreme Guardian of the Fleet",
    eligibleRanks: ["Admiral Privateer"],
    responsibilities: [
      "Protects the vision and traditions of the Fleet.",
      "Final authority on major decisions.",
      "Represents the entire association."
    ],
    holderMqe: "MQE-0000001",
    holderName: "Admiral David Chukwuyem"
  },
  {
    id: "duty_commodore",
    title: "Commodore",
    category: "Admiralty Compass",
    description: "Fleet Coordination Commander",
    eligibleRanks: ["Commodore Privateer", "Admiral Privateer"],
    responsibilities: [
      "Coordinates ships, chapters, and operations.",
      "Oversees fleet expansion and strategic routes."
    ]
  },
  {
    id: "duty_captain_flagship",
    title: "Captain of the Flagship",
    category: "Admiralty Compass",
    description: "Commander of the Main Ship/Chapter",
    eligibleRanks: ["Captain Privateer", "Commodore Privateer", "Admiral Privateer"],
    responsibilities: [
      "Leads the flagship and primary chapter deck.",
      "Executes fleet decisions.",
      "Commands major conclave activities."
    ],
    holderMqe: "MQE-0000244",
    holderName: "Anne Bonny"
  },
  {
    id: "duty_master_fleet",
    title: "Master of the Fleet",
    category: "Admiralty Compass",
    description: "Fleet Organization Officer",
    eligibleRanks: ["Lieutenant Privateer", "Commander Privateer", "Captain Privateer", "Commodore Privateer", "Admiral Privateer"],
    responsibilities: [
      "Maintains organization and fleet registry.",
      "Coordinates crews across regional ports.",
      "Oversees procedures and discipline."
    ]
  },
  {
    id: "duty_quartermaster_gen",
    title: "Quartermaster General",
    category: "Admiralty Compass",
    description: "Resources and Logistics Officer",
    eligibleRanks: ["Master Privateer", "Lieutenant Privateer", "Commander Privateer", "Captain Privateer", "Commodore Privateer", "Admiral Privateer"],
    responsibilities: [
      "Manages supplies and cargo distribution.",
      "Controls resources and ledgers.",
      "Oversees financial organization and dues auditing."
    ],
    holderMqe: "MQE-0000123",
    holderName: "Jack Sparrow"
  },
  {
    id: "duty_navigator_gen",
    title: "Navigator General",
    category: "Admiralty Compass",
    description: "Strategy and Intelligence Officer",
    eligibleRanks: ["Lieutenant Privateer", "Commander Privateer", "Captain Privateer", "Commodore Privateer", "Admiral Privateer"],
    responsibilities: [
      "Research and nautical mapping.",
      "Strategic direction and planning.",
      "Intelligence and navigation knowledge."
    ]
  },
  {
    id: "duty_admiralty_council",
    title: "Admiralty Council Member",
    category: "Admiralty Compass",
    description: "Senior Advisory Board",
    eligibleRanks: ["Captain Privateer", "Commodore Privateer", "Admiral Privateer"],
    responsibilities: [
      "Strategic planning and policy-making.",
      "Ceremonial and leadership roles.",
      "Apex decision-making authority."
    ]
  }
];

const DB_FILE = path.join(process.cwd(), "privateers-db.json");

function getDB(): PrivateersDB {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.warn("Could not read database file, using seed data:", err);
  }
  return getSeedData();
}

function saveDB(data: PrivateersDB) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.warn("Could not write database file:", err);
  }
}

// Seed Generator
function getSeedData(): PrivateersDB {
  return {
    members: [
      {
        id: "mem_1",
        mqeNumber: "MQE-0000001",
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
        emergencyContact: { name: "Caroline Chukwuyem", relation: "Spouse", phone: "+234-801-234-5679" },
        skills: ["Naval Command", "Strategy", "Leadership"],
        profession: "Admiral",
        biography: "Supreme guardian of the fleet and visionary leader.",
        dateJoined: "2024-01-01",
        rank: MemberRank.ADMIRAL_PRIVATEER,
        assignedDuties: ["duty_lord_admiral"],
        status: MemberStatus.ACTIVE,
        suite: "Executive",
        fleet: "Main Fleet",
        chapter: "Great Niger Delta Chapter",
        committee: "Admiralty Council",
        serviceRecord: ["Served with distinction for 25 years"],
        awards: ["Fleet Commendation", "Leadership Award"],
        disciplinaryRecord: [],
        profilePhoto: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admiral",
        qrCodeCheckins: []
      },
      {
        id: "mem_2",
        mqeNumber: "MQE-0000123",
        name: "Jack Sparrow",
        preferredName: "Captain Jack",
        dob: "1980-07-20",
        gender: "Male",
        nationality: "British",
        state: "Lagos",
        lga: "Lekki",
        occupation: "Quartermaster",
        phone: "+234-802-345-6789",
        email: "jack.sparrow@corsairs.org",
        residentialAddress: "Quartermaster's Lodge, Port Authority",
        emergencyContact: { name: "Elizabeth Swann", relation: "Sister", phone: "+234-802-345-6790" },
        skills: ["Resource Management", "Logistics", "Negotiation"],
        profession: "Quartermaster General",
        biography: "Keeper of supplies and logistics.",
        dateJoined: "2024-02-15",
        rank: MemberRank.MASTER_PRIVATEER,
        assignedDuties: ["duty_quartermaster_gen"],
        status: MemberStatus.ACTIVE,
        suite: "Officer",
        fleet: "Main Fleet",
        chapter: "Great Niger Delta Chapter",
        committee: "Logistics Committee",
        serviceRecord: ["Managed supplies for 100+ voyages"],
        awards: ["Resource Management Excellence"],
        disciplinaryRecord: [],
        profilePhoto: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jack",
        qrCodeCheckins: []
      },
      {
        id: "mem_3",
        mqeNumber: "MQE-0000244",
        name: "Anne Bonny",
        preferredName: "Anne",
        dob: "1988-05-10",
        gender: "Female",
        nationality: "Irish",
        state: "Lagos",
        lga: "Victoria Island",
        occupation: "Ship Captain",
        phone: "+234-803-456-7890",
        email: "anne.bonny@corsairs.org",
        residentialAddress: "Captain's Quarters, Main Port",
        emergencyContact: { name: "Calico Jack", relation: "Partner", phone: "+234-803-456-7891" },
        skills: ["Ship Navigation", "Crew Leadership", "Combat"],
        profession: "Captain of the Flagship",
        biography: "Fearless captain commanding the main vessel.",
        dateJoined: "2024-03-10",
        rank: MemberRank.CAPTAIN_PRIVATEER,
        assignedDuties: ["duty_captain_flagship"],
        status: MemberStatus.ACTIVE,
        suite: "Officer",
        fleet: "Main Fleet",
        chapter: "Great Niger Delta Chapter",
        committee: "Operations Committee",
        serviceRecord: ["Led 50+ successful operations"],
        awards: ["Bravery Award", "Leadership Excellence"],
        disciplinaryRecord: [],
        profilePhoto: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anne",
        qrCodeCheckins: []
      },
      {
        id: "mem_4",
        mqeNumber: "MQE-0000018",
        name: "Edward Teach",
        preferredName: "Edward",
        dob: "1990-11-25",
        gender: "Male",
        nationality: "English",
        state: "Lagos",
        lga: "Ajah",
        occupation: "Historical Scribe",
        phone: "+234-804-567-8901",
        email: "edward.teach@corsairs.org",
        residentialAddress: "Archive Tower, Fleet Records",
        emergencyContact: { name: "Blackbeard Records", relation: "Guild", phone: "+234-804-567-8902" },
        skills: ["Documentation", "History", "Communication"],
        profession: "Scribe",
        biography: "Official recorder of fleet activities.",
        dateJoined: "2024-01-15",
        rank: MemberRank.SEAMAN,
        status: MemberStatus.ACTIVE,
        suite: "Standard",
        fleet: "Main Fleet",
        chapter: "Great Niger Delta Chapter",
        committee: "Records Committee",
        serviceRecord: ["Documented 500+ fleet events"],
        awards: [],
        disciplinaryRecord: [],
        profilePhoto: "https://api.dicebear.com/7.x/avataaars/svg?seed=Edward",
        qrCodeCheckins: []
      }
    ],
    applications: [],
    contributions: [],
    forumPosts: [
      {
        id: "post_1",
        category: "Announcements",
        title: "Seals of Commission Secured",
        content: "The official seals of commission have been struck and are safely locked in the Chapter Quarterdeck vault. Members requiring authenticated documentation should contact the office.",
        authorId: "mem_1",
        authorName: "Admiral David Chukwuyem",
        authorRank: MemberRank.ADMIRAL_PRIVATEER,
        createdAt: "2026-07-15T08:00:00Z",
        likes: ["MQE-0000123", "MQE-0000244"],
        comments: [
          {
            id: "com_1_1",
            authorId: "mem_4",
            authorName: "Edward Teach",
            authorRank: MemberRank.SEAMAN,
            content: "Seals have been struck and are safely locked in the Chapter Quarterdeck vault. I will bring the ledger for signatures.",
            createdAt: "2026-07-15T10:12:00Z"
          }
        ],
        isPinned: true,
        isAnnouncement: true
      },
      {
        id: "post_2",
        category: "Welfare",
        title: "Welfare cargo arrival - Brass River Port",
        content: "The Quartermaster has logged the arrival of the GND Welfare Cargo shipment (marine spares, engine fluids, safety kits) at Brass Marina. Active members in good standing (fully clear ledger) can consult Quartermaster Jack Sparrow to schedule collection.",
        authorId: "mem_2",
        authorName: "Jack Sparrow",
        authorRank: MemberRank.MASTER_PRIVATEER,
        createdAt: "2026-07-12T14:20:00Z",
        likes: ["MQE-0000244", "MQE-0000018"],
        comments: [
          {
            id: "com_2_1",
            authorId: "mem_3",
            authorName: "Anne Bonny",
            authorRank: MemberRank.CAPTAIN_PRIVATEER,
            content: "Excellent timing. We have two patrol boats undergoing scheduled maintenance. I will come to the port on Tuesday.",
            createdAt: "2026-07-13T09:30:00Z"
          }
        ],
        isPinned: false,
        isAnnouncement: false
      }
    ],
    elections: [],
    eventLogs: [],
    documentFiles: [],
    auditLogs: [],
    leadershipMembers: [
      {
        id: "lead_1",
        memberMqe: "MQE-0000001",
        name: "Admiral David Chukwuyem",
        duty: "Lord Admiral / Grand Admiral",
        appointedDate: "2026-01-01",
        status: "ACTIVE"
      },
      {
        id: "lead_2",
        memberMqe: "MQE-0000244",
        name: "Anne Bonny",
        duty: "Captain of the Flagship",
        appointedDate: "2026-02-01",
        status: "ACTIVE"
      }
    ]
  };
}

export const db = {
  getMembers: () => getDB().members,

  getMember: (mqeNumber: string) => {
    return getDB().members.find(m => m.mqeNumber === mqeNumber);
  },

  addMember: (member: Omit<Member, "id">) => {
    const data = getDB();
    const newMember: Member = {
      ...member,
      id: `mem_${Date.now()}`
    };
    data.members.push(newMember);
    saveDB(data);
    return newMember;
  },

  getApplications: () => getDB().applications,

  addApplication: (app: Omit<Application, "id">) => {
    const data = getDB();
    const newApp: Application = {
      ...app,
      id: `app_${Date.now()}`
    };
    data.applications.push(newApp);
    saveDB(data);
    return newApp;
  },

  setApplicationStatus: (applicationId: string, status: string, comment: string, actingUserEmail: string) => {
    const data = getDB();
    const app = data.applications.find(a => a.id === applicationId);
    const actor = data.members.find(m => m.email === actingUserEmail);
    if (app) {
      app.status = status;
      if (!app.decisionHistory) app.decisionHistory = [];
      app.decisionHistory.push({
        status,
        decidedBy: actor?.name || "Admin",
        decidedAt: new Date().toISOString(),
        comment
      });

      // Create member if approved
      if (status === "APPROVED" && app.applicantMqe) {
        const existing = data.members.find(m => m.mqeNumber === app.applicantMqe);
        if (!existing) {
          const newMember: Member = {
            id: `mem_${Date.now()}`,
            mqeNumber: app.applicantMqe,
            name: app.applicantName,
            preferredName: app.applicantName.split(" ")[0],
            dob: app.dob || "",
            gender: "",
            nationality: "",
            state: "",
            lga: "",
            occupation: "",
            phone: app.phone || "",
            email: app.email,
            residentialAddress: "",
            emergencyContact: { name: "", relation: "", phone: "" },
            skills: [],
            profession: "",
            biography: "",
            dateJoined: new Date().toISOString(),
            rank: MemberRank.LANDSMAN,
            status: MemberStatus.ACTIVE,
            suite: "Standard",
            chapter: app.chapterPreference || "Great Niger Delta Chapter",
            committee: "",
            serviceRecord: [],
            awards: [],
            disciplinaryRecord: [],
            profilePhoto: "",
            qrCodeCheckins: []
          };
          data.members.push(newMember);
        }
      }

      data.addAuditLog(
        actingUserEmail,
        actor?.name || "Admin",
        actor?.mqeNumber || "SYSTEM",
        "APPLICATION_DECISION",
        `Application for ${app.applicantName} (${app.applicantMqe}) set to ${status}. Notes: ${comment}`
      );

      saveDB(data);
      return true;
    }
    return false;
  },

  getContributions: () => getDB().contributions,

  addContribution: (contribution: Omit<Contribution, "id" | "auditTrail">, actingUserEmail: string) => {
    const data = getDB();
    const actor = data.members.find(m => m.email === actingUserEmail);
    const newContrib: Contribution = {
      ...contribution,
      id: `con_${Date.now()}`,
      auditTrail: [
        {
          action: "RECORDED_PAYMENT",
          updatedBy: actor?.name || "Quartermaster",
          updatedAt: new Date().toISOString(),
          comment: "Payment recorded"
        }
      ]
    };
    data.contributions.push(newContrib);

    data.addAuditLog(
      actingUserEmail,
      actor?.name || "Quartermaster",
      actor?.mqeNumber || "SYSTEM",
      "CONTRIBUTION_RECORDED",
      `Contribution of ${contribution.amount} for ${contribution.memberMqe} recorded (${contribution.type})`
    );

    saveDB(data);
    return newContrib;
  },

  getForumPosts: () => getDB().forumPosts,

  addForumPost: (post: Omit<ForumPost, "id" | "likes" | "comments">, actingUserEmail: string) => {
    const data = getDB();
    const actor = data.members.find(m => m.email === actingUserEmail);
    const newPost: ForumPost = {
      ...post,
      id: `post_${Date.now()}`,
      likes: [],
      comments: []
    };
    data.forumPosts.push(newPost);
    saveDB(data);
    return newPost;
  },

  addForumComment: (postId: string, content: string, actingUserEmail: string) => {
    const data = getDB();
    const post = data.forumPosts.find(p => p.id === postId);
    const actor = data.members.find(m => m.email === actingUserEmail);
    if (post && actor) {
      // Convert actor.rank to MemberRank enum if it's a string
      let authorRank: MemberRank;
      if (typeof actor.rank === 'string') {
        // Try to find matching enum value
        const rankValue = Object.values(MemberRank).find(r => r === actor.rank);
        authorRank = rankValue || MemberRank.SEAMAN;
      } else {
        authorRank = actor.rank;
      }

      const newComment = {
        id: `com_${Date.now()}`,
        authorId: actor.id,
        authorName: actor.name,
        authorRank: authorRank,
        content,
        createdAt: new Date().toISOString()
      };
      post.comments.push(newComment);
      saveDB(data);
      return newComment;
    }
    return null;
  },

  getElections: () => getDB().elections,

  castVote: (electionId: string, candidateMqe: string, voterMqe: string) => {
    const data = getDB();
    const el = data.elections.find(e => e.id === electionId);
    if (el && el.status === "ACTIVE") {
      if (el.votedMqes.includes(voterMqe)) {
        return { success: false, message: "Member has already voted" };
      }
      const candidate = el.candidates.find(c => c.mqeNumber === candidateMqe);
      if (candidate) {
        candidate.votesCount = (candidate.votesCount || 0) + 1;
        el.votedMqes.push(voterMqe);
        saveDB(data);
        return { success: true, message: "Vote cast successfully" };
      }
    }
    return { success: false, message: "Election not active or candidate not found" };
  },

  getEventLogs: () => getDB().eventLogs,

  addEventLog: (event: Omit<EventLog, "id">) => {
    const data = getDB();
    const newEvent: EventLog = {
      ...event,
      id: `evt_${Date.now()}`
    };
    data.eventLogs.push(newEvent);
    saveDB(data);
    return newEvent;
  },

  getDocuments: () => getDB().documentFiles,

  addDocument: (doc: Omit<DocumentFile, "id">) => {
    const data = getDB();
    const newDoc: DocumentFile = {
      ...doc,
      id: `doc_${Date.now()}`
    };
    data.documentFiles.push(newDoc);
    saveDB(data);
    return newDoc;
  },

  getAuditLogs: () => getDB().auditLogs,

  addAuditLog: (email: string, name: string, mqe: string, action: string, details: string) => {
    const data = getDB();
    const log: AuditLog = {
      id: `audit_${Date.now()}`,
      userEmail: email,
      userName: name,
      userMqe: mqe,
      action,
      details,
      timestamp: new Date().toISOString()
    };
    data.auditLogs.push(log);
    if (data.auditLogs.length > 5000) {
      data.auditLogs = data.auditLogs.slice(-5000);
    }
    saveDB(data);
  },

  getLeadershipMembers: () => getDB().leadershipMembers,

  assignDuty: (memberMqe: string, dutyId: string, actingUserEmail: string) => {
    const data = getDB();
    const member = data.members.find(m => m.mqeNumber === memberMqe);
    const actor = data.members.find(m => m.email === actingUserEmail);
    const duty = DEFAULT_DUTIES.find(d => d.id === dutyId);
    if (!member) return false;
    if (!duty) return false;

    // Clear duty from previous holder
    const prevHolder = data.leadershipMembers.find(lm => lm.duty === duty.title);
    if (prevHolder) {
      const prevMember = data.members.find(m => m.mqeNumber === prevHolder.memberMqe);
      if (prevMember && prevMember.assignedDuties) {
        prevMember.assignedDuties = prevMember.assignedDuties.filter(d => !d.toLowerCase().includes("lord admiral"));
      }
    }

    if (!member.assignedDuties) member.assignedDuties = [];
    member.assignedDuties.push(duty.title);

    const leadershipMember: LeadershipMember = {
      id: `lead_${Date.now()}`,
      memberMqe: member.mqeNumber,
      name: member.name,
      duty: duty.title,
      appointedDate: new Date().toISOString(),
      status: "ACTIVE"
    };
    data.leadershipMembers.push(leadershipMember);

    data.addAuditLog(
      actingUserEmail,
      actor?.name || "Admin",
      actor?.mqeNumber || "SYSTEM",
      "DUTY_ASSIGNED",
      `Duty "${duty.title}" assigned to ${member.name} (${member.mqeNumber}) by ${actor?.name || actingUserEmail}.`
    );

    saveDB(data);
    return true;
  },

  removeDuty: (memberMqe: string, dutyTitle: string, actingUserEmail: string) => {
    const data = getDB();
    const member = data.members.find(m => m.mqeNumber === memberMqe);
    const actor = data.members.find(m => m.email === actingUserEmail);
    if (!member || !member.assignedDuties) return false;

    member.assignedDuties = member.assignedDuties.filter(d => d !== dutyTitle);

    const idx = data.leadershipMembers.findIndex(lm => lm.memberMqe === memberMqe && lm.duty === dutyTitle);
    if (idx !== -1) {
      data.leadershipMembers[idx].status = "INACTIVE";
    }

    data.addAuditLog(
      actingUserEmail,
      actor?.name || "Admin",
      actor?.mqeNumber || "SYSTEM",
      "DUTY_REMOVED",
      `Duty "${dutyTitle}" removed from ${member.name} (${member.mqeNumber}) by ${actor?.name || actingUserEmail}.`
    );

    saveDB(data);
    return true;
  },

  promoteMember: (memberMqe: string, newRank: string, reason: string, actingUserEmail: string) => {
    const data = getDB();
    const member = data.members.find(m => m.mqeNumber === memberMqe);
    const actor = data.members.find(m => m.email === actingUserEmail);
    if (!member) return false;

    const previousRank = member.rank;
    if (previousRank === newRank) return true;

    member.rank = newRank;
    if (!member.previousRanks) member.previousRanks = [];
    if (!member.previousRanks.includes(previousRank)) {
      member.previousRanks.push(previousRank);
    }

    const rec: PromotionRecord = {
      id: `promo_${Date.now()}`,
      memberMqe: member.mqeNumber,
      memberName: member.name,
      previousRank,
      newRank,
      promotedBy: actor?.name || actingUserEmail,
      promotedAt: new Date().toISOString(),
      reason
    };

    if (!data.promotionRecords) {
      data.promotionRecords = [];
    }
    data.promotionRecords.push(rec);

    data.addAuditLog(
      actingUserEmail,
      actor?.name || "Admin",
      actor?.mqeNumber || "SYSTEM",
      "PROMOTION",
      `${member.name} (${member.mqeNumber}) promoted from ${previousRank} to ${newRank}. Reason: ${reason}`
    );

    saveDB(data);
    return true;
  }
};
