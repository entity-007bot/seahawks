"use client";

import React from "react";
import {
  Crown,
  Sparkles,
  Ship,
  Compass,
  Flag,
  Award,
  ShieldCheck,
  Swords,
  Shield,
  Scroll,
  Waves,
  Navigation,
  Anchor,
  ChevronUp,
  Star
} from "lucide-react";

export interface RankBadgeProps {
  rank: string | undefined | null;
  size?: "xs" | "sm" | "md" | "lg";
  showLabel?: boolean;
  showInsignia?: boolean;
  showTier?: boolean;
  className?: string;
  variant?: "badge" | "card" | "minimal" | "pill";
}

/**
 * Insignia is now expressed as real rank iconography instead of emoji:
 * - "chevrons": number of stacked chevrons (junior/mid ranks, Seaman Class + junior Privateer Class)
 * - "stars": number of stars (senior command ranks, mirrors real naval flag-officer insignia)
 * Rendered via <RankInsignia />, never emoji glyphs.
 */
export function getRankDetails(rankInput: string | undefined | null) {
  const r = (rankInput || "").trim().toLowerCase();

  // Tier 15 - Admiral / Supreme Command
  if (r.includes("admiral") || r.includes("lord admiral") || r.includes("grand admiral")) {
    return {
      name: "Admiral Privateer",
      shortName: "Admiral",
      class: "Privateer Class",
      tier: 15,
      stars: 4,
      chevrons: 0,
      Icon: Crown,
      bgClass: "bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-amber-500/10",
      gradientBg: "from-amber-500/30 via-yellow-500/20 to-amber-600/30",
      accentColor: "text-amber-400",
      glowColor: "shadow-amber-500/30"
    };
  }

  // Tier 14 - Commodore
  if (r.includes("commodore") || r.includes("admiralty council")) {
    return {
      name: "Commodore Privateer",
      shortName: "Commodore",
      class: "Privateer Class",
      tier: 14,
      stars: 3,
      chevrons: 0,
      Icon: Sparkles,
      bgClass: "bg-amber-400/20 text-amber-200 border-amber-400/40 shadow-amber-400/10",
      gradientBg: "from-amber-400/20 via-amber-500/15 to-yellow-500/20",
      accentColor: "text-amber-300",
      glowColor: "shadow-amber-400/20"
    };
  }

  // Tier 13 - Captain
  if (r.includes("captain") || r.includes("ship captain")) {
    return {
      name: "Captain Privateer",
      shortName: "Captain",
      class: "Privateer Class",
      tier: 13,
      stars: 2,
      chevrons: 0,
      Icon: Ship,
      bgClass: "bg-amber-600/20 text-amber-300 border-amber-500/40",
      gradientBg: "from-amber-600/20 to-amber-700/20",
      accentColor: "text-amber-400",
      glowColor: "shadow-amber-600/20"
    };
  }

  // Tier 12 - Commander / Fleet Master
  if (r.includes("commander") || r.includes("fleet master")) {
    return {
      name: "Commander Privateer",
      shortName: "Commander",
      class: "Privateer Class",
      tier: 12,
      stars: 1,
      chevrons: 0,
      Icon: Compass,
      bgClass: "bg-sky-500/20 text-sky-300 border-sky-500/40",
      gradientBg: "from-sky-500/20 to-blue-600/20",
      accentColor: "text-sky-400",
      glowColor: "shadow-sky-500/20"
    };
  }

  // Tier 11 - Lieutenant / First Lieutenant / Navigator General
  if (r.includes("lieutenant") || r.includes("navigator")) {
    return {
      name: "Lieutenant Privateer",
      shortName: "Lieutenant",
      class: "Privateer Class",
      tier: 11,
      stars: 0,
      chevrons: 5,
      Icon: Flag,
      bgClass: "bg-blue-500/20 text-blue-300 border-blue-500/40",
      gradientBg: "from-blue-500/20 to-indigo-600/20",
      accentColor: "text-blue-400",
      glowColor: "shadow-blue-500/20"
    };
  }

  // Tier 10 - Master Privateer / Quartermaster / Boatswain
  if (r.includes("master") || r.includes("quartermaster") || r.includes("boatswain")) {
    return {
      name: "Master Privateer",
      shortName: "Master Privateer",
      class: "Privateer Class",
      tier: 10,
      stars: 0,
      chevrons: 4,
      Icon: Award,
      bgClass: "bg-purple-500/20 text-purple-300 border-purple-500/40",
      gradientBg: "from-purple-500/20 to-indigo-600/20",
      accentColor: "text-purple-400",
      glowColor: "shadow-purple-500/20"
    };
  }

  // Tier 9 - Senior Privateer / Scribe / Harbor Master
  if (r.includes("senior privateer") || r.includes("scribe") || r.includes("harbor")) {
    return {
      name: "Senior Privateer",
      shortName: "Senior Privateer",
      class: "Privateer Class",
      tier: 9,
      stars: 0,
      chevrons: 3,
      Icon: ShieldCheck,
      bgClass: "bg-teal-500/20 text-teal-300 border-teal-500/40",
      gradientBg: "from-teal-500/20 to-emerald-600/20",
      accentColor: "text-teal-400",
      glowColor: "shadow-teal-500/20"
    };
  }

  // Tier 8 - Privateer / Communications Officer
  if (r.includes("privateer") && !r.includes("able privateer")) {
    return {
      name: "Privateer",
      shortName: "Privateer",
      class: "Privateer Class",
      tier: 8,
      stars: 0,
      chevrons: 2,
      Icon: Swords,
      bgClass: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
      gradientBg: "from-emerald-500/20 to-teal-600/20",
      accentColor: "text-emerald-400",
      glowColor: "shadow-emerald-500/20"
    };
  }

  // Tier 7 - Able Privateer / Lanced Privateer
  if (r.includes("able privateer") || r.includes("lanced")) {
    return {
      name: "Able Privateer",
      shortName: "Able Privateer",
      class: "Privateer Class",
      tier: 7,
      stars: 0,
      chevrons: 1,
      Icon: Shield,
      bgClass: "bg-emerald-600/20 text-emerald-300 border-emerald-600/40",
      gradientBg: "from-emerald-600/20 to-green-700/20",
      accentColor: "text-emerald-400",
      glowColor: "shadow-emerald-600/20"
    };
  }

  // Tier 6 - Weathered Seaman
  if (r.includes("weathered")) {
    return {
      name: "Weathered Seaman",
      shortName: "Weathered Seaman",
      class: "Seaman Class",
      tier: 6,
      stars: 0,
      chevrons: 5,
      Icon: Scroll,
      bgClass: "bg-amber-900/30 text-amber-300 border-amber-700/40",
      gradientBg: "from-amber-900/30 to-amber-800/20",
      accentColor: "text-amber-400",
      glowColor: "shadow-amber-900/20"
    };
  }

  // Tier 5 - Seasoned Seaman
  if (r.includes("seasoned")) {
    return {
      name: "Seasoned Seaman",
      shortName: "Seasoned Seaman",
      class: "Seaman Class",
      tier: 5,
      stars: 0,
      chevrons: 4,
      Icon: Shield,
      bgClass: "bg-slate-700/30 text-slate-200 border-slate-600/40",
      gradientBg: "from-slate-700/30 to-slate-800/20",
      accentColor: "text-slate-300",
      glowColor: "shadow-slate-700/20"
    };
  }

  // Tier 4 - Salted Seaman
  if (r.includes("salted")) {
    return {
      name: "Salted Seaman",
      shortName: "Salted Seaman",
      class: "Seaman Class",
      tier: 4,
      stars: 0,
      chevrons: 3,
      Icon: Waves,
      bgClass: "bg-cyan-600/20 text-cyan-300 border-cyan-500/40",
      gradientBg: "from-cyan-600/20 to-blue-700/20",
      accentColor: "text-cyan-400",
      glowColor: "shadow-cyan-600/20"
    };
  }

  // Tier 3 - Able Seaman
  if (r.includes("able seaman")) {
    return {
      name: "Able Seaman",
      shortName: "Able Seaman",
      class: "Seaman Class",
      tier: 3,
      stars: 0,
      chevrons: 2,
      Icon: Navigation,
      bgClass: "bg-slate-800 text-slate-300 border-slate-700",
      gradientBg: "from-slate-800 to-slate-900",
      accentColor: "text-slate-300",
      glowColor: "shadow-slate-800/20"
    };
  }

  // Tier 2 - Seaman / Midshipman
  if (r.includes("seaman") || r.includes("midshipman")) {
    return {
      name: "Seaman",
      shortName: "Seaman",
      class: "Seaman Class",
      tier: 2,
      stars: 0,
      chevrons: 1,
      Icon: Navigation,
      bgClass: "bg-slate-800 text-slate-300 border-slate-700",
      gradientBg: "from-slate-800 to-slate-900",
      accentColor: "text-slate-300",
      glowColor: "shadow-slate-800/20"
    };
  }

  // Tier 1 - Landsman / Recruit / Default Fallback
  return {
    name: rankInput || "Landsman",
    shortName: rankInput || "Landsman",
    class: "Seaman Class",
    tier: 1,
    stars: 0,
    chevrons: 0,
    Icon: Anchor,
    bgClass: "bg-slate-800/80 text-slate-400 border-slate-700/60",
    gradientBg: "from-slate-800/50 to-slate-900/50",
    accentColor: "text-slate-400",
    glowColor: "shadow-slate-800/10"
  };
}

