"use client";

import React from "react";
import { NavArrow, NavArrowDefs } from "./NavArrow";

/**
 * The parlor — the cabin's front entry room. Connects to the main cabin
 * via a gold arrow on the right side of the floor. The front door (with
 * a small starry-night window pane) sits on the left, leading outside.
 *
 * Composition (1600x1000 viewBox):
 *   - Same wood walls / ceiling beams / floor as the cabin (continuity).
 *   - Front door + welcome mat + coat rack + boots on the LEFT.
 *   - Two warm red-pink booth chairs facing each other across a small
 *     round white table in the CENTER.
 *   - Framed landscape art on the RIGHT wall.
 *   - Fairy lights across the ceiling (continuity).
 *   - Gold arrow on the RIGHT floor → goes back to the cabin.
 */
export function ParlorScene({
  onRightArrowClick,
}: {
  onRightArrowClick?: () => void;
} = {}) {
  return (
    <svg
      viewBox="0 0 1600 1000"
      preserveAspectRatio="xMidYMid slice"
      className="w-full h-full block"
      role="img"
      aria-label="The cabin parlor — a cozy entry room with a front door, two warm red-pink booth chairs around a small white table, a coat rack, and a framed landscape on the wall."
    >
      <ParlorDefs />

      <BackWall />
      <CeilingBeams />

      <FrontDoor x={140} y={170} w={260} h={680} />
      <Boots x={420} y={830} />
      <WelcomeMat cx={280} cy={905} rx={170} ry={20} />
      <CoatRack x={510} y={300} />

      <FramedArt x={1240} y={210} w={260} h={210} />
      <WallSconce x={1080} y={260} />
      <FairyLights />

      <Floor />
      <ParlorRug cx={840} cy={895} rx={420} ry={55} />

      <Booth x={580} y={520} flip={false} />
      <ParlorTable x={770} y={680} />
      <Booth x={970} y={520} flip />

      {/* gold arrow → back to the cabin */}
      <NavArrow
        x={1420}
        y={935}
        direction="right"
        onClick={onRightArrowClick}
        label="Go back into the cabin"
      />

      {/* warm wash from interior */}
      <WarmWash />
    </svg>
  );
}

/* ─── defs (duplicated from CabinScene so this SVG is self-contained) ─ */
function ParlorDefs() {
  return (
    <defs>
      <linearGradient id="parlorWallWood" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#a06d4b" />
        <stop offset="55%" stopColor="#8b5a3c" />
        <stop offset="100%" stopColor="#6b3f23" />
      </linearGradient>

      <linearGradient id="parlorFloorWood" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#5e3a25" />
        <stop offset="100%" stopColor="#3a2113" />
      </linearGradient>

      <linearGradient id="parlorNightSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#0a0628" />
        <stop offset="60%" stopColor="#1a1850" />
        <stop offset="100%" stopColor="#2d2870" />
      </linearGradient>

      <radialGradient id="parlorMoonGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#fff5cc" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#fff5cc" stopOpacity="0" />
      </radialGradient>

      <linearGradient id="boothRed" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#e8889a" />
        <stop offset="50%" stopColor="#c95d72" />
        <stop offset="100%" stopColor="#963f54" />
      </linearGradient>

      <linearGradient id="boothRedHighlight" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#f0a8b6" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#f0a8b6" stopOpacity="0" />
      </linearGradient>

      <radialGradient id="parlorWarm" cx="50%" cy="70%" r="60%">
        <stop offset="0%" stopColor="#ffb066" stopOpacity="0.32" />
        <stop offset="60%" stopColor="#ff8a3a" stopOpacity="0.08" />
        <stop offset="100%" stopColor="#ff7b3a" stopOpacity="0" />
      </radialGradient>

      <pattern id="parlorPlanks" x="0" y="0" width="160" height="200" patternUnits="userSpaceOnUse">
        <rect width="160" height="200" fill="url(#parlorWallWood)" />
        <line x1="0" y1="0" x2="0" y2="200" stroke="#5a3520" strokeWidth="2" opacity="0.55" />
        <line x1="40" y1="20" x2="40" y2="180" stroke="#6b3f23" strokeWidth="1" opacity="0.35" />
        <line x1="100" y1="0" x2="100" y2="200" stroke="#6b3f23" strokeWidth="1" opacity="0.4" />
        <ellipse cx="120" cy="60" rx="6" ry="3" fill="#5a3520" opacity="0.35" />
        <ellipse cx="20" cy="140" rx="5" ry="2.5" fill="#5a3520" opacity="0.3" />
      </pattern>

      <pattern id="parlorFloorPlanks" x="0" y="0" width="180" height="180" patternUnits="userSpaceOnUse">
        <rect width="180" height="180" fill="url(#parlorFloorWood)" />
        <line x1="0" y1="60" x2="180" y2="60" stroke="#2a1709" strokeWidth="1.5" opacity="0.65" />
        <line x1="0" y1="120" x2="180" y2="120" stroke="#2a1709" strokeWidth="1.5" opacity="0.65" />
        <line x1="60" y1="0" x2="60" y2="60" stroke="#2a1709" strokeWidth="1.2" opacity="0.4" />
        <line x1="140" y1="60" x2="140" y2="120" stroke="#2a1709" strokeWidth="1.2" opacity="0.4" />
        <line x1="40" y1="120" x2="40" y2="180" stroke="#2a1709" strokeWidth="1.2" opacity="0.4" />
      </pattern>

      <NavArrowDefs />
    </defs>
  );
}

