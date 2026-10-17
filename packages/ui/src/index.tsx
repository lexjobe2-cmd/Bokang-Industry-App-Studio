"use client";

import type { ReactNode } from "react";
import type { ProductConfig } from "@bokang/app-config";
import { BarChart3, Bell, FolderKanban, Home, Menu, Search } from "lucide-react";

export function MetricCard({ label, value, detail }: { label: string; value: string; detail?: string }) {
  return (
    <article style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 18, padding: 18 }}>
      <div style={{ fontSize: 13, color: "#667085", fontWeight: 700 }}>{label}</div>
      <div style={{ fontSize: 30, fontWeight: 850, marginTop: 8 }}>{value}</div>
      {detail ? <div style={{ color: "#98a2b3", fontSize: 12, marginTop: 4 }}>{detail}</div> : null}
    </article>
  );
}

export function DashboardGrid({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 14 }}>
      {children}
    </div>
  );
}

export function ProductShell({ config, children }: { config: ProductConfig; children: ReactNode }) {
  return (
    <div className="studio-grid">
      <aside className="desktop-nav" style={{ borderRight: "1px solid #e5e7eb", background: config.experience.surface, padding: 22 }}>
        <div style={{ fontWeight: 900, fontSize: 20 }}>{config.name}</div>
        <div style={{ color: "#667085", fontSize: 12, marginTop: 4 }}>{config.sector}</div>
        <div style={{ color: config.experience.accent, fontSize: 11, marginTop: 8, fontWeight: 850 }}>{config.experience.mood}</div>

        <nav style={{ display: "grid", gap: 8, marginTop: 34 }}>
          {config.tabs.map((tab, index) => (
            <button key={tab} style={{
              display: "flex", gap: 10, alignItems: "center", border: 0, borderRadius: 12,
              padding: "11px 12px", background: index === 0 ? "#fff" : "transparent",
              color: index === 0 ? config.experience.accent : "#475467", fontWeight: 750, cursor: "pointer"
            }}>
              {index === 0 ? <Home size={18}/> : index === 1 ? <Search size={18}/> : index === 2 ? <FolderKanban size={18}/> : index === 3 ? <BarChart3 size={18}/> : <Menu size={18}/>}
              {tab}
            </button>
          ))}
        </nav>

        <div style={{ position: "absolute", bottom: 22, color: "#98a2b3", fontSize: 11 }}>
          Designed &amp; developed by Bokang Jobe
        </div>
      </aside>

      <div>
        <header style={{
          minHeight: 68, display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "0 24px", borderBottom: "1px solid #e5e7eb", background: "#fff"
        }}>
          <div>
            <strong>{config.name}</strong>
            <div style={{ color: "#667085", fontSize: 12 }}>{config.experience.hero}</div>
          </div>
          <button aria-label="Notifications" style={{ border: "1px solid #e5e7eb", background: "#fff", borderRadius: 12, padding: 9 }}>
            <Bell size={18}/>
          </button>
        </header>
        {children}
      </div>

      <nav className="mobile-tabs">
        {config.tabs.map((tab, index) => (
          <button key={tab} style={{ border: 0, background: "transparent", display: "grid", justifyItems: "center", gap: 3, fontSize: 10, fontWeight: 750 }}>
            {index === 0 ? <Home size={21}/> : index === 1 ? <Search size={21}/> : index === 2 ? <FolderKanban size={21}/> : index === 3 ? <BarChart3 size={21}/> : <Menu size={21}/>}
            <span>{tab}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

export function ChoiceChips({
  options,
  active,
  onChange
}: {
  options: readonly string[];
  active?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onChange?.(option)}
          style={{
            border: "1px solid #d0d5dd",
            background: active === option ? "#eff6ff" : "#fff",
            color: active === option ? "#2563eb" : "#344054",
            borderRadius: 999,
            padding: "8px 12px",
            fontWeight: 700
          }}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
