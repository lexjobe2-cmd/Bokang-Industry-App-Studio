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
  useSyncExternalStore,
} from "react";

import {
  getLocalValue,subscribeLocalValue,writeLocalValue,subscribeLocalStatus,getLocalStatuses
} from "./local-store.ts";
export {
  MOVE_TRACK_STORAGE_PREFIX,makeWorkspaceBackup,parseWorkspaceBackup,restoreWorkspaceBackup,
  clearWorkspaceData,getLocalHealth
} from "./local-store.ts";
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

/**
 * Durable browser-local hook. Writes synchronously before notifying React,
 * so navigation does not lose changes waiting for an effect.
 * Existing storage keys and shape remain compatible with prior demo records.
 */
export function usePersistentState<T>(
 key:string,initialValue:T
):[T,Dispatch<SetStateAction<T>>,boolean]{
 const scope=useContext(PersistenceScopeContext);
 const scopedKey=scope?`${scope}::${key}`:key;
 const subscribe=useCallback((listener:()=>void)=>subscribeLocalValue(scopedKey,listener),[scopedKey]);
 const getSnapshot=useCallback(()=>getLocalValue(scopedKey,initialValue),[scopedKey,initialValue]);
 const getServerSnapshot=useCallback(()=>initialValue,[initialValue]);
 const value=useSyncExternalStore(subscribe,getSnapshot,getServerSnapshot);
 const [activeKey,setActiveKey]=useState("");
 useEffect(()=>setActiveKey(scopedKey),[scopedKey]);
 const setter=useCallback<Dispatch<SetStateAction<T>>>((next)=>{
  const current=getLocalValue(scopedKey,initialValue);
  const resolved=typeof next==="function"?(next as (prev:T)=>T)(current):next;
  writeLocalValue(scopedKey,resolved);
 },[scopedKey,initialValue]);
 return [value,setter,activeKey===scopedKey];
}
/** Minimal health state for showing when localStorage is blocked or full. */
export function useLocalStorageErrors(){
 const subscribe=useCallback((listener:()=>void)=>subscribeLocalStatus(listener),[]);
 const getSnapshot=useCallback(()=>Array.from(getLocalStatuses()).filter(([,v])=>v.status!=="ready").map(([key,v])=>key+": "+(v.error??v.status)).join("\n"),[]);
 return useSyncExternalStore(subscribe,getSnapshot,()=>"");
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