/* ─── shared scene primitives ────────────────────────────────────── */
function BackWall() {
  return (
    <g>
      <rect x="0" y="0" width="1600" height="900" fill="url(#parlorPlanks)" />
      {Array.from({ length: 9 }).map((_, i) => (
        <line
          key={i}
          x1={i * 180}
          y1="60"
          x2={i * 180}
          y2="900"
          stroke="#5a3520"
          strokeWidth="2"
          opacity="0.35"
        />
      ))}
    </g>
  );
}

function CeilingBeams() {
  return (
    <g>
      <rect x="0" y="0" width="1600" height="60" fill="#4a2e1a" />
      <rect x="0" y="56" width="1600" height="8" fill="#3a2113" />
      {[200, 600, 1000, 1400].map((x) => (
        <g key={x}>
          <rect x={x - 6} y="60" width="12" height="18" fill="#3a2113" />
          <rect x={x - 14} y="78" width="28" height="6" fill="#3a2113" />
        </g>
      ))}
    </g>
  );
}

function Floor() {
  return (
    <g>
      <rect x="0" y="880" width="1600" height="120" fill="url(#parlorFloorPlanks)" />
      <rect x="0" y="878" width="1600" height="6" fill="#1a0a02" opacity="0.6" />
    </g>
  );
}

function FairyLights() {
  const pts: [number, number][] = [];
  const startX = 60;
  const endX = 1540;
  const steps = 24;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = Number((startX + t * (endX - startX)).toFixed(2));
    const y = Number(
      (95 + Math.sin(t * Math.PI) * 22 + Math.sin(t * Math.PI * 4) * 6).toFixed(2)
    );
    pts.push([x, y]);
  }
  return (
    <g>
      <polyline
        points={pts.map((p) => p.join(",")).join(" ")}
        stroke="#3a2113"
        strokeWidth="1.5"
        fill="none"
      />
      {pts.filter((_, i) => i % 2 === 0).map(([cx, cy], i) => (
        <g key={i} transform={`translate(${cx}, ${cy + 6})`}>
          <line x1="0" y1="-6" x2="0" y2="0" stroke="#3a2113" strokeWidth="1.5" />
          <circle r="6" fill="#ffd966" opacity="0.4" />
          <circle
            r="3.5"
            fill="#ffe27a"
            className={i % 2 === 0 ? "animate-twinkle" : "animate-twinkleSlow"}
            style={{ animationDelay: `${(i * 0.3) % 3}s` }}
          />
        </g>
      ))}
    </g>
  );
}

