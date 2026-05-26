"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { UserId } from "@/lib/types";

const STORAGE_KEY = "barnhouse:identity";

type IdentityCtx = {
  /** null while we're still reading from localStorage (SSR / first paint). */
  identity: UserId | null;
  /** false until we've checked localStorage exactly once. */
  hydrated: boolean;
  setIdentity: (id: UserId) => void;
  clearIdentity: () => void;
};

const Ctx = createContext<IdentityCtx | null>(null);

export function IdentityProvider({ children }: { children: React.ReactNode }) {
  const [identity, setIdentityState] = useState<UserId | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw === "jason" || raw === "melisa") {
        setIdentityState(raw);
      }
    } catch {
      // ignore — private mode etc.
    }
    setHydrated(true);
  }, []);

  const setIdentity = useCallback((id: UserId) => {
    setIdentityState(id);
    try {
      window.localStorage.setItem(STORAGE_KEY, id);
    } catch {}
  }, []);

  const clearIdentity = useCallback(() => {
    setIdentityState(null);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, []);

  return (
    <Ctx.Provider value={{ identity, hydrated, setIdentity, clearIdentity }}>
      {children}
    </Ctx.Provider>
  );
}

export function useIdentity() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useIdentity must be inside <IdentityProvider>");
  return v;
}
