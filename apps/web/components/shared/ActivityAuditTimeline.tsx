"use client";

import { useEffect, useState } from "react";
import type { ProductConfig } from "@bokang/app-config";
import { auditKey, readAudit, recordAudit, type AuditEvent } from "../../lib/audit";

export function ActivityAuditTimeline({ config }: { config: ProductConfig }) {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [note, setNote] = useState("");

  useEffect(() => {
    setEvents(readAudit(config.slug));
    const handler = (event: Event) => {
      const custom = event as CustomEvent<{ productSlug: string }>;
      if (custom.detail?.productSlug === config.slug) setEvents(readAudit(config.slug));
    };
    window.addEventListener("bokang-studio:audit", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("bokang-studio:audit", handler);
      window.removeEventListener("storage", handler);
    };
  }, [config.slug]);

  function addNote() {
    if (!note.trim()) return;
    recordAudit(config.slug, "Operator note", note.trim());
    setNote("");
  }

  function clear() {
    window.localStorage.removeItem(auditKey(config.slug));
    setEvents([]);
  }

  return (
    <section style={{ marginTop: 24, background: "#fff", border: "1px solid #e5e7eb", borderRadius: 22, padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", alignItems: "end" }}>
        <div>
          <p style={{ margin: 0, color: config.experience.accent, fontSize: 12, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1.2 }}>Activity & audit</p>
          <h2 style={{ marginBottom: 6 }}>What changed and when</h2>
          <p style={{ margin: 0, color: "#667085", fontSize: 13 }}>Local showcase audit trail; production can later bind this contract to an authoritative event store.</p>
        </div>
        {events.length ? <button onClick={clear} style={{ border: "1px solid #d0d5dd", background: "#fff", borderRadius: 10, padding: "8px 10px", fontWeight: 800 }}>Clear demo trail</button> : null}
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
        <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add an operator note…" style={{ flex: 1, minWidth: 0, border: "1px solid #d0d5dd", borderRadius: 11, padding: 10 }} />
        <button onClick={addNote} style={{ border: 0, background: config.experience.accent, color: "#fff", borderRadius: 11, padding: "9px 12px", fontWeight: 850 }}>Add note</button>
      </div>

      <div style={{ display: "grid", gap: 8, marginTop: 14 }}>
        {events.length === 0 ? (
          <div style={{ border: "1px dashed #d0d5dd", borderRadius: 13, padding: 18, color: "#667085", textAlign: "center" }}>No recorded activity yet.</div>
        ) : events.slice(0, 20).map((event) => (
          <div key={event.id} style={{ display: "grid", gridTemplateColumns: "10px minmax(0,1fr)", gap: 10 }}>
            <div style={{ width: 9, height: 9, borderRadius: 999, background: config.experience.accent, marginTop: 6 }} />
            <div style={{ borderBottom: "1px solid #eef2f6", paddingBottom: 10 }}>
              <strong style={{ fontSize: 13 }}>{event.action}</strong>
              <div style={{ color: "#475467", fontSize: 12, marginTop: 3 }}>{event.detail}</div>
              <div style={{ color: "#98a2b3", fontSize: 10, marginTop: 4 }}>{event.actor} · {new Date(event.at).toLocaleString()}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