/* ─── front door ──────────────────────────────────────────────────── */
function FrontDoor({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  // Window pane near the top of the door — shows the starry night outside.
  const paneH = h * 0.28;
  const paneInsetX = w * 0.18;
  return (
    <g>
      {/* door frame casing */}
      <rect x={x - 18} y={y - 18} width={w + 36} height={h + 28} rx="6" fill="#3a2113" />
      <rect x={x - 10} y={y - 10} width={w + 20} height={h + 14} rx="4" fill="#5a3520" />
      {/* door body — vertical planks */}
      <rect x={x} y={y} width={w} height={h} rx="2" fill="#8b5a3c" />
      <rect x={x} y={y} width={w} height={h} rx="2" fill="url(#parlorWallWood)" opacity="0.9" />
      {[0.25, 0.5, 0.75].map((t, i) => (
        <line
          key={i}
          x1={x + w * t}
          y1={y + 6}
          x2={x + w * t}
          y2={y + h - 6}
          stroke="#3a2113"
          strokeWidth="1.4"
          opacity="0.55"
        />
      ))}

      {/* window pane near top of door */}
      <rect
        x={x + paneInsetX - 6}
        y={y + 30 - 6}
        width={w - paneInsetX * 2 + 12}
        height={paneH + 12}
        rx="3"
        fill="#3a2113"
      />
      <rect
        x={x + paneInsetX}
        y={y + 30}
        width={w - paneInsetX * 2}
        height={paneH}
        fill="url(#parlorNightSky)"
      />
      {/* mullion (cross frame) */}
      <line
        x1={x + paneInsetX}
        y1={y + 30 + paneH / 2}
        x2={x + w - paneInsetX}
        y2={y + 30 + paneH / 2}
        stroke="#3a2113"
        strokeWidth="3"
      />
      <line
        x1={x + w / 2}
        y1={y + 30}
        x2={x + w / 2}
        y2={y + 30 + paneH}
        stroke="#3a2113"
        strokeWidth="3"
      />
      {/* moon + stars in the door window */}
      <g transform={`translate(${x + w * 0.34}, ${y + 60})`}>
        <circle r="22" fill="url(#parlorMoonGlow)" />
        <circle r="13" fill="#fff5cc" />
        <circle cx="4" cy="-2" r="13" fill="#1a1850" />
      </g>
      {[
        [w * 0.7, 50], [w * 0.82, 80], [w * 0.55, 90],
        [w * 0.42, 120], [w * 0.78, 130], [w * 0.6, 150],
      ].map(([dx, dy], i) => (
        <circle
          key={i}
          cx={x + dx}
          cy={y + 30 + dy * 0.55}
          r={i % 2 === 0 ? 1.4 : 1}
          fill="#fff9ec"
          className={i % 2 === 0 ? "animate-twinkle" : "animate-twinkleSlow"}
          style={{ animationDelay: `${(i * 0.4) % 3}s` }}
        />
      ))}

      {/* center panel detail (decorative wooden inset) */}
      <rect
        x={x + paneInsetX}
        y={y + 30 + paneH + 40}
        width={w - paneInsetX * 2}
        height={h * 0.32}
        rx="4"
        fill="#5a3520"
        opacity="0.45"
      />
      <rect
        x={x + paneInsetX + 12}
        y={y + 30 + paneH + 52}
        width={w - paneInsetX * 2 - 24}
        height={h * 0.32 - 24}
        rx="3"
        fill="none"
        stroke="#3a2113"
        strokeWidth="1.5"
        opacity="0.6"
      />

      {/* door knob */}
      <g transform={`translate(${x + w - 24}, ${y + h * 0.62})`}>
        <circle r="10" fill="#3a2113" />
        <circle r="7" fill="#c4a878" />
        <circle cx="-2" cy="-2" r="2" fill="#fff5cc" opacity="0.8" />
      </g>
      <rect
        x={x + w - 30}
        y={y + h * 0.62 + 10}
        width="12"
        height="3"
        fill="#3a2113"
      />

      {/* threshold strip below door */}
      <rect x={x - 18} y={y + h + 6} width={w + 36} height="6" fill="#3a2113" />
    </g>
  );
}

/* ─── welcome mat ────────────────────────────────────────────────── */
function WelcomeMat({ cx, cy, rx, ry }: { cx: number; cy: number; rx: number; ry: number }) {
  return (
    <g>
      <ellipse cx={cx} cy={cy + 4} rx={rx} ry={ry} fill="#000" opacity="0.2" />
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#7a4a8a" />
      <ellipse cx={cx} cy={cy} rx={rx - 12} ry={ry - 6} fill="#5a3669" />
      <text
        x={cx}
        y={cy + 4}
        textAnchor="middle"
        fontFamily="var(--font-fredoka), system-ui, sans-serif"
        fontSize="14"
        fontWeight="700"
        fill="#fff9ec"
        opacity="0.9"
      >
        WELCOME HOME
      </text>
      {/* fringe along the bottom */}
      {Array.from({ length: 18 }).map((_, i) => {
        const t = i / 17;
        const fx = cx - rx + t * 2 * rx;
        const fy = cy + ry * Math.sin(Math.acos((fx - cx) / rx));
        return (
          <line
            key={i}
            x1={fx}
            y1={fy}
            x2={fx}
            y2={fy + 4}
            stroke="#5a3669"
            strokeWidth="1.4"
          />
        );
      })}
    </g>
  );
}

/* ─── boots near the door (cute touch) ───────────────────────────── */
function Boots({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <ellipse cx="30" cy="58" rx="36" ry="6" fill="#000" opacity="0.25" />
      {/* boot 1 */}
      <g transform="translate(0, 0)">
        <path d="M 4 56 L 4 18 Q 4 6, 16 6 L 22 6 Q 32 6, 32 18 L 32 50 L 50 50 L 50 56 Z" fill="#3a2113" />
        <path d="M 4 56 L 4 18 Q 4 6, 16 6 L 22 6 Q 32 6, 32 18 L 32 50 L 50 50 L 50 56 Z" fill="#5a3520" />
        <path d="M 4 56 L 4 18 Q 4 6, 16 6 L 22 6" stroke="#6b3f23" strokeWidth="1.5" fill="none" />
        <rect x="4" y="50" width="46" height="3" fill="#1a0a02" />
      </g>
      {/* boot 2 */}
      <g transform="translate(30, 0) scale(-1, 1)">
        <path d="M 4 56 L 4 18 Q 4 6, 16 6 L 22 6 Q 32 6, 32 18 L 32 50 L 50 50 L 50 56 Z" fill="#5a3520" />
        <path d="M 4 56 L 4 18 Q 4 6, 16 6 L 22 6" stroke="#6b3f23" strokeWidth="1.5" fill="none" />
        <rect x="4" y="50" width="46" height="3" fill="#1a0a02" />
      </g>
    </g>
  );
}

/* ─── coat rack ──────────────────────────────────────────────────── */
function CoatRack({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* pole */}
      <rect x="-3" y="0" width="6" height="540" fill="#3a2113" />
      <rect x="-3" y="0" width="6" height="540" fill="#5a3520" opacity="0.7" />
      {/* finial top */}
      <circle cx="0" cy="-6" r="10" fill="#c4a878" />
      <circle cx="-2" cy="-8" r="3" fill="#fff5cc" opacity="0.8" />
      {/* hooks */}
      <g transform="translate(0, 30)">
        <path d="M 0 0 L -28 0 Q -36 0, -36 8 Q -36 14, -30 14" stroke="#c4a878" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M 0 0 L 28 0 Q 36 0, 36 8 Q 36 14, 30 14" stroke="#c4a878" strokeWidth="4" fill="none" strokeLinecap="round" />
      </g>
      <g transform="translate(0, 70)">
        <path d="M 0 0 L -28 0 Q -36 0, -36 8 Q -36 14, -30 14" stroke="#c4a878" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M 0 0 L 28 0 Q 36 0, 36 8 Q 36 14, 30 14" stroke="#c4a878" strokeWidth="4" fill="none" strokeLinecap="round" />
      </g>

      {/* scarf draped over left hook */}
      <g>
        <path
          d="M -36 38 Q -50 80, -42 160 L -28 160 Q -32 100, -22 50 Z"
          fill="#7a2d3a"
        />
        <path
          d="M -42 90 L -28 90 M -42 120 L -28 120"
          stroke="#5a1e28"
          strokeWidth="1.5"
          opacity="0.7"
        />
        {/* tassels */}
        {[0, 1, 2, 3].map((i) => (
          <line
            key={i}
            x1={-38 + i * 3}
            y1="160"
            x2={-38 + i * 3}
            y2="170"
            stroke="#5a1e28"
            strokeWidth="1.2"
          />
        ))}
      </g>

      {/* sun hat on top */}
      <g transform="translate(0, -10)">
        <ellipse cx="0" cy="0" rx="32" ry="6" fill="#c4a878" />
        <path d="M -18 -2 L -18 -22 Q -18 -28, -12 -28 L 12 -28 Q 18 -28, 18 -22 L 18 -2 Z" fill="#d4b896" />
        <ellipse cx="0" cy="-2" rx="18" ry="3" fill="#a88a5e" />
        <path d="M -18 -6 Q 0 -10, 18 -6" stroke="#7a2d3a" strokeWidth="3" fill="none" />
      </g>

      {/* small base */}
      <ellipse cx="0" cy="544" rx="22" ry="6" fill="#3a2113" />
      <ellipse cx="0" cy="540" rx="22" ry="6" fill="#5a3520" />
    </g>
  );
}

