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
  { id: "rank_2", name: "Seaman", class: "Seaman Class", tier: 2, insignia: "⛵", description: "Trained sailor who has gained basic experience.", requirements: "3 months active service.", responsibilities: "Standard watchkeeping and maintenance duties." },
  { id: "rank_3", name: "Able Seaman", class: "Seaman Class", tier: 3, insignia: "🧭", description: "Experienced sailor trusted with greater responsibilities.", requirements: "6 months service + seamanship evaluation.", responsibilities: "Sailing operations and junior crew guidance." },
  { id: "rank_4", name: "Salted Seaman", class: "Seaman Class", tier: 4, insignia: "🌊", description: "Veteran sailor with proven experience and loyalty.", requirements: "12 months service + conclave participation.", responsibilities: "Deck leadership and task execution." },
  { id: "rank_5", name: "Seasoned Seaman", class: "Seaman Class", tier: 5, insignia: "🛡️", description: "Highly experienced sailor who has gained wisdom through service.", requirements: "18 months service + committee work.", responsibilities: "Senior crew mentorship." },
  { id: "rank_6", name: "Weathered Seaman", class: "Seaman Class", tier: 6, insignia: "📜", description: "Senior veteran who has endured challenges and demonstrated reliability.", requirements: "24 months service + exemplary conduct.", responsibilities: "Tradition preservation and deck counsel." },

  // Privateer Class
  { id: "rank_7", name: "Able Privateer", class: "Privateer Class", tier: 7, insignia: "⚔️", description: "First level of recognized Privateer service.", requirements: "Demonstrates skill, discipline, and commitment.", responsibilities: "Active privateering patrol and fleet duties." },
  { id: "rank_8", name: "Privateer", class: "Privateer Class", tier: 8, insignia: "🗡️", description: "Fully recognized member of the Privateer Fleet.", requirements: "Letters of Marque evaluation.", responsibilities: "Full tactical and operational participation." },
  { id: "rank_9", name: "Senior Privateer", class: "Privateer Class", tier: 9, insignia: "🦅", description: "Experienced Privateer trusted with leadership assistance.", requirements: "12 months Privateer service.", responsibilities: "Leadership assistance and squad command." },
  { id: "rank_10", name: "Master Privateer", class: "Privateer Class", tier: 10, insignia: "🎖️", description: "Senior specialist and warrant-level rank.", requirements: "Proven specialist expertise or Quartermaster track.", responsibilities: "Warrant leadership, logistics & discipline support." },
  { id: "rank_11", name: "Lieutenant Privateer", class: "Privateer Class", tier: 11, insignia: "🚩", description: "Junior officer rank responsible for command assistance.", requirements: "Officer commission approval.", responsibilities: "Command assistance and navigation support." },
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
    description: "Senior Advisor",
    eligibleRanks: ["Lieutenant Privateer", "Commander Privateer", "Captain Privateer", "Commodore Privateer", "Admiral Privateer"],
    responsibilities: [
      "Advises leadership on strategic policies.",
      "Reviews major decisions and charter amendments.",
      "Protects traditions and code of conduct."
    ]
  },
  {
    id: "duty_chief_boatswain",
    title: "Chief Boatswain / Master-at-Arms",
    category: "Admiralty Compass",
    description: "Discipline and Standards Officer",
    eligibleRanks: ["Master Privateer", "Lieutenant Privateer", "Commander Privateer", "Captain Privateer", "Commodore Privateer", "Admiral Privateer"],
    responsibilities: [
      "Maintains discipline on deck.",
      "Protects the code of conduct.",
      "Ensures accountability and conclave security."
    ]
  },
  {
    id: "duty_scribe",
    title: "Scribe",
    category: "Other Offices",
    description: "Keeper of Records and Traditions",
    eligibleRanks: [
      "Landsman", "Seaman", "Able Seaman", "Salted Seaman", "Seasoned Seaman", "Weathered Seaman",
      "Able Privateer", "Privateer", "Senior Privateer", "Master Privateer",
      "Lieutenant Privateer", "Commander Privateer", "Captain Privateer", "Commodore Privateer", "Admiral Privateer"
    ],
    responsibilities: [
      "Records meetings, conclaves, and events.",
      "Maintains archives and document vault.",
      "Preserves history and documents ceremonies.",
      "Spiritual/traditional keeper of prayers and reflections."
    ],
    holderMqe: "MQE-0000018",
    holderName: "Edward Teach"
  }
];

export const DEFAULT_LEADERSHIP_TRANSFERS: LeadershipTransferRecord[] = [
  {
    id: "lt_1",
    officeTitle: "Lord Admiral / Grand Admiral",
    previousHolderMqe: "MQE-0000000",
    previousHolderName: "Sovereign Founder Charter",
    newHolderMqe: "MQE-0000001",
    newHolderName: "Admiral David Chukwuyem",
    transferredAt: "2026-01-10T10:00:00Z",
    transferredBy: "Founder Assembly",
    reason: "Initial Charter Conclave Elevation & Founding Appointment as Lord Admiral."
  }
];

// In-Memory Fallback
let memoryDB: PrivateersDB = {
  members: [],
  applications: [],
  contributions: [],
  forumPosts: [],
  elections: [],
  events: [],
  documents: [],
  auditLogs: []
};

const DB_FILE_PATH = path.join(process.cwd(), "privateers-db.json");

// Helper to write db to file
function saveDB(data: PrivateersDB) {
  try {
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
    memoryDB = data;
  } catch (error) {
    console.error("Failed to save database file, keeping in memory:", error);
    memoryDB = data;
  }
}

