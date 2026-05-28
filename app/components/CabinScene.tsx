"use client";

import React from "react";
import { NavArrow, NavArrowDefs } from "./NavArrow";

/**
 * The cozy cabin interior — looking IN from the missing fourth wall.
 *
 * ViewBox: 1600 x 1000 (matches the 16:10 stage frame).
 * Z-order (back to front):
 *   1. exterior night sky behind window
 *   2. back wall (wood planks)
 *   3. ceiling beams
 *   4. wall-mounted items (window, fireplace, note board, fairy lights, lantern)
 *   5. floor + rug
 *   6. furniture (chairs, side tables, fridge, music player)
 *   7. pet
 *   8. warm-glow overlays
 *
 * Everything is static for now — the cabin scene is a stage, not yet interactive.
 */
export type CabinSceneProps = {
  /** Called when the user clicks the mini fridge. */
  onFridgeClick?: () => void;
  /** Whether to show a red "!" badge above the fridge. */
  fridgeUnread?: boolean;
  /** Called when the user clicks the record player. */
  onRecordPlayerClick?: () => void;
  /** Whether the record player is "active" (music currently spinning/playing). */
  recordPlayerActive?: boolean;
  /** Called when the user clicks the left-pointing gold arrow → parlor. */
  onLeftArrowClick?: () => void;
  /** Called when the user clicks the right-pointing gold arrow → kitchen. */
  onRightArrowClick?: () => void;
};

export function CabinScene({
  onFridgeClick,
  fridgeUnread = false,
  onRecordPlayerClick,
  recordPlayerActive = false,
  onLeftArrowClick,
  onRightArrowClick,
}: CabinSceneProps = {}) {
  return (
    <svg
      viewBox="0 0 1600 1000"
      preserveAspectRatio="xMidYMid slice"
      className="w-full h-full block"
      role="img"
      aria-label="A cozy cabin interior on a starry summer night, with a fireplace, window, two chairs, a sleeping cat, a note board, a record player, and a little fridge."
    >
      <SceneDefs />

      {/* === BACK WALL & CEILING === */}
      <BackWall />
      <CeilingBeams />

      {/* === WALL ITEMS === */}
      <Window x={90} y={170} w={300} h={310} />
      <Bookshelf x={420} y={420} />
      <Fireplace x={560} y={170} w={480} h={650} />
      <NoteBoard x={1170} y={150} w={320} h={230} />
      <FairyLights />
      <Lantern x={1490} y={140} />

      {/* === FLOOR === */}
      <Floor />
      <Rug cx={800} cy={895} rx={520} ry={70} />

      {/* === FURNITURE === */}
      <SideTable x={1180} y={560} />
      <RecordPlayer
        x={1190}
        y={500}
        onClick={onRecordPlayerClick}
        active={recordPlayerActive}
      />
      <MiniFridge x={1410} y={620} onClick={onFridgeClick} unread={fridgeUnread} />
      <PottedPlant x={70} y={730} />

      <Armchair x={310} y={680} flip={false} />
      <Armchair x={1010} y={680} flip />

      {/* === PET === */}
      <SleepingCat x={680} y={810} />

      {/* === ROOM NAVIGATION === */}
      <NavArrow
        x={180}
        y={935}
        direction="left"
        onClick={onLeftArrowClick}
        label="Go to the parlor"
      />
      <NavArrow
        x={1320}
        y={935}
        direction="right"
        onClick={onRightArrowClick}
        label="Go to the kitchen"
      />

      {/* === WARM GLOW OVERLAYS (front-most) === */}
      <FireGlowWash />
    </svg>
  );
}

/* ──────────────────────────────────────────────────────────────────────
   DEFS — gradients, patterns, filters used throughout
   ────────────────────────────────────────────────────────────────────── */