/* ─── framed art on the right wall ───────────────────────────────── */
function FramedArt({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* outer frame */}
      <rect x="-10" y="-10" width={w + 20} height={h + 20} rx="3" fill="#3a2113" />
      <rect width={w} height={h} fill="#c4a878" />
      <rect x="6" y="6" width={w - 12} height={h - 12} fill="#0a0628" />

      {/* tiny landscape inside: mountains, moon, a single tree */}
      <g transform="translate(6, 6)">
        <rect width={w - 12} height={h - 12} fill="url(#parlorNightSky)" />
        {/* moon */}
        <circle cx={w * 0.7} cy={h * 0.28} r="14" fill="#fff5cc" opacity="0.9" />
        <circle cx={w * 0.7 + 3} cy={h * 0.28 - 1} r="14" fill="#1a1850" opacity="0.45" />
        {/* mountains */}
        <polygon
          points={`0,${h - 12} ${w * 0.22},${h * 0.55} ${w * 0.4},${h - 12}`}
          fill="#1a0e08"
        />
        <polygon
          points={`${w * 0.28},${h - 12} ${w * 0.55},${h * 0.45} ${w * 0.78},${h - 12}`}
          fill="#0a0628"
        />
        <polygon
          points={`${w * 0.62},${h - 12} ${w * 0.85},${h * 0.6} ${w - 12},${h - 12}`}
          fill="#1a0e08"
        />
        {/* snow caps */}
        <polygon
          points={`${w * 0.55},${h * 0.45} ${w * 0.5},${h * 0.55} ${w * 0.6},${h * 0.55}`}
          fill="#fff5cc"
          opacity="0.85"
        />
        {/* lone tree */}
        <rect x={w * 0.1 - 1} y={h * 0.72} width="3" height="20" fill="#3a2113" />
        <polygon
          points={`${w * 0.1 - 8},${h * 0.78} ${w * 0.1},${h * 0.55} ${w * 0.1 + 8},${h * 0.78}`}
          fill="#1a3a1a"
        />
        {/* a couple of stars */}
        {[
          [w * 0.3, h * 0.2], [w * 0.45, h * 0.3], [w * 0.15, h * 0.4], [w * 0.85, h * 0.5],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="1" fill="#fff9ec" opacity="0.9" />
        ))}
      </g>

      {/* tiny picture wire + nail above */}
      <line x1={w / 2 - 12} y1="-12" x2={w / 2} y2="-26" stroke="#5a3520" strokeWidth="1" />
      <line x1={w / 2 + 12} y1="-12" x2={w / 2} y2="-26" stroke="#5a3520" strokeWidth="1" />
      <circle cx={w / 2} cy="-28" r="2" fill="#3a2113" />
    </g>
  );
}

