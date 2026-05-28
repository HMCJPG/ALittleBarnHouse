"use client";

import React from "react";

/**
 * A gold arrow that sits "on the floor" of a scene, clickable to navigate
 * to the adjacent room. Squashed vertically so it reads as flat on the floor.
 * Pulses gently to draw the eye.
 */
export function NavArrow({
  x,
  y,
  direction,
  onClick,
  label,
}: {
  x: number;
  y: number;
  direction: "left" | "right";
  onClick?: () => void;
  label: string;
}) {
  const flip = direction === "left" ? -1 : 1;
  // Geometry of a chunky arrow at scale 1:
  //   shaft from -40 .. 20, head from 20 .. 60
  return (
    <g
      transform={`translate(${x}, ${y}) scale(${flip}, 1)`}
      onClick={onClick}
      style={onClick ? { cursor: "pointer" } : undefined}
      className={onClick ? "barnhouse-navarrow" : undefined}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? "button" : undefined}
      aria-label={onClick ? label : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      {/* soft glow on the floor underneath the arrow */}
      <ellipse
        cx="10"
        cy="14"
        rx="74"
        ry="14"
        fill="#ffd966"
        opacity="0.18"
        className="animate-breathe"
      />
      {/* arrow body — squashed to look flat on the floor (transform scaleY) */}
      <g transform="scale(1, 0.55)">
        {/* dark outline for contrast on wood */}
        <path
          d="M -56 -22 L 22 -22 L 22 -38 L 60 0 L 22 38 L 22 22 L -56 22 Z"
          fill="#5a3520"
          opacity="0.55"
          transform="translate(2, 4)"
        />
        {/* gold body */}
        <path
          d="M -56 -22 L 22 -22 L 22 -38 L 60 0 L 22 38 L 22 22 L -56 22 Z"
          fill="url(#navArrowGold)"
        />
        {/* shiny highlight along the top edge */}
        <path
          d="M -54 -18 L 20 -18 L 20 -32 L 50 -2"
          stroke="#fff5cc"
          strokeWidth="2.5"
          fill="none"
          strokeLinejoin="round"
          opacity="0.8"
        />
      </g>
    </g>
  );
}

/**
 * Gradient definition used by NavArrow. Render this once per SVG (inside
 * the scene's <defs>) so all arrows in that SVG can reference it.
 */
export function NavArrowDefs() {
  return (
    <linearGradient id="navArrowGold" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#ffe27a" />
      <stop offset="55%" stopColor="#ffcf5c" />
      <stop offset="100%" stopColor="#b8862a" />
    </linearGradient>
  );
}
