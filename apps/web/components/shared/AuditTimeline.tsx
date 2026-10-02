"use client";

import { useEffect } from "react";
import type { ProductConfig } from "@bokang/app-config";
import { usePersistentState } from "@bokang/persistence";

type AuditItem = { id: string; at: string; action: string; detail: string };

export function AuditTimeline({ config }: { config: ProductConfig }) {
  const [items, setItems] = usePersistentState<AuditItem[]>(
    `bokang-studio.${config.slug}.audit.v1`,
    [{ id: "created", at: new Date().toISOString(), action: "Workspace initialised", detail: config.name + " showcase state created" }]
  );

  useEffect(() => {
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<{ product?: string; action?: string; detail?: string }>).detail;
      if (detail.product && detail.product !== config.slug) return;
      if (!detail.action) return;
      setItems((current) => [{ id: `audit-${Date.now()}`, at: new Date().toISOString(), action: detail.action || "Activity", detail: detail.detail || "" }, ...current].slice(0, 100));
    };
    window.addEventListener("studio-audit", handler);
    return () => window.removeEventListener("studio-audit", handler);
  }, [config.slug, setItems]);

  return (
    <section style={{ marginTop: 24, background: "#fff", border: "1px solid #e5e7eb", borderRadius: 20, padding: 16 }}>
      <p style={{ margin: 0, color: config.experience.accent, fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1.2 }}>Audit timeline</p>
      <h2 style={{ marginBottom: 10 }}>Recent workspace activity</h2>
      <div style={{ display: "grid", gap: 8 }}>
        {items.slice(0, 8).map((item) => (
          <div key={item.id} style={{ display: "grid", gridTemplateColumns: "120px minmax(0,1fr)", gap: 10, borderBottom: "1px solid #f0f2f5", paddingBottom: 8 }}>
            <span style={{ color: "#98a2b3", fontSize: 10 }}>{new Date(item.at).toLocaleString()}</span>
            <div><strong style={{ fontSize: 12 }}>{item.action}</strong><div style={{ color: "#667085", fontSize: 11, marginTop: 2 }}>{item.detail}</div></div>
          </div>
        ))}
      </div>
    </section>
  );
}
