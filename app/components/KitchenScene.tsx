"use client";

import React from "react";
import { NavArrow, NavArrowDefs } from "./NavArrow";

/**
 * The kitchen — sits to the RIGHT of the main cabin. A cozy cottage
 * kitchenette with a vintage sage-green stove, butcher-block counter,
 * window with herbs on the sill, hanging copper pots, open shelving,
 * and a checkered floor mat.
 *
 * Composition (1600x1000 viewBox):
 *   - Same wood walls / ceiling beams / floor / fairy lights as the
 *     cabin (continuity).
 *   - Gold floor arrow on the LEFT → back to the cabin.
 *   - Window above the sink (left-center).
 *   - Butcher-block counter spanning the back wall, with cabinets below.
 *   - Vintage stove in the right of center, with a kettle on the burner
 *     and a range hood above.
 *   - Hanging copper pots above the counter between window and stove.
 *   - Open shelves on the right wall with mason jars, a cookbook, plates.
 *   - Hanging herb bundle from a ceiling beam.
 *   - Pendant lamp over the counter.
 *   - Cutting board with sourdough + fruit bowl on the counter.
 *   - Checkered red-cream mat on the floor in front.
 */
export function KitchenScene({
  onLeftArrowClick,
}: {
  onLeftArrowClick?: () => void;
} = {}) {
  return (
    <svg
      viewBox="0 0 1600 1000"
      preserveAspectRatio="xMidYMid slice"
      className="w-full h-full block"
      role="img"
      aria-label="The cabin kitchen — a cozy cottage kitchenette with a vintage stove, sink under a moonlit window, hanging copper pots, open shelving, and fresh bread on the counter."
    >
      <KitchenDefs />

      <BackWall />
      <CeilingBeams />

      {/* Lower cabinets / counter run across the wall */}
      <CounterAndCabinets />

      {/* Wall items on the back wall (z: behind front items) */}
      <KitchenWindow x={220} y={170} w={320} h={310} />
      <SinkBasin x={250} y={580} w={260} h={60} />
      <Faucet x={380} y={520} />
      <RangeHood x={760} y={200} w={280} h={210} />
      <Stove x={770} y={460} w={260} h={400} />
      <HangingPots x={600} y={140} />
      <HangingHerbs x={1100} y={140} />
      <OpenShelves x={1200} y={220} />
      <PendantLamp x={380} y={70} />
      <PendantLamp x={1100} y={70} small />

      {/* Things sitting on the counter */}
      <CuttingBoardWithBread x={620} y={530} />
      <FruitBowl x={910} y={540} />

      <FairyLights />

      <Floor />
      <CheckeredMat cx={700} cy={920} rx={400} ry={28} />

      <NavArrow
        x={180}
        y={935}
        direction="left"
        onClick={onLeftArrowClick}
        label="Go back into the cabin"
      />

      <WarmWash />
    </svg>
  );
}

/* ─── defs ─────────────────────────────────────────────────────────── */
function KitchenDefs() {
  return (
    <defs>
      <linearGradient id="kitWallWood" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#a06d4b" />
        <stop offset="55%" stopColor="#8b5a3c" />
        <stop offset="100%" stopColor="#6b3f23" />
      </linearGradient>

      <linearGradient id="kitFloorWood" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#5e3a25" />
        <stop offset="100%" stopColor="#3a2113" />
      </linearGradient>

      <linearGradient id="kitNightSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#0a0628" />
        <stop offset="60%" stopColor="#1a1850" />
        <stop offset="100%" stopColor="#2d2870" />
      </linearGradient>

      <radialGradient id="kitMoonGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#fff5cc" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#fff5cc" stopOpacity="0" />
      </radialGradient>

      <linearGradient id="butcherBlock" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#d4a878" />
        <stop offset="100%" stopColor="#a8855a" />
      </linearGradient>

      <linearGradient id="cabinetWood" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#8b5a3c" />
        <stop offset="100%" stopColor="#5a3520" />
      </linearGradient>

      <linearGradient id="stoveSage" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#bcd6bc" />
        <stop offset="55%" stopColor="#a4c4a8" />
        <stop offset="100%" stopColor="#7aa080" />
      </linearGradient>

      <radialGradient id="copperGrad" cx="35%" cy="30%" r="65%">
        <stop offset="0%" stopColor="#e8a96c" />
        <stop offset="55%" stopColor="#b87333" />
        <stop offset="100%" stopColor="#6e3f17" />
      </radialGradient>

      <radialGradient id="kitWarm" cx="50%" cy="70%" r="60%">
        <stop offset="0%" stopColor="#ffb066" stopOpacity="0.3" />
        <stop offset="55%" stopColor="#ff8a3a" stopOpacity="0.08" />
        <stop offset="100%" stopColor="#ff7b3a" stopOpacity="0" />
      </radialGradient>

      <pattern id="kitPlanks" x="0" y="0" width="160" height="200" patternUnits="userSpaceOnUse">
        <rect width="160" height="200" fill="url(#kitWallWood)" />
        <line x1="0" y1="0" x2="0" y2="200" stroke="#5a3520" strokeWidth="2" opacity="0.55" />
        <line x1="40" y1="20" x2="40" y2="180" stroke="#6b3f23" strokeWidth="1" opacity="0.35" />
        <line x1="100" y1="0" x2="100" y2="200" stroke="#6b3f23" strokeWidth="1" opacity="0.4" />
        <ellipse cx="120" cy="60" rx="6" ry="3" fill="#5a3520" opacity="0.35" />
        <ellipse cx="20" cy="140" rx="5" ry="2.5" fill="#5a3520" opacity="0.3" />
      </pattern>

      <pattern id="kitFloorPlanks" x="0" y="0" width="180" height="180" patternUnits="userSpaceOnUse">
        <rect width="180" height="180" fill="url(#kitFloorWood)" />
        <line x1="0" y1="60" x2="180" y2="60" stroke="#2a1709" strokeWidth="1.5" opacity="0.65" />
        <line x1="0" y1="120" x2="180" y2="120" stroke="#2a1709" strokeWidth="1.5" opacity="0.65" />
        <line x1="60" y1="0" x2="60" y2="60" stroke="#2a1709" strokeWidth="1.2" opacity="0.4" />
        <line x1="140" y1="60" x2="140" y2="120" stroke="#2a1709" strokeWidth="1.2" opacity="0.4" />
        <line x1="40" y1="120" x2="40" y2="180" stroke="#2a1709" strokeWidth="1.2" opacity="0.4" />
      </pattern>

      <pattern
        id="kitCheckered"
        x="0"
        y="0"
        width="56"
        height="28"
        patternUnits="userSpaceOnUse"
      >
        <rect width="56" height="28" fill="#fff5e6" />
        <rect x="0" y="0" width="28" height="14" fill="#c44a4a" />
        <rect x="28" y="14" width="28" height="14" fill="#c44a4a" />
      </pattern>

      <NavArrowDefs />
    </defs>
  );
}

