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

export function usePersistentState<T>(
  key: string,
  initialValue: T
): [T, Dispatch<SetStateAction<T>>, boolean] {
  const [value, setValue] = useState<T>(initialValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) setValue(JSON.parse(raw) as T);
    } catch {
      // Keep the safe starter value when browser storage is unavailable or malformed.
    } finally {
      setHydrated(true);
    }
  }, [key]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage quota/private mode should not make the UI unusable.
    }
  }, [hydrated, key, value]);

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