/* ─── wall sconce above the booth seating ────────────────────────── */
function WallSconce({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* mount */}
      <rect x="-4" y="0" width="8" height="22" fill="#3a2113" />
      <circle cx="0" cy="0" r="5" fill="#c4a878" />
      {/* shade */}
      <path d="M -22 22 L 22 22 L 16 50 L -16 50 Z" fill="#d4b896" />
      <path d="M -22 22 L 22 22 L 16 50 L -16 50 Z" fill="#7a2d3a" opacity="0.35" />
      <ellipse cx="0" cy="50" rx="16" ry="3" fill="#3a2113" />
      {/* warm glow under it */}
      <ellipse cx="0" cy="58" rx="40" ry="14" fill="#ffd966" opacity="0.18" className="animate-breathe" />
      <ellipse cx="0" cy="52" rx="14" ry="3" fill="#ffe27a" className="animate-flicker" />
    </g>
  );
}

/* ─── parlor rug under the booth setup ───────────────────────────── */
function ParlorRug({ cx, cy, rx, ry }: { cx: number; cy: number; rx: number; ry: number }) {
  return (
    <g>
      <ellipse cx={cx} cy={cy + 8} rx={rx} ry={ry} fill="#000" opacity="0.2" />
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#3a8a6e" />
      <ellipse cx={cx} cy={cy} rx={rx - 14} ry={ry - 8} fill="none" stroke="#e8d5a8" strokeWidth="3" />
      <ellipse cx={cx} cy={cy} rx={rx - 40} ry={ry - 22} fill="none" stroke="#e8d5a8" strokeWidth="2" />
      <ellipse cx={cx} cy={cy} rx={rx - 70} ry={ry - 32} fill="#2a6650" />
    </g>
  );
}