/* ─── shared scene primitives ────────────────────────────────────── */
function BackWall() {
  return (
    <g>
      <rect x="0" y="0" width="1600" height="900" fill="url(#kitPlanks)" />
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
      <rect x="0" y="880" width="1600" height="120" fill="url(#kitFloorPlanks)" />
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

/* ─── counter + lower cabinets ───────────────────────────────────── */
function CounterAndCabinets() {
  // The counter runs across the back wall, cabinets sit under it.
  const counterY = 580;
  const counterH = 30;
  const cabinetTop = counterY + counterH;
  const cabinetBottom = 880;
  return (
    <g>
      {/* cabinet body */}
      <rect
        x="120"
        y={cabinetTop}
        width="1380"
        height={cabinetBottom - cabinetTop}
        fill="url(#cabinetWood)"
      />
      {/* cabinet doors (5 wide doors with handles) */}
      {[200, 440, 680, 920, 1160, 1400].map((x, i, arr) => {
        if (i === arr.length - 1) return null;
        const w = arr[i + 1] - x - 12;
        return (
          <g key={i} transform={`translate(${x + 6}, ${cabinetTop + 16})`}>
            <rect
              width={w}
              height={cabinetBottom - cabinetTop - 32}
              rx="3"
              fill="#7a4a2f"
            />
            <rect
              x="6"
              y="6"
              width={w - 12}
              height={cabinetBottom - cabinetTop - 44}
              rx="2"
              fill="none"
              stroke="#5a3520"
              strokeWidth="1.5"
              opacity="0.6"
            />
            {/* brass knob */}
            <circle
              cx={w / 2}
              cy={(cabinetBottom - cabinetTop - 32) / 2}
              r="5"
              fill="#c4a878"
            />
            <circle
              cx={w / 2 - 1}
              cy={(cabinetBottom - cabinetTop - 32) / 2 - 1}
              r="1.5"
              fill="#fff5cc"
              opacity="0.8"
            />
          </g>
        );
      })}
      {/* toe kick */}
      <rect x="120" y={cabinetBottom - 16} width="1380" height="16" fill="#3a2113" />

      {/* counter top (butcher block) */}
      <rect
        x="110"
        y={counterY - 4}
        width="1400"
        height={counterH + 8}
        rx="3"
        fill="#3a2113"
      />
      <rect
        x="115"
        y={counterY}
        width="1390"
        height={counterH}
        fill="url(#butcherBlock)"
      />
      {/* grain lines */}
      {[160, 380, 620, 860, 1100, 1340].map((x, i) => (
        <line
          key={i}
          x1={x}
          y1={counterY + 4}
          x2={x}
          y2={counterY + counterH - 4}
          stroke="#7a5530"
          strokeWidth="1"
          opacity="0.5"
        />
      ))}
      {/* highlight along the front edge */}
      <rect
        x="115"
        y={counterY}
        width="1390"
        height="4"
        fill="#e8c896"
        opacity="0.6"
      />
    </g>
  );
}

/* ─── window above the sink ──────────────────────────────────────── */
function KitchenWindow({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  const innerX = x + 14;
  const innerY = y + 14;
  const innerW = w - 28;
  const innerH = h - 28;
  return (
    <g>
      {/* casing */}
      <rect x={x - 8} y={y - 8} width={w + 16} height={h + 16} rx="6" fill="#3a2113" />
      <rect x={x} y={y} width={w} height={h} rx="4" fill="#6b3f23" />
      {/* pane background */}
      <rect x={innerX} y={innerY} width={innerW} height={innerH} fill="url(#kitNightSky)" />

      {/* moon */}
      <g transform={`translate(${innerX + innerW * 0.72}, ${innerY + innerH * 0.24})`}>
        <circle r="28" fill="url(#kitMoonGlow)" />
        <circle r="16" fill="#fff5cc" />
        <circle cx="5" cy="-2" r="16" fill="#1a1850" />
      </g>

      {/* hill / garden silhouette at the bottom */}
      <path
        d={`M ${innerX} ${innerY + innerH - 20} Q ${innerX + innerW * 0.3} ${innerY + innerH - 60} ${innerX + innerW * 0.55} ${innerY + innerH - 40} Q ${innerX + innerW * 0.8} ${innerY + innerH - 70} ${innerX + innerW} ${innerY + innerH - 30} L ${innerX + innerW} ${innerY + innerH} L ${innerX} ${innerY + innerH} Z`}
        fill="#06031a"
      />
      {/* tree silhouettes */}
      <polygon
        points={`${innerX + innerW * 0.15},${innerY + innerH - 30} ${innerX + innerW * 0.22},${innerY + innerH - 90} ${innerX + innerW * 0.3},${innerY + innerH - 30}`}
        fill="#06031a"
      />
      <polygon
        points={`${innerX + innerW * 0.4},${innerY + innerH - 36} ${innerX + innerW * 0.48},${innerY + innerH - 105} ${innerX + innerW * 0.56},${innerY + innerH - 36}`}
        fill="#06031a"
      />

      {/* a few stars */}
      {[
        [25, 30], [80, 20], [140, 50], [200, 30],
        [60, 80], [150, 90], [225, 80], [40, 130],
      ].map(([dx, dy], i) => (
        <circle
          key={i}
          cx={innerX + dx}
          cy={innerY + dy}
          r={i % 2 === 0 ? 1.4 : 1}
          fill="#fff9ec"
          className={i % 2 === 0 ? "animate-twinkle" : "animate-twinkleSlow"}
          style={{ animationDelay: `${(i * 0.4) % 3}s` }}
        />
      ))}

      {/* window mullions (4-pane grid) */}
      <line
        x1={innerX + innerW / 2}
        y1={innerY}
        x2={innerX + innerW / 2}
        y2={innerY + innerH}
        stroke="#6b3f23"
        strokeWidth="6"
      />
      <line
        x1={innerX}
        y1={innerY + innerH / 2}
        x2={innerX + innerW}
        y2={innerY + innerH / 2}
        stroke="#6b3f23"
        strokeWidth="6"
      />

      {/* sill (extends beyond the casing) */}
      <rect x={x - 22} y={y + h - 6} width={w + 44} height="20" rx="3" fill="#3a2113" />
      <rect x={x - 20} y={y + h - 6} width={w + 40} height="8" fill="#8b5a3c" />

      {/* clay pots with herbs on the sill */}
      <ClayPotHerb cx={x - 8} cy={y + h - 6} variant="basil" />
      <ClayPotHerb cx={x + w / 2} cy={y + h - 6} variant="rosemary" />
      <ClayPotHerb cx={x + w + 8} cy={y + h - 6} variant="thyme" />
    </g>
  );
}

function ClayPotHerb({
  cx,
  cy,
  variant,
}: {
  cx: number;
  cy: number;
  variant: "basil" | "rosemary" | "thyme";
}) {
  const potTop = cy - 4;
  const potBot = cy + 26;
  return (
    <g transform={`translate(${cx}, 0)`}>
      {/* pot */}
      <path d={`M -16 ${potTop} L 16 ${potTop} L 12 ${potBot} L -12 ${potBot} Z`} fill="#c46a44" />
      <rect x="-16" y={potTop - 4} width="32" height="6" rx="1" fill="#8a4a2a" />
      <path d={`M -16 ${potTop} L 16 ${potTop} L 14 ${potTop + 4} L -14 ${potTop + 4} Z`} fill="#e08a5e" opacity="0.7" />
      {/* leaves */}
      {variant === "basil" && (
        <g>
          <ellipse cx="-6" cy={potTop - 14} rx="6" ry="9" fill="#3a8a5a" transform={`rotate(-20 -6 ${potTop - 14})`} />
          <ellipse cx="6" cy={potTop - 16} rx="6" ry="9" fill="#4aa66a" transform={`rotate(20 6 ${potTop - 16})`} />
          <ellipse cx="0" cy={potTop - 22} rx="5" ry="8" fill="#3a8a5a" />
        </g>
      )}
      {variant === "rosemary" && (
        <g>
          {[-9, -3, 3, 9].map((dx, i) => (
            <line
              key={i}
              x1={dx}
              y1={potTop - 4}
              x2={dx + (i % 2 ? 1 : -1) * 2}
              y2={potTop - 22}
              stroke="#3a7a4a"
              strokeWidth="2"
              strokeLinecap="round"
            />
          ))}
          <ellipse cx="0" cy={potTop - 14} rx="11" ry="5" fill="#3a7a4a" opacity="0.55" />
        </g>
      )}
      {variant === "thyme" && (
        <g>
          {[-10, -2, 6, -5, 4].map((dx, i) => (
            <circle
              key={i}
              cx={dx}
              cy={potTop - 8 - (i % 2) * 6}
              r="3.5"
              fill="#5aa66a"
              opacity="0.85"
            />
          ))}
          <ellipse cx="0" cy={potTop - 12} rx="11" ry="4" fill="#3a8a5a" opacity="0.4" />
        </g>
      )}
    </g>
  );
}

/* ─── sink basin ─────────────────────────────────────────────────── */
function SinkBasin({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return (
    <g>
      {/* basin recess in counter */}
      <rect x={x} y={y - 6} width={w} height={h + 6} rx="4" fill="#3a2113" />
      <rect x={x + 4} y={y - 2} width={w - 8} height={h - 2} rx="3" fill="#d4d4d0" />
      <rect x={x + 4} y={y - 2} width={w - 8} height={h - 2} rx="3" fill="url(#stoveSage)" opacity="0.2" />
      {/* shiny rim highlight */}
      <rect x={x + 4} y={y - 2} width={w - 8} height="3" rx="2" fill="#fff5e6" opacity="0.5" />
      {/* drain */}
      <ellipse cx={x + w / 2} cy={y + h - 18} rx="14" ry="4" fill="#5a5a58" />
      <ellipse cx={x + w / 2} cy={y + h - 18} rx="10" ry="2.5" fill="#2a2a28" />
      {/* small sponge */}
      <rect x={x + w * 0.62} y={y + 8} width="22" height="10" rx="2" fill="#ffd966" />
      <rect x={x + w * 0.62} y={y + 8} width="22" height="3" rx="1" fill="#3a8a5a" />
    </g>
  );
}

/* ─── tall faucet behind the basin ───────────────────────────────── */
function Faucet({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* base on counter */}
      <ellipse cx="0" cy="62" rx="14" ry="4" fill="#8a8a88" />
      {/* vertical pipe */}
      <rect x="-5" y="0" width="10" height="62" rx="2" fill="#c4c4c2" />
      <rect x="-5" y="0" width="3" height="62" fill="#fff5e6" opacity="0.5" />
      {/* curved spout */}
      <path
        d="M 0 0 Q 0 -20, 30 -20 L 60 -20 Q 70 -20, 70 -8"
        stroke="#c4c4c2"
        strokeWidth="10"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 0 -4 Q 0 -22, 30 -22 L 60 -22"
        stroke="#fff5e6"
        strokeWidth="2"
        fill="none"
        opacity="0.6"
      />
      {/* spout tip */}
      <rect x="66" y="-12" width="8" height="10" rx="1" fill="#8a8a88" />
      {/* hot/cold knobs */}
      <circle cx="-22" cy="10" r="6" fill="#c4c4c2" />
      <circle cx="-22" cy="10" r="2.5" fill="#c44a4a" />
      <circle cx="22" cy="10" r="6" fill="#c4c4c2" />
      <circle cx="22" cy="10" r="2.5" fill="#5fb9e8" />
    </g>
  );
}

/* ─── vintage stove ──────────────────────────────────────────────── */
function Stove({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return (
    <g>
      {/* body */}
      <rect x={x} y={y} width={w} height={h} rx="8" fill="url(#stoveSage)" />
      {/* darker outline */}
      <rect x={x} y={y} width={w} height={h} rx="8" fill="none" stroke="#5e7a5e" strokeWidth="2" />
      {/* top edge — slightly raised */}
      <rect x={x - 6} y={y - 4} width={w + 12} height="14" rx="3" fill="#6e8c70" />
      {/* burners (4 circles) */}
      {[
        [x + w * 0.25, y + 38],
        [x + w * 0.75, y + 38],
        [x + w * 0.25, y + 96],
        [x + w * 0.75, y + 96],
      ].map(([cx, cy], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r="22" fill="#3a3a38" />
          <circle cx={cx} cy={cy} r="17" fill="#1a1a18" />
          <circle cx={cx} cy={cy} r="14" fill="none" stroke="#3a3a38" strokeWidth="1" />
          <circle cx={cx} cy={cy} r="9" fill="none" stroke="#3a3a38" strokeWidth="1" />
          <circle cx={cx} cy={cy} r="3" fill="#3a3a38" />
        </g>
      ))}
      {/* the front-right burner has a kettle on it */}
      <Kettle x={x + w * 0.72} y={y + 70} />

      {/* control panel below burners */}
      <rect x={x + 6} y={y + 150} width={w - 12} height="34" rx="3" fill="#7aa080" />
      <rect x={x + 6} y={y + 150} width={w - 12} height="4" fill="#a4c4a8" opacity="0.6" />
      {/* knobs */}
      {[0.2, 0.4, 0.6, 0.8].map((t, i) => (
        <g key={i} transform={`translate(${x + w * t}, ${y + 167})`}>
          <circle r="7" fill="#3a3a38" />
          <circle r="5" fill="#c4a878" />
          <line x1="0" y1="0" x2="0" y2="-4" stroke="#3a3a38" strokeWidth="1.6" />
        </g>
      ))}

      {/* oven door */}
      <rect x={x + 10} y={y + 200} width={w - 20} height={h - 220} rx="4" fill="#7aa080" />
      <rect
        x={x + 18}
        y={y + 210}
        width={w - 36}
        height={h - 240}
        rx="3"
        fill="#0a0628"
        opacity="0.7"
      />
      {/* warm glow inside the oven */}
      <ellipse
        cx={x + w / 2}
        cy={y + h - 60}
        rx={(w - 60) / 2}
        ry="38"
        fill="#ff7b3a"
        opacity="0.55"
        className="animate-breathe"
      />
      <ellipse
        cx={x + w / 2}
        cy={y + h - 60}
        rx={(w - 90) / 2}
        ry="24"
        fill="#ffd966"
        opacity="0.55"
      />

      {/* handle bar */}
      <rect x={x + 22} y={y + 205} width={w - 44} height="6" rx="3" fill="#c4a878" />

      {/* little legs */}
      <rect x={x + 4} y={y + h - 4} width="14" height="10" rx="2" fill="#3a2113" />
      <rect x={x + w - 18} y={y + h - 4} width="14" height="10" rx="2" fill="#3a2113" />
    </g>
  );
}

function Kettle({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* steam */}
      <g style={{ transformOrigin: "0 0" }}>
        <ellipse cx="-2" cy="-30" rx="6" ry="3" fill="#fff9ec" opacity="0.6" className="animate-twinkleSlow" />
        <ellipse cx="4" cy="-44" rx="5" ry="2.5" fill="#fff9ec" opacity="0.4" className="animate-twinkle" />
        <ellipse cx="-4" cy="-56" rx="4" ry="2" fill="#fff9ec" opacity="0.3" className="animate-twinkleSlow" />
      </g>
      {/* body */}
      <path
        d="M -24 -4 Q -28 -22, -16 -22 L 16 -22 Q 28 -22, 24 -4 L 22 0 L -22 0 Z"
        fill="#3a3a38"
      />
      <path
        d="M -24 -4 Q -28 -22, -16 -22 L 16 -22 Q 28 -22, 24 -4"
        fill="#5a5a58"
        opacity="0.9"
      />
      <path
        d="M -20 -10 Q -22 -18, -12 -18 L 4 -18"
        stroke="#a8a8a6"
        strokeWidth="2"
        fill="none"
        opacity="0.8"
      />
      {/* handle */}
      <path d="M -10 -22 Q -10 -34, 0 -34 Q 10 -34, 10 -22" stroke="#3a3a38" strokeWidth="3" fill="none" />
      {/* spout */}
      <path d="M -22 -10 L -32 -16 L -30 -8 Z" fill="#3a3a38" />
      {/* lid knob */}
      <circle cx="0" cy="-22" r="3" fill="#c4a878" />
    </g>
  );
}

/* ─── range hood ─────────────────────────────────────────────────── */
function RangeHood({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return (
    <g>
      {/* trapezoidal hood */}
      <path
        d={`M ${x + w * 0.18} ${y} L ${x + w * 0.82} ${y} L ${x + w} ${y + h * 0.55} L ${x + w} ${y + h} L ${x} ${y + h} L ${x} ${y + h * 0.55} Z`}
        fill="#5a3520"
      />
      <path
        d={`M ${x + w * 0.18} ${y} L ${x + w * 0.82} ${y} L ${x + w} ${y + h * 0.55} L ${x + w} ${y + h} L ${x} ${y + h} L ${x} ${y + h * 0.55} Z`}
        fill="url(#cabinetWood)"
        opacity="0.9"
      />
      {/* underside (where light would come from) */}
      <rect x={x + 4} y={y + h - 8} width={w - 8} height="8" rx="2" fill="#3a2113" />
      {/* a soft glow under the hood */}
      <ellipse cx={x + w / 2} cy={y + h + 12} rx={(w - 20) / 2} ry="14" fill="#ffd966" opacity="0.18" />
      {/* decorative trim */}
      <line
        x1={x + 12}
        y1={y + h * 0.55 + 8}
        x2={x + w - 12}
        y2={y + h * 0.55 + 8}
        stroke="#3a2113"
        strokeWidth="1.5"
        opacity="0.7"
      />
    </g>
  );
}

/* ─── hanging copper pots ────────────────────────────────────────── */
function HangingPots({ x, y }: { x: number; y: number }) {
  // A horizontal rod with three pots/pans of different sizes hanging.
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* mount brackets */}
      <rect x="-4" y="-6" width="8" height="14" fill="#3a2113" />
      <rect x="146" y="-6" width="8" height="14" fill="#3a2113" />
      {/* rod */}
      <rect x="-6" y="6" width="160" height="6" rx="2" fill="#5a3520" />
      <rect x="-6" y="6" width="160" height="2" fill="#c4a878" opacity="0.6" />

      {/* pot 1 (round saucepan) */}
      <g transform="translate(30, 12)">
        <line x1="0" y1="0" x2="0" y2="14" stroke="#3a2113" strokeWidth="2" />
        <path
          d="M -22 14 L 22 14 L 18 56 Q 0 60, -18 56 Z"
          fill="url(#copperGrad)"
        />
        <ellipse cx="0" cy="14" rx="22" ry="4" fill="#3a2113" />
        <ellipse cx="0" cy="14" rx="22" ry="3" fill="#d68f4f" />
        <path d="M -14 22 Q -16 36, -12 50" stroke="#fff5cc" strokeWidth="1.5" fill="none" opacity="0.6" />
        {/* small handle off the side */}
        <rect x="22" y="18" width="14" height="4" rx="1" fill="#3a2113" />
      </g>

      {/* pot 2 (wider pan) */}
      <g transform="translate(80, 12)">
        <line x1="0" y1="0" x2="0" y2="20" stroke="#3a2113" strokeWidth="2" />
        <path d="M -28 20 L 28 20 L 24 46 Q 0 50, -24 46 Z" fill="url(#copperGrad)" />
        <ellipse cx="0" cy="20" rx="28" ry="4" fill="#3a2113" />
        <ellipse cx="0" cy="20" rx="28" ry="3" fill="#d68f4f" />
        <path d="M -18 28 Q -22 38, -16 44" stroke="#fff5cc" strokeWidth="1.5" fill="none" opacity="0.6" />
      </g>

      {/* pot 3 (small saucepan) */}
      <g transform="translate(125, 12)">
        <line x1="0" y1="0" x2="0" y2="14" stroke="#3a2113" strokeWidth="2" />
        <path d="M -16 14 L 16 14 L 14 40 Q 0 44, -14 40 Z" fill="url(#copperGrad)" />
        <ellipse cx="0" cy="14" rx="16" ry="3" fill="#3a2113" />
        <ellipse cx="0" cy="14" rx="16" ry="2.5" fill="#d68f4f" />
        <rect x="16" y="18" width="12" height="3" rx="1" fill="#3a2113" />
      </g>
    </g>
  );
}

/* ─── hanging herb bundle ────────────────────────────────────────── */
function HangingHerbs({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* hook */}
      <rect x="-2" y="-4" width="4" height="10" fill="#3a2113" />
      <line x1="0" y1="6" x2="0" y2="22" stroke="#5a3520" strokeWidth="1.5" />
      {/* twine binding */}
      <rect x="-12" y="20" width="24" height="6" fill="#a8855a" rx="1" />
      <line x1="-10" y1="23" x2="10" y2="23" stroke="#7a5530" strokeWidth="0.8" />
      {/* hanging bundle */}
      <path
        d="M -2 26 L -22 96 L -10 100"
        stroke="#3a7a4a"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 2 26 L 22 96 L 10 100"
        stroke="#3a7a4a"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 0 26 L 0 96"
        stroke="#3a7a4a"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      {/* tiny leaves dotted along the stems */}
      {[35, 50, 65, 80].map((dy, i) => (
        <g key={i}>
          <ellipse cx={-6 - i * 2} cy={dy + i * 4} rx="4" ry="2" fill="#5aa066" transform={`rotate(-30 ${-6 - i * 2} ${dy + i * 4})`} />
          <ellipse cx={6 + i * 2} cy={dy + i * 4} rx="4" ry="2" fill="#5aa066" transform={`rotate(30 ${6 + i * 2} ${dy + i * 4})`} />
          <ellipse cx="0" cy={dy + i * 3} rx="4" ry="2" fill="#3a7a4a" />
        </g>
      ))}
    </g>
  );
}

/* ─── open shelves on the right wall ─────────────────────────────── */
function OpenShelves({ x, y }: { x: number; y: number }) {
  const w = 280;
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* two shelves */}
      <rect x="0" y="0" width={w} height="6" fill="#3a2113" />
      <rect x="0" y="0" width={w} height="2" fill="#8b5a3c" opacity="0.7" />
      <rect x="0" y="120" width={w} height="6" fill="#3a2113" />
      <rect x="0" y="120" width={w} height="2" fill="#8b5a3c" opacity="0.7" />
      <rect x="0" y="240" width={w} height="6" fill="#3a2113" />
      <rect x="0" y="240" width={w} height="2" fill="#8b5a3c" opacity="0.7" />
      {/* L-brackets */}
      {[10, w - 10].map((bx, i) => (
        <g key={i}>
          <path d={`M ${bx} 6 L ${bx} 16 L ${bx + (i ? -8 : 8)} 6 Z`} fill="#3a2113" />
          <path d={`M ${bx} 126 L ${bx} 136 L ${bx + (i ? -8 : 8)} 126 Z`} fill="#3a2113" />
        </g>
      ))}

      {/* top shelf — mason jars */}
      <MasonJar x={28} y={6} />
      <MasonJar x={84} y={6} contents="#7a4a8a" />
      <MasonJar x={140} y={6} contents="#c4a878" />
      <MasonJar x={196} y={6} contents="#3a7a4a" />
      <MasonJar x={252} y={6} contents="#c44a4a" />

      {/* middle shelf — cookbook + bowls */}
      <Cookbook x={20} y={126} />
      <StackedBowls x={140} y={126} />
      <SaltCellar x={224} y={126} />

      {/* bottom shelf — plates leaning */}
      <Plates x={40} y={246} />
      <SmallTeapot x={160} y={246} />
    </g>
  );
}

