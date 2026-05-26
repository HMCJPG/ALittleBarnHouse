import React from "react";

/**
 * PBS Kids style frame: a thick decorative wooden border wrapping the game stage,
 * with cute floating decorations (moon, stars, drifting clouds) in the outer space.
 */
export function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative z-10 w-full max-w-[1100px] mx-auto px-4 py-8 sm:py-12">
      {/* Decorative moon (top-left) */}
      <div className="pointer-events-none absolute -top-2 left-2 sm:left-4 select-none">
        <svg width="68" height="68" viewBox="0 0 68 68" aria-hidden>
          <defs>
            <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fff5cc" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#fff5cc" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="34" cy="34" r="32" fill="url(#moonGlow)" />
          <circle cx="34" cy="34" r="18" fill="#fff5cc" />
          <circle cx="40" cy="30" r="18" fill="#1a1850" />
          <circle cx="28" cy="32" r="1.6" fill="#e3d7a3" opacity="0.7" />
          <circle cx="24" cy="38" r="1.2" fill="#e3d7a3" opacity="0.6" />
          <circle cx="30" cy="42" r="1" fill="#e3d7a3" opacity="0.5" />
        </svg>
      </div>

      {/* Decorative stars/sparkles around the frame */}
      <Sparkle className="absolute top-6 right-10 animate-twinkle" size={18} />
      <Sparkle className="absolute top-20 right-2 animate-twinkleSlow" size={12} />
      <Sparkle className="absolute bottom-16 left-2 animate-twinkle" size={14} />
      <Sparkle className="absolute bottom-6 right-16 animate-twinkleSlow" size={16} />
      <Sparkle className="absolute top-40 left-1 animate-twinkleSlow" size={10} />

      {/* Title */}
      <header className="text-center mb-5 sm:mb-7 relative">
        <h1 className="font-playful font-bold tracking-wide text-3xl sm:text-5xl text-play-cloud drop-shadow-[0_2px_0_rgba(0,0,0,0.4)]">
          A Little Barn House
        </h1>
        <p className="mt-1 text-play-accent text-sm sm:text-base font-medium">
          a cozy cabin for two
        </p>
      </header>

      {/* The wooden frame */}
      <div className="relative">
        {/* outer wood frame */}
        <div
          className="rounded-[28px] p-3 sm:p-4 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.55)]"
          style={{
            background:
              "linear-gradient(135deg, #a36a3e 0%, #7b3f1a 40%, #5a2d11 100%)",
          }}
        >
          {/* inner highlight bevel */}
          <div
            className="rounded-[20px] p-1.5"
            style={{
              background:
                "linear-gradient(135deg, #c98b5a 0%, #8b5a3c 60%, #6b3f23 100%)",
              boxShadow:
                "inset 0 2px 0 rgba(255,220,180,0.45), inset 0 -2px 6px rgba(0,0,0,0.25)",
            }}
          >
            {/* the stage where the cabin lives */}
            <div className="relative rounded-[14px] overflow-hidden bg-night-deep aspect-[16/10]">
              {children}
            </div>
          </div>
        </div>

        {/* Corner wood-grain knobs (decorative) */}
        <CornerKnob position="tl" />
        <CornerKnob position="tr" />
        <CornerKnob position="bl" />
        <CornerKnob position="br" />
      </div>

      {/* Footer note */}
      <footer className="mt-5 text-center text-play-cloud/70 text-xs sm:text-sm">
        more coming soon — leave a note, light the fire, pick a record
      </footer>
    </div>
  );
}

function Sparkle({
  size = 14,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      aria-hidden
    >
      <path
        d="M12 1 L13.6 9.4 L22 11 L13.6 12.6 L12 21 L10.4 12.6 L2 11 L10.4 9.4 Z"
        fill="#ffcf5c"
      />
    </svg>
  );
}

function CornerKnob({ position }: { position: "tl" | "tr" | "bl" | "br" }) {
  const pos = {
    tl: "top-1 left-1",
    tr: "top-1 right-1",
    bl: "bottom-1 left-1",
    br: "bottom-1 right-1",
  }[position];
  return (
    <div
      className={`absolute ${pos} w-5 h-5 rounded-full pointer-events-none`}
      style={{
        background: "radial-gradient(circle at 35% 30%, #ffcf5c 0%, #b87a2b 70%, #6b3f23 100%)",
        boxShadow: "0 1px 2px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.4)",
      }}
    />
  );
}
