"use client";

import { useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const trend = [
  { label: "Mon", activity: 8 },
  { label: "Tue", activity: 14 },
  { label: "Wed", activity: 11 },
  { label: "Thu", activity: 19 },
  { label: "Fri", activity: 24 },
  { label: "Sat", activity: 17 },
  { label: "Sun", activity: 21 },
];

type Provider = "Google Workspace" | "Microsoft 365";

export function SharedWorkspaceTools({ productName }: { productName: string }) {
  const [connected, setConnected] = useState<Provider | null>(null);
  const [snapshotAt, setSnapshotAt] = useState("Today, 09:30");
  const [usedMb, setUsedMb] = useState(184);

  function refreshSnapshot() {
    setSnapshotAt("Just now");
    setUsedMb((value) => value + 3);
  }

  return (
    <section style={{ marginTop: 28, display: "grid", gap: 18 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(290px,1fr))", gap: 14 }}>
        <article style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 22, padding: 20 }}>
          <p style={{ margin: 0, color: "#2563eb", fontSize: 12, fontWeight: 850, textTransform: "uppercase", letterSpacing: 1.4 }}>Connected workspace</p>
          <h2 style={{ marginBottom: 8 }}>Use the customer's own data plane</h2>
          <p style={{ color: "#667085", lineHeight: 1.6 }}>
            {productName} is prepared to keep business files in a connected Google or Microsoft workspace rather than forcing every document into a new permanent database.
          </p>
          <div style={{ display: "grid", gap: 10, marginTop: 16 }}>
            {(["Google Workspace", "Microsoft 365"] as Provider[]).map((provider) => (
              <button
                key={provider}
                onClick={() => setConnected((current) => current === provider ? null : provider)}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  border: "1px solid #d0d5dd",
                  borderRadius: 14,
                  background: connected === provider ? "#eff6ff" : "#fff",
                  padding: "12px 14px",
                  fontWeight: 800,
                }}
              >
                <span>{provider}</span>
                <span style={{ color: connected === provider ? "#2563eb" : "#667085", fontSize: 12 }}>
                  {connected === provider ? "Connected" : "Connect"}
                </span>
              </button>
            ))}
          </div>
          <p style={{ color: "#98a2b3", fontSize: 11, lineHeight: 1.5 }}>
            Showcase connection state only. OAuth scopes and provider APIs will be bound in the integration phase.
          </p>
        </article>

        <article style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 22, padding: 20 }}>
          <p style={{ margin: 0, color: "#2563eb", fontSize: 12, fontWeight: 850, textTransform: "uppercase", letterSpacing: 1.4 }}>Storage snapshot</p>
          <h2 style={{ marginBottom: 8 }}>Know what the app is using</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: 10, marginTop: 16 }}>
            {[
              ["App storage", `${usedMb} MB`],
              ["Generated files", "37"],
              ["Archived records", "16"],
              ["Last snapshot", snapshotAt],
            ].map(([label, value]) => (
              <div key={label} style={{ border: "1px solid #e5e7eb", borderRadius: 14, padding: 13 }}>
                <div style={{ color: "#667085", fontSize: 11 }}>{label}</div>
                <strong style={{ display: "block", marginTop: 4 }}>{value}</strong>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
            <button onClick={refreshSnapshot} style={{ border: 0, borderRadius: 11, background: "#2563eb", color: "#fff", padding: "10px 13px", fontWeight: 800 }}>Refresh snapshot</button>
            <button style={{ border: "1px solid #d0d5dd", borderRadius: 11, background: "#fff", padding: "10px 13px", fontWeight: 800 }}>Review cleanup</button>
          </div>
        </article>
      </div>

      <article style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 22, padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "end", flexWrap: "wrap" }}>
          <div>
            <p style={{ margin: 0, color: "#2563eb", fontSize: 12, fontWeight: 850, textTransform: "uppercase", letterSpacing: 1.4 }}>Dashboard capability</p>
            <h2 style={{ marginBottom: 0 }}>7-day workspace activity</h2>
          </div>
          <span style={{ color: "#667085", fontSize: 12 }}>Recharts shared analytics component</span>
        </div>
        <div style={{ width: "100%", height: 240, marginTop: 18 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} width={28} />
              <Tooltip />
              <Line type="monotone" dataKey="activity" stroke="currentColor" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </article>
    </section>
  );
}