function MasonJar({
  x,
  y,
  contents = "#f0ead6",
}: {
  x: number;
  y: number;
  contents?: string;
}) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* shadow */}
      <ellipse cx="14" cy="110" rx="14" ry="3" fill="#000" opacity="0.2" />
      {/* jar body */}
      <rect x="0" y="-100" width="28" height="100" rx="3" fill={contents} opacity="0.85" />
      <rect x="0" y="-100" width="28" height="100" rx="3" fill="none" stroke="#3a2113" strokeWidth="1" opacity="0.6" />
      {/* highlight stripe */}
      <rect x="3" y="-94" width="3" height="86" fill="#fff5e6" opacity="0.5" />
      {/* lid */}
      <rect x="-2" y="-110" width="32" height="12" rx="2" fill="#c4a878" />
      <rect x="-2" y="-110" width="32" height="3" rx="2" fill="#e8c896" />
      {/* label */}
      <rect x="2" y="-60" width="24" height="22" rx="1" fill="#fff5e6" opacity="0.85" />
    </g>
  );
}

function Cookbook({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <ellipse cx="40" cy="110" rx="44" ry="4" fill="#000" opacity="0.25" />
      {/* leaning books */}
      <g transform="translate(0, 0) rotate(-4)">
        <rect x="0" y="-92" width="22" height="100" fill="#c44a4a" />
        <rect x="0" y="-92" width="22" height="4" fill="#7a2d3a" />
        <rect x="0" y="-50" width="22" height="2" fill="#fff5cc" opacity="0.7" />
        <rect x="0" y="-44" width="22" height="2" fill="#fff5cc" opacity="0.6" />
      </g>
      <g transform="translate(24, -2) rotate(2)">
        <rect x="0" y="-92" width="22" height="100" fill="#2d5d6e" />
        <rect x="0" y="-92" width="22" height="4" fill="#1a3a48" />
        <rect x="0" y="-60" width="22" height="2" fill="#ffd966" opacity="0.85" />
      </g>
      <g transform="translate(50, 0)">
        <rect x="0" y="-86" width="22" height="94" fill="#7a4a8a" />
        <rect x="0" y="-86" width="22" height="4" fill="#5a3669" />
      </g>
    </g>
  );
}