function SceneDefs() {
  return (
    <defs>
      {/* wood plank gradient (walls) */}
      <linearGradient id="wallWood" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#a06d4b" />
        <stop offset="55%" stopColor="#8b5a3c" />
        <stop offset="100%" stopColor="#6b3f23" />
      </linearGradient>

      {/* floor wood */}
      <linearGradient id="floorWood" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#5e3a25" />
        <stop offset="100%" stopColor="#3a2113" />
      </linearGradient>

      {/* night sky inside window */}
      <linearGradient id="nightSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#0a0628" />
        <stop offset="60%" stopColor="#1a1850" />
        <stop offset="100%" stopColor="#2d2870" />
      </linearGradient>

      {/* fire gradient */}
      <radialGradient id="fireGlow" cx="50%" cy="60%" r="50%">
        <stop offset="0%" stopColor="#ffe27a" />
        <stop offset="55%" stopColor="#ff7b3a" />
        <stop offset="100%" stopColor="#7a1a08" stopOpacity="0.9" />
      </radialGradient>

      {/* warm room wash radiating from fireplace */}
      <radialGradient id="warmWash" cx="50%" cy="80%" r="60%">
        <stop offset="0%" stopColor="#ffb066" stopOpacity="0.35" />
        <stop offset="55%" stopColor="#ff8a3a" stopOpacity="0.1" />
        <stop offset="100%" stopColor="#ff7b3a" stopOpacity="0" />
      </radialGradient>

      {/* stone */}
      <linearGradient id="stoneGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#9a9a98" />
        <stop offset="100%" stopColor="#5a5a58" />
      </linearGradient>

      {/* moon */}
      <radialGradient id="moonGlowSm" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#fff5cc" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#fff5cc" stopOpacity="0" />
      </radialGradient>

      {/* soft shadow under furniture */}
      <radialGradient id="softShadow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#000" stopOpacity="0.35" />
        <stop offset="100%" stopColor="#000" stopOpacity="0" />
      </radialGradient>

      {/* repeating wood-plank pattern (vertical grain ticks) */}
      <pattern id="plankGrain" x="0" y="0" width="160" height="200" patternUnits="userSpaceOnUse">
        <rect width="160" height="200" fill="url(#wallWood)" />
        <line x1="0" y1="0" x2="0" y2="200" stroke="#5a3520" strokeWidth="2" opacity="0.55" />
        <line x1="40" y1="20" x2="40" y2="180" stroke="#6b3f23" strokeWidth="1" opacity="0.35" />
        <line x1="100" y1="0" x2="100" y2="200" stroke="#6b3f23" strokeWidth="1" opacity="0.4" />
        <ellipse cx="120" cy="60" rx="6" ry="3" fill="#5a3520" opacity="0.35" />
        <ellipse cx="20" cy="140" rx="5" ry="2.5" fill="#5a3520" opacity="0.3" />
      </pattern>

      {/* floor plank pattern */}
      <pattern id="floorPlanks" x="0" y="0" width="180" height="180" patternUnits="userSpaceOnUse">
        <rect width="180" height="180" fill="url(#floorWood)" />
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

/* ──────────────────────────────────────────────────────────────────────
   WALLS, CEILING, FLOOR
   ────────────────────────────────────────────────────────────────────── */
function BackWall() {
  return (
    <g>
      <rect x="0" y="0" width="1600" height="900" fill="url(#plankGrain)" />
      {/* subtle vertical seams */}
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
      {/* top trim — darker beam */}
      <rect x="0" y="0" width="1600" height="60" fill="#4a2e1a" />
      <rect x="0" y="56" width="1600" height="8" fill="#3a2113" />
      {/* small support brackets at intervals */}
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
      <rect x="0" y="880" width="1600" height="120" fill="url(#floorPlanks)" />
      {/* floor-wall shadow line */}
      <rect x="0" y="878" width="1600" height="6" fill="#1a0a02" opacity="0.6" />
    </g>
  );
}

/* ──────────────────────────────────────────────────────────────────────
   WINDOW — back wall, showing the starry summer night with fireflies
   ────────────────────────────────────────────────────────────────────── */
function Window({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  const innerX = x + 16;
  const innerY = y + 16;
  const innerW = w - 32;
  const innerH = h - 32;
  return (
    <g>
      {/* outer wood frame */}
      <rect x={x - 8} y={y - 8} width={w + 16} height={h + 16} rx="6" fill="#3a2113" />
      <rect x={x} y={y} width={w} height={h} rx="4" fill="#6b3f23" />
      {/* window panes background */}
      <rect x={innerX} y={innerY} width={innerW} height={innerH} fill="url(#nightSky)" />

      {/* moon */}
      <g transform={`translate(${innerX + innerW * 0.7}, ${innerY + innerH * 0.22})`}>
        <circle r="36" fill="url(#moonGlowSm)" />
        <circle r="22" fill="#fff5cc" />
        <circle cx="6" cy="-3" r="22" fill="#1a1850" />
        <circle cx="-8" cy="2" r="1.6" fill="#e3d7a3" opacity="0.7" />
        <circle cx="-4" cy="9" r="1.2" fill="#e3d7a3" opacity="0.6" />
      </g>

      {/* tree silhouettes along bottom of window */}
      <g>
        <polygon
          points={`${innerX},${innerY + innerH} ${innerX + 35},${innerY + innerH - 90} ${innerX + 70},${innerY + innerH}`}
          fill="#06031a"
        />
        <polygon
          points={`${innerX + 50},${innerY + innerH} ${innerX + 95},${innerY + innerH - 130} ${innerX + 140},${innerY + innerH}`}
          fill="#06031a"
        />
        <polygon
          points={`${innerX + 110},${innerY + innerH} ${innerX + 155},${innerY + innerH - 100} ${innerX + 200},${innerY + innerH}`}
          fill="#06031a"
        />
        <polygon
          points={`${innerX + 180},${innerY + innerH} ${innerX + 225},${innerY + innerH - 70} ${innerX + 268},${innerY + innerH}`}
          fill="#06031a"
        />
        {/* far hill */}
        <path
          d={`M${innerX} ${innerY + innerH - 30} Q${innerX + innerW / 2} ${innerY + innerH - 70} ${innerX + innerW} ${innerY + innerH - 30} L${innerX + innerW} ${innerY + innerH} L${innerX} ${innerY + innerH} Z`}
          fill="#0a0628"
        />
      </g>

      {/* stars inside the window scene */}
      {[
        [20, 20], [60, 50], [110, 30], [200, 40], [80, 80],
        [150, 70], [40, 110], [170, 110], [110, 130], [220, 100],
        [40, 160], [185, 150], [60, 200], [130, 175], [90, 230],
      ].map(([dx, dy], i) => (
        <circle
          key={i}
          cx={innerX + dx}
          cy={innerY + dy}
          r={i % 3 === 0 ? 1.6 : 1}
          fill="#fff9ec"
          className={i % 2 === 0 ? "animate-twinkle" : "animate-twinkleSlow"}
          style={{ animationDelay: `${(i * 0.4) % 3}s` }}
        />
      ))}

      {/* fireflies — animated warm yellow */}
      <g>
        <circle cx={innerX + 70} cy={innerY + innerH - 50} r="3" fill="#ffd966" className="animate-firefly" style={{ filter: "blur(0.4px)" }} />
        <circle cx={innerX + 130} cy={innerY + innerH - 80} r="2.6" fill="#ffd966" className="animate-firefly2" style={{ filter: "blur(0.4px)" }} />
        <circle cx={innerX + 200} cy={innerY + innerH - 60} r="3" fill="#ffd966" className="animate-firefly3" style={{ filter: "blur(0.4px)" }} />
        <circle cx={innerX + 50} cy={innerY + innerH - 110} r="2.4" fill="#ffd966" className="animate-firefly2" style={{ filter: "blur(0.4px)" }} />
        <circle cx={innerX + 160} cy={innerY + innerH - 140} r="2.6" fill="#ffd966" className="animate-firefly" style={{ filter: "blur(0.4px)" }} />
      </g>

      {/* window cross frame */}
      <rect x={innerX + innerW / 2 - 4} y={innerY} width="8" height={innerH} fill="#6b3f23" />
      <rect x={innerX} y={innerY + innerH / 2 - 4} width={innerW} height="8" fill="#6b3f23" />

      {/* sill */}
      <rect x={x - 14} y={y + h - 4} width={w + 28} height="14" rx="3" fill="#3a2113" />
      <rect x={x - 12} y={y + h - 4} width={w + 24} height="6" fill="#6b3f23" />

      {/* curtain hint at top */}
      <path
        d={`M${x - 18} ${y - 14} L${x + w + 18} ${y - 14} L${x + w + 6} ${y + 8} L${x + w / 2} ${y - 4} L${x - 6} ${y + 8} Z`}
        fill="#7a2d3a"
      />
      <path
        d={`M${x - 18} ${y - 14} L${x + w + 18} ${y - 14} L${x + w + 6} ${y + 8} L${x + w / 2} ${y - 4} L${x - 6} ${y + 8} Z`}
        fill="none"
        stroke="#5a1e28"
        strokeWidth="1"
      />
    </g>
  );
}

/* ──────────────────────────────────────────────────────────────────────
   BOOKSHELF — small accent between window and fireplace
   ────────────────────────────────────────────────────────────────────── */
function Bookshelf({ x, y }: { x: number; y: number }) {
  const w = 120;
  const h = 380;
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* frame */}
      <rect x="0" y="0" width={w} height={h} rx="4" fill="#3a2113" />
      <rect x="6" y="6" width={w - 12} height={h - 12} fill="#5e3a25" />
      {/* shelves */}
      {[0, 1, 2, 3].map((i) => {
        const sy = 10 + i * 90;
        return (
          <g key={i}>
            <rect x="8" y={sy + 80} width={w - 16} height="6" fill="#3a2113" />
            {/* books */}
            <Book x={14} y={sy} h={78} color="#c44a4a" />
            <Book x={30} y={sy + 4} h={74} color="#2d5d6e" />
            <Book x={46} y={sy + 8} h={70} color="#ffcf5c" />
            <Book x={62} y={sy + 2} h={76} color="#7a4a8a" />
            <Book x={80} y={sy + 10} h={68} color="#3a8a5a" tilted />
            <Book x={96} y={sy + 14} h={64} color="#e8d5a8" tilted />
          </g>
        );
      })}
    </g>
  );
}
function Book({ x, y, h, color, tilted = false }: { x: number; y: number; h: number; color: string; tilted?: boolean }) {
  if (tilted) {
    return (
      <g transform={`translate(${x}, ${y}) rotate(8)`}>
        <rect width="14" height={h} fill={color} rx="1" />
        <rect width="14" height="3" fill="rgba(0,0,0,0.25)" />
      </g>
    );
  }
  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect width="14" height={h} fill={color} rx="1" />
      <rect width="14" height="3" fill="rgba(0,0,0,0.25)" />
      <rect y={h * 0.5} width="14" height="1.5" fill="rgba(255,255,255,0.18)" />
    </g>
  );
}