/* ─── booth chair (side profile, mirrored via `flip`) ───────────── */
function Booth({ x, y, flip }: { x: number; y: number; flip: boolean }) {
  const w = 200;
  const h = 320;
  return (
    <g
      transform={`translate(${x}, ${y}) ${flip ? `scale(-1, 1) translate(${-w}, 0)` : ""}`}
    >
      {/* shadow */}
      <ellipse cx={w / 2} cy={h + 6} rx={w / 2 - 6} ry="10" fill="#000" opacity="0.3" />

      {/* dark base/skirt */}
      <rect x="6" y={h - 36} width={w - 12} height="40" rx="4" fill="#5a3520" />

      {/* backrest — tall curved */}
      <path
        d={`
          M 4 ${h - 30}
          L 4 60
          Q 4 8, 60 8
          L ${w - 30} 8
          Q ${w - 6} 8, ${w - 6} 40
          L ${w - 6} ${h - 30}
          Z
        `}
        fill="url(#boothRed)"
      />
      {/* sheen on backrest */}
      <path
        d={`
          M 14 ${h - 50}
          L 14 70
          Q 14 18, 60 18
          L ${w - 50} 18
        `}
        stroke="url(#boothRedHighlight)"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
      />

      {/* button tufting on backrest (small diamond pattern) */}
      {[
        [40, 80], [80, 80], [120, 80], [160, 80],
        [40, 130], [80, 130], [120, 130], [160, 130],
        [40, 180], [80, 180], [120, 180], [160, 180],
      ].map(([cx, cy], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r="3.5" fill="#7a2d3a" opacity="0.65" />
          <circle cx={cx - 0.5} cy={cy - 0.5} r="1" fill="#f0a4b0" opacity="0.7" />
        </g>
      ))}

      {/* seat cushion */}
      <rect x="0" y={h - 80} width={w} height="50" rx="14" fill="url(#boothRed)" />
      <rect
        x="0"
        y={h - 80}
        width={w}
        height="12"
        fill="url(#boothRedHighlight)"
        opacity="0.55"
        rx="14"
      />
      {/* seat seam down the middle */}
      <line x1={w / 2} y1={h - 76} x2={w / 2} y2={h - 32} stroke="#7a2d3a" strokeWidth="1.5" opacity="0.55" />

      {/* small wooden feet */}
      <rect x="14" y={h + 2} width="14" height="10" rx="2" fill="#3a2113" />
      <rect x={w - 28} y={h + 2} width="14" height="10" rx="2" fill="#3a2113" />
    </g>
  );
}