function StackedBowls({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <ellipse cx="40" cy="112" rx="38" ry="3" fill="#000" opacity="0.25" />
      {/* three nesting bowls */}
      <g transform="translate(0, 0)">
        <ellipse cx="40" cy="108" rx="38" ry="8" fill="#3a2113" />
        <ellipse cx="40" cy="100" rx="38" ry="12" fill="#fff5e6" />
        <ellipse cx="40" cy="98" rx="34" ry="10" fill="#d4d4d0" />
      </g>
      <g transform="translate(8, -20)">
        <ellipse cx="32" cy="100" rx="30" ry="6" fill="#3a2113" />
        <ellipse cx="32" cy="94" rx="30" ry="10" fill="#c4a878" />
        <ellipse cx="32" cy="92" rx="26" ry="8" fill="#d4b896" />
      </g>
      <g transform="translate(14, -34)">
        <ellipse cx="26" cy="92" rx="24" ry="5" fill="#3a2113" />
        <ellipse cx="26" cy="86" rx="24" ry="8" fill="#fff5e6" />
        <ellipse cx="26" cy="84" rx="20" ry="6" fill="#d4d4d0" />
      </g>
    </g>
  );
}

function SaltCellar({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <ellipse cx="14" cy="110" rx="12" ry="3" fill="#000" opacity="0.25" />
      <rect x="2" y="-22" width="24" height="32" rx="3" fill="#a8855a" />
      <rect x="2" y="-22" width="24" height="4" rx="2" fill="#c4a878" />
      <ellipse cx="14" cy="-22" rx="12" ry="3" fill="#5a3520" />
      <rect x="14" y="-30" width="2" height="10" fill="#3a2113" />
    </g>
  );
}

