"use client";

import type { ProductConfig } from "@bokang/app-config";
import { recordAudit } from "../../lib/audit";

export function ProductReports({ config }: { config: ProductConfig }) {
  function downloadJson() {
    const payload = {
      product: config.name,
      sector: config.sector,
      generatedAt: new Date().toISOString(),
      dashboardMetrics: config.dashboardMetrics.map((label, index) => ({
        label,
        sampleValue: ["12", "8", "3", "5"][index] ?? "—",
      })),
      modules: config.modules,
      note: "Showcase export — sample/local data only",
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${config.slug}-showcase-report.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    recordAudit(config.slug, "Report export", "Downloaded JSON showcase report");
  }

  function printReport() {
    recordAudit(config.slug, "Report export", "Opened printable report");
    window.print();
  }

  return (
    <section style={{ marginTop: 24, background: config.experience.surface, border: "1px solid #e5e7eb", borderRadius: 22, padding: 20 }}>
      <p style={{ margin: 0, color: config.experience.accent, fontSize: 12, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1.2 }}>Reports & exports</p>
      <h2 style={{ marginBottom: 6 }}>{config.sector} workspace report</h2>
      <p style={{ marginTop: 0, color: "#667085", lineHeight: 1.6 }}>Export a machine-readable showcase snapshot or open the browser print workflow for a client-ready PDF.</p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button onClick={downloadJson} style={{ border: 0, background: config.experience.accent, color: "#fff", borderRadius: 11, padding: "10px 13px", fontWeight: 850 }}>Download JSON snapshot</button>
        <button onClick={printReport} style={{ border: "1px solid #d0d5dd", background: "#fff", borderRadius: 11, padding: "10px 13px", fontWeight: 850 }}>Print / Save PDF</button>
      </div>
    </section>
  );
}
