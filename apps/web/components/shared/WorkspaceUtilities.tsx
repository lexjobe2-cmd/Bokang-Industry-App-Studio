"use client";

import { useEffect, useMemo, useState } from "react";
import type { ProductConfig } from "@bokang/app-config";
import { usePersistentState } from "@bokang/persistence";
import { Bell, Download, Moon, Search, Sun, X } from "lucide-react";

type WorkspaceRole = "Operator" | "Manager" | "Viewer";
type NotificationItem = { id: string; title: string; detail: string; read: boolean };

export function WorkspaceUtilities({ config }: { config: ProductConfig }) {
  const [role, setRole] = usePersistentState<WorkspaceRole>(`bokang-studio.${config.slug}.role.v1`, "Manager");
  const [dark, setDark] = usePersistentState(`bokang-studio.${config.slug}.dark.v1`, false);
  const [palette, setPalette] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [notifications, setNotifications] = usePersistentState<NotificationItem[]>(
    `bokang-studio.${config.slug}.notifications.v1`,
    [
      { id: "n1", title: "Showcase ready", detail: config.name + " is available for client preview.", read: false },
      { id: "n2", title: "Review setup", detail: "Check onboarding, files and compliance before presenting.", read: false },
    ]
  );

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
  }, [dark]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPalette((current) => !current);
      }
      if (event.key === "Escape") setPalette(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const commands = useMemo(() => [
    { label: "Open onboarding", href: `/products/${config.slug}/onboarding`, group: "Workspace" },
    { label: "Open admin & settings", href: `/products/${config.slug}/admin`, group: "Workspace" },
    { label: "Open client demo", href: `/demo/${config.slug}`, group: "Showcase" },
    ...config.modules.map((module) => ({ label: module, href: `/products/${config.slug}#${module.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`, group: "Module" })),
  ], [config]);

  const filtered = commands.filter((command) => command.label.toLowerCase().includes(query.trim().toLowerCase()));
  const unread = notifications.filter((item) => !item.read).length;

  function exportReport() {
    const payload = {
      generatedAt: new Date().toISOString(),
      product: config.name,
      sector: config.sector,
      role,
      modules: config.modules,
      metrics: config.dashboardMetrics,
      signatureFeatures: config.experience.signatureFeatures,
      compliance: config.experience.compliance,
      note: "Showcase configuration export. No connected production data included.",
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${config.slug}-showcase-report.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <section style={{ marginTop: 18, display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <select value={role} onChange={(event) => setRole(event.target.value as WorkspaceRole)} style={controlStyle} aria-label="Workspace role view">
          <option>Operator</option>
          <option>Manager</option>
          <option>Viewer</option>
        </select>
        <button onClick={() => setPalette(true)} style={controlStyle}><Search size={14}/> Command <kbd style={{ fontSize: 10 }}>⌘K</kbd></button>
        <button onClick={() => setNotificationsOpen((current) => !current)} style={controlStyle}><Bell size={14}/> Notifications {unread ? `(${unread})` : ""}</button>
        <button onClick={() => setDark((current) => !current)} style={controlStyle}>{dark ? <Sun size={14}/> : <Moon size={14}/>} {dark ? "Light" : "Dark"}</button>
        <button onClick={exportReport} style={controlStyle}><Download size={14}/> Export report</button>
        <span style={{ marginLeft: "auto", color: "#667085", fontSize: 11, fontWeight: 800 }}>{role} view</span>
      </section>

      {notificationsOpen ? (
        <div style={{ marginTop: 10, background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 12, display: "grid", gap: 8 }}>
          {notifications.map((item) => (
            <button key={item.id} onClick={() => setNotifications((current) => current.map((notice) => notice.id === item.id ? { ...notice, read: true } : notice))} style={{ border: "1px solid #e5e7eb", background: item.read ? "#fff" : config.experience.surface, borderRadius: 12, padding: 10, textAlign: "left" }}>
              <strong style={{ fontSize: 12 }}>{item.title}</strong>
              <div style={{ color: "#667085", fontSize: 11, marginTop: 2 }}>{item.detail}</div>
            </button>
          ))}
        </div>
      ) : null}

      {palette ? (
        <div role="dialog" aria-modal="true" style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(15,23,42,.45)", display: "grid", placeItems: "start center", paddingTop: "12vh" }}>
          <div style={{ width: "min(680px,92vw)", background: "#fff", borderRadius: 20, boxShadow: "0 24px 80px rgba(15,23,42,.25)", overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9, padding: 14, borderBottom: "1px solid #e5e7eb" }}>
              <Search size={18}/>
              <input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder={"Search " + config.name + " commands and modules"} style={{ flex: 1, border: 0, outline: 0, font: "inherit" }}/>
              <button onClick={() => setPalette(false)} aria-label="Close command palette" style={{ border: 0, background: "transparent" }}><X size={18}/></button>
            </div>
            <div style={{ maxHeight: 420, overflow: "auto", padding: 8 }}>
              {filtered.map((command) => (
                <a key={command.group + command.label} href={command.href} onClick={() => setPalette(false)} style={{ display: "flex", justifyContent: "space-between", gap: 10, borderRadius: 12, padding: "10px 11px" }}>
                  <span style={{ fontWeight: 800, fontSize: 13 }}>{command.label}</span>
                  <span style={{ color: "#98a2b3", fontSize: 10, textTransform: "uppercase" }}>{command.group}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

const controlStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  border: "1px solid #d0d5dd",
  background: "#fff",
  borderRadius: 10,
  padding: "8px 10px",
  fontSize: 11,
  fontWeight: 800,
};