function Plates({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <ellipse cx="30" cy="106" rx="34" ry="3" fill="#000" opacity="0.25" />
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${i * 4}, ${-i * 2})`}>
          <ellipse cx="30" cy="100" rx="32" ry="6" fill="#3a2113" />
          <ellipse cx="30" cy="96" rx="32" ry="10" fill="#fff5e6" />
          <ellipse cx="30" cy="94" rx="28" ry="8" fill="#fffdf5" />
          <ellipse cx="30" cy="94" rx="22" ry="6" fill="none" stroke="#c4a878" strokeWidth="1.2" opacity="0.6" />
        </g>
      ))}
    </g>
  );
}

function SmallTeapot({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <ellipse cx="40" cy="108" rx="36" ry="4" fill="#000" opacity="0.3" />
      {/* body */}
      <ellipse cx="40" cy="76" rx="36" ry="28" fill="#c8e4d4" />
      <ellipse cx="40" cy="62" rx="32" ry="14" fill="#a8c4b4" />
      {/* polka dots */}
      {[20, 32, 50, 60, 36, 48].map((dx, i) => (
        <circle key={i} cx={dx} cy={i % 2 ? 76 : 84} r="2.5" fill="#fff5e6" opacity="0.8" />
      ))}
      {/* spout */}
      <path d="M 4 70 Q -16 64, -16 76 L -10 80 Q -8 74, 6 80 Z" fill="#c8e4d4" />
      {/* handle */}
      <path d="M 76 64 Q 90 64, 90 80 Q 90 96, 76 96" stroke="#c8e4d4" strokeWidth="6" fill="none" />
      {/* lid */}
      <ellipse cx="40" cy="52" rx="14" ry="4" fill="#a8c4b4" />
      <circle cx="40" cy="46" r="4" fill="#a8c4b4" />
    </g>
  );
}

/* ─── pendant lamp over the counter ──────────────────────────────── */
function PendantLamp({
  x,
  y,
  small = false,
}: {
  x: number;
  y: number;
  small?: boolean;
}) {
  const scale = small ? 0.78 : 1;
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* cord */}
      <line x1="0" y1="0" x2="0" y2="120" stroke="#3a2113" strokeWidth="1.6" />
      {/* shade — domed brass */}
      <path
        d="M -28 120 Q -28 100, 0 100 Q 28 100, 28 120 L 22 144 L -22 144 Z"
        fill="url(#copperGrad)"
      />
      <path
        d="M -22 144 L 22 144 L 18 150 L -18 150 Z"
        fill="#5a3520"
      />
      {/* bulb glow underneath */}
      <ellipse cx="0" cy="170" rx="22" ry="6" fill="#ffd966" opacity="0.4" className="animate-breathe" />
      <ellipse cx="0" cy="150" rx="8" ry="3" fill="#ffe27a" className="animate-flicker" />
    </g>
  );
}

/* ─── cutting board with bread + fruit bowl ──────────────────────── */
function CuttingBoardWithBread({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <ellipse cx="50" cy="52" rx="58" ry="6" fill="#000" opacity="0.2" />
      {/* board */}
      <rect x="-8" y="36" width="140" height="14" rx="3" fill="#5a3520" />
      <rect x="-6" y="36" width="138" height="6" fill="url(#butcherBlock)" />
      {/* loaf of bread */}
      <ellipse cx="60" cy="36" rx="58" ry="8" fill="#a8855a" />
      <path
        d="M 6 36 Q 60 -2, 114 36 Z"
        fill="#c4a878"
      />
      {/* scoring lines on top */}
      <path d="M 22 22 Q 34 14, 46 22" stroke="#5a3520" strokeWidth="1.6" fill="none" />
      <path d="M 50 12 Q 62 4, 74 12" stroke="#5a3520" strokeWidth="1.6" fill="none" />
      <path d="M 78 22 Q 90 14, 102 22" stroke="#5a3520" strokeWidth="1.6" fill="none" />
      {/* highlight */}
      <path d="M 12 32 Q 60 4, 108 32" stroke="#e8c896" strokeWidth="2" fill="none" opacity="0.7" />
    </g>
  );
}

function FruitBowl({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <ellipse cx="40" cy="50" rx="44" ry="6" fill="#000" opacity="0.25" />
      {/* bowl */}
      <ellipse cx="40" cy="46" rx="42" ry="10" fill="#3a2113" />
      <ellipse cx="40" cy="42" rx="42" ry="14" fill="#fff5e6" />
      <ellipse cx="40" cy="40" rx="36" ry="10" fill="#fffdf5" />
      {/* fruits stacked */}
      <circle cx="20" cy="28" r="11" fill="#c44a4a" />
      <path d="M 20 17 Q 22 13, 26 14" stroke="#3a8a5a" strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="40" cy="22" r="12" fill="#ff9b3a" />
      <path d="M 40 10 Q 42 6, 44 8" stroke="#3a8a5a" strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="58" cy="28" r="11" fill="#a4c4a8" />
      <path d="M 58 17 Q 60 13, 64 14" stroke="#3a8a5a" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* shine highlights */}
      <ellipse cx="16" cy="24" rx="3" ry="2" fill="#fff5e6" opacity="0.7" />
      <ellipse cx="36" cy="17" rx="3" ry="2" fill="#fff5e6" opacity="0.7" />
      <ellipse cx="54" cy="24" rx="3" ry="2" fill="#fff5e6" opacity="0.7" />
    </g>
  );
}

/* ─── checkered floor mat ────────────────────────────────────────── */
function CheckeredMat({
  cx,
  cy,
  rx,
  ry,
}: {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
}) {
  return (
    <g>
      <ellipse cx={cx} cy={cy + 6} rx={rx} ry={ry} fill="#000" opacity="0.25" />
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="url(#kitCheckered)" />
      {/* border */}
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke="#7a2d3a" strokeWidth="3" />
      {/* fringe */}
      {Array.from({ length: 20 }).map((_, i) => {
        const t = i / 19;
        const fx = cx - rx + t * 2 * rx;
        const fy = cy + ry * Math.sin(Math.acos((fx - cx) / rx));
        return (
          <line
            key={i}
            x1={fx}
            y1={fy}
            x2={fx}
            y2={fy + 4}
            stroke="#7a2d3a"
            strokeWidth="1.2"
          />
        );
      })}
    </g>
  );
}

/* ─── warm wash overlay ──────────────────────────────────────────── */
function WarmWash() {
  return (
    <g style={{ pointerEvents: "none", mixBlendMode: "screen" }}>
      <ellipse cx="900" cy="800" rx="900" ry="500" fill="url(#kitWarm)" />
    </g>
  );
}