/* ──────────────────────────────────────────────────────────────────────
   FIREPLACE — stone surround, mantel, animated fire
   ────────────────────────────────────────────────────────────────────── */
function Fireplace({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  const stoneX = x;
  const stoneW = w;
  const openingW = w * 0.55;
  const openingH = h * 0.45;
  const openingX = x + (w - openingW) / 2;
  const openingY = y + h - openingH - 30; // sit above floor a bit

  return (
    <g>
      {/* full stone surround (extends to floor) */}
      <rect x={stoneX} y={y} width={stoneW} height={h + 60} fill="url(#stoneGrad)" />
      {/* stone block pattern */}
      <Stones x={stoneX} y={y} w={stoneW} h={h + 60} />

      {/* mantel (wood shelf) */}
      <rect x={stoneX - 22} y={y + 180} width={stoneW + 44} height="22" rx="3" fill="#3a2113" />
      <rect x={stoneX - 20} y={y + 180} width={stoneW + 40} height="10" fill="#8b5a3c" />
      <rect x={stoneX - 22} y={y + 200} width={stoneW + 44} height="6" fill="#2a1709" />

      {/* mantel decor — small candles + a clock */}
      <g transform={`translate(${stoneX + 30}, ${y + 152})`}>
        <rect width="14" height="28" fill="#e8d5a8" />
        <rect width="14" height="4" fill="#c4a878" />
        <ellipse cx="7" cy="-2" rx="2.5" ry="5" fill="#ffd966" className="animate-flicker" />
      </g>
      <g transform={`translate(${stoneX + stoneW - 44}, ${y + 150})`}>
        <rect width="14" height="30" fill="#e8d5a8" />
        <rect width="14" height="4" fill="#c4a878" />
        <ellipse cx="7" cy="-3" rx="2.5" ry="6" fill="#ffd966" className="animate-flicker2" />
      </g>
      {/* tiny clock */}
      <g transform={`translate(${stoneX + stoneW / 2 - 24}, ${y + 148})`}>
        <rect width="48" height="34" rx="4" fill="#3a2113" />
        <circle cx="24" cy="17" r="13" fill="#e8d5a8" />
        <line x1="24" y1="17" x2="24" y2="9" stroke="#3a2113" strokeWidth="1.5" />
        <line x1="24" y1="17" x2="30" y2="20" stroke="#3a2113" strokeWidth="1.2" />
        <circle cx="24" cy="17" r="1" fill="#3a2113" />
      </g>

      {/* fireplace opening (dark cavity) */}
      <rect
        x={openingX}
        y={openingY}
        width={openingW}
        height={openingH}
        rx="14"
        fill="#0a0202"
      />
      {/* inner brick rim */}
      <rect
        x={openingX + 6}
        y={openingY + 6}
        width={openingW - 12}
        height={openingH - 12}
        rx="10"
        fill="#1a0a02"
      />

      {/* fire glow background */}
      <ellipse
        cx={openingX + openingW / 2}
        cy={openingY + openingH * 0.78}
        rx={openingW * 0.42}
        ry={openingH * 0.35}
        fill="url(#fireGlow)"
        opacity="0.95"
      />

      {/* logs */}
      <g>
        <rect
          x={openingX + openingW * 0.18}
          y={openingY + openingH - 50}
          width={openingW * 0.65}
          height="22"
          rx="11"
          fill="#5e3a25"
        />
        <rect
          x={openingX + openingW * 0.18}
          y={openingY + openingH - 50}
          width={openingW * 0.65}
          height="6"
          fill="#7a4d2f"
        />
        <rect
          x={openingX + openingW * 0.25}
          y={openingY + openingH - 30}
          width={openingW * 0.5}
          height="18"
          rx="9"
          fill="#3a2113"
        />
      </g>

      {/* animated flame group */}
      <g
        style={{ transformOrigin: `${openingX + openingW / 2}px ${openingY + openingH - 10}px` }}
        className="animate-breathe"
      >
        <Flame
          cx={openingX + openingW / 2}
          cy={openingY + openingH - 50}
          w={openingW * 0.45}
          h={openingH * 0.6}
          color="#ff7b3a"
        />
        <Flame
          cx={openingX + openingW / 2 - 14}
          cy={openingY + openingH - 50}
          w={openingW * 0.28}
          h={openingH * 0.48}
          color="#ffb066"
          delay="0.4s"
        />
        <Flame
          cx={openingX + openingW / 2 + 12}
          cy={openingY + openingH - 50}
          w={openingW * 0.22}
          h={openingH * 0.42}
          color="#ffe27a"
          delay="0.7s"
        />
      </g>

      {/* hearth (slab at base) */}
      <rect x={stoneX - 30} y={y + h + 32} width={stoneW + 60} height="22" rx="3" fill="#5a5a58" />
      <rect x={stoneX - 30} y={y + h + 32} width={stoneW + 60} height="6" fill="#9a9a98" />
    </g>
  );
}

function Stones({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  // hand-laid stone block pattern
  const rows: { sy: number; pattern: number[] }[] = [];
  const rowH = 46;
  for (let i = 0; i < Math.ceil(h / rowH); i++) {
    rows.push({
      sy: y + i * rowH,
      pattern: i % 2 === 0 ? [0, 0.22, 0.5, 0.78, 1] : [0, 0.32, 0.62, 1],
    });
  }
  return (
    <g>
      {rows.map((row, ri) => (
        <g key={ri}>
          {row.pattern.slice(0, -1).map((p, ci) => {
            const sx = x + p * w;
            const nx = x + row.pattern[ci + 1] * w;
            return (
              <g key={ci}>
                <rect
                  x={sx + 2}
                  y={row.sy + 2}
                  width={nx - sx - 4}
                  height={rowH - 4}
                  rx="6"
                  fill={(ri + ci) % 2 === 0 ? "#8a8a88" : "#6e6e6c"}
                />
                <rect
                  x={sx + 2}
                  y={row.sy + 2}
                  width={nx - sx - 4}
                  height="3"
                  rx="2"
                  fill="rgba(255,255,255,0.25)"
                />
              </g>
            );
          })}
        </g>
      ))}
    </g>
  );
}

function Flame({
  cx,
  cy,
  w,
  h,
  color,
  delay,
}: {
  cx: number;
  cy: number;
  w: number;
  h: number;
  color: string;
  delay?: string;
}) {
  const path = `
    M ${cx} ${cy}
    C ${cx - w * 0.7} ${cy - h * 0.2}, ${cx - w * 0.4} ${cy - h * 0.7}, ${cx} ${cy - h}
    C ${cx + w * 0.45} ${cy - h * 0.7}, ${cx + w * 0.65} ${cy - h * 0.3}, ${cx + w * 0.2} ${cy - h * 0.1}
    Z
  `;
  return (
    <path
      d={path}
      fill={color}
      style={{
        transformOrigin: `${cx}px ${cy}px`,
        animationDelay: delay,
      }}
      className="animate-flicker"
    />
  );
}

/* ──────────────────────────────────────────────────────────────────────
   NOTE BOARD — cork board for leaving notes for each other
   ────────────────────────────────────────────────────────────────────── */
function NoteBoard({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* wood frame */}
      <rect width={w} height={h} rx="8" fill="#3a2113" />
      <rect x="10" y="10" width={w - 20} height={h - 20} rx="4" fill="#6b3f23" />
      {/* cork */}
      <rect x="18" y="18" width={w - 36} height={h - 36} rx="2" fill="#c89a6b" />
      {/* cork texture dots */}
      {Array.from({ length: 80 }).map((_, i) => {
        const cx = 22 + (i % 16) * (w - 40) / 16;
        const cy = 24 + Math.floor(i / 16) * (h - 44) / 5;
        return <circle key={i} cx={cx} cy={cy} r="0.8" fill="#a0784e" opacity="0.5" />;
      })}

      {/* pinned notes */}
      <Note x={26} y={26} w={86} h={64} color="#f5e6a8" rot={-4} text="hi 💛" />
      <Note x={120} y={36} w={82} h={56} color="#f5b7c4" rot={3} text="miss u" />
      <Note x={210} y={28} w={84} h={70} color="#b7d4f5" rot={-2} text="<3" />
      <Note x={50} y={110} w={92} h={62} color="#cdebc0" rot={5} text="movie nite?" />
      <Note x={160} y={120} w={100} h={62} color="#f5e6a8" rot={-3} text="thinking of u" />

      {/* a small heart polaroid */}
      <g transform="translate(220, 110) rotate(8)">
        <rect width="64" height="78" fill="#fff9ec" rx="2" />
        <rect x="4" y="4" width="56" height="50" fill="#1a1850" />
        <path d="M32 36 C28 28, 16 28, 16 38 C16 48, 32 56, 32 56 C32 56, 48 48, 48 38 C48 28, 36 28, 32 36 Z" fill="#f5b7c4" />
        <circle cx="32" cy="2" r="3" fill="#c44a4a" />
      </g>
    </g>
  );
}

function Note({
  x, y, w, h, color, rot, text,
}: {
  x: number; y: number; w: number; h: number; color: string; rot: number; text: string;
}) {
  return (
    <g transform={`translate(${x + w / 2}, ${y + h / 2}) rotate(${rot}) translate(${-w / 2}, ${-h / 2})`}>
      <rect width={w} height={h} fill={color} rx="2" />
      <rect width={w} height="6" fill="rgba(0,0,0,0.06)" />
      {/* pin */}
      <circle cx={w / 2} cy="6" r="4" fill="#c44a4a" />
      <circle cx={w / 2 - 1} cy="5" r="1.3" fill="#ff8a8a" />
      <text
        x={w / 2}
        y={h / 2 + 8}
        textAnchor="middle"
        fontFamily="var(--font-fredoka), system-ui, sans-serif"
        fontSize="16"
        fontWeight="600"
        fill="#5a3520"
      >
        {text}
      </text>
    </g>
  );
}

/* ──────────────────────────────────────────────────────────────────────
   FAIRY LIGHTS — string of warm bulbs draped across ceiling
   ────────────────────────────────────────────────────────────────────── */
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
      {/* string */}
      <polyline
        points={pts.map((p) => p.join(",")).join(" ")}
        stroke="#3a2113"
        strokeWidth="1.5"
        fill="none"
      />
      {/* bulbs */}
      {pts.filter((_, i) => i % 2 === 0).map(([cx, cy], i) => (
        <g key={i} transform={`translate(${cx}, ${cy + 6})`}>
          <line x1="0" y1="-6" x2="0" y2="0" stroke="#3a2113" strokeWidth="1.5" />
          <circle r="6" fill="#ffd966" opacity="0.4" />
          <circle r="3.5" fill="#ffe27a" className={i % 2 === 0 ? "animate-twinkle" : "animate-twinkleSlow"} style={{ animationDelay: `${(i * 0.3) % 3}s` }} />
        </g>
      ))}
    </g>
  );
}