// Helper to read db from file or load initial seed
export function getDB(): PrivateersDB {
  try {
    if (fs.existsSync(DB_FILE_PATH)) {
      const fileData = fs.readFileSync(DB_FILE_PATH, "utf-8");
      memoryDB = JSON.parse(fileData);
      return memoryDB;
    }
  } catch (error) {
    console.error("Failed to read database file, loading seed:", error);
  }

  // If file doesn't exist, generate SEED DATA
  const seededData = getSeedData();
  saveDB(seededData);
  return seededData;
}

// Seed Generator
function getSeedData(): PrivateersDB {
  const members: Member[] = [
    {
      id: "mem_1",
      mqeNumber: "MQE-0000001",
      name: "Admiral David Chukwuyem",
      preferredName: "Admiral David",
      dob: "1988-04-12",
      gender: "Male",
      nationality: "Nigerian",
      state: "Delta",
      lga: "Oshimili North",
      occupation: "Maritime Logistics Specialist",
      phone: "+234 803 111 2222",
      email: "joedoe@gmail.com", // Auto-aligned to user email
      residentialAddress: "14 Escravos Way, Warri, Delta State",
      emergencyContact: {
        name: "Mrs. Evelyn Chukwuyem",
        relation: "Spouse",
        phone: "+234 803 333 4444"
      },
      skills: ["Vessel Command", "Quartermaster Ledgers", "Nautical Cartography"],
      profession: "Marine Superintendent",
      biography: "Supreme Commander of the Great Niger Delta Corsairs Chapter. Overseer of all fleet deployments and letters of marque.",
      dateJoined: "2026-01-10",
      rank: MemberRank.ADMIRAL,
      status: MemberStatus.ACTIVE,
      suite: "",
      fleet: "",
      chapter: "Great Niger Delta Chapter",
      committee: "Disciplinary & Letters of Marque Committee",
      serviceRecord: [
        "Seeded the Great Niger Delta Charter (Jan 2026)",
        "Successfully launched the Corsairs Central Ledger (Feb 2026)",
        "Assigned Letters of Marque to the Forcados patrol fleet (Mar 2026)"
      ],
      awards: [
        "Order of the Golden Anchor (2026)",
        "GND Chapter Founder Star (2026)"
      ],
      disciplinaryRecord: [],
      profilePhoto: "https://picsum.photos/seed/admiral/400/400",
      qrCodeCheckins: ["2026-06-15T10:00:00Z", "2026-07-10T11:00:00Z"]
    },
    {
      id: "mem_2",
      mqeNumber: "MQE-0000123",
      name: "Jack Sparrow",
      preferredName: "Captain Jack",
      dob: "1985-06-09",
      gender: "Male",
      nationality: "Bahamian",
      state: "Bayelsa",
      lga: "Brass",
      occupation: "Vessel Pilot",
      phone: "+234 812 345 6789",
      email: "jack@corsairs.org",
      residentialAddress: "Pearl Harbor Marina, Brass, Bayelsa State",
      emergencyContact: {
        name: "Joshamee Gibbs",
        relation: "First Mate",
        phone: "+234 805 555 5555"
      },
      skills: ["Astrogation", "Saber Fencing", "Rum Tasting"],
      profession: "Deep Sea Navigator",
      biography: "Veteran Privateer and Quartermaster of the GND Chapter. Known for precise bookkeeping and manual dues auditing.",
      dateJoined: "2026-01-15",
      rank: MemberRank.QUARTERMASTER,
      status: MemberStatus.ACTIVE,
      suite: "",
      fleet: "",
      chapter: "Great Niger Delta Chapter",
      committee: "Welfare & Cargo Distribution Committee",
      serviceRecord: [
        "Appointed Chapter Quartermaster (Jan 2026)",
        "Recovered outstanding dues for Escravos Vanguard (May 2026)"
      ],
      awards: [
        "Silver Compass Award (2026)"
      ],
      disciplinaryRecord: [
        "Warned for unapproved vessel borrowing (Feb 2026)"
      ],
      profilePhoto: "https://picsum.photos/seed/jack/400/400",
      qrCodeCheckins: ["2026-06-15T10:15:00Z"]
    },
    {
      id: "mem_3",
      mqeNumber: "MQE-0000244",
      name: "Anne Bonny",
      preferredName: "Anne",
      dob: "1994-11-20",
      gender: "Female",
      nationality: "Irish-Nigerian",
      state: "Rivers",
      lga: "Bonny",
      occupation: "Marine Engineer",
      phone: "+234 809 999 8888",
      email: "anne@corsairs.org",
      residentialAddress: "8 Harbour Road, Bonny Island, Rivers State",
      emergencyContact: {
        name: "Calico Jack",
        relation: "Associate",
        phone: "+234 802 222 3333"
      },
      skills: ["Diesel Propulsion", "Heavy Rigging", "Tactical Comms"],
      profession: "Offshore Engineer",
      biography: "Fierce defender of the GND charter. First female Privateer in the chapter and active welfare officer.",
      dateJoined: "2026-02-01",
      rank: MemberRank.PRIVATEER,
      status: MemberStatus.ACTIVE,
      suite: "",
      fleet: "",
      chapter: "Great Niger Delta Chapter",
      committee: "Welfare & Cargo Distribution Committee",
      serviceRecord: [
        "Successfully audited Chapter bylaws (Feb 2026)",
        "Organized the Bonny Island Port Charity Outing (Apr 2026)"
      ],
      awards: [
        "Vanguard of the Month (March 2026)"
      ],
      disciplinaryRecord: [],
      profilePhoto: "https://picsum.photos/seed/anne/400/400",
      qrCodeCheckins: ["2026-06-15T10:10:00Z", "2026-07-10T11:05:00Z"]
    },
    {
      id: "mem_4",
      mqeNumber: "MQE-0000018",
      name: "Edward Teach",
      preferredName: "Blackbeard",
      dob: "1980-01-01",
      gender: "Male",
      nationality: "Nigerian",
      state: "Rivers",
      lga: "Port Harcourt",
      occupation: "Shipwright",
      phone: "+234 803 000 0000",
      email: "edward@corsairs.org",
      residentialAddress: "Queen Anne's Dockyard, Port Harcourt, Rivers State",
      emergencyContact: {
        name: "Israel Hands",
        relation: "Bosun",
        phone: "+234 803 444 5555"
      },
      skills: ["Ship Restoration", "Welding", "Crowd Management"],
      profession: "Marine Surveyor",
      biography: "Chapter Scribe and Chief Archivist. Keeps the log of GND assembly meetings and administers the document library.",
      dateJoined: "2026-01-12",
      rank: MemberRank.SCRIBE,
      status: MemberStatus.ACTIVE,
      suite: "",
      fleet: "",
      chapter: "Great Niger Delta Chapter",
      committee: "Maritime Logistics & Events Committee",
      serviceRecord: [
        "Transcribed GND Charter of 2026",
        "Configured the digital Document Vault"
      ],
      awards: [
        "Keeper of the Quill (2026)"
      ],
      disciplinaryRecord: [],
      profilePhoto: "https://picsum.photos/seed/edward/400/400",
      qrCodeCheckins: ["2026-06-15T09:55:00Z", "2026-07-10T10:55:00Z"]
    },
    {
      id: "mem_5",
      mqeNumber: "MQE-0001092",
      name: "Henry Morgan",
      preferredName: "Henry",
      dob: "1992-07-15",
      gender: "Male",
      nationality: "Nigerian",
      state: "Delta",
      lga: "Warri South",
      occupation: "Fisheries Officer",
      phone: "+234 805 123 4567",
      email: "henry@corsairs.org",
      residentialAddress: "3 Delta Port Road, Warri, Delta State",
      emergencyContact: {
        name: "Lady Mary Morgan",
        relation: "Mother",
        phone: "+234 803 777 8888"
      },
      skills: ["Inshore Navigation", "Security patrols"],
      profession: "Coastal Guard",
      biography: "Eager Recruit seeking full Privateer Letters of Marque. Active volunteer in state logistics.",
      dateJoined: "2026-06-25",
      rank: MemberRank.RECRUIT,
      status: MemberStatus.PENDING,
      suite: "",
      fleet: "",
      chapter: "Great Niger Delta Chapter",
      committee: "Maritime Logistics & Events Committee",
      serviceRecord: [
        "Completed Recruit Maritime Safety Training (July 2026)"
      ],
      awards: [],
      disciplinaryRecord: [],
      profilePhoto: "https://picsum.photos/seed/henry/400/400",
      qrCodeCheckins: []
    }
  ];

  const applications: Application[] = [
    {
      id: "app_1",
      memberId: "mem_5",
      interviewStatus: "Scheduled",
      interviewNotes: "Interview set for July 25th with Scribe Edward Teach and Admiral David.",
      backgroundStatus: "Passed",
      adminNotes: "Background checks completed successfully. Clean record. Displays high commitment to maritime safety and fraternal bond.",
      approvalStatus: "Pending",
      approvalHistory: [
        {
          status: MemberStatus.PENDING,
          updatedBy: "Admiral David Chukwuyem",
          updatedAt: "2026-06-25T14:30:00Z",
          comment: "Application received. Background verification initiated."
        }
      ]
    }
  ];

  const contributions: Contribution[] = [
    {
      id: "con_1",
      memberId: "mem_1",
      memberName: "Admiral David Chukwuyem",
      mqeNumber: "MQE-0000001",
      type: ContributionType.ANNUAL_DUES,
      description: "Annual Privateer Commission Levy for Fiscal Year 2026",
      amount: 150000,
      status: "PAID",
      paymentDate: "2026-01-15T09:00:00Z",
      recordedBy: "Jack Sparrow (Quartermaster)",
      auditTrail: [
        {
          action: "RECORDED_PAYMENT",
          updatedBy: "Jack Sparrow",
          updatedAt: "2026-01-15T09:10:00Z",
          previousValue: "OUTSTANDING"
        }
      ]
    },
    {
      id: "con_2",
      memberId: "mem_3",
      memberName: "Anne Bonny",
      mqeNumber: "MQE-0000244",
      type: ContributionType.MONTHLY_DUES,
      description: "Monthly dues for May 2026",
      amount: 15000,
      status: "PAID",
      paymentDate: "2026-05-02T11:45:00Z",
      recordedBy: "Jack Sparrow (Quartermaster)",
      auditTrail: [
        {
          action: "RECORDED_PAYMENT",
          updatedBy: "Jack Sparrow",
          updatedAt: "2026-05-02T11:50:00Z"
        }
      ]
    },
    {
      id: "con_3",
      memberId: "mem_3",
      memberName: "Anne Bonny",
      mqeNumber: "MQE-0000244",
      type: ContributionType.SPECIAL_LEVY,
      description: "GND Port Charity Outing Levy",
      amount: 25000,
      status: "PAID",
      paymentDate: "2026-04-10T16:00:00Z",
      recordedBy: "Jack Sparrow (Quartermaster)",
      auditTrail: [
        {
          action: "RECORDED_PAYMENT",
          updatedBy: "Jack Sparrow",
          updatedAt: "2026-04-10T16:05:00Z"
        }
      ]
    },
    {
      id: "con_4",
      memberId: "mem_4",
      memberName: "Edward Teach",
      mqeNumber: "MQE-0000018",
      type: ContributionType.MONTHLY_DUES,
      description: "Monthly dues for June 2026",
      amount: 15000,
      status: "PAID",
      paymentDate: "2026-06-12T10:00:00Z",
      recordedBy: "Jack Sparrow (Quartermaster)",
      auditTrail: []
    },
    {
      id: "con_5",
      memberId: "mem_3",
      memberName: "Anne Bonny",
      mqeNumber: "MQE-0000244",
      type: ContributionType.MONTHLY_DUES,
      description: "Monthly dues for June 2026",
      amount: 15000,
      status: "OUTSTANDING",
      recordedBy: "Jack Sparrow (Quartermaster)",
      auditTrail: []
    },
    {
      id: "con_6",
      memberId: "mem_2",
      memberName: "Jack Sparrow",
      mqeNumber: "MQE-0000123",
      type: ContributionType.FINE,
      description: "Disciplinary surcharge: Sailing vessel without Scribe log clearance",
      amount: 35000,
      status: "PAID",
      paymentDate: "2026-03-01T12:00:00Z",
      recordedBy: "Admiral David Chukwuyem (Admiral)",
      auditTrail: [
        {
          action: "RECORDED_PAYMENT",
          updatedBy: "David Chukwuyem",
          updatedAt: "2026-03-01T12:05:00Z"
        }
      ]
    }
  ];

  const forumPosts: ForumPost[] = [
    {
      id: "post_1",
      category: "Announcements",
      title: "Assembly Order: Letters of Marque Requirements Updated",
      content: "Attention all Privateers of the GND Chapter. Under order of the Admiral and Scribe, all vessels sailing under Chapter colors must carry physical paper copies of their Letters of Marque alongside their Digital Portal IDs. Scribe Teach will distribute the 2026 physical seals at next month's Conclave on Bonny Island. Guard your commissions safely.",
      authorId: "mem_1",
      authorName: "Admiral David Chukwuyem",
      authorRank: MemberRank.ADMIRAL,
      createdAt: "2026-07-15T08:00:00Z",
      likes: ["MQE-0000123", "MQE-0000244"],
      comments: [
        {
          id: "com_1_1",
          authorId: "mem_4",
          authorName: "Edward Teach",
          authorRank: MemberRank.SCRIBE,
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
      authorRank: MemberRank.QUARTERMASTER,
      createdAt: "2026-07-12T14:20:00Z",
      likes: ["MQE-0000244", "MQE-0000018"],
      comments: [
        {
          id: "com_2_1",
          authorId: "mem_3",
          authorName: "Anne Bonny",
          authorRank: MemberRank.PRIVATEER,
          content: "Excellent timing. We have two patrol boats undergoing scheduled maintenance. I will come to the port on Tuesday.",
          createdAt: "2026-07-13T09:30:00Z"
        }
      ],
      isPinned: false,
      isAnnouncement: false
    }
  ];

  const elections: Election[] = [
    {
      id: "el_1",
      title: "Grand Bosun Chapter Election 2026",
      description: "Vote for the Grand Bosun (Election and Succession Officer) of the Great Niger Delta chapter. The Bosun ensures secret ballots, monitors conclave voting, and registers candidates.",
      votingStart: "2026-07-19T00:00:00Z",
      votingEnd: "2026-07-26T23:59:00Z",
      status: "ACTIVE",
      candidates: [
        {
          mqeNumber: "MQE-0000244",
          name: "Anne Bonny",
          rank: MemberRank.PRIVATEER,
          campaignManifesto: "Transparency in elections. Complete live-audit trail for all chapter ballots. Let the Privateer's voice be heard in every conclave!",
          votesCount: 3
        },
        {
          mqeNumber: "MQE-0000018",
          name: "Edward Teach",
          rank: MemberRank.SCRIBE,
          campaignManifesto: "Tradition and code. I will ensure every ballot is inscribed in the permanent Scribe records with maximum security and absolute compliance with the GND Bylaws.",
          votesCount: 2
        }
      ],
      votedMqes: ["MQE-0000001", "MQE-0000123"]
    }
  ];

  const events: EventLog[] = [
    {
      id: "evt_1",
      title: "Mid-Year Corsairs Conclave & Audit",
      description: "Annual physical assembly, ledger auditing by the Quartermaster, awards of merit, and QR-code attendance check-in. Meeting minutes will be recorded by Scribe Teach.",
      date: "2026-07-24",
      time: "10:00 AM",
      location: "Grand Deck Assembly Hall, Port Harcourt",
      meetingLink: "https://zoom.us/j/9876543210?pwd=GNDCorsairsConclave",
      coverImage: "https://picsum.photos/seed/conclave/800/400",
      rsvps: [
        { mqeNumber: "MQE-0000001", name: "Admiral David Chukwuyem", status: "YES" },
        { mqeNumber: "MQE-0000123", name: "Jack Sparrow", status: "YES" },
        { mqeNumber: "MQE-0000244", name: "Anne Bonny", status: "YES" },
        { mqeNumber: "MQE-0000018", name: "Edward Teach", status: "YES" },
        { mqeNumber: "MQE-0001092", name: "Henry Morgan", status: "MAYBE" }
      ],
      attendanceList: ["MQE-0000001", "MQE-0000123", "MQE-0000244"],
      reports: "Audit compiled. Total GD Chapter funds balanced and approved by Admiral David. Scribe Teach registered the attendance logs."
    }
  ];

  const documents: DocumentFile[] = [
    {
      id: "doc_1",
      title: "GND Chapter Constitution 2026",
      category: "Constitution",
      fileUrl: "#",
      versionHistory: [
        {
          version: "1.0",
          updatedBy: "Admiral David Chukwuyem",
          updatedAt: "2026-01-10T10:00:00Z",
          notes: "Initial draft established upon GND Chapter creation."
        }
      ],
      uploadedAt: "2026-01-10T10:00:00Z"
    },
    {
      id: "doc_2",
      title: "Corsair Code of Conduct & Bylaws",
      category: "Bylaws",
      fileUrl: "#",
      versionHistory: [
        {
          version: "1.1",
          updatedBy: "Edward Teach (Scribe)",
          updatedAt: "2026-03-12T11:00:00Z",
          notes: "Bylaw amendment on privateer vessel logistics and ledger dues accountability."
        }
      ],
      uploadedAt: "2026-01-12T11:00:00Z"
    }
  ];

  const auditLogs: AuditLog[] = [
    {
      id: "log_1",
      userEmail: "joedoe@gmail.com",
      userName: "Admiral David Chukwuyem",
      userMqe: "MQE-0000001",
      action: "CHAPTER_INITIATED",
      timestamp: "2026-01-10T10:15:00Z",
      details: "Admiral David Chukwuyem initiated the Great Niger Delta Chapter Portal."
    },
    {
      id: "log_2",
      userEmail: "jack@corsairs.org",
      userName: "Jack Sparrow",
      userMqe: "MQE-0000123",
      action: "QUARTERMASTER_LEDGER_UPDATE",
      timestamp: "2026-05-02T11:50:00Z",
      details: "Quartermaster recorded PAID dues for Anne Bonny (MQE-0000244) - May Dues: 15,000 NGN."
    }
  ];

  return {
    members,
    applications,
    contributions,
    forumPosts,
    elections,
    events,
    documents,
    auditLogs,
    ranks: DEFAULT_RANKS,
    duties: DEFAULT_DUTIES,
    promotions: [],
    dutyLogs: [],
    leadershipTransfers: DEFAULT_LEADERSHIP_TRANSFERS
  };
}

// Database helper functions to expose API actions
export const db = {
  getMembers: () => getDB().members,
  
  getMemberByEmail: (email: string) => {
    return getDB().members.find(m => m.email.toLowerCase() === email.toLowerCase());
  },
  
  getMemberByMqe: (mqe: string) => {
    return getDB().members.find(m => m.mqeNumber === mqe);
  },

  // Ranks & Duties Management
  getRanks: () => getDB().ranks || DEFAULT_RANKS,

  updateRanks: (ranks: RankDefinition[], actingUserEmail: string) => {
    const data = getDB();
    const actor = data.members.find(m => m.email === actingUserEmail);
    data.ranks = ranks;
    db.addAuditLog(
      actingUserEmail,
      actor?.name || "Admin",
      actor?.mqeNumber || "SYSTEM",
      "RANKS_UPDATED",
      `Rank definitions updated by ${actor?.name || actingUserEmail}. Total ranks: ${ranks.length}`
    );
    saveDB(data);
    return data.ranks;
  },

  getDuties: () => getDB().duties || DEFAULT_DUTIES,

  updateDuties: (duties: DutyDefinition[], actingUserEmail: string) => {
    const data = getDB();
    const actor = data.members.find(m => m.email === actingUserEmail);
    data.duties = duties;
    db.addAuditLog(
      actingUserEmail,
      actor?.name || "Admin",
      actor?.mqeNumber || "SYSTEM",
      "DUTIES_UPDATED",
      `Duty definitions updated by ${actor?.name || actingUserEmail}. Total duties: ${duties.length}`
    );
    saveDB(data);
    return data.duties;
  },

  assignDuty: (memberMqe: string, dutyTitle: string, actingUserEmail: string, notes?: string) => {
    const data = getDB();
    const member = data.members.find(m => m.mqeNumber === memberMqe);
    const actor = data.members.find(m => m.email === actingUserEmail);
    if (!member) return false;

    if (!member.assignedDuties) member.assignedDuties = [];
    if (!member.assignedDuties.includes(dutyTitle)) {
      member.assignedDuties.push(dutyTitle);
    }

    // Update duty definition holder if matching
    if (!data.duties) data.duties = [...DEFAULT_DUTIES];
    const dutyDef = data.duties.find(d => d.title.toLowerCase() === dutyTitle.toLowerCase());
    if (dutyDef) {
      dutyDef.holderMqe = member.mqeNumber;
      dutyDef.holderName = member.name;
    }

    // Record duty log
    if (!data.dutyLogs) data.dutyLogs = [];
    data.dutyLogs.unshift({
      id: `duty_log_${Date.now()}`,
      memberMqe: member.mqeNumber,
      memberName: member.name,
      dutyTitle,
      action: "ASSIGNED",
      assignedBy: actor?.name || actingUserEmail,
      assignedAt: new Date().toISOString(),
      notes
    });

    db.addAuditLog(
      actingUserEmail,
      actor?.name || "Admin",
      actor?.mqeNumber || "SYSTEM",
      "DUTY_ASSIGNED",
      `Duty "${dutyTitle}" assigned to ${member.name} (${member.mqeNumber}) by ${actor?.name || actingUserEmail}.`
    );

    saveDB(data);
    return true;
  },

  removeDuty: (memberMqe: string, dutyTitle: string, actingUserEmail: string) => {
    const data = getDB();
    const member = data.members.find(m => m.mqeNumber === memberMqe);
    const actor = data.members.find(m => m.email === actingUserEmail);
    if (!member) return false;

    if (member.assignedDuties) {
      member.assignedDuties = member.assignedDuties.filter(d => d.toLowerCase() !== dutyTitle.toLowerCase());
    }

    if (!data.duties) data.duties = [...DEFAULT_DUTIES];
    const dutyDef = data.duties.find(d => d.title.toLowerCase() === dutyTitle.toLowerCase());
    if (dutyDef && dutyDef.holderMqe === memberMqe) {
      dutyDef.holderMqe = undefined;
      dutyDef.holderName = undefined;
    }

    if (!data.dutyLogs) data.dutyLogs = [];
    data.dutyLogs.unshift({
      id: `duty_log_${Date.now()}`,
      memberMqe: member.mqeNumber,
      memberName: member.name,
      dutyTitle,
      action: "REMOVED",
      assignedBy: actor?.name || actingUserEmail,
      assignedAt: new Date().toISOString()
    });

    db.addAuditLog(
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

    member.rank = newRank as any;
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

    if (!member.promotionHistory) member.promotionHistory = [];
    member.promotionHistory.unshift(rec);

    if (!data.promotions) data.promotions = [];
    data.promotions.unshift(rec);

    db.addAuditLog(
      actingUserEmail,
      actor?.name || "Admin",
      actor?.mqeNumber || "SYSTEM",
      "MEMBER_PROMOTED",
      `Member ${member.name} (${member.mqeNumber}) promoted from "${previousRank}" to "${newRank}". Reason: ${reason}`
    );

    saveDB(data);
    return true;
  },

  transferLordAdmiralOffice: (newHolderMqe: string, reason: string, actingUserEmail: string) => {
    const data = getDB();
    const actor = data.members.find(m => m.email === actingUserEmail);
    const newHolder = data.members.find(m => m.mqeNumber === newHolderMqe);
    if (!newHolder) return { success: false, message: "Target member not found." };

    if (!data.duties) data.duties = [...DEFAULT_DUTIES];
    const lordAdmiralDuty = data.duties.find(d => d.title.toLowerCase().includes("lord admiral"));

    let previousHolderMqe = lordAdmiralDuty?.holderMqe || "MQE-0000001";
    let previousHolderName = lordAdmiralDuty?.holderName || "Admiral David Chukwuyem";

    // Find previous holder member and remove Lord Admiral duty
    const previousMember = data.members.find(m => m.mqeNumber === previousHolderMqe || (m.assignedDuties && m.assignedDuties.some(d => d.toLowerCase().includes("lord admiral"))));
    if (previousMember) {
      previousHolderMqe = previousMember.mqeNumber;
      previousHolderName = previousMember.name;
      if (previousMember.assignedDuties) {
        previousMember.assignedDuties = previousMember.assignedDuties.filter(d => !d.toLowerCase().includes("lord admiral"));
      }
      // Note: Previous holder keeps their original rank (Admiral Privateer) as per rules!
    }

    // Ensure new holder is promoted to Admiral Privateer if not already
    if (newHolder.rank !== "Admiral Privateer" && newHolder.rank !== MemberRank.ADMIRAL_PRIVATEER) {
      const oldRank = newHolder.rank;
      newHolder.rank = "Admiral Privateer" as any;
      if (!newHolder.previousRanks) newHolder.previousRanks = [];
      newHolder.previousRanks.push(oldRank);
      
      const promoRec: PromotionRecord = {
        id: `promo_${Date.now()}`,
        memberMqe: newHolder.mqeNumber,
        memberName: newHolder.name,
        previousRank: oldRank,
        newRank: "Admiral Privateer",
        promotedBy: actor?.name || actingUserEmail,
        promotedAt: new Date().toISOString(),
        reason: "Commissioned to Admiral Privateer upon elevation to Lord Admiral Office."
      };
      if (!newHolder.promotionHistory) newHolder.promotionHistory = [];
      newHolder.promotionHistory.unshift(promoRec);
      if (!data.promotions) data.promotions = [];
      data.promotions.unshift(promoRec);
    }

    // Assign Lord Admiral duty to new holder
    if (!newHolder.assignedDuties) newHolder.assignedDuties = [];
    if (!newHolder.assignedDuties.some(d => d.toLowerCase().includes("lord admiral"))) {
      newHolder.assignedDuties.push("Lord Admiral / Grand Admiral");
    }

    // Update duty definition holder
    if (lordAdmiralDuty) {
      lordAdmiralDuty.holderMqe = newHolder.mqeNumber;
      lordAdmiralDuty.holderName = newHolder.name;
    }

    // Record Leadership Transfer
    const xferRecord: LeadershipTransferRecord = {
      id: `xfer_${Date.now()}`,
      officeTitle: "Lord Admiral / Grand Admiral",
      previousHolderMqe,
      previousHolderName,
      newHolderMqe: newHolder.mqeNumber,
      newHolderName: newHolder.name,
      transferredAt: new Date().toISOString(),
      transferredBy: actor?.name || actingUserEmail,
      reason
    };

    if (!data.leadershipTransfers) data.leadershipTransfers = [];
    data.leadershipTransfers.unshift(xferRecord);

    db.addAuditLog(
      actingUserEmail,
      actor?.name || "Admin",
      actor?.mqeNumber || "SYSTEM",
      "LEADERSHIP_TRANSFERRED",
      `Lord Admiral office transferred from ${previousHolderName} (${previousHolderMqe}) to ${newHolder.name} (${newHolder.mqeNumber}). Reason: ${reason}`
    );

    saveDB(data);
    return { success: true, record: xferRecord };
  },

  getLeadershipTransfers: () => getDB().leadershipTransfers || DEFAULT_LEADERSHIP_TRANSFERS,
  getPromotions: () => getDB().promotions || [],
  getDutyLogs: () => getDB().dutyLogs || [],

  updateMember: (updatedMember: Member, actingUserEmail: string) => {
    const data = getDB();
    const index = data.members.findIndex(m => m.id === updatedMember.id);
    if (index !== -1) {
      const old = data.members[index];
      data.members[index] = updatedMember;
      
      // Log the update action
      const actingUser = data.members.find(m => m.email === actingUserEmail);
      db.addAuditLog(
        actingUserEmail,
        actingUser?.name || "Admin",
        actingUser?.mqeNumber || "SYSTEM",
        "PROFILE_EDIT",
        `Updated profile details of ${updatedMember.name} (${updatedMember.mqeNumber}). Changed fields: ${Object.keys(updatedMember).filter(k => JSON.stringify(updatedMember[k as keyof Member]) !== JSON.stringify(old[k as keyof Member])).join(", ")}`
      );
      
      saveDB(data);
      return true;
    }
    return false;
  },

  addMember: (newMember: Member, actingUserEmail: string) => {
    const data = getDB();
    data.members.push(newMember);
    
    // Auto-generate application row
    const newApp: Application = {
      id: `app_${Date.now()}`,
      memberId: newMember.id,
      interviewStatus: "Pending",
      backgroundStatus: "Pending",
      adminNotes: "Application submitted via the Registration Portal.",
      approvalStatus: "Pending",
      approvalHistory: [
        {
          status: MemberStatus.PENDING,
          updatedBy: "Portal system",
          updatedAt: new Date().toISOString(),
          comment: "Awaiting review from Chapter Scribe/Captain."
        }
      ]
    };
    data.applications.push(newApp);

    db.addAuditLog(
      newMember.email,
      newMember.name,
      newMember.mqeNumber,
      "MEMBER_REGISTERED",
      `New recruit registered: ${newMember.name} (assigned Temp MQE: ${newMember.mqeNumber}).`
    );

    saveDB(data);
    return newApp;
  },

  getApplications: () => getDB().applications,
  
  updateApplicationStatus: (
    appId: string, 
    status: MemberStatus, 
    comment: string, 
    actingUserEmail: string
  ) => {
    const data = getDB();
    const appIndex = data.applications.findIndex(a => a.id === appId);
    if (appIndex !== -1) {
      const app = data.applications[appIndex];
      const member = data.members.find(m => m.id === app.memberId);
      const actor = data.members.find(m => m.email === actingUserEmail);

      if (member) {
        member.status = status;
        if (status === MemberStatus.ACTIVE) {
          member.rank = MemberRank.PRIVATEER;
        } else if (status === MemberStatus.REJECTED) {
          member.rank = MemberRank.RECRUIT;
        }
        
        app.approvalStatus = status === MemberStatus.ACTIVE ? "Approved" : status === MemberStatus.REJECTED ? "Rejected" : "Pending";
        app.approvalHistory.push({
          status,
          updatedBy: actor?.name || "Admin",
          updatedAt: new Date().toISOString(),
          comment
        });

        db.addAuditLog(
          actingUserEmail,
          actor?.name || "Admin",
          actor?.mqeNumber || "SYSTEM",
          "APPLICATION_DECISION",
          `Application for ${member.name} (${member.mqeNumber}) set to ${status}. Notes: ${comment}`
        );

        saveDB(data);
        return true;
      }
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
          updatedAt: new Date().toISOString()
        }
      ]
    };
    data.contributions.push(newContrib);

    db.addAuditLog(
      actingUserEmail,
      actor?.name || "Quartermaster",
      actor?.mqeNumber || "SYSTEM",
      "RECORDED_CONTRIBUTION",
      `Quartermaster ledger entry created for ${contribution.memberName} (${contribution.mqeNumber}): ${contribution.type} - ${contribution.amount} NGN.`
    );

    saveDB(data);
    return newContrib;
  },

  updateContributionStatus: (contribId: string, status: "PAID" | "OUTSTANDING", actingUserEmail: string) => {
    const data = getDB();
    const index = data.contributions.findIndex(c => c.id === contribId);
    if (index !== -1) {
      const c = data.contributions[index];
      const actor = data.members.find(m => m.email === actingUserEmail);
      const prev = c.status;
      c.status = status;
      c.paymentDate = status === "PAID" ? new Date().toISOString() : undefined;
      c.auditTrail.push({
        action: "STATUS_CHANGE",
        updatedBy: actor?.name || "Quartermaster",
        updatedAt: new Date().toISOString(),
        previousValue: prev
      });

      db.addAuditLog(
        actingUserEmail,
        actor?.name || "Quartermaster",
        actor?.mqeNumber || "SYSTEM",
        "LEDGER_STATUS_EDIT",
        `Dues ID ${contribId} for ${c.memberName} set to ${status}.`
      );

      saveDB(data);
      return true;
    }
    return false;
  },

  getForumPosts: () => getDB().forumPosts,

  addForumPost: (post: Omit<ForumPost, "id" | "createdAt" | "likes" | "comments">, actingUserEmail: string) => {
    const data = getDB();
    const actor = data.members.find(m => m.email === actingUserEmail);
    const newPost: ForumPost = {
      ...post,
      id: `post_${Date.now()}`,
      createdAt: new Date().toISOString(),
      likes: [],
      comments: []
    };
    data.forumPosts.unshift(newPost); // Add to top

    db.addAuditLog(
      actingUserEmail,
      actor?.name || "Member",
      actor?.mqeNumber || "SYSTEM",
      "FORUM_POST_CREATED",
      `Forum post created: "${post.title}" under category "${post.category}".`
    );

    saveDB(data);
    return newPost;
  },

  likeForumPost: (postId: string, mqeNumber: string) => {
    const data = getDB();
    const post = data.forumPosts.find(p => p.id === postId);
    if (post) {
      const idx = post.likes.indexOf(mqeNumber);
      if (idx === -1) {
        post.likes.push(mqeNumber);
      } else {
        post.likes.splice(idx, 1); // Unlike
      }
      saveDB(data);
      return true;
    }
    return false;
  },

  addForumComment: (postId: string, content: string, actingUserEmail: string) => {
    const data = getDB();
    const post = data.forumPosts.find(p => p.id === postId);
    const actor = data.members.find(m => m.email === actingUserEmail);
    if (post && actor) {
      const newComment = {
        id: `com_${Date.now()}`,
        authorId: actor.id,
        authorName: actor.name,
        authorRank: actor.rank,
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
        return { success: false, reason: "You have already cast your ballot." };
      }
      const cand = el.candidates.find(c => c.mqeNumber === candidateMqe);
      if (cand) {
        cand.votesCount += 1;
        el.votedMqes.push(voterMqe);
        
        // Log the secret ballot audit (without candidate linkage for secret voting)
        const voter = data.members.find(m => m.mqeNumber === voterMqe);
        db.addAuditLog(
          voter?.email || "voter@corsairs.org",
          voter?.name || "Voter",
          voterMqe,
          "BALLOT_CAST",
          `Secret ballot cast successfully in election: "${el.title}"`
        );

        saveDB(data);
        return { success: true };
      }
    }
    return { success: false, reason: "Election is inactive or candidate not found." };
  },

  getEvents: () => getDB().events,

  updateRsvp: (eventId: string, mqeNumber: string, status: "YES" | "NO" | "MAYBE") => {
    const data = getDB();
    const evt = data.events.find(e => e.id === eventId);
    if (evt) {
      const member = data.members.find(m => m.mqeNumber === mqeNumber);
      if (member) {
        const index = evt.rsvps.findIndex(r => r.mqeNumber === mqeNumber);
        if (index !== -1) {
          evt.rsvps[index].status = status;
        } else {
          evt.rsvps.push({ mqeNumber, name: member.name, status });
        }
        saveDB(data);
        return true;
      }
    }
    return false;
  },

  checkinEvent: (eventId: string, mqeNumber: string, actingUserEmail: string) => {
    const data = getDB();
    const evt = data.events.find(e => e.id === eventId);
    const member = data.members.find(m => m.mqeNumber === mqeNumber);
    const actor = data.members.find(m => m.email === actingUserEmail);
    if (evt && member) {
      if (!evt.attendanceList.includes(mqeNumber)) {
        evt.attendanceList.push(mqeNumber);
      }
      if (!member.qrCodeCheckins.includes(evt.date)) {
        member.qrCodeCheckins.push(new Date().toISOString());
      }

      db.addAuditLog(
        actingUserEmail,
        actor?.name || "Admin",
        actor?.mqeNumber || "SYSTEM",
        "EVENT_CHECKIN_QR",
        `QR Code Check-in recorded for ${member.name} (${member.mqeNumber}) at Event: "${evt.title}".`
      );

      saveDB(data);
      return true;
    }
    return false;
  },

  getDocuments: () => getDB().documents,

  addDocument: (doc: Omit<DocumentFile, "id" | "uploadedAt" | "versionHistory">, actingUserEmail: string) => {
    const data = getDB();
    const actor = data.members.find(m => m.email === actingUserEmail);
    const newDoc: DocumentFile = {
      ...doc,
      id: `doc_${Date.now()}`,
      uploadedAt: new Date().toISOString(),
      versionHistory: [
        {
          version: "1.0",
          updatedBy: actor?.name || "Scribe",
          updatedAt: new Date().toISOString(),
          notes: "Initial upload to GND document vault."
        }
      ]
    };
    data.documents.push(newDoc);

    db.addAuditLog(
      actingUserEmail,
      actor?.name || "Scribe",
      actor?.mqeNumber || "SYSTEM",
      "DOCUMENT_UPLOADED",
      `Document uploaded: "${doc.title}" under category "${doc.category}".`
    );

    saveDB(data);
    return newDoc;
  },

  getAuditLogs: () => getDB().auditLogs,

  addAuditLog: (email: string, name: string, mqe: string, action: string, details: string) => {
    const data = getDB();
    const newLog: AuditLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      userEmail: email,
      userName: name,
      userMqe: mqe,
      action,
      timestamp: new Date().toISOString(),
      details
    };
    data.auditLogs.unshift(newLog); // Keep newest at the top
    saveDB(data);
    return newLog;
  }
};
