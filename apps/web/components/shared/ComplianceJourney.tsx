"use client";

import { useState } from "react";
import type { ProductConfig } from "@bokang/app-config";
import { usePersistentState } from "@bokang/persistence";

type Check = { id: string; label: string; complete: boolean; evidence?: string };

export function ComplianceJourney({ config }: { config: ProductConfig }) {
  const [checks, setChecks] = usePersistentState<Check[]>(
    `bokang-studio.${config.slug}.compliance.v1`,
    config.experience.compliance.map((label, index) => ({ id: String(index + 1), label, complete: false }))
  );
  const [idType, setIdType] = useState("National ID / Omang");
  const complete = checks.filter((item) => item.complete).length;

  return (
    <section style={{ marginTop: 24, background: config.experience.surface, border: "1px solid #e5e7eb", borderRadius: 22, padding: 20 }}>
      <p style={{ margin: 0, color: config.experience.accent, fontSize: 12, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1.3 }}>Compliance workspace</p>
      <h2 style={{ marginBottom: 6 }}>Structured verification, not fake automated KYC.</h2>
      <p style={{ color: "#667085", lineHeight: 1.6, marginTop: 0 }}>
        The showcase records identity/compliance steps and evidence. Biometric liveness or authoritative verification remains a replaceable production adapter.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(180px,260px) 1fr", gap: 12, alignItems: "start" }}>
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 15, padding: 14 }}>
          <div style={{ fontSize: 11, color: "#667085", fontWeight: 850 }}>Identity document</div>
          <select value={idType} onChange={(e) => setIdType(e.target.value)} style={{ width: "100%", marginTop: 7, border: "1px solid #d0d5dd", borderRadius: 10, padding: 9 }}>
            <option>National ID / Omang</option>
            <option>Passport</option>
            <option>Company registration</option>
            <option>Other approved document</option>
          </select>
          <div style={{ marginTop: 12, fontSize: 12, fontWeight: 850 }}>{complete}/{checks.length} checks complete</div>
        </div>
        <div style={{ display: "grid", gap: 8 }}>
          {checks.map((item) => (
            <label key={item.id} style={{ display: "flex", gap: 10, background: "#fff", border: "1px solid #e5e7eb", borderRadius: 13, padding: 11 }}>
              <input type="checkbox" checked={item.complete} onChange={(e) => setChecks((current) => current.map((x) => x.id === item.id ? { ...x, complete: e.target.checked } : x))} />
              <span>
                <strong style={{ fontSize: 13 }}>{item.label}</strong>
                <div style={{ color: "#98a2b3", fontSize: 11, marginTop: 2 }}>Manual review/evidence checkpoint</div>
              </span>
            </label>
          ))}
        </div>
      </div>
    </section>
  );
}
