"use client";

import {
  createContext,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const PersistenceScopeContext = createContext("");

export function PersistenceScope({
  scope,
  children,
}: PropsWithChildren<{ scope: string }>) {
  return (
    <PersistenceScopeContext.Provider value={scope}>
      {children}
    </PersistenceScopeContext.Provider>
  );
}

export function usePersistentState<T>(
  key: string,
  initialValue: T
): [T, Dispatch<SetStateAction<T>>, boolean] {
  const scope = useContext(PersistenceScopeContext);
  const scopedKey = scope ? `${scope}::${key}` : key;
  const [value, setValue] = useState<T>(initialValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(scopedKey);
      if (raw !== null) setValue(JSON.parse(raw) as T);
    } catch {
      // Keep the safe starter value when browser storage is unavailable or malformed.
    } finally {
      setHydrated(true);
    }
  }, [scopedKey]);

  // Same-tab components do not receive native "storage" events. Broadcast to peers
  // so a grounded asset and its assignment remain consistent across active screens.
  useEffect(() => {
    function apply(raw: string | null) {
      if (raw === null) return;
      setValue((current) => {
        try {
          if (JSON.stringify(current) === raw) return current;
          return JSON.parse(raw) as T;
        } catch { return current; }
      });
    }
    function onLocal(event: Event) {
      const detail = (event as CustomEvent<{key:string; raw:string}>).detail;
      if (detail?.key === scopedKey) apply(detail.raw);
    }
    function onStorage(event: StorageEvent) {
      if (event.key === scopedKey) apply(event.newValue);
    }
    window.addEventListener("bokang:persistence-updated", onLocal);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("bokang:persistence-updated", onLocal);
      window.removeEventListener("storage", onStorage);
    };
  }, [scopedKey]);

  useEffect(() => {
    if (!hydrated) return;
    const serialized = JSON.stringify(value);
    try {
      // Prevent peer-to-peer rebroadcast loops.
      if (window.localStorage.getItem(scopedKey) === serialized) return;
      window.localStorage.setItem(scopedKey, serialized);
    } catch {
      // Still notify other mounted components when browser storage is blocked.
    }
    window.dispatchEvent(new CustomEvent("bokang:persistence-updated", {
      detail: {key: scopedKey, raw: serialized}
    }));
  }, [hydrated, scopedKey, value]);

  return [value, setValue, hydrated];
}

export type WorkspaceConnectionState = {
  google: boolean;
  microsoft: boolean;
  googleAccount?: string;
  microsoftAccount?: string;
};

export type StudioSession = {
  displayName: string;
  email: string;
  role: "Owner" | "Admin" | "Member";
  workspaceName: string;
  connections: WorkspaceConnectionState;
};

const defaultSession: StudioSession = {
  displayName: "Bokang Jobe",
  email: "",
  role: "Owner",
  workspaceName: "Demo workspace",
  connections: { google: false, microsoft: false },
};

type StudioSessionValue = {
  session: StudioSession;
  hydrated: boolean;
  updateSession: (patch: Partial<StudioSession>) => void;
  setConnection: (
    provider: "google" | "microsoft",
    connected: boolean,
    account?: string
  ) => void;
};

const StudioSessionContext = createContext<StudioSessionValue | null>(null);

export function StudioSessionProvider({ children }: PropsWithChildren) {
  const [session, setSession, hydrated] = usePersistentState<StudioSession>(
    "bokang-industry-studio.session.v1",
    defaultSession
  );

  const updateSession = useCallback((patch: Partial<StudioSession>) => {
    setSession((current) => ({ ...current, ...patch }));
  }, [setSession]);

  const setConnection = useCallback((
    provider: "google" | "microsoft",
    connected: boolean,
    account?: string
  ) => {
    setSession((current) => ({
      ...current,
      connections: provider === "google"
        ? { ...current.connections, google: connected, googleAccount: connected ? account : undefined }
        : { ...current.connections, microsoft: connected, microsoftAccount: connected ? account : undefined },
    }));
  }, [setSession]);

  const value = useMemo(() => ({
    session,
    hydrated,
    updateSession,
    setConnection,
  }), [session, hydrated, updateSession, setConnection]);

  return (
    <StudioSessionContext.Provider value={value}>
      {children}
    </StudioSessionContext.Provider>
  );
}

export function useStudioSession() {
  const value = useContext(StudioSessionContext);
  if (!value) throw new Error("useStudioSession must be used inside StudioSessionProvider");
  return value;
}
