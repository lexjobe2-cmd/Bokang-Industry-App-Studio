"use client";

import { useEffect, useState } from "react";
import type { ProductConfig } from "@bokang/app-config";
import { usePersistentState, useStudioSession } from "@bokang/persistence";

type Member = {
  id: string;
  name: string;
  email: string;
  role: "Owner" | "Admin" | "Member";
  status: "Active" | "Invited";
};

type Preferences = {
  emailNotifications: boolean;
  workflowReminders: boolean;
  storageWarnings: boolean;
  weeklyDigest: boolean;
};

type CoordinationHealth = {
  configured: boolean;
  healthy: boolean;
  mode: "redis" | "local-only";
};

const starterMembers: Member[] = [
  { id: "member-owner", name: "Bokang Jobe", email: "", role: "Owner", status: "Active" },
];

export function AdminWorkspacePanel({ config }: { config: ProductConfig }) {
  const { session, updateSession } = useStudioSession();
  const [members, setMembers] = usePersistentState<Member[]>(
    `bokang-studio.${config.slug}.members.v1`,
    starterMembers
  );
  const [preferences, setPreferences] = usePersistentState<Preferences>(
    `bokang-studio.${config.slug}.preferences.v1`,
    {
      emailNotifications: true,
      workflowReminders: true,
      storageWarnings: true,
      weeklyDigest: false,
    }
  );
  const [inviteEmail, setInviteEmail] = useState("");
  const [coordination, setCoordination] = useState<CoordinationHealth | null>(null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    fetch("/api/coordination/health", { cache: "no-store" })
      .then((response) => response.json() as Promise<CoordinationHealth>)
      .then(setCoordination)
      .catch(() => setCoordination({ configured: false, healthy: false, mode: "local-only" }));
  }, []);

  function inviteMember() {
    const email = inviteEmail.trim();
    if (!email || !email.includes("@")) {
      setNotice("Enter a valid email address.");
      return;
    }
    if (members.some((member) => member.email.toLowerCase() === email.toLowerCase())) {
      setNotice("That person is already in the workspace.");
      return;
    }

    setMembers((current) => [
      ...current,
      {
        id: `member-${Date.now()}`,
        name: email.split("@")[0] || "Invited member",
        email,
        role: "Member",
        status: "Invited",
      },
    ]);
    setInviteEmail("");
    setNotice("Invitation added to the workspace queue.");
  }

  return (
    <div style={{ display: "grid", gap: 18 }}>
      <section style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 22, padding: 20 }}>
        <p style={{ margin: 0, color: "#2563eb", fontSize: 12, fontWeight: 850, textTransform: "uppercase", letterSpacing: 1.4 }}>
          Workspace identity
        </p>
        <h2 style={{ marginBottom: 8 }}>{config.name} admin</h2>
        <p style={{ color: "#667085", lineHeight: 1.6 }}>
          Shared account and workspace settings are reused across every industry frontend.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 12 }}>
          <label style={{ display: "grid", gap: 6, fontSize: 12, fontWeight: 800 }}>
            Display name
            <input
              value={session.displayName}
              onChange={(event) => updateSession({ displayName: event.target.value })}
              style={{ border: "1px solid #d0d5dd", borderRadius: 12, padding: 11 }}
            />
          </label>
          <label style={{ display: "grid", gap: 6, fontSize: 12, fontWeight: 800 }}>
            Workspace name
            <input
              value={session.workspaceName}
              onChange={(event) => updateSession({ workspaceName: event.target.value })}
              style={{ border: "1px solid #d0d5dd", borderRadius: 12, padding: 11 }}
            />
          </label>
          <label style={{ display: "grid", gap: 6, fontSize: 12, fontWeight: 800 }}>
            Email
            <input
              value={session.email}
              type="email"
              onChange={(event) => updateSession({ email: event.target.value })}
              placeholder="owner@company.com"
              style={{ border: "1px solid #d0d5dd", borderRadius: 12, padding: 11 }}
            />
          </label>
        </div>
      </section>

      <section style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 22, padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "end", flexWrap: "wrap" }}>
          <div>
            <p style={{ margin: 0, color: "#2563eb", fontSize: 12, fontWeight: 850, textTransform: "uppercase", letterSpacing: 1.4 }}>
              Members & roles
            </p>
            <h2 style={{ marginBottom: 0 }}>Workspace access</h2>
          </div>
          <span style={{ color: "#667085", fontSize: 12 }}>{members.length} member records</span>
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
          <input
            value={inviteEmail}
            onChange={(event) => setInviteEmail(event.target.value)}
            placeholder="teammate@company.com"
            style={{ flex: "1 1 240px", border: "1px solid #d0d5dd", borderRadius: 12, padding: 11 }}
          />
          <button onClick={inviteMember} style={{ border: 0, borderRadius: 12, padding: "11px 16px", background: "#2563eb", color: "#fff", fontWeight: 850 }}>
            Invite member
          </button>
        </div>

        <div style={{ marginTop: 14, display: "grid", gap: 8 }}>
          {members.map((member) => (
            <div key={member.id} style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) auto auto", gap: 10, alignItems: "center", border: "1px solid #e5e7eb", borderRadius: 14, padding: 12 }}>
              <div style={{ minWidth: 0 }}>
                <strong>{member.name}</strong>
                <div style={{ color: "#667085", fontSize: 11, overflow: "hidden", textOverflow: "ellipsis" }}>{member.email || "Owner profile"}</div>
              </div>
              <select
                value={member.role}
                disabled={member.id === "member-owner"}
                onChange={(event) => setMembers((current) => current.map((item) =>
                  item.id === member.id ? { ...item, role: event.target.value as Member["role"] } : item
                ))}
                style={{ border: "1px solid #d0d5dd", borderRadius: 10, padding: "7px 9px" }}
              >
                <option>Owner</option>
                <option>Admin</option>
                <option>Member</option>
              </select>
              <span style={{ fontSize: 11, fontWeight: 800, color: member.status === "Active" ? "#027a48" : "#b54708" }}>
                {member.status}
              </span>
            </div>
          ))}
        </div>
        {notice ? <div style={{ marginTop: 10, color: "#175cd3", fontSize: 12, fontWeight: 750 }}>{notice}</div> : null}
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 14 }}>
        <article style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 22, padding: 20 }}>
          <p style={{ margin: 0, color: "#2563eb", fontSize: 12, fontWeight: 850, textTransform: "uppercase", letterSpacing: 1.4 }}>
            Notifications
          </p>
          <h2>Workspace preferences</h2>
          {([
            ["emailNotifications", "Email notifications"],
            ["workflowReminders", "Workflow reminders"],
            ["storageWarnings", "Storage warnings"],
            ["weeklyDigest", "Weekly digest"],
          ] as const).map(([key, label]) => (
            <label key={key} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "10px 0", borderBottom: "1px solid #f0f2f5" }}>
              <span>{label}</span>
              <input
                type="checkbox"
                checked={preferences[key]}
                onChange={(event) => setPreferences((current) => ({ ...current, [key]: event.target.checked }))}
              />
            </label>
          ))}
        </article>

        <article style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 22, padding: 20 }}>
          <p style={{ margin: 0, color: "#2563eb", fontSize: 12, fontWeight: 850, textTransform: "uppercase", letterSpacing: 1.4 }}>
            Platform health
          </p>
          <h2>Coordination & data plane</h2>
          <div style={{ display: "grid", gap: 10 }}>
            <div style={{ border: "1px solid #e5e7eb", borderRadius: 14, padding: 12 }}>
              <strong>Redis coordination</strong>
              <div style={{ color: "#667085", fontSize: 12, marginTop: 4 }}>
                {coordination === null
                  ? "Checking…"
                  : coordination.configured
                    ? coordination.healthy ? "Configured · healthy" : "Configured · unavailable"
                    : "Not configured · local-only mode"}
              </div>
            </div>
            <div style={{ border: "1px solid #e5e7eb", borderRadius: 14, padding: 12 }}>
              <strong>Google Workspace</strong>
              <div style={{ color: "#667085", fontSize: 12, marginTop: 4 }}>
                {session.connections.google ? session.connections.googleAccount || "Connected" : "Not connected"}
              </div>
            </div>
            <div style={{ border: "1px solid #e5e7eb", borderRadius: 14, padding: 12 }}>
              <strong>Microsoft 365</strong>
              <div style={{ color: "#667085", fontSize: 12, marginTop: 4 }}>
                {session.connections.microsoft ? session.connections.microsoftAccount || "Connected" : "Not connected"}
              </div>
            </div>
          </div>
        </article>
      </section>

      <section style={{ background: "#fff", border: "1px solid #fecaca", borderRadius: 22, padding: 20 }}>
        <p style={{ margin: 0, color: "#b42318", fontSize: 12, fontWeight: 850, textTransform: "uppercase", letterSpacing: 1.4 }}>
          Data controls
        </p>
        <h2>Export, revoke and delete deliberately.</h2>
        <p style={{ color: "#667085", lineHeight: 1.6 }}>
          Production account deletion must revoke provider access, remove app-owned coordination state and preserve user-owned files unless the user explicitly selects those files for deletion.
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button style={{ border: "1px solid #d0d5dd", background: "#fff", borderRadius: 11, padding: "9px 12px", fontWeight: 800 }}>Export workspace settings</button>
          <button style={{ border: "1px solid #fda29b", background: "#fff", color: "#b42318", borderRadius: 11, padding: "9px 12px", fontWeight: 800 }}>Review account deletion</button>
        </div>
      </section>
    </div>
  );
}
