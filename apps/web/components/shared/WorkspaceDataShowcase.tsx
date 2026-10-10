"use client";

import { useEffect, useMemo, useState } from "react";
import type { ProductConfig } from "@bokang/app-config";
import { usePersistentState, useStudioSession } from "@bokang/persistence";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const activity = [
  { label: "Mon", records: 14 },
  { label: "Tue", records: 22 },
  { label: "Wed", records: 18 },
  { label: "Thu", records: 31 },
  { label: "Fri", records: 27 },
  { label: "Sat", records: 12 },
  { label: "Sun", records: 16 },
];

const initialStorage = [
  { label: "Documents", items: 186, mb: 742 },
  { label: "Exports", items: 42, mb: 118 },
  { label: "Generated reports", items: 64, mb: 206 },
  { label: "Temporary files", items: 29, mb: 91 },
];

type OAuthStatus = {
  google: { connected: boolean; accountLabel?: string };
  microsoft: { connected: boolean; accountLabel?: string };
};

export function WorkspaceDataShowcase({ config }: { config: ProductConfig }) {
  const { session, setConnection } = useStudioSession();
  const [storage, setStorage] = usePersistentState(
    `bokang-studio.${config.slug}.storage.v1`,
    initialStorage
  );
  const [snapshotAt, setSnapshotAt] = usePersistentState(
    `bokang-studio.${config.slug}.snapshot-at.v1`,
    "Demo snapshot · just now"
  );
  const [notice, setNotice] = useState("");
  const [checkingConnections, setCheckingConnections] = useState(true);

  useEffect(() => {
    let active = true;
    fetch("/api/oauth/status", { cache: "no-store" })
      .then((response) => response.ok ? response.json() as Promise<OAuthStatus> : Promise.reject())
      .then((status) => {
        if (!active) return;
        setConnection("google", status.google.connected, status.google.accountLabel);
        setConnection("microsoft", status.microsoft.connected, status.microsoft.accountLabel);
      })
      .catch(() => undefined)
      .finally(() => {
        if (active) setCheckingConnections(false);
      });
    return () => { active = false; };
  }, [setConnection]);

  const total = useMemo(
    () => storage.reduce((sum, item) => sum + item.mb, 0),
    [storage]
  );

  function connect(provider: "google" | "microsoft") {
    const returnTo = window.location.pathname;
    window.location.assign(`/api/oauth/${provider}/start?returnTo=${encodeURIComponent(returnTo)}`);
  }

  async function disconnect(provider: "google" | "microsoft") {
    const response = await fetch(`/api/oauth/${provider}/disconnect`, { method: "POST" });
    if (!response.ok) {
      setNotice("Could not disconnect the provider right now.");
      return;
    }
    setConnection(provider, false);
    setNotice(`${provider === "google" ? "Google Workspace" : "Microsoft 365"} disconnected.`);
  }

  function cleanTemporaryFiles() {
    setStorage((current) =>
      current.map((item) =>
        item.label === "Temporary files" ? { ...item, items: 0, mb: 0 } : item
      )
    );
    setNotice("Temporary generated files cleared from this persisted snapshot.");
  }

  function refreshSnapshot() {
    setSnapshotAt(
      `Snapshot refreshed · ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
    );
    setNotice("Storage snapshot refreshed and retained locally for this product.");
  }

  const providers = [
    {
      id: "google" as const,
      name: "Google Workspace",
      detail: "Drive · Gmail · Sheets",
      connected: session.connections.google,
      account: session.connections.googleAccount,
    },
    {
      id: "microsoft" as const,
      name: "Microsoft 365",
      detail: "OneDrive · SharePoint-ready files · Excel · Outlook",
      connected: session.connections.microsoft,
      account: session.connections.microsoftAccount,
    },
  ];

  return (
    <section style={{ marginTop: 28, display: "grid", gap: 18 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 14 }}>
        <article style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 22, padding: 20 }}>
          <p style={{ color: "#2563eb", fontWeight: 850, fontSize: 12, textTransform: "uppercase", letterSpacing: 1.4 }}>
            Connected workspace
          </p>
          <h2 style={{ margin: "6px 0" }}>Use the client&apos;s own cloud.</h2>
          <p style={{ color: "#667085", lineHeight: 1.6 }}>
            {config.name} keeps long-lived business files in a user-authorized Google or Microsoft workspace where practical. Provider tokens remain server-only.
          </p>

          <div style={{ display: "grid", gap: 10, marginTop: 16 }}>
            {providers.map((provider) => (
              <div key={provider.id} style={{
                border: "1px solid #d0d5dd",
                borderRadius: 14,
                padding: 14,
                background: provider.connected ? "#eff8ff" : "#fff",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                  <div>
                    <strong>{provider.connected ? "✓ " : ""}{provider.name}</strong>
                    <div style={{ color: "#667085", fontSize: 12, marginTop: 4 }}>
                      {provider.account || provider.detail}
                    </div>
                  </div>
                  {provider.connected ? (
                    <button onClick={() => void disconnect(provider.id)} style={{ border: "1px solid #d0d5dd", background: "#fff", borderRadius: 10, padding: "8px 10px", fontWeight: 800 }}>
                      Disconnect
                    </button>
                  ) : (
                    <button disabled={checkingConnections} onClick={() => connect(provider.id)} style={{ border: 0, background: "#2563eb", color: "#fff", borderRadius: 10, padding: "8px 11px", fontWeight: 800, opacity: checkingConnections ? 0.55 : 1 }}>
                      {checkingConnections ? "Checking…" : "Connect"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <p style={{ color: "#98a2b3", fontSize: 11, lineHeight: 1.5, marginBottom: 0 }}>
            OAuth requests explicit consent. Connections can be revoked here without deleting the user&apos;s own files.
          </p>
        </article>

        <article style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 22, padding: 20 }}>
          <p style={{ color: "#2563eb", fontWeight: 850, fontSize: 12, textTransform: "uppercase", letterSpacing: 1.4 }}>
            Storage & snapshots
          </p>
          <div style={{ display: "flex", alignItems: "end", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div>
              <h2 style={{ margin: "6px 0 0" }}>{(total / 1024).toFixed(2)} GB tracked</h2>
              <div style={{ color: "#667085", fontSize: 12 }}>{snapshotAt}</div>
            </div>
            <button onClick={refreshSnapshot} style={{ border: "1px solid #d0d5dd", background: "#fff", borderRadius: 11, padding: "8px 11px", fontWeight: 800 }}>
              ↻ Refresh snapshot
            </button>
          </div>

          <div style={{ display: "grid", gap: 9, marginTop: 16 }}>
            {storage.map((item) => (
              <div key={item.label} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 12, padding: "9px 0", borderBottom: "1px solid #f0f2f5" }}>
                <div>
                  <strong style={{ fontSize: 13 }}>{item.label}</strong>
                  <div style={{ color: "#98a2b3", fontSize: 11 }}>{item.items} items</div>
                </div>
                <strong>{item.mb} MB</strong>
              </div>
            ))}
          </div>

          <button onClick={cleanTemporaryFiles} style={{ marginTop: 14, border: 0, background: "#101827", color: "#fff", borderRadius: 12, padding: "10px 14px", fontWeight: 850 }}>
            Clean temporary files
          </button>
          {notice ? <div style={{ marginTop: 10, color: "#027a48", fontSize: 12, fontWeight: 750 }}>{notice}</div> : null}
        </article>
      </div>

      <article style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 22, padding: 20 }}>
        <div style={{ display: "flex", alignItems: "end", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div>
            <p style={{ color: "#2563eb", fontWeight: 850, fontSize: 12, textTransform: "uppercase", letterSpacing: 1.4, margin: 0 }}>
              Activity analytics
            </p>
            <h2 style={{ margin: "6px 0 0" }}>Workspace activity this week</h2>
          </div>
          <span style={{ color: "#667085", fontSize: 12 }}>Shared Recharts dashboard component</span>
        </div>
        <div style={{ width: "100%", height: 260, marginTop: 16 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={activity}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="records" stroke="#2563eb" fill="#dbeafe" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </article>
    </section>
  );
}
