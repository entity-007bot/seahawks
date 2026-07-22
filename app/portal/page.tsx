"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Lock, 
  Mail, 
  User, 
  Phone, 
  MapPin, 
  FileText, 
  Briefcase, 
  Image, 
  ChevronRight, 
  ChevronLeft, 
  ShieldCheck, 
  RefreshCw,
  Compass,
  ArrowLeft,
  X
} from "lucide-react";
import Link from "next/link";
import { PrivateersLogo } from "@/components/privateers-logo";
import { useRouter } from "next/navigation";

export default function PortalPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register" | "forgot" | "reset" | "verify">("login");
  const [loginForm, setLoginForm] = useState({ emailOrMqe: "", password: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  
  // Registration wizard steps
  const [regStep, setRegStep] = useState(1);
  const [regForm, setRegForm] = useState({
    name: "",
    password: "",
    preferredName: "",
    dob: "",
    gender: "Male",
    nationality: "Nigerian",
    state: "Delta",
    lga: "Warri South",
    occupation: "",
    phone: "",
    email: "",
    address: "",
    emergencyName: "",
    emergencyRelation: "Relative",
    emergencyPhone: "",
    skills: "",
    profession: "",
    biography: "",
    profilePhoto: "",
    nin: "",
    voterId: "",
    refereeMqe: ""
  });

  useEffect(() => {
    // Sync the URL mode param if present
    const urlParams = new URLSearchParams(window.location.search);
    const m = urlParams.get("mode");
    if (m && ["login", "register", "forgot", "reset", "verify"].includes(m)) {
      setTimeout(() => {
        setMode(m as any);
      }, 0);
    }
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const credentials = loginForm.emailOrMqe.trim().toLowerCase();
    const password = loginForm.password;

    try {
      // 1. Try server-side admin login first
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emailOrMqe: credentials, password }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const sessionUser = {
            ...data.user,
            token: data.token
          };
          localStorage.setItem("privateers_session", JSON.stringify(sessionUser));
          localStorage.removeItem("privateers_logged_out");

          // Log the successful login in Audit Trails
          const dbLogs = JSON.parse(localStorage.getItem("privateers_db_logs") || "[]");
          dbLogs.push({
            id: `log_${Date.now()}`,
            userEmail: sessionUser.email,
            userName: sessionUser.name,
            userMqe: sessionUser.mqeNumber,
            action: "SUPER_ADMIN_LOGGED_IN",
            timestamp: new Date().toISOString(),
            details: `Super-Admin logged in securely with JWT token authentication.`
          });
          localStorage.setItem("privateers_db_logs", JSON.stringify(dbLogs));

          setSuccessMsg("✓ Sovereign Clearance Approved. Entering Admiralty Command Deck...");
          setTimeout(() => {
            router.push("/dashboard");
          }, 1200);
          return;
        }
      }

      // If they entered the admin email but failed the password check, reject outright
      const adminEmail = "admin@saeahawks.org";
      if (credentials === adminEmail.toLowerCase() || credentials === "admin") {
        setErrorMsg("✕ Unauthorized administrative credentials. Password validation failed.");
        return;
      }

      // 2. Fallback to normal member local-storage check
      const dbMembers = JSON.parse(localStorage.getItem("privateers_db_members") || "[]");
      const defaults = [
        { email: "davidchukwuyem73@gmail.com", name: "Admiral David Chukwuyem", mqeNumber: "MQE-0000001", rank: "Admiral", status: "Active", password: "password" },
        { email: "jack@corsairs.org", name: "Jack Sparrow", mqeNumber: "MQE-0000123", rank: "Quartermaster", status: "Active", password: "password" },
        { email: "anne@corsairs.org", name: "Anne Bonny", mqeNumber: "MQE-0000244", rank: "Privateer", status: "Active", password: "password" },
        { email: "edward@corsairs.org", name: "Edward Teach", mqeNumber: "MQE-0000018", rank: "Scribe", status: "Active", password: "password" },
        { email: "henry@corsairs.org", name: "Henry Morgan", mqeNumber: "MQE-0001092", rank: "Recruit", status: "Pending", password: "password" }
      ];

      const foundUser = dbMembers.find((m: any) => 
        (m.email && m.email.toLowerCase() === credentials) || 
        (m.mqeNumber && m.mqeNumber.toLowerCase() === credentials)
      ) || defaults.find(d => 
        (d.email && d.email.toLowerCase() === credentials) || 
        (d.mqeNumber && d.mqeNumber.toLowerCase() === credentials)
      );

      if (foundUser) {
        // Enforce Password check
        const expectedPassword = foundUser.password || "password";
        if (password !== expectedPassword) {
          setErrorMsg("✕ Invalid password entered. Please check your password and try again.");
          return;
        }

        // Successful login! Set logged-in session in localStorage
        const sessionUser = {
          id: foundUser.id || "mem_1",
          email: foundUser.email,
          name: foundUser.name,
          mqeNumber: foundUser.mqeNumber || foundUser.mqe,
          rank: foundUser.rank,
          status: foundUser.status,
          superAdmin: false
        };
        localStorage.setItem("privateers_session", JSON.stringify(sessionUser));
        localStorage.removeItem("privateers_logged_out");
        
        // Log the successful login in Audit Trails
        const dbLogs = JSON.parse(localStorage.getItem("privateers_db_logs") || "[]");
        dbLogs.push({
          id: `log_${Date.now()}`,
          userEmail: sessionUser.email,
          userName: sessionUser.name,
          userMqe: sessionUser.mqeNumber,
          action: "MEMBER_LOGGED_IN",
          timestamp: new Date().toISOString(),
          details: `Member logged in successfully. Assigned role: ${sessionUser.rank}.`
        });
        localStorage.setItem("privateers_db_logs", JSON.stringify(dbLogs));

        setSuccessMsg("✓ Clearance approved. Entering the Quarterdeck...");
        setTimeout(() => {
          router.push("/dashboard");
        }, 1200);
      } else {
        setErrorMsg("✕ Unauthorized credentials. Ensure your MQE Number is registered on the Scribe's Ledger.");
      }
    } catch (err) {
      setErrorMsg("✕ Error logging in. Security handshake error.");
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    // Validation
    if (!regForm.name || !regForm.email || !regForm.phone) {
      setErrorMsg("✕ Please complete all required fleet logs.");
      return;
    }

    try {
      // Auto-generate a fully random 7-digit MQE number and new ID
      const randomMqe = `MQE-${Math.floor(1000000 + Math.random() * 9000000)}`;
      const newMember = {
        id: `mem_${Date.now()}`,
        mqeNumber: randomMqe,
        name: regForm.name,
        password: regForm.password || "password",
        preferredName: regForm.preferredName || regForm.name.split(" ")[0],
        dob: regForm.dob || "1995-01-01",
        gender: regForm.gender,
        nationality: regForm.nationality,
        state: regForm.state,
        lga: regForm.lga,
        occupation: regForm.occupation || "Maritime Seafarer",
        phone: regForm.phone,
        email: regForm.email,
        residentialAddress: regForm.address || "GND Chapter Territory",
        emergencyContact: {
          name: regForm.emergencyName || "Chapter Warden",
          relation: regForm.emergencyRelation || "Associate",
          phone: regForm.emergencyPhone || "+234 800 000 0000"
        },
        skills: regForm.skills ? regForm.skills.split(",").map(s => s.trim()) : ["Marine Navigation"],
        profession: regForm.profession || "Seafarer",
        biography: regForm.biography || "Pledged candidate of the National Association of Privateers.",
        dateJoined: new Date().toISOString().split("T")[0],
        rank: "Recruit",
        status: "Pending",
        fleet: "Brass River Fleet",
        chapter: "Great Niger Delta Chapter",
        committee: "Maritime Logistics & Events Committee",
        serviceRecord: ["Recruit Application Filed (July 2026)"],
        awards: [],
        disciplinaryRecord: [],
        profilePhoto: regForm.profilePhoto || `https://picsum.photos/seed/${regForm.preferredName || "recruit"}/400/400`,
        qrCodeCheckins: [],
        nin: regForm.nin,
        voterId: regForm.voterId,
        refereeMqe: regForm.refereeMqe
      };

      // Add to localStorage DB members list
      const currentMembers = JSON.parse(localStorage.getItem("privateers_db_members") || "[]");
      currentMembers.push(newMember);
      localStorage.setItem("privateers_db_members", JSON.stringify(currentMembers));

      // Add corresponding application
      const currentApps = JSON.parse(localStorage.getItem("privateers_db_apps") || "[]");
      currentApps.push({
        id: `app_${Date.now()}`,
        memberId: newMember.id,
        interviewStatus: "Pending",
        backgroundStatus: "Pending",
        adminNotes: "Submitted through Recruitment Portal. Awaiting Admiral's Audit.",
        approvalStatus: "Pending",
        approvalHistory: [
          {
            status: "Pending",
            updatedBy: "Portal system",
            updatedAt: new Date().toISOString(),
            comment: "Application registered. Background audit initiated."
          }
        ]
      });
      localStorage.setItem("privateers_db_apps", JSON.stringify(currentApps));

      // Record in Audit logs
      const dbLogs = JSON.parse(localStorage.getItem("privateers_db_logs") || "[]");
      dbLogs.push({
        id: `log_${Date.now()}`,
        userEmail: newMember.email,
        userName: newMember.name,
        userMqe: randomMqe,
        action: "RECRUIT_REGISTRATION",
        timestamp: new Date().toISOString(),
        details: `New recruitment log submitted: ${newMember.name}. Temporary Marque assigned: ${randomMqe}`
      });
      localStorage.setItem("privateers_db_logs", JSON.stringify(dbLogs));

      setSuccessMsg(`✓ Application Logged. Assigned Temp MQE: ${randomMqe}. Redirecting to Login...`);
      setTimeout(() => {
        setLoginForm({ emailOrMqe: randomMqe, password: "password" });
        setMode("login");
        setRegStep(1);
      }, 3500);

    } catch (err) {
      setErrorMsg("✕ Failed to lodge recruitment file. Scribe desk is currently busy.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-slate-950 relative overflow-hidden">
      {/* Wave/ocean-like background accents */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-blue-950/30 via-slate-950 to-slate-950 z-0"></div>
      <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-red-950/15 rounded-full blur-3xl z-0"></div>

      {/* Main card box */}
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative z-10 max-w-xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 text-white shadow-2xl flex flex-col items-center space-y-8"
      >
        {/* Top Header back action */}
        <div className="w-full flex items-center justify-between border-b border-slate-800/80 pb-4">
          <Link href="/" className="text-xs font-bold font-mono text-slate-400 hover:text-white transition-colors flex items-center gap-1.5">
            <ArrowLeft size={14} /> Back to Public Deck
          </Link>
          <span className="text-[10px] font-mono text-amber-500 font-bold uppercase tracking-widest bg-amber-950/40 border border-amber-900/50 px-2.5 py-1 rounded">
            Fraternal Ledger v1.2
          </span>
        </div>

        {/* Brand Logo & Title */}
        <div className="flex flex-col items-center text-center space-y-3">
          <PrivateersLogo size={105} className="drop-shadow-[0_8px_20px_rgba(245,158,11,0.15)] filter" />
          <div className="space-y-1">
            <h1 className="font-serif text-2xl font-extrabold text-amber-500 tracking-wide">
              {mode === "login" && "Enter the Quarterdeck"}
              {mode === "register" && "Recruitment Pledge Portal"}
              {mode === "forgot" && "Scribe Seal Retrieval"}
              {mode === "verify" && "Verify Marque Commission"}
            </h1>
            <p className="text-xs text-slate-400 font-light max-w-sm">
              {mode === "login" && "Transmit your unique MQE Number or Email to authenticate credentials."}
              {mode === "register" && "File your formal credentials to pledge alliance and request Letters of Marque."}
              {mode === "forgot" && "Input your registered email to request a secure Scribe credential reset link."}
              {mode === "verify" && "Provide your MQE number to verify active commission."}
            </p>
          </div>
        </div>

        {/* Global Errors/Success */}
        {errorMsg && (
          <div className="w-full p-4 bg-red-950/40 border border-red-900/50 rounded-xl text-xs text-red-300 font-light text-center leading-relaxed">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="w-full p-4 bg-emerald-950/40 border border-emerald-900/50 rounded-xl text-xs text-emerald-300 font-light text-center leading-relaxed">
            {successMsg}
          </div>
        )}

        {/* Mode Form Renderings */}
        <div className="w-full">
          <AnimatePresence mode="wait">
            {mode === "login" && (
              <motion.form 
                key="login"
                onSubmit={handleLoginSubmit}
                className="space-y-5"
              >
                {/* Credentials */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
                    <span>MQE Number or Email</span>
                    <span className="text-amber-500 lowercase">(e.g. davidchukwuyem73@gmail.com)</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type="text"
                      required
                      value={loginForm.emailOrMqe}
                      onChange={(e) => setLoginForm({ ...loginForm, emailOrMqe: e.target.value })}
                      placeholder="MQE-XXXXXXX or email"
                      className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-red-800 transition-colors text-white"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider">
                    <span>Ledger Password</span>
                    <button type="button" onClick={() => setMode("forgot")} className="text-red-400 hover:text-red-300 lowercase font-medium">Forgot?</button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type="password"
                      required
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-red-800 transition-colors text-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-red-800 to-red-900 hover:from-red-700 hover:to-red-800 text-white font-bold tracking-widest text-xs uppercase rounded-xl border border-red-700 transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                >
                  <ShieldCheck size={14} className="text-amber-400" />
                  Request Clearance Log
                </button>

                <div className="text-center pt-2">
                  <span className="text-xs text-slate-400 font-light">New Candidate? </span>
                  <button type="button" onClick={() => setMode("register")} className="text-xs font-bold text-red-400 hover:text-red-300">Submit Onboarding Pledge</button>
                </div>
              </motion.form>
            )}

            {mode === "register" && (
              <motion.form 
                key="register"
                onSubmit={handleRegisterSubmit}
                className="space-y-6"
              >
                {/* Wizard step indicator */}
                <div className="flex items-center justify-between text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase border-b border-slate-800/50 pb-2">
                  <span>Step {regStep} of 3</span>
                  <span>{regStep === 1 ? "Identity Log" : regStep === 2 ? "Navigational Dockets" : "Pledge & Bio"}</span>
                </div>

                {regStep === 1 && (
                  <div className="space-y-4">
                    {/* Full Name */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider">Full Legal Name</label>
                      <input
                        type="text"
                        required
                        value={regForm.name}
                        onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                        placeholder="e.g. Captain Edward Teach"
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-red-800 transition-colors text-white"
                      />
                    </div>

                    {/* Preferred Name & Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider">Preferred Name</label>
                        <input
                          type="text"
                          required
                          value={regForm.preferredName}
                          onChange={(e) => setRegForm({ ...regForm, preferredName: e.target.value })}
                          placeholder="e.g. Blackbeard"
                          className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-red-800 transition-colors text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider">Email Address</label>
                        <input
                          type="email"
                          required
                          value={regForm.email}
                          onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                          placeholder="e.g. teach@corsairs.org"
                          className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-red-800 transition-colors text-white"
                        />
                      </div>
                    </div>

                    {/* Account Password */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider">Create Account Password</label>
                      <input
                        type="password"
                        required
                        value={regForm.password}
                        onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                        placeholder="Choose a password for login..."
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-red-800 transition-colors text-white font-mono"
                      />
                    </div>

                    {/* DOB & Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider">Date of Birth</label>
                        <input
                          type="date"
                          required
                          value={regForm.dob}
                          onChange={(e) => setRegForm({ ...regForm, dob: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-red-800 transition-colors text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider">Contact Phone</label>
                        <input
                          type="text"
                          required
                          value={regForm.phone}
                          onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                          placeholder="e.g. +234 803 111 2222"
                          className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-red-800 transition-colors text-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {regStep === 2 && (
                  <div className="space-y-4">
                    {/* State, LGA, Nationality */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider">State</label>
                        <input
                          type="text"
                          required
                          value={regForm.state}
                          onChange={(e) => setRegForm({ ...regForm, state: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-red-800 transition-colors text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider">LGA</label>
                        <input
                          type="text"
                          required
                          value={regForm.lga}
                          onChange={(e) => setRegForm({ ...regForm, lga: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-red-800 transition-colors text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider">Nationality</label>
                        <input
                          type="text"
                          required
                          value={regForm.nationality}
                          onChange={(e) => setRegForm({ ...regForm, nationality: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-red-800 transition-colors text-white"
                        />
                      </div>
                    </div>

                    {/* Residential Address */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider">Residential Address</label>
                      <input
                        type="text"
                        required
                        value={regForm.address}
                        onChange={(e) => setRegForm({ ...regForm, address: e.target.value })}
                        placeholder="Port Marina, Chapter Region, Delta State"
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-red-800 transition-colors text-white"
                      />
                    </div>

                    {/* Emergency Contact */}
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                      <span className="text-[10px] font-bold font-mono text-amber-500 uppercase tracking-wider">Next of Kin (Welfare Emergency)</span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <input
                          type="text"
                          required
                          placeholder="Contact Name"
                          value={regForm.emergencyName}
                          onChange={(e) => setRegForm({ ...regForm, emergencyName: e.target.value })}
                          className="sm:col-span-1.5 px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-red-800 text-white"
                        />
                        <input
                          type="text"
                          required
                          placeholder="Relation (e.g. Spouse)"
                          value={regForm.emergencyRelation}
                          onChange={(e) => setRegForm({ ...regForm, emergencyRelation: e.target.value })}
                          className="sm:col-span-0.5 px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-red-800 text-white"
                        />
                        <input
                          type="text"
                          required
                          placeholder="Emergency Phone"
                          value={regForm.emergencyPhone}
                          onChange={(e) => setRegForm({ ...regForm, emergencyPhone: e.target.value })}
                          className="sm:col-span-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-red-800 text-white"
                        />
                      </div>
                    </div>

                    {/* National & Fraternity Verification */}
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
                      <span className="text-[10px] font-bold font-mono text-amber-500 uppercase tracking-wider block">Security & National Verification</span>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider">National Identification Number (NIN)</label>
                          <input
                            type="text"
                            required
                            maxLength={11}
                            value={regForm.nin}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, "");
                              setRegForm({ ...regForm, nin: val });
                            }}
                            placeholder="11-digit NIN"
                            className="w-full px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-red-800 text-white"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider">Sponsoring Member MQE Number</label>
                          <input
                            type="text"
                            required
                            value={regForm.refereeMqe}
                            onChange={(e) => setRegForm({ ...regForm, refereeMqe: e.target.value })}
                            placeholder="e.g. MQE-0000018"
                            className="w-full px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-red-800 text-white"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider">Voter&apos;s Card VIN or Maritime ID (Other Verification)</label>
                        <input
                          type="text"
                          required
                          value={regForm.voterId}
                          onChange={(e) => setRegForm({ ...regForm, voterId: e.target.value })}
                          placeholder="e.g. VIN-1234567890 or MID-98765"
                          className="w-full px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-red-800 text-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {regStep === 3 && (
                  <div className="space-y-4">
                    {/* Skills & Profession */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider">Profession</label>
                        <input
                          type="text"
                          required
                          value={regForm.profession}
                          onChange={(e) => setRegForm({ ...regForm, profession: e.target.value })}
                          placeholder="e.g. Marine Engineer"
                          className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-red-800 transition-colors text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider">Nautical Skills (comma separated)</label>
                        <input
                          type="text"
                          required
                          value={regForm.skills}
                          onChange={(e) => setRegForm({ ...regForm, skills: e.target.value })}
                          placeholder="e.g. Navigation, Welding, Sonar"
                          className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-red-800 transition-colors text-white"
                        />
                      </div>
                    </div>

                    {/* Passport Photo Upload */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
                        <span>Upload Passport Photo</span>
                        <span className="text-amber-500 lowercase">Required for ID Card</span>
                      </label>
                      
                      <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-slate-950 border border-slate-800 rounded-xl">
                        {regForm.profilePhoto ? (
                          <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-700 flex-shrink-0">
                            <img
                              src={regForm.profilePhoto}
                              alt="Passport Preview"
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => setRegForm({ ...regForm, profilePhoto: "" })}
                              className="absolute top-0.5 right-0.5 p-1 bg-red-600 rounded-full text-white hover:bg-red-700 transition-colors"
                            >
                              <X size={10} />
                            </button>
                          </div>
                        ) : (
                          <div className="w-20 h-20 rounded-lg border-2 border-dashed border-slate-800 flex items-center justify-center bg-slate-900/40 text-slate-500 flex-shrink-0">
                            <User size={24} />
                          </div>
                        )}
                        
                        <div className="flex-1 w-full text-center sm:text-left space-y-1.5">
                          <p className="text-xs text-slate-300 font-light">Select or drag & drop your passport photo</p>
                          <p className="text-[10px] text-slate-500 font-mono">PNG, JPG or WEBP (Max 5MB)</p>
                          <input
                            type="file"
                            accept="image/*"
                            id="passport-upload"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setRegForm({ ...regForm, profilePhoto: reader.result as string });
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                          <label
                            htmlFor="passport-upload"
                            className="inline-block px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-bold rounded-lg cursor-pointer transition-colors"
                          >
                            Browse File
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Biography */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider">Seafarer Biography</label>
                      <textarea
                        rows={3}
                        required
                        value={regForm.biography}
                        onChange={(e) => setRegForm({ ...regForm, biography: e.target.value })}
                        placeholder="Brief background of your sea credentials and why you desire to pledge commission as a GND Corsair..."
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-red-800 transition-colors text-white"
                      ></textarea>
                    </div>
                  </div>
                )}

                {/* Wizard navigation buttons */}
                <div className="flex items-center justify-between gap-4 border-t border-slate-800/80 pt-4">
                  {regStep > 1 ? (
                    <button
                      type="button"
                      onClick={() => setRegStep(regStep - 1)}
                      className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                    >
                      <ChevronLeft size={16} /> Back
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setMode("login")}
                      className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                  )}

                  {regStep < 3 ? (
                    <button
                      type="button"
                      onClick={() => {
                        if (regStep === 1 && (!regForm.name || !regForm.email || !regForm.phone)) {
                          setErrorMsg("✕ Please lodge all active identity files first.");
                          setTimeout(() => setErrorMsg(""), 3000);
                          return;
                        }
                        setRegStep(regStep + 1);
                      }}
                      className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold uppercase rounded-xl flex items-center gap-1 transition-all"
                    >
                      Next <ChevronRight size={16} />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-gradient-to-r from-red-800 to-red-900 hover:from-red-700 hover:to-red-800 text-white text-xs font-bold uppercase rounded-xl border border-red-700 shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <ShieldCheck size={14} className="text-amber-400" />
                      Lodge Pledge File
                    </button>
                  )}
                </div>
              </motion.form>
            )}

            {mode === "forgot" && (
              <motion.form 
                key="forgot"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSuccessMsg("✓ Credentials transmitted. Scribe Teach has forwarded the reset links to your inbox.");
                  setTimeout(() => setMode("login"), 3000);
                }}
                className="space-y-5"
              >
                <div className="space-y-1">
                  <label className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider">Commission Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type="email"
                      required
                      placeholder="e.g. drake@vanguard.org"
                      className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-red-800 transition-colors text-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-slate-950 hover:bg-slate-800 text-white font-bold tracking-widest text-xs uppercase rounded-xl border border-slate-800 transition-all flex items-center justify-center gap-2 shadow-inner cursor-pointer"
                >
                  <RefreshCw size={12} className="text-amber-400 animate-spin" />
                  Recover Ledger Commission
                </button>

                <div className="text-center pt-2">
                  <button type="button" onClick={() => setMode("login")} className="text-xs font-bold text-red-400 hover:text-red-300">Return to Quarterdeck login</button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