/* ─── small round white table between the booths ─────────────────── */
function ParlorTable({ x, y }: { x: number; y: number }) {
  const w = 180;
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* shadow */}
      <ellipse cx={w / 2} cy={200} rx={w / 2 - 8} ry="10" fill="#000" opacity="0.3" />

      {/* pedestal base */}
      <ellipse cx={w / 2} cy="195" rx="36" ry="6" fill="#3a2113" />
      <rect x={w / 2 - 6} y="60" width="12" height="135" fill="#c4a878" />
      <rect x={w / 2 - 6} y="60" width="12" height="135" fill="#d4b896" opacity="0.7" />

      {/* round tabletop (ellipse for side view perspective) */}
      <ellipse cx={w / 2} cy="56" rx={w / 2} ry="12" fill="#3a2113" />
      <ellipse cx={w / 2} cy="50" rx={w / 2} ry="16" fill="#fff9ec" />
      <ellipse cx={w / 2} cy="50" rx={w / 2 - 6} ry="13" fill="#fffdf5" />
      {/* subtle marbling */}
      <path
        d={`M ${w * 0.18} 48 Q ${w * 0.5} 56, ${w * 0.82} 48`}
        stroke="#e8e0c8"
        strokeWidth="1"
        fill="none"
        opacity="0.6"
      />

      {/* tiny vase with a flower on the table */}
      <g transform={`translate(${w / 2}, 20)`}>
        <path d="M -6 24 L -8 8 L 8 8 L 6 24 Z" fill="#7a2d3a" />
        <ellipse cx="0" cy="8" rx="8" ry="2.5" fill="#5a1e28" />
        {/* stem */}
        <line x1="0" y1="8" x2="-2" y2="-14" stroke="#3a8a5a" strokeWidth="1.5" />
        {/* flower head */}
        <circle cx="-2" cy="-16" r="5" fill="#f0a4b0" />
        <circle cx="-2" cy="-16" r="2.5" fill="#ffd966" />
        {/* leaf */}
        <ellipse cx="3" cy="-2" rx="4" ry="2" fill="#3a8a5a" transform="rotate(30 3 -2)" />
      </g>

      {/* two small ceramic cups */}
      <g transform={`translate(${w * 0.18}, 38)`}>
        <ellipse cx="0" cy="12" rx="10" ry="3" fill="#7a2d3a" opacity="0.5" />
        <path d="M -8 -4 L 8 -4 L 7 10 L -7 10 Z" fill="#fff9ec" />
        <ellipse cx="0" cy="-4" rx="8" ry="2" fill="#4a2a3a" />
        {/* handle */}
        <path d="M 8 0 Q 14 2, 14 6 Q 14 10, 8 10" stroke="#fff9ec" strokeWidth="1.6" fill="none" />
      </g>
      <g transform={`translate(${w * 0.82}, 38)`}>
        <ellipse cx="0" cy="12" rx="10" ry="3" fill="#7a2d3a" opacity="0.5" />
        <path d="M -8 -4 L 8 -4 L 7 10 L -7 10 Z" fill="#fff9ec" />
        <ellipse cx="0" cy="-4" rx="8" ry="2" fill="#4a2a3a" />
        <path d="M -8 0 Q -14 2, -14 6 Q -14 10, -8 10" stroke="#fff9ec" strokeWidth="1.6" fill="none" />
      </g>
    </g>
  );
}

/* ─── warm wash overlay (matches the cabin's warm vibe) ──────────── */
function WarmWash() {
  return (
    <g style={{ pointerEvents: "none", mixBlendMode: "screen" }}>
      <ellipse cx="900" cy="800" rx="900" ry="500" fill="url(#parlorWarm)" />
    </g>
  );
}
