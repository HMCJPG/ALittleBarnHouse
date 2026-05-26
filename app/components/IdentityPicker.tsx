"use client";

import { useIdentity } from "./IdentityProvider";

/**
 * First-visit modal: "Who's stopping by?"
 *
 * Rendered as a full-page overlay over the cabin. Once the user picks,
 * their choice is stored in localStorage and the overlay never shows
 * again on this device (unless they hit the small toggle to switch).
 */
export function IdentityPicker() {
  const { identity, hydrated, setIdentity } = useIdentity();

  // Don't flash the picker while we haven't read localStorage yet.
  if (!hydrated) return null;
  if (identity !== null) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="identity-title"
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
    >
      {/* backdrop */}
      <div className="absolute inset-0 bg-night-deep/85 backdrop-blur-sm" />

      <div
        className="relative w-full max-w-md rounded-3xl p-6 sm:p-8 text-center shadow-2xl"
        style={{
          background:
            "linear-gradient(180deg, #fff9ec 0%, #f5e6c8 100%)",
          boxShadow:
            "0 18px 50px -10px rgba(0,0,0,0.6), inset 0 2px 0 rgba(255,255,255,0.6)",
        }}
      >
        <div className="text-3xl mb-2" aria-hidden>
          ✨
        </div>
        <h2
          id="identity-title"
          className="font-playful font-bold text-2xl text-cabin-wooddark"
        >
          Who's stopping by the cabin?
        </h2>
        <p className="font-playful text-cabin-wooddark/70 mt-1 mb-6 text-sm">
          We'll remember on this device.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setIdentity("melisa")}
            className="flex-1 font-playful font-semibold text-lg rounded-2xl py-4 px-6 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition active:translate-y-0"
            style={{
              background:
                "linear-gradient(135deg, #f78ca0 0%, #c44a4a 100%)",
            }}
          >
            I'm Melisa
          </button>
          <button
            onClick={() => setIdentity("jason")}
            className="flex-1 font-playful font-semibold text-lg rounded-2xl py-4 px-6 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition active:translate-y-0"
            style={{
              background:
                "linear-gradient(135deg, #5fb9e8 0%, #2d5d6e 100%)",
            }}
          >
            I'm Jason
          </button>
        </div>
      </div>
    </div>
  );
}