/**
 * Renders real rank insignia (stacked chevrons for junior/mid ranks,
 * stars for flag officers) instead of an emoji glyph — modeled on how
 * actual military/naval sleeve and shoulder insignia communicate rank.
 */
function RankInsignia({
  stars,
  chevrons,
  size = 10,
  className = ""
}: {
  stars: number;
  chevrons: number;
  size?: number;
  className?: string;
}) {
  if (stars > 0) {
    return (
      <span className={`inline-flex items-center gap-[1px] ${className}`}>
        {Array.from({ length: stars }).map((_, i) => (
          <Star key={i} size={size} className="fill-current" />
        ))}
      </span>
    );
  }
  if (chevrons > 0) {
    return (
      <span className={`inline-flex flex-col items-center leading-none ${className}`} style={{ gap: -size * 0.35 }}>
        {Array.from({ length: chevrons }).map((_, i) => (
          <ChevronUp key={i} size={size} style={{ marginTop: i === 0 ? 0 : -size * 0.55 }} />
        ))}
      </span>
    );
  }
  return null;
}

export function RankBadge({
  rank,
  size = "sm",
  showLabel = true,
  showInsignia = true,
  showTier = false,
  className = "",
  variant = "badge"
}: RankBadgeProps) {
  const details = getRankDetails(rank);
  const { Icon, bgClass, accentColor, name, stars, chevrons } = details;

  const iconSizes = {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20
  };

  const insigniaSizes = {
    xs: 7,
    sm: 8,
    md: 9,
    lg: 11
  };

  const badgeSizes = {
    xs: "px-1.5 py-0.5 text-[9px] gap-1",
    sm: "px-2.5 py-1 text-xs gap-1.5",
    md: "px-3 py-1.5 text-xs gap-2",
    lg: "px-4 py-2 text-sm gap-2.5 font-bold"
  };

  if (variant === "minimal") {
    return (
      <span className={`inline-flex items-center gap-1.5 font-medium ${accentColor} ${className}`} title={`${name} (${details.class} - Tier ${details.tier})`}>
        {showInsignia && <RankInsignia stars={stars} chevrons={chevrons} size={insigniaSizes[size]} />}
        <Icon size={iconSizes[size]} className="shrink-0" />
        {showLabel && <span>{name}</span>}
      </span>
    );
  }

  if (variant === "pill") {
    return (
      <span className={`inline-flex items-center rounded-full border ${bgClass} ${badgeSizes[size]} font-mono font-semibold transition-all ${className}`}>
        {showInsignia && <RankInsignia stars={stars} chevrons={chevrons} size={insigniaSizes[size]} />}
        <Icon size={iconSizes[size]} className="shrink-0" />
        {showLabel && <span>{name}</span>}
        {showTier && <span className="text-[9px] opacity-75 font-mono">T{details.tier}</span>}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center rounded-lg border ${bgClass} ${badgeSizes[size]} font-mono font-medium shadow-sm transition-all ${className}`}>
      {showInsignia && <RankInsignia stars={stars} chevrons={chevrons} size={insigniaSizes[size]} />}
      <Icon size={iconSizes[size]} className="shrink-0" />
      {showLabel && <span>{name}</span>}
      {showTier && <span className="text-[10px] opacity-80 border-l border-current/30 pl-1 ml-0.5">T{details.tier}</span>}
    </span>
  );
}

/**
 * Real-time Rank Icon Component with Live Indicator Ring
 */
export function RankIcon({
  rank,
  size = 24,
  className = "",
  showGlow = true
}: {
  rank: string | undefined | null;
  size?: number;
  className?: string;
  showGlow?: boolean;
}) {
  const details = getRankDetails(rank);
  const { Icon, bgClass, accentColor, glowColor, stars, chevrons } = details;

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-xl p-1.5 border ${bgClass} ${showGlow ? glowColor : ""} ${className}`}
      title={`${details.name} (${details.class} - Tier ${details.tier})`}
    >
      <Icon size={size} className={`${accentColor} shrink-0`} />
      <span className="absolute -top-1.5 -right-1.5">
        <RankInsignia stars={stars} chevrons={chevrons} size={Math.max(8, size * 0.35)} />
      </span>
    </div>
  );
}
