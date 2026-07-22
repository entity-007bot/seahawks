"use client";

import React, { useSyncExternalStore } from "react";

interface LogoProps {
  className?: string;
  size?: number;
}

function subscribeLogo(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("privateers_logo_updated", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("privateers_logo_updated", callback);
    window.removeEventListener("storage", callback);
  };
}

function getLogoSnapshot() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("privateers_site_logo");
}

function getLogoServerSnapshot() {
  return null;
}

export function PrivateersLogo({ className = "", size = 200 }: LogoProps) {
  const customLogo = useSyncExternalStore(subscribeLogo, getLogoSnapshot, getLogoServerSnapshot);

  if (customLogo) {
    return (
      <img
        src={customLogo}
        alt="Custom Chapter Logo"
        width={size}
        height={size}
        className={`${className} rounded-full object-cover border-2 border-red-800 bg-white`}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <svg
      id="privateers-seal"
      width={size}
      height={size}
      viewBox="0 0 500 500"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Parchment/Cream subtle radial gradient */}
        <radialGradient id="sealBg" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" stopColor="#fdfcf7" />
          <stop offset="70%" stopColor="#faf6ee" />
          <stop offset="100%" stopColor="#e8e2d5" />
        </radialGradient>
      </defs>

      {/* Outer Crimson border */}
      <circle cx="250" cy="250" r="235" fill="none" stroke="#991b1b" strokeWidth="12" />
      <circle cx="250" cy="250" r="226" fill="none" stroke="#ffffff" strokeWidth="2" />
      
      {/* Inner Navy ring */}
      <circle cx="250" cy="250" r="215" fill="url(#sealBg)" stroke="#1e3a8a" strokeWidth="6" />

      {/* Secondary inner thin navy line */}
      <circle cx="250" cy="250" r="165" fill="none" stroke="#1e3a8a" strokeWidth="2" strokeDasharray="6,4" />

      {/* Outer Curved Text: NATIONAL ASSOCIATION OF PRIVATEERS */}
      <path
        id="textPathTop"
        d="M 65 250 A 185 185 0 0 1 435 250"
        fill="none"
        stroke="none"
      />
      <text fill="#0f172a" fontSize="23" fontWeight="bold" fontFamily="Georgia, serif" letterSpacing="3">
        <textPath href="#textPathTop" startOffset="50%" textAnchor="middle">
          NATIONAL ASSOCIATION OF PRIVATEERS
        </textPath>
      </text>

      {/* Bottom Curved Text: GREAT NIGER DELTA */}
      <path
        id="textPathBottom"
        d="M 435 250 A 185 185 0 0 1 65 250"
        fill="none"
        stroke="none"
      />
      <text fill="#991b1b" fontSize="24" fontWeight="bold" fontFamily="Georgia, serif" letterSpacing="4">
        <textPath href="#textPathBottom" startOffset="50%" textAnchor="middle">
          GREAT NIGER DELTA
        </textPath>
      </text>

      {/* Decorative anchors on left and right */}
      {/* Left Anchor & Skull */}
      <g transform="translate(85, 250) scale(0.65)">
        <path
          d="M 0,-30 L 0,30 M -15,10 L 15,10 M -20,25 C -5,45 5,45 20,25"
          fill="none"
          stroke="#0f172a"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <circle cx="0" cy="-35" r="8" fill="none" stroke="#0f172a" strokeWidth="4" />
        <path d="M -8,23 Q 0,35 8,23" fill="none" stroke="#0f172a" strokeWidth="4" />
        {/* Small Skull accent */}
        <circle cx="0" cy="-2" r="7" fill="#0f172a" />
        <rect x="-4" y="3" width="8" height="6" fill="#0f172a" rx="1" />
        <circle cx="-2" cy="-2" r="1.5" fill="#faf6ee" />
        <circle cx="2" cy="-2" r="1.5" fill="#faf6ee" />
      </g>

      {/* Right Anchor & Skull */}
      <g transform="translate(415, 250) scale(0.65)">
        <path
          d="M 0,-30 L 0,30 M -15,10 L 15,10 M -20,25 C -5,45 5,45 20,25"
          fill="none"
          stroke="#0f172a"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <circle cx="0" cy="-35" r="8" fill="none" stroke="#0f172a" strokeWidth="4" />
        <path d="M -8,23 Q 0,35 8,23" fill="none" stroke="#0f172a" strokeWidth="4" />
        {/* Small Skull accent */}
        <circle cx="0" cy="-2" r="7" fill="#0f172a" />
        <rect x="-4" y="3" width="8" height="6" fill="#0f172a" rx="1" />
        <circle cx="-2" cy="-2" r="1.5" fill="#faf6ee" />
        <circle cx="2" cy="-2" r="1.5" fill="#faf6ee" />
      </g>

      {/* Compass Rose at the top-center of the inner circle */}
      <g transform="translate(250, 115) scale(0.5)">
        {/* Circle dial */}
        <circle cx="0" cy="0" r="45" fill="none" stroke="#1e3a8a" strokeWidth="2" />
        {/* Points */}
        <polygon points="0,0 0,-40 6,-8 0,-4" fill="#991b1b" />
        <polygon points="0,0 0,-40 -6,-8 0,-4" fill="#0f172a" />
        
        <polygon points="0,0 0,40 -6,8 0,4" fill="#991b1b" />
        <polygon points="0,0 0,40 6,8 0,4" fill="#0f172a" />

        <polygon points="0,0 40,0 8,-6 4,-0" fill="#991b1b" />
        <polygon points="0,0 40,0 8,6 4,-0" fill="#0f172a" />

        <polygon points="0,0 -40,0 8,6 4,-0" fill="#991b1b" />
        <polygon points="0,0 -40,0 8,-6 4,-0" fill="#0f172a" />
        
        {/* Labels */}
        <text x="-4" y="-45" fontSize="14" fontWeight="bold" fill="#0f172a">N</text>
        <text x="-3" y="55" fontSize="14" fontWeight="bold" fill="#0f172a">S</text>
        <text x="45" y="5" fontSize="14" fontWeight="bold" fill="#0f172a">E</text>
        <text x="-58" y="5" fontSize="14" fontWeight="bold" fill="#0f172a">W</text>
      </g>

      {/* Centerpiece: Pirate/Galley Ship */}
      <g transform="translate(250, 240) scale(1.05)">
        {/* Oars */}
        <line x1="-75" y1="35" x2="-100" y2="60" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="-55" y1="35" x2="-80" y2="60" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="-35" y1="35" x2="-60" y2="60" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="-15" y1="35" x2="-40" y2="60" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="5" y1="35" x2="-20" y2="60" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
        
        {/* Ship Hull (Drakkar style) */}
        <path
          d="M -110,-10 C -100,20 -60,40 0,40 C 60,40 100,20 110,-10 C 115,-30 120,-30 125,-10 C 110,35 60,50 0,50 C -60,50 -110,35 -125,-10 C -120,-30 -115,-30 -110,-10 Z"
          fill="#1e3a8a"
        />
        {/* Dragon Head on Bow (Right) */}
        <path
          d="M 110,-10 Q 125,-25 125,-40 Q 120,-43 115,-35 L 110,-35 Q 115,-20 100,-5 Z"
          fill="#1e3a8a"
        />
        {/* Dragon Tail on Stern (Left) */}
        <path
          d="M -110,-10 Q -125,-25 -125,-35 Q -122,-37 -118,-32 L -115,-30 Q -118,-15 -100,-5 Z"
          fill="#1e3a8a"
        />

        {/* Shield decorations on the hull */}
        <circle cx="-70" cy="22" r="7" fill="#991b1b" stroke="#0f172a" strokeWidth="1.5" />
        <circle cx="-45" cy="26" r="7" fill="#faf6ee" stroke="#0f172a" strokeWidth="1.5" />
        <circle cx="-20" cy="28" r="7" fill="#1e3a8a" stroke="#0f172a" strokeWidth="1.5" />
        <circle cx="5" cy="28" r="7" fill="#991b1b" stroke="#0f172a" strokeWidth="1.5" />
        <circle cx="30" cy="26" r="7" fill="#faf6ee" stroke="#0f172a" strokeWidth="1.5" />
        <circle cx="55" cy="22" r="7" fill="#1e3a8a" stroke="#0f172a" strokeWidth="1.5" />

        {/* Mast */}
        <line x1="0" y1="35" x2="0" y2="-60" stroke="#0f172a" strokeWidth="6" strokeLinecap="round" />

        {/* Main Sail (Black with high detail) */}
        <path
          d="M -70,-35 C -30,-45 30,-45 70,-35 C 60,-5 55,15 75,20 C 30,10 -30,10 -75,20 C -55,15 -60,-5 -70,-35 Z"
          fill="#0f172a"
        />
        {/* Sail lines/stripes (Navy/crimson details) */}
        <path
          d="M -35,-38 Q -38,-10 -37,13 M 0,-40 Q 0,-10 0,10 M 35,-38 Q 38,-10 37,13"
          stroke="#475569"
          strokeWidth="2"
          fill="none"
        />

        {/* Jolly Roger Flag at Top mast */}
        <path d="M 0,-60 L 35,-65 L 0,-70 Z" fill="#991b1b" />
        {/* Tiny skull on flag */}
        <circle cx="10" cy="-65" r="2.5" fill="#faf6ee" />
        <rect x="8.5" y="-63" width="3" height="2" fill="#faf6ee" />
      </g>

      {/* Ribbon Banner at the bottom center: "CORSAIRS" */}
      <g transform="translate(250, 365)">
        <text
          x="0"
          y="0"
          fill="#0f172a"
          fontSize="28"
          fontWeight="900"
          fontFamily="Georgia, serif"
          textAnchor="middle"
          letterSpacing="4"
        >
          CORSAIRS
        </text>
      </g>

      {/* EST. 2026 */}
      <g transform="translate(250, 395)">
        {/* Left diamond ornament */}
        <polygon points="-80,-6 -74,0 -80,6 -86,0" fill="#991b1b" />
        <text
          x="0"
          y="4"
          fill="#475569"
          fontSize="14"
          fontWeight="bold"
          fontFamily="monospace"
          textAnchor="middle"
          letterSpacing="2"
        >
          EST. 2026
        </text>
        {/* Right diamond ornament */}
        <polygon points="80,-6 86,0 80,6 74,0" fill="#991b1b" />
      </g>
    </svg>
  );
}
