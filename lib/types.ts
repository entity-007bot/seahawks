export enum MemberRank {
  ADMIRAL = "Lord Admiral / Grand Admiral",
  COMMODORE = "Commodore",
  CAPTAIN = "Captain of the Flagship",
  FLEET_MASTER = "Master of the Fleet",
  QUARTERMASTER_GENERAL = "Quartermaster General",
  NAVIGATOR_GENERAL = "Navigator General",
  ADMIRALTY_COUNCIL = "Admiralty Council",
  CHIEF_BOATSWAIN = "Chief Boatswain",
  SHIP_CAPTAIN = "Ship Captain",
  FIRST_LIEUTENANT = "First Lieutenant",
  MASTER_NAVIGATOR = "Master Navigator",
  BOATSWAIN = "Boatswain",
  QUARTERMASTER = "Quartermaster",
  MASTER_AT_ARMS = "Master-at-Arms",
  HARBORMASTER = "Harbormaster",
  COMMUNICATIONS_OFFICER = "Communications Officer",
  PRIVATEER = "Privateer",
  LANCED_PRIVATEER = "Lanced Privateer",
  SALTED_SEAMAN = "Salted Seaman",
  SEAMAN = "seaman",
  MIDSHIPMAN = "Midshipman",
  RECRUIT = "Green Hands (someone just recruited)",
  SCRIBE = "Scribe (Secretary taking records)"
}

export enum MemberStatus {
  ACTIVE = "Active",
  PENDING = "Pending",
  SUSPENDED = "Suspended",
  INACTIVE = "Inactive",
  REJECTED = "Rejected"
}

export interface Member {
  id: string;
  mqeNumber: string; // MQE-XXXXXXX
  name: string;
  preferredName: string;
  dob: string;
  gender: string;
  nationality: string;
  state: string;
  lga: string;
  occupation: string;
  phone: string;
  email: string;
  residentialAddress: string;
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
  skills: string[];
  profession: string;
  biography: string;
  dateJoined: string;
  rank: MemberRank;
  status: MemberStatus;
  suite: string;
  fleet?: string;
  chapter: string;
  committee: string;
  serviceRecord: string[];
  awards: string[];
  disciplinaryRecord: string[];
  profilePhoto: string;
  qrCodeCheckins: string[]; // Timestamps of check-ins
  nin?: string;             // National Identification Number for verification
  voterId?: string;         // Voter's Card ID or Maritime ID
  refereeMqe?: string;       // Sponsor MQE number
}

export interface Application {
  id: string;
  memberId: string;
  interviewStatus: "Pending" | "Scheduled" | "Completed";
  interviewNotes?: string;
  backgroundStatus: "Pending" | "Passed" | "Failed";
  adminNotes: string;
  approvalStatus: "Pending" | "Approved" | "Rejected";
  approvalHistory: {
    status: MemberStatus;
    updatedBy: string;
    updatedAt: string;
    comment: string;
  }[];
}

export enum ContributionType {
  MONTHLY_DUES = "Monthly Dues",
  ANNUAL_DUES = "Annual Dues",
  SPECIAL_LEVY = "Special Levy",
  PROJECT = "Project",
  DONATION = "Donation",
  FINE = "Fine"
}

export interface Contribution {
  id: string;
  memberId: string;
  memberName: string;
  mqeNumber: string;
  type: ContributionType;
  description: string;
  amount: number;
  status: "PAID" | "OUTSTANDING";
  paymentDate?: string;
  recordedBy: string;
  auditTrail: {
    action: string;
    updatedBy: string;
    updatedAt: string;
    previousValue?: string;
  }[];
}

export interface ForumPost {
  id: string;
  category: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorRank: MemberRank;
  createdAt: string;
  likes: string[]; // Member MQE Numbers
  comments: {
    id: string;
    authorId: string;
    authorName: string;
    authorRank: MemberRank;
    content: string;
    createdAt: string;
  }[];
  isPinned: boolean;
  isAnnouncement: boolean;
}

export interface Election {
  id: string;
  title: string;
  description: string;
  votingStart: string;
  votingEnd: string;
  status: "UPCOMING" | "ACTIVE" | "COMPLETED";
  candidates: {
    mqeNumber: string;
    name: string;
    rank: MemberRank;
    campaignManifesto: string;
    votesCount: number;
  }[];
  votedMqes: string[]; // Track who has voted (secret ballot)
  winner?: string;
}

export interface EventLog {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  meetingLink?: string; // Zoom, MS Teams, Google Meet, etc
  coverImage?: string;
  rsvps: {
    mqeNumber: string;
    name: string;
    status: "YES" | "NO" | "MAYBE";
  }[];
  attendanceList: string[]; // MQE numbers checked-in
  reports?: string;
}

export interface DocumentFile {
  id: string;
  title: string;
  category: "Minutes" | "Constitution" | "Bylaws" | "Manual" | "Form";
  fileUrl: string;
  versionHistory: {
    version: string;
    updatedBy: string;
    updatedAt: string;
    notes: string;
  }[];
  uploadedAt: string;
}

export interface AuditLog {
  id: string;
  userEmail: string;
  userName: string;
  userMqe: string;
  action: string;
  timestamp: string;
  details: string;
}

export interface LeadershipMember {
  id: string;
  name: string;
  role: string;
  type: "Active" | "Former";
  biography: string;
  photo: string;
}

export interface PrivateersDB {
  members: Member[];
  applications: Application[];
  contributions: Contribution[];
  forumPosts: ForumPost[];
  elections: Election[];
  events: EventLog[];
  documents: DocumentFile[];
  auditLogs: AuditLog[];
  leadership?: LeadershipMember[];
}