/* ──────────────────────────────────────────────────────────────────────
   LANTERN — hanging from ceiling
   ────────────────────────────────────────────────────────────────────── */
function Lantern({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`} className="animate-sway" style={{ transformOrigin: `${x}px ${y}px` }}>
      <line x1="0" y1="0" x2="0" y2="40" stroke="#3a2113" strokeWidth="2" />
      <rect x="-18" y="40" width="36" height="6" fill="#5a3520" />
      <rect x="-22" y="46" width="44" height="42" rx="4" fill="#3a2113" />
      <rect x="-18" y="50" width="36" height="34" rx="2" fill="#ffd966" opacity="0.9" />
      {/* glow */}
      <circle cx="0" cy="67" r="34" fill="#ffd966" opacity="0.15" />
      {/* small frame lines */}
      <line x1="-18" y1="65" x2="18" y2="65" stroke="#3a2113" strokeWidth="1" />
      <line x1="0" y1="50" x2="0" y2="84" stroke="#3a2113" strokeWidth="1" />
      {/* ring on top */}
      <rect x="-3" y="88" width="6" height="4" fill="#3a2113" />
    </g>
  );
}

/* ──────────────────────────────────────────────────────────────────────
   RUG
   ────────────────────────────────────────────────────────────────────── */
function Rug({ cx, cy, rx, ry }: { cx: number; cy: number; rx: number; ry: number }) {
  return (
    <g>
      <ellipse cx={cx} cy={cy + 8} rx={rx} ry={ry} fill="#000" opacity="0.25" />
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#c44a4a" />
      <ellipse cx={cx} cy={cy} rx={rx - 14} ry={ry - 10} fill="none" stroke="#e8d5a8" strokeWidth="3" />
      <ellipse cx={cx} cy={cy} rx={rx - 40} ry={ry - 22} fill="none" stroke="#e8d5a8" strokeWidth="2" />
      <ellipse cx={cx} cy={cy} rx={rx - 70} ry={ry - 36} fill="#7a2d3a" />
      {/* fringe */}
      {Array.from({ length: 24 }).map((_, i) => {
        const t = i / 23;
        const angle = Math.PI + t * Math.PI;
        const fx = Number((cx + Math.cos(angle) * rx).toFixed(2));
        const fy = Number((cy + Math.sin(angle) * ry).toFixed(2));
        return <line key={i} x1={fx} y1={fy} x2={fx} y2={fy + 6} stroke="#e8d5a8" strokeWidth="1.5" />;
      })}
    </g>
  );
}

/* ──────────────────────────────────────────────────────────────────────
   ARMCHAIR
   ────────────────────────────────────────────────────────────────────── */
function Armchair({ x, y, flip }: { x: number; y: number; flip: boolean }) {
  const w = 280;
  const h = 220;
  return (
    <g transform={`translate(${x}, ${y}) ${flip ? `scale(-1, 1) translate(${-w}, 0)` : ""}`}>
      {/* shadow */}
      <ellipse cx={w / 2} cy={h + 8} rx={w / 2 - 10} ry="12" fill="#000" opacity="0.3" />
      {/* back */}
      <path
        d={`M 10 ${h} L 10 50 Q 10 0 70 0 L ${w - 50} 0 Q ${w - 10} 0 ${w - 10} 50 L ${w - 10} ${h} Z`}
        fill="#2d5d6e"
      />
      {/* highlight on back */}
      <path
        d={`M 16 ${h - 10} L 16 60 Q 16 8 70 8 L ${w - 56} 8`}
        stroke="#3e7589"
        strokeWidth="3"
        fill="none"
      />
      {/* arm rests */}
      <rect x="0" y="60" width="32" height={h - 60} rx="8" fill="#1f4554" />
      <rect x={w - 32} y="60" width="32" height={h - 60} rx="8" fill="#1f4554" />
      {/* seat cushion */}
      <rect x="20" y={h - 80} width={w - 40} height="60" rx="14" fill="#3e7589" />
      <line x1={w / 2} y1={h - 80} x2={w / 2} y2={h - 20} stroke="#2d5d6e" strokeWidth="2" opacity="0.6" />
      {/* feet */}
      <rect x="14" y={h} width="20" height="14" rx="3" fill="#3a2113" />
      <rect x={w - 34} y={h} width="20" height="14" rx="3" fill="#3a2113" />
      {/* throw blanket draped on arm */}
      <path
        d={`M 30 ${h - 50} Q 0 ${h - 30}, 8 ${h + 6} L 36 ${h + 6} Q 30 ${h - 20}, 40 ${h - 50} Z`}
        fill="#e8d5a8"
      />
      <path
        d={`M 30 ${h - 50} Q 0 ${h - 30}, 8 ${h + 6}`}
        stroke="#c4a878"
        strokeWidth="1.5"
        fill="none"
      />
    </g>
  );
}

/* ──────────────────────────────────────────────────────────────────────
   SIDE TABLE
   ────────────────────────────────────────────────────────────────────── */
function SideTable({ x, y }: { x: number; y: number }) {
  const w = 240;
  return (
    <g transform={`translate(${x}, ${y})`}>
      <ellipse cx={w / 2} cy="340" rx={w / 2 - 10} ry="14" fill="#000" opacity="0.3" />
      {/* top */}
      <rect x="0" y="0" width={w} height="18" rx="3" fill="#5e3a25" />
      <rect x="0" y="0" width={w} height="6" fill="#8b5a3c" />
      {/* legs */}
      <rect x="8" y="18" width="14" height={320} fill="#3a2113" />
      <rect x={w - 22} y="18" width="14" height={320} fill="#3a2113" />
      {/* cross brace */}
      <rect x="22" y={200} width={w - 44} height="8" fill="#3a2113" />
    </g>
  );
}

/* ──────────────────────────────────────────────────────────────────────
   RECORD PLAYER (sits on top of the side table)
   ────────────────────────────────────────────────────────────────────── */
function RecordPlayer({
  x,
  y,
  onClick,
  active = false,
}: {
  x: number;
  y: number;
  onClick?: () => void;
  active?: boolean;
}) {
  const w = 220;
  const h = 60;
  const interactive = !!onClick;
  // The record always spins decoratively at a leisurely pace; when active
  // (real music playing) it spins faster.
  const spinDuration = active ? "1.6s" : "3s";
  return (
    <g transform={`translate(${x}, ${y})`}>
      <g
        onClick={onClick}
        style={interactive ? { cursor: "pointer" } : undefined}
        className={interactive ? "barnhouse-recordplayer" : undefined}
        tabIndex={interactive ? 0 : undefined}
        role={interactive ? "button" : undefined}
        aria-label={interactive ? "Open the record player" : undefined}
        onKeyDown={
          interactive
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onClick?.();
                }
              }
            : undefined
        }
      >
        {/* base */}
        <rect x="0" y="0" width={w} height={h} rx="4" fill="#3a2113" />
        <rect x="0" y="0" width={w} height="8" fill="#5e3a25" />
        <rect x="0" y={h - 4} width={w} height="4" fill="#1a0a02" />
        {/* turntable platter */}
        <g transform={`translate(${w * 0.32}, -6)`}>
          <ellipse cx="0" cy="6" rx="64" ry="10" fill="#1a0a02" />
          <ellipse cx="0" cy="0" rx="64" ry="14" fill="#5e3a25" />
          {/* the record itself spinning */}
          <g
            className="animate-record"
            style={{ transformOrigin: "0 0", animationDuration: spinDuration }}
          >
            <ellipse cx="0" cy="0" rx="56" ry="12" fill="#0a0a0a" />
            <ellipse cx="0" cy="-1" rx="56" ry="11" fill="#1a1a1a" />
            {/* grooves */}
            <ellipse cx="0" cy="0" rx="48" ry="10" fill="none" stroke="#2a2a2a" strokeWidth="0.5" />
            <ellipse cx="0" cy="0" rx="40" ry="8" fill="none" stroke="#2a2a2a" strokeWidth="0.5" />
            <ellipse cx="0" cy="0" rx="32" ry="6" fill="none" stroke="#2a2a2a" strokeWidth="0.5" />
            {/* label */}
            <ellipse cx="0" cy="0" rx="14" ry="3" fill="#c44a4a" />
            <circle cx="0" cy="0" r="1.5" fill="#3a2113" />
          </g>
        </g>
        {/* tone arm */}
        <g transform={`translate(${w - 36}, -6)`}>
          <circle cx="0" cy="0" r="6" fill="#c4a878" />
          <line x1="0" y1="0" x2="-40" y2="20" stroke="#c4a878" strokeWidth="3" />
          <circle cx="-40" cy="20" r="3" fill="#3a2113" />
        </g>
        {/* knobs */}
        <circle cx="22" cy={h / 2} r="6" fill="#c4a878" />
        <circle cx="22" cy={h / 2} r="2" fill="#3a2113" />
        <circle cx="42" cy={h / 2} r="6" fill="#c4a878" />
        <circle cx="42" cy={h / 2} r="2" fill="#3a2113" />
        {/* musical notes drifting up — brighter when actively playing */}
        <g style={{ transformOrigin: "0 0" }}>
          <text
            x={w - 30}
            y={-30}
            fontFamily="serif"
            fontSize={active ? "26" : "22"}
            fill="#ffd966"
            opacity={active ? "1" : "0.85"}
            className={active ? "animate-twinkle" : "animate-twinkleSlow"}
          >
            ♪
          </text>
          <text
            x={w - 12}
            y={-50}
            fontFamily="serif"
            fontSize={active ? "22" : "18"}
            fill="#ffd966"
            opacity={active ? "0.95" : "0.65"}
            className={active ? "animate-twinkleSlow" : "animate-twinkle"}
          >
            ♫
          </text>
          {active && (
            <text
              x={w - 60}
              y={-65}
              fontFamily="serif"
              fontSize="16"
              fill="#ffd966"
              opacity="0.85"
              className="animate-twinkle"
            >
              ♩
            </text>
          )}
        </g>
      </g>
    </g>
  );
}

/* ──────────────────────────────────────────────────────────────────────
   MINI FRIDGE
   ────────────────────────────────────────────────────────────────────── */
function MiniFridge({
  x,
  y,
  onClick,
  unread = false,
}: {
  x: number;
  y: number;
  onClick?: () => void;
  unread?: boolean;
}) {
  const w = 150;
  const h = 250;
  const interactive = !!onClick;
  return (
    <g
      transform={`translate(${x}, ${y})`}
      onClick={onClick}
      style={interactive ? { cursor: "pointer" } : undefined}
      className={interactive ? "barnhouse-fridge" : undefined}
      tabIndex={interactive ? 0 : undefined}
      role={interactive ? "button" : undefined}
      aria-label={interactive ? "Open the note board on the fridge" : undefined}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
    >
      <ellipse cx={w / 2} cy={h + 8} rx={w / 2} ry="10" fill="#000" opacity="0.3" />
      {/* body */}
      <rect x="0" y="0" width={w} height={h} rx="10" fill="#f0ead6" />
      <rect x="0" y="0" width={w} height={h} rx="10" fill="none" stroke="#c4b896" strokeWidth="2" />
      {/* freezer split */}
      <line x1="6" y1={h * 0.32} x2={w - 6} y2={h * 0.32} stroke="#c4b896" strokeWidth="2" />
      {/* handles */}
      <rect x={w - 22} y="20" width="8" height="40" rx="3" fill="#c4a878" />
      <rect x={w - 22} y={h * 0.32 + 20} width="8" height="80" rx="3" fill="#c4a878" />
      {/* magnets */}
      <circle cx={w * 0.3} cy={h * 0.55} r="6" fill="#c44a4a" />
      <rect x={w * 0.45} y={h * 0.62} width="22" height="14" fill="#ffd966" rx="2" />
      <text x={w * 0.45 + 11} y={h * 0.62 + 11} textAnchor="middle" fontSize="9" fill="#5a3520" fontFamily="var(--font-fredoka), system-ui">us</text>
      <path d={`M ${w * 0.25} ${h * 0.75} l 5 -5 l 5 5 l -5 5 z`} fill="#3a8a5a" />
      {/* a small "note pinned" magnet to hint that the fridge is the notes spot */}
      <g transform={`translate(${w * 0.5}, ${h * 0.18})`}>
        <rect x="-16" y="-10" width="32" height="20" rx="2" fill="#fff9ec" stroke="#c4a878" strokeWidth="0.8" />
        <circle cx="0" cy="-10" r="2.5" fill="#c44a4a" />
        <line x1="-10" y1="-2" x2="10" y2="-2" stroke="#c4b896" strokeWidth="0.8" />
        <line x1="-10" y1="3" x2="6" y2="3" stroke="#c4b896" strokeWidth="0.8" />
      </g>
      {/* base */}
      <rect x="6" y={h - 14} width={w - 12} height="6" fill="#c4b896" />

      {/* unread "!" badge — floats above the top-right corner */}
      {unread && (
        <g transform={`translate(${w - 6}, 4)`} style={{ pointerEvents: "none" }}>
          <circle r="22" fill="#ff4444" opacity="0.35" className="animate-breathe" />
          <circle r="16" fill="#e22b2b" stroke="#fff9ec" strokeWidth="3" />
          <text
            x="0"
            y="1"
            textAnchor="middle"
            dominantBaseline="central"
            fontFamily="var(--font-fredoka), system-ui, sans-serif"
            fontSize="22"
            fontWeight="700"
            fill="#fff9ec"
          >
            !
          </text>
        </g>
      )}
    </g>
  );
}

/* ──────────────────────────────────────────────────────────────────────
   POTTED PLANT (left corner)
   ────────────────────────────────────────────────────────────────────── */
function PottedPlant({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <ellipse cx="50" cy="158" rx="40" ry="8" fill="#000" opacity="0.25" />
      {/* pot */}
      <path d="M 16 100 L 84 100 L 78 160 L 22 160 Z" fill="#c44a4a" />
      <rect x="14" y="96" width="72" height="10" rx="2" fill="#7a2d3a" />
      {/* leaves */}
      <g>
        <path d="M 50 100 Q 20 50, 30 14 Q 36 40, 50 70 Z" fill="#3a8a5a" />
        <path d="M 50 100 Q 80 60, 76 18 Q 62 50, 50 80 Z" fill="#4a9a6a" />
        <path d="M 50 100 Q 50 50, 50 8 Q 56 40, 56 80 Z" fill="#3a8a5a" />
        <path d="M 50 100 Q 30 70, 18 38 Q 36 60, 50 90 Z" fill="#4a9a6a" />
        <path d="M 50 100 Q 70 70, 84 42 Q 70 64, 56 92 Z" fill="#3a8a5a" />
      </g>
    </g>
  );
}

/* ──────────────────────────────────────────────────────────────────────
   SLEEPING CAT
   ────────────────────────────────────────────────────────────────────── */
function SleepingCat({ x, y }: { x: number; y: number }) {
  // Ginger tabby — cozier and far more visible on a red rug than the brown version.
  const base = "#e08642";
  const dark = "#a45418";
  const stripe = "#c46a25";
  const belly = "#f6c388";
  return (
    <g
      transform={`translate(${x}, ${y}) scale(1.5)`}
      className="animate-breathe"
      style={{ transformOrigin: `${x + 100}px ${y + 40}px` }}
    >
      {/* shadow */}
      <ellipse cx="100" cy="78" rx="92" ry="10" fill="#000" opacity="0.35" />
      {/* body — curled up */}
      <ellipse cx="100" cy="48" rx="92" ry="36" fill={dark} />
      <ellipse cx="100" cy="44" rx="86" ry="32" fill={base} />
      {/* belly highlight */}
      <ellipse cx="105" cy="56" rx="60" ry="14" fill={belly} opacity="0.7" />
      {/* tabby stripes on back */}
      <path d="M 60 20 Q 70 28, 60 36" stroke={stripe} strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M 90 16 Q 100 24, 90 32" stroke={stripe} strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M 120 18 Q 130 26, 120 34" stroke={stripe} strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M 150 22 Q 160 30, 150 38" stroke={stripe} strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* tail wrapping around the front */}
      <path
        d="M 185 50 Q 205 38, 195 20 Q 178 10, 160 26"
        fill="none"
        stroke={dark}
        strokeWidth="18"
        strokeLinecap="round"
      />
      <path
        d="M 185 50 Q 205 38, 195 20 Q 178 10, 160 26"
        fill="none"
        stroke={base}
        strokeWidth="13"
        strokeLinecap="round"
      />
      {/* tail tip white */}
      <circle cx="160" cy="26" r="6" fill="#fff5e6" />
      {/* head */}
      <circle cx="32" cy="40" r="26" fill={dark} />
      <circle cx="32" cy="40" r="23" fill={base} />
      {/* tabby stripes on head */}
      <path d="M 20 22 q 6 4 0 10" stroke={stripe} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M 32 18 q 0 6 0 10" stroke={stripe} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M 44 22 q -6 4 0 10" stroke={stripe} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* ears */}
      <polygon points="14,24 16,6 30,22" fill={dark} />
      <polygon points="48,22 52,4 36,22" fill={dark} />
      <polygon points="16,22 19,12 24,22" fill="#f5b39c" />
      <polygon points="44,22 47,12 40,22" fill="#f5b39c" />
      {/* cheeks */}
      <circle cx="22" cy="46" r="8" fill="#f6c388" opacity="0.7" />
      <circle cx="42" cy="46" r="8" fill="#f6c388" opacity="0.7" />
      {/* closed eyes — content */}
      <path d="M 18 40 q 5 -4 10 0" stroke="#1a0e08" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M 36 40 q 5 -4 10 0" stroke="#1a0e08" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* nose */}
      <path d="M 32 50 l -3 3 l 6 0 z" fill="#d96a8a" />
      {/* mouth */}
      <path d="M 32 53 q -3 4 -6 3 M 32 53 q 3 4 6 3" stroke="#1a0e08" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      {/* whiskers */}
      <line x1="10" y1="48" x2="-6" y2="46" stroke="#fff5e6" strokeWidth="1" />
      <line x1="10" y1="51" x2="-6" y2="53" stroke="#fff5e6" strokeWidth="1" />
      <line x1="54" y1="48" x2="70" y2="46" stroke="#fff5e6" strokeWidth="1" />
      <line x1="54" y1="51" x2="70" y2="53" stroke="#fff5e6" strokeWidth="1" />
      {/* paws tucked */}
      <ellipse cx="62" cy="72" rx="14" ry="7" fill={dark} />
      <ellipse cx="62" cy="71" rx="12" ry="5" fill={base} />
      {/* tiny "z" for sleeping */}
      <text x="58" y="0" fontFamily="var(--font-fredoka), system-ui, sans-serif" fontSize="20" fontWeight="600" fill="#fff9ec" opacity="0.85" className="animate-twinkleSlow">z</text>
      <text x="72" y="-16" fontFamily="var(--font-fredoka), system-ui, sans-serif" fontSize="14" fontWeight="600" fill="#fff9ec" opacity="0.6" className="animate-twinkle">z</text>
    </g>
  );
}

/* ──────────────────────────────────────────────────────────────────────
   FIRE GLOW WASH — soft amber light over the whole scene from fireplace
   ────────────────────────────────────────────────────────────────────── */
function FireGlowWash() {
  return (
    <g style={{ pointerEvents: "none", mixBlendMode: "screen" }}>
      <ellipse cx="800" cy="800" rx="900" ry="500" fill="url(#warmWash)" />
    </g>
  );
}
