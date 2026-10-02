"use client";

import { useMemo, useState } from "react";
import type { ProductConfig } from "@bokang/app-config";
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

export function WorkspaceDataShowcase({ config }: { config: ProductConfig }) {
  const [google, setGoogle] = useState(false);
  const [microsoft, setMicrosoft] = useState(false);
  const [storage, setStorage] = useState(initialStorage);
  const [snapshotAt, setSnapshotAt] = useState("Demo snapshot · just now");
  const [notice, setNotice] = useState("");

  const total = useMemo(
    () => storage.reduce((sum, item) => sum + item.mb, 0),
    [storage]
  );

  function cleanTemporaryFiles() {
    setStorage((current) =>
      current.map((item) =>
        item.label === "Temporary files" ? { ...item, items: 0, mb: 0 } : item
      )
    );
    setNotice("Temporary generated files cleared from this showcase snapshot.");
  }

  function refreshSnapshot() {
    setSnapshotAt(`Snapshot refreshed · ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`);
    setNotice("Storage snapshot refreshed.");
  }

  return (
    <section style={{ marginTop: 28, display: "grid", gap: 18 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 14 }}>
        <article style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 22, padding: 20 }}>
          <p style={{ color: "#2563eb", fontWeight: 850, fontSize: 12, textTransform: "uppercase", letterSpacing: 1.4 }}>
            Connected workspace
          </p>
          <h2 style={{ margin: "6px 0" }}>Use the client&apos;s own cloud.</h2>
          <p style={{ color: "#667085", lineHeight: 1.6 }}>
            {config.name} is prepared to keep long-lived business files in Google or Microsoft workspaces while the app coordinates workflow state.
          </p>

          <div style={{ display: "grid", gap: 10, marginTop: 16 }}>
            <button
              onClick={() => setGoogle((value) => !value)}
              style={{ border: "1px solid #d0d5dd", borderRadius: 14, padding: 14, background: google ? "#eff8ff" : "#fff", textAlign: "left" }}
            >
              <strong>{google ? "✓ " : ""}Google Workspace</strong>
              <div style={{ color: "#667085", fontSize: 12, marginTop: 4 }}>Drive · Gmail · Sheets</div>
            </button>
            <button
              onClick={() => setMicrosoft((value) => !value)}
              style={{ border: "1px solid #d0d5dd", borderRadius: 14, padding: 14, background: microsoft ? "#eff8ff" : "#fff", textAlign: "left" }}
            >
              <strong>{microsoft ? "✓ " : ""}Microsoft 365</strong>
              <div style={{ color: "#667085", fontSize: 12, marginTop: 4 }}>OneDrive · SharePoint · Excel · Outlook</div>
            </button>
          </div>

          <p style={{ color: "#98a2b3", fontSize: 11, lineHeight: 1.5, marginBottom: 0 }}>
            Showcase controls only. Production OAuth will request explicit user consent and support revocation.
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
          <span style={{ color: "#667085", fontSize: 12 }}>Recharts shared dashboard component</span>
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
