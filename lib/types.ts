export enum MemberRank {
  // Seaman Class
  LANDSMAN = "Landsman",
  SEAMAN = "Seaman",
  ABLE_SEAMAN = "Able Seaman",
  SALTED_SEAMAN = "Salted Seaman",
  SEASONED_SEAMAN = "Seasoned Seaman",
  WEATHERED_SEAMAN = "Weathered Seaman",

  // Privateer Class
  ABLE_PRIVATEER = "Able Privateer",
  PRIVATEER = "Privateer",
  SENIOR_PRIVATEER = "Senior Privateer",
  MASTER_PRIVATEER = "Master Privateer",
  LIEUTENANT_PRIVATEER = "Lieutenant Privateer",
  COMMANDER_PRIVATEER = "Commander Privateer",
  CAPTAIN_PRIVATEER = "Captain Privateer",
  COMMODORE_PRIVATEER = "Commodore Privateer",
  ADMIRAL_PRIVATEER = "Admiral Privateer",

  // Legacy Alias Mappings for Compatibility
  ADMIRAL = "Admiral Privateer",
  COMMODORE = "Commodore Privateer",
  CAPTAIN = "Captain Privateer",
  FLEET_MASTER = "Commander Privateer",
  QUARTERMASTER_GENERAL = "Master Privateer",
  NAVIGATOR_GENERAL = "Lieutenant Privateer",
  ADMIRALTY_COUNCIL = "Commodore Privateer",
  CHIEF_BOATSWAIN = "Master Privateer",
  SHIP_CAPTAIN = "Captain Privateer",
  FIRST_LIEUTENANT = "Lieutenant Privateer",
  MASTER_NAVIGATOR = "Master Privateer",
  BOATSWAIN = "Senior Privateer",
  QUARTERMASTER = "Master Privateer",
  MASTER_AT_ARMS = "Senior Privateer",
  HARBORMASTER = "Senior Privateer",
  COMMUNICATIONS_OFFICER = "Privateer",
  LANCED_PRIVATEER = "Able Privateer",
  MIDSHIPMAN = "Seaman",
  RECRUIT = "Landsman",
  SCRIBE = "Senior Privateer"
}

export enum MemberStatus {
  ACTIVE = "Active",
  PENDING = "Pending",
  SUSPENDED = "Suspended",
  INACTIVE = "Inactive",
  REJECTED = "Rejected"
}

export interface RankDefinition {
  id: string;
  name: string;
  class: "Seaman Class" | "Privateer Class";
  tier: number;
  insignia: string;
  description: string;
  requirements: string;
  responsibilities: string;
}

export interface DutyDefinition {
  id: string;
  title: string;
  category: "Admiralty Compass" | "Other Offices" | "Custom Office";
  description: string;
  eligibleRanks: string[];
  responsibilities: string[];
  holderMqe?: string;
  holderName?: string;
}

export interface PromotionRecord {
  id: string;
  memberMqe: string;
  memberName: string;
  previousRank: string;
  newRank: string;
  promotedBy: string;
  promotedAt: string;
  reason: string;
}

export interface DutyAssignmentRecord {
  id: string;
  memberMqe: string;
  memberName: string;
  dutyTitle: string;
  action: "ASSIGNED" | "REMOVED";
  assignedBy: string;
  assignedAt: string;
  notes?: string;
}

export interface LeadershipTransferRecord {
  id: string;
  officeTitle: string;
  previousHolderMqe: string;
  previousHolderName: string;
  newHolderMqe: string;
  newHolderName: string;
  transferredAt: string;
  transferredBy: string;
  reason: string;
}

export type PermissionRole = "Super Admin" | "Lord Admiral" | "Administrator" | "Officer" | "Member";

export interface PermissionConfig {
  role: PermissionRole;
  description: string;
  canManageMembers: boolean;
  canApprovePromotions: boolean;
  canAssignDuties: boolean;
  canTransferLeadership: boolean;
  canManageSystem: boolean;
  canManageDues: boolean;
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
  rank: MemberRank | string;
  assignedDuties?: string[];
  previousRanks?: string[];
  promotionHistory?: PromotionRecord[];
  adminRole?: PermissionRole;
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
  ranks?: RankDefinition[];
  duties?: DutyDefinition[];
  promotions?: PromotionRecord[];
  dutyLogs?: DutyAssignmentRecord[];
  leadershipTransfers?: LeadershipTransferRecord[];
  permissionConfigs?: PermissionConfig[];
}
