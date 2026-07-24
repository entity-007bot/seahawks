"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Compass, 
  BookOpen, 
  Map, 
  Users, 
  Calendar, 
  FileText, 
  HelpCircle, 
  Mail, 
  Lock, 
  UserPlus, 
  Search, 
  MessageSquare, 
  Clock, 
  Shield, 
  Award, 
  ChevronRight, 
  X, 
  Download, 
  Sliders,
  Globe,
  Navigation,
  CheckCircle,
  Bell,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Menu,
  ChevronDown
} from "lucide-react";
import { PrivateersLogo } from "@/components/privateers-logo";
import Link from "next/link";
import { getPublicSiteConfig, DEFAULT_PUBLIC_SITE_CONFIG, PublicSiteConfig } from "@/lib/site-config";

export default function PublicPage() {
  const [activeTab, setActiveTab] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [blogCategory, setBlogCategory] = useState("All");
  
  const [adminEmails, setAdminEmails] = useState<string[]>([]);
  const [contactForm, setContactForm] = useState({ name: "", email: "", subject: "", message: "", targetEmail: "" });
  const [contactSuccess, setContactFormSuccess] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<any | null>(null);
  const [showLegal, setShowLegal] = useState<"privacy" | "terms" | null>(null);
  
  const [leadership, setLeadership] = useState<any[]>([]);
  const [docs, setDocs] = useState<any[]>([]);
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [siteConfig, setSiteConfig] = useState<PublicSiteConfig>(DEFAULT_PUBLIC_SITE_CONFIG);
  
  // Real-time Notification state
  const [notifications, setNotifications] = useState<any[]>([]);

  // Concilif Calendar State
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<any | null>({
    day: 24,
    event: {
      title: "Mid-Year Conclave",
      desc: "General physical audit of the vessel logbooks, Quartermaster dues audits, and regional officer commission checks.",
      time: "10:00 AM",
      loc: "Grand Deck Assembly, Port Harcourt"
    }
  });

  const calendarDays = [
    { day: 1, event: null }, { day: 2, event: null }, { day: 3, event: null }, { day: 4, event: null }, { day: 5, event: null },
    { day: 6, event: null }, { day: 7, event: null }, { day: 8, event: null }, { day: 9, event: null },
    { day: 10, event: { title: "Coastal Sanitation Day", desc: "Waterfront sanitation and local youth mentoring sessions at delta port.", time: "08:00 AM", loc: "Warri Wharf" } },
    { day: 11, event: null }, { day: 12, event: null }, { day: 13, event: null }, { day: 14, event: null }, { day: 15, event: null },
    { day: 16, event: null }, { day: 17, event: null }, { day: 18, event: null }, { day: 19, event: null }, { day: 20, event: null },
    { day: 21, event: null }, { day: 22, event: null }, { day: 23, event: null },
    { day: 24, event: { title: "Mid-Year Conclave", desc: "General physical audit of the vessel logbooks, Quartermaster dues audits, and regional officer commission checks.", time: "10:00 AM", loc: "Grand Deck Assembly, Port Harcourt" } },
    { day: 25, event: null }, { day: 26, event: null }, { day: 27, event: null },
    { day: 28, event: { title: "Trade Seminar", desc: "Briefing on maritime entrepreneurship, supply chains, and delta trade opportunities.", time: "02:00 PM", loc: "Bonny Conference Center" } },
    { day: 29, event: null }, { day: 30, event: null }, { day: 31, event: null }
  ];

  // Function to push a real-time notification
  const pushNotification = (title: string, message: string) => {
    const id = Math.random().toString(36).substring(7);
    const newNotif = { id, title, message };
    setNotifications(prev => [newNotif, ...prev].slice(0, 3));
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 6000);
  };

  // The 10 Sections mapped to the Dynamic Information Sliding Board tabs
  const infoSlides = [
    { 
      id: "home", 
      label: "Home", 
      icon: Compass,
      title: siteConfig.brandName,
      subtitle: siteConfig.tagline,
      content: (
        <div className="space-y-6">
          <div className="border-l-4 border-amber-500 pl-4 space-y-2">
            <p className="text-xs uppercase tracking-widest text-amber-500 font-mono font-bold">Motto</p>
            <p className="text-xl md:text-2xl font-serif text-white italic">&ldquo;{siteConfig.motto}&rdquo;</p>
          </div>
          <div className="border-l-4 border-amber-500 pl-4 space-y-1">
            <p className="text-xs uppercase tracking-widest text-amber-500 font-mono font-bold">Core Philosophy</p>
            <p className="text-lg md:text-xl font-serif text-white italic">&ldquo;{siteConfig.corePhilosophy}&rdquo;</p>
          </div>
          <p className="text-slate-300 text-sm md:text-base font-light leading-relaxed">
            Welcome to the central Quarterdeck of CORSAIRS. Inspired by the historic age of exploration, we adopt the noble traditions of maritime communities: strategic navigation, mutual responsibility, courage, and disciplined leadership to forge positive community impact.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => setActiveSlideIndex(1)}
              className="px-4.5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <Compass size={14} /> Read Our Heritage
            </button>
            <Link
              href="/portal?mode=register"
              className="px-4.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider rounded-lg border border-slate-800 transition-all flex items-center gap-2"
            >
              <UserPlus size={14} className="text-amber-500" /> Apply for Commission
            </Link>
          </div>
        </div>
      )
    },
    { 
      id: "about-fleet", 
      label: "About the Fleet", 
      icon: Shield,
      title: "Our Maritime Heritage",
      subtitle: "Lawful Commissions vs. Privateer Discipline",
      content: (
        <div className="space-y-4 text-slate-300 text-sm leading-relaxed font-light">
          <p>
            <strong className="text-white font-semibold">{siteConfig.brandName}</strong> is a modern, maritime-inspired fellowship built around the core principles of leadership, service, discipline, knowledge, entrepreneurship, and community development. 
          </p>
          <p>
            {siteConfig.aboutText}
          </p>
          <p>
            {siteConfig.aboutDetailed}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-2">
            <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-800">
              <span className="text-xs font-bold text-amber-500 font-mono block">Commissioned</span>
              <span className="text-[10px] text-slate-400">Authorized for civic protection and harbor development</span>
            </div>
            <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-800">
              <span className="text-xs font-bold text-amber-500 font-mono block">Disciplined</span>
              <span className="text-[10px] text-slate-400">Strictly regulated code of conduct and strategic leadership</span>
            </div>
            <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-800 col-span-2 md:col-span-1">
              <span className="text-xs font-bold text-amber-500 font-mono block">Enterprise</span>
              <span className="text-[10px] text-slate-400">Focused on maritime trade and professional networking</span>
            </div>
          </div>
        </div>
      )
    },
    { 
      id: "vision-mission", 
      label: "Vision & Mission", 
      icon: Navigation,
      title: "Sovereign Sightlines",
      subtitle: "Our Global Chart & Vision for Tomorrow",
      content: (
        <div className="space-y-4">
          <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800 space-y-1.5">
            <h4 className="text-xs font-bold font-mono text-amber-500 uppercase tracking-widest">Our Vision</h4>
            <p className="text-sm text-slate-100 font-serif leading-relaxed">
              {siteConfig.vision}
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="text-xs font-bold font-mono text-amber-500 uppercase tracking-widest">Our Mission is to:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {siteConfig.missions.map((m, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                  <span className="text-amber-500 font-mono font-bold mt-0.5">0{i+1}.</span>
                  <p className="font-light">{m}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    },
    { 
      id: "philosophy", 
      label: "Maritime Philosophy", 
      icon: Map,
      title: "Nautical Symbols",
      subtitle: "The Five Bearings of our Maritime Lore",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {[
            { title: "The Compass", val: "Wisdom", desc: "Represents absolute direction, decision-making, and moral wisdom." },
            { title: "The Compass", val: "Loyalty", desc: "Represents direction, integrity, and steady commitment to the Association." },
            { title: "The Chart", val: "Strategy", desc: "Represents detailed planning, forward vision, and operational strategy." },
            { title: "The Lantern", val: "Guidance", desc: "Represents knowledge, truth, and providing guidance to recruits." },
            { title: "The Flag", val: "Unity", desc: "Represents our unified purpose, shared honor, and sovereign community." }
          ].map((item, i) => (
            <div key={i} className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 space-y-2 text-left hover:border-amber-500/20 transition-all">
              <span className="text-[10px] font-mono font-bold text-amber-500 block uppercase tracking-wider">{item.val}</span>
              <h5 className="text-xs font-bold text-white font-serif">{item.title}</h5>
              <p className="text-[11px] text-slate-400 font-light leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      )
    },
    { 
      id: "orientation", 
      label: "Member Mindset", 
      icon: Users,
      title: "The Sailor's Mindset",
      subtitle: "Operational Orientations for All Fleet Hands",
      content: (
        <div className="space-y-4">
          <p className="text-slate-300 text-xs font-light">
            Every newly commissioned Privateer and Corsair is oriented into the core <strong className="text-white font-medium">Sailor’s Mindset</strong>. This is a framework designed to build constructive, high-integrity habits that guard our collective reputation:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { t: "Think Strategically", d: "Read the tides, map courses carefully, and anticipate challenges before sailing." },
              { t: "Act Responsibly", d: "Own your commands and steer your vessel with absolute civic accountability." },
              { t: "Respect All Hands", d: "Maintain deep fraternal bonds and respect local coastal communities." },
              { t: "Protect the Fleet", d: "Safeguard traditions, archives, and the public honor of the Privateers." },
              { t: "Seek Knowledge", d: "Never cease exploring, learning, and refining your navigational skills." },
              { t: "Serve Communities", d: "Direct your merchant resources, enterprise, and skills to uplift local ports." },
              { t: "Build, Do Not Destroy", d: "Focus on creating businesses, developing infrastructure, and positive impact." }
            ].map((mind, i) => (
              <div key={i} className="bg-slate-900/40 p-3 rounded-lg border border-slate-850 flex gap-2.5">
                <CheckCircle size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <h5 className="text-xs font-bold text-white font-serif">{mind.t}</h5>
                  <p className="text-[10px] text-slate-400 font-light leading-tight">{mind.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    { 
      id: "code-of-honor", 
      label: "Code of Honor", 
      icon: Award,
      title: "Our Six Core Values",
      subtitle: "A Steady Compass for Character & Conduct",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { v: "Honor", d: "Every member represents the reputation of the Fleet through complete honesty, transparent actions, and pristine integrity." },
            { v: "Discipline", d: "A sailor without discipline cannot complete a voyage. Members maintain excellence in character, education, and conduct." },
            { v: "Service", d: "The greatest achievement of a Corsair is using their private wealth, knowledge, and logistics to improve human society." },
            { v: "Brotherhood", d: "Members support one another across all ports through shared purpose, transparent ledgers, and mutual welfare." },
            { v: "Knowledge", d: "Navigation begins with deep understanding. Members pursue continuous learning, scientific studies, and archival wisdom." },
            { v: "Enterprise", d: "The spirit of exploration extends directly to modern business, strategic innovation, and economic empowerment." }
          ].map((val, i) => (
            <div key={i} className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1.5 hover:bg-slate-900 transition-colors">
              <h4 className="text-sm font-bold text-amber-500 font-serif flex items-center gap-1.5">
                <span className="text-slate-500 font-mono text-[10px]">0{i+1}.</span> {val.v}
              </h4>
              <p className="text-xs text-slate-400 font-light leading-relaxed">{val.d}</p>
            </div>
          ))}
        </div>
      )
    },
    { 
      id: "events-ceremonies", 
      label: "Events & Ceremonies", 
      icon: Calendar, 
      title: "Conclaves & Ceremonies",
      subtitle: "Disciplined Gatherings & Solemn Commissioning",
      content: (
        <div className="space-y-4 text-slate-300 text-sm leading-relaxed font-light">
          <p>
            The life of a Corsair is anchored in regular, highly disciplined assemblies called <strong className="text-white font-medium">Conclaves</strong>. These events serve as the formal chambers where chapter decisions are verified, ledgers are audited, and new members are commissioned.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
            <div className="bg-slate-900/40 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <h5 className="text-xs font-bold font-serif text-amber-500">Annual Grand Conclave</h5>
              <p className="text-[11px] text-slate-400">The supreme sovereign assembly of all active fleets, held annually to review global charts, audit general resources, and celebrate milestones.</p>
            </div>
            <div className="bg-slate-900/40 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <h5 className="text-xs font-bold font-serif text-amber-500">Commission Ceremonies</h5>
              <p className="text-[11px] text-slate-400">Solemn induction sessions where recruits swear allegiance to our Code of Honor, receive their Letters of Marque, and are granted active rank.</p>
            </div>
            <div className="bg-slate-900/40 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <h5 className="text-xs font-bold font-serif text-amber-500">Regional Port Audits</h5>
              <p className="text-[11px] text-slate-400">Bi-monthly local fleet gather-ups designed to inspect Quartermaster ledger books, synchronize welfare distribution plans, and coordinate local acts of service.</p>
            </div>
          </div>
        </div>
      )
    },
    { 
      id: "community-service", 
      label: "Community Service", 
      icon: Globe, 
      title: "Maritime Philanthropy",
      subtitle: "Deploying Enterprise to Uplift Coastal Ports",
      content: (
        <div className="space-y-4 text-slate-300 text-sm leading-relaxed font-light">
          <p>
            Our ultimate commission is service. We translate private enterprise, naval discipline, and community leadership into lasting public development. CORSAIRS🧭 coordinates structural support across local coastal ports and vulnerable delta communities.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="text-xs font-bold font-mono text-amber-500 uppercase tracking-widest">Welfare & Supply Relays</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                We organize robust supply runs—delivering emergency relief cargo, healthcare materials, and educational tools to underprivileged marine-bordering populations.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="text-xs font-bold font-mono text-amber-500 uppercase tracking-widest">Maritime Conservation</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Active fleets coordinate regular water-clearing operations, coastal ecosystem protection audits, and public environmental education campaigns to safeguard our precious shared waters.
              </p>
            </div>
          </div>
        </div>
      )
    },
    { 
      id: "chapters-fleets", 
      label: "Chapters & Fleets", 
      icon: Map, 
      title: "Sovereign Fleets & Chapters",
      subtitle: "Active Nautical Jurisdictions of CORSAIRS🧭",
      content: (
        <div className="space-y-4 text-slate-300 text-sm leading-relaxed font-light">
          <p>
            Our organization allows Chapter Administration (Africa / Admiralty Command) to establish custom geographic <strong className="text-white font-medium">Fleets & Chapters</strong> as needed. No predefined fleets exist by default; all active fleets are created directly by Chapter Administration.
          </p>
        </div>
      )
    },
    { 
      id: "membership-info", 
      label: "Join the Fleet", 
      icon: UserPlus,
      title: "Enrollment & Eligibility",
      subtitle: "Official Onboarding Protocols & Requirements",
      content: (
        <div className="space-y-4">
          <p className="text-slate-300 text-sm font-light">
            We welcome applications from disciplined professionals, leaders, and strategic thinkers who seek to serve their community under our maritime banner.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold font-mono text-amber-500 uppercase tracking-widest">Eligibility Requirements</h4>
              <ul className="space-y-2 text-xs text-slate-300 font-light">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  Must submit complete National Identity Number (NIN) credentials.
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  Hold a clean civic and security record in your home province.
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  Demonstrate active engagement in community development or business.
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  Pledge allegiance to the Corsair Code and support local welfare.
                </li>
              </ul>
            </div>
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold font-mono text-amber-500 uppercase tracking-widest">Onboarding Milestones</h4>
              <ol className="space-y-2 text-xs text-slate-300 font-light list-decimal list-inside">
                <li>Registry submission (via Online Portal)</li>
                <li>Archival background check by Scribe Office</li>
                <li>Physical local Conclave Interview with Chapter Captains</li>
                <li>Pledge Ceremony & Issuance of verified MQE Commission ID</li>
              </ol>
            </div>
          </div>
          <div className="pt-2 text-center md:text-left">
            <Link
              href="/portal?mode=register"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold uppercase tracking-wider rounded-lg transition-all"
            >
              <UserPlus size={13} /> Secure Your Letters of Marque
            </Link>
          </div>
        </div>
      )
    }
  ];

  const handlePrevSlide = () => {
    setActiveSlideIndex((prev) => (prev === 0 ? infoSlides.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setActiveSlideIndex((prev) => (prev === infoSlides.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    // Sync public site configuration asynchronously to avoid cascading render warning
    const configTimer = setTimeout(() => {
      setSiteConfig(getPublicSiteConfig());
    }, 0);

    // Initializing unique admin routing emails
    const localEmails = localStorage.getItem("privateers_admin_emails");
    let activeEmails: string[] = [];
    if (localEmails) {
      try {
        activeEmails = JSON.parse(localEmails);
      } catch (err) {
        activeEmails = [];
      }
    }
    if (!activeEmails || activeEmails.length === 0) {
      const host = (typeof window !== "undefined" && window.location.host && !window.location.host.includes("localhost")) ? window.location.host : "seahawks.ai.studio";
      activeEmails = [
        `info@${host}`,
        `dispatch@${host}`,
        `business@${host}`
      ];
      localStorage.setItem("privateers_admin_emails", JSON.stringify(activeEmails));
    }
    setAdminEmails(activeEmails);
    setContactForm(prev => ({ ...prev, targetEmail: prev.targetEmail || activeEmails[0] || "" }));

    const handleConfigUpdate = () => {
      setSiteConfig(getPublicSiteConfig());
    };
    window.addEventListener("privateers_public_config_updated", handleConfigUpdate);

    // Simulated Real-Time Activity Ticker (no emojis, professional)
    const tickerList = [
      { title: "LGA Registry", message: "Great Niger Delta Chapter synchronized new applicant biometric registers." },
      { title: "Security Checkpoint", message: "Automated integrity scan of the Scribe archival database completed." },
      { title: "Quartermaster Office", message: "Sovereign ledger logs for annual privateer dues updated." },
      { title: "Command Directive", message: "Admiral David approved Letters of Marque for verified candidates." },
      { title: "Logistics Dispatch", message: "Vessel cargo manifest approved for coastal sanitation and youth welfare relays." },
      { title: "Conclave Bulletin", message: "Mid-Year chapter audit reports compiled under Scribe Edward's certification." },
      { title: "Elections Board", message: "Secure balloting portal audited and certified active for chapter votes." },
      { title: "Welfare Distribution", message: "Sea relief supplies safely verified and dispatched to delta coastal communities." }
    ];

    const initialTimer = setTimeout(() => {
      const item = tickerList[Math.floor(Math.random() * tickerList.length)];
      pushNotification(item.title, item.message);
    }, 4000);

    const interval = setInterval(() => {
      const item = tickerList[Math.floor(Math.random() * tickerList.length)];
      pushNotification(item.title, item.message);
    }, 35000);

    const timer = setTimeout(() => {
      // Sync leadership database
      const localLeadership = localStorage.getItem("privateers_db_leadership");
      if (!localLeadership) {
        const defaultLeadership = [
          {
            id: "lead_1",
            name: "Admiral David Chukwuyem",
            role: "Lord Admiral / Grand Admiral",
            type: "Active",
            biography: "Supreme Commander of the Fleet. Guardian of our vision, logistics, and supreme chapters. Commissioned 2026.",
            photo: "https://picsum.photos/seed/david_admiral/400/400"
          },
          {
            id: "lead_2",
            name: "Quartermaster Jack Sparrow",
            role: "Quartermaster General",
            type: "Active",
            biography: "Oversees physical ledger scales, resources, and welfare cargo distributions. Known for supreme accuracy and auditing.",
            photo: "https://picsum.photos/seed/jack_quarter/400/400"
          },
          {
            id: "lead_3",
            name: "Scribe Edward Teach",
            role: "Admiralty Council Secretary",
            type: "Active",
            biography: "Logs all formal conclave minutes, publishes official proclamations, and secures our digital document vault.",
            photo: "https://picsum.photos/seed/edward_scribe/400/400"
          },
          {
            id: "lead_4",
            name: "Admiral Henry Morgan",
            role: "Former Grand Commander",
            type: "Former",
            biography: "Sovereign leader during the coastal patrol setups. Retired with supreme honors after decades of loyal service.",
            photo: "https://picsum.photos/seed/henry_former/400/400"
          }
        ];
        localStorage.setItem("privateers_db_leadership", JSON.stringify(defaultLeadership));
        setLeadership(defaultLeadership);
      } else {
        setLeadership(JSON.parse(localLeadership));
      }

      // Sync documents database
      const localDocs = localStorage.getItem("privateers_db_documents");
      if (!localDocs) {
        const defaultDocs = [
          { id: "doc_1", title: "National Privateers Constitution 2026", category: "Constitution", fileUrl: "#", versionHistory: [{ version: "1.0", updatedBy: "Admiral David Chukwuyem", updatedAt: "2026-01-10T10:00:00Z", notes: "Supreme charter draft established upon chapter creation." }], uploadedAt: "2026-01-10T10:00:00Z" },
          { id: "doc_2", title: "Sovereign Corsair Code of Conduct", category: "Bylaws", fileUrl: "#", versionHistory: [{ version: "1.1", updatedBy: "Edward Teach (Scribe)", updatedAt: "2026-03-12T11:00:00Z", notes: "Bylaw amendment on privateer logistics and ledger accounts." }], uploadedAt: "2026-01-12T11:00:00Z" }
        ];
        localStorage.setItem("privateers_db_documents", JSON.stringify(defaultDocs));
        setDocs(defaultDocs);
      } else {
        setDocs(JSON.parse(localDocs));
      }

      // Sync forum/blog database (Default empty to satisfy user requests to remove all blog content and old data)
      const localForum = localStorage.getItem("privateers_db_forum");
      if (!localForum) {
        const initialPosts: any[] = []; // Empty array as requested
        localStorage.setItem("privateers_db_forum", JSON.stringify(initialPosts));
        setBlogPosts(initialPosts);
      } else {
        setBlogPosts(JSON.parse(localForum));
      }
    }, 0);

    const handleLeadershipUpdate = () => {
      const freshLead = localStorage.getItem("privateers_db_leadership");
      if (freshLead) setLeadership(JSON.parse(freshLead));
    };
    const handleDocsUpdate = () => {
      const freshDocs = localStorage.getItem("privateers_db_documents");
      if (freshDocs) setDocs(JSON.parse(freshDocs));
    };
    const handleForumUpdate = () => {
      const freshForum = localStorage.getItem("privateers_db_forum");
      if (freshForum) setBlogPosts(JSON.parse(freshForum));
    };

    window.addEventListener("privateers_leadership_updated", handleLeadershipUpdate);
    window.addEventListener("privateers_documents_updated", handleDocsUpdate);
    window.addEventListener("privateers_forum_updated", handleForumUpdate);
    
    return () => {
      clearTimeout(configTimer);
      clearTimeout(timer);
      clearTimeout(initialTimer);
      clearInterval(interval);
      window.removeEventListener("privateers_public_config_updated", handleConfigUpdate);
      window.removeEventListener("privateers_leadership_updated", handleLeadershipUpdate);
      window.removeEventListener("privateers_documents_updated", handleDocsUpdate);
      window.removeEventListener("privateers_forum_updated", handleForumUpdate);
    };
  }, []);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) return;

    const defaultTarg = adminEmails[0] || "info@seahawks.ai.studio";
    const selectedTarget = contactForm.targetEmail || defaultTarg;

    const logs = JSON.parse(localStorage.getItem("privateers_contact_logs") || "[]");
    logs.push({ 
      ...contactForm, 
      targetEmail: selectedTarget,
      date: new Date().toISOString() 
    });
    localStorage.setItem("privateers_contact_logs", JSON.stringify(logs));

    try {
      await fetch("/api/emails/dispatch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender: contactForm.email,
          recipient: selectedTarget,
          subject: `[Public Inquiry] ${contactForm.subject || "General Inquiry"}`,
          body: `From: ${contactForm.name} (${contactForm.email})\n\nMessage:\n${contactForm.message}`,
          type: "contact_inquiry"
        })
      });

      const dbLogs = JSON.parse(localStorage.getItem("privateers_db_logs") || "[]");
      dbLogs.push({
        id: `log_${Date.now()}`,
        userEmail: contactForm.email,
        userName: contactForm.name,
        userMqe: "GUEST",
        action: "PUBLIC_CONTACT_SUBMISSION",
        timestamp: new Date().toISOString(),
        details: `Public contact form dispatched via backend SMTP to ${selectedTarget}: "${contactForm.subject}"`
      });
      localStorage.setItem("privateers_db_logs", JSON.stringify(dbLogs));
    } catch (err) {}

    setContactFormSuccess(true);
    setContactForm({ name: "", email: "", subject: "", message: "", targetEmail: defaultTarg });
    setTimeout(() => setContactFormSuccess(false), 5000);
  };

  const filteredBlogPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (post.tags && post.tags.some((t: string) => t.toLowerCase().includes(searchQuery.toLowerCase())));
    const matchesCategory = blogCategory === "All" || post.category === blogCategory;
    return matchesSearch && matchesCategory;
  });

  const handleTabClick = (tabId: string) => {
    setSelectedArticle(null);
    if (tabId === "blog") {
      setActiveTab("blog");
    } else {
      setActiveTab("home");
      const idx = infoSlides.findIndex(s => s.id === tabId);
      if (idx !== -1) {
        setActiveSlideIndex(idx);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#020617] text-slate-100 scroll-smooth">
      
      {/* Top Banner styled with Maritime Code Phrase */}
      <div className="bg-gradient-to-r from-slate-950 via-amber-500/10 to-slate-950 py-2.5 px-4 text-[11px] font-mono font-medium text-center border-b border-amber-500/10 flex items-center justify-center gap-4 text-amber-500">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
          <strong>CAPTAIN&apos;S CALL:</strong> Conclave schedule locked. Commissioned members log in to view dates.
        </span>
        <span className="hidden md:inline text-slate-500">|</span>
        <span className="hidden md:inline text-slate-300">
          <strong>TRUE COURSE:</strong> Commission Ledger Verified & Secure.
        </span>
      </div>

      {/* Main Public Navigation */}
      <header className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-900 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo & Brand title */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group" onClick={() => { handleTabClick("home"); setMobileMenuOpen(false); }}>
            <PrivateersLogo size={40} className="sm:size-[48px] transition-transform duration-500 group-hover:rotate-6 drop-shadow-[0_0_10px_rgba(245,158,11,0.2)]" />
            <div className="flex flex-col max-w-[120px] xs:max-w-[160px] sm:max-w-[220px] md:max-w-xs xl:max-w-none">
              <span className="font-serif text-xs sm:text-sm xl:text-base tracking-wider font-semibold text-amber-500 group-hover:text-amber-400 transition-colors truncate">
                {siteConfig.brandName}
              </span>
              <span className="hidden sm:inline-block text-[8px] sm:text-[9px] tracking-widest text-slate-400 font-mono uppercase font-bold">
                {siteConfig.tagline}
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items (Responsive to Slider) */}
          <nav className="hidden xl:flex items-center gap-1 text-xs font-semibold text-slate-300">
            {infoSlides.map(slide => {
              const Icon = slide.icon;
              const isActive = activeTab === "home" && infoSlides[activeSlideIndex].id === slide.id;
              return (
                <button
                  key={slide.id}
                  onClick={() => handleTabClick(slide.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? "bg-amber-500 text-slate-950 font-extrabold shadow-md shadow-amber-500/10" 
                      : "hover:bg-slate-900 hover:text-white text-slate-300"
                  }`}
                >
                  <Icon size={13} className={isActive ? "text-slate-950" : "text-amber-500/70"} />
                  {slide.label}
                </button>
              );
            })}
            <button
              onClick={() => handleTabClick("blog")}
              className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg transition-all duration-200 ${
                activeTab === "blog" 
                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold shadow-md" 
                  : "hover:bg-slate-900 hover:text-white text-slate-300"
              }`}
            >
              <BookOpen size={13} className="text-amber-500/70" />
              Scribe Dispatches
            </button>
          </nav>

          {/* Action CTAs & Mobile Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link 
              href="/portal?mode=login"
              className="px-3 sm:px-4 py-2 sm:py-2.5 text-[10px] sm:text-xs font-bold tracking-wider uppercase bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg transition-all duration-200 shadow-lg shadow-amber-500/5 flex items-center gap-1.5 border border-amber-500/20"
            >
              <Lock size={12} />
              <span><span className="hidden sm:inline">Quarterdeck </span>Login</span>
            </Link>

            {/* Mobile menu hamburger button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg border border-slate-800 bg-slate-900/60 text-slate-300 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Collapsible Mobile Menu Panel */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="xl:hidden bg-slate-950 border-t border-slate-900 overflow-hidden"
            >
              <div className="px-4 py-4 space-y-2 max-h-[75vh] overflow-y-auto">
                <span className="block text-[9px] font-mono font-bold text-slate-500 tracking-wider uppercase mb-1">
                  — NAVIGATION CHANNELS
                </span>
                
                {infoSlides.map(slide => {
                  const Icon = slide.icon;
                  const isActive = activeTab === "home" && infoSlides[activeSlideIndex].id === slide.id;
                  return (
                    <button
                      key={slide.id}
                      onClick={() => {
                        handleTabClick(slide.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all text-left ${
                        isActive 
                          ? "bg-amber-500 text-slate-950 font-black shadow" 
                          : "text-slate-300 hover:bg-slate-900"
                      }`}
                    >
                      <Icon size={14} className={isActive ? "text-slate-950" : "text-amber-500"} />
                      {slide.label}
                    </button>
                  );
                })}

                <div className="h-px bg-slate-900 my-2" />

                <button
                  onClick={() => {
                    handleTabClick("blog");
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all text-left ${
                    activeTab === "blog" 
                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold" 
                      : "text-slate-300 hover:bg-slate-900"
                  }`}
                >
                  <BookOpen size={14} className="text-amber-500" />
                  Scribe Dispatches
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
        
        <AnimatePresence mode="wait">
          {activeTab === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-16"
            >
              
              {/* Majestic Sovereign Info Slider Board */}
              <section className="relative overflow-hidden w-full bg-slate-950 border border-slate-900 rounded-3xl shadow-2xl p-4 sm:p-6 md:p-10 min-h-[460px] flex flex-col justify-between">
                {/* Absolute background patterns */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-950/20 via-slate-950 to-slate-950 z-0 pointer-events-none"></div>
                <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl z-0 pointer-events-none"></div>
                
                {/* Slider header index controls */}
                <div className="relative z-10 border-b border-slate-900 pb-4 mb-6">
                  <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <Sliders size={18} className="text-amber-500" />
                      <span className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        FELLOWSHIP DISCLOSURE SCREEN
                      </span>
                    </div>

                    {/* Horizontal index buttons */}
                    <div className="flex flex-nowrap lg:flex-wrap gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 overflow-x-auto max-w-full scrollbar-none">
                      {infoSlides.map((slide, idx) => {
                        const isActive = activeSlideIndex === idx;
                        return (
                          <button
                            key={slide.id}
                            onClick={() => setActiveSlideIndex(idx)}
                            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-[10px] font-bold font-mono transition-all uppercase tracking-wider ${
                              isActive
                                ? "bg-amber-500 text-slate-950 shadow-md font-black"
                                : "text-slate-400 hover:text-white hover:bg-slate-800/40"
                            }`}
                          >
                            {slide.label}
                          </button>
                        );
                      })}
                    </div>

                    {/* Nav arrows */}
                    <div className="flex gap-2">
                      <button
                        onClick={handlePrevSlide}
                        className="p-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-lg text-slate-400 hover:text-amber-500 transition-colors cursor-pointer"
                        title="Previous Section"
                      >
                        <ChevronRight size={15} className="rotate-180" />
                      </button>
                      <button
                        onClick={handleNextSlide}
                        className="p-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-lg text-slate-400 hover:text-amber-500 transition-colors cursor-pointer"
                        title="Next Section"
                      >
                        <ChevronRight size={15} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Sliding Canvas Container */}
                <div className="relative z-10 flex-1 overflow-hidden py-4">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Active Slide Text Content */}
                    <div className="lg:col-span-8 space-y-4 text-left">
                      <span className="px-3 py-1 rounded bg-slate-900 text-amber-500 text-[10px] font-bold font-mono tracking-widest uppercase border border-slate-800 inline-block">
                        ★ Section 0{activeSlideIndex + 1} ★
                      </span>
                      <h2 className="text-3xl md:text-4xl font-serif font-extrabold text-white tracking-wide leading-tight">
                        {infoSlides[activeSlideIndex].title}
                      </h2>
                      <p className="text-xs text-slate-400 font-mono tracking-wider uppercase border-b border-slate-900 pb-3">
                        {infoSlides[activeSlideIndex].subtitle}
                      </p>
                      
                      <div className="pt-2">
                        {infoSlides[activeSlideIndex].content}
                      </div>
                    </div>

                    {/* Logo/Identity Visual Panel */}
                    <div className="lg:col-span-4 flex flex-col items-center justify-center relative min-h-[250px] border-t lg:border-t-0 lg:border-l border-slate-900 pt-6 lg:pt-0 lg:pl-8">
                      <div className="absolute inset-0 bg-amber-500/5 rounded-full blur-3xl animate-pulse"></div>
                      <PrivateersLogo size={200} className="drop-shadow-[0_0_20px_rgba(245,158,11,0.15)] relative z-10" />
                      <div className="mt-4 text-center z-10">
                        <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Commission Seal</p>
                        <p className="text-xs text-amber-500 font-serif font-semibold italic mt-1">&ldquo;One Ship. One Compass. One Course.&rdquo;</p>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Slide index indicators */}
                <div className="relative z-10 flex justify-center gap-2 mt-6 pt-4 border-t border-slate-900">
                  {infoSlides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveSlideIndex(idx)}
                      className={`h-1.5 rounded-full transition-all ${
                        activeSlideIndex === idx ? "bg-amber-500 w-10" : "bg-slate-800 hover:bg-slate-700 w-3"
                      }`}
                      title={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </section>

              {/* Dynamic Roll of Honor: Active & Former Leaders */}
              <section className="space-y-6 pt-6 border-t border-slate-900">
                <div className="text-center space-y-2">
                  <span className="px-3 py-1 rounded bg-slate-900 text-amber-500 text-[10px] font-bold font-mono tracking-widest uppercase border border-slate-850 inline-block">
                    ★ Roll of Honor ★
                  </span>
                  <h3 className="font-serif text-2xl md:text-3xl text-white font-bold text-center">
                    Sovereign Chapter Leadership
                  </h3>
                  <p className="text-xs text-slate-400 max-w-xl mx-auto font-light leading-relaxed">
                    Honoring the active commanders and alumni who guide and steer our fraternal legacy.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                  {/* Active Leadership */}
                  <div className="space-y-4">
                    <h4 className="font-serif text-base font-bold text-white border-b border-slate-900 pb-2 flex items-center gap-2">
                      <Shield size={16} className="text-amber-500" />
                      Active Officers
                    </h4>
                    <div className="space-y-4">
                      {leadership.filter(l => l.type === "Active").map(leader => (
                        <div key={leader.id} className="bg-slate-950 rounded-2xl p-4 sm:p-5 border border-slate-900 shadow-xl flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 hover:border-amber-500/20 transition-all duration-300">
                          <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 border border-amber-500/20 bg-slate-900">
                            <img src={leader.photo} alt={leader.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="space-y-1 flex-1">
                            <h5 className="font-serif text-sm font-bold text-white">{leader.name}</h5>
                            <p className="text-[10px] text-amber-500 font-mono font-semibold uppercase tracking-wider">{leader.role}</p>
                            <p className="text-xs text-slate-400 font-light leading-relaxed">{leader.biography}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Former Leaders / Alumni */}
                  <div className="space-y-4">
                    <h4 className="font-serif text-base font-bold text-white border-b border-slate-900 pb-2 flex items-center gap-2">
                      <Award size={16} className="text-slate-400" />
                      Fraternity Alumni & Legends
                    </h4>
                    <div className="space-y-4">
                      {leadership.filter(l => l.type === "Former").map(leader => (
                        <div key={leader.id} className="bg-slate-950 rounded-2xl p-4 sm:p-5 border border-slate-900 shadow-xl flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 hover:border-slate-800 transition-all duration-300">
                          <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 border border-slate-800 bg-slate-900 grayscale">
                            <img src={leader.photo} alt={leader.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="space-y-1 flex-1">
                            <h5 className="font-serif text-sm font-bold text-white">{leader.name}</h5>
                            <p className="text-[10px] text-slate-500 font-mono font-semibold uppercase tracking-wider">{leader.role}</p>
                            <p className="text-xs text-slate-400 font-light leading-relaxed">{leader.biography}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* Grid Section for Events, Community Service & Constitution Archives */}
              <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6 border-t border-slate-900">
                
                {/* Events & Community Service panel (LHS) */}
                <div className="lg:col-span-7 space-y-6 text-left">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono text-amber-500 font-bold uppercase tracking-widest">ACTIVITIES LOG</span>
                    <h4 className="font-serif text-xl font-bold text-white">Events & Community Service</h4>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Event Item */}
                    <div className="p-4 bg-slate-950 rounded-xl border border-slate-900 space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 text-[10px] font-mono text-amber-500">
                        <span>★ PUBLIC ASSEMBLY</span>
                        <span>JULY 24, 2026</span>
                      </div>
                      <h5 className="font-serif text-sm font-bold text-white">Mid-Year Chapter Conclave</h5>
                      <p className="text-xs text-slate-400 font-light leading-relaxed">
                        Gathering of all deck hands to audit Quartermaster&apos;s ledger books and review regional service briefs. Local Provincial captains present.
                      </p>
                    </div>

                    {/* Community Service Item */}
                    <div className="p-4 bg-slate-950 rounded-xl border border-slate-900 space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 text-[10px] font-mono text-emerald-400">
                        <span>♥ CIVIC ENGAGEMENT</span>
                        <span>ONGOING</span>
                      </div>
                      <h5 className="font-serif text-sm font-bold text-white">Coastal Sanitation & Youth Mentoring</h5>
                      <p className="text-xs text-slate-400 font-light leading-relaxed">
                        Privateers organize quarterly environmental cleanliness runs at Delta harbor margins, alongside leadership classes for local coastal youth.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Concilif Calendar (RHS) */}
                <div className="lg:col-span-5 space-y-6 text-left">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono text-amber-500 font-bold uppercase tracking-widest">CONCILIF CALENDAR</span>
                    <h4 className="font-serif text-xl font-bold text-white">Sovereign Conclave Schedule</h4>
                  </div>

                  <div className="bg-slate-950 rounded-2xl p-6 border border-slate-900 flex flex-col items-center justify-center text-center space-y-4 min-h-[300px]">
                    <div className="w-12 h-12 rounded-full bg-amber-950/40 border border-amber-900/50 flex items-center justify-center text-amber-500">
                      <Lock size={20} className="animate-pulse" />
                    </div>
                    <div className="space-y-1.5">
                      <h5 className="text-sm font-bold font-serif text-slate-200">Cryptographical Clearance Required</h5>
                      <p className="text-[11px] text-slate-400 font-light max-w-[280px] leading-relaxed mx-auto">
                        Official conclave times, dates, and locations are restricted to commissioned privateers.
                      </p>
                    </div>
                    <Link
                      href="/portal"
                      className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-[10px] font-mono font-bold uppercase tracking-widest rounded-xl hover:brightness-110 shadow-lg shadow-amber-950/20"
                    >
                      Quarterdeck Login
                    </Link>
                  </div>
                </div>

              </section>
            </motion.div>
          )}

          {activeTab === "blog" && (
            <motion.div
              key="blog"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-8 text-left"
            >
              {selectedArticle ? (
                /* Detail Article View */
                <article className="max-w-4xl mx-auto bg-slate-950 rounded-2xl border border-slate-900 p-6 md:p-10 space-y-6 shadow-2xl">
                  {/* Back button */}
                  <button 
                    onClick={() => setSelectedArticle(null)}
                    className="text-xs font-bold text-amber-500 uppercase flex items-center gap-1.5 hover:text-amber-400 transition-colors cursor-pointer"
                  >
                    ← Back to Scribe Dispatches
                  </button>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-[10px] font-mono font-bold uppercase text-amber-500">
                      <span>{selectedArticle.date}</span>
                      <span>•</span>
                      <span>{selectedArticle.category}</span>
                    </div>
                    <h1 className="font-serif text-2xl md:text-4xl text-white font-extrabold leading-tight">
                      {selectedArticle.title}
                    </h1>
                    <div className="flex items-center gap-3 py-3 border-y border-slate-900 text-xs text-slate-400">
                      <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-amber-500 text-[10px] font-bold font-mono">
                        {(selectedArticle.rank || selectedArticle.authorRank || "PRI").substring(0, 3).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-white">{selectedArticle.author || selectedArticle.authorName}</p>
                        <p className="text-slate-500 font-mono text-[9px] tracking-wider uppercase">{selectedArticle.rank || selectedArticle.authorRank}</p>
                      </div>
                      {selectedArticle.readTime && (
                        <div className="ml-auto text-slate-500 font-mono flex items-center gap-1">
                          <Clock size={12} /> {selectedArticle.readTime}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="w-full h-80 relative rounded-xl overflow-hidden shadow-inner border border-slate-900">
                    <img src={selectedArticle.image} alt={selectedArticle.title} className="object-cover w-full h-full" />
                  </div>

                  {/* Article content body */}
                  <div className="text-sm text-slate-300 leading-relaxed font-light space-y-4 prose prose-invert max-w-none">
                    <p className="first-letter:text-5xl first-letter:font-serif first-letter:font-extrabold first-letter:float-left first-letter:mr-3 first-letter:text-amber-500">
                      {selectedArticle.content}
                    </p>
                  </div>

                  <div className="border-t border-slate-900 pt-6">
                    <h4 className="font-serif text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <MessageSquare size={18} className="text-amber-500" />
                      Dispatches Comments ({selectedArticle.comments ? selectedArticle.comments.length : 0})
                    </h4>
                    {(!selectedArticle.comments || selectedArticle.comments.length === 0) ? (
                      <p className="text-xs text-slate-500 italic">No formal scribed comments on this dispatch yet.</p>
                    ) : (
                      <div className="space-y-4">
                        {selectedArticle.comments.map((com: any, i: number) => (
                          <div key={i} className="bg-slate-900/50 rounded-lg p-4 border border-slate-850 space-y-1.5">
                            <div className="flex items-center justify-between text-[10px] font-mono text-slate-550">
                              <span className="font-bold text-slate-300">{com.author || com.authorName}</span>
                              <span>{com.date || "Just now"}</span>
                            </div>
                            <p className="text-xs text-slate-400 font-light leading-relaxed">{com.content}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              ) : (
                /* Blog Listing View */
                <div className="space-y-8">
                  <div className="text-center max-w-2xl mx-auto space-y-3">
                    <span className="text-xs font-bold tracking-widest uppercase text-amber-500 font-mono">Captain&apos;s Log Book</span>
                    <h2 className="text-3xl font-serif text-white font-bold tracking-tight">
                      Scribe Dispatches & Captain&apos;s Logs
                    </h2>
                    <div className="w-20 h-0.5 bg-amber-500 mx-auto rounded-full"></div>
                  </div>

                  {/* Filters & Search */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-950 p-4 rounded-xl border border-slate-900">
                    {/* Search */}
                    <div className="relative w-full sm:flex-1">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                      <input
                        type="text"
                        placeholder="Search logs, dispatches, tags..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-850 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-amber-500 transition-colors"
                      />
                    </div>

                    {/* Category tabs */}
                    <div className="flex flex-wrap gap-1.5">
                      {["All", "Announcements", "Welfare", "Expeditions"].map(cat => (
                        <button
                          key={cat}
                          onClick={() => setBlogCategory(cat)}
                          className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                            blogCategory === cat 
                              ? "bg-amber-500 border-amber-500 text-slate-950 shadow-sm" 
                              : "border-slate-800 text-slate-400 hover:bg-slate-900"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Blog Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {filteredBlogPosts.length === 0 ? (
                      <div className="col-span-full text-center py-12 text-slate-500 font-light">
                        No dispatches found matching your search. Try resetting filters.
                      </div>
                    ) : (
                      filteredBlogPosts.map(post => (
                        <div 
                          key={post.id}
                          onClick={() => setSelectedArticle(post)}
                          className="bg-slate-950 rounded-2xl overflow-hidden border border-slate-900 shadow-xl hover:border-amber-500/15 transition-all duration-300 flex flex-col cursor-pointer"
                        >
                          <div className="h-48 w-full relative">
                            <img src={post.image || "https://picsum.photos/seed/nautical/600/400"} alt={post.title} className="object-cover w-full h-full" />
                            <span className="absolute top-4 left-4 px-2.5 py-1 text-[9px] font-bold font-mono uppercase bg-slate-950/90 text-amber-500 border border-slate-850 rounded tracking-wider backdrop-blur-sm">
                              {post.category}
                            </span>
                          </div>
                          
                          <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                            <div className="space-y-2">
                              <div className="text-[10px] font-mono text-slate-550 font-semibold">{post.date || "July 20, 2026"}</div>
                              <h4 className="font-serif text-lg font-bold text-white line-clamp-2 hover:text-amber-500 transition-colors">
                                {post.title}
                              </h4>
                              <p className="text-xs text-slate-400 font-light line-clamp-3">
                                {post.summary || post.content}
                              </p>
                            </div>

                            <div className="pt-4 border-t border-slate-900 flex items-center justify-between text-xs text-slate-500 font-mono">
                              <span>By: {(post.author || post.authorName || "Admiral").split(" ").slice(-1)[0]}</span>
                              <span className="flex items-center gap-1"><Clock size={12} /> {post.readTime || "2 min"}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dispatch Contact Form (Email Us) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-950 border border-slate-900 rounded-3xl p-4 sm:p-6 md:p-10 text-left">
          <div className="lg:col-span-5 space-y-4">
            <span className="px-3 py-1 rounded bg-slate-900 text-amber-500 text-[10px] font-bold font-mono tracking-widest uppercase border border-slate-850 inline-block">
              ★ DISPATCH CHANNEL ★
            </span>
            <h3 className="font-serif text-2xl md:text-3xl font-extrabold text-white">Transmit a Fleet Inquiry</h3>
            <p className="text-xs text-slate-450 leading-relaxed font-light">
              Submit your inquiry directly to Chapter Scribe Edward Teach. Dispatches are entered into our physical registry queue and audited at weekly harbor briefings.
            </p>
            
            <div className="space-y-2 pt-2 text-xs font-mono text-slate-400">
              <p className="flex items-center gap-2">
                <span className="text-amber-500">🧭</span> Scribe Mailbox: <span className="text-white font-semibold">scribe@corsairs-fellowship.org</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-amber-500">🧭</span> Command Office: <span className="text-white font-semibold">joedoe@gmail.com</span>
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 bg-slate-900/40 p-4 sm:p-6 rounded-2xl border border-slate-850">
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold font-mono text-slate-450 uppercase tracking-wider">Your Name</label>
                  <input
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    placeholder="Candidate Drake"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-850 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold font-mono text-slate-450 uppercase tracking-wider">Your Email</label>
                  <input
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    placeholder="drake@merchant-delta.com"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-850 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20"
                  />
                </div>
              </div>

              {/* Target Scribe Mailbox Selection */}
              <div className="space-y-1">
                <label className="text-[9px] font-bold font-mono text-slate-450 uppercase tracking-wider block text-left">Target Scribe Mailbox</label>
                <select
                  value={contactForm.targetEmail}
                  onChange={(e) => setContactForm({ ...contactForm, targetEmail: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-850 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20"
                >
                  {adminEmails.map((email) => {
                    let label = "General Inquiries";
                    if (email.startsWith("dispatch")) label = "Fleet Dispatch Operations";
                    if (email.startsWith("business")) label = "Business, Alliances & Conclaves";
                    return (
                      <option key={email} value={email}>
                        {email} ({label})
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold font-mono text-slate-450 uppercase tracking-wider">Subject</label>
                <input
                  type="text"
                  required
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                  placeholder="Letters of Marque / Fellowship Commission Inquiry"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-850 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold font-mono text-slate-450 uppercase tracking-wider">Message Description</label>
                <textarea
                  rows={4}
                  required
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  placeholder="Draft your formal message here..."
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-850 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold uppercase text-xs rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/5"
              >
                <Mail size={13} /> Transmit dispatch message
              </button>
              
              {contactSuccess && (
                <p className="text-[10px] text-emerald-400 text-center font-mono pt-1">
                  ✓ Dispatch successfully logged onto Scribe Conclave Diary & pending audit.
                </p>
              )}
            </form>
          </div>
        </section>

        {/* Social Media Column Block (Requested: "In other designs, at the bottom and the side, you can use these for followers...") */}
        <section className="bg-slate-950 border border-slate-900 rounded-3xl p-4 sm:p-6 md:p-10 space-y-6 text-left">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-900 pb-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-amber-500 font-bold uppercase tracking-widest">FLEET SIGNAL CHANNELS</span>
              <h4 className="font-serif text-lg font-bold text-white">Follow the Bearing & Broaden the Reach</h4>
            </div>
            <p className="text-xs text-slate-550 max-w-sm font-light">
              Join thousands of maritime professionals and leaders. Receive clear signaling and verified chapter logs instantly.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { 
                channel: "Twitter / X", 
                tag: "@PrivateerSovereign", 
                followers: "12.4K Mariners", 
                status: "Course Locked", 
                icon: Twitter,
                color: "text-sky-400"
              },
              { 
                channel: "Instagram", 
                tag: "@CorsairsFellowship", 
                followers: "24.1K Sea Wolves", 
                status: "Clear Signal", 
                icon: Instagram,
                color: "text-pink-500"
              },
              { 
                channel: "LinkedIn", 
                tag: "CORSAIRS🧭", 
                followers: "8.9K Professionals", 
                status: "All Hands Together", 
                icon: Linkedin,
                color: "text-blue-500"
              },
              { 
                channel: "YouTube", 
                tag: "Privateers & Corsairs TV", 
                followers: "45.2K Subscribers", 
                status: "Until Safe Harbor", 
                icon: Youtube,
                color: "text-red-500"
              }
            ].map((soc, i) => (
              <div key={i} className="bg-slate-900/40 p-4 rounded-xl border border-slate-850 space-y-3 flex flex-col justify-between hover:border-amber-500/10 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono font-semibold text-slate-500 uppercase tracking-widest">SIGNAL 0{i+1}</span>
                  <soc.icon size={16} className={soc.color} />
                </div>
                <div className="space-y-1">
                  <h5 className="text-xs font-bold text-white font-serif">{soc.channel}</h5>
                  <p className="text-[10px] text-slate-400 font-mono">{soc.tag}</p>
                </div>
                <div className="border-t border-slate-850/60 pt-2 flex items-center justify-between text-[10px]">
                  <span className="text-amber-500 font-bold">{soc.followers}</span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-950 text-slate-500 font-mono text-[8px] uppercase">{soc.status}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* Footer Block */}
      <footer className="w-full bg-slate-950 text-slate-400 py-12 border-t border-slate-900 mt-16 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          {/* Brand section */}
          <div className="flex flex-col md:flex-row items-center gap-3">
            <PrivateersLogo size={55} />
            <div className="space-y-0.5">
              <p className="font-serif text-base text-amber-500 font-bold tracking-wide">
                National Association of Privateers
              </p>
              <p className="text-xs text-slate-500 font-mono uppercase tracking-wider">
                CORSAIRS 🧭 Unithel Mariners Association — Gentlemen of Fortune, Bound by Honor.
              </p>
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-slate-400">
            <button onClick={() => setShowLegal("privacy")} className="hover:text-white transition-colors cursor-pointer">Privacy Policy</button>
            <button onClick={() => setShowLegal("terms")} className="hover:text-white transition-colors cursor-pointer">Terms of Commission</button>
            <Link href="/portal?mode=register" className="hover:text-amber-500 transition-colors">Apply for Commission</Link>
            <Link href="/portal?mode=login" className="hover:text-amber-500 transition-colors">Marque Access</Link>
          </div>

          {/* Copyright with Symbolic Nautical Motto */}
          <div className="text-center md:text-right space-y-1">
            <p className="text-[10px] text-amber-500/60 font-mono italic">&ldquo;Until Safe Harbor&rdquo;</p>
            <p className="text-xs text-slate-600 font-mono">
              © 2026 National Association of Privateers — Unithel Mariners Association. All Marques Sovereign.
            </p>
          </div>
        </div>
      </footer>

      {/* Legal Popups */}
      {showLegal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-950 text-slate-350 rounded-2xl border border-slate-900 max-w-2xl w-full p-6 sm:p-8 space-y-4 max-h-[85vh] overflow-y-auto relative shadow-2xl"
          >
            <button 
              onClick={() => setShowLegal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
            >
              <X size={20} />
            </button>

            {showLegal === "privacy" ? (
              <div className="space-y-4 text-left">
                <h3 className="font-serif text-2xl text-white font-bold tracking-tight">Privacy Policy</h3>
                <div className="h-0.5 bg-amber-500 w-16"></div>
                <div className="text-xs text-slate-400 leading-relaxed font-light space-y-3">
                  <p className="font-semibold text-amber-500">1. Privateer Data Confidentiality</p>
                  <p>CORSAIRS🧭 guarantees that all private member information (NIN, email details, residential provincial address, and MQE commission histories) is held under absolute seal. No data is ever leased or shared with external merchant networks.</p>
                  
                  <p className="font-semibold text-amber-500">2. Portal Cryptography</p>
                  <p>Our secure member portal utilizes advanced cryptographic handshakes to encrypt sessions and secure signatures. Your verified digital MQE credential serves as your secure token.</p>

                  <p className="font-semibold text-amber-500">3. Ledger Auditing</p>
                  <p>All financial logs, dues recorded, and emergency relief cargo distributions are audited manually on physical paper scales by the Quartermaster General jack Sparrow. Digital ledger monitors are for internal member transparency only.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-left">
                <h3 className="font-serif text-2xl text-white font-bold tracking-tight">Terms of Commission</h3>
                <div className="h-0.5 bg-amber-500 w-16"></div>
                <div className="text-xs text-slate-400 leading-relaxed font-light space-y-3">
                  <p className="font-semibold text-amber-500">1. Covenant of Honor</p>
                  <p>All members sailing under our colors pledge solemn alignment with the Corsair Code of Conduct. Disputes must be referred directly to the Admiralty Council for strategic arbitration. Decisions approved by the Lord Admiral are final.</p>
                  
                  <p className="font-semibold text-amber-500">2. Ledger Dues & Stability</p>
                  <p>Every commissioned Privateer is obligated to clear monthly and annual dues directly to the Quartermaster General. Failure to balance outstanding contributions for three consecutive moons will result in commission suspension.</p>

                  <p className="font-semibold text-amber-500">3. Secret Ballot Protocol</p>
                  <p>Every active Privateer is entitled to exactly one secret ballot in regional leadership assemblies. Proxy voting is prohibited. The Master of the Fleet ensures absolute neutrality and logs the secret status of all elections.</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}

      {/* Real-time Notification System Toaster */}
      <div className="fixed top-6 right-6 z-50 space-y-3 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {notifications.map((notif) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              className="pointer-events-auto w-full bg-slate-950 border border-slate-900 rounded-xl p-4 shadow-2xl border-l-4 border-l-amber-500 flex items-start gap-3"
            >
              <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 flex-shrink-0 animate-pulse"></div>
              <div className="flex-1 text-left space-y-0.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-amber-500 uppercase tracking-widest">{notif.title}</span>
                  <span className="text-[8px] font-mono text-slate-500 uppercase">REAL-TIME</span>
                </div>
                <p className="text-xs text-slate-350 font-light leading-relaxed">{notif.message}</p>
              </div>
              <button 
                onClick={() => setNotifications(prev => prev.filter(n => n.id !== notif.id))}
                className="text-slate-600 hover:text-white transition-colors cursor-pointer text-xs"
              >
                ✕
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

    </div>
  );
}
