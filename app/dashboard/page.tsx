"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Anchor,
  Compass,
  BookOpen,
  Users,
  Calendar,
  FileText,
  HelpCircle,
  Shield,
  Award,
  DollarSign,
  MessageSquare,
  Vote,
  Settings,
  Bell,
  LogOut,
  Camera,
  Download,
  Printer,
  ChevronRight,
  ChevronLeft,
  Plus,
  ThumbsUp,
  AlertTriangle,
  UserCheck,
  CheckCircle,
  FileSpreadsheet,
  Clock,
  ExternalLink,
  Lock,
  Search,
  Check,
  Trash2,
  RefreshCw,
  Sliders,
  Menu,
  X
} from "lucide-react";
import { PrivateersLogo } from "@/components/privateers-logo";
import { useRouter } from "next/navigation";
import { MemberRank, MemberStatus, ContributionType } from "@/lib/types";
import { getPublicSiteConfig, savePublicSiteConfig, DEFAULT_PUBLIC_SITE_CONFIG } from "@/lib/site-config";

// Helper functions defined outside the React component to avoid purity/impure function linter issues
function generateUniqueId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).substring(2, 9)}`;
}

function getTimestampIso(): string {
  return new Date().toISOString();
}

function generateRandomMqe(): string {
  return `MQE-${Math.floor(1000000 + Math.random() * 9000000)}`;
}

const admiraltyCompassPoints = [
  {
    point: "N",
    direction: "NORTH",
    role: "Lord Admiral / Grand Admiral",
    secondaryTitle: "Admiral of the Fleet",
    meaning: "Supreme Authority • Vision • Governance",
    historicalEquivalent: "Commander of a Fleet",
    symbol: "⚓ Anchor + 👑 Crown + 🧭 Compass",
    primaryDuty: "Supreme leadership and guardianship of the Brotherhood.",
    responsibilities: [
      "Serves as the highest authority of the Brotherhood.",
      "Protects the Constitution, traditions, and heritage.",
      "Defines the long-term vision and strategic direction.",
      "Approves all major policies, appointments, and alliances.",
      "Presides over meetings of the Admiralty Council.",
      "Commissions officers and approves promotions.",
      "Acts as the official representative of the Brotherhood.",
      "Serves as Commander-in-Chief during all ceremonies and campaigns."
    ]
  },
  {
    point: "NE",
    direction: "NORTH-EAST",
    role: "Commodore",
    secondaryTitle: "First Lieutenant",
    meaning: "Operations • Fleet Coordination • Command",
    historicalEquivalent: "Fleet Operations Commander",
    symbol: "🗺️ Navigational Charts + 🧭 Double-compass",
    primaryDuty: "Fleet coordination and operational command.",
    responsibilities: [
      "Serves as Deputy Commander of the Brotherhood.",
      "Coordinates all Ships (Chapters).",
      "Supervises Chapter Captains and regional operations.",
      "Implements the directives of the Grand Admiral.",
      "Oversees organizational expansion.",
      "Monitors operational readiness.",
      "Acts on behalf of the Grand Admiral when authorized."
    ]
  },
  {
    point: "E",
    direction: "EAST",
    role: "Captain of the Flagship",
    secondaryTitle: "Helmsman",
    meaning: "Command • Execution • Ceremonial Leadership",
    historicalEquivalent: "Captain of the Main Vessel",
    symbol: "🚢 Flagship Wheel + 🚩 Crimson Ensign",
    primaryDuty: "Leadership of the Headquarters Chapter.",
    responsibilities: [
      "Commands the Flagship (Headquarters Chapter).",
      "Directs official meetings and ceremonies.",
      "Ensures execution of approved programs.",
      "Supervises officers serving under the Flagship.",
      "Maintains discipline and unity within Headquarters.",
      "Coordinates ceremonial formations and protocol."
    ]
  },
  {
    point: "SE",
    direction: "SOUTH-EAST",
    role: "Master of the Fleet",
    secondaryTitle: "Boatswain (Bosun)",
    meaning: "Order • Organization • Administration",
    historicalEquivalent: "Chief Boatswain",
    symbol: "🔔 Master Whistle + ⛓️ Iron Links",
    primaryDuty: "Organization, discipline, and administration.",
    responsibilities: [
      "Maintains discipline throughout the Brotherhood.",
      "Coordinates all internal operations.",
      "Oversees orientation and training.",
      "Supervises ceremonial equipment and uniforms.",
      "Ensures adherence to regulations.",
      "Organizes official events and inspections."
    ]
  },
  {
    point: "S",
    direction: "SOUTH",
    role: "Quartermaster General",
    secondaryTitle: "Quartermaster",
    meaning: "Finance • Logistics • Resource Management",
    historicalEquivalent: "Keeper of Supplies",
    symbol: "🔑 Golden Keys + 📊 Ledger Scales",
    primaryDuty: "Finance, logistics, and resource management.",
    responsibilities: [
      "Manages the Brotherhood's finances.",
      "Oversees supplies, equipment, and property.",
      "Maintains membership records.",
      "Prepares financial reports and budgets.",
      "Supervises procurement and logistics.",
      "Ensures accountability for organizational assets."
    ]
  },
  {
    point: "SW",
    direction: "SOUTH-WEST",
    role: "Navigator General",
    secondaryTitle: "Master Navigator",
    meaning: "Strategy • Intelligence • Future Planning",
    historicalEquivalent: "Chief Navigator",
    symbol: "🔭 Sextant + 📜 Parchment Chart",
    primaryDuty: "Strategy, intelligence, and future planning.",
    responsibilities: [
      "Develops long-term strategic plans.",
      "Conducts research and policy development.",
      "Advises leadership on future direction.",
      "Performs intelligence gathering and analysis.",
      "Assesses risks and opportunities.",
      "Plans campaigns, projects, and outreach initiatives."
    ]
  },
  {
    point: "W",
    direction: "WEST",
    role: "Admiralty Council",
    secondaryTitle: "Intelligence Officers",
    meaning: "Advisory • Wisdom • Tradition Preservation",
    historicalEquivalent: "Council of Senior Officers",
    symbol: "🦉 Golden Owl + 📜 Sealed Seal",
    primaryDuty: "Advisory leadership and preservation of tradition.",
    responsibilities: [
      "Advises the Grand Admiral on major decisions.",
      "Reviews constitutional amendments and policies.",
      "Preserves the Brotherhood's customs and heritage.",
      "Mentors officers and future leaders.",
      "Investigates significant organizational matters.",
      "Provides strategic recommendations during Council sessions."
    ]
  },
  {
    point: "NW",
    direction: "NORTH-WEST",
    role: "Chief Boatswain",
    secondaryTitle: "Master-at-Arms",
    meaning: "Justice • Accountability • Constitutional Enforcement",
    historicalEquivalent: "Chief Officer of Discipline",
    symbol: "🛡️ Golden Shield + ⚔️ Crossed Sabres",
    primaryDuty: "Justice, discipline, and constitutional enforcement.",
    responsibilities: [
      "Enforces the Code of Conduct.",
      "Oversees disciplinary proceedings.",
      "Protects the integrity of the Constitution.",
      "Ensures officers remain accountable to the Brotherhood.",
      "Conducts inspections and investigations when required.",
      "Safeguards ceremonial standards and traditions.",
      "May discipline members of the Admiralty Council or senior officers in accordance with the Constitution.",
      "Reports directly to the Grand Admiral on matters of discipline and accountability."
    ]
  }
];

export default function DashboardPage() {
  const router = useRouter();
  const [selectedCompassPoint, setSelectedCompassPoint] = useState("N");
  const currentCompassData = admiraltyCompassPoints.find(p => p.point === selectedCompassPoint) || admiraltyCompassPoints[0];
  const [session, setSession] = useState<any | null>(null);
  const [activeMenu, setActiveTab] = useState("overview");
  const [currentRole, setCurrentRole] = useState<MemberRank>(MemberRank.ADMIRAL);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // States for all the database entities
  const [members, setMembers] = useState<any[]>([]);
  const [contributions, setContributions] = useState<any[]>([]);
  const [forumPosts, setForumPosts] = useState<any[]>([]);
  const [chatRooms, setChatRooms] = useState<any[]>([]);
  const [activeChatId, setActiveChatId] = useState<string>("chat_1");
  const [forumTab, setForumTab] = useState<"threads" | "chats">("threads");
  const [chatInput, setChatInput] = useState<string>("");
  const [elections, setElections] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [leadership, setLeadership] = useState<any[]>([]);
  const [siteLogo, setSiteLogo] = useState<string>("");
  const [siteConfig, setSiteConfig] = useState<any>(DEFAULT_PUBLIC_SITE_CONFIG);

  // Admin sub-navigation states
  const [adminSubTab, setAdminSubTab] = useState<string>("approvals");
  const [adminChatMobileActive, setAdminChatMobileActive] = useState<boolean>(false);

  // Chapter Manager states
  const [chapters, setChapters] = useState<any[]>([]);
  const [editingChapter, setEditingChapter] = useState<any | null>(null);
  const [isChapterFormOpen, setIsChapterFormOpen] = useState(false);
  const [chapterForm, setChapterForm] = useState({
    name: "",
    region: "Delta State",
    portCode: "",
    maxCapacity: 150,
    description: "",
    status: "Active"
  });

  // Branding states
  const [brandingForm, setBrandingForm] = useState({
    logoUrl: "",
    faviconUrl: "",
    siteName: "National Association of Privateers",
    tagline: "Great Niger Delta Chapter & Maritime Guild"
  });

  // Blog Manager states
  const [editingBlogPost, setEditingBlogPost] = useState<any | null>(null);
  const [blogForm, setBlogForm] = useState({
    title: "",
    category: "Announcements",
    summary: "",
    content: "",
    image: "",
    author: "",
    readTime: "2 min read"
  });
  const [isBlogFormOpen, setIsBlogFormOpen] = useState(false);

  // Member Card Editor states
  const [selectedMemberId, setSelectedMemberId] = useState<string>("");
  const [memberForm, setMemberForm] = useState({
    name: "",
    mqeNumber: "",
    biography: "",
    skills: "",
    suite: "Brass Suite",
    fleet: "Brass Suite",
    rank: MemberRank.PRIVATEER,
    status: MemberStatus.ACTIVE,
    profession: "",
    state: "",
    lga: "",
    residentialAddress: "",
    profilePhoto: ""
  });

  // States for Quota Deck
  const [quotaState, setQuotaState] = useState({
    brassRiverLimit: 15,
    bonnyEstuaryLimit: 12,
    forcadosLimit: 10,
    recruitmentCap: 25,
    monthlyDuesQuota: 1500000,
    minVoterTurnoutQuorum: 60,
    patrolCampaignLimit: 5,
    documentsScribeCap: 100
  });
  const [quotaLoading, setQuotaLoading] = useState(false);
  const [quotaSyncing, setQuotaSyncing] = useState(false);
  const [quotaSuccess, setQuotaSuccess] = useState(false);

  const loadQuotas = async () => {
    if (!session?.superAdmin || !session?.token) return;
    setQuotaLoading(true);
    try {
      const response = await fetch("/api/admin/quotas", {
        headers: {
          "Authorization": `Bearer ${session.token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setQuotaState(data.quotas);
        }
      }
    } catch (err) {
      console.error("Failed to load quotas:", err);
    } finally {
      setQuotaLoading(false);
    }
  };

  const syncQuotasToServer = async () => {
    if (!session?.superAdmin || !session?.token) return;
    setQuotaSyncing(true);
    setQuotaSuccess(false);
    try {
      const response = await fetch("/api/admin/quotas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.token}`
        },
        body: JSON.stringify(quotaState)
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setQuotaSuccess(true);
          logSystemAction(
            "QUOTA_LEDGER_ADJUSTED",
            `Admiralty operational quotas adjusted. Limits: Brass River (${quotaState.brassRiverLimit}), Monthly Dues Goal (${quotaState.monthlyDuesQuota} NGN).`
          );
          setTimeout(() => setQuotaSuccess(false), 4000);
        }
      }
    } catch (err) {
      console.error("Failed to sync quotas:", err);
    } finally {
      setQuotaSyncing(false);
    }
  };

  const handleQuotaChange = (key: string, value: number) => {
    setQuotaState(prev => ({
      ...prev,
      [key]: value
    }));
  };

  useEffect(() => {
    if (activeMenu === "quota") {
      // Defer execution slightly to avoid triggering synchronous setState during mount/render cascade
      const timer = setTimeout(() => {
        loadQuotas();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [activeMenu, session]);
  
  // Leadership Form State
  const [leaderForm, setLeaderForm] = useState({
    id: "",
    name: "",
    role: "",
    type: "Active", // "Active" | "Former"
    biography: "",
    photo: ""
  });

  // Public Site Editor states
  const [newMissionText, setNewMissionText] = useState("");
  const [siteSaving, setSiteSaving] = useState(false);

  // Elections Manager states
  const [electionForm, setElectionForm] = useState({
    title: "",
    description: "",
    type: "CANDIDATE", // "CANDIDATE" | "POLICY"
    candidates: [] as any[]
  });
  const [newCandForm, setNewCandForm] = useState({
    name: "",
    rank: "",
    campaignManifesto: ""
  });
  
  // Document Upload Form State (for admin)
  const [adminDocForm, setAdminDocForm] = useState({
    title: "",
    category: "Constitution", // "Constitution" | "Bylaws" | "Manual" | "Minutes"
    fileContent: "", // Base64
    notes: ""
  });

  // Interaction States
  const [forumSearch, setForumSearch] = useState("");
  const [newPost, setNewPost] = useState({ title: "", content: "", category: "Announcements" });
  const [newComment, setNewComment] = useState<{ [key: string]: string }>({});
  const [directorySearch, setDirectorySearch] = useState("");
  const [directoryFleet, setDirectoryFleet] = useState("All");
  
  // Quartermaster state
  const [newPayment, setNewPayment] = useState({
    mqeNumber: "",
    type: ContributionType.MONTHLY_DUES,
    description: "",
    amount: ""
  });

  // Event check-in state
  const [showScanner, setShowScanner] = useState(false);
  const [scanStatus, setScanStatus] = useState<"idle" | "scanning" | "success" | "error">("idle");
  const [scannedMqe, setScannedMqe] = useState("");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);

  // Document upload state
  const [newDoc, setNewDoc] = useState({ title: "", category: "Minutes" as any });

  // Sync / Load database from localStorage
  const syncDatabase = () => {
    const localMembers = localStorage.getItem("privateers_db_members");
    const localContributions = localStorage.getItem("privateers_db_contributions");
    const localForum = localStorage.getItem("privateers_db_forum");
    const localChats = localStorage.getItem("privateers_db_chats");
    const localElections = localStorage.getItem("privateers_db_elections");
    const localEvents = localStorage.getItem("privateers_db_events");
    const localDocs = localStorage.getItem("privateers_db_documents");
    const localLogs = localStorage.getItem("privateers_db_logs");
    const localApps = localStorage.getItem("privateers_db_apps");

    // Pre-populate if local storage database is empty (Cold Start)
    if (!localMembers) {
      // Seed data matching lib/db.ts structure
      const defaultMembers = [
        { id: "mem_1", mqeNumber: "MQE-0000001", name: "Admiral David Chukwuyem", dob: "1988-04-12", phone: "+234 803 111 2222", email: "davidchukwuyem73@gmail.com", profession: "Marine Superintendent", rank: MemberRank.ADMIRAL, status: MemberStatus.ACTIVE, fleet: "Brass River Fleet", chapter: "Great Niger Delta Chapter", committee: "Disciplinary & Letters of Marque Committee", qrCodeCheckins: ["2026-06-15T10:00:00Z", "2026-07-10T11:00:00Z"], biography: "SAEAHAWKS⚓ Commander of the Great Niger Delta Corsairs Chapter. Overseer of all fleet deployments.", skills: ["Vessel Command", "Saber Fencing"], dateJoined: "2026-01-10", state: "Delta", lga: "Oshimili North", residentialAddress: "14 Escravos Way, Warri", emergencyContact: { name: "Evelyn", relation: "Spouse", phone: "+23480" } },
        { id: "mem_2", mqeNumber: "MQE-0000123", name: "Captain Jack Sparrow", dob: "1985-06-09", phone: "+234 812 345 6789", email: "jack@corsairs.org", profession: "Deep Sea Navigator", rank: MemberRank.QUARTERMASTER, status: MemberStatus.ACTIVE, fleet: "Brass River Fleet", chapter: "Great Niger Delta Chapter", committee: "Welfare & Cargo Distribution Committee", qrCodeCheckins: ["2026-06-15T10:15:00Z"], biography: "Veteran Privateer and Quartermaster of the GND Chapter.", skills: ["Astrogation"], dateJoined: "2026-01-15", state: "Bayelsa", lga: "Brass", residentialAddress: "Pearl Harbor Marina, Brass", emergencyContact: { name: "Joshamee", relation: "First Mate", phone: "+23481" } },
        { id: "mem_3", mqeNumber: "MQE-0000244", name: "Privateer Anne Bonny", dob: "1994-11-20", phone: "+234 809 999 8888", email: "anne@corsairs.org", profession: "Offshore Engineer", rank: MemberRank.PRIVATEER, status: MemberStatus.ACTIVE, fleet: "Bonny Estuary Fleet", chapter: "Great Niger Delta Chapter", committee: "Welfare & Cargo Distribution Committee", qrCodeCheckins: ["2026-07-10T11:05:00Z"], biography: "Fierce defender of the GND charter. First female Privateer in the chapter.", skills: ["Diesel Propulsion"], dateJoined: "2026-02-01", state: "Rivers", lga: "Bonny", residentialAddress: "8 Harbour Road, Bonny", emergencyContact: { name: "Calico", relation: "Associate", phone: "+23480" } },
        { id: "mem_4", mqeNumber: "MQE-0000018", name: "Scribe Edward Teach", dob: "1980-01-01", phone: "+234 803 000 0000", email: "edward@corsairs.org", profession: "Marine Surveyor", rank: MemberRank.SCRIBE, status: MemberStatus.ACTIVE, fleet: "Bonny Estuary Fleet", chapter: "Great Niger Delta Chapter", committee: "Maritime Logistics & Events Committee", qrCodeCheckins: ["2026-06-15T09:55:00Z"], biography: "Chapter Scribe and Chief Archivist. Keeps the log of GND assembly meetings.", skills: ["Ship Restoration"], dateJoined: "2026-01-12", state: "Rivers", lga: "Port Harcourt", residentialAddress: "Queen Anne's Dockyard", emergencyContact: { name: "Israel", relation: "Bosun", phone: "+23480" } },
        { id: "mem_5", mqeNumber: "MQE-0001092", name: "Recruit Henry Morgan", dob: "1992-07-15", phone: "+234 805 123 4567", email: "henry@corsairs.org", profession: "Coastal Guard", rank: MemberRank.RECRUIT, status: MemberStatus.PENDING, fleet: "Forcados Fleet", chapter: "Great Niger Delta Chapter", committee: "Maritime Logistics & Events Committee", qrCodeCheckins: [], biography: "Eager Recruit seeking full Privateer Letters of Marque.", skills: ["Inshore Patrols"], dateJoined: "2026-06-25", state: "Delta", lga: "Warri South", residentialAddress: "3 Delta Port Road, Warri", emergencyContact: { name: "Lady Mary", relation: "Mother", phone: "+23480" } }
      ];
      localStorage.setItem("privateers_db_members", JSON.stringify(defaultMembers));
      setMembers(defaultMembers);
    } else {
      setMembers(JSON.parse(localMembers));
    }

    if (!localContributions) {
      const defaultContributions = [
        { id: "con_1", memberId: "mem_1", memberName: "Admiral David Chukwuyem", mqeNumber: "MQE-0000001", type: ContributionType.ANNUAL_DUES, description: "Annual Privateer Commission Levy for Fiscal Year 2026", amount: 150000, status: "PAID", paymentDate: "2026-01-15T09:00:00Z", recordedBy: "Jack Sparrow (Quartermaster)", auditTrail: [] },
        { id: "con_2", memberId: "mem_3", memberName: "Privateer Anne Bonny", mqeNumber: "MQE-0000244", type: ContributionType.MONTHLY_DUES, description: "Monthly dues for May 2026 - Bonny Estuary Fleet", amount: 15000, status: "PAID", paymentDate: "2026-05-02T11:45:00Z", recordedBy: "Jack Sparrow (Quartermaster)", auditTrail: [] },
        { id: "con_3", memberId: "mem_3", memberName: "Privateer Anne Bonny", mqeNumber: "MQE-0000244", type: ContributionType.SPECIAL_LEVY, description: "GND Port Charity Outing Levy", amount: 25000, status: "PAID", paymentDate: "2026-04-10T16:00:00Z", recordedBy: "Jack Sparrow (Quartermaster)", auditTrail: [] },
        { id: "con_4", memberId: "mem_4", memberName: "Scribe Edward Teach", mqeNumber: "MQE-0000018", type: ContributionType.MONTHLY_DUES, description: "Monthly dues for June 2026", amount: 15000, status: "PAID", paymentDate: "2026-06-12T10:00:00Z", recordedBy: "Jack Sparrow (Quartermaster)", auditTrail: [] },
        { id: "con_5", memberId: "mem_3", memberName: "Privateer Anne Bonny", mqeNumber: "MQE-0000244", type: ContributionType.MONTHLY_DUES, description: "Monthly dues for June 2026", amount: 15000, status: "OUTSTANDING", recordedBy: "Jack Sparrow (Quartermaster)", auditTrail: [] }
      ];
      localStorage.setItem("privateers_db_contributions", JSON.stringify(defaultContributions));
      setContributions(defaultContributions);
    } else {
      setContributions(JSON.parse(localContributions));
    }

    if (!localForum) {
      const defaultForum = [
        {
          id: "post_1",
          category: "Announcements",
          title: "Inaugural Proclamation of the National Association of Privateers",
          content: "Welcome, Sea Wolves and Privateers, to the official digital portal of the National Association of Privateers (Great Niger Delta Chapter). This system has been established under the Scribe's ink and Quartermaster's ledger to ensure unified communication, absolute financial transparency, and secured coordination across all our active fleets. As guardians of our maritime heritage, we stand united by fellowship, honor, and community service. Moving forward, all formal proclamations, cargo welfare updates, and conclave schedules will be published here directly by the leadership council. Sail safe and stand true.",
          authorId: "mem_1",
          authorName: "Admiral David Chukwuyem",
          authorRank: MemberRank.ADMIRAL,
          createdAt: "2026-07-20T12:00:00Z",
          date: "July 20, 2026",
          readTime: "2 min read",
          summary: "Official address from Admiral David Chukwuyem on the launch of our digital ledger and guild communication channels.",
          image: "https://picsum.photos/seed/nautical_charter/600/400",
          likes: [],
          comments: []
        }
      ];
      localStorage.setItem("privateers_db_forum", JSON.stringify(defaultForum));
      setForumPosts(defaultForum);
    } else {
      setForumPosts(JSON.parse(localForum));
    }

    if (!localChats) {
      const defaultChats = [
        {
          id: "chat_1",
          name: "Admiralty Command Room",
          description: "Admiral Chukwuyem & Fleet Commanders strategic counsel",
          unread: false,
          messages: [
            { sender: "Scribe Teach", rank: "Scribe", text: "Admiral, the archival background checks for the new Delta recruits are complete.", time: "10:15 AM" },
            { sender: "Admiral David Chukwuyem", rank: "Admiral", text: "Excellent, Scribe. Ensure they are fully certified before the next Conclave.", time: "10:20 AM" },
            { sender: "Captain Jack", rank: "Quartermaster", text: "The Brass River ledgers are ready for your personal sign-off, Admiral.", time: "11:05 AM" }
          ]
        },
        {
          id: "chat_2",
          name: "Brass River Fleet Mess",
          description: "Bayelsa Port Complex local chat & general banter",
          unread: true,
          messages: [
            { sender: "Captain Jack", rank: "Quartermaster", text: "Who left the sailing charts in the mess-room? Scribe Teach is looking for them.", time: "Yesterday" },
            { sender: "Recruit Henry", rank: "Recruit", text: "I believe Captain Jack has them in his ledger folder. I saw them there earlier.", time: "Yesterday" }
          ]
        },
        {
          id: "chat_3",
          name: "Bonny Estuary Fleet Mess",
          description: "Rivers Port Complex engineering & tactical logs",
          unread: false,
          messages: [
            { sender: "Anne Bonny", rank: "Privateer", text: "The diesel propulsion units on the Bonny Flagship are fully serviced.", time: "Yesterday" },
            { sender: "Scribe Teach", rank: "Scribe", text: "Splendid job, Anne! Record the maintenance invoice under the vessel ledger.", time: "Yesterday" }
          ]
        },
        {
          id: "chat_4",
          name: "Forcados Fleet Mess",
          description: "Delta Port Complex community coordination",
          unread: false,
          messages: [
            { sender: "Recruit Henry", rank: "Recruit", text: "Is the Warri South coastal cleanup schedule confirmed for Saturday?", time: "2 days ago" },
            { sender: "Admiral David Chukwuyem", rank: "Admiral", text: "Yes, Henry. Gathering time is exactly 0800 hours at Delta Port Wharf.", time: "2 days ago" }
          ]
        },
        {
          id: "chat_5",
          name: "Quartermaster Ledger Audit",
          description: "Levies, annual dues audits & treasury reports",
          unread: true,
          messages: [
            { sender: "Captain Jack", rank: "Quartermaster", text: "All annual levying is 95% complete. We need to follow up on outstanding monthly dues.", time: "10:45 AM" },
            { sender: "Anne Bonny", rank: "Privateer", text: "I have submitted mine. Jack, please check if the deposit cleared.", time: "11:10 AM" }
          ]
        },
        {
          id: "chat_6",
          name: "Logistics & Relief Relays",
          description: "Welfare materials & disaster cargo plans",
          unread: false,
          messages: [
            { sender: "Admiral David Chukwuyem", rank: "Admiral", text: "We are preparing a new relief relay cargo run for the coastal schools next week.", time: "3 days ago" },
            { sender: "Captain Jack", rank: "Quartermaster", text: "First aid supplies and notebooks have been packed into the central dockyard.", time: "3 days ago" }
          ]
        },
        {
          id: "chat_7",
          name: "Scribes & Historical Archives",
          description: "Constitutional drafts & maritime history studies",
          unread: false,
          messages: [
            { sender: "Scribe Teach", rank: "Scribe", text: "I am digitizing our Chapter's 2025 Conclave minutes. Scribes, please review.", time: "4 days ago" },
            { sender: "Admiral David Chukwuyem", rank: "Admiral", text: "Splendid, Scribe. Preserve our institutional history above all.", time: "4 days ago" }
          ]
        },
        {
          id: "chat_8",
          name: "Letters of Marque Admissions",
          description: "Recruitment verification & applicant reviews",
          unread: false,
          messages: [
            { sender: "Scribe Teach", rank: "Scribe", text: "We have two new applications submitted via the online registry.", time: "5 days ago" },
            { sender: "Admiral David Chukwuyem", rank: "Admiral", text: "Verify their province security records before scheduling interviews.", time: "5 days ago" }
          ]
        }
      ];
      localStorage.setItem("privateers_db_chats", JSON.stringify(defaultChats));
      setChatRooms(defaultChats);
    } else {
      setChatRooms(JSON.parse(localChats));
    }

    if (!localElections) {
      const defaultElections = [
        { id: "el_1", title: "Grand Bosun Chapter Election 2026", description: "Vote for the Grand Bosun (Election and Succession Officer) of the Great Niger Delta chapter. The Bosun ensures secret ballots, monitors conclave voting, and registers candidates.", votingStart: "2026-07-19T00:00:00Z", votingEnd: "2026-07-26T23:59:00Z", status: "ACTIVE", candidates: [{ mqeNumber: "MQE-0000244", name: "Anne Bonny", rank: MemberRank.PRIVATEER, campaignManifesto: "Transparency in elections. Complete live-audit trail for all chapter ballots. Let the Privateer's voice be heard in every conclave!", votesCount: 3 }, { mqeNumber: "MQE-0000018", name: "Edward Teach", rank: MemberRank.SCRIBE, campaignManifesto: "Tradition and code. I will ensure every ballot is inscribed in the permanent Scribe records.", votesCount: 2 }], votedMqes: ["MQE-0000001", "MQE-0000123"] }
      ];
      localStorage.setItem("privateers_db_elections", JSON.stringify(defaultElections));
      setElections(defaultElections);
    } else {
      setElections(JSON.parse(localElections));
    }

    if (!localEvents) {
      const defaultEvents = [
        { id: "evt_1", title: "Mid-Year Corsairs Conclave & Audit", description: "Annual physical assembly, ledger auditing by the Quartermaster, awards of merit, and QR-code attendance check-in. Meeting minutes will be recorded by Scribe Teach.", date: "2026-07-24", time: "10:00 AM", location: "Grand Deck Assembly Hall, Port Harcourt", meetingLink: "https://zoom.us/j/9876543210", coverImage: "https://picsum.photos/seed/conclave/800/400", rsvps: [{ mqeNumber: "MQE-0000001", name: "Admiral David Chukwuyem", status: "YES" }, { mqeNumber: "MQE-0000123", name: "Jack Sparrow", status: "YES" }, { mqeNumber: "MQE-0000244", name: "Anne Bonny", status: "YES" }], attendanceList: ["MQE-0000001", "MQE-0000123"], reports: "Audit compiled. Chapter funds balanced and approved by Admiral David." }
      ];
      localStorage.setItem("privateers_db_events", JSON.stringify(defaultEvents));
      setEvents(defaultEvents);
    } else {
      setEvents(JSON.parse(localEvents));
    }

    if (!localDocs) {
      const defaultDocs = [
        { id: "doc_1", title: "GND Chapter Constitution 2026", category: "Constitution", fileUrl: "#", versionHistory: [{ version: "1.0", updatedBy: "Admiral David Chukwuyem", updatedAt: "2026-01-10T10:00:00Z", notes: "Initial draft established upon GND Chapter creation." }], uploadedAt: "2026-01-10T10:00:00Z" },
        { id: "doc_2", title: "Corsair Code of Conduct & Bylaws", category: "Bylaws", fileUrl: "#", versionHistory: [{ version: "1.1", updatedBy: "Edward Teach (Scribe)", updatedAt: "2026-03-12T11:00:00Z", notes: "Bylaw amendment on privateer vessel logistics and ledger dues accountability." }], uploadedAt: "2026-01-12T11:00:00Z" }
      ];
      localStorage.setItem("privateers_db_documents", JSON.stringify(defaultDocs));
      setDocuments(defaultDocs);
    } else {
      setDocuments(JSON.parse(localDocs));
    }

    if (!localLogs) {
      const defaultLogs = [
        { id: "log_1", userEmail: "davidchukwuyem73@gmail.com", userName: "Admiral David", userMqe: "MQE-0000001", action: "CHAPTER_INITIATED", timestamp: "2026-01-10T10:15:00Z", details: "Admiral David Chukwuyem initiated the Great Niger Delta Chapter Portal." },
        { id: "log_2", userEmail: "jack@corsairs.org", userName: "Jack Sparrow", userMqe: "MQE-0000123", action: "QUARTERMASTER_LEDGER_UPDATE", timestamp: "2026-05-02T11:50:00Z", details: "Quartermaster recorded PAID dues for Anne Bonny (MQE-0000244) - May Dues: 15,000 NGN." }
      ];
      localStorage.setItem("privateers_db_logs", JSON.stringify(defaultLogs));
      setAuditLogs(defaultLogs);
    } else {
      setAuditLogs(JSON.parse(localLogs));
    }

    if (!localApps) {
      const defaultApps = [
        { id: "app_1", memberId: "mem_5", interviewStatus: "Scheduled", backgroundStatus: "Passed", adminNotes: "Background checks completed successfully. Clean record. Displays high commitment to maritime safety and fraternal bond.", approvalStatus: "Pending", approvalHistory: [{ status: "Pending", updatedBy: "Admiral David", updatedAt: "2026-06-25T14:30:00Z", comment: "Application received. Background verification initiated." }] }
      ];
      localStorage.setItem("privateers_db_apps", JSON.stringify(defaultApps));
      setApplications(defaultApps);
    } else {
      setApplications(JSON.parse(localApps));
    }

    // Sync leadership database
    const localLeadership = localStorage.getItem("privateers_db_leadership");
    if (!localLeadership) {
      const defaultLeadership = [
        {
          id: "lead_1",
          name: "Admiral David Chukwuyem",
          role: "Grand Deck Admiral & SAEAHAWKS⚓ Commander",
          type: "Active",
          biography: "Founder of the Great Niger Delta chapter. Extensive naval logistics authority and commander of the chapter fleet.",
          photo: "https://picsum.photos/seed/david_admiral/400/400"
        },
        {
          id: "lead_2",
          name: "Captain Jack Sparrow",
          role: "Quartermaster & Treasurer",
          type: "Active",
          biography: "Oversees the manual physical ledger and manages GND welfare cargo and distribution. Known for absolute transparency.",
          photo: "https://picsum.photos/seed/jack_quarter/400/400"
        },
        {
          id: "lead_3",
          name: "Scribe Edward Teach",
          role: "Chapter Scribe & Chief Archivist",
          type: "Active",
          biography: "Logs all conclave minutes, publishes formal proclamations, and administers the privateer document library.",
          photo: "https://picsum.photos/seed/edward_scribe/400/400"
        },
        {
          id: "lead_4",
          name: "Admiral Henry Morgan",
          role: "Former Grand Commander",
          type: "Former",
          biography: "Sovereign leader during the Forcados patrol setup. Retired with high honors after 10 years of fleet command.",
          photo: "https://picsum.photos/seed/henry_former/400/400"
        }
      ];
      localStorage.setItem("privateers_db_leadership", JSON.stringify(defaultLeadership));
      setLeadership(defaultLeadership);
    } else {
      setLeadership(JSON.parse(localLeadership));
    }

    // Sync chapters database
    const localChapters = localStorage.getItem("privateers_db_chapters");
    if (!localChapters) {
      localStorage.setItem("privateers_db_chapters", JSON.stringify([]));
      setChapters([]);
    } else {
      setChapters(JSON.parse(localChapters));
    }

    // Sync site logo
    const savedLogo = localStorage.getItem("privateers_site_logo") || "";
    setSiteLogo(savedLogo);

    // Sync public site configuration
    const currentSiteConfig = getPublicSiteConfig();
    setSiteConfig(currentSiteConfig);

    setBrandingForm({
      logoUrl: savedLogo,
      faviconUrl: localStorage.getItem("privateers_site_favicon") || "",
      siteName: currentSiteConfig.brandName || "National Association of Privateers",
      tagline: currentSiteConfig.tagline || "Great Niger Delta Chapter & Maritime Guild"
    });
  };

  useEffect(() => {
    if (activeMenu === "dispatch") {
      router.push("/dispatch");
    }
  }, [activeMenu]);

  // On mount, load session and database
  useEffect(() => {
    // Check if we have a session in localStorage
    const savedSession = localStorage.getItem("privateers_session");
    const loggedOut = localStorage.getItem("privateers_logged_out");
    if (!savedSession) {
      if (loggedOut === "true") {
        router.push("/portal?mode=login");
      } else {
        // Seed default session if none exists to ensure preview works instantly
        const defaultSession = {
          id: "mem_3",
          email: "anne@corsairs.org",
          name: "Privateer Anne Bonny",
          mqeNumber: "MQE-0000244",
          rank: MemberRank.PRIVATEER,
          status: MemberStatus.ACTIVE,
          superAdmin: false
        };
        localStorage.setItem("privateers_session", JSON.stringify(defaultSession));
        setTimeout(() => {
          setSession(defaultSession);
          setCurrentRole(MemberRank.PRIVATEER);
        }, 0);
      }
    } else {
      const parsed = JSON.parse(savedSession);
      setTimeout(() => {
        setSession(parsed);
        setCurrentRole(parsed.rank);
      }, 0);
    }

    // Sync state-level DB with localStorage (or default initial arrays if empty)
    setTimeout(() => {
      syncDatabase();
    }, 0);
  }, []);

  // Helper to record system audit log reactively
  const logSystemAction = (action: string, details: string) => {
    const freshLogs = [...auditLogs];
    const newLog = {
      id: generateUniqueId("log"),
      userEmail: session?.email || "anonymous@corsairs.org",
      userName: session?.name || "Override Role",
      userMqe: session?.mqeNumber || "GUEST",
      action,
      timestamp: getTimestampIso(),
      details
    };
    freshLogs.unshift(newLog);
    setAuditLogs(freshLogs);
    localStorage.setItem("privateers_db_logs", JSON.stringify(freshLogs));
  };

  // Handler for Role Overriding (RBAC Demonstrator)
  const handleRoleOverride = (role: MemberRank) => {
    if (!session?.superAdmin) {
      alert("Unauthorized: Only verified super-administrators can invoke sovereign rank override!");
      return;
    }
    setCurrentRole(role);
    const updatedSession = { ...session, rank: role };
    
    // Adjust status of simulated session
    if (role === MemberRank.RECRUIT) {
      updatedSession.status = MemberStatus.PENDING;
      updatedSession.name = "Recruit Henry Morgan";
      updatedSession.mqeNumber = "MQE-0001092";
    } else {
      updatedSession.status = MemberStatus.ACTIVE;
      // Revert name based on role
      if (role === MemberRank.ADMIRAL) {
        updatedSession.name = "Admiral David Chukwuyem";
        updatedSession.mqeNumber = "MQE-0000001";
      } else if (role === MemberRank.QUARTERMASTER) {
        updatedSession.name = "Captain Jack Sparrow";
        updatedSession.mqeNumber = "MQE-0000123";
      } else if (role === MemberRank.SCRIBE) {
        updatedSession.name = "Scribe Edward Teach";
        updatedSession.mqeNumber = "MQE-0000018";
      } else {
        updatedSession.name = "Privateer Anne Bonny";
        updatedSession.mqeNumber = "MQE-0000244";
      }
    }

    setSession(updatedSession);
    localStorage.setItem("privateers_session", JSON.stringify(updatedSession));
    logSystemAction("ROLE_OVERRIDE_TRIGGERED", `User invoked sovereign rank override to: ${role}`);
  };

  // Add a contribution manually (Quartermaster ledger action)
  const handleAddPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPayment.mqeNumber || !newPayment.amount || !newPayment.description) return;

    const targetMember = members.find(m => m.mqeNumber === newPayment.mqeNumber.trim().toUpperCase());
    if (!targetMember) {
      alert("Error: Target MQE Number is not registered on Scribe Teach's ledger.");
      return;
    }

    const freshContribs = [...contributions];
    const newRecord = {
      id: generateUniqueId("con"),
      memberId: targetMember.id,
      memberName: targetMember.name,
      mqeNumber: targetMember.mqeNumber,
      type: newPayment.type,
      description: newPayment.description,
      amount: parseFloat(newPayment.amount),
      status: "PAID" as any,
      paymentDate: getTimestampIso(),
      recordedBy: `${session?.name} (${session?.rank})`,
      auditTrail: [
        {
          action: "RECORDED_PAYMENT",
          updatedBy: session?.name || "Quartermaster",
          updatedAt: getTimestampIso()
        }
      ]
    };

    freshContribs.unshift(newRecord);
    setContributions(freshContribs);
    localStorage.setItem("privateers_db_contributions", JSON.stringify(freshContribs));
    
    logSystemAction(
      "LEDGER_RECORD_CREATED",
      `Quartermaster logged manual physical contribution: ${newPayment.type} of ${newPayment.amount} NGN for ${targetMember.name} (${targetMember.mqeNumber}).`
    );

    setNewPayment({ mqeNumber: "", type: ContributionType.MONTHLY_DUES, description: "", amount: "" });
  };

  // Audit/Toggle payment status (ledger adjustment)
  const handleTogglePaymentStatus = (contribId: string, currentStatus: "PAID" | "OUTSTANDING") => {
    const freshContribs = contributions.map(c => {
      if (c.id === contribId) {
        const nextStatus = currentStatus === "PAID" ? "OUTSTANDING" : "PAID";
        return {
          ...c,
          status: nextStatus,
          paymentDate: nextStatus === "PAID" ? getTimestampIso() : undefined,
          recordedBy: `${session?.name} (${session?.rank})`
        };
      }
      return c;
    });

    setContributions(freshContribs);
    localStorage.setItem("privateers_db_contributions", JSON.stringify(freshContribs));

    const target = contributions.find(c => c.id === contribId);
    logSystemAction(
      "LEDGER_RECORD_MODIFIED",
      `Ledger entry ID ${contribId} for ${target?.memberName} adjusted status from ${currentStatus} to ${currentStatus === "PAID" ? "OUTSTANDING" : "PAID"}.`
    );
  };

  // Recruitment Approve / Reject
  const handleApplicationDecision = (appId: string, decision: "Approved" | "Rejected") => {
    const app = applications.find(a => a.id === appId);
    if (!app) return;

    const freshMembers = members.map(m => {
      if (m.id === app.memberId) {
        return {
          ...m,
          status: decision === "Approved" ? MemberStatus.ACTIVE : MemberStatus.REJECTED,
          rank: decision === "Approved" ? MemberRank.PRIVATEER : MemberRank.RECRUIT
        };
      }
      return m;
    });

    const freshApps = applications.map(a => {
      if (a.id === appId) {
        return {
          ...a,
          approvalStatus: decision,
          approvalHistory: [
            ...a.approvalHistory,
            {
              status: decision === "Approved" ? MemberStatus.ACTIVE : MemberStatus.REJECTED,
              updatedBy: session?.name || "Admiral",
              updatedAt: getTimestampIso(),
              comment: `Application officially ${decision.toLowerCase()} by sovereign Admiral command.`
            }
          ]
        };
      }
      return a;
    });

    setMembers(freshMembers);
    setApplications(freshApps);
    localStorage.setItem("privateers_db_members", JSON.stringify(freshMembers));
    localStorage.setItem("privateers_db_apps", JSON.stringify(freshApps));

    const applicant = members.find(m => m.id === app.memberId);
    logSystemAction(
      "RECRUITMENT_DECISION",
      `Admiral David Chukwuyem completed audit for applicant ${applicant?.name} (${applicant?.mqeNumber}) -> Decision: ${decision.toUpperCase()}`
    );
  };

  // Cast vote on active election
  const handleVoteSubmit = (electionId: string, choice: string, candidateMqe?: string) => {
    const voterMqe = session?.mqeNumber;
    if (!voterMqe) return;

    const freshElections = elections.map(el => {
      if (el.id === electionId) {
        if (el.votedMqes.includes(voterMqe)) {
          alert("Sovereign ballot error: You have already cast your secret vote in this cycle.");
          return el;
        }

        let updatedElection;
        if (el.type === "POLICY" || !candidateMqe) {
          updatedElection = {
            ...el,
            ayeVotes: choice === "AYE" ? (el.ayeVotes || 0) + 1 : (el.ayeVotes || 0),
            nayVotes: choice === "NAY" ? (el.nayVotes || 0) + 1 : (el.nayVotes || 0),
            votedMqes: [...el.votedMqes, voterMqe]
          };
        } else {
          const updatedCandidates = el.candidates.map((cand: any) => {
            if (cand.mqeNumber === candidateMqe) {
              if (choice === "AYE") {
                return { ...cand, votesCount: cand.votesCount + 1 };
              } else {
                return { ...cand, nayVotesCount: (cand.nayVotesCount || 0) + 1 };
              }
            }
            return cand;
          });
          updatedElection = {
            ...el,
            candidates: updatedCandidates,
            votedMqes: [...el.votedMqes, voterMqe]
          };
        }

        return updatedElection;
      }
      return el;
    });

    setElections(freshElections);
    localStorage.setItem("privateers_db_elections", JSON.stringify(freshElections));

    logSystemAction(
      "BALLOT_CAST_SECRET",
      `Secret ballot cast successfully by member ${session?.mqeNumber} in election cycle.`
    );
  };

  // High-Resolution Canvas Exporter for downloading a clear ID card image
  const handleDownloadIDCard = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 1012; // Crisp high-res credit card proportions
    canvas.height = 640;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Draw Background (Warm parchment style)
    ctx.fillStyle = "#fdfbf7";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Double Border (Crimson & Gold accents)
    ctx.strokeStyle = "#991b1b"; // red-800
    ctx.lineWidth = 6;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
    ctx.lineWidth = 2;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

    // Draw Watermark Seal (Low opacity overlay)
    ctx.globalAlpha = 0.05;
    ctx.fillStyle = "#991b1b";
    ctx.beginPath();
    ctx.arc(canvas.width - 150, canvas.height - 150, 120, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1.0;

    // Draw Header Text (Mature, elegant display serif)
    ctx.fillStyle = "#991b1b";
    ctx.font = "bold 26px Georgia, serif";
    ctx.fillText("NATIONAL ASSOCIATION OF PRIVATEERS", 40, 65);
    ctx.fillStyle = "#475569"; // slate-600
    ctx.font = "bold 13px monospace";
    ctx.fillText("SOVEREIGN GREAT NIGER DELTA CHAPTER COMMISSION", 40, 90);

    // Horizontal Separator
    ctx.strokeStyle = "rgba(153, 27, 27, 0.3)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(40, 110);
    ctx.lineTo(canvas.width - 40, 110);
    ctx.stroke();

    // Prepare profile image fallback and draw other sections
    const photoImg = new Image();
    photoImg.crossOrigin = "anonymous";
    photoImg.src = session?.profilePhoto || "https://picsum.photos/seed/admiral/150/150";
    
    const drawDetailsAndDownload = () => {
      // Draw Passport Photo
      ctx.fillStyle = "#0f172a"; // slate-900 backplate
      ctx.fillRect(40, 135, 160, 160);
      try {
        if (photoImg.complete && photoImg.naturalWidth > 0) {
          ctx.drawImage(photoImg, 40, 135, 160, 160);
        } else {
          // Initials fallback
          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 42px monospace";
          ctx.textAlign = "center";
          ctx.fillText((session?.name || "P").charAt(0).toUpperCase(), 120, 230);
          ctx.textAlign = "left";
        }
      } catch (e) {
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 42px monospace";
        ctx.textAlign = "center";
        ctx.fillText((session?.name || "P").charAt(0).toUpperCase(), 120, 230);
        ctx.textAlign = "left";
      }

      // Crimson photo border
      ctx.strokeStyle = "#991b1b";
      ctx.lineWidth = 3;
      ctx.strokeRect(40, 135, 160, 160);

      // Render credentials fields
      ctx.fillStyle = "#475569";
      ctx.font = "bold 10px monospace";
      ctx.fillText("COMMISSIONED PRIVATEER (LEGAL NAME):", 225, 150);
      ctx.fillStyle = "#0f172a";
      ctx.font = "bold 20px Georgia, serif";
      ctx.fillText(session?.name || "Unknown Privateer", 225, 175);

      ctx.fillStyle = "#475569";
      ctx.font = "bold 10px monospace";
      ctx.fillText("MARQUE NUMBER (ID NUMBER):", 225, 210);
      ctx.fillStyle = "#991b1b";
      ctx.font = "bold 18px monospace";
      ctx.fillText(session?.mqeNumber || "MQE-0000-0000", 225, 230);

      // Sovereign parameters (separated rank)
      ctx.fillStyle = "#475569";
      ctx.font = "bold 10px monospace";
      ctx.fillText("SOVEREIGN ROLE (RANK):", 225, 265);
      ctx.fillStyle = "#0f172a";
      ctx.font = "bold 14px monospace";
      ctx.fillText(session?.rank || "Unranked", 225, 282);

      ctx.fillStyle = "#475569";
      ctx.font = "bold 10px monospace";
      ctx.fillText("CHAPTER / FLEET BRANCH:", 475, 265);
      ctx.fillStyle = "#0f172a";
      ctx.font = "bold 14px monospace";
      ctx.fillText("GREAT NIGER DELTA FLEET", 475, 282);

      ctx.fillStyle = "#475569";
      ctx.font = "bold 10px monospace";
      ctx.fillText("COMMISSION STATUS:", 725, 265);
      ctx.fillStyle = "#047857"; // emerald-700
      ctx.font = "bold 14px monospace";
      ctx.fillText(session?.status || "ACTIVE COMMISSION", 725, 282);

      // Separator 2
      ctx.strokeStyle = "rgba(153, 27, 27, 0.15)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(40, 315);
      ctx.lineTo(canvas.width - 40, 315);
      ctx.stroke();

      // Commission dates
      ctx.fillStyle = "#475569";
      ctx.font = "bold 10px monospace";
      ctx.fillText("COMMISSION ISSUANCE & AUDIT EXPIRY DATES:", 40, 345);
      ctx.fillStyle = "#0f172a";
      ctx.font = "bold 13px monospace";
      ctx.fillText("ISSUED: 21 JULY 2026  |  EXPIRY END: 21 JULY 2031", 40, 365);

      // Emergency info
      ctx.fillStyle = "#475569";
      ctx.font = "bold 10px monospace";
      ctx.fillText("EMERGENCY COMMUNICATIONS AUDIT ROUTE:", 40, 410);
      ctx.fillStyle = "#0f172a";
      ctx.font = "bold 12px monospace";
      ctx.fillText("CONTACT CHAPTER CONCLAVE COMMAND: +234 (0) 803 000 0000  |  registry@saeahawks.org", 40, 430);

      // Separator 3
      ctx.strokeStyle = "rgba(153, 27, 27, 0.15)";
      ctx.beginPath();
      ctx.moveTo(40, 465);
      ctx.lineTo(canvas.width - 40, 465);
      ctx.stroke();

      // Lower QR/Signature section
      // Draw QR Code
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(40, 485, 110, 110);
      // QR finder patterns
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(46, 491, 30, 30);
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(52, 497, 18, 18);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(56, 501, 10, 10);

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(114, 491, 30, 30);
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(120, 497, 18, 18);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(124, 501, 10, 10);

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(46, 559, 30, 30);
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(52, 565, 18, 18);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(56, 569, 10, 10);

      // Draw pixel noise inside QR
      ctx.fillStyle = "#ffffff";
      for (let i = 0; i < 40; i++) {
        const rx = 46 + Math.floor(Math.random() * 80);
        const ry = 491 + Math.floor(Math.random() * 80);
        ctx.fillRect(rx, ry, 5, 5);
      }
      
      ctx.fillStyle = "#475569";
      ctx.font = "bold 8px monospace";
      ctx.fillText("VERIFIED SCROLL REGISTRY", 165, 530);
      ctx.fillText("SECURE BLOCK ID: " + (session?.id || "MEM-001"), 165, 545);

      // Signature 1: Admiral David Chukwuyem
      ctx.fillStyle = "#0f172a";
      ctx.font = "italic bold 17px Georgia, serif";
      ctx.fillText("David Chukwuyem", 500, 525);
      ctx.fillStyle = "#475569";
      ctx.font = "bold 8px monospace";
      ctx.fillText("GRAND DECK ADMIRAL & SAEAHAWKS COMMANDER", 500, 545);

      // Signature 2: Edward Teach
      ctx.fillStyle = "#0f172a";
      ctx.font = "italic bold 17px Georgia, serif";
      ctx.fillText("Edward Teach", 760, 525);
      ctx.fillStyle = "#475569";
      ctx.font = "bold 8px monospace";
      ctx.fillText("CHAPTER CHIEF SCRIBE & ARCHIVIST", 760, 545);

      ctx.strokeStyle = "rgba(15, 23, 42, 0.3)";
      ctx.beginPath();
      ctx.moveTo(500, 532);
      ctx.lineTo(720, 532);
      ctx.moveTo(760, 532);
      ctx.lineTo(970, 532);
      ctx.stroke();

      // Trigger download stream
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `Privateer_Commission_Card_${session?.name || "member"}.png`;
      link.href = dataUrl;
      link.click();
    };

    photoImg.onload = drawDetailsAndDownload;
    photoImg.onerror = drawDetailsAndDownload;
  };

  // Add Forum post
  const handleAddPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.title || !newPost.content) return;

    const freshPosts = [...forumPosts];
    const record = {
      id: generateUniqueId("post"),
      category: newPost.category,
      title: newPost.title,
      content: newPost.content,
      authorId: session?.id || "mem_1",
      authorName: session?.name || "Privateer",
      authorRank: session?.rank || MemberRank.PRIVATEER,
      createdAt: getTimestampIso(),
      likes: [],
      comments: []
    };

    freshPosts.unshift(record);
    setForumPosts(freshPosts);
    localStorage.setItem("privateers_db_forum", JSON.stringify(freshPosts));

    logSystemAction(
      "FORUM_POST_PUBLISHED",
      `Member posted new thread: "${newPost.title}" under category "${newPost.category}".`
    );

    setNewPost({ title: "", content: "", category: "Announcements" });
  };

  // Send Direct Dispatch Chat Message
  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    const activeRoom = chatRooms.find(r => r.id === activeChatId);
    if (!activeRoom) return;

    const newMessageObj = {
      sender: session?.name || "Admiral David Chukwuyem",
      rank: session?.rank || "Admiral",
      text: chatInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedRooms = chatRooms.map(room => {
      if (room.id === activeChatId) {
        return {
          ...room,
          messages: [...room.messages, newMessageObj],
          unread: false
        };
      }
      return room;
    });

    setChatRooms(updatedRooms);
    localStorage.setItem("privateers_db_chats", JSON.stringify(updatedRooms));
    setChatInput("");

    logSystemAction(
      "CHAT_MESSAGE_SENT",
      `Member sent chat message in room: "${activeRoom.name}".`
    );
  };

  // Like forum post
  const handleLikePost = (postId: string) => {
    const mqe = session?.mqeNumber;
    if (!mqe) return;

    const freshPosts = forumPosts.map(p => {
      if (p.id === postId) {
        const index = p.likes.indexOf(mqe);
        const updatedLikes = [...p.likes];
        if (index === -1) {
          updatedLikes.push(mqe);
        } else {
          updatedLikes.splice(index, 1);
        }
        return { ...p, likes: updatedLikes };
      }
      return p;
    });

    setForumPosts(freshPosts);
    localStorage.setItem("privateers_db_forum", JSON.stringify(freshPosts));
  };

  // Submit forum comment
  const handleAddComment = (postId: string) => {
    const text = newComment[postId]?.trim();
    if (!text || !session) return;

    const freshPosts = forumPosts.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          comments: [
            ...p.comments,
            {
              id: generateUniqueId("com"),
              authorId: session.id,
              authorName: session.name,
              authorRank: session.rank,
              content: text,
              createdAt: getTimestampIso()
            }
          ]
        };
      }
      return p;
    });

    setForumPosts(freshPosts);
    localStorage.setItem("privateers_db_forum", JSON.stringify(freshPosts));
    setNewComment({ ...newComment, [postId]: "" });
  };

  // Document Upload
  const handleUploadDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoc.title) return;

    const freshDocs = [...documents];
    const record = {
      id: generateUniqueId("doc"),
      title: newDoc.title,
      category: newDoc.category,
      fileUrl: "#",
      uploadedAt: getTimestampIso(),
      versionHistory: [
        {
          version: "1.0",
          updatedBy: `${session?.name} (${session?.rank})`,
          updatedAt: getTimestampIso(),
          notes: "Initial manuscript lodge to Chapter Doc Vault."
        }
      ]
    };

    freshDocs.push(record);
    setDocuments(freshDocs);
    localStorage.setItem("privateers_db_documents", JSON.stringify(freshDocs));

    logSystemAction(
      "DOCUMENT_UPLOADED",
      `Scribe uploaded new chapter document: "${newDoc.title}" under category "${newDoc.category}".`
    );

    setNewDoc({ title: "", category: "Minutes" });
  };

  // Camera QR Attendance Simulator/Real trigger
  const handleStartScanner = async () => {
    setShowScanner(true);
    setScanStatus("scanning");
    setScannedMqe("");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Simulate a QR Code auto-scan after 3.5 seconds
      setTimeout(() => {
        // Randomly select another member (non-Admin) to check-in
        const nonAdmins = members.filter(m => m.mqeNumber !== session?.mqeNumber);
        const randomMember = nonAdmins[Math.floor(Math.random() * nonAdmins.length)] || members[0];
        
        // Log checkin
        const freshEvents = events.map(e => {
          if (e.id === "evt_1") {
            const hasCheckedIn = e.attendanceList.includes(randomMember.mqeNumber);
            if (!hasCheckedIn) {
              return {
                ...e,
                attendanceList: [...e.attendanceList, randomMember.mqeNumber]
              };
            }
          }
          return e;
        });

        setEvents(freshEvents);
        localStorage.setItem("privateers_db_events", JSON.stringify(freshEvents));

        setScannedMqe(randomMember.mqeNumber);
        setScanStatus("success");

        logSystemAction(
          "CONCLAVE_CHECKIN_QR",
          `Nautical QR Attendance Code scanned successfully. Logged check-in: ${randomMember.name} (${randomMember.mqeNumber}) at Mid-Year Conclave.`
        );

        // Turn off stream after success
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
      }, 3500);

    } catch (err) {
      // Fallback if camera permissions or hardware is blocked in iframe
      setScanStatus("error");
    }
  };

  const handleStopScanner = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setShowScanner(false);
    setScanStatus("idle");
  };

  const handleLogout = () => {
    localStorage.removeItem("privateers_session");
    localStorage.setItem("privateers_logged_out", "true");
    logSystemAction("MEMBER_LOGGED_OUT", `Member signed out of the central ledger portal.`);
    router.push("/");
  };

  // Admin logo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target?.result as string;
      localStorage.setItem("privateers_site_logo", base64);
      setSiteLogo(base64);
      window.dispatchEvent(new Event("privateers_logo_updated"));
      logSystemAction("LOGO_CUSTOMIZED", "Administrator modified the global site brand logo via image upload.");
      alert("✓ Site logo updated successfully! The changes have propagated across the entire vessel portal.");
    };
    reader.readAsDataURL(file);
  };

  const handleResetLogo = () => {
    localStorage.removeItem("privateers_site_logo");
    setSiteLogo("");
    window.dispatchEvent(new Event("privateers_logo_updated"));
    logSystemAction("LOGO_RESET", "Administrator reverted site logo back to traditional vector crest.");
    alert("✓ Logo successfully reverted to the sovereign vector crest.");
  };

  // Admin Profile Photo Upload
  const handleAdminPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target?.result as string;
      const updatedSession = { ...session, profilePhoto: base64 };
      setSession(updatedSession);
      localStorage.setItem("privateers_session", JSON.stringify(updatedSession));

      // Update in members DB
      const updatedMembers = members.map(m => {
        if (m.mqeNumber === session?.mqeNumber) {
          return { ...m, profilePhoto: base64 };
        }
        return m;
      });
      setMembers(updatedMembers);
      localStorage.setItem("privateers_db_members", JSON.stringify(updatedMembers));

      logSystemAction("PROFILE_PHOTO_UPDATED", `Administrator updated their own profile photo.`);
      alert("✓ Profile photo successfully updated.");
    };
    reader.readAsDataURL(file);
  };

  // Random MQE Generator for Admin Profile
  const handleRandomizeMqe = () => {
    const randomMqe = generateRandomMqe();
    const updatedSession = { ...session, mqeNumber: randomMqe };
    setSession(updatedSession);
    localStorage.setItem("privateers_session", JSON.stringify(updatedSession));

    // Update in members DB
    const updatedMembers = members.map(m => {
      if (m.id === session?.id) {
        return { ...m, mqeNumber: randomMqe };
      }
      return m;
    });
    setMembers(updatedMembers);
    localStorage.setItem("privateers_db_members", JSON.stringify(updatedMembers));

    logSystemAction("MQE_RANDOMIZED", `Administrator randomly generated new Marque identifier: ${randomMqe}`);
    alert(`✓ Marque number successfully randomized to: ${randomMqe}`);
  };

  // Admin Document Upload
  const handleAdminUploadDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminDocForm.title || !adminDocForm.fileContent) {
      alert("Please provide a title and select a constitution/bylaw document file.");
      return;
    }

    const docId = generateUniqueId("doc");
    const newDocumentRecord = {
      id: docId,
      title: adminDocForm.title,
      category: adminDocForm.category,
      fileUrl: adminDocForm.fileContent, // base64 string
      uploadedAt: getTimestampIso(),
      versionHistory: [
        {
          version: "1.0",
          updatedBy: `${session?.name} (${session?.rank})`,
          updatedAt: getTimestampIso(),
          notes: adminDocForm.notes || "Initial draft uploaded from Admin Panel."
        }
      ]
    };

    const updatedDocs = [newDocumentRecord, ...documents];
    setDocuments(updatedDocs);
    localStorage.setItem("privateers_db_documents", JSON.stringify(updatedDocs));
    window.dispatchEvent(new Event("privateers_documents_updated"));

    logSystemAction("DOCUMENT_LODGED", `Admin lodged a new constitutional file: "${adminDocForm.title}" under Scribe supervision.`);
    alert("✓ Constitutional document successfully uploaded and locked in Scribe archives.");

    setAdminDocForm({
      title: "",
      category: "Constitution",
      fileContent: "",
      notes: ""
    });
  };

  // Admin Leadership CRUD
  const handleSaveLeader = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaderForm.name || !leaderForm.role) {
      alert("Name and Role details are mandatory.");
      return;
    }

    let updatedLeaders;
    if (leaderForm.id) {
      // Edit
      updatedLeaders = leadership.map(l => {
        if (l.id === leaderForm.id) {
          return {
            ...l,
            name: leaderForm.name,
            role: leaderForm.role,
            type: leaderForm.type,
            biography: leaderForm.biography,
            photo: leaderForm.photo || l.photo
          };
        }
        return l;
      });
      logSystemAction("LEADER_MODIFIED", `Admin updated leadership dossier for: ${leaderForm.name}`);
      alert("✓ Leadership dossier successfully modified.");
    } else {
      // Create
      const newLeader = {
        id: generateUniqueId("lead"),
        name: leaderForm.name,
        role: leaderForm.role,
        type: leaderForm.type,
        biography: leaderForm.biography,
        photo: leaderForm.photo || `https://picsum.photos/seed/${leaderForm.name}/400/400`
      };
      updatedLeaders = [newLeader, ...leadership];
      logSystemAction("LEADER_CREATED", `Admin lodged new officer onto the Roll of Honor: ${leaderForm.name}`);
      alert("✓ New leader successfully added to the sovereign Roll of Honor.");
    }

    setLeadership(updatedLeaders);
    localStorage.setItem("privateers_db_leadership", JSON.stringify(updatedLeaders));
    window.dispatchEvent(new Event("privateers_leadership_updated"));

    setLeaderForm({
      id: "",
      name: "",
      role: "",
      type: "Active",
      biography: "",
      photo: ""
    });
  };

  const handleEditLeader = (leader: any) => {
    setLeaderForm({
      id: leader.id,
      name: leader.name,
      role: leader.role,
      type: leader.type,
      biography: leader.biography,
      photo: leader.photo
    });
  };

  const handleDeleteLeader = (leaderId: string, leaderName: string) => {
    if (!confirm(`Are you sure you want to strike ${leaderName} from the Roll of Honor?`)) return;
    const updatedLeaders = leadership.filter(l => l.id !== leaderId);
    setLeadership(updatedLeaders);
    localStorage.setItem("privateers_db_leadership", JSON.stringify(updatedLeaders));
    window.dispatchEvent(new Event("privateers_leadership_updated"));

    logSystemAction("LEADER_DELETED", `Admin deleted leadership dossier for: ${leaderName}`);
    alert("✓ Officer successfully removed from Roll of Honor.");
  };

  // Recruit application approvals
  const handleApproveApplication = (appId: string, recruitMemberId: string, recruitName: string) => {
    // 1. Update member status to ACTIVE, rank to PRIVATEER
    const updatedMembers = members.map(m => {
      if (m.id === recruitMemberId) {
        return {
          ...m,
          status: MemberStatus.ACTIVE,
          rank: MemberRank.PRIVATEER,
          serviceRecord: [...(m.serviceRecord || []), `Letters of Marque approved by Admiral David (Audit Date: ${new Date().toLocaleDateString()})`]
        };
      }
      return m;
    });
    setMembers(updatedMembers);
    localStorage.setItem("privateers_db_members", JSON.stringify(updatedMembers));

    // 2. Update application status to APPROVED
    const updatedApps = applications.map(app => {
      if (app.id === appId) {
        return {
          ...app,
          approvalStatus: "Approved",
          interviewStatus: "Passed",
          backgroundStatus: "Passed",
          adminNotes: "Commission granted. Background audits fully clear. Approved by Supreme Command.",
          approvalHistory: [
            ...(app.approvalHistory || []),
            {
              status: "Approved",
              updatedBy: `${session?.name} (${session?.rank})`,
              updatedAt: getTimestampIso(),
              comment: "Letters of Marque verified and commissioned onto the Scribe's scroll."
            }
          ]
        };
      }
      return app;
    });
    setApplications(updatedApps);
    localStorage.setItem("privateers_db_apps", JSON.stringify(updatedApps));

    logSystemAction("RECRUIT_COMMISSIONED", `Admin approved recruit pledge for ${recruitName}, granting full Letters of Marque.`);
    alert(`✓ ${recruitName} has been commissioned! Letters of Marque granted, member ledger active.`);
  };

  const handleRejectApplication = (appId: string, recruitMemberId: string, recruitName: string) => {
    if (!confirm(`Are you sure you want to reject the application of ${recruitName}? This will permanently delete their account and application from the database.`)) return;

    // 1. Permanently remove member account
    const updatedMembers = members.filter(m => m.id !== recruitMemberId);
    setMembers(updatedMembers);
    localStorage.setItem("privateers_db_members", JSON.stringify(updatedMembers));

    // 2. Permanently remove application
    const updatedApps = applications.filter(app => app.id !== appId);
    setApplications(updatedApps);
    localStorage.setItem("privateers_db_apps", JSON.stringify(updatedApps));

    logSystemAction("RECRUIT_REJECTED", `Admin declined recruitment application for candidate: ${recruitName}. Account permanently deleted.`);
    alert(`✓ Application for ${recruitName} has been rejected and permanently deleted from the database.`);
  };

  const handleInitializeCleanProductionSystem = () => {
    if (!confirm("Are you sure you want to clean the system for production? This will remove all dummy/demo members, sample elections, test forum posts, fake chats, and placeholder applications. Only the primary Administrator account (Admiral David Chukwuyem) will be preserved.")) {
      return;
    }

    // Preserve primary administrator
    const masterAdmin = {
      id: "mem_1",
      mqeNumber: "MQE-0000001",
      name: "Admiral David Chukwuyem",
      dob: "1988-04-12",
      phone: "+234 803 111 2222",
      email: "davidchukwuyem73@gmail.com",
      profession: "Marine Superintendent",
      rank: MemberRank.ADMIRAL,
      status: MemberStatus.ACTIVE,
      fleet: "Brass River Fleet",
      chapter: "Great Niger Delta Chapter",
      committee: "Disciplinary & Letters of Marque Committee",
      qrCodeCheckins: [],
      biography: "SAEAHAWKS⚓ Commander and Administrator of the Great Niger Delta Corsairs Chapter.",
      skills: ["Vessel Command", "Saber Fencing"],
      dateJoined: "2026-01-10",
      state: "Delta",
      lga: "Oshimili North",
      residentialAddress: "14 Escravos Way, Warri",
      emergencyContact: { name: "Evelyn", relation: "Spouse", phone: "+23480" }
    };

    const cleanMembers = [masterAdmin];
    setMembers(cleanMembers);
    localStorage.setItem("privateers_db_members", JSON.stringify(cleanMembers));

    setContributions([]);
    localStorage.setItem("privateers_db_contributions", JSON.stringify([]));

    setForumPosts([]);
    localStorage.setItem("privateers_db_forum", JSON.stringify([]));

    setChatRooms([]);
    localStorage.setItem("privateers_db_chats", JSON.stringify([]));

    setElections([]);
    localStorage.setItem("privateers_db_elections", JSON.stringify([]));

    setEvents([]);
    localStorage.setItem("privateers_db_events", JSON.stringify([]));

    setDocuments([]);
    localStorage.setItem("privateers_db_documents", JSON.stringify([]));

    setApplications([]);
    localStorage.setItem("privateers_db_apps", JSON.stringify([]));

    setChapters([]);
    localStorage.setItem("privateers_db_chapters", JSON.stringify([]));

    setLeadership([]);
    localStorage.setItem("privateers_db_leadership", JSON.stringify([]));

    const cleanLog = {
      id: `log_${Date.now()}`,
      userEmail: session?.email || "davidchukwuyem73@gmail.com",
      userName: session?.name || "Admiral David Chukwuyem",
      userMqe: session?.mqeNumber || "MQE-0000001",
      action: "PRODUCTION_LAUNCH_CLEANUP",
      timestamp: new Date().toISOString(),
      details: "Administrator executed complete production system reset. Wiped all demo/dummy test data."
    };
    const updatedLogs = [cleanLog];
    setAuditLogs(updatedLogs);
    localStorage.setItem("privateers_db_logs", JSON.stringify(updatedLogs));

    alert("✓ System reset complete! All test data removed. The Quarter Deck and internal portal are now 100% clean and ready for real production use.");
  };

  // Financial Calculations
  const totalDuesPaid = contributions.filter(c => c.status === "PAID").reduce((sum, c) => sum + c.amount, 0);
  const outstandingDues = contributions.filter(c => c.status === "OUTSTANDING").reduce((sum, c) => sum + c.amount, 0);
  const activeMembersCount = members.filter(m => m.status === MemberStatus.ACTIVE).length;

  // Filter Directory
  const filteredMembers = members.filter(m => {
    const query = directorySearch.toLowerCase().trim();
    const matchesSearch = !query ||
      (m.name && m.name.toLowerCase().includes(query)) ||
      (m.mqeNumber && m.mqeNumber.toLowerCase().includes(query)) ||
      (m.profession && m.profession.toLowerCase().includes(query)) ||
      (m.phone && m.phone.toLowerCase().includes(query)) ||
      (m.email && m.email.toLowerCase().includes(query)) ||
      (m.suite && m.suite.toLowerCase().includes(query)) ||
      (m.fleet && m.fleet.toLowerCase().includes(query)) ||
      (m.rank && m.rank.toLowerCase().includes(query)) ||
      (m.committee && m.committee.toLowerCase().includes(query)) ||
      (m.state && m.state.toLowerCase().includes(query)) ||
      (Array.isArray(m.skills) && m.skills.some((s: string) => s.toLowerCase().includes(query)));

    const matchesFleet = directoryFleet === "All" || m.fleet === directoryFleet || m.suite === directoryFleet;
    return matchesSearch && matchesFleet;
  });

  return (
    <div className="min-h-screen flex bg-slate-950 font-sans text-slate-100">
      {/* Sidebar Navigation (Desktop) */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900 border-r border-slate-800 flex-shrink-0">
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800/80 flex items-center gap-3">
          <PrivateersLogo size={42} />
          <div className="flex flex-col">
            <span className="font-serif text-sm tracking-wider font-semibold text-amber-500">
              QUARTERDECK
            </span>
            <span className="text-[9px] tracking-widest text-slate-400 font-mono uppercase font-bold">
              GND Chapter Portal
            </span>
          </div>
        </div>

        {/* User Badge */}
        <div className="p-5 border-b border-slate-800/50 bg-slate-950/40 space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-slate-900 overflow-hidden border border-amber-500/20">
              <img src={session?.profilePhoto || (session?.rank === MemberRank.RECRUIT ? "https://picsum.photos/seed/recruit/200/200" : "https://picsum.photos/seed/admiral/200/200")} alt="User portrait" className="object-cover w-full h-full" referrerPolicy="no-referrer" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate text-slate-200">{session?.name}</p>
              <p className="text-[10px] font-mono text-amber-500 font-bold tracking-wide">{session?.mqeNumber}</p>
            </div>
          </div>
          {/* Status Pillar */}
          <div className="flex items-center justify-between text-[10px] font-mono">
            <span className="text-slate-400 uppercase">Commission:</span>
            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
              session?.status === MemberStatus.ACTIVE 
                ? "bg-emerald-950/60 text-emerald-400 border border-emerald-900/50" 
                : "bg-amber-950/60 text-amber-400 border border-amber-900/50"
            }`}>
              {session?.status}
            </span>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {session?.status === MemberStatus.PENDING ? (
            /* Locked Recruit Navigation */
            <div className="space-y-4 text-center p-4 bg-amber-950/15 border border-amber-900/30 rounded-xl">
              <Lock size={24} className="mx-auto text-amber-500" />
              <p className="text-xs text-amber-300 font-light">Recruitment onboarding active. Vault access locked pending Admiral audit.</p>
            </div>
          ) : (
            /* Full Member Navigation */
            (() => {
              const navItems = [
                { id: "overview", label: "Overview", icon: Anchor },
                { id: "compass", label: "Admiralty Compass", icon: Compass },
                { id: "directory", label: "Vessel Directory", icon: Users },
                { id: "card", label: "Digital Marque Card", icon: Award },
                { id: "ledger", label: "Quartermaster Ledger", icon: DollarSign },
                { id: "forum", label: "Sovereign Forum", icon: MessageSquare },
                { id: "election", label: "Conclave Ballots", icon: Vote },
                { id: "events", label: "Conclave & QR", icon: Calendar },
                { id: "documents", label: "Document Library", icon: FileText },
                { id: "dispatch", label: "Dispatch Room", icon: MessageSquare }
              ];
              if (session?.superAdmin === true) {
                navItems.push({ id: "settings", label: "System Settings", icon: Settings });
                navItems.push({ id: "quota", label: "Quota Deck", icon: Sliders });
                navItems.push({ id: "admin", label: "Admin Console", icon: Shield });
                navItems.push({ id: "audit", label: "System Audit Logs", icon: FileSpreadsheet });
              }
              return navItems;
            })().map(item => {
              const Icon = item.icon;
              const isActive = activeMenu === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide uppercase transition-all duration-300 ${
                    isActive 
                      ? "bg-red-800 text-white shadow-md font-bold" 
                      : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                  }`}
                >
                  <Icon size={16} className={isActive ? "text-amber-400" : "text-slate-400"} />
                  {item.label}
                </button>
              );
            })
          )}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-slate-800/80">
          <button 
            onClick={handleLogout}
            className="w-full py-2.5 bg-slate-950 hover:bg-red-950/20 text-slate-400 hover:text-red-400 text-xs font-bold tracking-widest uppercase rounded-lg border border-slate-800 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut size={12} />
            Log Out Ledger
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Top Control Header */}
        <header className="h-20 bg-slate-900 border-b border-slate-800/80 flex items-center justify-between px-3 sm:px-6 z-10 relative gap-2">
          {/* Mobile Menu Trigger */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-slate-300 hover:text-white"
          >
            <Menu size={24} />
          </button>

          {/* Quick Stats Overviews */}
          <div className="hidden sm:flex items-center gap-6">
            <div className="text-xs font-mono">
              <span className="text-slate-500 uppercase block text-[9px] tracking-wider font-bold">Chapter Fund Status:</span>
              <span className="text-slate-200 font-bold">{totalDuesPaid.toLocaleString()} NGN Paid</span>
            </div>
            <div className="h-6 w-px bg-slate-800"></div>
            <div className="text-xs font-mono">
              <span className="text-slate-500 uppercase block text-[9px] tracking-wider font-bold">Patrol Fleets active:</span>
              <span className="text-slate-200 font-bold">{activeMembersCount} Ships commissioned</span>
            </div>
          </div>

          {/* Role Status Indicator or Override Controller */}
          {!session?.superAdmin ? (
            <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl shadow-inner">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="hidden sm:inline text-[10px] font-bold font-mono uppercase text-slate-400 tracking-wider">Commissioned:</span>
              <span className="text-[11px] sm:text-xs font-bold text-amber-500 font-mono uppercase">{session?.rank}</span>
            </div>
          ) : (
            /* Role Override Controller (RBAC Showcase) */
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-950/80 border border-slate-800 p-1.5 sm:p-2 rounded-xl max-w-[200px] sm:max-w-none">
                <Sliders size={14} className="text-amber-500 animate-pulse flex-shrink-0" />
                <span className="hidden sm:inline text-[10px] font-bold font-mono uppercase text-slate-400">Override Rank:</span>
                <select
                  value={currentRole}
                  onChange={(e) => handleRoleOverride(e.target.value as MemberRank)}
                  className="bg-slate-900 text-[10px] sm:text-xs font-bold text-amber-500 focus:outline-none border-none pr-3 cursor-pointer max-w-[130px] sm:max-w-none truncate"
                >
                  {Object.values(MemberRank).map(rank => (
                    <option key={rank} value={rank}>{rank}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </header>

        {/* Dynamic Panels */}
        <div className="flex-1 p-3 sm:p-6 md:p-8 min-w-0 overflow-x-hidden space-y-6 sm:space-y-8">
          {/* RECRUIT ACCESS RESTRICTED SCREEN */}
          {session?.status === MemberStatus.PENDING ? (
            <div className="max-w-3xl mx-auto bg-gradient-to-br from-slate-950 to-slate-900 p-8 sm:p-12 border border-slate-800 rounded-3xl text-center space-y-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-amber-950/10 rounded-full blur-3xl z-0"></div>
              
              <div className="relative z-10 w-20 h-20 bg-amber-950/40 text-amber-500 rounded-2xl flex items-center justify-center mx-auto border border-amber-900/50">
                <Lock size={36} className="animate-pulse" />
              </div>

              <div className="relative z-10 space-y-3 max-w-lg mx-auto">
                <span className="text-[10px] font-bold font-mono tracking-widest text-amber-500 uppercase px-3 py-1 bg-amber-950/40 border border-amber-900/30 rounded-full">
                  Recruitment Audit Pending
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-slate-100 font-bold tracking-tight">
                  Letters of Marque Under Audit
                </h2>
                <p className="text-xs text-slate-400 font-light leading-relaxed">
                  Welcome, <strong className="text-slate-200 font-semibold">{session?.name}</strong>. Your recruitment pledge has been logged under temporary identifier: <strong className="text-amber-500 font-mono font-bold">{session?.mqeNumber}</strong>. 
                  Scribe Teach has forwarded your credentials to the Disciplinary & Letters of Marque Committee.
                </p>
              </div>

              {/* Progress Flow */}
              <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 text-left border-t border-slate-800/80 max-w-xl mx-auto">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold font-mono uppercase">
                    <CheckCircle size={14} /> Background Check
                  </div>
                  <p className="text-[11px] text-slate-500 font-light">Passed. Criminal and naval background verification successful.</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-amber-500 text-xs font-bold font-mono uppercase">
                    <Clock size={14} className="animate-spin" /> Port Interview
                  </div>
                  <p className="text-[11px] text-slate-500 font-light">Scheduled. Conclave interview scheduled for July 24th.</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-500 text-xs font-bold font-mono uppercase">
                    <Lock size={14} /> Sovereign Seal
                  </div>
                  <p className="text-[11px] text-slate-500 font-light">Pending. Commissions assigned post-interview approval.</p>
                </div>
              </div>

              <div className="pt-4">
                <span className="text-[10px] font-mono bg-amber-950/20 text-amber-500 font-bold border border-amber-900/40 px-4 py-2 rounded-xl inline-block uppercase tracking-wider">
                  ⚠️ Awaiting Admiral&apos;s Commission Approval
                </span>
              </div>
            </div>
          ) : (
            /* LOGGED IN MEMBER VIEW */
            <AnimatePresence mode="wait">
              {activeMenu === "quota" && (
                !session?.superAdmin ? (
                  <div className="max-w-md mx-auto py-16 text-center border border-dashed border-slate-800 rounded-3xl space-y-4 bg-slate-950/40">
                    <Lock size={48} className="text-amber-500 mx-auto animate-pulse" />
                    <h3 className="text-lg font-serif font-bold text-slate-200">Sovereign Clearance Restricted</h3>
                    <p className="text-xs text-slate-400 font-light leading-relaxed">
                      This Quota Deck is accessible only under verified cryptographic JWT session credentials from the Admiralty Command Board.
                    </p>
                  </div>
                ) : (
                  <motion.div
                    key="quota"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-8"
                  >
                    {/* Quota Deck Header */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-6">
                      <div className="space-y-1 text-center md:text-left">
                        <h2 className="font-serif text-3xl font-extrabold text-slate-100 tracking-wide flex items-center justify-center md:justify-start gap-2.5">
                          <Sliders className="text-amber-500 animate-pulse" size={28} />
                          Sovereign Quota Deck
                        </h2>
                        <p className="text-xs text-slate-400 font-light max-w-xl">
                          Admiralty command panel to regulate operational caps, fleet sizing thresholds, and sovereign chapter membership quotas.
                        </p>
                      </div>

                      <div className="flex items-center gap-2 bg-amber-950/20 border border-amber-900/40 px-3.5 py-1.5 rounded-xl">
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                        <span className="text-[10px] font-mono font-bold text-amber-500 uppercase tracking-widest">Secure Ledger Connected</span>
                      </div>
                    </div>

                    {/* Quota Status Summary & Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* Left Column: Interactive Adjustment Sliders */}
                      <div className="lg:col-span-2 space-y-6">
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
                          <h3 className="text-sm font-bold font-mono text-slate-300 uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center gap-2">
                            <Sliders size={16} className="text-amber-500" /> Adjust Operational Limits
                          </h3>

                          {quotaLoading ? (
                            <div className="py-12 text-center space-y-2">
                              <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                              <p className="text-xs text-slate-400 font-mono">Securing Admiralty cryptographic channel...</p>
                            </div>
                          ) : (
                            <div className="space-y-6">
                              {/* Brass River Fleet Limit */}
                              <div className="space-y-2">
                                <div className="flex justify-between items-center text-xs">
                                  <span className="font-semibold text-slate-300 font-serif">Brass River Fleet Limit</span>
                                  <span className="font-mono font-bold text-amber-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-850">{quotaState.brassRiverLimit} Officers</span>
                                </div>
                                <input 
                                  type="range" 
                                  min="5" 
                                  max="50" 
                                  value={quotaState.brassRiverLimit} 
                                  onChange={(e) => handleQuotaChange("brassRiverLimit", parseInt(e.target.value))}
                                  className="w-full accent-amber-500 h-1.5 bg-slate-950 rounded-lg cursor-pointer"
                                />
                                <p className="text-[10px] text-slate-500 font-light">Limits the maximum active ship commissions assigned to the Brass River bearing.</p>
                              </div>

                              {/* Bonny Estuary Fleet Limit */}
                              <div className="space-y-2">
                                <div className="flex justify-between items-center text-xs">
                                  <span className="font-semibold text-slate-300 font-serif">Bonny Estuary Fleet Limit</span>
                                  <span className="font-mono font-bold text-amber-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-850">{quotaState.bonnyEstuaryLimit} Officers</span>
                                </div>
                                <input 
                                  type="range" 
                                  min="5" 
                                  max="50" 
                                  value={quotaState.bonnyEstuaryLimit} 
                                  onChange={(e) => handleQuotaChange("bonnyEstuaryLimit", parseInt(e.target.value))}
                                  className="w-full accent-amber-500 h-1.5 bg-slate-950 rounded-lg cursor-pointer"
                                />
                                <p className="text-[10px] text-slate-500 font-light">Limits the maximum active ship commissions assigned to the Bonny Estuary bearing.</p>
                              </div>

                              {/* Forcados Fleet Limit */}
                              <div className="space-y-2">
                                <div className="flex justify-between items-center text-xs">
                                  <span className="font-semibold text-slate-300 font-serif">Forcados Fleet Limit</span>
                                  <span className="font-mono font-bold text-amber-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-850">{quotaState.forcadosLimit} Officers</span>
                                </div>
                                <input 
                                  type="range" 
                                  min="5" 
                                  max="50" 
                                  value={quotaState.forcadosLimit} 
                                  onChange={(e) => handleQuotaChange("forcadosLimit", parseInt(e.target.value))}
                                  className="w-full accent-amber-500 h-1.5 bg-slate-950 rounded-lg cursor-pointer"
                                />
                                <p className="text-[10px] text-slate-500 font-light">Limits the maximum active ship commissions assigned to the Forcados bearing.</p>
                              </div>

                              {/* Monthly Dues Quota */}
                              <div className="space-y-2">
                                <div className="flex justify-between items-center text-xs">
                                  <span className="font-semibold text-slate-300 font-serif">Monthly Chapter Dues Quota</span>
                                  <span className="font-mono font-bold text-emerald-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-850">{quotaState.monthlyDuesQuota.toLocaleString()} NGN</span>
                                </div>
                                <input 
                                  type="range" 
                                  min="500000" 
                                  max="5000000" 
                                  step="100000"
                                  value={quotaState.monthlyDuesQuota} 
                                  onChange={(e) => handleQuotaChange("monthlyDuesQuota", parseInt(e.target.value))}
                                  className="w-full accent-emerald-500 h-1.5 bg-slate-950 rounded-lg cursor-pointer"
                                />
                                <p className="text-[10px] text-slate-500 font-light">Target monthly ledger collection for chapter dues and maintenance levies.</p>
                              </div>

                              {/* Recruitment Cap */}
                              <div className="space-y-2">
                                <div className="flex justify-between items-center text-xs">
                                  <span className="font-semibold text-slate-300 font-serif">Quarterly Onboarding Cap</span>
                                  <span className="font-mono font-bold text-amber-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-850">{quotaState.recruitmentCap} Recruits</span>
                                </div>
                                <input 
                                  type="range" 
                                  min="10" 
                                  max="100" 
                                  value={quotaState.recruitmentCap} 
                                  onChange={(e) => handleQuotaChange("recruitmentCap", parseInt(e.target.value))}
                                  className="w-full accent-amber-500 h-1.5 bg-slate-950 rounded-lg cursor-pointer"
                                />
                                <p className="text-[10px] text-slate-500 font-light">Strict quota cap on newly accepted Green Hand recruits and privateer commissions.</p>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex items-center gap-4 pt-4 border-t border-slate-850">
                                <button
                                  onClick={syncQuotasToServer}
                                  disabled={quotaSyncing}
                                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-800 text-slate-950 font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
                                >
                                  {quotaSyncing ? (
                                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                                  ) : (
                                    <Sliders size={14} />
                                  )}
                                  Sync Quota Ledger
                                </button>
                                
                                <button
                                  onClick={loadQuotas}
                                  className="px-4 py-2.5 bg-slate-950 hover:bg-slate-850 text-slate-300 text-xs font-bold uppercase tracking-widest rounded-xl border border-slate-855 transition-all cursor-pointer"
                                >
                                  Reset Ledger
                                </button>
                              </div>

                              {quotaSuccess && (
                                <motion.div 
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="p-3 bg-emerald-950/40 border border-emerald-900/60 text-emerald-400 text-xs rounded-xl font-mono flex items-center gap-2"
                                >
                                  <CheckCircle size={14} /> Quotas updated and cryptographically signed on secure ledger.
                                </motion.div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right Column: High-Fidelity Gauges and Visual Meters */}
                      <div className="space-y-6">
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
                          <h3 className="text-sm font-bold font-mono text-slate-300 uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center gap-2">
                            <FileSpreadsheet size={16} className="text-red-500" /> Capacity Gauges
                          </h3>

                          <div className="space-y-6">
                            {/* Brass River Fleet Capacity */}
                            <div className="space-y-2">
                              <div className="flex justify-between items-center text-xs font-mono">
                                <span className="text-slate-400">Brass River Fleet (10 Active)</span>
                                <span className="text-slate-200 font-bold">{Math.round((10 / (quotaState.brassRiverLimit || 15)) * 100)}%</span>
                              </div>
                              <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-850 p-0.5">
                                <div 
                                  className="h-full bg-gradient-to-r from-amber-600 to-amber-500 rounded-full transition-all duration-500"
                                  style={{ width: `${Math.min(100, (10 / (quotaState.brassRiverLimit || 15)) * 100)}%` }}
                                />
                              </div>
                              <p className="text-[10px] text-slate-500 font-light">10 of {quotaState.brassRiverLimit} maximum officer berths filled.</p>
                            </div>

                            {/* Bonny Estuary Fleet Capacity */}
                            <div className="space-y-2">
                              <div className="flex justify-between items-center text-xs font-mono">
                                <span className="text-slate-400">Bonny Estuary Fleet (8 Active)</span>
                                <span className="text-slate-200 font-bold">{Math.round((8 / (quotaState.bonnyEstuaryLimit || 12)) * 100)}%</span>
                              </div>
                              <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-850 p-0.5">
                                <div 
                                  className="h-full bg-gradient-to-r from-blue-600 to-blue-500 rounded-full transition-all duration-500"
                                  style={{ width: `${Math.min(100, (8 / (quotaState.bonnyEstuaryLimit || 12)) * 100)}%` }}
                                />
                              </div>
                              <p className="text-[10px] text-slate-500 font-light">8 of {quotaState.bonnyEstuaryLimit} maximum officer berths filled.</p>
                            </div>

                            {/* Forcados Fleet Capacity */}
                            <div className="space-y-2">
                              <div className="flex justify-between items-center text-xs font-mono">
                                <span className="text-slate-400">Forcados Fleet (5 Active)</span>
                                <span className="text-slate-200 font-bold">{Math.round((5 / (quotaState.forcadosLimit || 10)) * 100)}%</span>
                              </div>
                              <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-850 p-0.5">
                                <div 
                                  className="h-full bg-gradient-to-r from-red-600 to-red-500 rounded-full transition-all duration-500"
                                  style={{ width: `${Math.min(100, (5 / (quotaState.forcadosLimit || 10)) * 100)}%` }}
                                />
                              </div>
                              <p className="text-[10px] text-slate-500 font-light">5 of {quotaState.forcadosLimit} maximum officer berths filled.</p>
                            </div>

                            {/* Monthly Dues Capital Quota */}
                            <div className="space-y-2">
                              <div className="flex justify-between items-center text-xs font-mono">
                                <span className="text-slate-400">Chapter Dues (1,230,000 NGN)</span>
                                <span className="text-emerald-400 font-bold">{Math.round((1230000 / (quotaState.monthlyDuesQuota || 1500000)) * 100)}%</span>
                              </div>
                              <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-850 p-0.5">
                                <div 
                                  className="h-full bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-full transition-all duration-500"
                                  style={{ width: `${Math.min(100, (1230000 / (quotaState.monthlyDuesQuota || 1500000)) * 100)}%` }}
                                />
                              </div>
                              <p className="text-[10px] text-slate-500 font-light">1,230,000 NGN collected of {quotaState.monthlyDuesQuota.toLocaleString()} NGN budget goal.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              )}

              {activeMenu === "overview" && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-8"
                >
                  {/* Grid row 1: Welcome & quick stats */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Welcome Banner */}
                    <div className="md:col-span-2 bg-gradient-to-br from-slate-900 to-slate-950 p-4 sm:p-6 md:p-8 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center gap-4 sm:gap-6 shadow-lg relative overflow-hidden min-w-0">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-red-950/10 rounded-full blur-2xl z-0 pointer-events-none"></div>
                      <div className="relative z-10 w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 flex items-center justify-center">
                        <PrivateersLogo size={75} />
                      </div>
                      <div className="relative z-10 space-y-2 sm:space-y-3 text-center sm:text-left flex-1 min-w-0 w-full">
                        <span className="text-[10px] font-mono font-bold tracking-wider text-amber-500 uppercase block">Quarterdeck Assembly Log</span>
                        <h2 className="font-serif text-lg sm:text-2xl text-slate-100 font-bold break-words leading-tight">Welcome Back, {session?.name}</h2>
                        <p className="text-xs text-slate-400 font-light leading-relaxed break-words">
                          Your commission as <strong className="text-slate-200 font-semibold">{session?.rank}</strong> is fully active under marquee <strong className="text-amber-500 font-mono font-bold">{session?.mqeNumber}</strong>. You have RSVP&apos;d to the upcoming Conclave.
                        </p>
                      </div>
                    </div>

                    {/* Member Quick Card render */}
                    <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-4 sm:p-6 border border-slate-800 rounded-2xl shadow-lg space-y-4 text-center flex flex-col justify-between min-w-0">
                      <div className="space-y-2 min-w-0">
                        <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest block">Digital Marque Credential</span>
                        <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-950 border border-amber-500/20 mx-auto">
                          <img src="https://picsum.photos/seed/admiral/150/150" alt="User portrait" className="object-cover w-full h-full" />
                        </div>
                        <h4 className="font-serif text-sm font-bold text-slate-200 break-words">{session?.name}</h4>
                        <p className="font-mono text-xs text-amber-500 font-bold">{session?.mqeNumber}</p>
                      </div>
                      <button 
                        onClick={() => setActiveTab("card")}
                        className="w-full py-2.5 bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold uppercase tracking-widest rounded-xl border border-slate-800 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Award size={12} className="text-amber-400" />
                        View Full Marque Card
                      </button>
                    </div>
                  </div>

                  {/* Grid row 2: Announcements, meeting links, ledger overview */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Announcements Board */}
                    <div className="lg:col-span-2 space-y-4">
                      <h3 className="font-serif text-lg font-bold text-slate-200 flex items-center gap-2">
                        <Bell size={18} className="text-amber-500" /> Pinned Board Notices
                      </h3>
                      <div className="space-y-4">
                        {forumPosts.filter(p => p.isAnnouncement).map(post => (
                          <div key={post.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-red-400">
                                <span>{post.category}</span>
                                <span>•</span>
                                <span>By: {post.authorName} ({post.authorRank})</span>
                              </div>
                              <span className="px-2 py-0.5 rounded bg-red-950 text-red-400 text-[9px] font-mono font-bold border border-red-900/40">★ PINNED</span>
                            </div>
                            <h4 className="font-serif text-lg font-bold text-slate-100">{post.title}</h4>
                            <p className="text-xs text-slate-400 font-light leading-relaxed">{post.content}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Conference Links & Quick Actions */}
                    <div className="space-y-6">
                      <h3 className="font-serif text-lg font-bold text-slate-200 flex items-center gap-2">
                        <ExternalLink size={18} className="text-red-500" /> Quick Quarterdeck Actions
                      </h3>
                      
                      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                        {/* Zoom meeting */}
                        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800/50 space-y-2">
                          <span className="text-[9px] font-mono font-bold text-blue-400 uppercase tracking-widest">Active Conclave Meeting Link</span>
                          <h4 className="font-serif text-sm font-bold text-slate-200">GND Conclave Hall (Zoom)</h4>
                          <a 
                            href="https://zoom.us/j/9876543210" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs text-amber-500 hover:text-amber-400 font-bold"
                          >
                            Launch Zoom Conclave <ExternalLink size={12} />
                          </a>
                        </div>

                        {/* Birthday Reminders */}
                        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800/50 space-y-2">
                          <span className="text-[9px] font-mono font-bold text-amber-500 uppercase tracking-widest">GND Birthday Anniversary Logs</span>
                          <p className="text-xs text-slate-300 font-light">No active seafarer birthdays logged today. Next is Captain Jack on June 9th.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeMenu === "compass" && (
                <motion.div
                  key="compass"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="flex flex-col gap-1 text-left">
                    <span className="text-[10px] font-mono font-bold text-amber-500 uppercase tracking-widest">
                      ★ Secret Portal Vault ★
                    </span>
                    <h2 className="text-xl font-bold text-white font-serif tracking-wide">
                      SAEAHAWKS⚓ Command Architecture
                    </h2>
                    <p className="text-xs text-slate-400 font-light leading-relaxed max-w-2xl">
                      This is the secure, secret Admiralty Compass representing the eight principal leadership offices (bearings) that govern our Sovereign Chapter.
                    </p>
                  </div>

                  <div className="bg-slate-950 border border-slate-900 rounded-3xl p-6 md:p-10 space-y-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-red-500/5 rounded-full blur-3xl pointer-events-none"></div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-4">
                      
                      {/* Interactive Compass Wheel Display (LHS) */}
                      <div className="lg:col-span-5 flex flex-col items-center justify-center">
                        
                        <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full border-2 border-slate-900 bg-slate-950 flex items-center justify-center p-4 shadow-inner">
                          
                          {/* Decorative outer circle ticks */}
                          <div className="absolute inset-2 rounded-full border border-slate-850/60 border-dashed pointer-events-none"></div>
                          
                          {/* Central compass core needle decoration */}
                          <div className="absolute w-8 h-8 rounded-full bg-slate-900 border border-amber-500/40 flex items-center justify-center z-10 pointer-events-none">
                            <div className="w-2 h-2 rounded-full bg-red-800 animate-pulse"></div>
                          </div>

                          {/* Direction Pointer Buttons */}
                          {/* NORTH */}
                          <button 
                            onClick={() => setSelectedCompassPoint("N")}
                            className={`absolute top-4 w-10 h-10 rounded-full font-bold font-mono text-xs flex items-center justify-center transition-all border ${
                              selectedCompassPoint === "N" 
                                ? "bg-amber-500 text-slate-950 border-amber-400 shadow-md scale-110" 
                                : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
                            }`}
                            style={{ transform: "translateY(0)" }}
                          >
                            N
                          </button>

                          {/* NORTH-EAST */}
                          <button 
                            onClick={() => setSelectedCompassPoint("NE")}
                            className={`absolute top-12 right-12 w-10 h-10 rounded-full font-bold font-mono text-xs flex items-center justify-center transition-all border ${
                              selectedCompassPoint === "NE" 
                                ? "bg-amber-500 text-slate-950 border-amber-400 shadow-md scale-110" 
                                : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
                            }`}
                          >
                            NE
                          </button>

                          {/* EAST */}
                          <button 
                            onClick={() => setSelectedCompassPoint("E")}
                            className={`absolute right-4 w-10 h-10 rounded-full font-bold font-mono text-xs flex items-center justify-center transition-all border ${
                              selectedCompassPoint === "E" 
                                ? "bg-amber-500 text-slate-950 border-amber-400 shadow-md scale-110" 
                                : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
                            }`}
                          >
                            E
                          </button>

                          {/* SOUTH-EAST */}
                          <button 
                            onClick={() => setSelectedCompassPoint("SE")}
                            className={`absolute bottom-12 right-12 w-10 h-10 rounded-full font-bold font-mono text-xs flex items-center justify-center transition-all border ${
                              selectedCompassPoint === "SE" 
                                ? "bg-amber-500 text-slate-950 border-amber-400 shadow-md scale-110" 
                                : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
                            }`}
                          >
                            SE
                          </button>

                          {/* SOUTH */}
                          <button 
                            onClick={() => setSelectedCompassPoint("S")}
                            className={`absolute bottom-4 w-10 h-10 rounded-full font-bold font-mono text-xs flex items-center justify-center transition-all border ${
                              selectedCompassPoint === "S" 
                                ? "bg-amber-500 text-slate-950 border-amber-400 shadow-md scale-110" 
                                : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
                            }`}
                          >
                            S
                          </button>

                          {/* SOUTH-WEST */}
                          <button 
                            onClick={() => setSelectedCompassPoint("SW")}
                            className={`absolute bottom-12 left-12 w-10 h-10 rounded-full font-bold font-mono text-xs flex items-center justify-center transition-all border ${
                              selectedCompassPoint === "SW" 
                                ? "bg-amber-500 text-slate-950 border-amber-400 shadow-md scale-110" 
                                : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
                            }`}
                          >
                            SW
                          </button>

                          {/* WEST */}
                          <button 
                            onClick={() => setSelectedCompassPoint("W")}
                            className={`absolute left-4 w-10 h-10 rounded-full font-bold font-mono text-xs flex items-center justify-center transition-all border ${
                              selectedCompassPoint === "W" 
                                ? "bg-amber-500 text-slate-950 border-amber-400 shadow-md scale-110" 
                                : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
                            }`}
                          >
                            W
                          </button>

                          {/* NORTH-WEST */}
                          <button 
                            onClick={() => setSelectedCompassPoint("NW")}
                            className={`absolute top-12 left-12 w-10 h-10 rounded-full font-bold font-mono text-xs flex items-center justify-center transition-all border ${
                              selectedCompassPoint === "NW" 
                                ? "bg-amber-500 text-slate-950 border-amber-400 shadow-md scale-110" 
                                : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
                            }`}
                          >
                            NW
                          </button>

                        </div>

                        <div className="mt-4 flex flex-wrap gap-2 justify-center max-w-xs">
                          {admiraltyCompassPoints.map((item) => (
                            <button
                              key={item.point}
                              onClick={() => setSelectedCompassPoint(item.point)}
                              className={`px-2 py-1 text-[9px] font-mono rounded border ${
                                selectedCompassPoint === item.point 
                                  ? "bg-amber-500/20 text-amber-400 border-amber-500/40 font-bold" 
                                  : "bg-slate-900 text-slate-500 border-slate-850 hover:text-slate-300"
                              }`}
                            >
                              {item.point} ({item.direction})
                            </button>
                          ))}
                        </div>

                      </div>

                      {/* Compass Point Details Card Panel (RHS) */}
                      <div className="lg:col-span-7 text-left">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={selectedCompassPoint}
                            initial={{ opacity: 0, x: 15 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -15 }}
                            transition={{ duration: 0.2 }}
                            className="bg-slate-900/40 p-5 md:p-6 rounded-2xl border border-amber-500/10 space-y-4"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                              <div className="space-y-0.5 text-left">
                                <span className="text-[10px] font-mono font-bold text-amber-500 uppercase tracking-widest block">
                                  Bearing: {currentCompassData.direction}
                                </span>
                                <h4 className="font-serif text-xl font-bold text-white">
                                  {currentCompassData.role}
                                </h4>
                              </div>
                              <span className="px-2.5 py-1 rounded bg-slate-950 text-slate-400 border border-slate-850 text-[10px] font-mono uppercase tracking-wider">
                                SEC: {currentCompassData.secondaryTitle}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-light">
                              <div className="space-y-1.5 bg-slate-950/40 p-3 rounded-lg border border-slate-850 text-left">
                                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-mono font-bold">Meaning</p>
                                <p className="text-white font-medium">{currentCompassData.meaning}</p>
                              </div>
                              <div className="space-y-1.5 bg-slate-950/40 p-3 rounded-lg border border-slate-850 text-left">
                                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-mono font-bold">Seafaring Equivalent</p>
                                <p className="text-white font-medium">{currentCompassData.historicalEquivalent}</p>
                              </div>
                              <div className="space-y-1.5 bg-slate-950/40 p-3 rounded-lg border border-slate-850 sm:col-span-2 text-left">
                                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-mono font-bold">Symbol & Ensign</p>
                                <p className="text-amber-500 font-mono font-medium">{currentCompassData.symbol}</p>
                              </div>
                            </div>

                            {currentCompassData.primaryDuty && (
                              <div className="space-y-1.5 bg-amber-950/10 p-3.5 rounded-lg border border-amber-500/10 text-left">
                                <p className="text-[10px] uppercase tracking-wider text-amber-500 font-mono font-bold">Primary Duty</p>
                                <p className="text-amber-100 font-medium font-serif text-xs leading-relaxed">{currentCompassData.primaryDuty}</p>
                              </div>
                            )}

                            <div className="space-y-2 text-left">
                              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-mono font-bold">Responsibilities & Duties</p>
                              <ul className="space-y-2 text-xs font-light text-slate-300">
                                {currentCompassData.responsibilities.map((r, idx) => (
                                  <li key={idx} className="flex items-start gap-2 leading-relaxed">
                                    <span className="text-amber-500 mt-1 flex-shrink-0">⚓</span>
                                    <p>{r}</p>
                                  </li>
                                ))}
                              </ul>
                            </div>

                          </motion.div>
                        </AnimatePresence>
                      </div>

                    </div>
                  </div>
                </motion.div>
              )}

              {activeMenu === "directory" && (
                <motion.div
                  key="directory"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h2 className="font-serif text-2xl font-bold text-slate-200">Vessel & Privateer Directory</h2>
                      <p className="text-xs text-slate-400 font-light">List of GND Chapter Privateers with verified marque commissions.</p>
                    </div>

                    {/* Role Overrides can trigger recruitment approval */}
                    {([MemberRank.ADMIRAL, MemberRank.CAPTAIN] as any[]).includes(currentRole) && (
                      <button 
                        onClick={() => {
                          const app = applications.find(a => a.approvalStatus === "Pending");
                          if (app) {
                            handleApplicationDecision(app.id, "Approved");
                            alert("Recruit Henry Morgan (MQE-0001092) has been approved and added as a Privateer.");
                          } else {
                            alert("No pending applications on Scribe Teach's ledger at the moment.");
                          }
                        }}
                        className="px-4 py-2 bg-gradient-to-r from-red-800 to-red-900 text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-md flex items-center gap-1.5"
                      >
                        <UserCheck size={14} /> Quick Approve Recruit App
                      </button>
                    )}
                  </div>

                  {/* Filters bar */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800">
                    <div className="relative w-full sm:flex-1">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input
                        type="text"
                        placeholder="Search members by Name, MQE #, Suite, Rank, Phone, Skills..."
                        value={directorySearch}
                        onChange={(e) => setDirectorySearch(e.target.value)}
                        className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-amber-500 text-white font-sans"
                      />
                      {directorySearch && (
                        <button
                          onClick={() => setDirectorySearch("")}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400 hover:text-amber-400 font-bold"
                          title="Clear search query"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                    
                    <select
                      value={directoryFleet}
                      onChange={(e) => setDirectoryFleet(e.target.value)}
                      className="w-full sm:w-56 bg-slate-950 border border-slate-800 text-xs font-bold text-slate-300 py-2.5 px-3 rounded-lg focus:outline-none focus:border-amber-500 cursor-pointer"
                    >
                      <option value="All">All Room Suites & Fleets</option>
                      <option value="Brass Suite">Brass Suite (Admiralty)</option>
                      <option value="Bonny Estuary Suite">Bonny Estuary Suite</option>
                      <option value="Forcados Suite">Forcados Suite</option>
                      <option value="Escravos Suite">Escravos Suite</option>
                      <option value="Akassa Suite">Akassa Suite</option>
                      <option value="Opobo Suite">Opobo Suite</option>
                      <option value="Nembe Suite">Nembe Suite</option>
                      <option value="Calabar Suite">Calabar Suite</option>
                    </select>
                  </div>

                  {/* Directory Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredMembers.map(member => (
                      <div key={member.id} className="bg-slate-900 rounded-xl p-5 border border-slate-800 space-y-4 flex flex-col justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-950 border border-amber-500/20">
                            <img src={member.profilePhoto} alt={member.name} className="object-cover w-full h-full" />
                          </div>
                          <div>
                            <h4 className="font-serif text-sm font-bold text-slate-200">{member.name}</h4>
                            <p className="text-[10px] font-mono text-amber-500 font-bold">{member.mqeNumber}</p>
                            <p className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">{member.rank} • {member.status}</p>
                          </div>
                        </div>

                        {/* Specs list */}
                        <div className="grid grid-cols-2 gap-x-2 gap-y-3 border-t border-slate-800 pt-4 text-[10px] font-mono">
                          <div>
                            <span className="text-slate-500 block uppercase">Room Suite:</span>
                            <span className="text-slate-300 font-bold truncate block">{member.suite || member.fleet}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block uppercase">Profession:</span>
                            <span className="text-slate-300 font-bold truncate block">{member.profession}</span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-slate-500 block uppercase">Special Skills:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {member.skills.map((s: string, idx: number) => (
                                <span key={idx} className="px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800/80">
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeMenu === "card" && (
                <motion.div
                  key="card"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-8 flex flex-col items-center"
                >
                  <div className="text-center space-y-1">
                    <h2 className="font-serif text-2xl font-bold text-slate-200">Sovereign Marque ID Commission Card</h2>
                    <p className="text-xs text-slate-400 font-light">Generate and export your official credentials verified on Scribe Teach&apos;s permanent scroll.</p>
                  </div>

                  {/* Redesigned Membership Card (Extremely clean, professional, mature) */}
                  <div 
                    id="digital-id-card"
                    className="relative w-full max-w-lg bg-[#fdfbf7] text-slate-900 p-6 rounded-2xl border-4 border-double border-red-800 shadow-2xl flex flex-col justify-between space-y-4 overflow-hidden"
                    style={{ minHeight: "360px" }}
                  >
                    {/* Diagonal seal overlay background */}
                    <div className="absolute right-0 bottom-0 opacity-[0.03] pointer-events-none translate-x-12 translate-y-12">
                      <PrivateersLogo size={280} />
                    </div>

                    {/* Card Header (Logo & Association Name) */}
                    <div className="flex items-center gap-3 border-b border-red-800/30 pb-3 relative z-10">
                      <PrivateersLogo size={40} />
                      <div className="flex flex-col text-left">
                        <span className="font-serif text-[11px] font-extrabold tracking-wider text-red-800 leading-tight">
                          NATIONAL ASSOCIATION OF PRIVATEERS
                        </span>
                        <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest font-bold">
                          Sovereign Great Niger Delta Fleet Branch
                        </span>
                      </div>
                    </div>

                    {/* Card Body (Photo & Credentials Fields) */}
                    <div className="grid grid-cols-12 gap-4 items-center relative z-10">
                      {/* Photo Area */}
                      <div className="col-span-4">
                        <div className="aspect-square rounded-xl overflow-hidden bg-slate-900 border-2 border-red-800 shadow-inner relative">
                          <img 
                            src={session?.profilePhoto || "https://picsum.photos/seed/admiral/150/150"} 
                            alt="User photo" 
                            className="object-cover w-full h-full" 
                            referrerPolicy="no-referrer" 
                          />
                        </div>
                      </div>

                      {/* Member Info Area */}
                      <div className="col-span-8 space-y-2 text-left text-xs">
                        <div>
                          <span className="text-[7px] font-mono text-slate-400 uppercase tracking-wider block">Commissioned Privateer (Legal Name):</span>
                          <span className="font-serif text-sm font-bold text-slate-900">{session?.name}</span>
                        </div>
                        
                        <div>
                          <span className="text-[7px] font-mono text-slate-400 uppercase tracking-wider block">Marque Number (ID Number):</span>
                          <span className="font-mono text-red-800 font-extrabold tracking-wide text-xs">{session?.mqeNumber}</span>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-[8px] font-mono text-slate-500">
                          <div className="col-span-1">
                            <span className="uppercase block text-[7px]">Sovereign Role (Rank):</span>
                            <span className="font-bold text-slate-900 text-[9px]">{session?.rank || "Unranked"}</span>
                          </div>
                          <div className="col-span-1">
                            <span className="uppercase block text-[7px]">Fleet Branch:</span>
                            <span className="font-bold text-slate-900 text-[9px]">GND CHAPTER</span>
                          </div>
                          <div className="col-span-1">
                            <span className="uppercase block text-[7px]">Commission:</span>
                            <span className="font-bold text-emerald-700 text-[9px]">{session?.status || "ACTIVE"}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Commission Dates & Emergency Info */}
                    <div className="border-t border-b border-red-800/10 py-2 space-y-1 text-left relative z-10 text-[8px] font-mono text-slate-500">
                      <div>
                        <span className="font-bold text-slate-400 uppercase">Commission Issuance & Expiry Dates:</span>
                        <span className="text-slate-800 block">ISSUED: 21 JULY 2026  |  EXPIRES: 21 JULY 2031</span>
                      </div>
                      <div>
                        <span className="font-bold text-slate-400 uppercase">Emergency Communications Audit Route:</span>
                        <span className="text-slate-800 block">GND Chapter Conclave: +234 (0) 803 000 0000 | registry@saeahawks.org</span>
                      </div>
                    </div>

                    {/* QR Code & Signatures Area */}
                    <div className="flex items-end justify-between pt-1 relative z-10 text-[8px] font-mono text-slate-400">
                      {/* Interactive Visual QR Mockup */}
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-12 bg-slate-950 p-1 rounded border border-slate-300 flex flex-col justify-between">
                          <div className="grid grid-cols-4 gap-0.5 h-full w-full">
                            <div className="bg-white rounded-[1px]"></div>
                            <div className="bg-white rounded-[1px]"></div>
                            <div className="bg-slate-950"></div>
                            <div className="bg-white rounded-[1px]"></div>
                            
                            <div className="bg-slate-950"></div>
                            <div className="bg-white rounded-[1px]"></div>
                            <div className="bg-white rounded-[1px]"></div>
                            <div className="bg-slate-950"></div>
                            
                            <div className="bg-white rounded-[1px]"></div>
                            <div className="bg-slate-950"></div>
                            <div className="bg-white rounded-[1px]"></div>
                            <div className="bg-white rounded-[1px]"></div>
                            
                            <div className="bg-white rounded-[1px]"></div>
                            <div className="bg-white rounded-[1px]"></div>
                            <div className="bg-slate-950"></div>
                            <div className="bg-white rounded-[1px]"></div>
                          </div>
                        </div>
                        <div className="text-left leading-tight text-[7px] text-slate-500">
                          <span className="font-bold block text-slate-700">VERIFIED COMMISSION</span>
                          <span>REGISTRY BLOCK #193</span>
                        </div>
                      </div>

                      {/* Simulated Double Signatures */}
                      <div className="flex gap-4">
                        <div className="text-right border-t border-slate-300/60 pt-1 w-24">
                          <span className="font-serif text-slate-800 font-bold italic block leading-none">David Chukwuyem</span>
                          <span className="text-[5px] uppercase tracking-wider text-slate-500">Chapter Commander</span>
                        </div>
                        <div className="text-right border-t border-slate-300/60 pt-1 w-24">
                          <span className="font-serif text-slate-800 font-bold italic block leading-none">Edward Teach</span>
                          <span className="text-[5px] uppercase tracking-wider text-slate-500">Chapter Scribe</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4 relative z-10">
                    <button 
                      onClick={() => window.print()}
                      className="px-5 py-3 bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white text-xs font-bold uppercase tracking-widest rounded-xl border border-slate-800 transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <Printer size={14} className="text-slate-400" />
                      Print Card Layout
                    </button>
                    <button 
                      onClick={handleDownloadIDCard}
                      className="px-5 py-3 bg-gradient-to-r from-red-800 to-red-900 text-white text-xs font-bold uppercase tracking-widest rounded-xl border border-red-700 shadow-md flex items-center gap-2 cursor-pointer"
                    >
                      <Download size={14} className="text-amber-400" />
                      Download HD ID Card (PNG)
                    </button>
                  </div>
                </motion.div>
              )}

              {activeMenu === "ledger" && (
                <motion.div
                  key="ledger"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-8"
                >
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h2 className="font-serif text-2xl font-bold text-slate-200">Quartermaster Ledger & Dues</h2>
                      <p className="text-xs text-slate-400 font-light">Sole, manual chapter treasury recording. All payments settled in hand to the Quartermaster.</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-center">
                        <span className="text-slate-500 text-[10px] block uppercase">Outstanding Debt:</span>
                        <span className="text-red-400 font-bold">{outstandingDues.toLocaleString()} NGN</span>
                      </div>
                      <div className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-center">
                        <span className="text-slate-500 text-[10px] block uppercase">Vanguard Treasury:</span>
                        <span className="text-emerald-400 font-bold">{totalDuesPaid.toLocaleString()} NGN</span>
                      </div>
                    </div>
                  </div>

                  {/* Add manual payment form for Quartermasters / Admins */}
                  {([MemberRank.QUARTERMASTER, MemberRank.ADMIRAL] as any[]).includes(currentRole) && (
                    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
                      <h3 className="font-serif text-sm font-bold text-amber-500 flex items-center gap-2">
                        <Plus size={16} /> Record Manual Physical Payment (Quartermaster Edict)
                      </h3>
                      <form onSubmit={handleAddPayment} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Target MQE Number</label>
                          <input
                            type="text"
                            required
                            placeholder="MQE-XXXXXXX"
                            value={newPayment.mqeNumber}
                            onChange={(e) => setNewPayment({ ...newPayment, mqeNumber: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-red-800 text-white font-mono"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Contribution Type</label>
                          <select
                            value={newPayment.type}
                            onChange={(e) => setNewPayment({ ...newPayment, type: e.target.value as any })}
                            className="w-full bg-slate-950 border border-slate-800 text-xs py-2 px-3 rounded-lg focus:outline-none focus:border-red-800 cursor-pointer"
                          >
                            {Object.values(ContributionType).map(t => (
                              <option key={t} value={t}>{t}</option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Dues Description</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Monthly Dues May"
                            value={newPayment.description}
                            onChange={(e) => setNewPayment({ ...newPayment, description: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-red-800 text-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Amount (NGN)</label>
                          <div className="relative">
                            <input
                              type="number"
                              required
                              placeholder="e.g. 15000"
                              value={newPayment.amount}
                              onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-red-800 text-white"
                            />
                            <button 
                              type="submit"
                              className="absolute right-1 top-1 px-3 py-1 bg-gradient-to-r from-red-800 to-red-900 text-white text-[10px] font-bold uppercase rounded hover:from-red-700 hover:to-red-800 shadow"
                            >
                              Log Payment
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Ledger logs */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs font-mono text-slate-300">
                        <thead>
                          <tr className="bg-slate-950 text-slate-400 text-[10px] uppercase border-b border-slate-800 text-left">
                            <th className="p-4">Commission Member</th>
                            <th className="p-4">Dues Type</th>
                            <th className="p-4">Description</th>
                            <th className="p-4">Amount</th>
                            <th className="p-4">Log Status</th>
                            <th className="p-4">Recorded By</th>
                            {([MemberRank.QUARTERMASTER, MemberRank.ADMIRAL] as any[]).includes(currentRole) && <th className="p-4 text-center">Quartermaster Actions</th>}
                          </tr>
                        </thead>
                        <tbody>
                          {contributions.map(contrib => (
                            <tr key={contrib.id} className="border-b border-slate-800/60 hover:bg-slate-950/20">
                              <td className="p-4">
                                <p className="font-bold text-slate-200">{contrib.memberName}</p>
                                <p className="text-[10px] text-slate-500">{contrib.mqeNumber}</p>
                              </td>
                              <td className="p-4 text-red-400 font-bold">{contrib.type}</td>
                              <td className="p-4 font-light">{contrib.description}</td>
                              <td className="p-4 font-bold text-slate-200">{contrib.amount.toLocaleString()} NGN</td>
                              <td className="p-4">
                                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold ${
                                  contrib.status === "PAID" 
                                    ? "bg-emerald-950/60 text-emerald-400 border border-emerald-900/40" 
                                    : "bg-red-950/60 text-red-400 border border-red-900/40"
                                }`}>
                                  {contrib.status}
                                </span>
                              </td>
                              <td className="p-4 text-slate-500">{contrib.recordedBy}</td>
                              {([MemberRank.QUARTERMASTER, MemberRank.ADMIRAL] as any[]).includes(currentRole) && (
                                <td className="p-4 text-center">
                                  <button
                                    onClick={() => handleTogglePaymentStatus(contrib.id, contrib.status)}
                                    className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 text-amber-500 font-bold border border-slate-800 rounded hover:scale-[1.02] transition-all"
                                  >
                                    Toggle Ledger
                                  </button>
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeMenu === "forum" && (
                <motion.div
                  key="forum"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  {/* Forum Tab Header & Switcher */}
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-900 pb-4">
                    <div className="space-y-1 text-left">
                      <span className="text-[10px] font-mono font-bold text-amber-500 uppercase tracking-widest block">
                        ⚓ COMMUNICATIONS CENTER
                      </span>
                      <h2 className="text-xl font-bold text-white font-serif tracking-wide">
                        Sovereign Forum & Direct Dispatches
                      </h2>
                      <p className="text-xs text-slate-400 font-light leading-relaxed">
                        Inscribe announcements, discuss guild bylaws, or chat in real-time across our eight active fleet mess-rooms.
                      </p>
                    </div>

                    <div className="flex p-1 bg-slate-950 border border-slate-900 rounded-xl">
                      <button
                        onClick={() => setForumTab("threads")}
                        className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                          forumTab === "threads"
                            ? "bg-red-800 text-white shadow-sm"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        Central Dispatches
                      </button>
                      <button
                        onClick={() => setForumTab("chats")}
                        className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center gap-1.5 ${
                          forumTab === "chats"
                            ? "bg-red-800 text-white shadow-sm"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        Fleet Mess (8 Chats)
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
                      </button>
                    </div>
                  </div>

                  {forumTab === "threads" ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* Pinned board / Posts column (Col span 2) */}
                      <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                          <h3 className="font-serif text-lg font-bold text-slate-200">Central Dispatches Thread</h3>
                          {/* Post count */}
                          <span className="text-xs font-mono text-slate-500">{forumPosts.length} Active dispatches</span>
                        </div>

                        {/* Search forum */}
                        <div className="relative">
                          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                          <input
                            type="text"
                            placeholder="Search threads, posts..."
                            value={forumSearch}
                            onChange={(e) => setForumSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-red-800 text-white"
                          />
                        </div>

                        {/* Posts list */}
                        <div className="space-y-6">
                          {forumPosts.filter(p => p.title.toLowerCase().includes(forumSearch.toLowerCase()) || p.content.toLowerCase().includes(forumSearch.toLowerCase())).map(post => (
                            <div key={post.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-md text-left">
                              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-red-400">
                                  <span>{post.category}</span>
                                  <span>•</span>
                                  <span>By: {post.authorName} ({post.authorRank})</span>
                                </div>
                                {post.isPinned && (
                                  <span className="px-2 py-0.5 rounded bg-red-950 text-red-400 text-[9px] font-mono font-bold border border-red-900/40">★ PINNED</span>
                                )}
                              </div>
                              
                              <div className="space-y-2">
                                <h4 className="font-serif text-lg font-bold text-slate-100">{post.title}</h4>
                                <p className="text-xs text-slate-400 font-light leading-relaxed">{post.content}</p>
                              </div>

                              {/* Post likes & Comment inputs */}
                              <div className="border-t border-slate-800/80 pt-4 flex items-center justify-between gap-4 text-xs font-mono text-slate-400">
                                <button 
                                  onClick={() => handleLikePost(post.id)}
                                  className="flex items-center gap-1.5 hover:text-white transition-colors"
                                >
                                  <ThumbsUp size={14} className={post.likes.includes(session?.mqeNumber) ? "text-amber-500 fill-amber-500/20" : ""} />
                                  {post.likes.length} Likes
                                </button>
                                <span>{post.comments.length} Comments</span>
                              </div>

                              {/* Comments lists */}
                              {post.comments.length > 0 && (
                                <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800/50">
                                  {post.comments.map((comment: any) => (
                                    <div key={comment.id} className="text-xs space-y-1">
                                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 font-bold">
                                        <span>{comment.authorName} ({comment.authorRank})</span>
                                        <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                                      </div>
                                      <p className="text-slate-300 font-light leading-relaxed pl-1.5 border-l border-red-800/50">{comment.content}</p>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Comment Form */}
                              <div className="flex gap-2 pt-2">
                                <input
                                  type="text"
                                  placeholder="Type Scribe comment..."
                                  value={newComment[post.id] || ""}
                                  onChange={(e) => setNewComment({ ...newComment, [post.id]: e.target.value })}
                                  className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-red-800 text-white"
                                />
                                <button
                                  onClick={() => handleAddComment(post.id)}
                                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                                >
                                  Comment
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Create post column (Col span 1) */}
                      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-md space-y-6 flex flex-col justify-between h-fit text-left">
                        <div className="space-y-2">
                          <h3 className="font-serif text-lg font-bold text-slate-200">Scribe New Thread</h3>
                          <p className="text-xs text-slate-400 font-light leading-relaxed">Publish announcements or general discussion topics for the Great Niger Delta Chapter Privateers.</p>
                        </div>

                        <form onSubmit={handleAddPost} className="space-y-4">
                          {/* Title */}
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider">Thread Title</label>
                            <input
                              type="text"
                              required
                              value={newPost.title}
                              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                              placeholder="e.g. Navigation logs ready"
                              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-red-800 text-white"
                            />
                          </div>

                          {/* Category */}
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider">Category</label>
                            <select
                              value={newPost.category}
                              onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                              className="w-full bg-slate-950 border border-slate-800 text-xs py-2.5 px-3 rounded-xl focus:outline-none focus:border-red-800 cursor-pointer text-slate-300"
                            >
                              <option value="Announcements">Announcements</option>
                              <option value="General">General</option>
                              <option value="Welfare">Welfare</option>
                              <option value="Expeditions">Expeditions</option>
                            </select>
                          </div>

                          {/* Content */}
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider">Thread Content</label>
                            <textarea
                              rows={6}
                              required
                              value={newPost.content}
                              onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                              placeholder="Type details..."
                              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-red-800 text-white"
                            ></textarea>
                          </div>

                          <button
                            type="submit"
                            className="w-full py-3 bg-gradient-to-r from-red-800 to-red-900 text-white text-xs font-bold uppercase tracking-widest rounded-xl border border-red-700 shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                          >
                            <Plus size={12} className="text-amber-400" />
                            Inscribe Thread
                          </button>
                        </form>
                      </div>
                    </div>
                  ) : (
                    /* The 8 Fleet Mess Chatrooms Panel */
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-slate-950 border border-slate-900 rounded-3xl overflow-hidden p-1 min-h-[500px]">
                      
                      {/* Left Sidebar: 8 Chat Rooms List */}
                      <div className="lg:col-span-4 border-r border-slate-900/60 p-4 space-y-4 max-h-[600px] overflow-y-auto">
                        <div className="pb-2 border-b border-slate-900/80 text-left">
                          <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
                            8 Fleet Channels
                          </h3>
                        </div>
                        <div className="space-y-2">
                          {chatRooms.map((room) => {
                            const isActive = activeChatId === room.id;
                            const lastMessage = room.messages[room.messages.length - 1];
                            return (
                              <button
                                key={room.id}
                                onClick={() => {
                                  setActiveChatId(room.id);
                                  // mark read
                                  const updated = chatRooms.map(r => r.id === room.id ? { ...r, unread: false } : r);
                                  setChatRooms(updated);
                                  localStorage.setItem("privateers_db_chats", JSON.stringify(updated));
                                }}
                                className={`w-full p-3.5 rounded-2xl border text-left transition-all flex flex-col gap-1.5 ${
                                  isActive
                                    ? "bg-slate-900 border-red-800/40 text-white shadow"
                                    : "bg-slate-950/40 border-slate-900 hover:bg-slate-900/50 text-slate-400"
                                }`}
                              >
                                <div className="flex items-center justify-between gap-1">
                                  <span className={`text-xs font-bold font-serif truncate ${isActive ? "text-amber-400" : "text-slate-200"}`}>
                                    {room.name}
                                  </span>
                                  {room.unread && (
                                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse flex-shrink-0"></span>
                                  )}
                                </div>
                                <p className="text-[10px] text-slate-500 font-light truncate">
                                  {room.description}
                                </p>
                                {lastMessage && (
                                  <div className="border-t border-slate-900/80 pt-1.5 mt-0.5 flex items-center justify-between text-[9px] text-slate-500 font-mono">
                                    <span className="truncate max-w-[120px]">
                                      <strong>{lastMessage.sender}</strong>: {lastMessage.text}
                                    </span>
                                    <span>{lastMessage.time}</span>
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Right Workspace: Active Message Scrollbox */}
                      <div className="lg:col-span-8 flex flex-col justify-between p-4 md:p-6 min-h-[450px]">
                        {(() => {
                          const activeRoom = chatRooms.find(r => r.id === activeChatId) || chatRooms[0];
                          if (!activeRoom) return null;
                          return (
                            <>
                              {/* Header */}
                              <div className="border-b border-slate-900 pb-3 flex items-center justify-between text-left">
                                <div className="space-y-0.5">
                                  <span className="text-[9px] font-mono font-bold text-amber-500 uppercase tracking-widest block">
                                    Active Fleet Dispatch Room
                                  </span>
                                  <h4 className="font-serif text-base font-bold text-white">
                                    {activeRoom.name}
                                  </h4>
                                  <p className="text-[10px] text-slate-400 font-light">
                                    {activeRoom.description}
                                  </p>
                                </div>
                                <span className="px-2 py-0.5 bg-slate-900 border border-slate-800 text-slate-500 rounded text-[9px] font-mono uppercase font-semibold">
                                  SECURE CHAT
                                </span>
                              </div>

                              {/* Message Pane */}
                              <div className="flex-1 overflow-y-auto py-4 space-y-4 max-h-[350px] min-h-[250px] pr-2 text-left">
                                {activeRoom.messages.length === 0 ? (
                                  <div className="h-full flex flex-col items-center justify-center text-center p-8">
                                    <span className="text-xl">⚓</span>
                                    <p className="text-xs text-slate-500 mt-1 font-light">No dispatches in this room yet. Inscribe the first word!</p>
                                  </div>
                                ) : (
                                  activeRoom.messages.map((msg: any, idx: number) => {
                                    const isSelf = msg.sender === (session?.name || "Admiral David Chukwuyem");
                                    return (
                                      <div
                                        key={idx}
                                        className={`flex flex-col max-w-[85%] ${
                                          isSelf ? "ml-auto items-end" : "mr-auto items-start"
                                        }`}
                                      >
                                        <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500 mb-1">
                                          <span className="font-bold text-slate-400">{msg.sender}</span>
                                          <span>•</span>
                                          <span className="text-slate-500">({msg.rank})</span>
                                        </div>
                                        <div
                                          className={`p-3 rounded-2xl text-xs leading-relaxed ${
                                            isSelf
                                              ? "bg-red-900 text-white rounded-tr-none border border-red-800/40"
                                              : "bg-slate-900 text-slate-200 rounded-tl-none border border-slate-850"
                                          }`}
                                        >
                                          {msg.text}
                                        </div>
                                        <span className="text-[9px] font-mono text-slate-600 mt-1">{msg.time}</span>
                                      </div>
                                    );
                                  })
                                )}
                              </div>

                              {/* Input Box */}
                              <form onSubmit={handleSendChatMessage} className="border-t border-slate-900 pt-4 flex gap-3">
                                <input
                                  type="text"
                                  required
                                  value={chatInput}
                                  onChange={(e) => setChatInput(e.target.value)}
                                  placeholder={`Dispatch message to ${activeRoom.name}...`}
                                  className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-red-800 text-white"
                                />
                                <button
                                  type="submit"
                                  className="px-5 py-2.5 bg-gradient-to-r from-red-800 to-red-900 text-white text-xs font-bold uppercase tracking-wider rounded-xl border border-red-700 hover:brightness-110 flex items-center gap-1.5 transition-all cursor-pointer"
                                >
                                  <span>Send</span>
                                  <Anchor size={12} className="text-amber-400" />
                                </button>
                              </form>
                            </>
                          );
                        })()}
                      </div>

                    </div>
                  )}
                </motion.div>
              )}

              {activeMenu === "election" && (
                <motion.div
                  key="election"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-8"
                >
                  <div className="space-y-1">
                    <h2 className="font-serif text-2xl font-bold text-slate-200">Sovereign Conclave Balloting</h2>
                    <p className="text-xs text-slate-400 font-light">Cast secret, secure ballots in chapter elections. Voter audit logs are public, but votes are strictly anonymous.</p>
                  </div>

                  {elections.map(el => (
                    <div key={el.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-md relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-80 h-80 bg-red-950/10 rounded-full blur-3xl z-0"></div>
                      
                      {/* Header */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4 relative z-10">
                        <div className="space-y-1">
                          <span className="px-2 py-0.5 rounded bg-red-950 text-red-400 text-[10px] font-mono font-bold uppercase tracking-wider border border-red-900/40">★ SECRET BALLOT ACTIVE</span>
                          <h3 className="font-serif text-xl font-bold text-slate-100">{el.title}</h3>
                        </div>
                        <div className="text-xs font-mono text-slate-400 text-right">
                          <p>BALLOTS LODGED: <span className="font-bold text-amber-500">{el.votedMqes.length}</span></p>
                          <p className="text-[10px]">CLOSES: July 26, 2026</p>
                        </div>
                      </div>

                      {/* Manifesto & Candidate List */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                        {el.type === "POLICY" ? (
                          <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 flex flex-col items-center justify-center space-y-6">
                            <h4 className="font-serif text-lg font-bold text-slate-200">Policy Edict</h4>
                            <div className="flex gap-4">
                              <button
                                disabled={el.votedMqes.includes(session?.mqeNumber)}
                                onClick={() => handleVoteSubmit(el.id, "AYE")}
                                className="px-6 py-3 bg-emerald-800 text-white font-bold uppercase tracking-wider rounded-xl border border-emerald-700 hover:bg-emerald-700 disabled:opacity-50"
                              >
                                AYE
                              </button>
                              <button
                                disabled={el.votedMqes.includes(session?.mqeNumber)}
                                onClick={() => handleVoteSubmit(el.id, "NAY")}
                                className="px-6 py-3 bg-red-800 text-white font-bold uppercase tracking-wider rounded-xl border border-red-700 hover:bg-red-700 disabled:opacity-50"
                              >
                                NAY
                              </button>
                            </div>
                            <div className="text-sm font-mono text-slate-500">
                              AYE: {el.ayeVotes || 0} | NAY: {el.nayVotes || 0}
                            </div>
                          </div>
                        ) : (
                          el.candidates.map((cand: any) => {
                            const hasVoted = el.votedMqes.includes(session?.mqeNumber);
                            return (
                              <div key={cand.mqeNumber} className="bg-slate-950 p-5 rounded-xl border border-slate-800 flex flex-col justify-between space-y-4">
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <h4 className="font-serif text-base font-bold text-slate-200">{cand.name}</h4>
                                    <span className="text-[9px] font-mono text-slate-400 uppercase">{cand.rank}</span>
                                  </div>
                                  <p className="text-xs text-slate-400 font-light leading-relaxed italic">
                                    &quot;{cand.campaignManifesto}&quot;
                                  </p>
                                </div>

                                <div className="pt-4 border-t border-slate-900/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                  <div className="text-xs font-mono">
                                    <span className="text-slate-500 block sm:inline">Live Audits: </span>
                                    <span className="font-bold text-emerald-400">{cand.votesCount} AYE</span>
                                    <span className="font-bold text-red-400 ml-2">{cand.nayVotesCount || 0} NAY</span>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <button
                                      disabled={hasVoted}
                                      onClick={() => handleVoteSubmit(el.id, "AYE", cand.mqeNumber)}
                                      className={`px-3 py-1.5 text-xs font-bold uppercase rounded-lg border transition-all cursor-pointer ${
                                        hasVoted
                                          ? "bg-slate-900 border-slate-800 text-slate-500"
                                          : "bg-emerald-800 border-emerald-700 hover:bg-emerald-700 text-white"
                                      }`}
                                    >
                                      AYE
                                    </button>
                                    <button
                                      disabled={hasVoted}
                                      onClick={() => handleVoteSubmit(el.id, "NAY", cand.mqeNumber)}
                                      className={`px-3 py-1.5 text-xs font-bold uppercase rounded-lg border transition-all cursor-pointer ${
                                        hasVoted
                                          ? "bg-slate-900 border-slate-800 text-slate-500"
                                          : "bg-red-800 border-red-700 hover:bg-red-700 text-white"
                                      }`}
                                    >
                                      NAY
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {activeMenu === "events" && (
                <motion.div
                  key="events"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-8"
                >
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h2 className="font-serif text-2xl font-bold text-slate-200">GND Conclave Assemblies & Attendance Check-In</h2>
                      <p className="text-xs text-slate-400 font-light">Physical and virtual meetings of the GND Chapter. Verify your attendance via secure QR-code scanning.</p>
                    </div>

                    <button 
                      onClick={handleStartScanner}
                      className="px-5 py-3 bg-gradient-to-r from-red-800 to-red-900 text-white text-xs font-bold uppercase tracking-widest rounded-xl border border-red-700 shadow-md flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                    >
                      <Camera size={14} className="text-amber-400" />
                      Scan Attendance QR Code
                    </button>
                  </div>

                  {/* QR SCANNER SIMULATOR MODAL */}
                  {showScanner && (
                    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
                      <div className="bg-slate-900 border border-slate-800 max-w-md w-full rounded-2xl p-6 text-center space-y-6 relative overflow-hidden shadow-2xl">
                        <button 
                          onClick={handleStopScanner}
                          className="absolute top-4 right-4 text-slate-400 hover:text-white"
                        >
                          <X size={20} />
                        </button>

                        <div className="space-y-1.5">
                          <h3 className="font-serif text-lg font-bold text-slate-100">Attendance QR Scanner</h3>
                          <p className="text-xs text-slate-400 font-light">Aim camera at your printable Marque QR code to check in.</p>
                        </div>

                        {/* Scanner Viewport */}
                        <div className="relative aspect-square w-full max-w-[280px] mx-auto bg-slate-950 rounded-xl overflow-hidden border-2 border-red-800">
                          {/* Device Video Stream */}
                          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover"></video>

                          {/* Pirate Overlay */}
                          <div className="absolute inset-0 border-4 border-slate-900/60 flex items-center justify-center">
                            {/* Scanning Skull Guideline */}
                            <div className="w-48 h-48 border-2 border-dashed border-red-600 rounded-full flex items-center justify-center opacity-60 animate-pulse">
                              <Anchor size={48} className="text-red-500" />
                            </div>
                            
                            {/* Scanning green line */}
                            <div className="absolute left-4 right-4 h-0.5 bg-red-500 shadow-[0_0_8px_#ef4444] animate-[bounce_3s_infinite]"></div>
                          </div>
                        </div>

                        {/* Scan status dockets */}
                        <div className="space-y-2">
                          {scanStatus === "scanning" && (
                            <p className="text-xs font-mono text-amber-500 flex items-center justify-center gap-1.5 animate-pulse">
                              <RefreshCw size={12} className="animate-spin" /> Aligning sonar targets... scanning...
                            </p>
                          )}
                          {scanStatus === "success" && (
                            <div className="space-y-2">
                              <p className="text-xs font-mono text-emerald-400 font-bold">✔ SUCCESS: Target acquired! checked-in: {scannedMqe}</p>
                              <button 
                                onClick={handleStopScanner}
                                className="px-4 py-2 bg-emerald-800 text-white font-bold text-xs uppercase rounded-lg border border-emerald-700"
                              >
                                Close Deck Scanner
                              </button>
                            </div>
                          )}
                          {scanStatus === "error" && (
                            <div className="space-y-2">
                              <p className="text-xs font-mono text-red-400">✕ CAMERA ERROR: Fallback triggered (using simulated sonar scans)...</p>
                              <button
                                onClick={() => {
                                  // Fallback simulation
                                  setScanStatus("scanning");
                                  setTimeout(() => {
                                    const randMqe = "MQE-0000244"; // Anne Bonny
                                    const freshEvents = events.map(e => {
                                      if (e.id === "evt_1" && !e.attendanceList.includes(randMqe)) {
                                        return { ...e, attendanceList: [...e.attendanceList, randMqe] };
                                      }
                                      return e;
                                    });
                                    setEvents(freshEvents);
                                    setScannedMqe(randMqe);
                                    setScanStatus("success");
                                    logSystemAction("CONCLAVE_CHECKIN_QR_MOCK", `Simulated QR attendance. Logged: Privateer Anne Bonny (MQE-0000244).`);
                                  }, 2000);
                                }}
                                className="px-4 py-2 bg-red-800 text-white font-bold text-xs uppercase rounded-lg border border-red-700"
                              >
                                Trigger Simulated Scan Check-in
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Events logs */}
                  {events.map(evt => (
                    <div key={evt.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-md relative overflow-hidden">
                      <div className="absolute -right-8 -bottom-8 text-slate-800 opacity-10">
                        <Calendar size={180} />
                      </div>

                      <div className="space-y-4 border-b border-slate-800 pb-4 relative z-10">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <span className="px-2.5 py-0.5 rounded bg-amber-950 text-amber-400 text-[10px] font-mono font-bold border border-amber-900/40 uppercase tracking-wider">
                            ★ Next Conclave Dispatch ★
                          </span>
                          <span className="text-xs font-mono text-slate-400">RSVP COUNT: {evt.rsvps.filter((r: any) => r.status === "YES").length} YES</span>
                        </div>
                        <h3 className="font-serif text-2xl text-slate-100 font-bold tracking-tight">{evt.title}</h3>
                        <p className="text-xs text-slate-400 font-light leading-relaxed max-w-2xl">{evt.description}</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 relative z-10">
                        {/* Left column: specs and link */}
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4 text-xs font-mono text-slate-400">
                            <div>
                              <span className="text-slate-500 block uppercase text-[10px]">Date & Time:</span>
                              <span className="text-slate-200 font-semibold">{evt.date} - {evt.time}</span>
                            </div>
                            <div>
                              <span className="text-slate-500 block uppercase text-[10px]">Physical Deck:</span>
                              <span className="text-slate-200 font-semibold">{evt.location}</span>
                            </div>
                          </div>

                          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800/80 space-y-2">
                            <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest font-bold">Scribe&apos;s Assemblies conference dial-in</span>
                            <p className="text-xs text-slate-400 font-light">Zoom details uploaded for virtual captains:</p>
                            <a 
                              href={evt.meetingLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-amber-500 hover:text-amber-400 font-bold"
                            >
                              Launch Zoom Conference Board <ExternalLink size={12} />
                            </a>
                          </div>
                        </div>

                        {/* Right column: Attendance sheet and logs */}
                        <div className="space-y-4">
                          <h4 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">Verified Check-in Crew ({evt.attendanceList.length})</h4>
                          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/60 max-h-36 overflow-y-auto space-y-2">
                            {evt.attendanceList.map((mqe: string) => {
                              const crew = members.find(m => m.mqeNumber === mqe);
                              return (
                                <div key={mqe} className="flex items-center justify-between text-xs font-mono">
                                  <span className="text-slate-300 font-bold">{crew?.name || "Privateer"}</span>
                                  <span className="text-slate-500 text-[10px]">{mqe}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {activeMenu === "documents" && (
                <motion.div
                  key="documents"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-8"
                >
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h2 className="font-serif text-2xl font-bold text-slate-200">GND Document Vault & Code Manuals</h2>
                      <p className="text-xs text-slate-400 font-light">Official manuscripts, bylaws, and conclave logs scribed onto our sovereign register.</p>
                    </div>

                    {/* Scribes/Admins upload */}
                    {([MemberRank.SCRIBE, MemberRank.ADMIRAL] as any[]).includes(currentRole) && (
                      <form onSubmit={handleUploadDoc} className="flex gap-2 items-center bg-slate-900 p-2 rounded-xl border border-slate-800">
                        <input
                          type="text"
                          required
                          placeholder="Doc Title"
                          value={newDoc.title}
                          onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
                          className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-red-800 text-white"
                        />
                        <select
                          value={newDoc.category}
                          onChange={(e) => setNewDoc({ ...newDoc, category: e.target.value as any })}
                          className="bg-slate-950 border border-slate-800 text-xs py-1.5 px-2.5 rounded-lg focus:outline-none focus:border-red-800 cursor-pointer"
                        >
                          <option value="Minutes">Minutes</option>
                          <option value="Constitution">Constitution</option>
                          <option value="Bylaws">Bylaws</option>
                          <option value="Manual">Manual</option>
                        </select>
                        <button
                          type="submit"
                          className="px-4 py-1.5 bg-gradient-to-r from-red-800 to-red-900 hover:from-red-700 hover:to-red-800 text-white text-xs font-bold uppercase rounded-lg border border-red-700 shadow-md flex items-center gap-1 transition-all"
                        >
                          Lodge
                        </button>
                      </form>
                    )}
                  </div>

                  {/* Document Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {documents.map(doc => (
                      <div key={doc.id} className="bg-slate-900 rounded-xl p-6 border border-slate-800 shadow-md space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                          <h3 className="font-serif text-base font-bold text-slate-200">{doc.title}</h3>
                          <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-300 font-bold uppercase">
                            {doc.category}
                          </span>
                        </div>

                        <div className="space-y-2">
                          <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">Manuscript Version History</span>
                          <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800/60 max-h-36 overflow-y-auto">
                            {doc.versionHistory.map((ver: any, idx: number) => (
                              <div key={idx} className="text-xs font-mono space-y-1">
                                <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold">
                                  <span className="text-amber-500">Version {ver.version}</span>
                                  <span>{new Date(ver.updatedAt).toLocaleDateString()}</span>
                                </div>
                                <p className="text-slate-300 font-light leading-relaxed">{ver.notes}</p>
                                <p className="text-[9px] text-slate-500">Scribed By: {ver.updatedBy}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="pt-2">
                          <button
                            onClick={() => alert("✓ Transferring document payload... Encrypted vault download started.")}
                            className="w-full py-2.5 bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold uppercase tracking-widest rounded-xl border border-slate-800 transition-all flex items-center justify-center gap-1.5"
                          >
                            <Download size={12} className="text-amber-400" /> Download Vault Document
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeMenu === "audit" && (
                <motion.div
                  key="audit"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="space-y-1">
                    <h2 className="font-serif text-2xl font-bold text-slate-200">Chapter Portal Audit Logs</h2>
                    <p className="text-xs text-slate-400 font-light">Sovereign, permanent logs representing every state action taken on the central GND ledger. Entries cannot be deleted or adjusted.</p>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs font-mono text-slate-300 text-left">
                        <thead>
                          <tr className="bg-slate-950 text-slate-400 text-[10px] uppercase border-b border-slate-800">
                            <th className="p-4">Timestamp</th>
                            <th className="p-4">Acting Officer</th>
                            <th className="p-4">Action Code</th>
                            <th className="p-4">Audit Details</th>
                          </tr>
                        </thead>
                        <tbody>
                          {auditLogs.map(log => (
                            <tr key={log.id} className="border-b border-slate-800/60 hover:bg-slate-950/20">
                              <td className="p-4 text-slate-500 whitespace-nowrap">{new Date(log.timestamp).toLocaleString()}</td>
                              <td className="p-4 whitespace-nowrap">
                                <p className="font-bold text-slate-200">{log.userName}</p>
                                <p className="text-[10px] text-amber-500 font-bold">{log.userMqe}</p>
                              </td>
                              <td className="p-4">
                                <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800/80 text-[10px] text-red-400 font-bold uppercase tracking-wider">
                                  {log.action}
                                </span>
                              </td>
                              <td className="p-4 font-light leading-relaxed max-w-md text-slate-300">{log.details}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeMenu === "admin" && (
                <motion.div
                  key="admin"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-8"
                >
                  {/* Title & Top Navigation bar */}
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-6">
                    <div className="space-y-1 text-center md:text-left">
                      <h2 className="font-serif text-3xl font-extrabold text-slate-100 tracking-wide flex items-center justify-center md:justify-start gap-2.5">
                        <Shield className="text-amber-500 animate-pulse" size={28} />
                        Sovereign Admin Console
                      </h2>
                      <p className="text-xs text-slate-400 font-light max-w-xl">
                        SAEAHAWKS⚓ Command bridge for Scribes, Captains, and Admirals to verify recruits, customize visual branding, and manage organizational archives.
                      </p>
                    </div>

                    {/* Sub Tab Switcher */}
                    <div className="flex flex-wrap bg-slate-900/80 p-1.5 rounded-xl border border-slate-800/80 gap-1">
                      {[
                        { id: "approvals", label: "Recruit Approvals" },
                        { id: "chapters", label: "Quarter Deck Chapters & Ports" },
                        { id: "site_editor", label: "Public Site Host & Structures" },
                        { id: "branding", label: "Branding & Logo" },
                        { id: "blog_manager", label: "Blog Chronicles Manager" },
                        { id: "member_id_editor", label: "Member ID & Rank Editor" },
                        { id: "elections_manager", label: "Elections Manager" },
                        { id: "leadership", label: "Leadership Council" },
                        { id: "documents", label: "Archival Library" },
                        { id: "database", label: "Clean Production Launch" }
                      ].map(sub => (
                        <button
                          key={sub.id}
                          onClick={() => setAdminSubTab(sub.id)}
                          className={`px-3.5 py-1.5 text-xs font-bold uppercase rounded-lg tracking-wider transition-all ${
                            adminSubTab === sub.id
                              ? "bg-red-800 text-white shadow"
                              : "text-slate-400 hover:text-white"
                          }`}
                        >
                          {sub.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 1. approvals content */}
                  {adminSubTab === "approvals" && (
                    <div className="space-y-6">
                      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-serif font-bold text-amber-500">Recruit Credentials Audit</h3>
                            <p className="text-xs text-slate-400 font-light">Verify background logs, National Identity Numbers (NIN), Voter IDs, and Passport Photos before commissioning.</p>
                          </div>
                          <span className="text-[10px] font-mono bg-red-950/40 text-red-400 font-bold border border-red-900/50 px-2.5 py-1 rounded">
                            Pending Reviews: {applications.filter(a => a.approvalStatus === "Pending").length}
                          </span>
                        </div>

                        {applications.filter(a => a.approvalStatus === "Pending").length === 0 ? (
                          <div className="p-12 text-center border border-dashed border-slate-800 rounded-xl space-y-3">
                            <CheckCircle size={36} className="mx-auto text-emerald-500" />
                            <p className="text-sm text-slate-300 font-light">All recruit applications have been successfully audited and cleared!</p>
                            <p className="text-[10px] font-mono text-slate-500">Scribe ledger status: STABLE</p>
                          </div>
                        ) : (
                          <div className="space-y-6">
                            {applications.filter(a => a.approvalStatus === "Pending").map((app) => {
                              const recruit = members.find(m => m.id === app.memberId) || {
                                name: "Unknown Pledge",
                                preferredName: "Recruit",
                                email: "unverified@pledge.org",
                                phone: "+234 000 0000",
                                state: "Unspecified",
                                nin: "Unfiled",
                                voterId: "Unfiled",
                                refereeMqe: "None",
                                dob: "Unspecified",
                                gender: "Unspecified",
                                profilePhoto: "https://picsum.photos/seed/recruit/150/150"
                              };

                              return (
                                <div key={app.id} className="p-6 bg-slate-950 border border-slate-800 rounded-xl grid grid-cols-1 md:grid-cols-4 gap-6 items-start hover:border-slate-700 transition-colors">
                                  {/* Left: Passport photo */}
                                  <div className="flex flex-col items-center space-y-3 text-center">
                                    <div className="w-32 h-32 rounded-xl bg-slate-900 border-2 border-amber-500/40 overflow-hidden relative group">
                                      <img src={recruit.profilePhoto} alt="Passport photo" className="object-cover w-full h-full" referrerPolicy="no-referrer" />
                                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 text-[9px] font-mono text-amber-500 text-center">
                                        PASSPORT VERIFICATION
                                      </div>
                                    </div>
                                    <div>
                                      <p className="text-xs font-bold text-slate-200">{recruit.name}</p>
                                      <p className="text-[9px] font-mono text-slate-500">{recruit.email}</p>
                                    </div>
                                  </div>

                                  {/* Mid: Identity Credentials */}
                                  <div className="md:col-span-2 grid grid-cols-2 gap-4 text-xs font-mono">
                                    <div className="p-3 bg-slate-900 rounded-lg space-y-1">
                                      <span className="text-[9px] text-slate-500 uppercase font-bold">National ID (NIN)</span>
                                      <p className="font-bold text-amber-500 tracking-wider text-sm">{recruit.nin || "NOT FILED"}</p>
                                    </div>
                                    <div className="p-3 bg-slate-900 rounded-lg space-y-1">
                                      <span className="text-[9px] text-slate-500 uppercase font-bold">Voter Card ID</span>
                                      <p className="font-bold text-amber-500 tracking-wider text-sm">{recruit.voterId || "NOT FILED"}</p>
                                    </div>
                                    <div className="p-3 bg-slate-900 rounded-lg space-y-1">
                                      <span className="text-[9px] text-slate-500 uppercase font-bold">State of Origin</span>
                                      <p className="font-bold text-slate-200">{recruit.state || "Not Specified"}</p>
                                    </div>
                                    <div className="p-3 bg-slate-900 rounded-lg space-y-1">
                                      <span className="text-[9px] text-slate-500 uppercase font-bold">Referee MQE</span>
                                      <p className="font-bold text-emerald-400">{recruit.refereeMqe || "NONE FILLED"}</p>
                                    </div>
                                    <div className="p-3 bg-slate-900 rounded-lg space-y-1">
                                      <span className="text-[9px] text-slate-500 uppercase font-bold">Pledge Date</span>
                                      <p className="font-bold text-slate-400">{new Date(app.approvalHistory?.[0]?.updatedAt || getTimestampIso()).toLocaleDateString()}</p>
                                    </div>
                                    <div className="p-3 bg-slate-900 rounded-lg space-y-1">
                                      <span className="text-[9px] text-slate-500 uppercase font-bold">Scribe Audit Node</span>
                                      <p className="font-bold text-red-400 uppercase tracking-tight">WAITING COMMAND</p>
                                    </div>
                                  </div>

                                  {/* Right: Actions */}
                                  <div className="flex flex-col justify-center h-full space-y-3">
                                    <button
                                      onClick={() => handleApproveApplication(app.id, recruit.id, recruit.name)}
                                      className="w-full py-2.5 bg-gradient-to-r from-emerald-800 to-emerald-900 hover:from-emerald-700 hover:to-emerald-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl border border-emerald-700 shadow flex items-center justify-center gap-1.5 transition-all"
                                    >
                                      <CheckCircle size={14} /> Approve & Commission
                                    </button>
                                    <button
                                      onClick={() => handleRejectApplication(app.id, recruit.id, recruit.name)}
                                      className="w-full py-2.5 bg-gradient-to-r from-red-950/40 to-red-900/20 hover:from-red-900/40 text-red-400 hover:text-red-300 text-xs font-bold uppercase tracking-wider rounded-xl border border-red-900/40 flex items-center justify-center gap-1.5 transition-all"
                                    >
                                      <X size={14} /> Reject Application
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 2. logo content */}
                  {adminSubTab === "logo" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Logo Customizer */}
                      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
                        <div className="space-y-1">
                          <h3 className="text-lg font-serif font-bold text-slate-200">Site Logo Upload</h3>
                          <p className="text-xs text-slate-400 font-light">Change the global site-wide logo branding appearing on pages, sidebars, and headers.</p>
                        </div>

                        <div className="p-6 bg-slate-950 border border-dashed border-slate-800 rounded-xl text-center space-y-4">
                          <div className="w-24 h-24 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center mx-auto shadow-md">
                            <PrivateersLogo size={70} />
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs text-slate-300 font-medium">Select a PNG, JPG, or SVG image</p>
                            <p className="text-[10px] text-slate-500 font-mono">Will be compiled into secure storage bytes</p>
                          </div>
                          
                          <div className="flex items-center justify-center">
                            <label className="px-5 py-2.5 bg-red-800 hover:bg-red-700 text-white text-xs font-bold uppercase rounded-xl border border-red-700 shadow-md cursor-pointer transition-all flex items-center gap-1.5">
                              <Download className="rotate-180" size={14} /> Browse Image File
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleLogoUpload}
                                className="hidden"
                              />
                            </label>
                          </div>
                        </div>

                        {siteLogo && (
                          <div className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-xl">
                            <div className="flex items-center gap-3">
                              <img src={siteLogo} alt="Custom branding" className="w-12 h-12 object-contain bg-slate-900 p-1.5 rounded-lg border border-slate-800" referrerPolicy="no-referrer" />
                              <div>
                                <p className="text-xs font-bold text-slate-300">Active Custom Logo</p>
                                <p className="text-[10px] text-slate-500 font-mono">Saved in local sovereign state</p>
                              </div>
                            </div>
                            <button
                              onClick={handleResetLogo}
                              className="p-2 bg-slate-900 hover:bg-slate-800 rounded-lg text-red-400 border border-slate-800/85 hover:text-red-300 transition-colors"
                              title="Reset to default vector logo"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Admin Profile photo upload & MQE Randomizer */}
                      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
                        <div className="space-y-1">
                          <h3 className="text-lg font-serif font-bold text-slate-200">Admin Profile Customizer</h3>
                          <p className="text-xs text-slate-400 font-light">Directly edit your own profile portrait photo and generate random Marque MQE identifiers.</p>
                        </div>

                        <div className="space-y-5">
                          {/* Profile Photo */}
                          <div className="flex items-center gap-4 p-4 bg-slate-950 border border-slate-800 rounded-xl">
                            <div className="w-16 h-16 rounded-full bg-slate-900 border-2 border-amber-500 overflow-hidden">
                              <img src={session?.profilePhoto || "https://picsum.photos/seed/admiral/200/200"} alt="Admin profile" className="object-cover w-full h-full" referrerPolicy="no-referrer" />
                            </div>
                            <div className="flex-1 space-y-2">
                              <div>
                                <p className="text-xs font-bold text-slate-300">Acting Officer Portrait</p>
                                <p className="text-[10px] text-slate-500 font-mono">Supports passport-style uploads</p>
                              </div>
                              <label className="inline-block px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 text-[10px] font-bold uppercase rounded border border-slate-800 cursor-pointer transition-all">
                                Upload Photo
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleAdminPhotoUpload}
                                  className="hidden"
                                />
                              </label>
                            </div>
                          </div>

                          {/* MQE Number Randomizer */}
                          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-xs font-bold text-slate-300">Marque Identifier (MQE)</p>
                                <p className="text-[10px] text-slate-500 font-mono font-bold text-amber-500">{session?.mqeNumber}</p>
                              </div>
                              <button
                                onClick={handleRandomizeMqe}
                                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-amber-500 text-[10px] font-bold uppercase rounded flex items-center gap-1.5 transition-all"
                              >
                                <RefreshCw size={10} className="animate-spin-slow" /> Randomize MQE
                              </button>
                            </div>
                            <p className="text-[10px] text-slate-400 font-light leading-relaxed">
                              Required by the Grand Admiral command: allows administrators to test random commissions or modify their active security log signature seamlessly.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 3. leadership content */}
                  {adminSubTab === "leadership" && (
                    <div className="space-y-8">
                      {/* Form and list in side-by-side or stacked grids */}
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* CRUD Form */}
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 h-fit">
                          <div>
                            <h3 className="text-lg font-serif font-bold text-amber-500">
                              {leaderForm.id ? "Edit Council Officer" : "Lodge Council Officer"}
                            </h3>
                            <p className="text-xs text-slate-400 font-light">Add or modify the historical roll of honor, commanders, and alumni legends.</p>
                          </div>

                          <form onSubmit={handleSaveLeader} className="space-y-4">
                            <div className="space-y-1.5">
                              <label className="text-[9px] font-bold font-mono text-slate-400 uppercase tracking-wider">Full Name</label>
                              <input
                                type="text"
                                required
                                value={leaderForm.name}
                                onChange={(e) => setLeaderForm({ ...leaderForm, name: e.target.value })}
                                placeholder="e.g. Captain Anne Bonny"
                                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-red-800 text-white"
                              />
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-[9px] font-bold font-mono text-slate-400 uppercase tracking-wider">Sovereign Role / Title</label>
                              <input
                                type="text"
                                required
                                value={leaderForm.role}
                                onChange={(e) => setLeaderForm({ ...leaderForm, role: e.target.value })}
                                placeholder="e.g. Master of Arms"
                                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-red-800 text-white"
                              />
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-[9px] font-bold font-mono text-slate-400 uppercase tracking-wider">Council Category</label>
                              <select
                                value={leaderForm.type}
                                onChange={(e) => setLeaderForm({ ...leaderForm, type: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-800 text-xs py-2 px-3 rounded-lg focus:outline-none focus:border-red-800 cursor-pointer"
                              >
                                <option value="Active">Active Officer / Commander</option>
                                <option value="Former">Former Member / Fraternity Legend</option>
                              </select>
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-[9px] font-bold font-mono text-slate-400 uppercase tracking-wider">Portrait Image</label>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={leaderForm.photo}
                                  onChange={(e) => setLeaderForm({ ...leaderForm, photo: e.target.value })}
                                  placeholder="Image URL or Base64 data"
                                  className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-red-800 text-white"
                                />
                                <label className="px-3 bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg flex items-center justify-center cursor-pointer text-xs">
                                  Select
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (!file) return;
                                      const reader = new FileReader();
                                      reader.onload = (ev) => {
                                        setLeaderForm({ ...leaderForm, photo: ev.target?.result as string });
                                      };
                                      reader.readAsDataURL(file);
                                    }}
                                  />
                                </label>
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-[9px] font-bold font-mono text-slate-400 uppercase tracking-wider">Service Biography</label>
                              <textarea
                                value={leaderForm.biography}
                                onChange={(e) => setLeaderForm({ ...leaderForm, biography: e.target.value })}
                                placeholder="Chronicles of active maritime command, welfare cargo management, or historical fraternal contributions..."
                                rows={3}
                                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-red-800 text-white leading-relaxed resize-none"
                              />
                            </div>

                            <div className="flex gap-2 pt-2">
                              <button
                                type="submit"
                                className="flex-1 py-2 bg-red-800 hover:bg-red-700 text-white text-xs font-bold uppercase rounded-lg border border-red-700 transition-colors shadow-md"
                              >
                                {leaderForm.id ? "Apply Modifications" : "Lodge Officer"}
                              </button>
                              {leaderForm.id && (
                                <button
                                  type="button"
                                  onClick={() => setLeaderForm({ id: "", name: "", role: "", type: "Active", biography: "", photo: "" })}
                                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold uppercase rounded-lg border border-slate-700 transition-colors"
                                >
                                  Cancel
                                </button>
                              )}
                            </div>
                          </form>
                        </div>

                        {/* Roll list */}
                        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                          <h3 className="text-lg font-serif font-bold text-slate-200">Sovereign Roll of Honor list</h3>

                          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                            {leadership.map(leader => (
                              <div key={leader.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 rounded-full overflow-hidden border border-amber-500/30">
                                    <img src={leader.photo || "https://picsum.photos/seed/leader/100/100"} alt={leader.name} className="object-cover w-full h-full" referrerPolicy="no-referrer" />
                                  </div>
                                  <div>
                                    <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                                      {leader.name}
                                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${
                                        leader.type === "Active"
                                          ? "bg-emerald-950 text-emerald-400 border border-emerald-900/50"
                                          : "bg-blue-950 text-blue-400 border border-blue-900/50"
                                      }`}>
                                        {leader.type === "Active" ? "Active" : "Alumni Legend"}
                                      </span>
                                    </h4>
                                    <p className="text-[10px] font-mono text-amber-500 font-bold">{leader.role}</p>
                                    <p className="text-[10px] text-slate-400 line-clamp-1 font-light max-w-md">{leader.biography}</p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => handleEditLeader(leader)}
                                    className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded text-[10px] font-bold uppercase text-slate-300 hover:text-white transition-colors"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDeleteLeader(leader.id, leader.name)}
                                    className="p-1.5 bg-slate-900 hover:bg-red-950 hover:border-red-900 rounded text-red-400 hover:text-red-300 border border-slate-800 transition-colors"
                                    title="Strike from Roll"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 4. documents content */}
                  {adminSubTab === "documents" && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* Lodge Form */}
                      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 h-fit">
                        <div>
                          <h3 className="text-lg font-serif font-bold text-amber-500">Lodge Official Document</h3>
                          <p className="text-xs text-slate-400 font-light">Lodge a new constitution draft, code manuals, bylaws, or regional council conclave minutes.</p>
                        </div>

                        <form onSubmit={handleAdminUploadDoc} className="space-y-4">
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-bold font-mono text-slate-400 uppercase tracking-wider">Document Title</label>
                            <input
                              type="text"
                              required
                              value={adminDocForm.title}
                              onChange={(e) => setAdminDocForm({ ...adminDocForm, title: e.target.value })}
                              placeholder="e.g. GND Welfare Bylaws v3.2"
                              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-red-800 text-white"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[9px] font-bold font-mono text-slate-400 uppercase tracking-wider">Library Category</label>
                            <select
                              value={adminDocForm.category}
                              onChange={(e) => setAdminDocForm({ ...adminDocForm, category: e.target.value })}
                              className="w-full bg-slate-950 border border-slate-800 text-xs py-2 px-3 rounded-lg focus:outline-none focus:border-red-800 cursor-pointer"
                            >
                              <option value="Constitution">Sovereign Constitution</option>
                              <option value="Bylaws">Fleet Bylaws / Welfare Rules</option>
                              <option value="Manual">Manual / Code of Conduct</option>
                              <option value="Minutes">Conclave Conclave Minutes</option>
                            </select>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[9px] font-bold font-mono text-slate-400 uppercase tracking-wider">Select PDF/Doc File</label>
                            <div className="p-4 bg-slate-950 border border-dashed border-slate-800 rounded-xl text-center space-y-3">
                              <FileText className="mx-auto text-slate-500" size={24} />
                              {adminDocForm.fileContent ? (
                                <div>
                                  <p className="text-[10px] font-mono text-emerald-400">✓ Document Loaded Successfully</p>
                                  <p className="text-[9px] text-slate-500">Encoded into safe state bytes</p>
                                </div>
                              ) : (
                                <p className="text-[9px] text-slate-500">Supports PDF, DOC, or TXT archives</p>
                              )}
                              <label className="inline-block px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 text-[10px] font-bold uppercase rounded border border-slate-800 cursor-pointer transition-all">
                                {adminDocForm.fileContent ? "Replace File" : "Select File"}
                                <input
                                  type="file"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    const reader = new FileReader();
                                    reader.onload = (ev) => {
                                      setAdminDocForm({ ...adminDocForm, fileContent: ev.target?.result as string });
                                    };
                                    reader.readAsDataURL(file);
                                  }}
                                />
                              </label>
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[9px] font-bold font-mono text-slate-400 uppercase tracking-wider">Scribe Lodgement Notes</label>
                            <textarea
                              value={adminDocForm.notes}
                              onChange={(e) => setAdminDocForm({ ...adminDocForm, notes: e.target.value })}
                              placeholder="Describe the revision context, council voting status, or command reference..."
                              rows={3}
                              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-red-800 text-white leading-relaxed resize-none"
                            />
                          </div>

                          <button
                            type="submit"
                            className="w-full py-2 bg-gradient-to-r from-red-800 to-red-900 hover:from-red-700 hover:to-red-800 text-white text-xs font-bold uppercase rounded-lg border border-red-700 transition-all shadow-md flex items-center justify-center gap-1.5"
                          >
                            <Download size={12} className="rotate-180" /> Seal & Lodge Manuscript
                          </button>
                        </form>
                      </div>

                      {/* Document Library list */}
                      <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                        <h3 className="text-lg font-serif font-bold text-slate-200">Official Archival Manuscripts</h3>

                        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                          {documents.map(doc => (
                            <div key={doc.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-center text-amber-500">
                                    <FileText size={18} />
                                  </div>
                                  <div>
                                    <h4 className="text-xs font-bold text-slate-200">{doc.title}</h4>
                                    <p className="text-[10px] font-mono text-slate-500 uppercase">{doc.category} • LODGED: {new Date(doc.uploadedAt).toLocaleDateString()}</p>
                                  </div>
                                </div>

                                <span className="text-[10px] font-mono font-bold bg-amber-950/40 text-amber-500 border border-amber-900/50 px-2 py-0.5 rounded">
                                  v{doc.versionHistory?.[0]?.version || "1.0"}
                                </span>
                              </div>

                              <div className="p-3 bg-slate-900/50 rounded-lg text-[10px] font-mono text-slate-400 border border-slate-800/40">
                                <span className="text-slate-500 block text-[9px] font-bold uppercase">Archive Ledger Note:</span>
                                {doc.versionHistory?.[0]?.notes || "No notes filed."}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Public Site Editor content */}
                  {adminSubTab === "site_editor" && (
                    <div className="space-y-8">
                      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 text-left">
                        <div>
                          <h3 className="text-lg font-serif font-bold text-amber-500">Public Interface Editor</h3>
                          <p className="text-xs text-slate-400 font-light">
                            Modify real-time branding values, taglines, missions, and upload photos of leaders, events, or missions dynamically.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                          {/* Brand details */}
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-bold font-mono text-slate-400 uppercase tracking-wider">Brand Name</label>
                            <input
                              type="text"
                              value={siteConfig.brandName}
                              onChange={(e) => setSiteConfig({ ...siteConfig, brandName: e.target.value })}
                              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-red-800 text-white"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[9px] font-bold font-mono text-slate-400 uppercase tracking-wider">Tagline</label>
                            <input
                              type="text"
                              value={siteConfig.tagline}
                              onChange={(e) => setSiteConfig({ ...siteConfig, tagline: e.target.value })}
                              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-red-800 text-white"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[9px] font-bold font-mono text-slate-400 uppercase tracking-wider">Motto</label>
                            <input
                              type="text"
                              value={siteConfig.motto}
                              onChange={(e) => setSiteConfig({ ...siteConfig, motto: e.target.value })}
                              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-red-800 text-white"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[9px] font-bold font-mono text-slate-400 uppercase tracking-wider">Core Philosophy</label>
                            <input
                              type="text"
                              value={siteConfig.corePhilosophy}
                              onChange={(e) => setSiteConfig({ ...siteConfig, corePhilosophy: e.target.value })}
                              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-red-800 text-white"
                            />
                          </div>

                          <div className="col-span-1 md:col-span-2 space-y-1.5">
                            <label className="text-[9px] font-bold font-mono text-slate-400 uppercase tracking-wider">About Text Summary</label>
                            <textarea
                              rows={2}
                              value={siteConfig.aboutText}
                              onChange={(e) => setSiteConfig({ ...siteConfig, aboutText: e.target.value })}
                              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-red-800 text-white leading-relaxed"
                            />
                          </div>

                          <div className="col-span-1 md:col-span-2 space-y-1.5">
                            <label className="text-[9px] font-bold font-mono text-slate-400 uppercase tracking-wider">About Detailed Text</label>
                            <textarea
                              rows={3}
                              value={siteConfig.aboutDetailed}
                              onChange={(e) => setSiteConfig({ ...siteConfig, aboutDetailed: e.target.value })}
                              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-red-800 text-white leading-relaxed"
                            />
                          </div>

                          <div className="col-span-1 md:col-span-2 space-y-1.5">
                            <label className="text-[9px] font-bold font-mono text-slate-400 uppercase tracking-wider">Vision Statement</label>
                            <textarea
                              rows={2}
                              value={siteConfig.vision}
                              onChange={(e) => setSiteConfig({ ...siteConfig, vision: e.target.value })}
                              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-red-800 text-white leading-relaxed"
                            />
                          </div>
                        </div>

                        {/* Interactive Missions List */}
                        <div className="border-t border-slate-800/80 pt-6 space-y-4">
                          <div className="space-y-1">
                            <h4 className="text-sm font-bold font-serif text-slate-200">Missions List</h4>
                            <p className="text-[10px] text-slate-500 font-light">Define the core objectives listed under the Vision & Mission sliding board tab.</p>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {siteConfig.missions.map((mission: string, index: number) => (
                              <div key={index} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between gap-3 text-xs text-slate-350">
                                <span className="font-mono text-amber-500 font-bold">0{index+1}.</span>
                                <p className="flex-1 text-left">{mission}</p>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const filtered = siteConfig.missions.filter((_: any, i: number) => i !== index);
                                    setSiteConfig({ ...siteConfig, missions: filtered });
                                  }}
                                  className="text-slate-500 hover:text-red-500 cursor-pointer text-xs font-bold"
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                          </div>

                          <div className="flex gap-2 max-w-md pt-2">
                            <input
                              type="text"
                              value={newMissionText}
                              onChange={(e) => setNewMissionText(e.target.value)}
                              placeholder="e.g. Expand merchant network across coastal states."
                              className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-red-800 text-white"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                if (!newMissionText.trim()) return;
                                setSiteConfig({ ...siteConfig, missions: [...siteConfig.missions, newMissionText.trim()] });
                                setNewMissionText("");
                              }}
                              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold uppercase rounded-lg border border-slate-700 cursor-pointer"
                            >
                              Add
                            </button>
                          </div>
                        </div>

                        {/* Upload Photos Section */}
                        <div className="border-t border-slate-800/80 pt-6 space-y-4">
                          <div className="space-y-1">
                            <h4 className="text-sm font-bold font-serif text-slate-200">Upload & Update Public Photos</h4>
                            <p className="text-[10px] text-slate-500 font-light">
                              Change photos of events, leaders, or mission slides dynamically via file select or drag and drop.
                            </p>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                            {/* Mission Photo */}
                            <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-3 flex flex-col justify-between">
                              <div className="space-y-1">
                                <h5 className="text-xs font-bold text-slate-300">Mission Banner</h5>
                                <p className="text-[9px] text-slate-500">Appears on mission section sliders.</p>
                              </div>
                              <div className="h-28 w-full rounded bg-slate-900 border border-slate-850 overflow-hidden relative">
                                <img src={siteConfig.missionPhoto} alt="Mission" className="w-full h-full object-cover" />
                              </div>
                              <label className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 text-[10px] font-bold uppercase rounded border border-slate-850 cursor-pointer text-center block">
                                Change Photo
                                <input
                                  type="file"
                                  className="hidden"
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    const reader = new FileReader();
                                    reader.onload = (ev) => {
                                      setSiteConfig({ ...siteConfig, missionPhoto: ev.target?.result as string });
                                    };
                                    reader.readAsDataURL(file);
                                  }}
                                />
                              </label>
                            </div>

                            {/* Event Photo */}
                            <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-3 flex flex-col justify-between">
                              <div className="space-y-1">
                                <h5 className="text-xs font-bold text-slate-300">Events Showcase Image</h5>
                                <p className="text-[9px] text-slate-500">Displayed in conclave and assemblies page.</p>
                              </div>
                              <div className="h-28 w-full rounded bg-slate-900 border border-slate-850 overflow-hidden relative">
                                <img src={siteConfig.eventPhoto} alt="Event" className="w-full h-full object-cover" />
                              </div>
                              <label className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 text-[10px] font-bold uppercase rounded border border-slate-850 cursor-pointer text-center block">
                                Change Photo
                                <input
                                  type="file"
                                  className="hidden"
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    const reader = new FileReader();
                                    reader.onload = (ev) => {
                                      setSiteConfig({ ...siteConfig, eventPhoto: ev.target?.result as string });
                                    };
                                    reader.readAsDataURL(file);
                                  }}
                                />
                              </label>
                            </div>

                            {/* Leader Photo */}
                            <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-3 flex flex-col justify-between">
                              <div className="space-y-1">
                                <h5 className="text-xs font-bold text-slate-300">Admiralty Logo/Seal</h5>
                                <p className="text-[9px] text-slate-500">Our supreme emblem overlay on credentials.</p>
                              </div>
                              <div className="h-28 w-full rounded bg-slate-900 border border-slate-850 overflow-hidden relative flex items-center justify-center">
                                <PrivateersLogo size={60} />
                              </div>
                              <div className="text-[10px] text-amber-500 font-mono text-center font-bold">
                                SYSTEM SEAL VERIFIED
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Save Actions */}
                        <div className="border-t border-slate-800/80 pt-6 flex justify-end">
                          <button
                            type="button"
                            disabled={siteSaving}
                            onClick={() => {
                              setSiteSaving(true);
                              savePublicSiteConfig(siteConfig);
                              setTimeout(() => {
                                setSiteSaving(false);
                                alert("✓ Public Site Configuration updated successfully! Changes will appear instantly in the next public refresh cycle.");
                              }, 1000);
                            }}
                            className="px-6 py-2.5 bg-red-800 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-widest rounded-xl border border-red-700 shadow-lg flex items-center gap-2 cursor-pointer transition-all"
                          >
                            {siteSaving ? "Publishing to Scrolls..." : "Publish Live Interface"}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Blog Chronicles Manager content */}
                  {adminSubTab === "blog_manager" && (
                    <div className="space-y-8 text-left">
                      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-4">
                          <div>
                            <h3 className="text-lg font-serif font-bold text-amber-500">Sovereign Blog Chronicles</h3>
                            <p className="text-xs text-slate-400 font-light">
                              Create, edit, and publish newsletters, bulletins, voyages journals, and conclave announcements to the public site feed.
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              if (isBlogFormOpen) {
                                setEditingBlogPost(null);
                                setBlogForm({
                                  title: "",
                                  category: "Announcements",
                                  summary: "",
                                  content: "",
                                  image: "",
                                  author: session?.name || "David Chukwuyem",
                                  readTime: "2 min read"
                                });
                              } else {
                                setBlogForm({
                                  title: "",
                                  category: "Announcements",
                                  summary: "",
                                  content: "",
                                  image: "https://picsum.photos/seed/voyage/600/400",
                                  author: session?.name || "David Chukwuyem",
                                  readTime: "2 min read"
                                });
                              }
                              setIsBlogFormOpen(!isBlogFormOpen);
                            }}
                            className="px-4 py-2 bg-red-800 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl border border-red-700 shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <span>{isBlogFormOpen ? "Back to Chronicles List" : "Publish New Chronicle"}</span>
                            <BookOpen size={14} className="text-amber-400" />
                          </button>
                        </div>

                        {isBlogFormOpen ? (
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              let freshPosts = [...forumPosts];
                              
                              if (editingBlogPost) {
                                // Edit existing
                                freshPosts = freshPosts.map(p => {
                                  if (p.id === editingBlogPost.id) {
                                    return {
                                      ...p,
                                      title: blogForm.title,
                                      category: blogForm.category,
                                      content: blogForm.content,
                                      summary: blogForm.summary || blogForm.content.slice(0, 150) + "...",
                                      image: blogForm.image || "https://picsum.photos/seed/voyage/600/400",
                                      authorName: blogForm.author || session?.name || "David Chukwuyem",
                                      readTime: blogForm.readTime || "2 min read"
                                    };
                                  }
                                  return p;
                                });
                                alert("✓ Chronicle post updated successfully!");
                              } else {
                                // Add new
                                const record = {
                                  id: generateUniqueId("post"),
                                  category: blogForm.category,
                                  title: blogForm.title,
                                  content: blogForm.content,
                                  summary: blogForm.summary || blogForm.content.slice(0, 150) + "...",
                                  image: blogForm.image || "https://picsum.photos/seed/voyage/600/400",
                                  authorId: session?.id || "mem_1",
                                  authorName: blogForm.author || session?.name || "David Chukwuyem",
                                  authorRank: session?.rank || MemberRank.ADMIRAL,
                                  createdAt: getTimestampIso(),
                                  likes: [],
                                  comments: [],
                                  readTime: blogForm.readTime || "2 min read"
                                };
                                freshPosts.unshift(record);
                                alert("✓ New chronicle published live!");
                              }

                              setForumPosts(freshPosts);
                              localStorage.setItem("privateers_db_forum", JSON.stringify(freshPosts));
                              window.dispatchEvent(new Event("privateers_forum_updated"));

                              logSystemAction(
                                "BLOG_POST_MODIFIED",
                                `Admin published/updated chronicle thread: "${blogForm.title}".`
                              );

                              // Reset form
                              setEditingBlogPost(null);
                              setBlogForm({
                                title: "",
                                category: "Announcements",
                                summary: "",
                                content: "",
                                image: "",
                                author: "",
                                readTime: ""
                              });
                              setIsBlogFormOpen(false);
                            }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2"
                          >
                            <div className="space-y-1.5 col-span-1 md:col-span-2">
                              <label className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider">Chronicle Title</label>
                              <input
                                type="text"
                                required
                                value={blogForm.title}
                                onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                                placeholder="Enter a descriptive title..."
                                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-red-800 text-white font-medium"
                              />
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider">Category</label>
                              <select
                                value={blogForm.category}
                                onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-red-800 text-white"
                              >
                                <option value="Announcements">Announcements</option>
                                <option value="Bylaws">Bylaws & Mandates</option>
                                <option value="Welfare">Welfare & Support</option>
                                <option value="Voyages">Voyages Logs</option>
                                <option value="Conclave Logs">Conclave Diaries</option>
                              </select>
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider">Author Name Display</label>
                              <input
                                type="text"
                                required
                                value={blogForm.author}
                                onChange={(e) => setBlogForm({ ...blogForm, author: e.target.value })}
                                placeholder="E.g., Admiral David Chukwuyem..."
                                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-red-800 text-white"
                              />
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider">Cover Image URL</label>
                              <input
                                type="text"
                                value={blogForm.image}
                                onChange={(e) => setBlogForm({ ...blogForm, image: e.target.value })}
                                placeholder="E.g., https://picsum.photos/seed/voyage/600/400..."
                                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-red-800 text-white"
                              />
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider">Estimated Read Time</label>
                              <input
                                type="text"
                                required
                                value={blogForm.readTime}
                                onChange={(e) => setBlogForm({ ...blogForm, readTime: e.target.value })}
                                placeholder="E.g., 3 min read..."
                                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-red-800 text-white"
                              />
                            </div>

                            <div className="space-y-1.5 col-span-1 md:col-span-2">
                              <label className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider">Brief Summary / Excerpt</label>
                              <input
                                type="text"
                                value={blogForm.summary}
                                onChange={(e) => setBlogForm({ ...blogForm, summary: e.target.value })}
                                placeholder="Enter a one-sentence summary for the card view..."
                                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-red-800 text-white"
                              />
                            </div>

                            <div className="space-y-1.5 col-span-1 md:col-span-2">
                              <label className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider">Chronicle Article Content</label>
                              <textarea
                                required
                                rows={8}
                                value={blogForm.content}
                                onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                                placeholder="Draft the chronicle narrative in full detail here..."
                                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-red-800 text-white leading-relaxed"
                              />
                            </div>

                            <div className="col-span-1 md:col-span-2 flex justify-end gap-3 pt-4 border-t border-slate-800/60">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingBlogPost(null);
                                  setIsBlogFormOpen(false);
                                }}
                                className="px-5 py-2.5 bg-slate-950 border border-slate-800 hover:bg-slate-900 text-slate-400 text-xs font-bold uppercase rounded-xl cursor-pointer"
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                className="px-6 py-2.5 bg-red-800 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-widest rounded-xl border border-red-700 shadow-md cursor-pointer"
                              >
                                {editingBlogPost ? "Publish Changes" : "Publish Live Chronicle"}
                              </button>
                            </div>
                          </form>
                        ) : (
                          <div className="space-y-4">
                            <span className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider block">
                              Active Chronicles Archive
                            </span>

                            {forumPosts.length === 0 ? (
                              <div className="text-center py-12 bg-slate-950/40 border border-slate-850 rounded-xl">
                                <p className="text-xs text-slate-500 font-light">No chronicle articles published. Click the button above to publish your first post!</p>
                              </div>
                            ) : (
                              <div className="overflow-x-auto rounded-xl border border-slate-800">
                                <table className="w-full text-left border-collapse">
                                  <thead>
                                    <tr className="bg-slate-950 border-b border-slate-800 text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                                      <th className="p-3.5">Title & Excerpt</th>
                                      <th className="p-3.5">Category</th>
                                      <th className="p-3.5">Author</th>
                                      <th className="p-3.5">Date</th>
                                      <th className="p-3.5 text-right">Actions</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-800 text-xs">
                                    {forumPosts.map((post) => (
                                      <tr key={post.id} className="hover:bg-slate-950/40 transition-all">
                                        <td className="p-3.5 max-w-sm">
                                          <div className="font-serif font-bold text-slate-200 truncate">{post.title}</div>
                                          <div className="text-[10px] text-slate-400 truncate mt-0.5 font-light">{post.summary || post.content}</div>
                                        </td>
                                        <td className="p-3.5">
                                          <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-slate-950 border border-slate-800 text-amber-500 uppercase font-semibold">
                                            {post.category}
                                          </span>
                                        </td>
                                        <td className="p-3.5 font-mono text-[11px] text-slate-300">{post.authorName}</td>
                                        <td className="p-3.5 text-slate-400 font-mono text-[10px]">
                                          {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "Just now"}
                                        </td>
                                        <td className="p-3.5 text-right space-x-2 whitespace-nowrap">
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setEditingBlogPost(post);
                                              setBlogForm({
                                                title: post.title,
                                                category: post.category,
                                                summary: post.summary || "",
                                                content: post.content,
                                                image: post.image || "",
                                                author: post.authorName,
                                                readTime: post.readTime || "2 min read"
                                              });
                                              setIsBlogFormOpen(true);
                                            }}
                                            className="px-2.5 py-1 text-[10px] font-bold text-amber-400 hover:text-amber-300 bg-amber-950/10 border border-amber-900/30 rounded hover:bg-amber-950/20 cursor-pointer"
                                          >
                                            Edit
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => {
                                              if (confirm(`Are you sure you want to delete the chronicle "${post.title}"? This cannot be undone.`)) {
                                                const updated = forumPosts.filter(p => p.id !== post.id);
                                                setForumPosts(updated);
                                                localStorage.setItem("privateers_db_forum", JSON.stringify(updated));
                                                window.dispatchEvent(new Event("privateers_forum_updated"));
                                                logSystemAction("BLOG_POST_DELETED", `Admin deleted blog post: "${post.title}".`);
                                                alert("✓ Post deleted successfully.");
                                              }
                                            }}
                                            className="px-2.5 py-1 text-[10px] font-bold text-red-500 hover:text-red-400 bg-red-950/10 border border-red-900/30 rounded hover:bg-red-950/20 cursor-pointer"
                                          >
                                            Delete
                                          </button>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Member ID Card Editor content */}
                  {adminSubTab === "member_id_editor" && (
                    <div className="space-y-8 text-left">
                      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
                        <div>
                          <h3 className="text-lg font-serif font-bold text-amber-500">Member Marque ID Card Editor</h3>
                          <p className="text-xs text-slate-400 font-light">
                            Note: ID card credentials, biographies, custom metadata, and rank/status override permissions are strictly editable only by Admiralty Administration.
                          </p>
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-1.5 max-w-md">
                            <label className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider">Select Member to Edit</label>
                            <select
                              value={selectedMemberId}
                              onChange={(e) => {
                                const mId = e.target.value;
                                setSelectedMemberId(mId);
                                if (!mId) {
                                  setMemberForm({
                                    name: "",
                                    mqeNumber: "",
                                    biography: "",
                                    skills: "",
                                    suite: "Brass Suite",
                                    fleet: "Brass Suite",
                                    rank: MemberRank.PRIVATEER,
                                    status: MemberStatus.ACTIVE,
                                    profession: "",
                                    state: "",
                                    lga: "",
                                    residentialAddress: "",
                                    profilePhoto: ""
                                  });
                                  return;
                                }
                                const selected = members.find(m => m.id === mId);
                                if (selected) {
                                  setMemberForm({
                                    name: selected.name || "",
                                    mqeNumber: selected.mqeNumber || "",
                                    biography: selected.biography || "",
                                    skills: Array.isArray(selected.skills) ? selected.skills.join(", ") : (selected.skills || ""),
                                    suite: selected.suite || selected.fleet || "Brass Suite",
                                    fleet: selected.suite || selected.fleet || "Brass Suite",
                                    rank: selected.rank || MemberRank.PRIVATEER,
                                    status: selected.status || MemberStatus.ACTIVE,
                                    profession: selected.profession || "",
                                    state: selected.state || "",
                                    lga: selected.lga || "",
                                    residentialAddress: selected.residentialAddress || "",
                                    profilePhoto: selected.profilePhoto || ""
                                  });
                                }
                              }}
                              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-red-800 text-white"
                            >
                              <option value="">-- Choose a Verified/Active Member --</option>
                              {members.map(m => (
                                <option key={m.id} value={m.id}>
                                  {m.name} ({m.mqeNumber || "PENDING"}) - {m.rank}
                                </option>
                              ))}
                            </select>
                          </div>

                          {selectedMemberId ? (
                            <form
                              onSubmit={(e) => {
                                e.preventDefault();
                                const updatedMembers = members.map(m => {
                                  if (m.id === selectedMemberId) {
                                    return {
                                      ...m,
                                      name: memberForm.name,
                                      mqeNumber: memberForm.mqeNumber,
                                      biography: memberForm.biography,
                                      skills: memberForm.skills.split(",").map(s => s.trim()).filter(Boolean),
                                      suite: memberForm.suite,
                                      fleet: memberForm.suite,
                                      rank: memberForm.rank,
                                      status: memberForm.status,
                                      profession: memberForm.profession,
                                      state: memberForm.state,
                                      lga: memberForm.lga,
                                      residentialAddress: memberForm.residentialAddress,
                                      profilePhoto: memberForm.profilePhoto
                                    };
                                  }
                                  return m;
                                });

                                setMembers(updatedMembers);
                                localStorage.setItem("privateers_db_members", JSON.stringify(updatedMembers));

                                // Sync current session if editing themselves
                                if (selectedMemberId === session?.id || memberForm.mqeNumber === session?.mqeNumber) {
                                  const updatedSession = {
                                    ...session,
                                    name: memberForm.name,
                                    mqeNumber: memberForm.mqeNumber,
                                    rank: memberForm.rank,
                                    status: memberForm.status,
                                    profilePhoto: memberForm.profilePhoto
                                  };
                                  setSession(updatedSession);
                                  localStorage.setItem("privateers_session", JSON.stringify(updatedSession));
                                }

                                logSystemAction(
                                  "MEMBER_CARD_EDITED",
                                  `Admin updated credentials, profile picture and ID details for member "${memberForm.name}" (${memberForm.mqeNumber}).`
                                );

                                alert(`✓ Credentials and Profile Picture for ${memberForm.name} saved successfully!`);
                              }}
                              className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800/60"
                            >
                              {/* Member Profile Picture Admin Editing */}
                              <div className="md:col-span-2 p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                                <span className="text-xs font-bold font-mono text-amber-400 uppercase tracking-wider block">
                                  Admin Profile Picture Override for {memberForm.name || "Member"}
                                </span>
                                <div className="flex flex-col sm:flex-row items-center gap-4">
                                  {memberForm.profilePhoto ? (
                                    <img
                                      src={memberForm.profilePhoto}
                                      alt="Member Avatar"
                                      className="w-16 h-16 rounded-full object-cover border-2 border-amber-500 shadow-md"
                                    />
                                  ) : (
                                    <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400 font-bold text-xl">
                                      {memberForm.name ? memberForm.name.charAt(0) : "M"}
                                    </div>
                                  )}
                                  <div className="flex-1 space-y-2 w-full">
                                    <label className="text-[10px] font-mono text-slate-400 uppercase block">
                                      Upload New Profile Picture File
                                    </label>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                          const reader = new FileReader();
                                          reader.onload = (ev) => {
                                            setMemberForm({ ...memberForm, profilePhoto: ev.target?.result as string });
                                          };
                                          reader.readAsDataURL(file);
                                        }
                                      }}
                                      className="text-xs text-slate-400 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-500 file:text-slate-950 hover:file:bg-amber-400 cursor-pointer"
                                    />
                                    <div className="flex gap-2 pt-1">
                                      <input
                                        type="text"
                                        placeholder="Or paste image URL (https://...)"
                                        value={memberForm.profilePhoto}
                                        onChange={(e) => setMemberForm({ ...memberForm, profilePhoto: e.target.value })}
                                        className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-1.5">
                                <label className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider">Full Name</label>
                                <input
                                  type="text"
                                  required
                                  value={memberForm.name}
                                  onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
                                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-red-800 text-white font-medium"
                                />
                              </div>

                              <div className="space-y-1.5">
                                <label className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider">MQE Number</label>
                                <input
                                  type="text"
                                  required
                                  value={memberForm.mqeNumber}
                                  onChange={(e) => setMemberForm({ ...memberForm, mqeNumber: e.target.value })}
                                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-red-800 text-white font-mono"
                                />
                              </div>

                              <div className="space-y-1.5">
                                <label className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider">Assign Room Suite</label>
                                <select
                                  value={memberForm.suite}
                                  onChange={(e) => setMemberForm({ ...memberForm, suite: e.target.value, fleet: e.target.value })}
                                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-red-800 text-white"
                                >
                                  <option value="Brass Suite">Brass Suite (Admiralty Command)</option>
                                  <option value="Bonny Estuary Suite">Bonny Estuary Suite</option>
                                  <option value="Forcados Suite">Forcados Suite</option>
                                  <option value="Escravos Suite">Escravos Suite</option>
                                  <option value="Akassa Suite">Akassa Suite</option>
                                  <option value="Opobo Suite">Opobo Suite</option>
                                  <option value="Nembe Suite">Nembe Suite</option>
                                  <option value="Calabar Suite">Calabar Suite</option>
                                </select>
                              </div>

                              <div className="space-y-1.5">
                                <label className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider">Override Rank</label>
                                <select
                                  value={memberForm.rank}
                                  onChange={(e) => setMemberForm({ ...memberForm, rank: e.target.value as MemberRank })}
                                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-red-800 text-white"
                                >
                                  <option value={MemberRank.PRIVATEER}>{MemberRank.PRIVATEER}</option>
                                  <option value={MemberRank.SCRIBE}>{MemberRank.SCRIBE}</option>
                                  <option value={MemberRank.CAPTAIN}>{MemberRank.CAPTAIN}</option>
                                  <option value={MemberRank.ADMIRAL}>{MemberRank.ADMIRAL}</option>
                                </select>
                              </div>

                              <div className="space-y-1.5">
                                <label className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider">Membership Status</label>
                                <select
                                  value={memberForm.status}
                                  onChange={(e) => setMemberForm({ ...memberForm, status: e.target.value as MemberStatus })}
                                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-red-800 text-white"
                                >
                                  <option value={MemberStatus.PENDING}>{MemberStatus.PENDING}</option>
                                  <option value={MemberStatus.ACTIVE}>{MemberStatus.ACTIVE}</option>
                                  <option value={MemberStatus.SUSPENDED}>{MemberStatus.SUSPENDED}</option>
                                  <option value={MemberStatus.INACTIVE}>{MemberStatus.INACTIVE}</option>
                                  <option value={MemberStatus.REJECTED}>{MemberStatus.REJECTED}</option>
                                </select>
                              </div>

                              <div className="space-y-1.5">
                                <label className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider">Profession</label>
                                <input
                                  type="text"
                                  value={memberForm.profession}
                                  onChange={(e) => setMemberForm({ ...memberForm, profession: e.target.value })}
                                  placeholder="E.g., Seafarer, Marine Engineer..."
                                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-red-800 text-white"
                                />
                              </div>

                              <div className="space-y-1.5">
                                <label className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider">State of Origin</label>
                                <input
                                  type="text"
                                  value={memberForm.state}
                                  onChange={(e) => setMemberForm({ ...memberForm, state: e.target.value })}
                                  placeholder="E.g., Delta, Rivers..."
                                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-red-800 text-white"
                                />
                              </div>

                              <div className="space-y-1.5">
                                <label className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider">LGA of Origin</label>
                                <input
                                  type="text"
                                  value={memberForm.lga}
                                  onChange={(e) => setMemberForm({ ...memberForm, lga: e.target.value })}
                                  placeholder="E.g., Warri South..."
                                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-red-800 text-white"
                                />
                              </div>

                              <div className="space-y-1.5 col-span-1 md:col-span-2">
                                <label className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider">Residential Address</label>
                                <input
                                  type="text"
                                  value={memberForm.residentialAddress}
                                  onChange={(e) => setMemberForm({ ...memberForm, residentialAddress: e.target.value })}
                                  placeholder="E.g., 14 Admiralty Way, Port Harcourt..."
                                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-red-800 text-white"
                                />
                              </div>

                              <div className="space-y-1.5 col-span-1 md:col-span-2">
                                <label className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider">Marque Skills (Comma Separated)</label>
                                <input
                                  type="text"
                                  value={memberForm.skills}
                                  onChange={(e) => setMemberForm({ ...memberForm, skills: e.target.value })}
                                  placeholder="E.g., Rigging, Navigation, Radio Comms, First Aid..."
                                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-red-800 text-white"
                                />
                              </div>

                              <div className="space-y-1.5 col-span-1 md:col-span-2">
                                <label className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider">Digital Biography / Voyage Charter</label>
                                <textarea
                                  rows={4}
                                  value={memberForm.biography}
                                  onChange={(e) => setMemberForm({ ...memberForm, biography: e.target.value })}
                                  placeholder="Provide biographical summaries for the ID card details deck..."
                                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-red-800 text-white leading-relaxed"
                                />
                              </div>

                              <div className="col-span-1 md:col-span-2 flex justify-end gap-3 pt-4 border-t border-slate-800/60">
                                <button
                                  type="button"
                                  onClick={() => setSelectedMemberId("")}
                                  className="px-5 py-2.5 bg-slate-950 border border-slate-800 hover:bg-slate-900 text-slate-400 text-xs font-bold uppercase rounded-xl cursor-pointer"
                                >
                                  Deselect Member
                                </button>
                                <button
                                  type="submit"
                                  className="px-6 py-2.5 bg-red-800 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-widest rounded-xl border border-red-700 shadow-md cursor-pointer"
                                >
                                  Save ID Card Details
                                </button>
                              </div>
                            </form>
                          ) : (
                            <div className="text-center py-12 bg-slate-950/40 border border-slate-850 rounded-xl">
                              <p className="text-xs text-slate-500 font-light">Select a member from the dropdown above to edit their digital ID card credentials.</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Elections Manager content */}
                  {adminSubTab === "elections_manager" && (
                    <div className="space-y-8 text-left">
                      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                        <div>
                          <h3 className="text-lg font-serif font-bold text-amber-500">Conclave Balloting & Election Management</h3>
                          <p className="text-xs text-slate-400 font-light">
                            Create, edit, and coordinate candidate elections or policy ballot referendums for chapter voting assemblies.
                          </p>
                        </div>

                        {/* New Election Form */}
                        <div className="bg-slate-950 p-5 rounded-xl border border-slate-850 space-y-4">
                          <h4 className="text-xs font-bold font-mono text-amber-500 uppercase tracking-widest">Open New Election Portal</h4>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-[9px] font-bold font-mono text-slate-400 uppercase tracking-wider">Ballot / Election Title</label>
                              <input
                                type="text"
                                value={electionForm.title}
                                onChange={(e) => setElectionForm({ ...electionForm, title: e.target.value })}
                                placeholder="e.g. Succession Election for Master-At-Arms"
                                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-red-800 text-white"
                              />
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-[9px] font-bold font-mono text-slate-400 uppercase tracking-wider">Ballot Type</label>
                              <select
                                value={electionForm.type}
                                onChange={(e) => setElectionForm({ ...electionForm, type: e.target.value, candidates: [] })}
                                className="w-full bg-slate-900 border border-slate-800 text-xs py-2 px-3 rounded-lg focus:outline-none focus:border-red-800 text-white cursor-pointer"
                              >
                                <option value="CANDIDATE">Candidate Succession (Person Leadership)</option>
                                <option value="POLICY">Policy Referendum (Policy Endorsement)</option>
                              </select>
                            </div>

                            <div className="col-span-1 md:col-span-2 space-y-1.5">
                              <label className="text-[9px] font-bold font-mono text-slate-400 uppercase tracking-wider">Detailed Description & Rules</label>
                              <textarea
                                rows={2}
                                value={electionForm.description}
                                onChange={(e) => setElectionForm({ ...electionForm, description: e.target.value })}
                                placeholder="Describe candidates, policy requirements, background review guidelines, or voting weights..."
                                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-red-800 text-white leading-relaxed resize-none"
                              />
                            </div>
                          </div>

                          {/* Candidates/Choices section */}
                          <div className="border-t border-slate-850 pt-4 space-y-3">
                            <h5 className="text-[10px] font-bold font-mono text-slate-400 uppercase">
                              {electionForm.type === "CANDIDATE" ? "Candidate List" : "Policy Options / Choices"}
                            </h5>

                            {electionForm.candidates.length > 0 ? (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-2">
                                {electionForm.candidates.map((cand, index) => (
                                  <div key={index} className="p-3 bg-slate-900 border border-slate-800 rounded-lg flex items-start justify-between gap-3 text-xs">
                                    <div className="space-y-1 text-left">
                                      <h6 className="font-bold text-slate-200">{cand.name} <span className="text-[9px] font-mono text-slate-500 uppercase">{cand.rank}</span></h6>
                                      <p className="text-[10px] text-slate-400 font-light italic leading-tight">&ldquo;{cand.campaignManifesto}&rdquo;</p>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const filtered = electionForm.candidates.filter((_, i) => i !== index);
                                        setElectionForm({ ...electionForm, candidates: filtered });
                                      }}
                                      className="text-slate-500 hover:text-red-500 cursor-pointer font-bold"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-[10px] text-slate-500 italic pb-2">No options added yet. Insert choices below.</p>
                            )}

                            {/* Options Adder Panel */}
                            <div className="bg-slate-900 p-3.5 rounded-lg border border-slate-800 space-y-3 max-w-lg">
                              <h6 className="text-[10px] font-mono font-bold text-amber-500">
                                {electionForm.type === "CANDIDATE" ? "Add Candidate" : "Add Policy Choice"}
                              </h6>
                              <div className="grid grid-cols-2 gap-2">
                                <input
                                  type="text"
                                  value={newCandForm.name}
                                  onChange={(e) => setNewCandForm({ ...newCandForm, name: e.target.value })}
                                  placeholder={electionForm.type === "CANDIDATE" ? "e.g. Captain Blackbeard" : "e.g. In Favor / Support"}
                                  className="px-2.5 py-1.5 bg-slate-950 border border-slate-850 rounded text-xs focus:outline-none focus:border-red-800 text-white"
                                />
                                <input
                                  type="text"
                                  value={newCandForm.rank}
                                  onChange={(e) => setNewCandForm({ ...newCandForm, rank: e.target.value })}
                                  placeholder={electionForm.type === "CANDIDATE" ? "e.g. Scribe" : "e.g. Option ID"}
                                  className="px-2.5 py-1.5 bg-slate-950 border border-slate-850 rounded text-xs focus:outline-none focus:border-red-800 text-white"
                                />
                              </div>
                              <textarea
                                rows={1.5}
                                value={newCandForm.campaignManifesto}
                                onChange={(e) => setNewCandForm({ ...newCandForm, campaignManifesto: e.target.value })}
                                placeholder={electionForm.type === "CANDIDATE" ? "Campaign pledge / vision statement..." : "Describe the policy outcome when selected..."}
                                className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-850 rounded text-xs focus:outline-none focus:border-red-800 text-white resize-none"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  if (!newCandForm.name.trim()) return;
                                  const key = `${electionForm.type === "CANDIDATE" ? "cand_" : "opt_"}${Date.now()}`;
                                  const updated = [
                                    ...electionForm.candidates,
                                    {
                                      mqeNumber: key,
                                      name: newCandForm.name.trim(),
                                      rank: newCandForm.rank.trim() || "Choice",
                                      campaignManifesto: newCandForm.campaignManifesto.trim() || "Under Scribe verification",
                                      votesCount: 0
                                    }
                                  ];
                                  setElectionForm({ ...electionForm, candidates: updated });
                                  setNewCandForm({ name: "", rank: "", campaignManifesto: "" });
                                }}
                                className="px-3.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 text-[10px] font-bold uppercase rounded cursor-pointer transition-all"
                              >
                                Add Option
                              </button>
                            </div>
                          </div>

                          <div className="pt-2 flex justify-end">
                            <button
                              type="button"
                              onClick={() => {
                                if (!electionForm.title.trim() || electionForm.candidates.length === 0) {
                                  alert("Lodge Error: Please provide an election title and add at least one candidate option.");
                                  return;
                                }
                                const newElection = {
                                  id: `el_${Date.now()}`,
                                  title: electionForm.title.trim(),
                                  description: electionForm.description.trim(),
                                  votingStart: new Date().toISOString(),
                                  votingEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                                  status: "ACTIVE",
                                  candidates: electionForm.candidates,
                                  votedMqes: []
                                };
                                const updatedElections = [...elections, newElection];
                                setElections(updatedElections);
                                localStorage.setItem("privateers_db_elections", JSON.stringify(updatedElections));
                                logSystemAction(
                                  "ELECTION_CREATED_ADMIN",
                                  `Admin Chukwuyem opened portal for conclave ballot: "${newElection.title}"`
                                );
                                setElectionForm({ title: "", description: "", type: "CANDIDATE", candidates: [] });
                                alert(`✓ Ballot Portal successfully active! Commissioned members can now vote on "${newElection.title}".`);
                              }}
                              className="px-5 py-2.5 bg-red-800 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-widest rounded-xl border border-red-700 shadow shadow-red-900 flex items-center gap-1.5 cursor-pointer"
                            >
                              <Vote size={14} /> Seal & Open Portal
                            </button>
                          </div>
                        </div>

                        {/* List of active/archived elections */}
                        <div className="pt-4 space-y-4">
                          <h4 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-widest">Active & Past Chapter Ballots</h4>
                          <div className="space-y-4">
                            {elections.map((el) => (
                              <div key={el.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h5 className="font-serif font-bold text-slate-200 text-sm">{el.title}</h5>
                                    <p className="text-[10px] text-slate-500 font-mono">Ballots: {el.votedMqes?.length || 0} votes</p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-900/40 text-[9px] font-mono uppercase font-bold tracking-wider">
                                      {el.status}
                                    </span>
                                    {el.status === "ACTIVE" && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const updated = elections.map(e => e.id === el.id ? { ...e, status: "ARCHIVED" } : e);
                                          setElections(updated);
                                          localStorage.setItem("privateers_db_elections", JSON.stringify(updated));
                                          alert("✓ Ballot cycle archived and concluded.");
                                        }}
                                        className="text-[9px] font-bold text-red-500 border border-red-950 px-2 py-0.5 rounded hover:bg-red-950 cursor-pointer"
                                      >
                                        Close Portal
                                      </button>
                                    )}
                                  </div>
                                </div>
                                <p className="text-xs text-slate-400 font-light leading-relaxed">{el.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Quarter Deck Chapters & Ports Subtab */}
                  {adminSubTab === "chapters" && (
                    <div className="space-y-6 text-left">
                      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <h3 className="text-lg font-serif font-bold text-amber-500">Quarter Deck Chapters & Ports System</h3>
                            <p className="text-xs text-slate-400 font-light">
                              Establish, edit, activate/deactivate, and manage regional Chapters and Ports across the maritime domain.
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingChapter(null);
                              setChapterForm({
                                name: "",
                                region: "Delta State",
                                portCode: `PORT-${Math.floor(100 + Math.random() * 900)}`,
                                maxCapacity: 150,
                                description: "",
                                status: "Active"
                              });
                              setIsChapterFormOpen(!isChapterFormOpen);
                            }}
                            className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
                          >
                            <Plus size={16} />
                            {isChapterFormOpen ? "Close Form" : "Create New Chapter / Port"}
                          </button>
                        </div>

                        {isChapterFormOpen && (
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              if (editingChapter) {
                                const updated = chapters.map(ch => ch.id === editingChapter.id ? { ...ch, ...chapterForm } : ch);
                                setChapters(updated);
                                localStorage.setItem("privateers_db_chapters", JSON.stringify(updated));
                                alert(`✓ Chapter "${chapterForm.name}" updated successfully.`);
                              } else {
                                const newCh = {
                                  id: `ch_${Date.now()}`,
                                  ...chapterForm,
                                  createdAt: new Date().toISOString()
                                };
                                const updated = [newCh, ...chapters];
                                setChapters(updated);
                                localStorage.setItem("privateers_db_chapters", JSON.stringify(updated));
                                alert(`✓ Chapter "${chapterForm.name}" created successfully.`);
                              }
                              setIsChapterFormOpen(false);
                              setEditingChapter(null);
                            }}
                            className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-4"
                          >
                            <h4 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                              {editingChapter ? "Edit Chapter / Port Details" : "Commission New Chapter / Port"}
                            </h4>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold font-mono text-slate-400 uppercase">Chapter / Port Name</label>
                                <input
                                  type="text"
                                  required
                                  value={chapterForm.name}
                                  onChange={(e) => setChapterForm({ ...chapterForm, name: e.target.value })}
                                  placeholder="E.g. Great Niger Delta Chapter / Warri Port"
                                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-[10px] font-bold font-mono text-slate-400 uppercase">Region / State</label>
                                <input
                                  type="text"
                                  required
                                  value={chapterForm.region}
                                  onChange={(e) => setChapterForm({ ...chapterForm, region: e.target.value })}
                                  placeholder="E.g. Delta State, Rivers State"
                                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-[10px] font-bold font-mono text-slate-400 uppercase">Port Code / Identifier</label>
                                <input
                                  type="text"
                                  required
                                  value={chapterForm.portCode}
                                  onChange={(e) => setChapterForm({ ...chapterForm, portCode: e.target.value })}
                                  placeholder="E.g. PORT-GND"
                                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white font-mono"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-[10px] font-bold font-mono text-slate-400 uppercase">Max Member Capacity</label>
                                <input
                                  type="number"
                                  required
                                  min={1}
                                  value={chapterForm.maxCapacity}
                                  onChange={(e) => setChapterForm({ ...chapterForm, maxCapacity: parseInt(e.target.value) || 50 })}
                                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white font-mono"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-[10px] font-bold font-mono text-slate-400 uppercase">Status</label>
                                <select
                                  value={chapterForm.status}
                                  onChange={(e) => setChapterForm({ ...chapterForm, status: e.target.value })}
                                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
                                >
                                  <option value="Active">Active</option>
                                  <option value="Inactive">Inactive</option>
                                </select>
                              </div>

                              <div className="space-y-1 sm:col-span-2 md:col-span-3">
                                <label className="text-[10px] font-bold font-mono text-slate-400 uppercase">Port Base Description</label>
                                <input
                                  type="text"
                                  value={chapterForm.description}
                                  onChange={(e) => setChapterForm({ ...chapterForm, description: e.target.value })}
                                  placeholder="E.g. Central dockyard headquarters serving the coastal fleets."
                                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
                                />
                              </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                              <button
                                type="button"
                                onClick={() => setIsChapterFormOpen(false)}
                                className="px-4 py-2 bg-slate-900 text-slate-400 text-xs font-bold uppercase rounded-lg"
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                className="px-5 py-2 bg-red-800 text-white text-xs font-bold uppercase rounded-lg shadow"
                              >
                                {editingChapter ? "Save Changes" : "Create Chapter"}
                              </button>
                            </div>
                          </form>
                        )}

                        {chapters.length === 0 ? (
                          <div className="p-12 text-center border border-dashed border-slate-800 rounded-xl space-y-2">
                            <Anchor size={36} className="mx-auto text-slate-600" />
                            <h4 className="text-sm font-bold text-slate-300">No Chapters or Ports Established Yet</h4>
                            <p className="text-xs text-slate-500 max-w-md mx-auto">
                              The Quarter Deck system is empty and ready for production setup. Use the button above to establish your first Chapter or Port.
                            </p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {chapters.map((ch) => {
                              const memberCount = members.filter(m => m.chapter === ch.name).length;
                              return (
                                <div key={ch.id} className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <span className="text-[9px] font-mono font-bold text-amber-500 uppercase">{ch.portCode} • {ch.region}</span>
                                      <h4 className="font-serif font-bold text-slate-100 text-base">{ch.name}</h4>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                                      ch.status === "Active" ? "bg-emerald-950/50 text-emerald-400 border border-emerald-800/40" : "bg-slate-900 text-slate-500"
                                    }`}>
                                      {ch.status}
                                    </span>
                                  </div>

                                  <p className="text-xs text-slate-400 line-clamp-2">{ch.description || "No description provided."}</p>

                                  <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-xs font-mono">
                                    <span className="text-slate-500">Registered Members:</span>
                                    <span className="text-amber-400 font-bold">{memberCount} / {ch.maxCapacity}</span>
                                  </div>

                                  <div className="flex items-center justify-end gap-2 pt-2">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const updated = chapters.map(item => item.id === ch.id ? { ...item, status: item.status === "Active" ? "Inactive" : "Active" } : item);
                                        setChapters(updated);
                                        localStorage.setItem("privateers_db_chapters", JSON.stringify(updated));
                                      }}
                                      className="px-2.5 py-1 text-[10px] font-bold text-slate-300 bg-slate-900 border border-slate-800 rounded hover:bg-slate-850 cursor-pointer"
                                    >
                                      {ch.status === "Active" ? "Deactivate" : "Activate"}
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => {
                                        setEditingChapter(ch);
                                        setChapterForm({
                                          name: ch.name,
                                          region: ch.region,
                                          portCode: ch.portCode,
                                          maxCapacity: ch.maxCapacity,
                                          description: ch.description || "",
                                          status: ch.status
                                        });
                                        setIsChapterFormOpen(true);
                                      }}
                                      className="px-2.5 py-1 text-[10px] font-bold text-amber-400 bg-amber-950/20 border border-amber-900/40 rounded hover:bg-amber-950/40 cursor-pointer"
                                    >
                                      Edit
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (confirm(`Are you sure you want to delete Chapter "${ch.name}"?`)) {
                                          const updated = chapters.filter(item => item.id !== ch.id);
                                          setChapters(updated);
                                          localStorage.setItem("privateers_db_chapters", JSON.stringify(updated));
                                        }
                                      }}
                                      className="px-2.5 py-1 text-[10px] font-bold text-red-400 bg-red-950/20 border border-red-900/40 rounded hover:bg-red-950/40 cursor-pointer"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Branding & Logo Subtab */}
                  {adminSubTab === "branding" && (
                    <div className="space-y-6 text-left">
                      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
                        <div>
                          <h3 className="text-lg font-serif font-bold text-amber-500">Branding & Visual Assets Configuration</h3>
                          <p className="text-xs text-slate-400 font-light">
                            Customize official logos, favicons, site title, and slogan across the public website and internal portal.
                          </p>
                        </div>

                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            const updatedConfig = {
                              ...siteConfig,
                              brandName: brandingForm.siteName,
                              tagline: brandingForm.tagline
                            };
                            setSiteConfig(updatedConfig);
                            savePublicSiteConfig(updatedConfig);
                            setSiteLogo(brandingForm.logoUrl);
                            localStorage.setItem("privateers_site_logo", brandingForm.logoUrl);
                            if (brandingForm.faviconUrl) {
                              localStorage.setItem("privateers_site_favicon", brandingForm.faviconUrl);
                            }
                            alert("✓ Visual branding and organization identity updated live across the entire system!");
                          }}
                          className="space-y-5"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Guild Logo Input & Direct File Upload */}
                            <div className="space-y-3 bg-slate-950 p-4 border border-slate-800/80 rounded-xl">
                              <div className="flex items-center justify-between">
                                <label className="text-[10px] font-bold font-mono text-slate-300 uppercase">Guild Logo Image</label>
                                {brandingForm.logoUrl && (
                                  <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                                    ✓ Image Loaded
                                  </span>
                                )}
                              </div>

                              {/* Live Logo Preview */}
                              {brandingForm.logoUrl && (
                                <div className="flex items-center gap-3 p-2 bg-slate-900 border border-slate-800 rounded-lg">
                                  <div className="w-12 h-12 rounded-lg bg-slate-950 border border-slate-800 p-1 flex items-center justify-center overflow-hidden">
                                    <img src={brandingForm.logoUrl} alt="Logo Preview" className="max-w-full max-h-full object-contain" />
                                  </div>
                                  <div className="text-[11px] font-mono text-slate-400 flex-1 min-w-0">
                                    <span className="block text-amber-400 font-bold">Active Logo Asset</span>
                                    <span className="text-[9px] text-slate-500 truncate block">Ready to apply system-wide</span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => setBrandingForm({ ...brandingForm, logoUrl: "" })}
                                    className="text-[10px] text-red-400 hover:text-red-300 font-mono font-bold px-2 py-1 bg-red-950/40 rounded border border-red-900/30 cursor-pointer"
                                  >
                                    Remove
                                  </button>
                                </div>
                              )}

                              {/* File Upload Button */}
                              <div className="space-y-1.5">
                                <span className="text-[10px] font-mono text-slate-400 block font-bold">Upload Photo File directly:</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const reader = new FileReader();
                                      reader.onload = (event) => {
                                        const result = event.target?.result as string;
                                        setBrandingForm(prev => ({ ...prev, logoUrl: result }));
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  }}
                                  className="w-full text-xs text-slate-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-mono file:font-bold file:bg-amber-600 file:text-slate-950 hover:file:bg-amber-500 cursor-pointer"
                                />
                              </div>

                              {/* Manual URL Input */}
                              <div className="space-y-1 pt-1 border-t border-slate-900">
                                <span className="text-[9px] font-mono text-slate-500 block">Or enter Image Web URL:</span>
                                <input
                                  type="text"
                                  value={brandingForm.logoUrl}
                                  onChange={(e) => setBrandingForm({ ...brandingForm, logoUrl: e.target.value })}
                                  placeholder="E.g. /icon.png or https://example.com/logo.png"
                                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
                                />
                              </div>
                            </div>

                            {/* Favicon Input & Direct File Upload */}
                            <div className="space-y-3 bg-slate-950 p-4 border border-slate-800/80 rounded-xl">
                              <div className="flex items-center justify-between">
                                <label className="text-[10px] font-bold font-mono text-slate-300 uppercase">Browser Favicon Asset</label>
                                {brandingForm.faviconUrl && (
                                  <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                                    ✓ Favicon Loaded
                                  </span>
                                )}
                              </div>

                              {/* Live Favicon Preview */}
                              {brandingForm.faviconUrl && (
                                <div className="flex items-center gap-3 p-2 bg-slate-900 border border-slate-800 rounded-lg">
                                  <div className="w-8 h-8 rounded bg-slate-950 border border-slate-800 p-1 flex items-center justify-center overflow-hidden">
                                    <img src={brandingForm.faviconUrl} alt="Favicon Preview" className="max-w-full max-h-full object-contain" />
                                  </div>
                                  <div className="text-[11px] font-mono text-slate-400 flex-1 min-w-0">
                                    <span className="block text-amber-400 font-bold">Active Favicon Asset</span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => setBrandingForm({ ...brandingForm, faviconUrl: "" })}
                                    className="text-[10px] text-red-400 hover:text-red-300 font-mono font-bold px-2 py-1 bg-red-950/40 rounded border border-red-900/30 cursor-pointer"
                                  >
                                    Remove
                                  </button>
                                </div>
                              )}

                              {/* File Upload Button */}
                              <div className="space-y-1.5">
                                <span className="text-[10px] font-mono text-slate-400 block font-bold">Upload Favicon File directly:</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const reader = new FileReader();
                                      reader.onload = (event) => {
                                        const result = event.target?.result as string;
                                        setBrandingForm(prev => ({ ...prev, faviconUrl: result }));
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  }}
                                  className="w-full text-xs text-slate-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-mono file:font-bold file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700 cursor-pointer"
                                />
                              </div>

                              {/* Manual URL Input */}
                              <div className="space-y-1 pt-1 border-t border-slate-900">
                                <span className="text-[9px] font-mono text-slate-500 block">Or enter Favicon Web URL:</span>
                                <input
                                  type="text"
                                  value={brandingForm.faviconUrl}
                                  onChange={(e) => setBrandingForm({ ...brandingForm, faviconUrl: e.target.value })}
                                  placeholder="E.g. /icon.png"
                                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
                                />
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold font-mono text-slate-400 uppercase">Organization Site Name</label>
                              <input
                                type="text"
                                required
                                value={brandingForm.siteName}
                                onChange={(e) => setBrandingForm({ ...brandingForm, siteName: e.target.value })}
                                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white font-medium"
                              />
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold font-mono text-slate-400 uppercase">Slogan / Tagline</label>
                              <input
                                type="text"
                                required
                                value={brandingForm.tagline}
                                onChange={(e) => setBrandingForm({ ...brandingForm, tagline: e.target.value })}
                                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                              />
                            </div>
                          </div>

                          <div className="flex justify-end pt-4 border-t border-slate-800/60">
                            <button
                              type="submit"
                              className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow cursor-pointer"
                            >
                              Apply Visual Branding
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}

                  {/* Clean Production Launch Subtab */}
                  {adminSubTab === "database" && (
                    <div className="space-y-6 text-left">
                      <div className="bg-slate-900 border border-red-900/40 rounded-2xl p-6 shadow-xl space-y-6">
                        <div>
                          <h3 className="text-lg font-serif font-bold text-red-500">Live Production Launch & Data Reset</h3>
                          <p className="text-xs text-slate-400 font-light">
                            Transition system from development/testing mode to clean live production mode. This purges all sample records and prepares the internal portal for real-world operations.
                          </p>
                        </div>

                        <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                          <h4 className="text-xs font-mono font-bold text-amber-400 uppercase">What this action does:</h4>
                          <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                            <li>Clears all test/dummy member records except the Master Administrator account (Admiral David Chukwuyem).</li>
                            <li>Wipes all demo financial ledger entries and sample dues payments.</li>
                            <li>Empties all test blog articles, sample chat channels, test elections, and sample document files.</li>
                            <li>Sets the Quarter Deck Chapters system to 100% clean initial state.</li>
                            <li>Generates a fresh audit trail event marking the system production launch.</li>
                          </ul>
                        </div>

                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={handleInitializeCleanProductionSystem}
                            className="px-6 py-3 bg-red-800 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-widest rounded-xl border border-red-600 shadow-lg cursor-pointer flex items-center gap-2"
                          >
                            <Trash2 size={16} />
                            Initialize Clean Production System
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                </motion.div>
              )}

              {activeMenu === "settings" && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-8 max-w-2xl mx-auto"
                >
                  <div className="space-y-1 text-center">
                    <h2 className="font-serif text-2xl font-bold text-slate-200">Sovereign Chapter Settings</h2>
                    <p className="text-xs text-slate-400 font-light">Adjust chapter parameters, colors, and organizational rules. Admin override required.</p>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-lg">
                    {/* Security notice */}
                    {![MemberRank.ADMIRAL, MemberRank.CAPTAIN].includes(currentRole) && (
                      <div className="p-4 bg-red-950/40 border border-red-900/50 rounded-xl text-xs text-red-300 font-light leading-relaxed flex gap-3">
                        <AlertTriangle className="text-red-400 flex-shrink-0" size={18} />
                        <p>Sovereign Edict Error: Your current override rank is <strong>{currentRole}</strong>. Setting changes require administrative command of the <strong>Admiral</strong> or <strong>Captain</strong>. Use the selector above to override.</p>
                      </div>
                    )}

                    <div className="space-y-4">
                      {/* Name of chapter */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider">Chapter Designation Name</label>
                        <input
                          type="text"
                          disabled={![MemberRank.ADMIRAL, MemberRank.CAPTAIN].includes(currentRole)}
                          defaultValue="National Association of Privateers - Great Niger Delta Chapter"
                          className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-red-800 text-white disabled:opacity-50"
                        />
                      </div>

                      {/* Primary colors */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider">Primary Crest Color</label>
                          <input
                            type="color"
                            disabled={![MemberRank.ADMIRAL, MemberRank.CAPTAIN].includes(currentRole)}
                            defaultValue="#991b1b"
                            className="w-full h-10 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer disabled:opacity-50"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider">Secondary Fleet Color</label>
                          <input
                            type="color"
                            disabled={![MemberRank.ADMIRAL, MemberRank.CAPTAIN].includes(currentRole)}
                            defaultValue="#1e3a8a"
                            className="w-full h-10 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer disabled:opacity-50"
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        disabled={![MemberRank.ADMIRAL, MemberRank.CAPTAIN].includes(currentRole)}
                        onClick={() => {
                          logSystemAction("SETTINGS_MODIFIED", "Administrative officer adjusted Chapter details and branding colors.");
                          alert("✓ Sovereign parameters successfully recorded in the Scribe's vault.");
                        }}
                        className="w-full py-3 bg-gradient-to-r from-red-800 to-red-900 text-white text-xs font-bold uppercase tracking-widest rounded-xl border border-red-700 shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                      >
                        <Shield size={12} className="text-amber-400" />
                        Record Chapter Settings
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Mobile Drawer Navigation overlay */}
      {isMobileMenuOpen && (
        <div 
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm lg:hidden flex"
        >
          <motion.aside 
            initial={{ x: -260 }}
            animate={{ x: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-full"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <PrivateersLogo size={40} />
                <span className="font-serif text-xs font-bold tracking-wide text-amber-500">QUARTERDECK</span>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            {/* Menu options */}
            <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
              {session?.status === MemberStatus.PENDING ? (
                <div className="p-4 bg-amber-950/15 rounded-xl border border-amber-900/30 text-xs text-amber-300 text-center font-light">Onboarding active.</div>
              ) : (
                (() => {
                  const navItems = [
                    { id: "overview", label: "Overview", icon: Anchor },
                    { id: "compass", label: "Admiralty Compass", icon: Compass },
                    { id: "directory", label: "Vessel Directory", icon: Users },
                    { id: "card", label: "Marque ID Card", icon: Award },
                    { id: "ledger", label: "Quartermaster Ledger", icon: DollarSign },
                    { id: "forum", label: "Sovereign Forum", icon: MessageSquare },
                    { id: "election", label: "Conclave Ballots", icon: Vote },
                    { id: "events", label: "Conclave & QR", icon: Calendar },
                    { id: "documents", label: "Document Vault", icon: FileText },
                    { id: "dispatch", label: "Dispatch Room", icon: MessageSquare }
                  ];
                  if (session?.superAdmin === true) {
                    navItems.push({ id: "settings", label: "System Settings", icon: Settings });
                    navItems.push({ id: "quota", label: "Quota Deck", icon: Sliders });
                    navItems.push({ id: "admin", label: "Admin Console", icon: Shield });
                    navItems.push({ id: "audit", label: "System Audit Logs", icon: FileSpreadsheet });
                  }
                  return navItems;
                })().map(item => {
                  const Icon = item.icon;
                  const isActive = activeMenu === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold tracking-wide uppercase transition-all ${
                        isActive ? "bg-red-800 text-white" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <Icon size={16} />
                      {item.label}
                    </button>
                  );
                })
              )}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-slate-800">
              <button 
                onClick={handleLogout}
                className="w-full py-2.5 bg-slate-950 text-slate-400 text-xs font-bold tracking-widest uppercase rounded-lg border border-slate-800 transition-all flex items-center justify-center gap-2"
              >
                <LogOut size={12} /> Log Out
              </button>
            </div>
          </motion.aside>
        </div>
      )}
    </div>
  );
}
